# Input モジュール公開状態解消 & Reading Idiom v1 実装報告

## 1. Root cause

### 語彙練習（/training/vocab）で 4 skill が no-data になる原因

- **原因: seed 未投入**
- API は `module=vocab` で `lexicon_questions`（Reading/Listening）または `lexicon_items` + `lexicon_questions`（Speaking/Writing）を参照している。スキーマ・クエリ・フィルタに不整合はない。
- 本番や開発環境で **vocab 用の seed を実行していない** と、該当テーブルに `module='vocab'` の行が存在せず、sets が空になる。
- 必要な seed:
  - **Speaking / Writing**: `npm run seed:vocab`（data/vocab/master.ts から lexicon_items + lexicon_questions 投入）
  - **Reading**: `npm run seed:vocab:reading`（data/vocab/reading から lexicon_questions のみ）
  - **Listening**: `npm run seed:vocab:listening`（data/vocab/listening から lexicon_questions のみ）

### 熟語練習（/training/idiom）で Reading が Coming soon のままだった原因

- **原因: Reading Idiom の未実装**
- 実データ（lexicon_questions, skill=reading, module=idiom）がなく、UI も Reading を「Coming soon」として扱っていた。
- 今回、Reading Idiom v1 を独立モジュールとして実装し、シード・API・UI を有効化した。

---

## 2. 変更ファイル一覧

| 種別 | ファイル | 内容 |
|------|----------|------|
| 新規 | data/idiom/reading/types.ts | Reading Idiom 型・カテゴリ定義 |
| 新規 | data/idiom/reading/causeReason.ts | Cause/reason 21問 |
| 新規 | data/idiom/reading/contrastConcession.ts | Contrast/concession 23問 |
| 新規 | data/idiom/reading/definitionReference.ts | Definition/reference 22問 |
| 新規 | data/idiom/reading/evidenceClaim.ts | Evidence/claim 22問 |
| 新規 | data/idiom/reading/quantityTrend.ts | Quantity/trend 22問 |
| 新規 | data/idiom/reading/processRelation.ts | Process/relation 24問 |
| 新規 | data/idiom/reading/index.ts | 結合・バリデーション |
| 新規 | scripts/seed-idiom-reading.ts | Reading Idiom シード |
| 変更 | package.json | seed:idiom:reading, seed:vocab:all 追加 |
| 変更 | app/home/page.tsx | 熟語練習 Reading を有効（href, disabled: false） |
| 変更 | app/training/idiom/page.tsx | Reading 対応（validSkillQuery, handleStartQuiz, セッション表示, getCategoryLabel, 結果 explanation） |
| 新規 | docs/INPUT_MODULE_AND_READING_IDIOM_V1_REPORT.md | 本報告書 |

---

## 3. Reading Idiom v1 のカテゴリ設計と問題数

| カテゴリ | カテゴリ ID | 問題数 | 内容 |
|----------|-------------|--------|------|
| Cause / reason phrases | idiom_reading_cause_reason | 21 | due to, owing to, as a result of, stems from 等 |
| Contrast / concession phrases | idiom_reading_contrast_concession | 23 | nevertheless, although, despite, whereas 等 |
| Definition / reference phrases | idiom_reading_definition_reference | 22 | refers to, according to, denotes, is defined as 等 |
| Evidence / claim phrases | idiom_reading_evidence_claim | 22 | according to, claims, suggests, on the basis of 等 |
| Quantity / trend phrases | idiom_reading_quantity_trend | 22 | increased, declined, fluctuated, accounted for 等 |
| Process / relation phrases | idiom_reading_process_relation | 24 | consists of, leads to, depends on, followed by 等 |

- **合計: 134 問**（120問以上を達成）
- 全問 `meta.explanation` 必須。多くに `distractor_note` / `paraphrase_tip` / `passage_excerpt` を付与。
- SRS は既存の `reading_srs_state`（question_id ベース）を利用。review_only / new_only / 復習＋新規 に対応。

---

## 4. Vocab 4 skill の修正内容

- **コード上の不整合はなし。** 原因は seed 未実行のみ。
- 対応として **`seed:vocab:all`** を追加し、以下を順に実行するようにした。
  - `npm run seed:vocab`（Speaking / Writing）
  - `npm run seed:vocab:reading`（Reading）
  - `npm run seed:vocab:listening`（Listening）
- 本番・検証環境で上記を実行すれば、/training/vocab の 4 skill で sets が返り、no-data にならない。

---

## 5. 本番反映手順

### 前提

- 既存 migration は適用済み（lexicon_questions / lexicon_items の module 列、reading_srs_state, listening_srs_state 等）。
- 新規 migration は不要。

### 必要な seed と実行コマンド

| 目的 | コマンド |
|------|----------|
| 語彙練習 4 skill すべて | `npm run seed:vocab:all` |
| 語彙 のみ（Reading 除く） | `npm run seed:vocab` |
| 語彙 Reading のみ | `npm run seed:vocab:reading` |
| 語彙 Listening のみ | `npm run seed:vocab:listening` |
| 熟語 Reading のみ | `npm run seed:idiom:reading` |
| 熟語 Speaking/Writing | `npm run seed:idiom` |
| 熟語 Listening | `npm run seed:idiom:listening` |

### OnRender / 本番 DB でやること

1. **環境変数**  
   `NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` が本番用に設定されていること。

2. **語彙練習で 4 skill を有効にしたい場合**  
   本番 DB に対して **1 回だけ** 以下を実行する。
   ```bash
   npm run seed:vocab:all
   ```

3. **熟語練習で Reading を有効にしたい場合**  
   本番 DB に対して **1 回だけ** 以下を実行する。
   ```bash
   npm run seed:idiom:reading
   ```

4. **デプロイ**  
   通常どおり main をデプロイ。既存 migration は適用済みであれば追加の DB 変更は不要。

5. **確認**  
   - /training/vocab?skill=reading（および listening / speaking / writing）でカテゴリ一覧が表示されること。
   - /training/idiom?skill=reading でカテゴリ一覧が表示され、問題が解けること。
   - ホームの熟語練習で Reading が押せ、/training/idiom?skill=reading に遷移すること。

---

## 6. build / lint / tsc 結果

- `npm run build`: 成功（Next.js 14.1.0）。既存の react-hooks/exhaustive-deps 等の警告のみ。
- `npm run lint`: 成功。同上。
- `npx tsc --noEmit`: 成功（exit 0）。

---

## 7. 既知の制約

- **語彙・熟語の no-data**  
  本番で上記 seed を実行していないと、該当 skill は引き続き「データがありません」となる。実行後は解消する。

- **Reading Idiom**  
  - 現状は Click のみ（Typing は未実装）。  
  - カテゴリは 6 つ固定。追加する場合は data/idiom/reading にシードを足し、seed-idiom-reading.ts を再実行する。

- **Vocab Speaking/Writing**  
  - lexicon_items に依存。seed:vocab を実行していない環境では語彙の Speaking/Writing は空のまま。
