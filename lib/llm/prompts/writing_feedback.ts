/**
 * フィードバック生成プロンプト
 * 07_LLMプロンプトテンプレート.md の writing_feedback に準拠
 */

import type { FeedbackGenerationResponse } from '@/lib/domain/types';
import { callLLM } from '../client';
import { parseLLMResponseWithRetry } from '../parse';

export function buildWritingFeedbackPrompt(
  taskQuestion: string,
  userResponseText: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  taskId: string,
  attemptId: string,
  fillInResults?: {
    incorrectQuestionTypes: Array<'CC' | 'LR' | 'GRA'>;
    totalQuestions: number;
    correctCount: number;
  } | null
): string {
  let fillInContext = '';
  if (fillInResults && fillInResults.totalQuestions > 0) {
    const incorrectTypes = fillInResults.incorrectQuestionTypes;
    const accuracy = Math.round((fillInResults.correctCount / fillInResults.totalQuestions) * 100);
    
    fillInContext = `\nFill-in Exercise Results:
- Total questions: ${fillInResults.totalQuestions}
- Correct answers: ${fillInResults.correctCount} (${accuracy}% accuracy)
- Incorrect question types: ${incorrectTypes.length > 0 ? incorrectTypes.join(', ') : 'None'}
- Weak areas identified: ${incorrectTypes.length > 0 ? incorrectTypes.map(t => {
      if (t === 'CC') return 'Coherence and Cohesion (接続詞/指示語)';
      if (t === 'LR') return 'Lexical Resource (語彙の言い換え)';
      if (t === 'GRA') return 'Grammatical Range and Accuracy (文結合)';
      return t;
    }).join(', ') : 'None'}

IMPORTANT: Consider these fill-in exercise results when providing band_up_actions. If the user made mistakes in CC, LR, or GRA questions, prioritize those dimensions in your feedback.`;
  }

  return `You are an IELTS Writing examiner. Evaluate the following essay and provide feedback in JSON format.

Task: ${taskQuestion}

User's Response:
${userResponseText}

User's Level: ${level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target${fillInContext}

CRITICAL REQUIREMENTS:
1. Provide overall_band_range (e.g., "6.0-6.5")
2. Evaluate TR, CC, LR, GRA (4 dimensions) with:
   - band_estimate (e.g., "6.0")
   - short_comment (ONE LINE ONLY, no long text)
   - evidence (1-3 pieces, with paragraph_id, sentence_id, text, issue_type)
3. Provide maximum 2 strengths
4. Provide exactly 1-3 band_up_actions with priority (1, 2, 3):
   - title (short)
   - why (reason)
   - how (concrete steps)
   - example (before → after example sentence)
5. Specify rewrite_targets (maximum 2 locations):
   - Only specific paragraphs/sentences (paragraph_id, sentence_id)
   - NOT full rewrite
   - Include rewrite_guidance (concrete instructions)
6. Provide vocab_suggestions (synonyms, collocations, upgrades)

OUTPUT FORMAT (JSON):
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
  "metadata": {
    "task_id": "${taskId}",
    "attempt_id": "${attemptId}",
    "user_level": "${level}",
    "generated_at": "${new Date().toISOString()}",
    "is_rewrite": false
  }
}

IMPORTANT:
- band_up_actions must be exactly 1-3 items with priority 1, 2, 3
- rewrite_targets must be maximum 2 locations
- short_comment must be ONE LINE ONLY
- Provide concrete examples (before → after) for band_up_actions
- Use Japanese for explanations when helpful for Japanese learners`;
}

export async function generateFeedback(
  taskQuestion: string,
  userResponseText: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  taskId: string,
  attemptId: string,
  fillInResults?: {
    incorrectQuestionTypes: Array<'CC' | 'LR' | 'GRA'>;
    totalQuestions: number;
    correctCount: number;
  } | null
): Promise<FeedbackGenerationResponse> {
  const prompt = buildWritingFeedbackPrompt(
    taskQuestion,
    userResponseText,
    level,
    taskId,
    attemptId,
    fillInResults
  );

  const parsed = await parseLLMResponseWithRetry(async () => {
    return await callLLM(prompt, {
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
  });

  const feedback = parsed as FeedbackGenerationResponse;

  // バリデーション: band_up_actions が1〜3つか
  if (
    !feedback.band_up_actions ||
    feedback.band_up_actions.length < 1 ||
    feedback.band_up_actions.length > 3
  ) {
    throw new Error('Invalid feedback: band_up_actions must be 1-3 items');
  }

  // rewrite_targets が最大2箇所か
  if (feedback.rewrite_targets && feedback.rewrite_targets.length > 2) {
    throw new Error('Invalid feedback: rewrite_targets must be maximum 2 locations');
  }

  return feedback;
}

