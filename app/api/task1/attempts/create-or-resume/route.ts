/**
 * POST /api/task1/attempts/create-or-resume
 * Task 1用のAttempt作成または再開
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { CreateOrResumeAttemptRequestSchema } from '@/lib/validators/task1';

export async function POST(request: Request): Promise<Response> {
  console.log('[Task1 Create/Resume API] Starting...');
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Task1 Create/Resume API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Task1 Create/Resume API] User authenticated:', user.email);

    const requestBody = await request.json();
    
    // バリデーション
    const validationResult = CreateOrResumeAttemptRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('[Task1 Create/Resume API] Validation error:', validationResult.error);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid request body', validationResult.error),
        { status: 400 }
      );
    }

    const { task_id, level, mode } = validationResult.data;

    // タスクが存在し、Task 1であることを確認
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, question_type')
      .eq('id', task_id)
      .single();

    if (taskError || !task) {
      console.error('[Task1 Create/Resume API] Task not found:', taskError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Task not found'),
        { status: 404 }
      );
    }

    if (task.question_type !== 'Task 1') {
      console.error('[Task1 Create/Resume API] Task is not Task 1:', task.question_type);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Task is not Task 1'),
        { status: 400 }
      );
    }

    // 既存のattemptを検索（同じtask_id、user_id、status='draft'のもの）
    const { data: existingAttempt, error: searchError } = await supabase
      .from('attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('task_id', task_id)
      .eq('task_type', 'Task 1')
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (searchError) {
      console.error('[Task1 Create/Resume API] Search error:', searchError);
      return Response.json(
        errorResponse('DATABASE_ERROR', searchError.message || 'Failed to search attempts'),
        { status: 500 }
      );
    }

    // 既存のattemptがあれば返す
    if (existingAttempt) {
      console.log('[Task1 Create/Resume API] Resuming existing attempt:', existingAttempt.id);
      return Response.json(successResponse(existingAttempt));
    }

    // 新規attemptを作成
    console.log('[Task1 Create/Resume API] Creating new attempt...');
    const { data: newAttempt, error: insertError } = await supabase
      .from('attempts')
      .insert({
        user_id: user.id,
        task_id,
        task_type: 'Task 1',
        mode,
        level,
        status: 'draft',
        step_state: {
          observations: [],
          key_numbers: [],
          checklist: {},
          timers: {},
        },
        review_state: {
          step_review: { status: 'pending' },
          final_review: { status: 'pending' },
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Task1 Create/Resume API] Insert error:', insertError);
      return Response.json(
        errorResponse('DATABASE_ERROR', insertError.message || 'Failed to create attempt'),
        { status: 500 }
      );
    }

    console.log('[Task1 Create/Resume API] Attempt created successfully:', newAttempt.id);
    return Response.json(successResponse(newAttempt));
  } catch (error) {
    console.error('[Task1 Create/Resume API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

