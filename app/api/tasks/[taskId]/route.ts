/**
 * POST /api/tasks/:taskId/submit
 * 回答送信
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { DraftContent } from '@/lib/domain/types';

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const { level, draft_content }: { level: string; draft_content: DraftContent } =
      await request.json();

    if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid level'),
        { status: 400 }
      );
    }

    // タスクが存在するか確認
    const { data: taskExists, error: taskError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', params.taskId)
      .single();

    if (taskError || !taskExists) {
      return Response.json(
        errorResponse('NOT_FOUND', `Task with id ${params.taskId} not found`),
        { status: 404 }
      );
    }

    // attemptsテーブルに保存
    const { data: attempt, error: insertError } = await supabase
      .from('attempts')
      .insert({
        user_id: user.id,
        task_id: params.taskId,
        level,
        draft_content,
        submitted_at: new Date().toISOString(),
        status: 'submitted',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Submit API] Insert error:', insertError);
      return Response.json(
        errorResponse('DATABASE_ERROR', insertError.message || 'Failed to save attempt'),
        { status: 500 }
      );
    }

    // 初級/中級の場合はfill_in、上級はfeedback
    const next_step =
      level === 'beginner' || level === 'intermediate' ? 'fill_in' : 'feedback';

    return Response.json(
      successResponse({
        attempt_id: attempt.id,
        next_step,
      })
    );
  } catch (error) {
    console.error('[Submit API] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}

