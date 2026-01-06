/**
 * POST /api/task1/attempts/apply-step-fixes
 * Step5レビュー後の修正を適用してstep*_fixedに保存
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ApplyStepFixesRequestSchema } from '@/lib/validators/task1';
import type { Task1StepState } from '@/lib/domain/types';

export async function POST(request: Request): Promise<Response> {
  console.log('[Task1 Apply Step Fixes API] Starting...');
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Task1 Apply Step Fixes API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Task1 Apply Step Fixes API] User authenticated:', user.email);

    const requestBody = await request.json();
    
    // バリデーション
    const validationResult = ApplyStepFixesRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('[Task1 Apply Step Fixes API] Validation error:', validationResult.error);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid request body', validationResult.error),
        { status: 400 }
      );
    }

    const { attempt_id, fixed_steps } = validationResult.data;

    // Attemptが存在し、ユーザーのものか確認
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', attempt_id)
      .eq('user_id', user.id)
      .eq('task_type', 'Task 1')
      .single();

    if (attemptError || !attempt) {
      console.error('[Task1 Apply Step Fixes API] Attempt not found:', attemptError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    // step_stateを取得
    const currentStepState = (attempt.step_state || {}) as Task1StepState;
    
    // step*_fixedをマージ（既存のstep1-6、observations、key_numbers、checklist、timersは保持）
    const updatedStepState: Task1StepState = {
      ...currentStepState,
      step1_fixed: fixed_steps['1'] || currentStepState.step1_fixed,
      step2_fixed: fixed_steps['2'] || currentStepState.step2_fixed,
      step3_fixed: fixed_steps['3'] || currentStepState.step3_fixed,
      step4_fixed: fixed_steps['4'] || currentStepState.step4_fixed,
      step5_fixed: fixed_steps['5'] || currentStepState.step5_fixed,
      // 既存のobservations、key_numbers、checklist、timersを保持
      observations: currentStepState.observations,
      key_numbers: currentStepState.key_numbers,
      checklist: currentStepState.checklist,
      timers: currentStepState.timers,
    };

    // データベースを更新
    const { data: updatedAttempt, error: updateError } = await supabase
      .from('attempts')
      .update({
        step_state: updatedStepState,
        updated_at: new Date().toISOString(),
      })
      .eq('id', attempt_id)
      .select()
      .single();

    if (updateError) {
      console.error('[Task1 Apply Step Fixes API] Update error:', updateError);
      return Response.json(
        errorResponse('DATABASE_ERROR', updateError.message || 'Failed to apply fixes'),
        { status: 500 }
      );
    }

    console.log('[Task1 Apply Step Fixes API] Fixes applied successfully');

    return Response.json(successResponse({
      attempt: updatedAttempt,
    }));
  } catch (error) {
    console.error('[Task1 Apply Step Fixes API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

