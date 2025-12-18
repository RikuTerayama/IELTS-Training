# LLMプロンプトテンプレート（4種類固定）

## 共通設定

- **出力形式**: 必ずJSON（`response_format: { type: 'json_object' }`）
- **スキーマバージョン**: すべてのレスポンスに `schema_version: "1.0"` を含める
- **エラーハンドリング**: JSONでなかった場合はリトライ（最大3回）
- **温度設定**: 0.7（一貫性と創造性のバランス）

---

## 1. task_generate（タスク生成）

### プロンプトテンプレート

```
You are an IELTS Writing Task 2 question generator for Japanese learners.

Generate an IELTS Writing Task 2 question appropriate for the user's level.

User Level: {level}
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
  "level": "{level}",
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

Note: For advanced level, prep_guide can be null or minimal.
```

### 実装例

```typescript
// lib/llm/prompts/task_generate.ts
export function buildTaskGeneratePrompt(level: 'beginner' | 'intermediate' | 'advanced'): string {
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
  const response = await callLLM(prompt, {
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });
  
  // JSONパースとバリデーション
  const parsed = JSON.parse(response);
  if (!parsed.schema_version) {
    throw new Error('Invalid LLM response: missing schema_version');
  }
  
  return parsed as TaskGenerationResponse;
}
```

---

## 2. writing_feedback（フィードバック生成）

### プロンプトテンプレート

```
You are an IELTS Writing examiner. Evaluate the following essay and provide feedback in JSON format.

Task: {task_question}

User's Response:
{user_response_text}

User's Level: {level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

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
    "task_id": "{task_id}",
    "attempt_id": "{attempt_id}",
    "user_level": "{level}",
    "generated_at": "{ISO 8601}",
    "is_rewrite": false
  }
}

IMPORTANT:
- band_up_actions must be exactly 1-3 items with priority 1, 2, 3
- rewrite_targets must be maximum 2 locations
- short_comment must be ONE LINE ONLY
- Provide concrete examples (before → after) for band_up_actions
- Use Japanese for explanations when helpful for Japanese learners
```

### 実装例

```typescript
// lib/llm/prompts/writing_feedback.ts
export function buildWritingFeedbackPrompt(
  taskQuestion: string,
  userResponseText: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  taskId: string,
  attemptId: string
): string {
  return `You are an IELTS Writing examiner. Evaluate the following essay and provide feedback in JSON format.

Task: ${taskQuestion}

User's Response:
${userResponseText}

User's Level: ${level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

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
  attemptId: string
): Promise<FeedbackGenerationResponse> {
  const prompt = buildWritingFeedbackPrompt(
    taskQuestion,
    userResponseText,
    level,
    taskId,
    attemptId
  );
  
  const response = await callLLM(prompt, {
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });
  
  const parsed = JSON.parse(response);
  if (!parsed.schema_version) {
    throw new Error('Invalid LLM response: missing schema_version');
  }
  
  // バリデーション: band_up_actions が1〜3つか
  if (!parsed.band_up_actions || parsed.band_up_actions.length < 1 || parsed.band_up_actions.length > 3) {
    throw new Error('Invalid feedback: band_up_actions must be 1-3 items');
  }
  
  return parsed as FeedbackGenerationResponse;
}
```

---

## 3. rewrite_coach（書き直しコーチ）

### プロンプトテンプレート

```
You are a writing coach helping a Japanese learner improve their IELTS essay through targeted revision.

Original Task: {task_question}

Original Response:
{original_response_text}

Rewrite Targets (maximum 2 locations):
{rewrite_targets_json}

Revised Text (user's revision):
{revised_text}

Your role:
1. Evaluate if the revision addresses the issues identified in rewrite_targets
2. Provide updated feedback focusing on the revised sections
3. Compare before/after to show improvement
4. If issues remain, suggest ONE more specific improvement (not full rewrite)

Output JSON format (same as writing_feedback, but with is_rewrite: true):
{
  "schema_version": "1.0",
  "overall_band_range": "6.0-6.5",
  "dimensions": [...],
  "strengths": [...],
  "band_up_actions": [
    // Focus on remaining issues or next steps (1-3 items)
  ],
  "rewrite_targets": [
    // Only if further revision needed (max 2)
  ],
  "vocab_suggestions": [...],
  "metadata": {
    "task_id": "{task_id}",
    "attempt_id": "{attempt_id}",
    "user_level": "{level}",
    "generated_at": "{ISO 8601}",
    "is_rewrite": true,
    "parent_feedback_id": "{parent_feedback_id}"
  }
}

IMPORTANT:
- Focus on the revised sections
- Show improvement if revision is good
- If issues remain, suggest ONE more specific improvement (not full rewrite)
- Maximum 2 rewrite_targets if further revision needed
```

### 実装例

```typescript
// lib/llm/prompts/rewrite_coach.ts
export function buildRewriteCoachPrompt(
  taskQuestion: string,
  originalResponseText: string,
  rewriteTargets: RewriteTarget[],
  revisedText: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  taskId: string,
  attemptId: string,
  parentFeedbackId: string
): string {
  return `You are a writing coach helping a Japanese learner improve their IELTS essay through targeted revision.

Original Task: ${taskQuestion}

Original Response:
${originalResponseText}

Rewrite Targets (maximum 2 locations):
${JSON.stringify(rewriteTargets, null, 2)}

Revised Text (user's revision):
${revisedText}

Your role:
1. Evaluate if the revision addresses the issues identified in rewrite_targets
2. Provide updated feedback focusing on the revised sections
3. Compare before/after to show improvement
4. If issues remain, suggest ONE more specific improvement (not full rewrite)

Output JSON format (same as writing_feedback, but with is_rewrite: true):
{
  "schema_version": "1.0",
  "overall_band_range": "6.0-6.5",
  "dimensions": [...],
  "strengths": [...],
  "band_up_actions": [
    // Focus on remaining issues or next steps (1-3 items)
  ],
  "rewrite_targets": [
    // Only if further revision needed (max 2)
  ],
  "vocab_suggestions": [...],
  "metadata": {
    "task_id": "${taskId}",
    "attempt_id": "${attemptId}",
    "user_level": "${level}",
    "generated_at": "${new Date().toISOString()}",
    "is_rewrite": true,
    "parent_feedback_id": "${parentFeedbackId}"
  }
}

IMPORTANT:
- Focus on the revised sections
- Show improvement if revision is good
- If issues remain, suggest ONE more specific improvement (not full rewrite)
- Maximum 2 rewrite_targets if further revision needed`;
}
```

---

## 4. writing_to_speaking（Writing→Speakingプロンプト生成）

### プロンプトテンプレート

```
You are creating a speaking practice prompt based on a user's IELTS Writing essay.

Writing Task: {task_question}

User's Written Response:
{user_response_text}

Required Vocabulary (from task):
{required_vocab_json}

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
- All vocabulary should be relevant to the topic
```

### 実装例

```typescript
// lib/llm/prompts/writing_to_speaking.ts
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
  
  const response = await callLLM(prompt, {
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });
  
  const parsed = JSON.parse(response);
  if (!parsed.schema_version) {
    throw new Error('Invalid LLM response: missing schema_version');
  }
  
  // バリデーション: follow_up_questions が5問か
  if (!parsed.follow_up_questions || parsed.follow_up_questions.length !== 5) {
    throw new Error('Invalid speaking prompt: must have exactly 5 follow-up questions');
  }
  
  return parsed as SpeakingPromptGenerationResponse;
}
```

---

## LLM呼び出し共通関数

```typescript
// lib/llm/client.ts
interface LLMConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  temperature: number;
  max_tokens: number;
}

const DEFAULT_CONFIG: LLMConfig = {
  provider: 'openai',
  model: 'gpt-4o-mini', // コスト効率重視
  temperature: 0.7,
  max_tokens: 2000,
};

export async function callLLM(
  prompt: string,
  options?: {
    response_format?: { type: 'json_object' };
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> {
  const config = { ...DEFAULT_CONFIG, ...options };
  
  // OpenAI API呼び出し
  if (config.provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: config.response_format,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      }),
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  // Anthropic API呼び出し（将来対応）
  throw new Error('Unsupported provider');
}

// JSONパースとリトライ（最大3回）
export async function callLLMWithRetry(
  prompt: string,
  options?: Parameters<typeof callLLM>[1],
  maxRetries: number = 3
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await callLLM(prompt, options);
      const parsed = JSON.parse(response);
      
      // schema_versionチェック
      if (!parsed.schema_version) {
        throw new Error('Missing schema_version');
      }
      
      return parsed;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw new Error(`LLM call failed after ${maxRetries} retries: ${error}`);
      }
      // リトライ前に少し待機
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw new Error('Unexpected error in callLLMWithRetry');
}
```

---

## 使用例

```typescript
// app/api/llm/feedback/route.ts
import { generateFeedback } from '@/lib/llm/prompts/writing_feedback';
import { callLLMWithRetry } from '@/lib/llm/client';

export async function POST(request: Request) {
  const { taskQuestion, userResponseText, level, taskId, attemptId } = await request.json();
  
  try {
    const feedback = await generateFeedback(
      taskQuestion,
      userResponseText,
      level,
      taskId,
      attemptId
    );
    
    return Response.json({
      ok: true,
      data: feedback,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: {
        code: 'LLM_ERROR',
        message: error.message,
      },
    }, { status: 500 });
  }
}
```

