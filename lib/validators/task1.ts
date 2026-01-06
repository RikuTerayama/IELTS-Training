/**
 * Task 1 Step Learning用のZodスキーマ
 */

import { z } from 'zod';

// ==================== Step State関連 ====================
export const Task1ObservationSchema = z.object({
  id: z.string(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  text: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export const Task1KeyNumberSchema = z.object({
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  context: z.string().min(1),
});

export const Task1ChecklistSchema = z.object({
  has_overview: z.boolean().optional(),
  has_comparison: z.boolean().optional(),
  has_numbers: z.boolean().optional(),
  has_paragraphs: z.boolean().optional(),
  word_count_ok: z.boolean().optional(),
  tense_consistent: z.boolean().optional(),
}).catchall(z.boolean().optional());

export const Task1TimersSchema = z.object({
  step1_start: z.string().optional(),
  step2_start: z.string().optional(),
  step3_start: z.string().optional(),
  step4_start: z.string().optional(),
  step5_start: z.string().optional(),
  step6_start: z.string().optional(),
  total_elapsed: z.number().optional(),
});

export const Task1StepStateSchema = z.object({
  step1: z.string().optional(),
  step2: z.string().optional(),
  step3: z.string().optional(),
  step4: z.string().optional(),
  step5: z.string().optional(),
  step6: z.string().optional(),
  step1_fixed: z.string().optional(),
  step2_fixed: z.string().optional(),
  step3_fixed: z.string().optional(),
  step4_fixed: z.string().optional(),
  step5_fixed: z.string().optional(),
  observations: z.array(Task1ObservationSchema).optional(),
  key_numbers: z.array(Task1KeyNumberSchema).optional(),
  checklist: Task1ChecklistSchema.optional(),
  timers: Task1TimersSchema.optional(),
});

// ==================== Review Feedback関連 ====================
export const Task1StepReviewFeedbackSchema = z.object({
  schema_version: z.string(),
  step_feedbacks: z.array(
    z.object({
      step_index: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
      is_valid: z.boolean(),
      issues: z.array(
        z.object({
          category: z.union([
            z.literal('TR'),
            z.literal('CC'),
            z.literal('LR'),
            z.literal('GRA'),
            z.literal('structure'),
            z.literal('content'),
          ]),
          description: z.string(),
          suggestion: z.string(),
          example_before: z.string().optional(),
          example_after: z.string().optional(),
        })
      ),
      strengths: z.array(z.string()).optional(),
    })
  ),
  top_priority_fix: z.object({
    step_index: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    issue: z.string(),
    fix_guidance: z.string(),
  }),
  number_validation: z.object({
    extracted_numbers: z.array(
      z.object({
        value: z.string(),
        context: z.string(),
      })
    ),
    registered_numbers: z.array(
      z.object({
        value: z.string(),
        context: z.string(),
      })
    ),
    mismatches: z.array(
      z.object({
        extracted: z.string(),
        registered: z.string().optional(),
      })
    ),
  }).optional(),
});

export const Task1FinalReviewFeedbackSchema = z.object({
  schema_version: z.string(),
  overall_band_range: z.string(),
  dimensions: z.array(
    z.object({
      dimension: z.union([z.literal('TR'), z.literal('CC'), z.literal('LR'), z.literal('GRA')]),
      band_estimate: z.string(),
      short_comment: z.string(),
      evidence: z.array(
        z.object({
          paragraph_id: z.string(),
          sentence_id: z.string().optional(),
          text: z.string(),
          issue_type: z.union([z.literal('positive'), z.literal('negative')]),
          note: z.string().optional(),
        })
      ),
      explanation: z.string().optional(),
    })
  ),
  strengths: z.array(
    z.object({
      dimension: z.union([z.literal('TR'), z.literal('CC'), z.literal('LR'), z.literal('GRA')]),
      description: z.string(),
      example: z.string().optional(),
    })
  ),
  band_up_actions: z.array(
    z.object({
      priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      dimension: z.union([z.literal('TR'), z.literal('CC'), z.literal('LR'), z.literal('GRA')]),
      title: z.string(),
      why: z.string(),
      how: z.string(),
      example: z.string(),
    })
  ).min(1).max(3),
  rewrite_targets: z.array(
    z.object({
      target_id: z.string(),
      paragraph_id: z.string(),
      sentence_id: z.string().optional(),
      original_text: z.string(),
      issue_description: z.string(),
      rewrite_guidance: z.string(),
      dimension: z.union([z.literal('TR'), z.literal('CC'), z.literal('LR'), z.literal('GRA')]),
      priority: z.union([z.literal('high'), z.literal('medium'), z.literal('low')]),
    })
  ).max(2),
  vocab_suggestions: z.array(
    z.object({
      original_word: z.string(),
      suggestion_type: z.union([
        z.literal('synonym'),
        z.literal('collocation'),
        z.literal('upgrade'),
        z.literal('correction'),
      ]),
      suggestions: z.array(z.string()).max(3),
      context: z.string(),
      explanation: z.string().optional(),
      example_sentence: z.string().optional(),
    })
  ),
  sentence_highlights: z.array(
    z.object({
      sentence_index: z.number(),
      sentence_text: z.string(),
      tags: z.array(z.union([z.literal('TR'), z.literal('CC'), z.literal('LR'), z.literal('GRA')])),
      comment: z.string(),
      suggested_rewrite: z.string().optional(),
    })
  ),
  number_validation: z.object({
    extracted_numbers: z.array(
      z.object({
        value: z.string(),
        context: z.string(),
      })
    ),
    registered_numbers: z.array(
      z.object({
        value: z.string(),
        context: z.string(),
      })
    ),
    mismatches: z.array(
      z.object({
        extracted: z.string(),
        registered: z.string().optional(),
      })
    ),
    has_mismatch: z.boolean(),
  }).optional(),
  metadata: z.object({
    task_id: z.string(),
    attempt_id: z.string(),
    user_level: z.union([z.literal('beginner'), z.literal('intermediate'), z.literal('advanced')]),
    generated_at: z.string(),
    model_version: z.string().optional(),
    is_rewrite: z.boolean(),
    parent_feedback_id: z.string().optional(),
  }),
});

// ==================== API Request/Response関連 ====================
export const CreateOrResumeAttemptRequestSchema = z.object({
  task_id: z.string().uuid(),
  level: z.union([z.literal('beginner'), z.literal('intermediate'), z.literal('advanced')]),
  mode: z.union([z.literal('training'), z.literal('exam')]),
});

export const SaveStepRequestSchema = z.object({
  attempt_id: z.string().uuid(),
  step_index: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  content: z.string(),
  observations: z.array(Task1ObservationSchema).optional(),
  key_numbers: z.array(Task1KeyNumberSchema).optional(),
  checklist: Task1ChecklistSchema.optional(),
});

export const ReviewStepsRequestSchema = z.object({
  attempt_id: z.string().uuid(),
});

export const ReviewFinalRequestSchema = z.object({
  attempt_id: z.string().uuid(),
});

export const ApplyStepFixesRequestSchema = z.object({
  attempt_id: z.string().uuid(),
  fixed_steps: z.record(
    z.union([z.literal('1'), z.literal('2'), z.literal('3'), z.literal('4'), z.literal('5')]),
    z.string().min(1) // 空文字列を許可しない
  ),
});

