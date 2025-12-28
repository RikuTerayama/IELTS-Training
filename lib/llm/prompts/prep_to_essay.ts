/**
 * PREPから英語エッセイ生成プロンプト
 */

import type { RequiredVocab } from '@/lib/domain/types';

export function buildPrepToEssayPrompt(
  taskQuestion: string,
  prepAnswers: {
    point: string;
    reason: string;
    example: string;
    point_again: string;
  },
  japaneseEvaluation: {
    is_valid_prep: boolean;
    score_estimate: string;
    missing_points: string[];
    feedback: string;
  },
  level: 'beginner' | 'intermediate' | 'advanced',
  requiredVocab: RequiredVocab[]
): string {
  const vocabList = requiredVocab
    .map((v) => `- ${v.word} (${v.meaning})`)
    .join('\n');

  return `You are an IELTS Writing coach helping a student convert their PREP structure into a complete English essay.

Task Question: ${taskQuestion}

Student's PREP Answers (in Japanese):
- Point: ${prepAnswers.point}
- Reason: ${prepAnswers.reason}
- Example: ${prepAnswers.example}
- Point again: ${prepAnswers.point_again}

Evaluation Feedback:
${japaneseEvaluation.feedback}

Required Vocabulary (must be used in the essay):
${vocabList || 'None specified'}

User's Level: ${level}
- beginner: Band 5.0-5.5 target (250-300 words)
- intermediate: Band 6.0-6.5 target (250-300 words)
- advanced: Band 6.5-7.0 target (250-300 words)

Generate a complete IELTS Writing Task 2 essay in English based on the PREP structure.

Output JSON format:
{
  "schema_version": "1.0",
  "essay": "Complete essay text in English (250-300 words)",
  "word_count": 280
}

Requirements:
1. Convert the Japanese PREP structure into a well-structured English essay
2. Use all required vocabulary words naturally in the essay
3. Follow IELTS Writing Task 2 structure:
   - Introduction (paraphrase the question, state your position)
   - Body Paragraph 1 (first reason with explanation)
   - Body Paragraph 2 (second reason with example)
   - Conclusion (restate your position)
4. Ensure the essay is 250-300 words
5. Use appropriate academic vocabulary and grammar
6. Maintain coherence and cohesion throughout
7. Address any missing points identified in the evaluation`;
}

