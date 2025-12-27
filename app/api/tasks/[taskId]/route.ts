/**
 * GET /api/tasks/:taskId
 * タスク詳細取得
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', params.taskId)
      .single();

    if (error || !task) {
      return Response.json(
        errorResponse('NOT_FOUND', 'Task not found'),
        { status: 404 }
      );
    }

    return Response.json(successResponse(task));
  } catch (error) {
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

