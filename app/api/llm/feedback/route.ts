/**
 * POST /api/llm/feedback
 * フィードバック生成（LLM呼び出し）
 */

import { createClient } from '@/lib/supabase/server';
import { generateFeedback } from '@/lib/llm/prompts/writing_feedback';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function POST(request: Request): Promise<Response> {
  console.log('[LLM Feedback API] Starting feedback generation...');
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[LLM Feedback API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[LLM Feedback API] User authenticated:', user.email);

    const requestBody = await request.json();
    console.log('[LLM Feedback API] Request body received:', {
      attempt_id: requestBody.attempt_id,
      task_id: requestBody.task_id,
      level: requestBody.level,
      user_response_text_length: requestBody.user_response_text?.length || 0,
    });

    const {
      attempt_id,
      task_id,
      user_response_text,
      level,
    }: {
      attempt_id: string;
      task_id: string;
      user_response_text: string;
      level: 'beginner' | 'intermediate' | 'advanced';
    } = requestBody;

    if (!attempt_id || !task_id || !user_response_text || !level) {
      console.error('[LLM Feedback API] Missing required fields:', {
        attempt_id: !!attempt_id,
        task_id: !!task_id,
        user_response_text: !!user_response_text,
        level: !!level,
      });
      return Response.json(
        errorResponse('BAD_REQUEST', 'Missing required fields'),
        { status: 400 }
      );
    }

    // Attempt取得（穴埋め結果を取得するため）
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', attempt_id)
      .eq('user_id', user.id)
      .single();

    if (attemptError || !attempt) {
      console.error('[LLM Feedback API] Attempt not found:', attemptError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    // 既存のフィードバックをチェック（キャッシュ）
    const { data: existingFeedback } = await supabase
      .from('feedbacks')
      .select('id, metadata')
      .eq('attempt_id', attempt_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingFeedback) {
      // 既存のフィードバックを返す
      const { data: feedback } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('id', existingFeedback.id)
        .single();

      if (feedback) {
        return Response.json(
          successResponse({
            feedback_id: feedback.id,
            feedback: {
              schema_version: '1.0',
              overall_band_range: feedback.overall_band_range,
              dimensions: feedback.dimensions,
              strengths: feedback.strengths,
              band_up_actions: feedback.band_up_actions,
              rewrite_targets: feedback.rewrite_targets,
              vocab_suggestions: feedback.vocab_suggestions,
              metadata: feedback.metadata,
            },
          })
        );
      }
    }

    // タスク取得
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('question')
      .eq('id', task_id)
      .single();

    if (taskError || !task) {
      return Response.json(
        errorResponse('NOT_FOUND', 'Task not found'),
        { status: 404 }
      );
    }

    // 穴埋め結果を取得（あれば）
    let fillInResults: {
      incorrectQuestionTypes: Array<'CC' | 'LR' | 'GRA'>;
      totalQuestions: number;
      correctCount: number;
    } | null = null;

    const fillInAnswers = attempt.draft_content?.fill_in_answers as Array<{
      question_id: string;
      user_answer: string;
    }> | undefined;

    if (fillInAnswers && fillInAnswers.length > 0) {
      console.log('[LLM Feedback API] Fill-in answers found:', fillInAnswers.length);
      
      // 穴埋め問題を生成して正解/不正解を判定
      // 共通関数を直接呼び出し（内部API呼び出しを避ける）
      try {
        const { generateFillInQuestions } = await import('@/lib/domain/fillInQuestions');
        
        // ユーザーの回答テキストを取得
        const userResponseText = attempt.draft_content?.final || attempt.draft_content?.fill_in || user_response_text;
        
        if (userResponseText) {
          // 穴埋め問題を生成
          const questions = generateFillInQuestions(
            userResponseText,
            attempt_id,
            attempt.level
          );
          
          console.log('[LLM Feedback API] Generated questions for analysis:', questions.length);
          
          // 正解/不正解を判定
          const incorrectTypes = new Set<'CC' | 'LR' | 'GRA'>();
          let correctCount = 0;

          questions.forEach((q) => {
            const userAnswer = fillInAnswers.find(a => a.question_id === q.id);
            if (userAnswer) {
              if (userAnswer.user_answer === q.correct_answer) {
                correctCount++;
              } else {
                incorrectTypes.add(q.question_type);
              }
            }
          });

          fillInResults = {
            incorrectQuestionTypes: Array.from(incorrectTypes),
            totalQuestions: questions.length,
            correctCount,
          };

          console.log('[LLM Feedback API] Fill-in results:', fillInResults);
        }
      } catch (error) {
        console.warn('[LLM Feedback API] Failed to generate fill-in questions for analysis:', error);
        // エラー時は続行（穴埋め結果なしでフィードバック生成）
      }
    }

    // LLMでフィードバック生成
    console.log('[LLM Feedback API] Calling LLM to generate feedback...');
    let feedbackData;
    try {
      feedbackData = await generateFeedback(
        task.question,
        user_response_text,
        level,
        task_id,
        attempt_id,
        fillInResults
      );
      console.log('[LLM Feedback API] Feedback generated successfully');
    } catch (llmError) {
      console.error('[LLM Feedback API] LLM error:', llmError);
      return Response.json(
        errorResponse('LLM_ERROR', llmError instanceof Error ? llmError.message : 'Failed to generate feedback'),
        { status: 500 }
      );
    }

    // feedbacksテーブルに保存
    console.log('[LLM Feedback API] Saving feedback to database...');
    const { data: feedback, error: insertError } = await supabase
      .from('feedbacks')
      .insert({
        attempt_id,
        overall_band_range: feedbackData.overall_band_range,
        dimensions: feedbackData.dimensions,
        strengths: feedbackData.strengths,
        band_up_actions: feedbackData.band_up_actions,
        rewrite_targets: feedbackData.rewrite_targets,
        vocab_suggestions: feedbackData.vocab_suggestions,
        metadata: feedbackData.metadata,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[LLM Feedback API] Database insert error:', insertError);
      return Response.json(
        errorResponse('DATABASE_ERROR', insertError.message || 'Failed to save feedback', insertError),
        { status: 500 }
      );
    }

    console.log('[LLM Feedback API] Feedback saved successfully, ID:', feedback.id);

    // daily_state更新（弱点タグ、Band推定）
    const weaknessTags = feedbackData.dimensions
      .filter((d) => parseFloat(d.band_estimate) < 6.0)
      .map((d) => d.dimension);

    const today = new Date().toISOString().split('T')[0];

    await supabase.from('daily_state').upsert({
      user_id: user.id,
      date: today,
      weakness_tags: weaknessTags.slice(0, 2), // 上位1〜2
      latest_band_estimate: feedbackData.overall_band_range,
    });

    return Response.json(
      successResponse({
        feedback_id: feedback.id,
        feedback: feedbackData,
      })
    );
  } catch (error) {
    console.error('[LLM Feedback API] Unexpected error:', error);
    console.error('[LLM Feedback API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error', error instanceof Error ? { stack: error.stack } : undefined),
      { status: 500 }
    );
  }
}

