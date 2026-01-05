# IELTS Training - MVP実装

IELTS Writing/Speaking向け学習アプリのMVP実装

## 実装状況

### ✅ 完了（縦スライス1の基本実装）

#### 基盤
- [x] プロジェクトセットアップ（Next.js 14 + TypeScript + Tailwind）
- [x] Supabaseクライアント（ブラウザ/サーバー）
- [x] 共通APIレスポンス形式
- [x] TypeScript型定義（06に準拠）
- [x] LLM呼び出し共通関数（JSON抽出/リトライ）
- [x] LLMプロンプトテンプレート（4種類）
- [x] データベースマイグレーション（8テーブル + RLS）
- [x] 認証ミドルウェア

#### API（縦スライス1）
- [x] `GET /api/tasks/recommended` - 今日の推奨タスク取得
- [x] `GET /api/tasks/:taskId` - タスク詳細取得
- [x] `POST /api/tasks/generate` - タスク生成（LLM）
- [x] `POST /api/tasks/:taskId/submit` - 回答送信
- [x] `POST /api/llm/feedback` - フィードバック生成（LLM）
- [x] `GET /api/feedback/:feedbackId` - フィードバック取得
- [x] `GET /api/feedback/attempt/:attemptId` - Attemptからフィードバック取得
- [x] `GET /api/attempts/:attemptId` - Attempt取得
- [x] `GET /api/progress/summary` - 進捗サマリー
- [x] `GET /api/progress/history` - タスク履歴

#### 画面（縦スライス1）
- [x] `/login` - ログイン/サインアップ
- [x] `/home` - ホーム（推奨タスク、弱点タグ）
- [x] `/task/[taskId]` - タスク画面（レベル別入力）
- [x] `/feedback/[attemptId]` - フィードバック表示
- [x] `/progress` - 進捗・履歴

#### 共通コンポーネント
- [x] `Layout` - 共通レイアウト（Header/Footer）
- [x] `Header` - ヘッダー（メニュー、ログイン状態）
- [x] `Footer` - フッター（今日の進捗）

### ✅ 完了（縦スライス2: Fill-in）

#### API（縦スライス2）
- [x] `GET /api/tasks/:taskId/fill-in-questions` - 穴埋め問題生成
- [x] `POST /api/tasks/:taskId/fill-in` - 穴埋め回答送信

#### 画面（縦スライス2）
- [x] `/fillin/[attemptId]` - 穴埋め問題画面

#### 機能
- [x] 穴埋め問題生成（簡易ルールベース）
- [x] フィードバック生成時に穴埋め結果を反映

### ✅ 完了（縦スライス3: Rewrite）

#### API（縦スライス3）
- [x] `POST /api/tasks/:taskId/rewrite` - 書き直し回答送信・再評価

#### 画面（縦スライス3）
- [x] `/rewrite/[attemptId]` - 書き直し画面

#### 機能
- [x] 2カラム表示（原文/編集エリア）
- [x] 最大2箇所の書き直し対象編集
- [x] LLMによる再評価

### 🚧 未実装（縦スライス4〜5）

- [ ] `/speak/[attemptId]` - Speaking練習画面（テキストのみ）
- [ ] `/vocab` - 単語学習画面
- [ ] Speakingプロンプト生成API
- [ ] 単語学習API

## セットアップ手順

### 1. 依存関係インストール

```bash
npm install
```

### 2. 環境変数設定

`.env.local` を作成し、以下を設定：

```env
# ==================== Supabase ====================
# 提供済みの情報
NEXT_PUBLIC_SUPABASE_URL=https://zensuohywqtqfzdxwgoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbnN1b2h5d3F0cWZ6ZHh3Z29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzUzMjIsImV4cCI6MjA4MTYxMTMyMn0.by4vAuuqTBSD1nGz8Z4cV2i6LCu3bXtC4olUNV1PMfU

# オプション（現在の実装では不要）
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ==================== LLM (Groq API - 無料推奨) ====================
# Groq API キーを取得: https://console.groq.com/
LLM_PROVIDER=groq
LLM_API_KEY=your_groq_api_key_here
LLM_MODEL=llama-3.1-8b-instant

# または、OpenAI API を使用する場合（有料）
# LLM_PROVIDER=openai
# LLM_API_KEY=sk-your-openai-api-key-here
# LLM_MODEL=gpt-4o-mini

# ==================== App ====================
APP_BASE_URL=http://localhost:3000
```

**Render（本番環境）での環境変数設定は `RENDER_ENV_VARIABLES.md` を参照してください。**

### 3. データベースセットアップ

Supabaseダッシュボードで `supabase/migrations/001_initial_schema.sql` を実行

または、Supabase CLIを使用：

```bash
supabase db push
```

### 4. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

## 次のステップ

### 縦スライス1の動作確認
1. ログイン/サインアップ
2. ホーム画面で推奨タスク表示
3. タスク画面で回答入力・送信
4. フィードバック生成・表示
5. 進捗画面で履歴確認

### 縦スライス3実装（Rewrite）
- `/rewrite/[attemptId]` 画面作成
- 書き直し再評価API

### 縦スライス4実装（Vocab）
- `/vocab` 画面作成
- 単語学習API
- 必須語彙連動

### 縦スライス5実装（Speak）
- `/speak/[attemptId]` 画面作成
- Speakingプロンプト生成API

## 注意事項

- LLM API Keyが必要です（OpenAI推奨）
- Supabaseプロジェクトが必要です
- 初回ログイン時にプロファイルが自動作成されます
- タスク生成はLLM呼び出しが必要です（コストがかかります）

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres)
- OpenAI API (LLM)

