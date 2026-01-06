/**
 * Task 1 Final Review プロンプト
 * Step6（最終回答）のレビュー用
 */

import type { Task1StepState, Task1KeyNumber } from '@/lib/domain/types';

export function buildTask1FinalReviewPrompt(
  taskQuestion: string,
  finalResponse: string,
  stepState: Task1StepState,
  keyNumbers: Task1KeyNumber[],
  level: 'beginner' | 'intermediate' | 'advanced'
): string {
  const keyNumbersText = keyNumbers.length > 0
    ? keyNumbers.map(kn => `- ${kn.value}${kn.unit ? ' ' + kn.unit : ''} (${kn.context})`).join('\n')
    : 'None registered';

  return `You are an IELTS Writing Task 1 examiner evaluating a Japanese learner's complete response.

Task Question: ${taskQuestion}

User Level: ${level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

Registered Key Numbers (user should use these):
${keyNumbersText}

User's Final Response (Step 6 - Integrated answer):
${finalResponse}

Your task:
1. Evaluate the response according to IELTS Task 1 criteria (TR, CC, LR, GRA)
2. Provide overall band range estimate
3. For each dimension (TR, CC, LR, GRA):
   - Band estimate
   - Short comment (ONE LINE ONLY)
   - Evidence (1-3 pieces with paragraph_id, sentence_id, text, issue_type)
4. Identify strengths (maximum 2)
5. Provide band_up_actions (exactly 1-3 items with priority 1, 2, 3)
6. Provide rewrite_targets (maximum 2 locations)
7. Provide vocab_suggestions
8. For sentence-level feedback: Split the response into sentences and tag each sentence with relevant dimensions (TR, CC, LR, GRA), provide comments and suggested rewrites
9. Validate numbers: Extract numbers from the response and compare with registered key_numbers. Report mismatches.

IELTS Task 1 Requirements:
- TR (Task Response): Accurately describes the information, identifies key features, provides an overview
- CC (Coherence and Cohesion): Logical organization, clear paragraphing, appropriate use of cohesive devices
- LR (Lexical Resource): Range and accuracy of vocabulary, appropriate word choice
- GRA (Grammatical Range and Accuracy): Range and accuracy of grammar, sentence structures

Output JSON format:
{
  "schema_version": "1.0",
  "overall_band_range": "6.0-6.5",
  "dimensions": [
    {
      "dimension": "TR",
      "band_estimate": "6.0",
      "short_comment": "One line comment only",
      "evidence": [
        {
          "paragraph_id": "p1",
          "sentence_id": "p1-s2",
          "text": "Excerpt from user's text (max 50 chars)",
          "issue_type": "positive",
          "note": "Optional note"
        }
      ],
      "explanation": "Optional: IELTS term explanation in Japanese"
    }
  ],
  "strengths": [
    {
      "dimension": "TR",
      "description": "Strength description",
      "example": "Optional example"
    }
  ],
  "band_up_actions": [
    {
      "priority": 1,
      "dimension": "CC",
      "title": "Short title",
      "why": "Reason why this is important",
      "how": "Concrete steps to improve",
      "example": "Before: [original] → After: [improved]"
    }
  ],
  "rewrite_targets": [
    {
      "target_id": "p1-s2",
      "paragraph_id": "p1",
      "sentence_id": "p1-s2",
      "original_text": "Original text",
      "issue_description": "What is the issue (in Japanese for Japanese learners)",
      "rewrite_guidance": "Concrete rewrite instructions",
      "dimension": "CC",
      "priority": "high"
    }
  ],
  "vocab_suggestions": [
    {
      "original_word": "important",
      "suggestion_type": "upgrade",
      "suggestions": ["crucial", "significant", "vital"],
      "context": "Usage context",
      "explanation": "Why this is better",
      "example_sentence": "Example sentence"
    }
  ],
  "sentence_highlights": [
    {
      "sentence_index": 0,
      "sentence_text": "First sentence text",
      "tags": ["TR", "CC"],
      "comment": "Comment about this sentence",
      "suggested_rewrite": "Improved version (optional)"
    }
  ],
  "number_validation": {
    "extracted_numbers": [
      {"value": "50", "context": "Population in 2020"}
    ],
    "registered_numbers": [
      {"value": "50 million", "context": "Population in 2020"}
    ],
    "mismatches": [
      {"extracted": "50", "registered": "50 million"}
    ],
    "has_mismatch": false
  },
  "metadata": {
    "task_id": "task_id_here",
    "attempt_id": "attempt_id_here",
    "user_level": "${level}",
    "generated_at": "${new Date().toISOString()}",
    "is_rewrite": false
  }
}

IMPORTANT:
- sentence_highlights: Split the response by sentences (period, exclamation, question mark) and provide feedback for each
- band_up_actions must be exactly 1-3 items with priority 1, 2, 3
- rewrite_targets must be maximum 2 locations
- short_comment must be ONE LINE ONLY
- Provide concrete examples (before → after) for band_up_actions
- For number validation, be lenient but flag clear mismatches
- Use Japanese for explanations when helpful for Japanese learners`;
}

