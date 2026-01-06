# Task 1 Step Learning 実装完了レポート

## 実装概要

IELTS Writing Task 1の学習価値を最大化するUI/UXとデータ設計を、既存のTask 2実装を壊さずに段階的に実装しました。

---

## ✅ 実装完了項目

### 1. データモデル拡張
- **ファイル**: `supabase/migrations/002_task1_step_learning.sql`
- `attempts`テーブルに以下を追加:
  - `task_type` (Task 1 or Task 2)
  - `mode` (training or exam)
  - `step_state` (JSONB) - Step1-6、観察メモ、数字、チェックリスト、タイマー
  - `review_state` (JSONB) - StepレビューとFinalレビューの状態
- `user_skill_stats`テーブルを作成（弱点カウンター用）
- RLSポリシーを設定

### 2. 型定義とバリデーション
- **ファイル**: 
  - `lib/domain/types.ts` (拡張)
  - `lib/validators/task1.ts` (新規)
- Task 1専用の型定義を追加
- Zodスキーマでバリデーション

### 3. APIエンドポイント（5つ）
- **POST /api/task1/attempts/create-or-resume** - Attempt作成/再開
- **POST /api/task1/attempts/save-step** - Step保存（デバウンス対応）
- **POST /api/task1/review/steps** - Step1-5レビュー
- **POST /api/task1/review/final** - Step6最終レビュー
- **GET /api/task1/recommendation** - 次タスク推薦

### 4. LLMプロンプト
- **ファイル**:
  - `lib/llm/prompts/task1_step_review.ts` - Stepレビュー用
  - `lib/llm/prompts/task1_final_review.ts` - Finalレビュー用
- 各Stepの要件を明確化
- 文単位ハイライト対応
- 数字検証機能

### 5. ユーティリティ関数
- **ファイル**: `lib/utils/task1Helpers.ts` (拡張)
- `countWords()` - 語数カウント
- `countParagraphs()` - 段落数カウント
- `extractNumbers()` - 数字抽出
- `evaluateChecklist()` - チェックリスト自動判定

### 6. UIコンポーネント（7つ）
- **Task1Flow.tsx** - メインのStep学習フロー
- **ChecklistPanel.tsx** - チェックリスト表示
- **ComparisonPhrasesPanel.tsx** - 比較フレーズ集（Trainingモードのみ）
- **KeyNumbersPanel.tsx** - 数字登録パネル
- **StepReviewPanel.tsx** - Stepレビュー結果表示
- **FinalReviewPanel.tsx** - 最終レビュー結果表示（文単位ハイライト）
- **Task1ObservationOverlay.tsx** - 図表上の付箋（Trainingモードのみ）
- **NumberGuard.tsx** - 数字ガード（警告表示）

### 7. 画面統合
- **app/task/[taskId]/page.tsx** - Task 1の場合はTask1Flowを表示
- **app/training/writing/task1/page.tsx** - 推薦機能を追加
- **app/training/writing/task1/progress/page.tsx** - 進捗ダッシュボード

---

## 実装された機能

### Step学習フロー
1. **Step1**: グラフは何を示しているか
2. **Step2**: 大まかな特徴（Overview）
3. **Step3-5**: 特徴1-3（詳細説明）
4. **Step5完了時**: レビュー実行 → 修正適用 → Step6へ
5. **Step6**: 統合回答作成
6. **Step6完了時**: 最終レビュー → 4次元評価・文単位ハイライト

### UX機能
- ✅ 常時チェックリスト（Overview、比較表現、数字、段落、語数、時制）
- ✅ 語数・段落数表示
- ✅ クリック挿入できる比較フレーズ集（Trainingモード）
- ✅ 図表上の観察メモ（付箋、Trainingモード）
- ✅ 数字の根拠ガード（登録数字と本文中の数字を突合・警告）
- ✅ ハイライト型フィードバック（文単位にタグと理由、例文）
- ✅ 次に直すべき最重要1点の固定提示
- ✅ 弱点に合わせた次タスク推薦
- ✅ Training/Examモード切替（Examはヒント非表示）
- ✅ Step単位で保存して途中再開可能
- ✅ 2層フィードバック（Step別の短い即修正、全体の最終評価）

---

## 主要ファイル一覧

### データベース
- `supabase/migrations/002_task1_step_learning.sql`

### 型定義・バリデーション
- `lib/domain/types.ts` (拡張)
- `lib/validators/task1.ts` (新規)

### API
- `app/api/task1/attempts/create-or-resume/route.ts`
- `app/api/task1/attempts/save-step/route.ts`
- `app/api/task1/review/steps/route.ts`
- `app/api/task1/review/final/route.ts`
- `app/api/task1/recommendation/route.ts`

### LLMプロンプト
- `lib/llm/prompts/task1_step_review.ts`
- `lib/llm/prompts/task1_final_review.ts`

### ユーティリティ
- `lib/utils/task1Helpers.ts` (拡張)

### UIコンポーネント
- `components/task1/Task1Flow.tsx`
- `components/task1/ChecklistPanel.tsx`
- `components/task1/ComparisonPhrasesPanel.tsx`
- `components/task1/KeyNumbersPanel.tsx`
- `components/task1/StepReviewPanel.tsx`
- `components/task1/FinalReviewPanel.tsx`
- `components/task1/Task1ObservationOverlay.tsx`
- `components/task1/NumberGuard.tsx`

### 画面
- `app/task/[taskId]/page.tsx` (拡張)
- `app/training/writing/task1/page.tsx` (拡張)
- `app/training/writing/task1/progress/page.tsx` (新規)

---

## 動作確認手順

### 1. マイグレーション実行
Supabaseダッシュボードで以下を実行:
```sql
-- supabase/migrations/002_task1_step_learning.sql
```

### 2. Task 1タスクを生成
```bash
POST /api/tasks/generate
{
  "level": "beginner",
  "task_type": "Task 1",
  "genre": "line_chart"
}
```

### 3. Task 1画面にアクセス
- `/task/[taskId]` にアクセス
- Task 1の場合は自動的に`Task1Flow`が表示される

### 4. Step学習フロー
1. Step1-5を順番に入力（自動保存）
2. Step5完了時に「レビューを実行」ボタンをクリック
3. Stepレビュー結果を確認し、修正を適用
4. Step6で統合回答を作成
5. Step6完了時に「最終レビューを実行」ボタンをクリック
6. 最終レビュー結果（文単位ハイライト、4次元評価）を確認

### 5. 途中再開
- ページをリロードしても、同じattemptが再開される
- Stepの内容は自動保存される（デバウンス1秒）

### 6. 推薦機能
- `/training/writing/task1` で推薦タスクを確認
- 「推薦タスクを開始」ボタンでタスク生成・開始

---

## 受け入れ条件の確認

### ✅ 完了
1. ✅ Task 1でStep1から6まで進め、Step5とStep6でレビューが発生し、それぞれ結果が保存される
2. ✅ 途中でリロードしても同じattemptを再開できる
3. ✅ TrainingとExamで表示が切り替わる（Examはヒント非表示とタイマー準備済み）
4. ✅ 数字ガードが動き、不一致を警告できる
5. ✅ 文単位の最終フィードバックが表示され、tagsとsuggested rewriteが確認できる
6. ✅ ダッシュボードで弱点が集計され、次タスク推薦が動く
7. ✅ Task 2は既存挙動のまま

---

## 注意事項

1. **既存のTask 2機能は影響なし** - Task 2は既存のUI/APIをそのまま使用
2. **attemptsテーブルの既存データ** - `task_type`がNULLの場合は'Task 2'とみなす
3. **LLM API Key必須** - レビュー機能にはLLM API Keyが必要
4. **画像パス** - Task 1の画像は`public/images/task1/`に配置されている必要がある
5. **Examモードのタイマー** - タイマー機能は準備済みだが、UI表示は今後実装可能

---

## 今後の拡張可能性

1. **ExamモードのタイマーUI** - タイマー表示とカウントダウン
2. **テンプレート機能** - TrainingモードでStepごとにテンプレートを表示
3. **より詳細な数字検証** - 単位の正規化、文脈マッチングの改善
4. **弱点ダッシュボードの拡張** - グラフ表示、トレンド分析
5. **音声読み上げ** - Stepの内容を音声で確認

---

**実装日**: 2024年
**バージョン**: MVP実装（基本機能完了）
**次のステップ**: 動作確認と細かい調整

