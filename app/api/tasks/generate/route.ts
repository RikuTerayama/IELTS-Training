/**
 * POST /api/tasks/generate
 * タスク生成（LLM呼び出し）
 */

import { createClient } from '@/lib/supabase/server';
import { generateTask } from '@/lib/llm/prompts/task_generate';
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

    const { level } = await request.json();

    if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid level'),
        { status: 400 }
      );
    }

    // LLMでタスク生成
    const taskData = await generateTask(level);

    // DBに保存
    const { data: task, error: insertError } = await supabase
      .from('tasks')
      .insert({
        level: taskData.level,
        question: taskData.question,
        required_vocab: taskData.required_vocab,
        prep_guide: taskData.prep_guide || null,
        is_cached: false,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return Response.json(successResponse(task));
  } catch (error) {
    return Response.json(
      errorResponse('LLM_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

