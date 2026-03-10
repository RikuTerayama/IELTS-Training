# Reading Lexicon v1 実装報告（Academic Reading Signal Bank）

## 1. 変更ファイル一覧

### 新規
- `data/lexicon/reading/types.ts` — カテゴリ・型・ラベル定義
- `data/lexicon/reading/causeEffect.ts` — Cause/Effect シード（22問）
- `data/lexicon/reading/contrastConcession.ts` — Contrast/Concession シード（22問）
- `data/lexicon/reading/definitionClassification.ts` — Definition/Classification シード（22問）
- `data/lexicon/reading/evidenceClaim.ts` — Evidence/Claim シード（22問）
- `data/lexicon/reading/processSequence.ts` — Process/Sequence シード（22問）
- `data/lexicon/reading/trendChange.ts` — Trend/Change シード（22問）
- `data/lexicon/reading/index.ts` — 結合シード・バリデーション・export
- `scripts/seed-lexicon-reading.ts` — DB 投入スクリプト

### 変更
- `app/training/lexicon/page.tsx` — Reading スキル対応、review_only/new_only、ラベル、`module` → `lexiconModule`（lint 対応）
- `app/home/page.tsx` — Lexicon モジュールで Reading を有効化（リンク有効）
- `app/progress/page.tsx` — Reading セクションに「Reading Lexicon (Signal Bank)」リンク追加、Vocab リンク表記を「Reading Vocab」に統一
- `lib/api/lexicon.ts` — `question_type` に `'signal'` を追加
- `package.json` — `seed:lexicon:reading` スクリプト追加

---

## 2. カテゴリ設計

| カテゴリ ID | 表示名 | 内容 |
|-------------|--------|------|
| `reading_lexicon_cause_effect` | Cause / Effect | 因果の signal phrase・コロケーション |
| `reading_lexicon_contrast_concession` | Contrast / Concession | 対比・譲歩表現 |
| `reading_lexicon_definition_classification` | Definition / Classification | 定義・分類の表現 |
| `reading_lexicon_evidence_claim` | Evidence / Claim | 根拠・主張の表現 |
| `reading_lexicon_process_sequence` | Process / Sequence | プロセス・順序の表現 |
| `reading_lexicon_trend_change` | Trend / Change | 傾向・変化の表現 |

DB の `lexicon_questions` では `skill='reading'`, `module='lexicon'`, `question_type='signal'`, `category` に上記 ID を保存。`item_id` は null（Reading Vocab と同様）。

---

## 3. 問題数

| カテゴリ | 問題数 |
|----------|--------|
| Cause / Effect | 22 |
| Contrast / Concession | 22 |
| Definition / Classification | 22 |
| Evidence / Claim | 22 |
| Process / Sequence | 22 |
| Trend / Change | 22 |
| **合計** | **132** |

- 全問 **click** モード（4択）。explanation・usage_note は `meta` で保持。
- シード投入: `npm run seed:lexicon:reading`（要 Supabase 環境変数）。

---

## 4. API / UI / SRS の対応内容

### API
- **変更なし**。既存の `GET /api/lexicon/sets`, `GET /api/lexicon/questions`, `POST /api/lexicon/submit` をそのまま利用。
- `skill=reading`, `module=lexicon` で sets/questions 取得。`review_only` / `new_only` は Reading Vocab と同様にクエリで指定。
- submit 時は `reading_srs_state` を更新（`item_id` なし）。

### UI（`/training/lexicon`）
- スキルに **Reading（Academic Reading Signal Bank）** を追加。
- Reading 選択時: 6 カテゴリを表示、Due 件数表示、**「復習のみ」「新規のみ」「復習＋新規で開始」** で開始可能。
- クイズ中: `passage_excerpt`・`strategy` を表示。結果で `meta.explanation`・`meta.usage_note` を表示。
- ラベルは `READING_LEXICON_CATEGORY_LABELS` で表示名を統一。

### SRS
- **変更なし**。`reading_srs_state` を Reading Vocab と共通で使用。`skill='reading'`, `module='lexicon'` の設問は `question_id` ベースで SRS 状態を保持。

---

## 5. build / lint / tsc 結果

- **tsc**: `npx tsc --noEmit` — 成功（Exit code 0）
- **lint**: `npm run lint` — 既存の Warning のみ（他ファイルの useEffect 依存など）。**lexicon 関連**では `module` 変数代入を `lexiconModule` に変更し、Error 解消済み。
- **build**: `npm run build` — 成功（Exit code 0）。警告は他モジュール由来で、Reading Lexicon 追加による新規 Error なし。

---

## 6. 既知の制約

- **Progress ページ**: Reading の履歴・Due 数は **Reading Vocab** 用 API（`/api/progress/reading-vocab-history`）のみ。Reading Lexicon 専用の履歴・統計 API は未実装。Lexicon への導線（「Reading Lexicon (Signal Bank)」リンク）のみ追加済み。
- **問題形式**: 現状は click のみ。typing は型・バリデーションでは許容しているが、シードには含めていない。
- **シード投入**: 初回または再投入時は `npm run seed:lexicon:reading` を手動実行する必要がある。既存の `skill='reading'` & `module='lexicon'` の行は削除してから挿入する仕様。
- **Listening**: Lexicon の Listening は「Coming soon」のまま。今回の対象外。

---

以上、Reading Lexicon v1（Academic Reading Signal Bank）の設計・実装内容です。
