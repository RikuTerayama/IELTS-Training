# Task 1 Step Learning 修正完了レポート

## 変更ファイル一覧

1. `app/api/task1/attempts/apply-step-fixes/route.ts` (新規作成)
2. `lib/validators/task1.ts` (拡張: `ApplyStepFixesRequestSchema`追加)
3. `components/task1/StepReviewPanel.tsx` (修正: `originalSteps` prop追加、空文字列防止)
4. `components/task1/Task1Flow.tsx` (修正: `onApply`実装、Step6自動遷移)
5. `app/task/[taskId]/page.tsx` (修正: Examモード対応、Suspense追加)
6. `app/training/writing/task1/page.tsx` (修正: 推薦タスク開始時にmodeクエリ追加)
7. `app/training/writing/task1/progress/page.tsx` (修正: 推薦タスク開始時にmodeクエリ追加)

---

## 主要なコード変更

### 1. apply-step-fixes APIエンドポイント（新規）

```ts:app/api/task1/attempts/apply-step-fixes/route.ts
/**
 * POST /api/task1/attempts/apply-step-fixes
 * Step5レビュー後の修正を適用してstep*_fixedに保存
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ApplyStepFixesRequestSchema } from '@/lib/validators/task1';
import type { Task1StepState } from '@/lib/domain/types';

export async function POST(request: Request): Promise<Response> {
  // 認証チェック
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json(errorResponse('UNAUTHORIZED', 'Not authenticated'), { status: 401 });
  }

  const requestBody = await request.json();
  const validationResult = ApplyStepFixesRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return Response.json(errorResponse('BAD_REQUEST', 'Invalid request body', validationResult.error), { status: 400 });
  }

  const { attempt_id, fixed_steps } = validationResult.data;

  // Attempt存在確認
  const { data: attempt, error: attemptError } = await supabase
    .from('attempts')
    .select('*')
    .eq('id', attempt_id)
    .eq('user_id', user.id)
    .eq('task_type', 'Task 1')
    .single();

  if (attemptError || !attempt) {
    return Response.json(errorResponse('NOT_FOUND', 'Attempt not found'), { status: 404 });
  }

  // step_stateを取得してstep*_fixedをマージ
  const currentStepState = (attempt.step_state || {}) as Task1StepState;
  const updatedStepState: Task1StepState = {
    ...currentStepState,
    step1_fixed: fixed_steps['1'] || currentStepState.step1_fixed,
    step2_fixed: fixed_steps['2'] || currentStepState.step2_fixed,
    step3_fixed: fixed_steps['3'] || currentStepState.step3_fixed,
    step4_fixed: fixed_steps['4'] || currentStepState.step4_fixed,
    step5_fixed: fixed_steps['5'] || currentStepState.step5_fixed,
    // 既存のobservations、key_numbers、checklist、timersを保持
    observations: currentStepState.observations,
    key_numbers: currentStepState.key_numbers,
    checklist: currentStepState.checklist,
    timers: currentStepState.timers,
  };

  // DB更新
  const { data: updatedAttempt, error: updateError } = await supabase
    .from('attempts')
    .update({
      step_state: updatedStepState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', attempt_id)
    .select()
    .single();

  if (updateError) {
    return Response.json(errorResponse('DATABASE_ERROR', updateError.message || 'Failed to apply fixes'), { status: 500 });
  }

  return Response.json(successResponse({ attempt: updatedAttempt }));
}
```

**要点**:
- 認証チェック
- Zodバリデーション
- `step*_fixed`をマージ（既存のstep1-6、observations等は保持）
- 更新されたattemptを返す

---

### 2. Zodスキーマ追加

```ts:lib/validators/task1.ts
export const ApplyStepFixesRequestSchema = z.object({
  attempt_id: z.string().uuid(),
  fixed_steps: z.record(
    z.union([z.literal('1'), z.literal('2'), z.literal('3'), z.literal('4'), z.literal('5')]),
    z.string().min(1) // 空文字列を許可しない
  ),
});
```

---

### 3. StepReviewPanel修正（空文字列防止）

```ts:components/task1/StepReviewPanel.tsx
interface StepReviewPanelProps {
  feedback: Task1StepReviewFeedback;
  originalSteps: Record<number, string>; // 元のStep内容（フォールバック用）
  onApply: (fixedSteps: Record<string, string>) => void;
}

export function StepReviewPanel({ feedback, originalSteps, onApply }: StepReviewPanelProps) {
  const handleApply = () => {
    const appliedSteps: Record<string, string> = {};
    feedback.step_feedbacks.forEach((stepFeedback) => {
      if (!stepFeedback.is_valid && stepFeedback.issues.length > 0) {
        // example_afterがあれば使用、なければ元のテキスト、それもなければ空文字列（この場合は追加しない）
        const fixedText = stepFeedback.issues[0]?.example_after || originalSteps[stepFeedback.step_index] || '';
        // 空文字列でない場合のみ追加
        if (fixedText && fixedText.trim().length > 0) {
          appliedSteps[String(stepFeedback.step_index)] = fixedText;
        }
      }
    });
    onApply(appliedSteps);
  };
  // ...
}
```

**要点**:
- `originalSteps` propを追加
- `example_after`がない場合は元のテキストを使用
- 空文字列は追加しない

---

### 4. Task1Flow onApply実装

```ts:components/task1/Task1Flow.tsx
{showStepReview && reviewState?.step_review?.feedback_payload && (
  <StepReviewPanel
    feedback={reviewState.step_review.feedback_payload}
    originalSteps={stepContent}
    onApply={async (fixedSteps) => {
      if (!attempt) return;

      try {
        // API呼び出しで修正を適用
        const response = await fetch('/api/task1/attempts/apply-step-fixes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attempt_id: attempt.id,
            fixed_steps: fixedSteps,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: { message: 'Failed to apply fixes' } }));
          throw new Error(errorData.error?.message || 'Failed to apply fixes');
        }

        const data = await response.json();
        if (data.ok && data.data.attempt) {
          // 更新されたattemptを反映
          onAttemptChange(data.data.attempt);
          
          // stepContentを更新（修正内容を反映）
          const updatedContent = { ...stepContent };
          Object.entries(fixedSteps).forEach(([step, content]) => {
            updatedContent[parseInt(step)] = content as string;
          });
          setStepContent(updatedContent);
          
          // Step6に自動遷移
          setCurrentStep(6);
          setShowStepReview(false);
          
          console.log('Fixes applied successfully');
        } else {
          throw new Error(data.error?.message || 'Failed to apply fixes');
        }
      } catch (error) {
        console.error('Failed to apply fixes:', error);
        alert(error instanceof Error ? error.message : '修正の適用に失敗しました');
      }
    }}
  />
)}
```

**要点**:
- `/api/task1/attempts/apply-step-fixes`を呼び出し
- 成功時: `onAttemptChange`、`setStepContent`、`setCurrentStep(6)`、`setShowStepReview(false)`
- エラーハンドリング: `alert`でユーザーに通知

---

### 5. Examモード対応（task/[taskId]/page.tsx）

```ts:app/task/[taskId]/page.tsx
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TaskPageContent() {
  const searchParams = useSearchParams();
  // ...
  
  // Task 1の場合はattemptを作成または再開
  if (data.data.question_type === 'Task 1') {
    try {
      // URLクエリパラメータからmodeを取得
      const modeParam = searchParams.get('mode');
      const resolvedMode = modeParam === 'exam' ? 'exam' : 'training';
      
      const attemptRes = await fetch('/api/task1/attempts/create-or-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          level: data.data.level,
          mode: resolvedMode, // URLから取得したmodeを使用
        }),
      });
      // ...
    }
  }
}

export default function TaskPage() {
  return (
    <Suspense fallback={...}>
      <TaskPageContent />
    </Suspense>
  );
}
```

**要点**:
- `useSearchParams`でURLクエリパラメータから`mode`を取得
- `mode=exam`の場合は`exam`、それ以外は`training`
- `Suspense`でラップ（Next.js 14の要件）

---

### 6. 推薦タスク開始時のmodeクエリ追加

```ts:app/training/writing/task1/page.tsx
const generateData = await generateRes.json();
if (generateData.ok) {
  // 推薦されたmodeをURLクエリパラメータに含める
  const modeParam = recommendation.mode === 'exam' ? '?mode=exam' : '';
  router.push(`/task/${generateData.data.id}${modeParam}`);
}
```

```ts:app/training/writing/task1/progress/page.tsx
const generateData = await generateRes.json();
if (generateData.ok) {
  // 推薦されたmodeをURLクエリパラメータに含める
  const modeParam = recommendation.mode === 'exam' ? '?mode=exam' : '';
  router.push(`/task/${generateData.data.id}${modeParam}`);
}
```

**要点**:
- 推薦APIから返された`mode`をURLクエリパラメータに含める
- `/task/[taskId]?mode=exam`で遷移

---

## 手動テスト手順

### テスト1: Step5レビュー後の修正適用

1. `/task/[taskId]`にアクセス（Task 1タスク）
2. Step1-5を入力
3. Step5で「レビューを実行」ボタンをクリック
4. StepReviewPanelが表示されることを確認
5. 「修正を適用してStep 6へ進む」ボタンをクリック
6. **確認項目**:
   - Networkタブで`POST /api/task1/attempts/apply-step-fixes`が呼ばれる
   - レスポンスが`{ ok: true, data: { attempt } }`である
   - Step6に自動遷移する
   - StepReviewPanelが非表示になる
   - ページをリロードしても、`step_state.step1_fixed`等が保存されている

### テスト2: 空文字列防止

1. Step5レビューで、LLMが`example_after`を返さない場合を想定
2. 「修正を適用」をクリック
3. **確認項目**:
   - 元のStep内容が`step*_fixed`に保存される（空文字列ではない）
   - または、そのStepは`appliedSteps`に含まれない

### テスト3: Examモード対応

1. `/training/writing/task1`にアクセス
2. 推薦タスクが`mode: 'exam'`の場合
3. 「推薦タスクを開始」をクリック
4. **確認項目**:
   - URLが`/task/[taskId]?mode=exam`になる
   - `create-or-resume` APIリクエストのbodyに`mode: 'exam'`が含まれる
   - 作成されたattemptの`mode`が`'exam'`である

### テスト4: 途中再開時の修正内容保持

1. Step1-5を入力
2. Step5レビューを実行
3. 修正を適用
4. ページをリロード
5. **確認項目**:
   - `step_state.step1_fixed`〜`step5_fixed`が復元される
   - Step6に自動遷移する（または、最後にいたStepに復元される）

---

## 動作確認チェックリスト

- [ ] Step5レビュー後の「修正を適用」ボタンでAPIが呼ばれる
- [ ] `step1_fixed`〜`step5_fixed`がDBに保存される
- [ ] Step6に自動遷移する
- [ ] StepReviewPanelが非表示になる
- [ ] 空文字列が保存されない（元のテキストがフォールバックされる）
- [ ] Examモードで`/task/[taskId]?mode=exam`にアクセスすると、attemptが`mode='exam'`で作成される
- [ ] 推薦タスク開始時に`mode`クエリパラメータが含まれる
- [ ] ページリロード後も修正内容が保持される

---

## 実装完了

すべての要件を実装しました：

1. ✅ Step5レビュー後の修正適用がDBに保存される（`step*_fixed`）
2. ✅ Apply成功後にStep6に自動遷移
3. ✅ StepReviewPanelが閉じる
4. ✅ 空文字列防止（元のテキストをフォールバック）
5. ✅ Examモード対応（URLクエリパラメータから読み取り）

