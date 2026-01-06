/**
 * POST /api/task1/attempts/save-step
 * Task 1のStepを保存
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { SaveStepRequestSchema } from '@/lib/validators/task1';
import { countWords, countParagraphs } from '@/lib/utils/task1Helpers';

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
    
    // バリデーション
    const validationResult = SaveStepRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('[Task1 Save Step API] Validation error:', validationResult.error);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid request body', validationResult.error),
        { status: 400 }
      );
    }

    const { attempt_id, step_index, content, observations, key_numbers, checklist } = validationResult.data;

    // Attemptが存在し、ユーザーのものか確認
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

    // step_stateを更新
    const currentStepState = (attempt.step_state || {}) as Record<string, unknown>;
    const stepKey = `step${step_index}`;
    
    const updatedStepState = {
      ...currentStepState,
      [stepKey]: content,
      ...(observations !== undefined && { observations }),
      ...(key_numbers !== undefined && { key_numbers }),
      ...(checklist !== undefined && { checklist }),
    };

    // 語数と段落数を計算（step6の場合）
    let wordCount: number | undefined;
    let paragraphCount: number | undefined;
    
    if (step_index === 6 && content) {
      wordCount = countWords(content);
      paragraphCount = countParagraphs(content);
    }

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

