# Listening Idiom v1 実装レポート

## 1. 変更ファイル一覧

### 新規作成
- `data/idiom/listening/types.ts` — カテゴリ定数・型（ListeningIdiomMeta, ListeningIdiomSeed）
- `data/idiom/listening/phrasalVerbs.ts` — Phrasal verbs シード（24問）
- `data/idiom/listening/conversationalChunks.ts` — Conversational chunks シード（26問）
- `data/idiom/listening/clarificationRepair.ts` — Clarification / repair シード（26問）
- `data/idiom/listening/agreementHesitation.ts` — Agreement / hesitation シード（28問）
- `data/idiom/listening/bookingService.ts` — Booking / service language シード（30問）
- `data/idiom/listening/spokenParaphrase.ts` — Spoken paraphrase シード（29問）
- `data/idiom/listening/index.ts` — 集約・検証（LISTENING_IDIOM_SEED, validateListeningIdiomSeed）
- `scripts/seed-idiom-listening.ts` — Listening Idiom シード投入スクリプト

### 変更
- `app/training/idiom/page.tsx` — Listening スキル対応、review_only/new_only、Due 表示、結果の explanation/meta 表示、「もう一度」の onClick 修正
- `app/home/page.tsx` — 熟語練習モジュールで Listening を有効（href: `/training/idiom?skill=listening`, disabled: false）
- `package.json` — `"seed:idiom:listening": "tsx scripts/seed-idiom-listening.ts"` 追加

---

## 2. カテゴリ設計

| カテゴリ ID | ラベル |
|-------------|--------|
| `idiom_listening_phrasal_verbs` | Phrasal verbs |
| `idiom_listening_conversational_chunks` | Conversational chunks |
| `idiom_listening_clarification_repair` | Clarification / repair |
| `idiom_listening_agreement_hesitation` | Agreement / hesitation |
| `idiom_listening_booking_service` | Booking / service language |
| `idiom_listening_spoken_paraphrase` | Spoken paraphrase |

---

## 3. 問題数

| カテゴリ | 問題数 |
|----------|--------|
| Phrasal verbs | 24 |
| Conversational chunks | 26 |
| Clarification / repair | 26 |
| Agreement / hesitation | 28 |
| Booking / service language | 30 |
| Spoken paraphrase | 29 |
| **合計** | **163** |

- 全問 `explanation` あり。可能な範囲で `meta` に `transcript_excerpt`, `speaker_type`, `distractor_note`, `paraphrase_tip` を付与。
- モードはすべて `click`（選択式）。Listening Idiom では Typing は未提供。

---

## 4. API / UI / SRS の対応内容

### API
- **変更なし**。既存の `GET /api/lexicon/sets`（skill=listening, module=idiom）および `GET /api/lexicon/questions`（review_only / new_only）がそのまま利用可能。Listening は `lexicon_questions` + `listening_srs_state`（question_id ベース）で集計・出題。

### SRS
- Listening Vocab と同様、`listening_srs_state` で question_id 単位の復習 Due を管理。submit 時に既存の lexicon submit 経由で更新。

### UI
- **熟語練習 (`/training/idiom`)**
  - スキル選択で **Listening** を有効化（Reading は従来どおり Coming soon）。
  - `?skill=listening` で開いた場合、カテゴリステップで「Listening - カテゴリとモードを選択」と全カテゴリの Due 表示。
  - 開始ボタン: **復習のみ（N問）** / **新規のみ** / **復習＋新規で開始** を選択可能。
  - クイズ中は「今回: 復習のみ / 新規のみ / 復習＋新規」を表示。
  - 結果画面で **explanation** と、存在すれば **transcript_excerpt**, **speaker_type**, **distractor_note**, **paraphrase_tip** を表示。
- **ホーム**
  - 熟語練習ブロックの Listening を `/training/idiom?skill=listening` にリンクし、disabled を false に変更。

---

## 5. build / lint / tsc 結果

- **npm run build**: 成功（exit 0）。
- **npm run lint**: 成功（既存の react-hooks/exhaustive-deps 等の Warning のみ。Listening Idiom 起因の新規エラーなし）。
- **npx tsc --noEmit**: 成功。

---

## 6. 既知の制約

- **Listening Idiom は Click のみ**。Typing モードは未実装（シードもすべて mode: 'click'）。
- **Reading は従来どおり Coming soon**。Idiom の Reading は未実装。
- **音声再生・Listening Lexicon・外部 analytics は非対象**（今回未実装）。
- 0 件時は「Listening のデータがありません。シードを実行してください。」と表示し、カテゴリステップには進まない。シード実行は `npm run seed:idiom:listening`。
- 既存の speaking / writing / reading / listening vocab への回帰は行っていない（API は既存の listening + module=idiom のまま利用）。
