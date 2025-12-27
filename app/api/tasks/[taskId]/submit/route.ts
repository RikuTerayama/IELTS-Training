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
    console.log('[Submit API] Starting submission for taskId:', params.taskId);
    
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('[Submit API] Authentication failed:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Submit API] User authenticated:', user.email);

    let requestBody;
    try {
      requestBody = await request.json();
      console.log('[Submit API] Request body received:', {
        level: requestBody.level,
        hasDraftContent: !!requestBody.draft_content,
      });
    } catch (parseError) {
      console.error('[Submit API] Failed to parse request body:', parseError);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid request body'),
        { status: 400 }
      );
    }

    const { level, draft_content }: { level: string; draft_content: DraftContent } = requestBody;

    if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
      console.log('[Submit API] Invalid level:', level);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid level'),
        { status: 400 }
      );
    }

    // タスクが存在するか確認
    console.log('[Submit API] Checking if task exists:', params.taskId);
    const { data: taskExists, error: taskError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', params.taskId)
      .single();

    if (taskError) {
      console.error('[Submit API] Task check error:', taskError);
      return Response.json(
        errorResponse('NOT_FOUND', `Task with id ${params.taskId} not found: ${taskError.message}`),
        { status: 404 }
      );
    }

    if (!taskExists) {
      console.error('[Submit API] Task not found:', params.taskId);
      return Response.json(
        errorResponse('NOT_FOUND', `Task with id ${params.taskId} not found`),
        { status: 404 }
      );
    }

    console.log('[Submit API] Task exists, inserting attempt...');

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
      console.error('[Submit API] Insert error details:', JSON.stringify(insertError, null, 2));
      return Response.json(
        errorResponse(
          'DATABASE_ERROR',
          insertError.message || 'Failed to save attempt',
          insertError
        ),
        { status: 500 }
      );
    }

    console.log('[Submit API] Attempt saved successfully, ID:', attempt.id);

    // 初級/中級の場合はfill_in、上級はfeedback
    const next_step =
      level === 'beginner' || level === 'intermediate' ? 'fill_in' : 'feedback';

    console.log('[Submit API] Submission successful, next_step:', next_step);

    return Response.json(
      successResponse({
        attempt_id: attempt.id,
        next_step,
      })
    );
  } catch (error) {
    console.error('[Submit API] Unexpected error:', error);
    console.error('[Submit API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error',
        error instanceof Error ? { stack: error.stack } : undefined
      ),
      { status: 500 }
    );
  }
}

