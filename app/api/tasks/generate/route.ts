/**
 * POST /api/tasks/generate
 * タスク生成（LLM呼び出し）
 */

import { createClient } from '@/lib/supabase/server';
import { generateTask } from '@/lib/llm/prompts/task_generate';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function POST(request: Request): Promise<Response> {
  try {
    console.log('[Generate API] Starting task generation...');
    
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('[Generate API] Authentication failed:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Generate API] User authenticated:', user.email);

    const { level, task_type, genre } = await request.json();
    console.log('[Generate API] Requested params:', { level, task_type, genre });

    if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
      console.log('[Generate API] Invalid level:', level);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid level'),
        { status: 400 }
      );
    }

    const taskType: 'Task 1' | 'Task 2' = task_type || 'Task 2';
    if (!['Task 1', 'Task 2'].includes(taskType)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid task_type'),
        { status: 400 }
      );
    }

    // LLMでタスク生成
    console.log('[Generate API] Calling LLM to generate task...');
    let taskData;
    try {
      taskData = await generateTask(level, taskType, genre || null);
      console.log('[Generate API] Task generated successfully:', {
        level: taskData.level,
        questionLength: taskData.question?.length || 0,
        vocabCount: taskData.required_vocab?.length || 0,
        hasPrepGuide: !!taskData.prep_guide,
      });
    } catch (llmError) {
      console.error('[Generate API] LLM error:', llmError);
      return Response.json(
        errorResponse(
          'LLM_ERROR',
          llmError instanceof Error ? llmError.message : 'Failed to generate task'
        ),
        { status: 500 }
      );
    }

    // DBに保存
    console.log('[Generate API] Saving task to database...');
    const { data: task, error: insertError } = await supabase
      .from('tasks')
      .insert({
        level: taskData.level,
        question: taskData.question,
        question_type: taskData.question_type || taskType,
        required_vocab: taskData.required_vocab,
        prep_guide: taskData.prep_guide || null,
        is_cached: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Generate API] Database insert error:', insertError);
      return Response.json(
        errorResponse(
          'DATABASE_ERROR',
          insertError.message || 'Failed to save task to database'
        ),
        { status: 500 }
      );
    }

    console.log('[Generate API] Task saved successfully, ID:', task.id);
    return Response.json(successResponse(task));
  } catch (error) {
    console.error('[Generate API] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}

