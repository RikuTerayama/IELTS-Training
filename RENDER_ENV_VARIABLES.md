z# Render 環境変数設定ガイド

## 必須環境変数（最小構成）

Render ダッシュボードの **Environment** タブで、以下の環境変数を設定してください。

### 1. Supabase（提供済み）

| 変数名 | 値 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zensuohywqtqfzdxwgoi.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbnN1b2h5d3F0cWZ6ZHh3Z29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzUzMjIsImV4cCI6MjA4MTYxMTMyMn0.by4vAuuqTBSD1nGz8Z4cV2i6LCu3bXtC4olUNV1PMfU` |

### 2. LLM（Groq API - 無料推奨）

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `LLM_PROVIDER` | `groq` | LLMプロバイダー（groq = 無料） |
| `LLM_API_KEY` | （Groq API キー） | [Groq Console](https://console.groq.com/) で取得 |
| `LLM_MODEL` | `llama-3.1-8b-instant` | 使用するモデル（高速・軽量） |

---

## 完全な環境変数リスト

### 必須（最低限これだけ設定すれば動作）

```
NEXT_PUBLIC_SUPABASE_URL=https://zensuohywqtqfzdxwgoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbnN1b2h5d3F0cWZ6ZHh3Z29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzUzMjIsImV4cCI6MjA4MTYxMTMyMn0.by4vAuuqTBSD1nGz8Z4cV2i6LCu3bXtC4olUNV1PMfU
LLM_PROVIDER=groq
LLM_API_KEY=your_groq_api_key_here
LLM_MODEL=llama-3.1-8b-instant
```

### オプション（設定しなくても動作する）

```
LLM_MODEL=llama-3.1-8b-instant
```

（`LLM_MODEL` は設定しなくても、デフォルト値が使用されます）

---

## Render での設定手順

### 1. Render ダッシュボードにアクセス

1. [Render Dashboard](https://dashboard.render.com/) にログイン
2. デプロイしている **Web Service** を選択

### 2. Environment タブを開く

1. 左メニューから **Environment** を選択
2. **Add Environment Variable** ボタンをクリック

### 3. 環境変数を追加

以下の5つを1つずつ追加してください：

#### ① NEXT_PUBLIC_SUPABASE_URL

- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://zensuohywqtqfzdxwgoi.supabase.co`
- **Add** をクリック

#### ② NEXT_PUBLIC_SUPABASE_ANON_KEY

- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbnN1b2h5d3F0cWZ6ZHh3Z29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzUzMjIsImV4cCI6MjA4MTYxMTMyMn0.by4vAuuqTBSD1nGz8Z4cV2i6LCu3bXtC4olUNV1PMfU`
- **Add** をクリック

#### ③ LLM_PROVIDER

- **Key**: `LLM_PROVIDER`
- **Value**: `groq`
- **Add** をクリック

#### ④ LLM_API_KEY

- **Key**: `LLM_API_KEY`
- **Value**: （Groq API キーを貼り付け）
  - [Groq Console](https://console.groq.com/) で取得
  - 例: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Add** をクリック

#### ⑤ LLM_MODEL（オプション）

- **Key**: `LLM_MODEL`
- **Value**: `llama-3.1-8b-instant`
- **Add** をクリック

### 4. 保存

すべての環境変数を追加したら、**Save Changes** をクリック

### 5. 再デプロイ

環境変数を追加すると、Render が自動的に再デプロイを開始します。

---

## 環境変数の確認

設定後、**Environment** タブで以下のように表示されます：

```
NEXT_PUBLIC_SUPABASE_URL        https://zensuohywqtqfzdxwgoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
LLM_PROVIDER                    groq
LLM_API_KEY                     ****（マスク表示）
LLM_MODEL                       llama-3.1-8b-instant
```

**注意**: `LLM_API_KEY` はセキュリティのため `****` のようにマスク表示されます。

---

## コピー＆ペースト用（完全版）

Render の Environment タブで、以下の形式で設定できます：

```
NEXT_PUBLIC_SUPABASE_URL=https://zensuohywqtqfzdxwgoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbnN1b2h5d3F0cWZ6ZHh3Z29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzUzMjIsImV4cCI6MjA4MTYxMTMyMn0.by4vAuuqTBSD1nGz8Z4cV2i6LCu3bXtC4olUNV1PMfU
LLM_PROVIDER=groq
LLM_API_KEY=your_groq_api_key_here
LLM_MODEL=llama-3.1-8b-instant
```

**重要**: `LLM_API_KEY` の部分は、実際のGroq APIキーに置き換えてください。

---

## 代替オプション（OpenAI API を使用する場合）

OpenAI API を使用する場合は、以下のように設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://zensuohywqtqfzdxwgoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbnN1b2h5d3F0cWZ6ZHh3Z29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzUzMjIsImV4cCI6MjA4MTYxMTMyMn0.by4vAuuqTBSD1nGz8Z4cV2i6LCu3bXtC4olUNV1PMfU
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-openai-api-key-here
LLM_MODEL=gpt-4o-mini
```

---

## チェックリスト

Render の Environment に以下が設定されているか確認：

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://zensuohywqtqfzdxwgoi.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = （提供済みのキー）
- [ ] `LLM_PROVIDER` = `groq`
- [ ] `LLM_API_KEY` = （Groq API キー）
- [ ] `LLM_MODEL` = `llama-3.1-8b-instant`（オプション）

---

## トラブルシューティング

### 環境変数が反映されない

1. **Save Changes** をクリックしたか確認
2. 再デプロイが完了しているか確認（**Logs** タブで確認）
3. 変数名のタイポがないか確認（大文字小文字を正確に）

### エラー: "LLM_API_KEY is not set"

- `LLM_API_KEY` が設定されているか確認
- 値が空でないか確認

### エラー: "Invalid API key"

- Groq API キーが正しいか確認
- [Groq Console](https://console.groq.com/) でキーが有効か確認

---

## 参考

- ローカル開発環境の設定: `ENV_SETUP_QUICKSTART.md`
- Groq API の取得方法: `FREE_LLM_SETUP.md`
- データベースセットアップ: `DATABASE_SETUP.md`

