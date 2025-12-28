/**
 * PREP評価プロンプト（日本語）
 */

export function buildPrepEvaluationPrompt(
  taskQuestion: string,
  prepAnswers: {
    point: string;
    reason: string;
    example: string;
    point_again: string;
  },
  level: 'beginner' | 'intermediate' | 'advanced'
): string {
  return `You are an IELTS Writing coach evaluating a student's PREP structure in Japanese.

Task Question: ${taskQuestion}

Student's PREP Answers (in Japanese):
- Point: ${prepAnswers.point}
- Reason: ${prepAnswers.reason}
- Example: ${prepAnswers.example}
- Point again: ${prepAnswers.point_again}

User's Level: ${level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

Evaluate whether the PREP structure is valid and provide feedback in Japanese.

Output JSON format:
{
  "schema_version": "1.0",
  "is_valid_prep": true or false,
  "score_estimate": "Band 5.0-5.5" or "Band 6.0-6.5" or "Band 6.5-7.0",
  "missing_points": [
    "具体的な不足点1",
    "具体的な不足点2"
  ],
  "feedback": "日本語での詳細なフィードバック。PREPとして成り立っているか、エッセイの解答として高い点数をつけられるか、足りない点はどこかを具体的に説明してください。"
}

Requirements:
1. Check if the PREP structure is logically sound
2. Evaluate if the point is clear and consistent
3. Check if reasons are sufficient (2-3 reasons)
4. Verify if the example is concrete and relevant
5. Confirm if the conclusion restates the point
6. Provide constructive feedback in Japanese
7. Estimate the potential IELTS band score based on the PREP structure quality`;
}

