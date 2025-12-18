/**
 * 書き直しコーチプロンプト
 * 07_LLMプロンプトテンプレート.md の rewrite_coach に準拠
 */

import type { RewriteTarget, FeedbackGenerationResponse } from '@/lib/domain/types';
import { callLLM } from '../client';
import { parseLLMResponseWithRetry } from '../parse';

export function buildRewriteCoachPrompt(
  taskQuestion: string,
  originalResponseText: string,
  rewriteTargets: RewriteTarget[],
  revisedText: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  taskId: string,
  attemptId: string,
  parentFeedbackId: string
): string {
  return `You are a writing coach helping a Japanese learner improve their IELTS essay through targeted revision.

Original Task: ${taskQuestion}

Original Response:
${originalResponseText}

Rewrite Targets (maximum 2 locations):
${JSON.stringify(rewriteTargets, null, 2)}

Revised Text (user's revision):
${revisedText}

Your role:
1. Evaluate if the revision addresses the issues identified in rewrite_targets
2. Provide updated feedback focusing on the revised sections
3. Compare before/after to show improvement
4. If issues remain, suggest ONE more specific improvement (not full rewrite)

Output JSON format (same as writing_feedback, but with is_rewrite: true):
{
  "schema_version": "1.0",
  "overall_band_range": "6.0-6.5",
  "dimensions": [...],
  "strengths": [...],
  "band_up_actions": [
    // Focus on remaining issues or next steps (1-3 items)
  ],
  "rewrite_targets": [
    // Only if further revision needed (max 2)
  ],
  "vocab_suggestions": [...],
  "metadata": {
    "task_id": "${taskId}",
    "attempt_id": "${attemptId}",
    "user_level": "${level}",
    "generated_at": "${new Date().toISOString()}",
    "is_rewrite": true,
    "parent_feedback_id": "${parentFeedbackId}"
  }
}

IMPORTANT:
- Focus on the revised sections
- Show improvement if revision is good
- If issues remain, suggest ONE more specific improvement (not full rewrite)
- Maximum 2 rewrite_targets if further revision needed`;
}

export async function generateRewriteFeedback(
  taskQuestion: string,
  originalResponseText: string,
  rewriteTargets: RewriteTarget[],
  revisedText: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  taskId: string,
  attemptId: string,
  parentFeedbackId: string
): Promise<FeedbackGenerationResponse> {
  const prompt = buildRewriteCoachPrompt(
    taskQuestion,
    originalResponseText,
    rewriteTargets,
    revisedText,
    level,
    taskId,
    attemptId,
    parentFeedbackId
  );

  const parsed = await parseLLMResponseWithRetry(async () => {
    return await callLLM(prompt, {
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
  });

  const feedback = parsed as FeedbackGenerationResponse;

  // バリデーション
  if (
    !feedback.band_up_actions ||
    feedback.band_up_actions.length < 1 ||
    feedback.band_up_actions.length > 3
  ) {
    throw new Error('Invalid feedback: band_up_actions must be 1-3 items');
  }

  if (feedback.rewrite_targets && feedback.rewrite_targets.length > 2) {
    throw new Error('Invalid feedback: rewrite_targets must be maximum 2 locations');
  }

  return feedback;
}

