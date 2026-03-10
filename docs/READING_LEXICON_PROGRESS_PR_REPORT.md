# Reading Lexicon v1 Progress / 履歴・統計 実装報告

## 1. 変更ファイル一覧

### 新規
- `app/api/progress/reading-lexicon-history/route.ts` — Reading Lexicon 用履歴 API（GET）
- `docs/READING_LEXICON_PROGRESS_PR_REPORT.md` — 本報告書

### 変更
- `lib/db/reading-srs.ts` — `countReadingLexiconDueToday()` を追加（skill=reading, module=lexicon の question_id のみ Due 集計）
- `app/progress/page.tsx` — Reading Lexicon セクション追加（履歴取得、Due / 直近ログ / カテゴリ別正答率、空状態、CTA）

---

## 2. 追加した API の内容

### GET /api/progress/reading-lexicon-history

- **認証**: 要ログイン（未認証は 401）
- **対象**: `lexicon_questions` の `skill='reading'`, `module='lexicon'`（question_type は問わず。Reading Lexicon はすべて signal 想定）
- **返却**:
  - `history`: 直近 10 件の `lexicon_logs`（question_id で join、prompt / category / is_correct / user_answer / created_at）
  - `stats_by_category`: カテゴリごとの試行数・正答数・正答率（`category_label` 付き。Cause / Effect など 6 ラベル）
  - `due_count`: 今日 Due の件数（`reading_srs_state` を `lexicon_questions` の Reading Lexicon 用 question_id に限定して集計）

**実装の要点**
- `lexicon_questions` で reading + lexicon の id 一覧取得 → `lexicon_logs` を question_id でフィルタ（最大 50 件）→ 直近 10 件を history、全件でカテゴリ別集計
- Due は `countReadingLexiconDueToday()` で集計（`lib/db/reading-srs.ts` に新規追加）

---

## 3. Progress UI の変更点

- **Reading Lexicon (Signal Bank) セクション**を、既存の「Reading History」（Vocab）の直下に追加。
- **表示内容**
  - 見出し・説明文。Due がある場合は「Due today: N」を表示。
  - **By category（正答率）**: `stats_by_category` をグリッド表示（ラベルは Cause / Effect など）。
  - **Recent attempts**: 直近 10 件を日時・カテゴリラベル・正誤・回答・プロンプト抜粋で表示。
  - **CTA**: 「Review Reading Lexicon」または「Practice Reading Lexicon」（Due 有無で文言切り替え）。
- **空状態（0 件）**
  - 履歴も統計も Due もない場合、説明文＋「Reading Lexicon を始める」リンクを表示。
- **ラベル**
  - カテゴリは `READING_LEXICON_CATEGORY_LABELS`（`@/data/lexicon/reading/types`）と API の `category_label` で統一（Cause / Effect, Contrast / Concession, Definition / Classification, Evidence / Claim, Process / Sequence, Trend / Change）。

既存の Reading History（Vocab）、Speaking、Attempts 等は変更なし。

---

## 4. build / lint / tsc 結果

| コマンド | 結果 |
|----------|------|
| `npx tsc --noEmit` | 成功（Exit code 0） |
| `npm run lint` | 成功（既存 Warning のみ、新規 Error なし） |
| `npm run build` | 成功（Exit code 0）。`/api/progress/reading-lexicon-history` がビルドに含まれることを確認 |

---

## 5. 既知の制約

- **Due 集計**: Reading Vocab と Reading Lexicon は別々。`countReadingDueToday()` は従来どおり「Reading 全体」、`countReadingLexiconDueToday()` は「Reading Lexicon のみ」。Progress の Reading History の Due は Vocab 用のまま（reading-vocab-history の due_count）。
- **対象問題**: API は `skill='reading'` かつ `module='lexicon'` の全問題を対象。question_type でのフィルタはしていない（現状はすべて signal 想定）。
- **履歴件数**: 直近 10 件表示、内部では最大 50 件取得してカテゴリ別集計。
- **Listening / Reading Idiom**: 今回の対象外。

---

以上、Reading Lexicon v1 の Progress / 履歴・統計の実装内容です。学習ループは Progress 上の「Due → Recent attempts / By category → CTA で /training/lexicon?skill=reading へ」で閉じています。
