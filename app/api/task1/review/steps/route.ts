/**
 * POST /api/task1/review/steps
 * Task 1のStep1-5をレビュー
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ReviewStepsRequestSchema, Task1StepReviewFeedbackSchema } from '@/lib/validators/task1';
import { buildTask1StepReviewPrompt } from '@/lib/llm/prompts/task1_step_review';
import { callLLM } from '@/lib/llm/client';
import { parseLLMResponseWithRetry } from '@/lib/llm/parse';
import type { Task1StepState } from '@/lib/domain/types';

export async function POST(request: Request): Promise<Response> {
  console.log('[Task1 Review Steps API] Starting...');
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Task1 Review Steps API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Task1 Review Steps API] User authenticated:', user.email);

    const requestBody = await request.json();
    
    // バリデーション
    const validationResult = ReviewStepsRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('[Task1 Review Steps API] Validation error:', validationResult.error);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid request body', validationResult.error),
        { status: 400 }
      );
    }

    const { attempt_id } = validationResult.data;

    // AttemptとTaskを取得
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select(`
        *,
        tasks:task_id (
          id,
          question,
          question_type
        )
      `)
      .eq('id', attempt_id)
      .eq('user_id', user.id)
      .eq('task_type', 'Task 1')
      .single();

    if (attemptError || !attempt) {
      console.error('[Task1 Review Steps API] Attempt not found:', attemptError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    const task = (attempt as any).tasks;
    if (!task || task.question_type !== 'Task 1') {
      console.error('[Task1 Review Steps API] Task is not Task 1');
      return Response.json(
        errorResponse('BAD_REQUEST', 'Task is not Task 1'),
        { status: 400 }
      );
    }

    const stepState = (attempt.step_state || {}) as Task1StepState;
    const keyNumbers = stepState.key_numbers || [];
    const observations = stepState.observations || [];

    // Step1-5がすべて入力されているか確認
    if (!stepState.step1 || !stepState.step2 || !stepState.step3 || !stepState.step4 || !stepState.step5) {
      console.error('[Task1 Review Steps API] Not all steps are completed');
      return Response.json(
        errorResponse('BAD_REQUEST', 'All steps (1-5) must be completed before review'),
        { status: 400 }
      );
    }

    // LLMでレビュー生成
    console.log('[Task1 Review Steps API] Calling LLM for step review...');
    let reviewFeedback;
    try {
      const prompt = buildTask1StepReviewPrompt(
        task.question,
        stepState,
        keyNumbers,
        observations
      );

      const parsed = await parseLLMResponseWithRetry(async () => {
        return await callLLM(prompt, {
          response_format: { type: 'json_object' },
          temperature: 0.7,
        });
      });

      // Zodでバリデーション
      const validated = Task1StepReviewFeedbackSchema.parse(parsed);
      reviewFeedback = validated;
      console.log('[Task1 Review Steps API] LLM review completed successfully');
    } catch (llmError) {
      console.error('[Task1 Review Steps API] LLM error:', llmError);
      return Response.json(
        errorResponse(
          'LLM_ERROR',
          llmError instanceof Error ? llmError.message : 'Failed to generate review'
        ),
        { status: 500 }
      );
    }

    // review_stateを更新
    const currentReviewState = (attempt.review_state || {}) as Record<string, unknown>;
    const updatedReviewState = {
      ...currentReviewState,
      step_review: {
        status: 'completed',
        feedback_payload: reviewFeedback,
        updated_at: new Date().toISOString(),
      },
    };

    const { data: updatedAttempt, error: updateError } = await supabase
      .from('attempts')
      .update({
        review_state: updatedReviewState,
        updated_at: new Date().toISOString(),
      })
      .eq('id', attempt_id)
      .select()
      .single();

    if (updateError) {
      console.error('[Task1 Review Steps API] Update error:', updateError);
      return Response.json(
        errorResponse('DATABASE_ERROR', updateError.message || 'Failed to save review'),
        { status: 500 }
      );
    }

    console.log('[Task1 Review Steps API] Review saved successfully');

    return Response.json(successResponse({
      review: reviewFeedback,
      attempt: updatedAttempt,
    }));
  } catch (error) {
    console.error('[Task1 Review Steps API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

