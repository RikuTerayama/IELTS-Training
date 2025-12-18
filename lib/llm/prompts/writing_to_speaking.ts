/**
 * Writing→Speakingプロンプト生成
 * 07_LLMプロンプトテンプレート.md の writing_to_speaking に準拠
 */

import type { RequiredVocab, SpeakingPromptGenerationResponse } from '@/lib/domain/types';
import { callLLM } from '../client';
import { parseLLMResponseWithRetry } from '../parse';

export function buildWritingToSpeakingPrompt(
  taskQuestion: string,
  userResponseText: string,
  requiredVocab: RequiredVocab[]
): string {
  return `You are creating a speaking practice prompt based on a user's IELTS Writing essay.

Writing Task: ${taskQuestion}

User's Written Response:
${userResponseText}

Required Vocabulary (from task):
${JSON.stringify(requiredVocab, null, 2)}

Create:
1. A 2-minute summary prompt (user should summarize their essay in 2 minutes)
2. 5 follow-up questions related to the topic
3. Additional required vocabulary (3-5 words) that complement the writing task vocabulary

Output JSON format:
{
  "schema_version": "1.0",
  "summary_prompt": "Summarize your essay about [topic] in 2 minutes. Include your main opinion, 2-3 key reasons, and one example.",
  "follow_up_questions": [
    {
      "id": "q1",
      "question": "Follow-up question 1"
    },
    {
      "id": "q2",
      "question": "Follow-up question 2"
    },
    {
      "id": "q3",
      "question": "Follow-up question 3"
    },
    {
      "id": "q4",
      "question": "Follow-up question 4"
    },
    {
      "id": "q5",
      "question": "Follow-up question 5"
    }
  ],
  "required_vocab": [
    {
      "word": "example",
      "meaning": "例",
      "skill_tags": ["speaking", "writing"]
    }
  ]
}

Requirements:
- summary_prompt should be clear and actionable
- follow_up_questions should be open-ended and encourage elaboration
- required_vocab should include both task vocabulary and 3-5 new words
- All vocabulary should be relevant to the topic`;
}

export async function generateSpeakingPrompt(
  taskQuestion: string,
  userResponseText: string,
  requiredVocab: RequiredVocab[]
): Promise<SpeakingPromptGenerationResponse> {
  const prompt = buildWritingToSpeakingPrompt(
    taskQuestion,
    userResponseText,
    requiredVocab
  );

  const parsed = await parseLLMResponseWithRetry(async () => {
    return await callLLM(prompt, {
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
  });

  const result = parsed as SpeakingPromptGenerationResponse;

  // バリデーション: follow_up_questions が5問か
  if (!result.follow_up_questions || result.follow_up_questions.length !== 5) {
    throw new Error('Invalid speaking prompt: must have exactly 5 follow-up questions');
  }

  return result;
}

