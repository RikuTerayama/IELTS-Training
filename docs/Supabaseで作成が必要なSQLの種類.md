# Supabase で作成が必要な SQL の種類

現状のアプリと今後の運用を踏まえ、Supabase 上で作成・管理が必要な SQL の種類を整理しました。

---

## 1. まとめ（種類一覧）

| 種類 | 目的 | 現状 | 今後の運用 |
|------|------|------|------------|
| **マイグレーション（スキーマ）** | テーブル・インデックス・RLS の定義 | 001〜007 がリポジトリにあり順次適用 | スキーマ変更は**新規マイグレーション**で追加（008, 009...） |
| **Speaking 用テーブル** | speaking_* 4 テーブル | **migration に未定義**（要作成） | 新規マイグレーション 1 本で作成推奨 |
| **シード用 SQL** | 初回データ投入 | リポジトリに `seed.sql` は無し（TS スクリプトで投入） | 任意。必要なら `seed.sql` または TS のまま |
| **ストアド関数（RPC）** | 複雑な集計・バッチ | 未使用（.rpc() 0 件） | 必要になったら migration または手動で CREATE FUNCTION |
| **トリガー** | 自動更新（updated_at 等） | マイグレーションに未定義 | 必要なら新規 migration で CREATE TRIGGER |
| **Scheduled / Cron** | 定期実行 | 未確認（Dashboard 要確認） | バッチ・集計が必要なら pg_cron 等で SQL 登録 |
| **手動実行スクリプト** | 運用・調査用 | リポジトリ外の可能性 | SQL Editor の保存クエリ等は用途を明文化して管理 |

---

## 2. マイグレーション（スキーマ）— 必須

**役割**: テーブル・インデックス・RLS ポリシーの定義。環境の再現と本番反映に必須。

### 2.1 既存マイグレーション（001〜007）

すべて **削除せず**、記載順に適用する。

| ファイル | 主な内容 |
|----------|----------|
| `001_initial_schema.sql` | profiles, tasks, attempts, feedbacks, revisions, vocab_items, vocab_logs, daily_state の CREATE TABLE + RLS |
| `002_task1_step_learning.sql` | attempts への列追加、user_skill_stats 作成 + RLS |
| `003_task1_assets.sql` | tasks へ asset_id, image_path 追加とインデックス |
| `004_lexicon.sql` | lexicon_items, lexicon_logs の CREATE TABLE + RLS |
| `005_lexicon_questions.sql` | lexicon_questions の CREATE TABLE + RLS |
| `006_lexicon_srs_state.sql` | lexicon_srs_state の CREATE TABLE + RLS |
| `007_lexicon_module.sql` | lexicon 系テーブルへの module 列追加とインデックス |

**運用**:  
- 新規環境: `supabase db push` または SQL Editor で上記順に実行。  
- 既存環境: 001〜007 は**編集・削除しない**。変更は新規マイグレーションで行う。

---

## 3. Speaking 用テーブル — 要作成（現状不足）

アプリは次の 4 テーブルを参照していますが、**いずれも 001〜007 に CREATE TABLE がありません**。  
Supabase 上で手動作成している場合はそのまま運用可。未作成なら **新規マイグレーション（例: `008_speaking_tables.sql`）で作成**してください。

### 3.1 必要なテーブルと想定カラム（API の insert/select から逆算）

- **speaking_sessions**  
  - `id` (UUID, PK), `user_id` (UUID, auth.users 参照), `mode` (TEXT), `part` (TEXT), `topic` (TEXT), `level` (TEXT), `started_at` (TIMESTAMPTZ), 必要なら `created_at`  
  - RLS: 認証ユーザーが自分の行のみ SELECT/INSERT/UPDATE

- **speaking_prompts**  
  - `id` (UUID, PK), `session_id` (UUID, NULL 可＝プリセット用), `mode`, `part`, `topic`, `level`, `jp_intent`, `expected_style`, `target_points` (JSONB 想定), `model_answer`, `paraphrases`, `cue_card`, `followup_question`, `time_limit`, 必要なら `created_at`  
  - RLS: 認証ユーザーが自分のセッションに紐づく行のみ操作（プリセットは session_id IS NULL で誰でも SELECT 可など）

- **speaking_attempts**  
  - `id` (UUID, PK), `user_id` (UUID), `session_id` (UUID), `prompt_id` (UUID), `user_response` (TEXT), `response_time`, `word_count`, `wpm`, `filler_count`, `long_pause_count`, 必要なら `created_at`  
  - RLS: 認証ユーザーが自分の行のみ SELECT/INSERT

- **speaking_feedbacks**  
  - `id` (UUID, PK), `attempt_id` (UUID), `fluency_band`, `lexical_band`, `grammar_band`, `pronunciation_band`, `overall_band`, `evidence` (JSONB 想定), `top_fixes`, `rewrite`, `micro_drills`, `weakness_tags`, 必要なら `created_at`  
  - RLS: 認証ユーザーが自分の attempt に紐づく行のみ SELECT/INSERT

上記は **API の参照に合わせた最小構成**です。実際のマイグレーションでは型・制約・インデックス・外部キーを決めてから CREATE TABLE と RLS を書いてください。

---

## 4. 今後の運用で検討する SQL の種類

### 4.1 スキーマ変更（推奨: 新規マイグレーション）

- 新テーブル追加・列追加・インデックス追加・RLS 追加・既存ポリシー変更は、すべて **新しいマイグレーションファイル**（008, 009...）で行う。  
- 既存 001〜007 のファイル内容は変更しない（履歴と他環境の整合のため）。

### 4.2 シードデータ

- 現状: `supabase/seed.sql` は無く、`scripts/seed-vocab.ts` 等の TypeScript で Supabase クライアント経由投入。  
- 運用: そのまま TS でよい。SQL でやりたい場合は `supabase/seed.sql` を用意し、必要に応じてダッシュボードや CLI で実行。

### 4.3 ストアド関数（RPC）

- 現状: アプリから `.rpc()` は未使用。  
- 運用: 複雑な集計やバッチを DB 側に寄せたい場合に、マイグレーションまたは手動で `CREATE FUNCTION` を追加。使用する場合はアプリで `.rpc()` を呼ぶ。

### 4.4 トリガー

- 現状: マイグレーションにトリガーは無し。  
- 運用: `updated_at` の自動更新などが必要なら、新規マイグレーションで `CREATE TRIGGER` を追加。

### 4.5 Scheduled queries / Cron

- 現状: リポジトリには無く、Dashboard 側は要確認。  
- 運用: 定期バッチ（集計・古いデータ削除など）が必要なら、Supabase の pg_cron 等で SQL を登録。内容と実行スケジュールはドキュメント化する。

### 4.6 手動実行・保存クエリ

- SQL Editor の「保存したクエリ」や運用スクリプトは、**用途・対象テーブル・実行タイミング**を一覧化し、削除時は影響範囲を確認してから行う。

---

## 5. 運用時の注意（削除してはいけないもの）

- **001〜007 のマイグレーションファイル**  
  - 削除や無断編集をしない。  
- **マイグレーションが作成しているオブジェクト**  
  - テーブル（profiles, tasks, attempts, feedbacks, revisions, vocab_*, daily_state, user_skill_stats, lexicon_*）の DROP、およびそれらの RLS ポリシー削除は行わない（アプリ・認証が動かなくなる）。  
- **speaking_***  
  - 既に Supabase 上で手動作成している場合は、削除対象にしない。未作成なら上記のとおり新規マイグレーションで作成する。

---

## 6. チェックリスト（新規環境 or 既存環境の確認）

- [ ] 001〜007 を順に適用済み（または `supabase db push` 済み）
- [ ] `speaking_sessions` / `speaking_prompts` / `speaking_attempts` / `speaking_feedbacks` の有無を Table Editor で確認
- [ ] 未作成なら `008_speaking_tables.sql`（または同様の名前）で 4 テーブル + RLS を作成・適用
- [ ] シードが必要なら `scripts/seed-*.ts` または `seed.sql` を実行
- [ ] Dashboard の Cron / Edge Functions / 保存済み SQL を一覧化し、不要なものだけ用途確認の上で削除検討

---

以上が、現状と今後の運用を鑑みた「Supabase で作成が必要な SQL の種類」の整理です。
