/**
 * Task 1 Step Review プロンプト
 * Step1-5のレビュー用
 */

import type { Task1StepState, Task1KeyNumber, Task1Observation } from '@/lib/domain/types';

export function buildTask1StepReviewPrompt(
  taskQuestion: string,
  stepState: Task1StepState,
  keyNumbers: Task1KeyNumber[],
  observations: Task1Observation[]
): string {
  const step1 = stepState.step1 || '';
  const step2 = stepState.step2 || '';
  const step3 = stepState.step3 || '';
  const step4 = stepState.step4 || '';
  const step5 = stepState.step5 || '';

  const keyNumbersText = keyNumbers.length > 0
    ? keyNumbers.map(kn => `- ${kn.value}${kn.unit ? ' ' + kn.unit : ''} (${kn.context})`).join('\n')
    : 'None registered';

  const observationsText = observations.length > 0
    ? observations.map(obs => `- ${obs.text}${obs.tags ? ' [tags: ' + obs.tags.join(', ') + ']' : ''}`).join('\n')
    : 'None';

  return `You are an IELTS Writing Task 1 examiner reviewing a Japanese learner's step-by-step approach to describing a graph/chart/diagram/map.

Task Question: ${taskQuestion}

Registered Key Numbers:
${keyNumbersText}

Observations/Notes:
${observationsText}

Step-by-step responses:

Step 1 (What does the graph show?):
${step1 || '[Not answered]'}

Step 2 (Overview - Main features):
${step2 || '[Not answered]'}

Step 3 (Feature 1 - Detailed description):
${step3 || '[Not answered]'}

Step 4 (Feature 2 - Detailed description):
${step4 || '[Not answered]'}

Step 5 (Feature 3 - Detailed description):
${step5 || '[Not answered]'}

Your task:
1. Review each step (1-5) and evaluate if it meets the requirements for that step
2. For each step, identify:
   - Is it valid/complete? (boolean)
   - Issues (if any) with category (TR, CC, LR, GRA, structure, content)
   - Strengths (if any)
   - Specific suggestions for improvement
3. Identify the TOP PRIORITY fix across all steps (the most important issue to address)
4. Validate numbers: Extract numbers from the responses and compare with registered key_numbers. Report mismatches.

Step Requirements:
- Step 1: Should clearly identify what the graph/chart shows (topic, time period, units)
- Step 2: Should provide an overview of main trends/features (without specific numbers)
- Step 3-5: Should describe specific features with data points and comparisons

Output JSON format:
{
  "schema_version": "1.0",
  "step_feedbacks": [
    {
      "step_index": 1,
      "is_valid": true,
      "issues": [
        {
          "category": "TR",
          "description": "Issue description",
          "suggestion": "How to fix",
          "example_before": "Original text",
          "example_after": "Improved text"
        }
      ],
      "strengths": ["Strength 1", "Strength 2"]
    }
  ],
  "top_priority_fix": {
    "step_index": 1,
    "issue": "Most important issue",
    "fix_guidance": "How to fix this issue"
  },
  "number_validation": {
    "extracted_numbers": [
      {"value": "50", "context": "Population in 2020"}
    ],
    "registered_numbers": [
      {"value": "50 million", "context": "Population in 2020"}
    ],
    "mismatches": [
      {"extracted": "50", "registered": "50 million"}
    ]
  }
}

IMPORTANT:
- Be specific and actionable
- Provide concrete examples (before → after)
- Focus on IELTS Task 1 criteria (TR, CC, LR, GRA)
- For number validation, be lenient (e.g., "50" matches "50 million" if context is similar)
- The top_priority_fix should be the single most important issue to address before moving to Step 6`;
}

