/**
 * PREP評価プロンプト（日本語）
 */

export function buildPrepEvaluationPrompt(
  taskQuestion: string,
  taskType: 'Task 1' | 'Task 2',
  prepAnswers: {
    point: string;
    reason?: string;
    example: string;
    point_again?: string;
  },
  level: 'beginner' | 'intermediate' | 'advanced'
): string {
  const isTask1 = taskType === 'Task 1';
  
  if (isTask1) {
    return `You are an IELTS Writing coach evaluating a student's Task 1 response structure in Japanese.

Task Question: ${taskQuestion}

Student's Answers (in Japanese):
- Point (主な特徴): ${prepAnswers.point}
- Example (具体例・データ): ${prepAnswers.example}

User's Level: ${level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

IMPORTANT: Task 1 requires describing FACTS from graphs/charts/tables, NOT personal opinions. The response should describe trends, comparisons, and specific data points.

Evaluate whether the structure is valid and provide feedback in Japanese.

Output JSON format:
{
  "schema_version": "1.0",
  "is_valid_prep": true or false,
  "score_estimate": "Band 5.0-5.5" or "Band 6.0-6.5" or "Band 6.5-7.0",
  "missing_points": [
    "具体的な不足点1",
    "具体的な不足点2"
  ],
  "feedback": "日本語での詳細なフィードバック。グラフ・図表から読み取れる事実が適切に述べられているか、具体的なデータが含まれているか、価値のある表現で説明されているかを具体的に説明してください。"
}

Requirements:
1. Check if the point describes main features/trends from the graph/chart/table (NOT personal opinions)
2. Verify if the example includes specific data points (years, numbers, percentages, etc.)
3. Evaluate if the description uses valuable expressions (e.g., "増加傾向にある", "ピークを迎えた", "XXからYYに増加")
4. Check if comparisons are made where relevant
5. Ensure the description focuses on facts, not opinions
6. Provide constructive feedback in Japanese
7. Estimate the potential IELTS band score based on the structure quality (minimum 150 words required for Task 1)`;
  } else {
    return `You are an IELTS Writing coach evaluating a student's PREP structure in Japanese.

Task Question: ${taskQuestion}

Student's PREP Answers (in Japanese):
- Point: ${prepAnswers.point}
- Reason: ${prepAnswers.reason || ''}
- Example: ${prepAnswers.example}
- Point again: ${prepAnswers.point_again || ''}

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
7. Estimate the potential IELTS band score based on the PREP structure quality (minimum 250 words required for Task 2)`;
  }
}

