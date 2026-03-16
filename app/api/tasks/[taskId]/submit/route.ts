/**
 * POST /api/tasks/:taskId/submit
 * 回答送信
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { DraftContent } from '@/lib/domain/types';
import { isRetiredTask1Beginner } from '@/lib/task1/retired';
import { z } from 'zod';

const SubmitAttemptRequestSchema = z.object({
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  draft_content: z.object({
    japanese: z.string().optional(),
    skeleton: z.string().optional(),
    fill_in: z.string().optional(),
    final: z.string().optional(),
  }).passthrough(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> | { taskId: string } }
): Promise<Response> {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    console.log('[Submit API] Starting submission for taskId:', resolvedParams.taskId);
    
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

    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('[Submit API] Failed to parse request body:', parseError);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Submission payload is not valid JSON'),
        { status: 400 }
      );
    }

    const validationResult = SubmitAttemptRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.log('[Submit API] Invalid submission payload');
      return Response.json(
        errorResponse('BAD_REQUEST', 'Submission payload is invalid', validationResult.error.flatten()),
        { status: 400 }
      );
    }

    const { level, draft_content } = validationResult.data as { level: string; draft_content: DraftContent };
    const finalText = draft_content.final || draft_content.fill_in || draft_content.skeleton || '';
    if (!finalText.trim()) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Answer text is required'),
        { status: 400 }
      );
    }

    console.log('[Submit API] Request body received:', {
      level,
      hasDraftContent: true,
      finalLength: finalText.length,
    });

    // タスクが存在するか確認
    console.log('[Submit API] Checking if task exists:', resolvedParams.taskId);
    const { data: taskExists, error: taskError } = await supabase
      .from('tasks')
      .select('id, question_type, level, asset_id, image_path')
      .eq('id', resolvedParams.taskId)
      .single();

    if (taskError) {
      console.error('[Submit API] Task check error:', taskError);
      return Response.json(
        errorResponse('NOT_FOUND', `Task with id ${resolvedParams.taskId} not found: ${taskError.message}`),
        { status: 404 }
      );
    }

    if (!taskExists) {
      console.error('[Submit API] Task not found:', resolvedParams.taskId);
      return Response.json(
        errorResponse('NOT_FOUND', `Task with id ${resolvedParams.taskId} not found`),
        { status: 404 }
      );
    }

    if (isRetiredTask1Beginner(taskExists)) {
      return Response.json(
        errorResponse('NOT_FOUND', 'Task has been retired'),
        { status: 404 }
      );
    }

    console.log('[Submit API] Task exists, inserting attempt...');

    // attemptsテーブルに保存
    const { data: attempt, error: insertError } = await supabase
      .from('attempts')
      .insert({
        user_id: user.id,
        task_id: resolvedParams.taskId,
        level,
        draft_content: {
          ...draft_content,
          final: finalText,
        },
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
