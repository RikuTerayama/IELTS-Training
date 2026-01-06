# Task 1 Step Learning 実装サマリー

## 実装完了内容

### 1. データモデル拡張 ✅
- **マイグレーションファイル**: `supabase/migrations/002_task1_step_learning.sql`
  - `attempts`テーブルに以下を追加:
    - `task_type` (Task 1 or Task 2)
    - `mode` (training or exam)
    - `step_state` (JSONB) - Step1-6の状態、観察メモ、数字、チェックリスト
    - `review_state` (JSONB) - StepレビューとFinalレビューの状態
  - `user_skill_stats`テーブルを作成（弱点カウンター用）
  - RLSポリシーを設定

### 2. 型定義拡張 ✅
- **ファイル**: `lib/domain/types.ts`
  - `Task1StepState` - Step1-6、修正後、観察メモ、数字、チェックリスト、タイマー
  - `Task1ReviewState` - StepレビューとFinalレビューの状態
  - `Task1StepReviewFeedback` - Step1-5のレビュー結果
  - `Task1FinalReviewFeedback` - Step6の最終レビュー結果（文単位ハイライト含む）
  - `UserSkillStats` - ユーザーの弱点統計

### 3. Zodスキーマ ✅
- **ファイル**: `lib/validators/task1.ts`
  - すべてのTask 1関連のリクエスト/レスポンスをバリデーション
  - `Task1StepReviewFeedbackSchema`
  - `Task1FinalReviewFeedbackSchema`
  - APIリクエスト用スキーマ

### 4. APIエンドポイント ✅
- **POST /api/task1/attempts/create-or-resume**
  - Task 1用のattemptを作成または既存のものを再開
  - 既存のdraft状態のattemptがあれば返す
  
- **POST /api/task1/attempts/save-step**
  - Step1-6の内容を保存
  - 観察メモ、数字、チェックリストも保存
  - Step6の場合は語数・段落数も返す

- **POST /api/task1/review/steps**
  - Step1-5をレビュー
  - LLMで各Stepを評価し、最重要修正点を特定
  - 数字検証も実行

- **POST /api/task1/review/final**
  - Step6（最終回答）をレビュー
  - 4次元評価（TR, CC, LR, GRA）
  - 文単位ハイライト
  - `user_skill_stats`を更新

- **GET /api/task1/recommendation**
  - 弱点に基づいて次タスクを推薦
  - レベル、ジャンル、モードを提案

### 5. LLMプロンプト ✅
- **ファイル**: `lib/llm/prompts/task1_step_review.ts`
  - Step1-5のレビュー用プロンプト
  - 各Stepの要件を明確にし、具体例と修正文を返す
  
- **ファイル**: `lib/llm/prompts/task1_final_review.ts`
  - Step6の最終レビュー用プロンプト
  - IELTS Task 1基準に合わせた4次元評価
  - 文単位ハイライト

### 6. ユーティリティ関数 ✅
- **ファイル**: `lib/utils/task1Helpers.ts` に追加
  - `countWords()` - 語数カウント
  - `countParagraphs()` - 段落数カウント
  - `extractNumbers()` - テキストから数字を抽出
  - `evaluateChecklist()` - チェックリスト項目を自動判定

### 7. UIコンポーネント ✅
- **components/task1/Task1Flow.tsx** - メインのStep学習フロー
  - Stepper UI (1-6)
  - Step入力エリア
  - 自動保存（デバウンス）
  - Step5完了時にレビュー実行
  - Step6完了時に最終レビュー実行

- **components/task1/ChecklistPanel.tsx** - チェックリスト表示
  - Overview、比較表現、数字、段落、語数、時制のチェック
  - 語数・段落数表示

- **components/task1/ComparisonPhrasesPanel.tsx** - 比較フレーズ集
  - Trainingモードのみ表示
  - クリックでフレーズを挿入可能

- **components/task1/KeyNumbersPanel.tsx** - 数字登録パネル
  - 数字、単位、文脈を登録
  - 登録済み数字の一覧表示

- **components/task1/StepReviewPanel.tsx** - Stepレビュー結果表示
  - Step1-5のレビュー結果
  - 最重要修正点の強調表示
  - 修正適用ボタン

- **components/task1/FinalReviewPanel.tsx** - 最終レビュー結果表示
  - 文単位ハイライト
  - 4次元評価
  - Band-up Actions
  - 数字検証結果

- **components/task1/Task1ObservationOverlay.tsx** - 図表上の付箋
  - 画像上にクリックで付箋追加
  - ドラッグで移動
  - Trainingモードのみ

### 8. タスク画面統合 ✅
- **app/task/[taskId]/page.tsx**
  - Task 1の場合は`Task1Flow`コンポーネントを使用
  - Task 2は既存のUIを維持
  - attempt作成/再開のロジックを追加

---

## 実装済み機能

### ✅ 完了
1. データモデル拡張（attempts, user_skill_stats）
2. 型定義とZodスキーマ
3. 5つのAPIエンドポイント
4. LLMプロンプト（Stepレビュー、Finalレビュー）
5. ユーティリティ関数（語数、段落、数字抽出、チェックリスト）
6. UIコンポーネント（Task1Flow、各種パネル）
7. タスク画面への統合

### ⏳ 未実装（次のステップ）
1. **ObservationOverlayの統合** - Task1Flow内で画像上に付箋を表示
2. **数字ガードの実装** - 本文中の数字と登録数字の突合・警告
3. **Examモードのタイマー** - タイマー機能の実装
4. **ダッシュボード** - `/app/training/writing/task1/progress/page.tsx`
5. **推薦導線** - Task 1入口画面に推薦機能を追加
6. **Step修正適用API** - StepReviewPanelのApply機能
7. **エラーハンドリング強化** - LLM失敗時のフォールバック

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

### 画面
- `app/task/[taskId]/page.tsx` (拡張)

---

## 動作確認手順

### 1. マイグレーション実行
```bash
# Supabaseダッシュボードで以下を実行
# supabase/migrations/002_task1_step_learning.sql
```

### 2. Task 1タスクを生成
```bash
# POST /api/tasks/generate
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
1. Step1-5を順番に入力
2. Step5完了時に「レビューを実行」ボタンをクリック
3. Stepレビュー結果を確認し、修正を適用
4. Step6で統合回答を作成
5. Step6完了時に「最終レビューを実行」ボタンをクリック
6. 最終レビュー結果（文単位ハイライト、4次元評価）を確認

### 5. 途中再開
- ページをリロードしても、同じattemptが再開される
- Stepの内容は自動保存される

---

## 注意事項

1. **既存のTask 2機能は影響なし** - Task 2は既存のUI/APIをそのまま使用
2. **attemptsテーブルの既存データ** - `task_type`がNULLの場合は'Task 2'とみなす
3. **LLM API Key必須** - レビュー機能にはLLM API Keyが必要
4. **画像パス** - Task 1の画像は`public/images/task1/`に配置されている必要がある

---

## 次の実装ステップ

1. ObservationOverlayの統合（Task1Flow内で画像表示時に付箋機能を有効化）
2. 数字ガードの実装（本文中の数字抽出と警告表示）
3. Examモードのタイマー実装
4. ダッシュボード画面の作成
5. 推薦導線の実装
6. エラーハンドリングの強化

---

**実装日**: 2024年
**バージョン**: MVP実装（基本機能完了）

