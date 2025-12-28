/**
 * PREPから英語エッセイ生成プロンプト
 */

import type { RequiredVocab } from '@/lib/domain/types';

export function buildPrepToEssayPrompt(
  taskQuestion: string,
  taskType: 'Task 1' | 'Task 2',
  prepAnswers: {
    point: string;
    reason?: string;
    example: string;
    point_again?: string;
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

  const isTask1 = taskType === 'Task 1';

  if (isTask1) {
    return `You are an IELTS Writing coach helping a student convert their Task 1 response structure into a complete English essay.

Task Question: ${taskQuestion}

Student's Answers (in Japanese):
- Point (主な特徴): ${prepAnswers.point}
- Example (具体例・データ): ${prepAnswers.example}

Evaluation Feedback:
${japaneseEvaluation.feedback}

Required Vocabulary (must be used in the essay):
${vocabList || 'None specified'}

User's Level: ${level}
- beginner: Band 5.0-5.5 target (150-200 words)
- intermediate: Band 6.0-6.5 target (150-200 words)
- advanced: Band 6.5-7.0 target (150-200 words)

CRITICAL: Task 1 requires describing FACTS from graphs/charts/tables, NOT personal opinions. Use valuable expressions to describe trends, comparisons, and data.

Generate a complete IELTS Writing Task 1 response in English based on the structure.

Output JSON format:
{
  "schema_version": "1.0",
  "essay": "Complete Task 1 response text in English (minimum 150 words)",
  "word_count": 180
}

Requirements:
1. Convert the Japanese structure into a well-structured English Task 1 response
2. Use all required vocabulary words naturally
3. Follow IELTS Writing Task 1 structure:
   - Introduction (paraphrase the question, describe what the graph/chart/table shows)
   - Overview (main trends/features)
   - Body Paragraph (detailed description with specific data points and comparisons)
4. Ensure the response is AT LEAST 150 words (aim for 150-200 words)
5. Describe FACTS only, NOT opinions
6. Use valuable expressions (e.g., "increased steadily", "reached a peak", "showed a sharp decline")
7. Include specific data points (years, numbers, percentages) from the examples
8. Make comparisons where relevant
9. Use appropriate academic vocabulary and grammar
10. Maintain coherence and cohesion throughout
11. Address any missing points identified in the evaluation`;
  } else {
    return `You are an IELTS Writing coach helping a student convert their PREP structure into a complete English essay.

Task Question: ${taskQuestion}

Student's PREP Answers (in Japanese):
- Point: ${prepAnswers.point}
- Reason: ${prepAnswers.reason || ''}
- Example: ${prepAnswers.example}
- Point again: ${prepAnswers.point_again || ''}

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
}

