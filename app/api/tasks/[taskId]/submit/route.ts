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
      throw insertError;
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
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

