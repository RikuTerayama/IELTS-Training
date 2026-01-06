/**
 * POST /api/task1/review/final
 * Task 1のStep6（最終回答）をレビュー
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ReviewFinalRequestSchema, Task1FinalReviewFeedbackSchema } from '@/lib/validators/task1';
import { buildTask1FinalReviewPrompt } from '@/lib/llm/prompts/task1_final_review';
import { callLLM } from '@/lib/llm/client';
import { parseLLMResponseWithRetry } from '@/lib/llm/parse';
import type { Task1StepState } from '@/lib/domain/types';

export async function POST(request: Request): Promise<Response> {
  console.log('[Task1 Review Final API] Starting...');
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Task1 Review Final API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Task1 Review Final API] User authenticated:', user.email);

    const requestBody = await request.json();
    
    // バリデーション
    const validationResult = ReviewFinalRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('[Task1 Review Final API] Validation error:', validationResult.error);
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
      console.error('[Task1 Review Final API] Attempt not found:', attemptError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    const task = (attempt as any).tasks;
    if (!task || task.question_type !== 'Task 1') {
      console.error('[Task1 Review Final API] Task is not Task 1');
      return Response.json(
        errorResponse('BAD_REQUEST', 'Task is not Task 1'),
        { status: 400 }
      );
    }

    const stepState = (attempt.step_state || {}) as Task1StepState;
    const finalResponse = stepState.step6;

    if (!finalResponse || finalResponse.trim().length === 0) {
      console.error('[Task1 Review Final API] Step 6 is not completed');
      return Response.json(
        errorResponse('BAD_REQUEST', 'Step 6 (final response) must be completed before review'),
        { status: 400 }
      );
    }

    const keyNumbers = stepState.key_numbers || [];

    // LLMで最終レビュー生成
    console.log('[Task1 Review Final API] Calling LLM for final review...');
    let reviewFeedback;
    try {
      const prompt = buildTask1FinalReviewPrompt(
        task.question,
        finalResponse,
        stepState,
        keyNumbers,
        attempt.level
      );

      const parsed = await parseLLMResponseWithRetry(async () => {
        return await callLLM(prompt, {
          response_format: { type: 'json_object' },
          temperature: 0.7,
        });
      });

      // metadataを補完
      const feedbackWithMetadata = {
        ...parsed,
        metadata: {
          ...(parsed as any).metadata,
          task_id: task.id,
          attempt_id: attempt.id,
          user_level: attempt.level,
          generated_at: new Date().toISOString(),
          is_rewrite: false,
        },
      };

      // Zodでバリデーション
      const validated = Task1FinalReviewFeedbackSchema.parse(feedbackWithMetadata);
      reviewFeedback = validated;
      console.log('[Task1 Review Final API] LLM review completed successfully');
    } catch (llmError) {
      console.error('[Task1 Review Final API] LLM error:', llmError);
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
      final_review: {
        status: 'completed',
        feedback_payload: reviewFeedback,
        updated_at: new Date().toISOString(),
      },
    };

    // user_skill_statsを更新（弱点カウンター）
    const skillStatsUpdates: Record<string, number> = {};
    
    // 数字不一致チェック
    if (reviewFeedback.number_validation?.has_mismatch) {
      skillStatsUpdates.number_mismatch = (skillStatsUpdates.number_mismatch || 0) + 1;
    }

    // Overview欠如チェック
    const hasOverview = reviewFeedback.dimensions.find(d => 
      d.dimension === 'TR' && d.short_comment.toLowerCase().includes('overview')
    );
    if (!hasOverview || hasOverview.band_estimate < '6.0') {
      skillStatsUpdates.overview_missing = (skillStatsUpdates.overview_missing || 0) + 1;
    }

    // 比較表現欠如チェック
    const ccDimension = reviewFeedback.dimensions.find(d => d.dimension === 'CC');
    if (ccDimension && parseFloat(ccDimension.band_estimate) < 6.0) {
      skillStatsUpdates.comparison_missing = (skillStatsUpdates.comparison_missing || 0) + 1;
    }

    // 時制不一致チェック（GRA次元から推測）
    const graDimension = reviewFeedback.dimensions.find(d => d.dimension === 'GRA');
    if (graDimension && graDimension.short_comment.toLowerCase().includes('tense')) {
      skillStatsUpdates.tense_inconsistent = (skillStatsUpdates.tense_inconsistent || 0) + 1;
    }

    // user_skill_statsを更新
    if (Object.keys(skillStatsUpdates).length > 0) {
      const { data: existingStats } = await supabase
        .from('user_skill_stats')
        .select('counters')
        .eq('user_id', user.id)
        .maybeSingle();

      const currentCounters = (existingStats?.counters || {}) as Record<string, number>;
      const updatedCounters = { ...currentCounters };
      
      Object.entries(skillStatsUpdates).forEach(([key, value]) => {
        updatedCounters[key] = (updatedCounters[key] || 0) + value;
      });

      await supabase
        .from('user_skill_stats')
        .upsert({
          user_id: user.id,
          counters: updatedCounters,
          updated_at: new Date().toISOString(),
        });
    }

    // attemptsテーブルを更新
    const { data: updatedAttempt, error: updateError } = await supabase
      .from('attempts')
      .update({
        review_state: updatedReviewState,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', attempt_id)
      .select()
      .single();

    if (updateError) {
      console.error('[Task1 Review Final API] Update error:', updateError);
      return Response.json(
        errorResponse('DATABASE_ERROR', updateError.message || 'Failed to save review'),
        { status: 500 }
      );
    }

    console.log('[Task1 Review Final API] Review saved successfully');

    return Response.json(successResponse({
      review: reviewFeedback,
      attempt: updatedAttempt,
    }));
  } catch (error) {
    console.error('[Task1 Review Final API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

