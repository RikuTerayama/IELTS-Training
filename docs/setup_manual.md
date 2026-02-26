# マニュアルで設定すべき事項一覧

開発・本番で**手動で行う必要がある設定**をまとめています。環境変数チェックリスト・DB・シード・ホスティング・運用まで含みます。

---

## 1. 環境変数（必須・推奨・任意）

### 1.1 必須（設定しないと起動・認証・LLM が動かない）

| 変数名 | 説明 | 取得元・設定例 |
|--------|------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトの URL | Supabase ダッシュボード → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名（公開）キー | 同上 → Project API keys → anon public |
| `LLM_API_KEY` | LLM 呼び出し用 API キー | Groq: https://console.groq.com/ / OpenAI: https://platform.openai.com/ |
| `LLM_PROVIDER` | 使用する LLM プロバイダー | `groq` / `openai` / `gemini` / `huggingface`（未設定時は `groq`） |
| `LLM_MODEL` | モデル名（任意・省略時はプロバイダー既定） | 例: `llama-3.1-8b-instant`（Groq）, `gpt-4o-mini`（OpenAI） |

**注意**: README に記載の Supabase URL/Anon Key は**サンプルまたは開発用**の可能性があります。本番では**ご自身の Supabase プロジェクト**の値に差し替えてください。

---

### 1.2 シードスクリプト実行時のみ必須

語彙・イディオム・Lexicon のシード（`scripts/seed-*.ts`）を実行する場合：

| 変数名 | 説明 |
|--------|------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase の service_role キー（RLS を迂回するため要設定） |

取得: Supabase ダッシュボード → Settings → API → service_role（**絶対にリポジトリ・クライアントに含めない**）

---

### 1.3 推奨（LP・問い合わせ・ブログリンク）

| 変数名 | 説明 | 未設定時の挙動 |
|--------|------|----------------|
| `NEXT_PUBLIC_CONTACT_EMAIL` | お問い合わせ用メールアドレス | `support@example.com`（要変更） |
| `NEXT_PUBLIC_CONTACT_GOOGLE_FORM_URL` | お問い合わせ用 Google フォーム URL | 空ならフォームリンク非表示 |
| `NEXT_PUBLIC_BLOG_OFFICIAL_URL` | 公式ブログ URL（ナビ用） | `https://ieltsconsult.netlify.app/` |
| `NEXT_PUBLIC_BLOG_NOTE_URL` | Note 等のブログ URL | 空ならナビで非表示にできる |

---

### 1.4 任意・ドキュメントのみ

| 変数名 | 説明 |
|--------|------|
| `APP_BASE_URL` | アプリのベース URL（README 例: `http://localhost:3000`） | メールやリダイレクトで使う場合は本番 URL を設定 |

---

### 1.5 設定ファイルの置き場所

- **ローカル開発**: プロジェクトルートに `.env.local` を作成し、上記を記述。
- **本番（Vercel / Render 等）**: ホスティングの「Environment Variables」で同じ変数を設定。`NEXT_PUBLIC_*` はクライアントに露出するため、秘密にすべきキーは `NEXT_PUBLIC_` を付けないこと。

---

## 2. Supabase（手動で行うこと）

### 2.1 プロジェクト作成

1. https://supabase.com/ でプロジェクトを作成。
2. **Settings → API** で `Project URL` と `anon` / `service_role` キーを控え、環境変数に設定。

### 2.2 マイグレーションの実行

スキーマは **マイグレーションの順序を守って** 適用する必要があります。

| 順序 | ファイル | 内容の概要 |
|------|----------|------------|
| 1 | `supabase/migrations/001_initial_schema.sql` | 初期スキーマ（users, profiles, tasks, attempts 等） |
| 2 | `002_task1_step_learning.sql` | Task1 ステップ学習用 |
| 3 | `003_task1_assets.sql` | Task1 アセット |
| 4 | `004_lexicon.sql` | 語彙・表現用テーブル |
| 5 | `005_lexicon_questions.sql` | 語彙問題 |
| 6 | `006_lexicon_srs_state.sql` | SRS 復習状態 |
| 7 | `007_lexicon_module.sql` | Lexicon モジュール |

**実行方法（どちらか）**:

- **Supabase CLI**: プロジェクトルートで `supabase db push`（`supabase link` 済みであること）。
- **手動**: ダッシュボードの SQL Editor で、上記の順に各ファイルの内容をコピー＆実行。

### 2.3 RLS（Row Level Security）

マイグレーションに RLS ポリシーが含まれている場合は、そのまま適用されます。自前で変更した場合は、**認証済みユーザーだけが自分のデータにアクセスできる**ことを必ず確認してください。

### 2.4 認証設定（メール・OAuth）

- **Authentication → Providers** で Email を有効化（必要なら確認メールの有効/無効を設定）。
-  Google / GitHub 等を使う場合は、該当プロバイダーを有効化し、リダイレクト URL に `https://あなたのドメイン/auth/callback` を登録。

---

## 3. シードデータ（任意・手動実行）

語彙・イディオム・Lexicon のマスタデータを投入する場合：

1. `NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` を設定。
2. 以下を必要に応じて実行（例）:
   - `npx ts-node scripts/seed-vocab.ts`
   - `npx ts-node scripts/seed-idiom.ts`
   - `npx ts-node scripts/seed-lexicon.ts` または `seed-lexicon-v2.ts`

**注意**: 実行前にマイグレーション 004〜007 が適用済みであること。既存データが上書きされる場合があります。

---

## 4. ホスティング（Vercel / Render 等）

### 4.1 環境変数の注入

- 上記「1. 環境変数」の**本番用の値**を、ホスティングの Environment Variables に登録。
- 本番では `APP_BASE_URL` を本番 URL（例: `https://your-app.vercel.app`）に設定することを推奨。

### 4.2 README の記載について

README に「Render（本番環境）での環境変数設定は `RENDER_ENV_VARIABLES.md` を参照」とありますが、**当該ファイルはリポジトリに存在しません**。本番用の環境変数一覧は本ドキュメント（`docs/setup_manual.md`）の「1. 環境変数」を参照してください。必要であれば `RENDER_ENV_VARIABLES.md` を新規作成し、Render 用の手順だけ抜き出して記載することを推奨します。

### 4.3 ビルド・出力

- Next.js のビルドコマンドは通常 `npm run build`。
- 静的生成でエラーになるルートがある場合は、該当ページで `export const dynamic = 'force-dynamic'` を検討（`docs/capabilities_and_risks.md` の「静的生成時の動的利用」を参照）。

---

## 5. 運用・セキュリティで手動確認すべきこと

### 5.1 定期的に確認したい項目

- **環境変数・キーの露出**: コード・ログ・公開リポジトリに Supabase の service_role や LLM API キーが含まれていないか。
- **本番の console.log**: `middleware.ts` 等にデバッグ用の `console.log` が残っているため、本番では無効化またはログレベルで制御することを推奨（`docs/capabilities_and_risks.md` の「直近でやるべき改善トップ5」参照）。
- **保護ルートの網羅**: 新規ルートを追加したら、`middleware.ts` の `protectedPaths` に認証必須パスが含まれているか確認。

### 5.2 本番デプロイ前チェックリスト（推奨）

- [ ] `.env.local` やキーが Git にコミットされていない
- [ ] 本番用 Supabase の URL / anon key を設定済み（README のサンプル値のままにしていない）
- [ ] LLM API キーを本番用に設定済み
- [ ] 問い合わせメール・フォーム URL を本番用に変更（`NEXT_PUBLIC_CONTACT_*`）
- [ ] 認証のリダイレクト URL（OAuth 等）に本番ドメインを登録済み
- [ ] マイグレーション 001〜007 が本番 DB に適用済み

---

## 6. 追加不足している事項（リポジトリ側で未整備のもの）

以下は現時点で**不足している・追加するとよい**事項です。

| 項目 | 内容 |
|------|------|
| **.env.example** | リポジトリに `.env.example` が存在しない。必要な変数名と説明だけを列挙したサンプルがあると、初回セットアップで漏れが防げる。 |
| **RENDER_ENV_VARIABLES.md** | README で参照されているがファイルが存在しない。本番（Render）用の環境変数一覧・手順をここに書くか、本ドキュメントへのリンクに差し替えるとよい。 |
| **保護ルートの網羅** | `middleware.ts` の `protectedPaths` に `/training` が含まれていない。`/training/*` 配下（語彙・Speaking・Writing 等）も認証必須にする場合は、`'/training'` を追加する必要がある。 |
| **環境変数チェックリストの README 掲載** | `docs/capabilities_and_risks.md` の「直近でやるべき改善トップ5」に「環境変数チェックリストを README に明記」とあるが、README には簡易的な例のみ。本ドキュメント（`docs/setup_manual.md`）へのリンクを README に追加すると、一貫して参照しやすい。 |
| **LLM レート制限** | API の連打防止のため、レート制限（ユーザー単位・IP 単位など）の設定が未実装。手動で API 側の制限をかけるか、コードで実装する必要がある。 |
| **Supabase Auth リダイレクト URL** | 本番ドメインでの OAuth 利用時、Supabase の「Redirect URLs」に本番 URL を登録する手順が README に明示されていない。本ドキュメント「2.4 認証設定」に記載済み。 |

---

## 7. まとめ：あなたが手動でやること

1. **環境変数**: `.env.local`（または本番の Environment Variables）に、必須・推奨の変数を設定する。
2. **Supabase**: プロジェクト作成 → マイグレーション 001〜007 を順に実行 → 認証プロバイダー・リダイレクト URL を設定する。
3. **シード（任意）**: 語彙・Lexicon 等を投入する場合は、service_role キーを設定してから `scripts/seed-*.ts` を実行する。
4. **本番**: ホスティングの環境変数に本番用の値を設定し、デプロイ前チェックリストで確認する。
5. **運用**: キー露出・console.log・保護ルートの見直しを定期的に行う。

不明点や追加したい設定があれば、このドキュメントに追記していくことを推奨します。
