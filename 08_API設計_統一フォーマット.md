# API設計（Next.js Route Handlers - 統一フォーマット）

## 共通レスポンス形式

全APIレスポンスは以下の形式に統一：

```typescript
interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## タスク関連API

### GET /api/tasks/recommended

**説明**: 今日の推奨タスク取得

**レスポンス**:
```typescript
ApiResponse<{
  task: Task;
  estimated_time: number; // 分（5/15/30）
}>
```

**実装**:
```typescript
// app/api/tasks/recommended/route.ts
import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types';

export async function GET(): Promise<Response> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      }, { status: 401 });
    }
    
    // daily_stateから推奨タスク取得
    const { data: dailyState } = await supabase
      .from('daily_state')
      .select('recommended_task_id')
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .single();
    
    if (!dailyState?.recommended_task_id) {
      // 新規生成（LLM呼び出し）
      // TODO: タスク生成ロジック
    }
    
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', dailyState.recommended_task_id)
      .single();
    
    return Response.json({
      ok: true,
      data: {
        task,
        estimated_time: task.level === 'beginner' ? 5 : task.level === 'intermediate' ? 15 : 30,
      },
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    }, { status: 500 });
  }
}
```

---

### GET /api/tasks/:taskId

**説明**: タスク詳細取得

**レスポンス**:
```typescript
ApiResponse<Task>
```

**実装**:
```typescript
// app/api/tasks/[taskId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
): Promise<Response> {
  try {
    const supabase = createClient();
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', params.taskId)
      .single();
    
    if (!task) {
      return Response.json({
        ok: false,
        error: { code: 'NOT_FOUND', message: 'Task not found' },
      }, { status: 404 });
    }
    
    return Response.json({
      ok: true,
      data: task,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    }, { status: 500 });
  }
}
```

---

### POST /api/tasks/generate

**説明**: タスク生成（LLM呼び出し）

**リクエスト**:
```typescript
{
  level: 'beginner' | 'intermediate' | 'advanced';
}
```

**レスポンス**:
```typescript
ApiResponse<Task>
```

**実装**:
```typescript
// app/api/tasks/generate/route.ts
import { generateTask } from '@/lib/llm/prompts/task_generate';

export async function POST(request: Request): Promise<Response> {
  try {
    const { level } = await request.json();
    
    // LLMでタスク生成
    const taskData = await generateTask(level);
    
    // DBに保存
    const supabase = createClient();
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        level: taskData.level,
        question: taskData.question,
        required_vocab: taskData.required_vocab,
        prep_guide: taskData.prep_guide,
        is_cached: false,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return Response.json({
      ok: true,
      data: task,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: { code: 'LLM_ERROR', message: error.message },
    }, { status: 500 });
  }
}
```

---

### POST /api/tasks/:taskId/submit

**説明**: 回答送信

**リクエスト**:
```typescript
{
  level: 'beginner' | 'intermediate' | 'advanced';
  draft_content: DraftContent;
}
```

**レスポンス**:
```typescript
ApiResponse<{
  attempt_id: string;
  next_step: 'fill_in' | 'feedback'; // 初級/中級はfill_in、上級はfeedback
}>
```

**実装**:
```typescript
// app/api/tasks/[taskId]/submit/route.ts
export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
): Promise<Response> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      }, { status: 401 });
    }
    
    const { level, draft_content } = await request.json();
    
    // attemptsテーブルに保存
    const { data: attempt, error } = await supabase
      .from('attempts')
      .insert({
        user_id: user.id,
        task_id: params.taskId,
        level,
        draft_content,
        submitted_at: new Date().toISOString(),
        status: 'submitted',
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // 初級/中級の場合はfill_in、上級はfeedback
    const next_step = (level === 'beginner' || level === 'intermediate') ? 'fill_in' : 'feedback';
    
    return Response.json({
      ok: true,
      data: {
        attempt_id: attempt.id,
        next_step,
      },
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    }, { status: 500 });
  }
}
```

---

## フィードバック関連API

### POST /api/llm/feedback

**説明**: フィードバック生成（LLM呼び出し）

**リクエスト**:
```typescript
{
  attempt_id: string;
  task_id: string;
  user_response_text: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}
```

**レスポンス**:
```typescript
ApiResponse<{
  feedback_id: string;
  feedback: Feedback;
}>
```

**実装**:
```typescript
// app/api/llm/feedback/route.ts
import { generateFeedback } from '@/lib/llm/prompts/writing_feedback';

export async function POST(request: Request): Promise<Response> {
  try {
    const { attempt_id, task_id, user_response_text, level } = await request.json();
    
    // タスク取得
    const supabase = createClient();
    const { data: task } = await supabase
      .from('tasks')
      .select('question')
      .eq('id', task_id)
      .single();
    
    // LLMでフィードバック生成
    const feedbackData = await generateFeedback(
      task.question,
      user_response_text,
      level,
      task_id,
      attempt_id
    );
    
    // feedbacksテーブルに保存
    const { data: feedback, error } = await supabase
      .from('feedbacks')
      .insert({
        attempt_id,
        overall_band_range: feedbackData.overall_band_range,
        dimensions: feedbackData.dimensions,
        strengths: feedbackData.strengths,
        band_up_actions: feedbackData.band_up_actions,
        rewrite_targets: feedbackData.rewrite_targets,
        vocab_suggestions: feedbackData.vocab_suggestions,
        metadata: feedbackData.metadata,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // daily_state更新（弱点タグ、Band推定）
    const weaknessTags = feedbackData.dimensions
      .filter(d => parseFloat(d.band_estimate) < 6.0)
      .map(d => d.dimension);
    
    await supabase
      .from('daily_state')
      .upsert({
        user_id: (await supabase.auth.getUser()).data.user.id,
        date: new Date().toISOString().split('T')[0],
        weakness_tags: weaknessTags.slice(0, 2), // 上位1〜2
        latest_band_estimate: feedbackData.overall_band_range,
      });
    
    return Response.json({
      ok: true,
      data: {
        feedback_id: feedback.id,
        feedback: feedbackData,
      },
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: { code: 'LLM_ERROR', message: error.message },
    }, { status: 500 });
  }
}
```

---

### GET /api/feedback/:feedbackId

**説明**: 保存済みフィードバック取得

**レスポンス**:
```typescript
ApiResponse<Feedback>
```

**実装**:
```typescript
// app/api/feedback/[feedbackId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { feedbackId: string } }
): Promise<Response> {
  try {
    const supabase = createClient();
    const { data: feedback } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('id', params.feedbackId)
      .single();
    
    if (!feedback) {
      return Response.json({
        ok: false,
        error: { code: 'NOT_FOUND', message: 'Feedback not found' },
      }, { status: 404 });
    }
    
    // JSONBフィールドをパース
    const feedbackData: Feedback = {
      schema_version: '1.0',
      overall_band_range: feedback.overall_band_range,
      dimensions: feedback.dimensions,
      strengths: feedback.strengths,
      band_up_actions: feedback.band_up_actions,
      rewrite_targets: feedback.rewrite_targets,
      vocab_suggestions: feedback.vocab_suggestions,
      metadata: feedback.metadata,
    };
    
    return Response.json({
      ok: true,
      data: feedbackData,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    }, { status: 500 });
  }
}
```

---

## 穴埋め関連API

### GET /api/tasks/:taskId/fill-in-questions

**説明**: 穴埋め問題生成

**リクエスト**:
```typescript
{
  attempt_id: string;
}
```

**レスポンス**:
```typescript
ApiResponse<FillInQuestion[]>
```

**実装**:
```typescript
// app/api/tasks/[taskId]/fill-in-questions/route.ts
export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const attempt_id = searchParams.get('attempt_id');
    
    if (!attempt_id) {
      return Response.json({
        ok: false,
        error: { code: 'BAD_REQUEST', message: 'attempt_id is required' },
      }, { status: 400 });
    }
    
    // ユーザーの回答取得
    const supabase = createClient();
    const { data: attempt } = await supabase
      .from('attempts')
      .select('draft_content')
      .eq('id', attempt_id)
      .single();
    
    // LLMで穴埋め問題生成（簡易版: 弱点分析）
    // TODO: LLM呼び出し（CC/LR/GRA のいずれか1〜3問）
    
    // 仮の実装（実際はLLMで生成）
    const questions: FillInQuestion[] = [
      {
        id: 'q1',
        attempt_id,
        question_type: 'CC',
        question_text: 'People do not need to commute. [    ] they can save time.',
        options: [
          { id: 'A', text: 'However' },
          { id: 'B', text: 'Therefore' },
          { id: 'C', text: 'Although' },
          { id: 'D', text: 'Meanwhile' },
        ],
        correct_answer: 'B',
      },
    ];
    
    return Response.json({
      ok: true,
      data: questions,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    }, { status: 500 });
  }
}
```

---

### POST /api/tasks/:taskId/fill-in

**説明**: 穴埋め回答送信

**リクエスト**:
```typescript
{
  questions: Array<{
    question_id: string;
    user_answer: string;
  }>;
}
```

**レスポンス**:
```typescript
ApiResponse<{
  results: Array<{
    question_id: string;
    is_correct: boolean;
  }>;
  next_step: 'feedback';
}>
```

---

## 書き直し関連API

### POST /api/tasks/:taskId/rewrite

**説明**: 書き直し回答送信・再評価

**リクエスト**:
```typescript
{
  attempt_id: string;
  revised_content: {
    target_id: string;
    revised_text: string;
  }[];
}
```

**レスポンス**:
```typescript
ApiResponse<{
  feedback_id: string;
  feedback: Feedback;
}>
```

**実装**:
```typescript
// app/api/tasks/[taskId]/rewrite/route.ts
import { buildRewriteCoachPrompt } from '@/lib/llm/prompts/rewrite_coach';
import { callLLMWithRetry } from '@/lib/llm/client';

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
): Promise<Response> {
  try {
    const { attempt_id, revised_content } = await request.json();
    
    const supabase = createClient();
    
    // 元の回答とフィードバック取得
    const { data: attempt } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', attempt_id)
      .single();
    
    const { data: originalFeedback } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('attempt_id', attempt_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // タスク取得
    const { data: task } = await supabase
      .from('tasks')
      .select('question')
      .eq('id', params.taskId)
      .single();
    
    // LLMで再評価
    const prompt = buildRewriteCoachPrompt(
      task.question,
      attempt.draft_content.final,
      originalFeedback.rewrite_targets,
      revised_content.map((r: any) => r.revised_text).join(' '),
      attempt.level,
      params.taskId,
      attempt_id,
      originalFeedback.id
    );
    
    const feedbackData = await callLLMWithRetry(prompt, {
      response_format: { type: 'json_object' },
    });
    
    // 新しいフィードバック保存
    const { data: newFeedback } = await supabase
      .from('feedbacks')
      .insert({
        attempt_id,
        overall_band_range: feedbackData.overall_band_range,
        dimensions: feedbackData.dimensions,
        strengths: feedbackData.strengths,
        band_up_actions: feedbackData.band_up_actions,
        rewrite_targets: feedbackData.rewrite_targets,
        vocab_suggestions: feedbackData.vocab_suggestions,
        metadata: feedbackData.metadata,
        parent_feedback_id: originalFeedback.id,
        is_rewrite: true,
      })
      .select()
      .single();
    
    // revisionsテーブルに保存
    await supabase
      .from('revisions')
      .insert({
        attempt_id,
        feedback_id: newFeedback.id,
        revised_content,
      });
    
    // attemptsテーブル更新
    await supabase
      .from('attempts')
      .update({
        rewrite_count: attempt.rewrite_count + 1,
        status: 'rewritten',
      })
      .eq('id', attempt_id);
    
    return Response.json({
      ok: true,
      data: {
        feedback_id: newFeedback.id,
        feedback: feedbackData,
      },
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: { code: 'LLM_ERROR', message: error.message },
    }, { status: 500 });
  }
}
```

---

## Speaking関連API

### POST /api/llm/generate-speaking-prompt

**説明**: Speakingプロンプト生成

**リクエスト**:
```typescript
{
  task_id: string;
  attempt_id: string;
}
```

**レスポンス**:
```typescript
ApiResponse<SpeakingPrompt>
```

**実装**:
```typescript
// app/api/llm/generate-speaking-prompt/route.ts
import { generateSpeakingPrompt } from '@/lib/llm/prompts/writing_to_speaking';

export async function POST(request: Request): Promise<Response> {
  try {
    const { task_id, attempt_id } = await request.json();
    
    const supabase = createClient();
    
    // タスクと回答取得
    const { data: task } = await supabase
      .from('tasks')
      .select('question, required_vocab')
      .eq('id', task_id)
      .single();
    
    const { data: attempt } = await supabase
      .from('attempts')
      .select('draft_content')
      .eq('id', attempt_id)
      .single();
    
    // LLMでプロンプト生成
    const promptData = await generateSpeakingPrompt(
      task.question,
      attempt.draft_content.final,
      task.required_vocab
    );
    
    // speaking_promptsテーブルに保存（将来用、MVPでは簡易）
    
    return Response.json({
      ok: true,
      data: promptData,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: { code: 'LLM_ERROR', message: error.message },
    }, { status: 500 });
  }
}
```

---

## 単語学習関連API

### GET /api/vocab/today-required

**説明**: 今日の必須語彙取得

**レスポンス**:
```typescript
ApiResponse<RequiredVocab[]>
```

---

### GET /api/vocab/questions

**説明**: 選択式問題生成（10問）

**リクエスト**:
```typescript
{
  focus_vocab?: string[]; // 必須語彙を優先
}
```

**レスポンス**:
```typescript
ApiResponse<VocabQuestion[]>
```

---

### POST /api/vocab/submit

**説明**: 回答送信

**リクエスト**:
```typescript
{
  questions: VocabQuestion[];
  answers: VocabAnswer[];
}
```

**レスポンス**:
```typescript
ApiResponse<{
  score: number;
  results: Array<{
    question_id: string;
    is_correct: boolean;
  }>;
}>
```

---

## 進捗関連API

### GET /api/progress/summary

**説明**: 進捗サマリー取得

**レスポンス**:
```typescript
ApiResponse<ProgressSummary>
```

---

### GET /api/progress/history

**説明**: タスク履歴取得

**リクエスト** (Query Parameters):
```typescript
{
  level?: 'beginner' | 'intermediate' | 'advanced';
  period?: 'week' | 'month' | 'all';
  weakness_tag?: 'TR' | 'CC' | 'LR' | 'GRA';
}
```

**レスポンス**:
```typescript
ApiResponse<AttemptHistory[]>
```

---

### GET /api/progress/weakness-trend

**説明**: 弱点推移データ取得（テキスト表示用）

**レスポンス**:
```typescript
ApiResponse<WeaknessTrend[]>
```

---

## エラーハンドリング共通関数

```typescript
// lib/api/error-handler.ts
export function handleApiError(error: unknown): ApiResponse<never> {
  if (error instanceof Error) {
    return {
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message,
      },
    };
  }
  
  return {
    ok: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    },
  };
}
```

