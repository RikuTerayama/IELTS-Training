/**
 * POST /api/llm/feedback
 * フィードバック生成（LLM呼び出し）
 */

import { createClient } from '@/lib/supabase/server';
import { generateFeedback } from '@/lib/llm/prompts/writing_feedback';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function POST(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

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
    } = await request.json();

    // 既存のフィードバックをチェック（キャッシュ）
    const { data: existingFeedback } = await supabase
      .from('feedbacks')
      .select('id, metadata')
      .eq('attempt_id', attempt_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

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

    // LLMでフィードバック生成
    const feedbackData = await generateFeedback(
      task.question,
      user_response_text,
      level,
      task_id,
      attempt_id
    );

    // feedbacksテーブルに保存
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
      throw insertError;
    }

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
    return Response.json(
      errorResponse('LLM_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

