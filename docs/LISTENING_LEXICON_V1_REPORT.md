# Listening Lexicon v1 実装レポート

## 1. 変更ファイル一覧

### 新規作成
- `data/lexicon/listening/types.ts` — カテゴリ定数・型（ListeningLexiconMeta, ListeningLexiconSeed）
- `data/lexicon/listening/lectureSignposting.ts` — Lecture signposting シード（25問）
- `data/lexicon/listening/explanationExample.ts` — Explanation / example markers シード（25問）
- `data/lexicon/listening/compareContrast.ts` — Compare / contrast in speech シード（25問）
- `data/lexicon/listening/emphasisStance.ts` — Emphasis / stance シード（25問）
- `data/lexicon/listening/processSequence.ts` — Process / sequence in lectures シード（26問）
- `data/lexicon/listening/seminarDiscussion.ts` — Seminar discussion signals シード（26問）
- `data/lexicon/listening/index.ts` — 集約・検証（LISTENING_LEXICON_SEED, validateListeningLexiconSeed）
- `scripts/seed-lexicon-listening.ts` — Listening Lexicon シード投入スクリプト

### 変更
- `app/training/lexicon/page.tsx` — Listening スキル対応、listeningTotalDue / listeningSessionMode、Due 表示、復習のみ / 新規のみ / 復習＋新規、結果の explanation と meta（transcript_excerpt, speaker_type, usage_note, distractor_note）表示、Listening ボタン有効化
- `app/home/page.tsx` — 表現バンクで Listening を有効化（href: `/training/lexicon?skill=listening`, disabled: false）
- `package.json` — `"seed:lexicon:listening": "tsx scripts/seed-lexicon-listening.ts"` 追加

---

## 2. カテゴリ設計

| カテゴリ ID | ラベル |
|-------------|--------|
| `listening_lexicon_lecture_signposting` | Lecture signposting |
| `listening_lexicon_explanation_example` | Explanation / example markers |
| `listening_lexicon_compare_contrast` | Compare / contrast in speech |
| `listening_lexicon_emphasis_stance` | Emphasis / stance |
| `listening_lexicon_process_sequence` | Process / sequence in lectures |
| `listening_lexicon_seminar_discussion` | Seminar discussion signals |

---

## 3. 問題数

| カテゴリ | 問題数 |
|----------|--------|
| Lecture signposting | 25 |
| Explanation / example markers | 25 |
| Compare / contrast in speech | 25 |
| Emphasis / stance | 25 |
| Process / sequence in lectures | 26 |
| Seminar discussion signals | 26 |
| **合計** | **152** |

- 全問 `explanation` あり。可能な範囲で `meta` に `transcript_excerpt`, `speaker_type`, `usage_note`, `distractor_note` を付与。
- モードはすべて `click`（選択式）。Listening Lexicon では Typing は未提供（将来拡張可能）。

---

## 4. API / UI / SRS の対応内容

### API
- **変更なし**。既存の `GET /api/lexicon/sets`（skill=listening, module=lexicon）および `GET /api/lexicon/questions`（review_only / new_only）がそのまま利用可能。Listening は `lexicon_questions` + `listening_srs_state`（question_id ベース）で集計・出題。Listening Vocab / Listening Idiom と同一の `listening_srs_state` を流用（module で区別はせず question_id 単位）。

### SRS
- Listening Vocab・Listening Idiom と同様、`listening_srs_state` で question_id 単位の復習 Due を管理。submit 時に既存の lexicon submit 経由で更新。

### UI
- **表現バンク (`/training/lexicon`)**
  - スキル選択で **Listening** を有効化（Lecture signposting・discussion signals の説明付き）。
  - `?skill=listening` で開いた場合、カテゴリステップで「Listening - カテゴリとモードを選択」と全カテゴリの Due 表示。
  - 開始ボタン: **Review only（N問）** / **New only** / **復習＋新規で開始** を選択可能。
  - クイズ中は「今回: 復習のみ / 新規のみ / 復習＋新規」を表示。
  - 結果画面で **explanation** と **usage_note** に加え、Listening 時は **transcript_excerpt**, **speaker_type**, **distractor_note** を表示（存在する場合）。
- **ホーム**
  - 表現バンクブロックの Listening を `/training/lexicon?skill=listening` にリンクし、disabled を false に変更。

---

## 5. build / lint / tsc 結果

- **npm run build**: 成功（exit 0）。
- **npm run lint**: 成功（既存の react-hooks/exhaustive-deps 等の Warning のみ。Listening Lexicon 起因の新規エラーなし）。
- **npx tsc --noEmit**: 成功。

---

## 6. 既知の制約

- **Listening Lexicon は Click のみ**。Typing モードは未実装（シードもすべて mode: 'click'）。
- **Listening Lexicon Progress** は今回の対象外（将来追加可能）。
- **音声再生・外部 analytics・大規模スキーマ変更** は非対象。
- 0 件時は「Listening のデータがありません。シードを実行してください。」と表示し、カテゴリステップには進まない。シード実行は `npm run seed:lexicon:listening`。
- 既存の speaking / writing / reading / listening vocab / listening idiom への回帰は行っていない（API は既存の listening + module=lexicon のまま利用）。`listening_srs_state` は skill=listening の全 module（vocab, idiom, lexicon）で question_id ベースで共有。
