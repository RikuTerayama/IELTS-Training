# IELTS Training アプリケーション設計レポート

## 1. アプリケーション概要

### 1.1 目的
IELTS Writing/Speaking向けの学習アプリケーション（MVP）。ユーザーがIELTS Writing Task 1とTask 2の練習を行い、AIによるフィードバックを受け取り、継続的にスキルアップを目指す。

### 1.2 主要機能
- **Writing Task 1**: グラフ・チャート・表・地図などの説明問題（Step Learning方式）
- **Writing Task 2**: エッセイ問題（PREP方式）
- **フィードバック**: Band推定、4次元評価（TR/CC/LR/GRA）、Band-up actions
- **進捗管理**: 学習履歴、弱点タグ、推奨タスク
- **語彙学習**: 必須語彙の習得確認
- **Speaking練習**: WritingからSpeakingへの変換プロンプト

### 1.3 対象ユーザー
- **初級（beginner）**: Band 5.0-5.5目標
- **中級（intermediate）**: Band 6.0-6.5目標
- **上級（advanced）**: Band 6.5-7.0目標

---

## 2. 技術スタック

### 2.1 フロントエンド
- **Next.js 14.1.0** (App Router)
- **React 18.2.0**
- **TypeScript 5.3.3**
- **Tailwind CSS 3.4.1** (カスタムテーマシステム)
- **clsx + tailwind-merge** (クラス名マージ)

### 2.2 バックエンド
- **Next.js Route Handlers** (API Routes)
- **Supabase** (認証・データベース)
  - `@supabase/ssr`: 0.5.1
  - `@supabase/supabase-js`: 2.39.0

### 2.3 LLM統合
- **複数プロバイダー対応**: OpenAI, Groq, Gemini, Hugging Face
- **JSON形式での出力**: すべてのLLM出力はJSON形式
- **リトライ機構**: 最大3回のリトライ

### 2.4 その他
- **Zod 3.22.4** (バリデーション)
- **フォント**: Inter (英語) + Noto Sans JP (日本語)

---

## 3. アーキテクチャ概要

### 3.1 ディレクトリ構造
```
app/                    # Next.js App Router
├── (auth)/            # 認証関連ページ
├── api/               # API Routes
├── task/              # タスク関連ページ
├── feedback/          # フィードバック表示
├── progress/          # 進捗管理
├── training/          # トレーニング画面
└── vocab/            # 語彙学習

lib/                   # 共通ライブラリ
├── api/               # APIレスポンス形式
├── domain/            # ドメイン型定義
├── llm/               # LLM統合
│   ├── client.ts      # LLM呼び出し共通関数
│   ├── parse.ts       # JSON抽出・リトライ
│   └── prompts/       # プロンプトテンプレート
├── supabase/          # Supabaseクライアント
├── task1/             # Task1専用ロジック
│   └── assets.ts      # アセット定義（新規）
├── ui/                # UI共通コンポーネント
└── utils/             # ユーティリティ

components/            # Reactコンポーネント
├── layout/            # レイアウトコンポーネント
├── task/              # タスク関連コンポーネント
└── theme/             # テーマ管理

supabase/
└── migrations/        # データベースマイグレーション
```

### 3.2 認証フロー
1. ユーザーがログイン/サインアップ
2. `middleware.ts`で認証状態をチェック
3. 未認証の場合は`/login`にリダイレクト
4. 初回ログイン時に`profiles`テーブルに自動作成

### 3.3 データフロー
```
ユーザー操作
  ↓
Next.js Page Component (Client Component)
  ↓
API Route Handler (Server Component)
  ↓
Supabase Client / LLM Client
  ↓
データベース / LLM API
  ↓
レスポンス返却
```

---

## 4. データベース設計

### 4.1 テーブル一覧

#### profiles（ユーザープロファイル）
- `id` (UUID, PK, auth.users参照)
- `email` (TEXT)
- `initial_level` (TEXT: beginner/intermediate/advanced)
- `current_level` (TEXT: beginner/intermediate/advanced)
- `created_at`, `updated_at`

#### tasks（タスク・お題）
- `id` (UUID, PK)
- `level` (TEXT: beginner/intermediate/advanced)
- `question` (TEXT) - IELTS形式のお題
- `question_type` (TEXT: 'Task 1' | 'Task 2')
- `required_vocab` (JSONB) - 必須語彙配列
- `prep_guide` (JSONB) - 初級/中級向けガイド
- `asset_id` (TEXT, nullable) - Task1の場合のアセットID（新規追加）
- `image_path` (TEXT, nullable) - Task1の場合の画像パス（新規追加）
- `is_cached` (BOOLEAN)
- `cache_key` (TEXT)
- `created_at`

#### attempts（ユーザーの回答）
- `id` (UUID, PK)
- `user_id` (UUID, FK → profiles)
- `task_id` (UUID, FK → tasks)
- `level` (TEXT)
- `draft_content` (JSONB) - 下書き内容
- `submitted_at` (TIMESTAMPTZ)
- `status` (TEXT: draft/submitted/rewritten)
- `rewrite_count` (INTEGER)
- `step_state` (JSONB) - Task1 Step Learning用（別マイグレーション）
- `created_at`, `updated_at`

#### feedbacks（フィードバック）
- `id` (UUID, PK)
- `attempt_id` (UUID, FK → attempts)
- `overall_band_range` (TEXT) - 例: "6.0-6.5"
- `dimensions` (JSONB) - TR/CC/LR/GRA評価
- `strengths` (JSONB)
- `band_up_actions` (JSONB) - 最大3つ
- `rewrite_targets` (JSONB) - 最大2箇所
- `vocab_suggestions` (JSONB)
- `metadata` (JSONB)
- `parent_feedback_id` (UUID, FK → feedbacks) - 書き直し時
- `is_rewrite` (BOOLEAN)
- `created_at`

#### vocab_items（語彙マスタ）
- `id` (UUID, PK)
- `word` (TEXT, UNIQUE)
- `meaning` (TEXT)
- `skill_tags` (TEXT[]) - writing/speaking/reading/listening
- `example_sentence` (TEXT)
- `collocations` (JSONB)
- `level` (TEXT)
- `created_at`

#### vocab_logs（語彙学習ログ）
- `id` (UUID, PK)
- `user_id` (UUID, FK → profiles)
- `vocab_id` (UUID, FK → vocab_items)
- `session_date` (DATE)
- `questions` (JSONB)
- `answers` (JSONB)
- `score` (INTEGER)
- `created_at`

#### daily_state（今日の状態）
- `id` (UUID, PK)
- `user_id` (UUID, FK → profiles)
- `date` (DATE)
- `recommended_task_id` (UUID, FK → tasks)
- `required_vocab` (JSONB)
- `weakness_tags` (TEXT[])
- `latest_band_estimate` (TEXT)
- `created_at`, `updated_at`
- UNIQUE(user_id, date)

#### revisions（書き直し履歴）
- `id` (UUID, PK)
- `attempt_id` (UUID, FK → attempts)
- `feedback_id` (UUID, FK → feedbacks)
- `revised_content` (JSONB)
- `created_at`

### 4.2 Row Level Security (RLS)
すべてのテーブルでRLSを有効化し、ユーザーは自分のデータのみアクセス可能。

---

## 5. API設計

### 5.1 統一レスポンス形式
```typescript
interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

### 5.2 主要APIエンドポイント

#### タスク関連
- `GET /api/tasks/recommended` - 今日の推奨タスク取得
- `GET /api/tasks/[taskId]` - タスク詳細取得
- `POST /api/tasks/generate` - タスク生成（LLM）
- `POST /api/tasks/[taskId]/submit` - 回答送信
- `GET /api/tasks/[taskId]/fill-in-questions` - 穴埋め問題生成
- `POST /api/tasks/[taskId]/fill-in` - 穴埋め回答送信
- `POST /api/tasks/[taskId]/rewrite` - 書き直し送信

#### Task1 Step Learning専用
- `POST /api/task1/attempts/create-or-resume` - Attempt作成/再開
- `POST /api/task1/attempts/save-step` - ステップ保存（自動保存）
- `POST /api/task1/attempts/apply-step-fixes` - ステップ修正適用
- `POST /api/task1/review/steps` - ステップ1-5レビュー
- `POST /api/task1/review/final` - ステップ6最終レビュー
- `GET /api/task1/recommendation` - Task1推奨タスク

#### フィードバック関連
- `POST /api/llm/feedback` - フィードバック生成（LLM）
- `GET /api/feedback/[feedbackId]` - フィードバック取得
- `GET /api/feedback/attempt/[attemptId]` - Attemptからフィードバック取得

#### 進捗関連
- `GET /api/progress/summary` - 進捗サマリー
- `GET /api/progress/history` - タスク履歴

#### 語彙関連
- `GET /api/vocab/questions` - 語彙問題生成
- `POST /api/vocab/submit` - 語彙回答送信
- `GET /api/vocab/incorrect` - 間違えた語彙取得

#### Speaking関連
- `POST /api/speaking/prompts/generate` - Speakingプロンプト生成
- `POST /api/speaking/attempts` - Speaking回答送信
- `POST /api/speaking/evaluations` - Speaking評価生成

### 5.3 LLMプロンプトテンプレート
- `task_generate.ts` - タスク生成（Task1/Task2）
- `writing_feedback.ts` - Writingフィードバック生成
- `task1_step_review.ts` - Task1ステップレビュー
- `task1_final_review.ts` - Task1最終レビュー
- `prep_evaluation.ts` - PREP評価
- `prep_to_essay.ts` - PREPからエッセイ変換
- `rewrite_coach.ts` - 書き直しガイド
- `speaking_prompt_generate.ts` - Speakingプロンプト生成
- `speaking_evaluation.ts` - Speaking評価

---

## 6. フロントエンド設計

### 6.1 ページ構成

#### 認証
- `/login` - ログイン/サインアップ

#### メイン
- `/` - ルート（リダイレクト）
- `/home` - ホーム（推奨タスク、弱点タグ）
- `/onboarding` - 初回設定（レベル選択）

#### タスク
- `/task/select` - タスク選択（Task1/Task2、レベル、ジャンル）
- `/task/[taskId]` - タスク画面（Task1: Step Learning、Task2: 通常入力）
- `/task/[taskId]/prep` - Task2 PREPモード（初級/中級）

#### フィードバック・学習
- `/feedback/[attemptId]` - フィードバック表示
- `/rewrite/[attemptId]` - 書き直し画面
- `/fillin/[attemptId]` - 穴埋め問題画面

#### 進捗・トレーニング
- `/progress` - 進捗・履歴
- `/training/writing/task1` - Task1トレーニング一覧
- `/training/writing/task1/progress` - Task1進捗
- `/training/writing/task2` - Task2トレーニング
- `/training/vocabulary` - 語彙トレーニング
- `/training/speaking/task1` - Speaking Task1
- `/vocab` - 語彙学習

### 6.2 共通コンポーネント

#### レイアウト
- `Layout.tsx` - 共通レイアウト（Header + Footer）
- `Header.tsx` - ヘッダー（メニュー、ログイン状態、テーマ切り替え）
- `Footer.tsx` - フッター（今日の進捗）

#### テーマ
- `ThemeProvider.tsx` - テーマ管理（ダークモード対応）
- `ThemeToggle.tsx` - テーマ切り替えボタン

#### Task1専用
- `Task1Image.tsx` - Task1画像表示（アセット優先、フォールバック対応）
- `Task1Flow.tsx` - Task1 Step Learningフロー（①〜⑥）
- `ChecklistPanel.tsx` - チェックリスト表示
- `KeyNumbersPanel.tsx` - キーナンバー登録
- `StepReviewPanel.tsx` - ステップ1-5レビュー表示
- `FinalReviewPanel.tsx` - ステップ6最終レビュー表示
- `ComparisonPhrasesPanel.tsx` - 比較表現一覧

### 6.3 UIテーマシステム

#### CSS変数ベースのテーマ
`globals.css`で定義されたCSS変数を使用：
- `--bg`, `--bg-secondary` - 背景色
- `--surface`, `--surface-2` - サーフェス色
- `--text`, `--text-muted`, `--text-subtle` - テキスト色
- `--border`, `--border-strong` - ボーダー色
- `--primary`, `--primary-hover` - プライマリ色
- `--accent-indigo`, `--accent-violet`, `--accent-emerald` - アクセント色
- `--danger`, `--success`, `--warning` - 状態色

#### 共通UIトークン
`lib/ui/theme.ts`で定義された再利用可能なクラス：
- `cardBase` - カードベーススタイル
- `cardTitle` - カードタイトル
- `cardDesc` - カード説明
- `inputBase` - 入力フィールド
- `textareaBase` - テキストエリア
- `buttonPrimary` - プライマリボタン
- `buttonSecondary` - セカンダリボタン
- `badgeBase` - バッジ
- `selectableSelected` - 選択可能（選択中）
- `selectableUnselected` - 選択可能（未選択）

---

## 7. 主要機能フロー

### 7.1 Task1 Step Learningフロー

1. **タスク選択** (`/task/select`)
   - Task1を選択、レベル・ジャンルを指定
   - `POST /api/tasks/generate` でタスク生成
   - アセット先行方式（新規）:
     - アセット選択 → 質問文決定生成 → 語彙/prep_guide生成 → DB保存

2. **Attempt作成/再開** (`/task/[taskId]`)
   - `POST /api/task1/attempts/create-or-resume` でAttempt作成/取得
   - 既存のAttemptがある場合は再開

3. **Step Learning（①〜⑥）**
   - **Step 1**: 観察（Observations） - 画像に注釈を追加
   - **Step 2**: キーナンバー（Key Numbers） - 重要な数値を登録
   - **Step 3**: 概要（Overview） - 全体の特徴を記述
   - **Step 4**: 詳細1（Details 1） - 最初のカテゴリの詳細
   - **Step 5**: 詳細2（Details 2） - 2番目のカテゴリの詳細
   - **Step 6**: 最終エッセイ（Final Essay） - 全ステップを統合

4. **自動保存**
   - 各ステップの入力時に `POST /api/task1/attempts/save-step` で自動保存
   - デバウンス処理でAPI呼び出しを最適化

5. **ステップレビュー（Step 1-5）**
   - `POST /api/task1/review/steps` でレビュー生成
   - フィードバックを表示、修正を適用可能

6. **最終レビュー（Step 6）**
   - `POST /api/task1/review/final` で最終レビュー生成
   - Band推定、4次元評価、Band-up actionsを表示

### 7.2 Task2 PREPフロー

1. **タスク選択** (`/task/select`)
   - Task2を選択、レベル・ジャンルを指定
   - `POST /api/tasks/generate` でタスク生成

2. **PREPモード（初級/中級）** (`/task/[taskId]/prep`)
   - Point, Reason, Example, Point again を入力
   - `POST /api/llm/prep-evaluation` でPREP評価
   - `POST /api/llm/prep-to-essay` でエッセイ変換

3. **通常モード（上級）** (`/task/[taskId]`)
   - 直接エッセイを入力

4. **回答送信**
   - `POST /api/tasks/[taskId]/submit` で送信

5. **フィードバック生成**
   - `POST /api/llm/feedback` でフィードバック生成
   - `/feedback/[attemptId]` で表示

### 7.3 フィードバックフロー

1. **フィードバック生成**
   - `POST /api/llm/feedback` でLLM呼び出し
   - JSON形式で返却（schema_version: "1.0"）

2. **フィードバック表示** (`/feedback/[attemptId]`)
   - 全体Band推定
   - 4次元評価（TR/CC/LR/GRA）
   - 強み（Strengths）
   - Band-up actions（最大3つ、優先順位1-3）
   - 書き直し対象（最大2箇所）
   - 語彙提案（Vocab Suggestions）

3. **書き直し** (`/rewrite/[attemptId]`)
   - 指定範囲のみ編集
   - `POST /api/tasks/[taskId]/rewrite` で送信
   - 再評価でフィードバック更新

---

## 8. Task1アセット先行方式（最新実装）

### 8.1 背景
従来はLLMが質問文を自由生成し、画像は質問文のキーワードから検出していたため、質問文と画像が一致しない問題があった。

### 8.2 解決策
**アセット先行方式**を採用：
1. **アセット定義** (`lib/task1/assets.ts`)
   - 12個のアセットを定義（line_chart: 3件、bar_chart: 3件、pie_chart: 3件、table: 3件）
   - 各アセットにメタデータ（title, time_period, unit, categories, description）を付与

2. **質問文の決定生成**
   - LLMを使わず、アセットメタデータからIELTS定型文を組み立て
   - 必須フレーズを含む: "The {chart_type} below shows...", "Summarise...", "Write at least 150 words."

3. **語彙とprep_guideのみLLM生成**
   - `generateTask1VocabOnly()` で語彙とprep_guideのみ生成
   - temperature: 0.2で一貫性を保つ

4. **画像の整合性保証**
   - `asset_id`と`image_path`をDBに保存
   - `Task1Image`コンポーネントで`image_path`を優先使用

### 8.3 分布制御
- ジャンル未指定時は重み付きで選択
- line_chart, bar_chart, pie_chart, table: 重み 1.0
- multiple_charts, diagram, map: 重み 0.5

### 8.4 バリデーション
- 必須フレーズチェック（"shows", "Summarise", "Write at least 150 words"）
- 語彙数チェック（3-5語）
- LLM出力のJSON形式検証

---

## 9. 設計原則とベストプラクティス

### 9.1 縦スライス優先
機能を横に広げず、縦スライスを完成させてから次へ進む。

### 9.2 LLM出力の厳格化
- すべてのLLM出力は必ずJSON形式
- `schema_version`を含む
- JSONでなかった場合はリトライ（最大3回）

### 9.3 品質ガード
- Band-up actionsは最大3つ（優先順位1, 2, 3）
- 書き直し対象は最大2箇所
- 全文書き換え禁止（指定範囲のみ）

### 9.4 ダークモード対応
- CSS変数ベースのテーマシステム
- 共通UIトークンを使用（`bg-white`, `text-gray-*`などの直接指定を避ける）

### 9.5 型安全性
- TypeScriptで厳密な型定義
- Zodでランタイムバリデーション

### 9.6 エラーハンドリング
- 統一APIレスポンス形式
- エラーコードとメッセージを明確に
- クライアント側での適切なエラー表示

---

## 10. ファイル構造の詳細

### 10.1 主要ファイル

#### 設定ファイル
- `package.json` - 依存関係
- `tsconfig.json` - TypeScript設定
- `tailwind.config.ts` - Tailwind設定
- `next.config.js` - Next.js設定
- `middleware.ts` - 認証ミドルウェア

#### 型定義
- `lib/domain/types.ts` - 共通型定義（Task, Attempt, Feedback等）

#### LLM統合
- `lib/llm/client.ts` - LLM呼び出し共通関数（複数プロバイダー対応）
- `lib/llm/parse.ts` - JSON抽出・リトライロジック
- `lib/llm/prompts/*.ts` - プロンプトテンプレート

#### Supabase
- `lib/supabase/client.ts` - ブラウザ用クライアント
- `lib/supabase/server.ts` - サーバー用クライアント

#### Task1専用
- `lib/task1/assets.ts` - アセット定義（新規）
- `lib/utils/task1Image.ts` - 画像パス検出（旧方式、後方互換用）
- `lib/utils/task1Helpers.ts` - Task1ヘルパー関数
- `lib/validators/task1.ts` - Task1バリデーション

#### UI
- `lib/ui/theme.ts` - 共通UIトークン
- `app/globals.css` - グローバルCSS（テーマ変数定義）

---

## 11. 環境変数

### 11.1 必須環境変数
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# LLM
LLM_PROVIDER=openai|groq|gemini|huggingface
LLM_API_KEY=...
LLM_MODEL=gpt-4o-mini|...

# App
APP_BASE_URL=http://localhost:3000
```

---

## 12. 今後の拡張予定

### 12.1 Phase 2（未実装）
- 音声録音・文字起こし
- Speaking添削（音声評価）
- より高度な進捗分析

### 12.2 改善予定
- アセット追加（multiple_charts, diagram, map）
- バリデーション強化（Zodスキーマ）
- テスト追加（自動テスト）

---

## 13. まとめ

このアプリケーションは、Next.js 14 App Routerを基盤とし、Supabaseで認証・データ管理、複数のLLMプロバイダーに対応したIELTS学習アプリです。特にTask1のStep Learning方式と、最近実装されたアセット先行方式により、質問文と画像の整合性を100%保証しています。

設計の特徴：
- **縦スライス優先**: 機能を横に広げず、完成度を重視
- **型安全性**: TypeScript + Zodで厳密な型チェック
- **テーマシステム**: CSS変数ベースのダークモード対応
- **LLM統合**: 複数プロバイダー対応、JSON形式での出力
- **品質ガード**: Band-up actions最大3つ、書き直し対象最大2箇所

---

**最終更新**: 2024年（Task1アセット先行方式実装後）
