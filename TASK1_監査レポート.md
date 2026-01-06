# Task 1 Step Learning 機能 監査レポート

## 1) 現在の実装状況サマリー（仕様に対する達成/未達）

| 項目 | 達成 | 根拠（ファイル/関数/行番号） |
|------|------|------------------------------|
| 1. Step1入力UI | YES | `components/task1/Task1Flow.tsx:257-269` - textareaでStep1入力可能 |
| 2. Step2入力UI | YES | `components/task1/Task1Flow.tsx:257-269` - 同じtextareaでStep2入力可能（currentStepで切り替え） |
| 3. Step3入力UI | YES | `components/task1/Task1Flow.tsx:257-269` - 同じtextareaでStep3入力可能 |
| 4. Step4入力UI | YES | `components/task1/Task1Flow.tsx:257-269` - 同じtextareaでStep4入力可能 |
| 5. Step5入力UI | YES | `components/task1/Task1Flow.tsx:257-269` - 同じtextareaでStep5入力可能 |
| 6. Step5レビューのトリガーUI | YES | `components/task1/Task1Flow.tsx:272-279` - Step5完了時に「レビューを実行」ボタン表示 |
| 7. StepレビューAPI呼び出し | YES | `components/task1/Task1Flow.tsx:126-149` - `handleStep5Complete`で`/api/task1/review/steps`を呼び出し |
| 8. Stepレビュー結果表示 | YES | `components/task1/Task1Flow.tsx:309-323` - `StepReviewPanel`で表示 |
| 9. 修正適用（Apply）でstep*_fixedに保存 | **NO** | `components/task1/Task1Flow.tsx:312-321` - `onApply`内に`// TODO: API呼び出し`コメントあり。`step1_fixed`等への保存処理が未実装 |
| 10. Step6入力UI | YES | `components/task1/Task1Flow.tsx:257-269` - 同じtextareaでStep6入力可能（rows=15） |
| 11. Step6最終レビューのトリガーUI | YES | `components/task1/Task1Flow.tsx:282-289` - Step6完了時に「最終レビューを実行」ボタン表示 |
| 12. FinalレビューAPI呼び出し | YES | `components/task1/Task1Flow.tsx:152-175` - `handleStep6Complete`で`/api/task1/review/final`を呼び出し |
| 13. Finalレビュー表示（文単位ハイライト） | YES | `components/task1/FinalReviewPanel.tsx:31-64` - `sentence_highlights`をマップして表示 |
| 14. create-or-resumeで途中再開 | YES | `app/task/[taskId]/page.tsx:56-78` - Task 1の場合に自動で`/api/task1/attempts/create-or-resume`を呼び出し |
| 15. save-stepで自動保存 | YES | `components/task1/Task1Flow.tsx:82-123` - `saveStepDebounced`で1秒デバウンス後に自動保存 |
| 16. Training/Exam切替（Examでヒント非表示） | 部分 | `components/task1/Task1Flow.tsx:268` - ExamモードでStep1-5が無入力時はdisabled。ただし、ヒント（比較フレーズ集等）の非表示は`mode === 'training'`で制御されている（340行目） |
| 17. Examタイマー（UI/状態保存） | NO | `components/task1/Task1Flow.tsx` - タイマー関連のUI/ロジックが未実装。`stepState.timers`は定義されているが使用されていない |

---

## 2) 該当コードの"証拠"スニペット

### Task1Flow の Step state 管理

```ts:components/task1/Task1Flow.tsx
// 40-45行目: Step state管理
const [currentStep, setCurrentStep] = useState(1);
const [stepContent, setStepContent] = useState<Record<number, string>>({});
const [saving, setSaving] = useState(false);
const [reviewState, setReviewState] = useState<Task1ReviewState | null>(null);
const [showStepReview, setShowStepReview] = useState(false);
const [showFinalReview, setShowFinalReview] = useState(false);

const stepState = attempt?.step_state as Task1StepState | undefined;
```

```ts:components/task1/Task1Flow.tsx
// 56-79行目: attemptからstepContentを復元
useEffect(() => {
  if (stepState && attempt) {
    const content: Record<number, string> = {};
    if (stepState.step1) content[1] = stepState.step1;
    if (stepState.step2) content[2] = stepState.step2;
    if (stepState.step3) content[3] = stepState.step3;
    if (stepState.step4) content[4] = stepState.step4;
    if (stepState.step5) content[5] = stepState.step5;
    if (stepState.step6) content[6] = stepState.step6;
    setStepContent(content);
    // ... レビュー状態の復元
  }
}, [attempt, stepState]);
```

### Step5完了→レビュー画面に入る条件分岐

```ts:components/task1/Task1Flow.tsx
// 271-279行目: Step5完了ボタン
{currentStep === 5 && stepContent[5] && (
  <button
    onClick={handleStep5Complete}
    className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
  >
    レビューを実行
  </button>
)}
```

### review/steps の呼び出し関数

```ts:components/task1/Task1Flow.tsx
// 126-149行目: Step5完了時にレビューを実行
const handleStep5Complete = async () => {
  if (!attempt) return;

  try {
    const response = await fetch('/api/task1/review/steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attempt_id: attempt.id }),
    });

    if (!response.ok) {
      throw new Error('Failed to review steps');
    }

    const data = await response.json();
    if (data.ok) {
      setReviewState(data.data.review);
      setShowStepReview(true);
      onAttemptChange(data.data.attempt);
    }
  } catch (error) {
    console.error('Failed to review steps:', error);
  }
};
```

### StepReviewPanel の props と "Apply" 実装

```ts:components/task1/StepReviewPanel.tsx
// 16-32行目: Apply実装
export function StepReviewPanel({ feedback, onApply }: StepReviewPanelProps) {
  const [fixedSteps, setFixedSteps] = useState<Record<string, string>>({});

  const handleApply = () => {
    // 修正を適用する前に、各Stepの修正版をfixedStepsに設定
    const appliedSteps: Record<string, string> = {};
    feedback.step_feedbacks.forEach((stepFeedback) => {
      if (!stepFeedback.is_valid && stepFeedback.issues.length > 0) {
        // 最初のissueのexample_afterがあれば使用、なければ元のテキスト
        const fixedText = stepFeedback.issues[0]?.example_after || '';
        if (fixedText) {
          appliedSteps[String(stepFeedback.step_index)] = fixedText;
        }
      }
    });
    onApply(appliedSteps);
  };
```

```ts:components/task1/Task1Flow.tsx
// 309-323行目: StepReviewPanelの使用（修正適用処理が未実装）
{showStepReview && reviewState?.step_review?.feedback_payload && (
  <StepReviewPanel
    feedback={reviewState.step_review.feedback_payload}
    onApply={(fixedSteps) => {
      // 修正を適用
      const updatedContent = { ...stepContent };
      Object.entries(fixedSteps).forEach(([step, content]) => {
        updatedContent[parseInt(step)] = content as string;
      });
      setStepContent(updatedContent);
      // データベースに保存
      // TODO: API呼び出し
    }}
  />
)}
```

**問題点**: `onApply`内で`stepContent`を更新しているが、`step1_fixed`等への保存処理が未実装。また、Step6への遷移処理も未実装。

### Step6完了→review/final 呼び出し箇所

```ts:components/task1/Task1Flow.tsx
// 152-175行目: Step6完了時に最終レビューを実行
const handleStep6Complete = async () => {
  if (!attempt) return;

  try {
    const response = await fetch('/api/task1/review/final', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attempt_id: attempt.id }),
    });

    if (!response.ok) {
      throw new Error('Failed to review final');
    }

    const data = await response.json();
    if (data.ok) {
      setReviewState(data.data.review);
      setShowFinalReview(true);
      onAttemptChange(data.data.attempt);
    }
  } catch (error) {
    console.error('Failed to review final:', error);
  }
};
```

### FinalReviewPanel のレンダリング

```ts:components/task1/FinalReviewPanel.tsx
// 15-64行目: 文単位ハイライト表示
export function FinalReviewPanel({ feedback, finalResponse }: FinalReviewPanelProps) {
  // 文単位で分割
  const sentences = finalResponse.split(/[.!?]+/).filter(s => s.trim().length > 0);

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
      {/* ... */}
      {/* 文単位ハイライト */}
      <div className="mb-4 space-y-2">
        <h4 className="font-semibold">文単位フィードバック</h4>
        {feedback.sentence_highlights.map((highlight, index) => (
          <div key={index} className="rounded border border-gray-200 bg-white p-3">
            <div className="mb-1 flex items-center gap-2">
              {highlight.tags.map((tag) => (
                <span key={tag} className={`rounded px-2 py-1 text-xs font-semibold ${...}`}>
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-700">{highlight.sentence_text}</p>
            <p className="mt-1 text-xs text-gray-600">{highlight.comment}</p>
            {highlight.suggested_rewrite && (
              <div className="mt-2 rounded bg-gray-50 p-2">
                <p className="text-xs text-gray-500">提案:</p>
                <p className="text-sm text-gray-700">{highlight.suggested_rewrite}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* ... */}
    </div>
  );
}
```

### create-or-resume の呼び出し箇所

```ts:app/task/[taskId]/page.tsx
// 48-83行目: Task 1の場合はattemptを作成または再開
fetch(`/api/tasks/${taskId}`)
  .then((res) => res.json())
  .then(async (data) => {
    if (data.ok) {
      setTask(data.data);
      setLevel(data.data.level);

      // Task 1の場合はattemptを作成または再開
      if (data.data.question_type === 'Task 1') {
        try {
          const attemptRes = await fetch('/api/task1/attempts/create-or-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              task_id: taskId,
              level: data.data.level,
              mode: 'training', // デフォルトはtraining
            }),
          });

          if (attemptRes.ok) {
            const attemptData = await attemptRes.json();
            if (attemptData.ok) {
              setAttempt(attemptData.data);
              setMode(attemptData.data.mode || 'training');
            }
          }
        } catch (error) {
          console.error('Failed to create/resume attempt:', error);
        }
      }
    }
  })
  .catch(console.error)
  .finally(() => setLoading(false));
```

### save-step の呼び出し（debounce含む）

```ts:components/task1/Task1Flow.tsx
// 82-123行目: Step保存（デバウンス付き）
const saveStepDebounced = useCallback(
  (() => {
    let timeoutId: NodeJS.Timeout | null = null;
    return async (stepIndex: number, content: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(async () => {
        if (!attempt) return;
        setSaving(true);
        try {
          const response = await fetch(`/api/task1/attempts/save-step`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              attempt_id: attempt.id,
              step_index: stepIndex,
              content,
              observations,
              key_numbers: keyNumbers,
              checklist: evaluateChecklist(content),
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save step');
          }

          const data = await response.json();
          if (data.ok && data.data.attempt) {
            onAttemptChange(data.data.attempt);
          }
        } catch (error) {
          console.error('Failed to save step:', error);
        } finally {
          setSaving(false);
        }
      }, 1000); // 1秒デバウンス
    };
  })(),
  [attempt, observations, keyNumbers, onAttemptChange]
);
```

```ts:components/task1/Task1Flow.tsx
// 257-264行目: textareaのonChangeで自動保存
<textarea
  value={currentContent}
  onChange={(e) => {
    const newContent = { ...stepContent, [currentStep]: e.target.value };
    setStepContent(newContent);
    // デバウンス付きで保存
    saveStepDebounced(currentStep, e.target.value);
  }}
  // ...
/>
```

### /app/task/[taskId]/page.tsx の Task1Flow への分岐

```ts:app/task/[taskId]/page.tsx
// 220-273行目: Task 1の場合はStep Learning Flowを表示
// Task 1の場合はStep Learning Flowを表示
if (task.question_type === 'Task 1' && attempt) {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* ... */}
        <Task1Flow
          task={task}
          attempt={attempt}
          mode={mode}
          onAttemptChange={(updatedAttempt) => setAttempt(updatedAttempt)}
        />
      </div>
    </Layout>
  );
}
```

---

## 3) APIの実在確認（Routeとレスポンス）

### app/api/task1/attempts/create-or-resume/route.ts

**存在**: ✅ 存在する

**主要ロジック**:
- 認証チェック（15-23行目）
- リクエストバリデーション（30-37行目: `CreateOrResumeAttemptRequestSchema`）
- タスク存在確認（42-62行目）
- 既存attempt検索（64-74行目: `status='draft'`で検索）
- 既存があれば返す（85-88行目）
- 新規作成（90-113行目: `step_state`と`review_state`を初期化）

**期待request**:
```json
{
  "task_id": "uuid",
  "level": "beginner" | "intermediate" | "advanced",
  "mode": "training" | "exam"
}
```

**期待response**:
```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "task_id": "uuid",
    "task_type": "Task 1",
    "mode": "training" | "exam",
    "level": "beginner" | "intermediate" | "advanced",
    "step_state": { "observations": [], "key_numbers": [], "checklist": {}, "timers": {} },
    "review_state": { "step_review": { "status": "pending" }, "final_review": { "status": "pending" } },
    "status": "draft",
    ...
  }
}
```

**zod validate**: ✅ `CreateOrResumeAttemptRequestSchema`でバリデーション（30行目）

**失敗時の挙動**: 401（認証エラー）、400（バリデーション/タスクタイプエラー）、404（タスク未存在）、500（DBエラー）

---

### app/api/task1/attempts/save-step/route.ts

**存在**: ✅ 存在する

**主要ロジック**:
- 認証チェック（16-24行目）
- リクエストバリデーション（31-38行目: `SaveStepRequestSchema`）
- Attempt存在確認（43-57行目）
- `step_state`更新（59-69行目: `step${step_index}`にcontentを保存）
- 語数・段落数計算（71-78行目: Step6の場合のみ）
- DB更新（81-89行目）

**期待request**:
```json
{
  "attempt_id": "uuid",
  "step_index": 1 | 2 | 3 | 4 | 5 | 6,
  "content": "string",
  "observations": "array (optional)",
  "key_numbers": "array (optional)",
  "checklist": "object (optional)"
}
```

**期待response**:
```json
{
  "ok": true,
  "data": {
    "attempt": { ... },
    "word_count": "number (Step6のみ)",
    "paragraph_count": "number (Step6のみ)"
  }
}
```

**zod validate**: ✅ `SaveStepRequestSchema`でバリデーション（31行目）

**失敗時の挙動**: 401（認証エラー）、400（バリデーションエラー）、404（Attempt未存在）、500（DBエラー）

---

### app/api/task1/review/steps/route.ts

**存在**: ✅ 存在する

**主要ロジック**:
- 認証チェック（19-27行目）
- リクエストバリデーション（34-41行目: `ReviewStepsRequestSchema`）
- AttemptとTask取得（46-76行目: JOINでtasks取得）
- Step1-5の完了確認（83-89行目: すべて必須）
- LLM呼び出し（95-122行目: `buildTask1StepReviewPrompt` + `callLLM` + `parseLLMResponseWithRetry`）
- Zodバリデーション（110行目: `Task1StepReviewFeedbackSchema`）
- `review_state`更新（124-151行目: `step_review.status = 'completed'`）

**期待request**:
```json
{
  "attempt_id": "uuid"
}
```

**期待response**:
```json
{
  "ok": true,
  "data": {
    "review": {
      "schema_version": "1.0",
      "step_feedbacks": [...],
      "top_priority_fix": {...},
      "number_validation": {...}
    },
    "attempt": { ... }
  }
}
```

**zod validate**: ✅ `ReviewStepsRequestSchema`（34行目）と`Task1StepReviewFeedbackSchema`（110行目）

**失敗時の挙動**: 401（認証エラー）、400（バリデーション/Step未完了）、404（Attempt未存在）、500（LLMエラー/DBエラー）

---

### app/api/task1/review/final/route.ts

**存在**: ✅ 存在する

**主要ロジック**:
- 認証チェック（19-27行目）
- リクエストバリデーション（34-41行目: `ReviewFinalRequestSchema`）
- AttemptとTask取得（46-76行目）
- Step6完了確認（81-87行目）
- LLM呼び出し（95-137行目: `buildTask1FinalReviewPrompt` + `callLLM` + `parseLLMResponseWithRetry`）
- metadata補完（111-122行目）
- Zodバリデーション（125行目: `Task1FinalReviewFeedbackSchema`）
- `user_skill_stats`更新（150-200行目: 弱点カウンター更新）
- `review_state`更新（139-148行目: `final_review.status = 'completed'`）
- `attempts.status = 'submitted'`更新（203-213行目）

**期待request**:
```json
{
  "attempt_id": "uuid"
}
```

**期待response**:
```json
{
  "ok": true,
  "data": {
    "review": {
      "schema_version": "1.0",
      "overall_band_range": "6.0-6.5",
      "dimensions": [...],
      "sentence_highlights": [...],
      ...
    },
    "attempt": { ... }
  }
}
```

**zod validate**: ✅ `ReviewFinalRequestSchema`（34行目）と`Task1FinalReviewFeedbackSchema`（125行目）

**失敗時の挙動**: 401（認証エラー）、400（バリデーション/Step6未完了）、404（Attempt未存在）、500（LLMエラー/DBエラー）

---

### app/api/task1/recommendation/route.ts

**存在**: ✅ 存在する

**主要ロジック**:
- 認証チェック（15-22行目）
- `user_skill_stats`取得（27-33行目）
- 直近attempt取得（36-43行目: `task_type='Task 1'`、`status='submitted'`）
- 弱点分析（46-60行目: カウンターから弱点を特定）
- レベル推薦（63-86行目: 直近attemptから推測、弱点が多い場合は1つ下げる）
- ジャンル推薦（90-100行目: 弱点に応じて）
- モード推薦（103行目: 弱点が多い場合はtraining）

**期待request**: なし（GET）

**期待response**:
```json
{
  "ok": true,
  "data": {
    "level": "beginner" | "intermediate" | "advanced",
    "genre": "string | null",
    "mode": "training" | "exam",
    "weaknesses": ["string"],
    "reasoning": { ... }
  }
}
```

**zod validate**: ❌ なし（GETなのでリクエストバリデーション不要、レスポンスバリデーションもなし）

**失敗時の挙動**: 401（認証エラー）、500（DBエラー）

---

## 4) DB状態の確認（Supabase）

### migrations/002_task1_step_learning.sql の実内容

**ファイル**: `supabase/migrations/002_task1_step_learning.sql`

**attemptsテーブルに追加されたカラム**:
```sql
-- 7-11行目
ALTER TABLE attempts
  ADD COLUMN IF NOT EXISTS task_type TEXT CHECK (task_type IN ('Task 1', 'Task 2')),
  ADD COLUMN IF NOT EXISTS mode TEXT CHECK (mode IN ('training', 'exam')),
  ADD COLUMN IF NOT EXISTS step_state JSONB,
  ADD COLUMN IF NOT EXISTS review_state JSONB;
```

- `task_type`: Task 1 or Task 2（デフォルト: 'Task 2'）
- `mode`: training or exam
- `step_state`: JSONB（step1-6、step1_fixed-step5_fixed、observations、key_numbers、checklist、timers）
- `review_state`: JSONB（step_review、final_review）

**user_skill_statsテーブルの定義**:
```sql
-- 23-27行目
CREATE TABLE IF NOT EXISTS user_skill_stats (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  counters JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS/Policy**:
```sql
-- 32-36行目
ALTER TABLE user_skill_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own skill stats" ON user_skill_stats
  FOR ALL USING (auth.uid() = user_id);
```

**インデックス**:
```sql
-- 18-20行目
CREATE INDEX IF NOT EXISTS idx_attempts_task_type ON attempts(task_type);
CREATE INDEX IF NOT EXISTS idx_attempts_mode ON attempts(mode);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);
```

### マイグレーション適用状況の確認手順

**確認方法**:
1. Supabase Dashboardでテーブル構造を確認
2. `psql`で`\d attempts`を実行してカラム一覧を確認
3. `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'attempts' AND column_name IN ('task_type', 'mode', 'step_state', 'review_state');`を実行

**現状の結果**: **未確認**（ローカル/本番環境へのアクセスが必要）

**注意**: マイグレーションが未適用の場合、以下のエラーが発生する可能性がある:
- `attempts`テーブルに`task_type`、`mode`、`step_state`、`review_state`カラムが存在しない
- `user_skill_stats`テーブルが存在しない
- API呼び出し時に`column "task_type" does not exist`等のエラー

---

## 5) 実際に"できていない"現象の特定

### 現象1: Step5レビュー後の修正適用が保存されない

**再現手順**:
1. `/task/[taskId]`にアクセス（Task 1タスク）
2. Step1-5を入力
3. Step5で「レビューを実行」ボタンをクリック
4. StepReviewPanelが表示される
5. 「修正を適用してStep 6へ進む」ボタンをクリック

**期待挙動**:
- 修正内容が`step1_fixed`〜`step5_fixed`に保存される
- Step6に自動遷移する
- 修正内容がStep6の入力欄に反映される

**実際の挙動**:
- `stepContent`のstateは更新されるが、DBには保存されない
- Step6への自動遷移が発生しない
- 修正内容が失われる可能性がある

**ブラウザコンソールエラー**: なし（エラーは出ないが、保存処理が実行されない）

**Networkログ**: 
- `POST /api/task1/attempts/save-step`が呼ばれない（修正適用時）

**サーバログ**: なし（API呼び出しがないため）

**確定原因**: 
- `components/task1/Task1Flow.tsx:312-321` - `onApply`内に`// TODO: API呼び出し`コメントがあり、修正適用の保存処理が未実装
- `step1_fixed`〜`step5_fixed`への保存処理が未実装
- Step6への自動遷移処理が未実装

**影響範囲**: 
- Step5レビュー後の修正適用が機能しない
- ユーザーが手動でStep6に遷移する必要がある
- 修正内容が失われる可能性がある

---

### 現象2: Examモードのタイマーが未実装

**再現手順**:
1. `/task/[taskId]`にアクセス（Task 1タスク）
2. Training/Exam切替ボタンでExamモードに切り替え

**期待挙動**:
- タイマーが表示される
- 経過時間が`step_state.timers`に保存される

**実際の挙動**:
- タイマーが表示されない
- タイマー関連のUI/ロジックが存在しない

**確定原因**: 
- `components/task1/Task1Flow.tsx` - タイマー関連のUI/ロジックが未実装
- `stepState.timers`は定義されているが使用されていない

**影響範囲**: 
- Examモードでタイマー機能が使えない
- 時間管理ができない

---

### 現象3: マイグレーション未適用の可能性

**再現手順**:
1. `/task/[taskId]`にアクセス（Task 1タスク）
2. `create-or-resume` APIが呼ばれる

**期待挙動**:
- Attemptが正常に作成/取得される

**実際の挙動**: **未確認**（DB状態に依存）

**確定原因**: 
- `supabase/migrations/002_task1_step_learning.sql`が未適用の場合、`attempts`テーブルに`task_type`、`mode`、`step_state`、`review_state`カラムが存在しない
- API呼び出し時に`column "task_type" does not exist`エラーが発生する可能性

**影響範囲**: 
- Task 1機能全体が動作しない
- すべてのAPIエンドポイントが失敗する可能性

---

## 6) "最短で直すための差分"候補

### 修正1: Step5レビュー後の修正適用処理を実装

**直すべきファイル**: `components/task1/Task1Flow.tsx`

**直すべき具体行**: 312-321行目

**どう直すか**:
1. `onApply`内で、修正内容を`step1_fixed`〜`step5_fixed`に保存するAPI呼び出しを追加
2. `save-step` APIを呼び出して、`step_state`に`step1_fixed`等を追加
3. 保存成功後、`setCurrentStep(6)`でStep6に自動遷移
4. `setShowStepReview(false)`でレビューパネルを非表示

**コード例**:
```ts
onApply={async (fixedSteps) => {
  if (!attempt) return;
  
  // step_stateを更新（step1_fixed等を追加）
  const updatedStepState = {
    ...stepState,
    ...Object.entries(fixedSteps).reduce((acc, [step, content]) => {
      acc[`step${step}_fixed`] = content;
      return acc;
    }, {} as Record<string, string>),
  };
  
  // API呼び出しで保存
  try {
    const response = await fetch(`/api/task1/attempts/save-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attempt_id: attempt.id,
        step_index: 6, // Step6に進む準備
        content: stepContent[6] || '',
        observations,
        key_numbers: keyNumbers,
        checklist: evaluateChecklist(stepContent[6] || ''),
        // step_state全体を更新（step1_fixed等を含む）
        step_state: updatedStepState,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.ok && data.data.attempt) {
        onAttemptChange(data.data.attempt);
        setCurrentStep(6);
        setShowStepReview(false);
      }
    }
  } catch (error) {
    console.error('Failed to apply fixes:', error);
  }
}}
```

**注意**: `save-step` APIは`step_index`に応じて`step${step_index}`のみを更新するため、`step1_fixed`等を保存するには、API側の修正も必要（または、別のAPIエンドポイントを作成）。

---

### 修正2: save-step APIでstep*_fixedを保存できるようにする

**直すべきファイル**: `app/api/task1/attempts/save-step/route.ts`

**直すべき具体行**: 59-69行目

**どう直すか**:
1. リクエストに`fixed_steps`（`Record<string, string>`）を追加
2. `step_state`更新時に、`fixed_steps`の内容を`step1_fixed`〜`step5_fixed`に保存

**コード例**:
```ts
const { attempt_id, step_index, content, observations, key_numbers, checklist, fixed_steps } = validationResult.data;

const updatedStepState = {
  ...currentStepState,
  [stepKey]: content,
  ...(observations !== undefined && { observations }),
  ...(key_numbers !== undefined && { key_numbers }),
  ...(checklist !== undefined && { checklist }),
  ...(fixed_steps && Object.entries(fixed_steps).reduce((acc, [step, fixedContent]) => {
    acc[`step${step}_fixed`] = fixedContent;
    return acc;
  }, {} as Record<string, string>)),
};
```

**Zodスキーマ修正**: `lib/validators/task1.ts`の`SaveStepRequestSchema`に`fixed_steps`を追加

---

### 修正3: Examモードのタイマー実装

**直すべきファイル**: `components/task1/Task1Flow.tsx`

**直すべき具体行**: 新規追加

**どう直すか**:
1. `useState`でタイマー状態を管理（`startTime`、`elapsedSeconds`）
2. `useEffect`で`setInterval`を使って1秒ごとに経過時間を更新
3. Examモードの場合のみタイマーを表示
4. Step遷移時に`step_state.timers`に保存

**コード例**:
```ts
const [timerStart, setTimerStart] = useState<number | null>(null);
const [elapsedSeconds, setElapsedSeconds] = useState(0);

useEffect(() => {
  if (mode === 'exam' && !timerStart) {
    setTimerStart(Date.now());
  }
}, [mode]);

useEffect(() => {
  if (mode === 'exam' && timerStart) {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - timerStart) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }
}, [mode, timerStart]);
```

---

## まとめ

### 主要な未実装項目

1. **Step5レビュー後の修正適用処理**（最重要）
   - `step1_fixed`〜`step5_fixed`への保存が未実装
   - Step6への自動遷移が未実装

2. **Examモードのタイマー**
   - UI/ロジックが未実装

3. **マイグレーション適用状況**
   - 未確認（適用されていない場合、全機能が動作しない）

### 実装済み項目

- Step1-6の入力UI
- Step5/Step6のレビューAPI呼び出し
- Stepレビュー結果表示
- Finalレビュー表示（文単位ハイライト）
- 途中再開機能
- 自動保存機能
- Training/Exam切替（ヒント非表示は部分的に実装）

### 次のアクション

1. **マイグレーション適用確認**（最優先）
2. **修正適用処理の実装**（Step5レビュー後）
3. **Examタイマーの実装**（オプション）

