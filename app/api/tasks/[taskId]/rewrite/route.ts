/**
 * POST /api/tasks/:taskId/rewrite
 * 書き直し回答送信・再評価
 */

import { createClient } from '@/lib/supabase/server';
import { generateRewriteFeedback } from '@/lib/llm/prompts/rewrite_coach';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { RewriteTarget } from '@/lib/domain/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> | { taskId: string } }
): Promise<Response> {
  console.log('[Rewrite API] Starting rewrite submission...');
  
  try {
    // Next.js 15+ では params が Promise になる可能性がある
    const resolvedParams = params instanceof Promise ? await params : params;
    const taskId = resolvedParams.taskId;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Rewrite API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Rewrite API] User authenticated:', user.email);

    const requestBody = await request.json();
    const { attempt_id, revised_content }: {
      attempt_id: string;
      revised_content: Array<{ target_id: string; revised_text: string }>;
    } = requestBody;

    if (!attempt_id || !revised_content || !Array.isArray(revised_content)) {
      console.error('[Rewrite API] Invalid request body');
      return Response.json(
        errorResponse('BAD_REQUEST', 'attempt_id and revised_content are required'),
        { status: 400 }
      );
    }

    console.log('[Rewrite API] Attempt ID:', attempt_id, 'Revised content count:', revised_content.length);

    // Attempt取得
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', attempt_id)
      .eq('user_id', user.id)
      .single();

    if (attemptError || !attempt) {
      console.error('[Rewrite API] Attempt not found:', attemptError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    // 元のフィードバック取得
    const { data: originalFeedback, error: feedbackError } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('attempt_id', attempt_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (feedbackError) {
      console.error('[Rewrite API] Error fetching original feedback:', feedbackError);
      return Response.json(
        errorResponse('DATABASE_ERROR', feedbackError.message || 'Failed to fetch original feedback'),
        { status: 500 }
      );
    }

    if (!originalFeedback) {
      console.error('[Rewrite API] Original feedback not found');
      return Response.json(
        errorResponse('NOT_FOUND', 'Original feedback not found'),
        { status: 404 }
      );
    }

    // タスク取得
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('question')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      console.error('[Rewrite API] Task not found:', taskError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Task not found'),
        { status: 404 }
      );
    }

    // 元の回答テキストを取得
    const originalResponseText = attempt.draft_content?.final || attempt.draft_content?.fill_in || '';
    
    if (!originalResponseText || originalResponseText.trim().length === 0) {
      console.error('[Rewrite API] Original response text is empty');
      return Response.json(
        errorResponse('BAD_REQUEST', 'Original response text is required'),
        { status: 400 }
      );
    }

    // rewrite_targetsを取得
    const rewriteTargets = (originalFeedback.rewrite_targets || []) as RewriteTarget[];

    // 修正されたテキストを結合
    const revisedText = revised_content.map(r => r.revised_text).join(' ');

    console.log('[Rewrite API] Calling LLM to generate rewrite feedback...');

    // LLMで再評価
    let feedbackData;
    try {
      feedbackData = await generateRewriteFeedback(
        task.question,
        originalResponseText,
        rewriteTargets,
        revisedText,
        attempt.level,
        taskId,
        attempt_id,
        originalFeedback.id
      );
      console.log('[Rewrite API] Rewrite feedback generated successfully');
    } catch (llmError) {
      console.error('[Rewrite API] LLM error:', llmError);
      return Response.json(
        errorResponse('LLM_ERROR', llmError instanceof Error ? llmError.message : 'Failed to generate rewrite feedback'),
        { status: 500 }
      );
    }

    // 新しいフィードバック保存
    console.log('[Rewrite API] Saving new feedback to database...');
    const { data: newFeedback, error: insertError } = await supabase
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
        parent_feedback_id: originalFeedback.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Rewrite API] Database insert error:', insertError);
      return Response.json(
        errorResponse('DATABASE_ERROR', insertError.message || 'Failed to save feedback', insertError),
        { status: 500 }
      );
    }

    console.log('[Rewrite API] Feedback saved successfully, ID:', newFeedback.id);

    // attemptsテーブル更新（rewrite_countを増やす、最大3回まで）
    const currentRewriteCount = (attempt.rewrite_count || 0) as number;
    if (currentRewriteCount >= 3) {
      console.warn('[Rewrite API] Rewrite count limit reached (3)');
      // エラーにはしない（フィードバックは保存済み）
    } else {
      const updatedDraftContent = {
        ...attempt.draft_content,
        final: originalResponseText, // 元のテキストを保持（修正は別途保存）
        revised: revised_content, // 修正内容を保存
      };

      const { error: updateError } = await supabase
        .from('attempts')
        .update({
          draft_content: updatedDraftContent,
          rewrite_count: currentRewriteCount + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', attempt_id);

      if (updateError) {
        console.warn('[Rewrite API] Failed to update attempt:', updateError);
        // エラーにはしない（フィードバックは保存済み）
      }
    }

    return Response.json(
      successResponse({
        feedback_id: newFeedback.id,
        feedback: feedbackData,
      })
    );
  } catch (error) {
    console.error('[Rewrite API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

