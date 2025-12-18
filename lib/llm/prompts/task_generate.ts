/**
 * タスク生成プロンプト
 * 07_LLMプロンプトテンプレート.md の task_generate に準拠
 */

import type { TaskGenerationResponse } from '@/lib/domain/types';
import { callLLM } from '../client';
import { parseLLMResponseWithRetry } from '../parse';

export function buildTaskGeneratePrompt(
  level: 'beginner' | 'intermediate' | 'advanced'
): string {
  return `You are an IELTS Writing Task 2 question generator for Japanese learners.

Generate an IELTS Writing Task 2 question appropriate for the user's level.

User Level: ${level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

Requirements:
1. Generate a question that is IELTS-like but applicable to general English learning
2. Provide 3-5 required vocabulary words with:
   - word (English)
   - meaning (Japanese)
   - skill_tags (array of 'writing', 'speaking', 'reading', 'listening')
3. For beginner/intermediate levels, provide PREP guide structure:
   - point: Explanation of P (Point)
   - reason: Explanation of R (Reason)
   - example: Explanation of E (Example)
   - point_again: Explanation of P (Point again)
   - structure: Array of paragraph structure suggestions

Output JSON format:
{
  "schema_version": "1.0",
  "level": "${level}",
  "question": "IELTS Task 2 question text (at least 250 words requirement)",
  "required_vocab": [
    {
      "word": "example",
      "meaning": "例",
      "skill_tags": ["writing", "speaking"]
    }
  ],
  "prep_guide": {
    "point": "Your opinion should be clear",
    "reason": "Provide 2-3 reasons",
    "example": "Include one concrete example",
    "point_again": "Restate your opinion in conclusion",
    "structure": ["Introduction", "Body 1", "Body 2", "Conclusion"]
  }
}

Note: For advanced level, prep_guide can be null or minimal.`;
}

export async function generateTask(
  level: 'beginner' | 'intermediate' | 'advanced'
): Promise<TaskGenerationResponse> {
  const prompt = buildTaskGeneratePrompt(level);
  
  const parsed = await parseLLMResponseWithRetry(async () => {
    return await callLLM(prompt, {
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
  });

  return parsed as TaskGenerationResponse;
}

