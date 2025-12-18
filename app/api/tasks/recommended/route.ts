/**
 * GET /api/tasks/recommended
 * 今日の推奨タスク取得
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    // 今日の日付を取得
    const today = new Date().toISOString().split('T')[0];

    // daily_stateから推奨タスク取得
    const { data: dailyState } = await supabase
      .from('daily_state')
      .select('recommended_task_id')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    let taskId: string | null = null;

    if (dailyState?.recommended_task_id) {
      taskId = dailyState.recommended_task_id;
    } else {
      // 新規生成（固定タスクを返す、後でLLM生成に置き換え）
      // TODO: LLMでタスク生成
      const { data: defaultTask } = await supabase
        .from('tasks')
        .select('id, level')
        .eq('level', 'beginner')
        .limit(1)
        .single();

      if (defaultTask) {
        taskId = defaultTask.id;
      }
    }

    if (!taskId) {
      return Response.json(
        errorResponse('NOT_FOUND', 'No recommended task found'),
        { status: 404 }
      );
    }

    // タスク詳細取得
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      return Response.json(
        errorResponse('NOT_FOUND', 'Task not found'),
        { status: 404 }
      );
    }

    // 所要時間を計算（初級: 5分、中級: 15分、上級: 30分）
    const estimatedTime =
      task.level === 'beginner' ? 5 : task.level === 'intermediate' ? 15 : 30;

    return Response.json(
      successResponse({
        task,
        estimated_time: estimatedTime,
      })
    );
  } catch (error) {
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

