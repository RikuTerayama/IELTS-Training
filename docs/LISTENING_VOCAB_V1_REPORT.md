# Listening Vocab v1 実装報告

## 1. 変更ファイル一覧

### 新規
- `supabase/migrations/014_listening_srs_state.sql` — Listening 用 SRS テーブル
- `supabase/migrations/015_lexicon_listening.sql` — lexicon_questions / lexicon_items の skill に `listening` 追加
- `lib/db/listening-srs.ts` — Due 日付・`countListeningDueToday`
- `data/vocab/listening/types.ts` — カテゴリ・型・ラベル・meta（explanation, transcript_excerpt, speaker_type）
- `data/vocab/listening/formNoteCompletion.ts` — Form / note completion シード（23問）
- `data/vocab/listening/campusDailyLife.ts` — Campus / daily life シード（24問）
- `data/vocab/listening/lectureVocabulary.ts` — Lecture vocabulary シード（25問）
- `data/vocab/listening/numbersDatesSpelling.ts` — Numbers / dates / spelling シード（25問）
- `data/vocab/listening/spokenDistractors.ts` — Spoken distractors シード（24問）
- `data/vocab/listening/paraphraseInConversation.ts` — Paraphrase in conversation シード（26問）
- `data/vocab/listening/index.ts` — 結合シード・バリデーション・export
- `scripts/seed-vocab-listening.ts` — DB 投入スクリプト
- `docs/LISTENING_VOCAB_V1_REPORT.md` — 本報告書

### 変更
- `app/api/lexicon/sets/route.ts` — `skill=listening` 対応（lexicon_questions + listening_srs_state、total_due）
- `app/api/lexicon/questions/route.ts` — `skill=listening` 対応（review_only / new_only / mixed、listening_srs_state）
- `app/api/lexicon/submit/route.ts` — 回答送信時に `listening_srs_state` を更新
- `lib/api/lexicon.ts` — fetchLexiconSets / fetchLexiconQuestions の skill に `listening`、listening 時 params（review_only / new_only）
- `app/training/vocab/page.tsx` — Listening スキル追加、Due 表示、復習のみ/新規のみ/復習＋新規、カテゴリラベル、結果の explanation 表示
- `app/home/page.tsx` — 語彙練習の Listening を有効（href・disabled: false）
- `package.json` — `seed:vocab:listening` スクリプト追加

---

## 2. カテゴリ設計

| カテゴリ ID | 表示名 | 内容 |
|-------------|--------|------|
| `vocab_listening_form_note` | Form / note completion | フォーム・メモ穴埋めでよく出る語彙（Section 1 風） |
| `vocab_listening_campus_daily` | Campus / daily life | キャンパス・日常生活の表現（hand in, common room, deadline 等） |
| `vocab_listening_lecture` | Lecture vocabulary | 講義でよく使う表現（sum up, on the other hand, bear in mind 等） |
| `vocab_listening_numbers_dates_spelling` | Numbers / dates / spelling | 数字・日付・スペル（thirty/13, NATO スペル、ordinals 等） |
| `vocab_listening_spoken_distractors` | Spoken distractors | ひっかけ・言い直し（actually, I meant, no wait 等） |
| `vocab_listening_paraphrase_conversation` | Paraphrase in conversation | 会話の言い換え・意図（I was wondering if, fully booked, get back to you 等） |

- 全問 **click** モード（4択）。各問に **explanation** を `meta` で保持。
- 将来の音声用に **transcript_excerpt**・**speaker_type** を meta に持てる設計（シードでも一部設定済み）。

---

## 3. 問題数

| カテゴリ | 問題数 |
|----------|--------|
| Form / note completion | 23 |
| Campus / daily life | 24 |
| Lecture vocabulary | 25 |
| Numbers / dates / spelling | 25 |
| Spoken distractors | 24 |
| Paraphrase in conversation | 26 |
| **合計** | **147** |

- シード投入: `npm run seed:vocab:listening`（要 Supabase 環境変数）。
- 投入前に `skill=listening` & `module=vocab` の既存行は削除してから挿入（idempotent）。

---

## 4. API / UI / SRS の対応内容

### API
- **GET /api/lexicon/sets**: `skill=listening` を許可。`lexicon_questions`（skill=listening, module=vocab）と `listening_srs_state` でカテゴリ別件数・Due を集計し、**total_due** を返す。
- **GET /api/lexicon/questions**: `skill=listening` を許可。Reading と同様に **review_only** / **new_only** / 復習＋新規 で出題。`listening_srs_state` で Due・未学習を判定。
- **POST /api/lexicon/submit**: 問題の `skill` が `listening` のとき **listening_srs_state** を upsert（同一 SRS ロジック）。

### UI（`/training/vocab`）
- スキルに **Listening（Listening Vocab v1（聞き取り・会話表現））** を追加。
- Listening 選択時: 6 カテゴリ表示、**復習Due** 表示、**復習のみ / 新規のみ / 復習＋新規で開始** で開始可能。
- クイズ中: passage_excerpt・strategy を表示。結果で **meta.explanation**（および distractor_note / paraphrase_tip があれば）を表示。
- ホームの語彙練習から **Listening** を有効リンクで誘導。

### SRS
- **listening_srs_state** を新設（reading_srs_state と同構成）。question_id ベースで stage / next_review_on を管理。
- 東京日付の **getListeningDueDate()** と **countListeningDueToday()** で Due 集計（Listening 用 question_id のみ対象）。

---

## 5. build / lint / tsc 結果

| コマンド | 結果 |
|----------|------|
| `npx tsc --noEmit` | 成功（.next 削除後。既存の .next に別ブランチ由来の参照がある場合は削除してから実行推奨） |
| `npm run lint` | 成功（既存 Warning のみ、Listening 追加による新規 Error なし） |
| `npm run build` | 成功 |

---

## 6. 既知の制約

- **音声**: 初期は **text / transcript ベース** のみ。meta の **transcript_excerpt**・**speaker_type** は将来の audio clip 用に確保済み。音声ファイルの配信・再生は未実装。
- **問題形式**: 全問 click。typing は型・バリデーションでは許容するが、シードには含めていない。
- **Progress / 履歴**: Listening Vocab 専用の Progress 履歴 API・UI は未実装。Reading Vocab と同様に追加する場合は別 PR 想定。
- **フィルタ**: Reading のような topic / difficulty フィルタは Listening にはなし。review_only / new_only / mixed のみ。
- **Listening 他モジュール**: Idiom / Lexicon の Listening は今回対象外（語彙練習のみ）。

---

以上、Listening Vocab v1 の設計・実装内容です。
