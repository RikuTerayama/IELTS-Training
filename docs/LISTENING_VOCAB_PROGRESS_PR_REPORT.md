# Listening Vocab v1 Progress / 履歴・統計 実装報告

## 1. 変更ファイル一覧

### 新規
- `lib/db/listening-srs.ts` — `countListeningDueToday()`、`getListeningDueDate()`（listening_srs_state を使用）
- `app/api/progress/listening-vocab-history/route.ts` — Listening Vocab 用履歴 API（GET）
- `docs/LISTENING_VOCAB_PROGRESS_PR_REPORT.md` — 本報告書

### 変更
- `app/progress/page.tsx` — Listening Vocab セクション追加（履歴取得、Due / 直近ログ / カテゴリ別正答率、空状態、CTA）

---

## 2. 追加した API の内容

### GET /api/progress/listening-vocab-history

- **認証**: 要ログイン（未認証は 401）
- **対象**: `lexicon_questions` の `skill='listening'`, `module='vocab'`
- **返却**:
  - `history`: 直近 10 件の `lexicon_logs`（question_id で join、prompt / category / is_correct / user_answer / created_at）
  - `stats_by_category`: カテゴリごとの試行数・正答数・正答率（`category_label` 付き。6 カテゴリ）
  - `due_count`: 今日 Due の件数（`listening_srs_state` を lexicon_questions の Listening Vocab 用 question_id に限定して集計）

**実装の要点**
- `lexicon_questions` で listening + vocab の id 一覧取得 → `lexicon_logs` を question_id でフィルタ（最大 50 件）→ 直近 10 件を history、全件でカテゴリ別集計
- Due は `countListeningDueToday()` で集計（`lib/db/listening-srs.ts`）
- `listening_srs_state` が存在しない場合（Listening Vocab 未導入時）は、try-catch で `due_count` を 0 として返す

---

## 3. Progress UI の変更点

- **Listening Vocab** セクションを、Reading Lexicon の直下に追加
- **表示内容**
  - 見出し・説明文。Due がある場合は「Due today: N」を表示
  - **By category（正答率）**: `stats_by_category` をグリッド表示（ラベルは Form/note, Campus, Lecture など）
  - **Recent attempts**: 直近 10 件を日時・カテゴリラベル・正誤・回答・プロンプト抜粋で表示
  - **CTA**: 「Review Listening Vocab」または「Practice Listening Vocab」（Due 有無で文言切り替え）
- **空状態（0 件）**
  - 履歴も統計も Due もない場合、説明文＋「Listening Vocab を始める」リンク（`/training/vocab?skill=listening`）を表示
- **ラベル**
  - カテゴリは `LISTENING_VOCAB_CATEGORY_LABELS` と API の `category_label` で統一（Form/note completion, Campus/daily life, Lecture vocabulary, Numbers/dates/spelling, Spoken distractors, Paraphrase in conversation）

既存の Reading History（Vocab）、Reading Lexicon、Speaking、Attempts 等は変更なし。

---

## 4. build / lint / tsc 結果

| コマンド | 結果 |
|----------|------|
| `npx tsc --noEmit` | 成功 |
| `npm run lint` | 成功（既存 Warning のみ、新規 Error なし） |
| `npm run build` | 成功。`/api/progress/listening-vocab-history` がビルドに含まれる |

---

## 5. 既知の制約

- **listening_srs_state**: `listening_srs_state` テーブルは Listening Vocab v1 のマイグレーション（014）で作成される想定。テーブルが無い場合は `countListeningDueToday()` がエラーになるため、API 内で try-catch し `due_count` を 0 にしている。
- **lexicon_questions**: `skill='listening'`, `module='vocab'` の行が無い場合、history と stats_by_category は空、due_count は 0 になる。
- **Listening Vocab v1 の前提**: 本 PR は Listening Vocab v1（語彙練習・listening_srs_state・6 カテゴリ・147 問）が実装済みであることを前提とする。Listening Vocab 本体が main に未マージの場合は、その PR を先にマージする必要がある。

---

以上、Listening Vocab v1 の Progress / 履歴・統計の実装内容です。学習ループは Progress 上の「Due → Recent attempts / By category → CTA で /training/vocab?skill=listening へ」で閉じています。
