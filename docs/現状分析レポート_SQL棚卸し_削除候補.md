# 現状分析レポート：SQL棚卸し・削除候補の特定

**目的**: リポジトリ内のSQLおよびSupabase上で「削除してよい／運用で不要」なものを特定し、削除の安全性を整理する。コード変更は一切行わない。

**根拠**: 全 `.sql` の検索結果、アプリコードの `.from()` / `.rpc()` 等の参照、README・docs の記載に基づく。

---

## 1. 重要結論サマリ

- **リポジトリ内の .sql は 7 ファイルのみ**で、すべて `supabase/migrations/` に存在する（001〜007）。`scripts/`・`docs/`・`tools/` に .sql は無い。`supabase/seed.sql` や `supabase/seed.*.sql` も無い。
- **7 本のマイグレーションはすべて「削除対象外」**とする。本番や他環境で既に適用済みの可能性が高く、リポジトリから削除するとスキーマの再現性が失われる。Supabase 上で「未適用のマイグレーション」を消す場合も、適用履歴と他環境との整合を確認してからにすること。
- **Safe to delete に該当する .sql はリポジトリ内に存在しない**。migrations 外の単体 .sql が無いため。
- **要確認**: アプリは `speaking_prompts` / `speaking_feedbacks` / `speaking_attempts` / `speaking_sessions` を参照しているが、**いずれの migration にも CREATE TABLE が無い**。Supabase 上で手動作成または別マイグレーションで作られている可能性があり、それらを「不要」と誤って削除しないよう確認が必要。
- Supabase 上で削除を検討する場合は、**Scheduled queries / Cron / Edge Functions 内の SQL / 手動実行用スクリプト**を優先して棚卸しし、**テーブル・RLS・ポリシー・トリガーは原則削除しない**（アプリ・認証に直結するため）。

---

## 2. SQLファイル一覧（全件）

| パス | 目的（1行） | 種別 |
|------|-------------|------|
| `supabase/migrations/001_initial_schema.sql` | profiles, tasks, attempts, feedbacks, revisions, vocab_items, vocab_logs, daily_state の CREATE TABLE と RLS ポリシー | migration |
| `supabase/migrations/002_task1_step_learning.sql` | attempts への task_type/mode/step_state/review_state 追加、user_skill_stats 作成と RLS | migration |
| `supabase/migrations/003_task1_assets.sql` | tasks へ asset_id, image_path 追加とインデックス | migration |
| `supabase/migrations/004_lexicon.sql` | lexicon_items, lexicon_logs の CREATE TABLE と RLS | migration |
| `supabase/migrations/005_lexicon_questions.sql` | lexicon_questions の CREATE TABLE と RLS | migration |
| `supabase/migrations/006_lexicon_srs_state.sql` | lexicon_srs_state の CREATE TABLE と RLS | migration |
| `supabase/migrations/007_lexicon_module.sql` | lexicon_items / lexicon_questions / lexicon_logs / lexicon_srs_state への module 列追加とインデックス | migration |

- **適用順**: 上記の 001 → 007 の順（`docs/setup_manual.md` 74–80 行、README の「001 を実行」記載と一致）。
- **seed**: `supabase/seed.sql` や `supabase/seed.*.sql` は存在しない。シードは `scripts/seed-lexicon.ts` 等の TypeScript で実行（Supabase クライアント経由）。

---

## 3. Supabaseオブジェクト依存マップ（コード参照 → SQL由来）

### 3.1 参照テーブル一覧（.from('...') の抽出結果）

| テーブル名 | 参照箇所（代表） | 定義元 migration |
|------------|------------------|------------------|
| profiles | app/page.tsx, middleware.ts, onboarding, login | 001 |
| tasks | api/tasks/generate, [taskId], recommended, llm/feedback 等 | 001（003で asset_id/image_path 追加） |
| attempts | api/progress, task1/*, tasks/[taskId]/*, feedback, llm/feedback 等 | 001（002で task_type/mode/step_state/review_state 追加） |
| feedbacks | api/feedback/*, tasks/[taskId]/rewrite, llm/feedback | 001 |
| vocab_items | api/vocab/questions, api/vocab/incorrect | 001 |
| vocab_logs | api/vocab/submit, api/vocab/incorrect | 001 |
| daily_state | api/tasks/recommended, api/progress/summary, api/llm/feedback | 001 |
| user_skill_stats | api/task1/recommendation, api/task1/review/final | 002 |
| lexicon_items | api/lexicon/*, api/input/items, scripts/seed-* | 004（007で module 追加） |
| lexicon_logs | api/lexicon/submit | 004（007で module 追加） |
| lexicon_questions | api/lexicon/questions, api/lexicon/sets, api/lexicon/submit, scripts/seed-* | 005（007で module 追加） |
| lexicon_srs_state | api/menu/today, api/lexicon/questions, api/lexicon/sets, api/input/items, api/lexicon/submit | 006（007で module 追加） |
| speaking_prompts | api/speaking/prompts/generate | **migration に定義なし（要確認）** |
| speaking_feedbacks | api/speaking/evaluations | **migration に定義なし（要確認）** |
| speaking_attempts | api/speaking/attempts | **migration に定義なし（要確認）** |
| speaking_sessions | api/speaking/sessions | **migration に定義なし（要確認）** |

- `revisions` は 001 で作成されているが、**アプリコードから .from('revisions') の参照は見つかっていない**（API 経由で間接参照の可能性は未調査のため要確認とし、テーブル自体の削除は推奨しない）。

### 3.2 参照関数（rpc）一覧

- **検索結果**: リポジトリ内に `.rpc(` の使用は **0 件**。
- ストアド関数はアプリから呼ばれておらず、Supabase 上で RPC を手動実行しているかは未確認。

### 3.3 参照ビュー / トリガー

- コード上でビュー名やトリガー名を直接参照している箇所は検索していないが、**.from() で指定されているのは上記テーブルのみ**。マイグレーションには CREATE VIEW / CREATE TRIGGER は含まれていない（CREATE TABLE と ALTER / CREATE POLICY / CREATE INDEX のみ）。

---

## 4. 削除候補リスト

### 4.1 削除対象外（原則）

| 対象 | 理由 |
|------|------|
| **supabase/migrations/001_initial_schema.sql 〜 007_lexicon_module.sql の全 7 本** | 本番・他環境で既に適用済みの可能性が高く、リポジトリまたは Supabase の「適用済みマイグレーション」から削除すると、環境再現や新規プロジェクト作成ができなくなる。README（116 行）および docs/setup_manual.md（74–80 行）で実行順が明示されている。 |
| **上記マイグレーションが作成するオブジェクト**（テーブル・インデックス・RLS・ポリシー） | アプリが .from() で参照しているテーブルおよび RLS に依存しているため、運用中の Supabase プロジェクトから安易に削除するとアプリが動作しなくなる。 |

### 4.2 Safe to delete（削除してよい可能性が高い）

- **リポジトリ内**: **該当なし**。migrations 以外に .sql が存在しないため。
- **Supabase 上**: 本レポートの調査範囲外。手動で作成した「テスト用」「一時用」の SQL スクリプトや Scheduled query がある場合は、**実行履歴と用途を確認した上で** のみ削除検討。

### 4.3 Needs confirmation（要確認）

| 項目 | 確認内容 | 確認手順 |
|------|----------|----------|
| **speaking_* テーブル（4 つ）** | コードでは参照されているが、7 本の migration のいずれにも CREATE TABLE が無い。Supabase 上で手動作成または別マイグレーション（未コミット等）で作成された可能性がある。 | Supabase Dashboard → Table Editor で `speaking_prompts` / `speaking_feedbacks` / `speaking_attempts` / `speaking_sessions` の有無を確認。存在する場合、それらを「不要」として削除しないこと。未作成ならアプリの Speaking 関連 API は失敗するため、必要に応じて migration を追加する。 |
| **revisions テーブル** | 001 で作成されているが、.from('revisions') の参照がコード検索で見つかっていない。 | 他 API や将来機能で参照する予定か、または完全に未使用かを確認。未使用と断定できる場合のみ「削除候補」とする（その場合も migration の削除ではなく、新 migration での DROP を検討）。 |
| **Supabase 上の Scheduled / Cron / 手動実行 SQL** | リポジトリには存在しない SQL が、Dashboard の SQL Editor や Scheduled queries で登録されている可能性がある。 | 下記「5. Supabase上での確認チェックリスト」に従い、一覧化して用途を確認してから削除の可否を判断する。 |

---

## 5. Supabase上での確認チェックリスト（実行順）

1. **Scheduled / Cron**  
   - Dashboard → Database → Cron または Extensions（pg_cron 等）で、定期実行されている SQL がないか確認。あれば内容と参照オブジェクトをメモし、削除してよいか判断する。

2. **Edge Functions**  
   - Edge Functions 内で Supabase クライアントや raw SQL を実行していないか確認。実行している場合、参照テーブル・関数を把握し、それらを「不要」として消さないようにする。

3. **SQL Editor の保存済みスクリプト**  
   - 保存したクエリやスクリプトの一覧を確認。テスト用・一時用と分かっているものだけ削除候補とする。

4. **Functions（Postgres 関数）**  
   - Database → Functions で一覧を確認。アプリは .rpc() を使っていないため、他システムや手動実行用でなければ削除候補になり得る。**使用箇所が不明なものは削除しない。**

5. **Triggers**  
   - マイグレーションにはトリガー定義が無い。Supabase 上で手動追加したトリガーがあれば、どのテーブル/イベントに紐づくか確認し、削除の影響を検討する。

6. **RLS policies**  
   - 001〜006 のマイグレーションで CREATE POLICY が定義されている。これらを消すと認証・認可が壊れるため、**原則削除しない**。ポリシーの「修正」のみ検討する。

7. **テーブル**  
   - 上記「3.1 参照テーブル一覧」および「4.3」を参照。`speaking_*` 4 テーブルは migration に無いため、Dashboard で存在確認し、ある場合は削除対象に含めない。

---

## 6. 推奨アクションプラン（手順）

1. **Supabase 上で「何が動いているか」を把握する**  
   - 上記チェックリストの 1〜5 を順に実施し、Scheduled / Edge Functions / 保存済み SQL / Functions / Triggers を一覧化する。  
   - 不明な SQL や関数は「要確認」としてマークし、削除しない。

2. **リポジトリ内の SQL は削除しない**  
   - `supabase/migrations/` の 7 本は削除対象外とする。整理したい場合は、**新規マイグレーションでスキーマを整理する**方針とし、既存 001〜007 のファイル削除や内容の無断変更は行わない。

3. **speaking_* と revisions の扱いを決める**  
   - Table Editor で speaking_prompts / speaking_feedbacks / speaking_attempts / speaking_sessions の有無を確認。  
   - 存在するなら「運用で使用中」とみなし、削除候補にしない。存在しないなら、Speaking 機能が動くように必要に応じて migration を追加する。  
   - revisions は参照有無をコードまたは仕様で確認し、未使用と判断した場合のみ、新 migration での DROP を検討する（既存 001 の編集は行わない）。

4. **削除の実行と検証**  
   - 削除してよいと判断したものは、**Scheduled や保存済みスクリプトなど「migration が作るオブジェクト以外」に限定**して削除する。  
   - 削除後にアプリの主要導線（ログイン、タスク作成、フィードバック、語彙・Lexicon、Speaking）を手動または E2E で確認する。

5. **「消すと危ない」代表例の共有**  
   - テーブル（profiles, attempts, tasks, feedbacks, lexicon_*, vocab_*, daily_state, user_skill_stats 等）の DROP。  
   - 上記テーブルに対する RLS の無効化や、マイグレーションで定義したポリシーの削除。  
   - 001〜007 のマイグレーションファイルの削除または改ざん。  
   → いずれも環境の再現性やアプリの動作を壊すため行わない。

---

以上。根拠はすべてリポジトリ内の検索（glob **/*.sql、grep .from(、.rpc(、migrations 内の CREATE/ALTER）および docs/README の記載に基づく。
