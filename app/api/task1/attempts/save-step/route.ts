/**
 * POST /api/task1/attempts/save-step
 * Task 1縺ｮStep繧剃ｿ晏ｭ・
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { SaveStepRequestSchema } from '@/lib/validators/task1';
import { countWords, countParagraphs } from '@/lib/utils/task1Helpers';
import { isRetiredTask1Beginner } from '@/lib/task1/retired';

export async function POST(request: Request): Promise<Response> {
  console.log('[Task1 Save Step API] Starting...');
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Task1 Save Step API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Task1 Save Step API] User authenticated:', user.email);

    const requestBody = await request.json();
    
    // 繝舌Μ繝・・繧ｷ繝ｧ繝ｳ
    const validationResult = SaveStepRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('[Task1 Save Step API] Validation error:', validationResult.error);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid request body', validationResult.error),
        { status: 400 }
      );
    }

    const { attempt_id, step_index, content, observations, key_numbers, checklist } = validationResult.data;

    // Attempt縺悟ｭ伜惠縺励√Θ繝ｼ繧ｶ繝ｼ縺ｮ繧ゅ・縺狗｢ｺ隱・
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', attempt_id)
      .eq('user_id', user.id)
      .eq('task_type', 'Task 1')
      .single();

    if (attemptError || !attempt) {
      console.error('[Task1 Save Step API] Attempt not found:', attemptError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }


    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('question_type, level, asset_id, image_path')
      .eq('id', attempt.task_id)
      .single();

    if (taskError || !task || task.question_type !== 'Task 1') {
      return Response.json(
        errorResponse('NOT_FOUND', 'Task not found'),
        { status: 404 }
      );
    }

    if (isRetiredTask1Beginner(task)) {
      return Response.json(
        errorResponse('NOT_FOUND', 'Task has been retired'),
        { status: 404 }
      );
    }
    // step_state繧呈峩譁ｰ
    const currentStepState = (attempt.step_state || {}) as Record<string, unknown>;
    const stepKey = `step${step_index}`;
    
    const updatedStepState = {
      ...currentStepState,
      [stepKey]: content,
      ...(observations !== undefined && { observations }),
      ...(key_numbers !== undefined && { key_numbers }),
      ...(checklist !== undefined && { checklist }),
    };

    // 隱樊焚縺ｨ谿ｵ關ｽ謨ｰ繧定ｨ育ｮ暦ｼ・tep6縺ｮ蝣ｴ蜷茨ｼ・
    let wordCount: number | undefined;
    let paragraphCount: number | undefined;
    
    if (step_index === 6 && content) {
      wordCount = countWords(content);
      paragraphCount = countParagraphs(content);
    }

    // 繝・・繧ｿ繝吶・繧ｹ繧呈峩譁ｰ
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
      console.error('[Task1 Save Step API] Update error:', updateError);
      return Response.json(
        errorResponse('DATABASE_ERROR', updateError.message || 'Failed to save step'),
        { status: 500 }
      );
    }

    console.log('[Task1 Save Step API] Step saved successfully');

    return Response.json(
      successResponse({
        attempt: updatedAttempt,
        ...(wordCount !== undefined && { word_count: wordCount }),
        ...(paragraphCount !== undefined && { paragraph_count: paragraphCount }),
      })
    );
  } catch (error) {
    console.error('[Task1 Save Step API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}



