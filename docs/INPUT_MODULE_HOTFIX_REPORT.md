# Input モジュール安定化ホットフィックス 報告

## 1. Root cause 一覧

| 不具合 | Root cause |
|--------|------------|
| **Client-side exception** | `quizState.questions[quizState.currentIndex]` を、`questions.length` や `currentIndex` の範囲チェックなしで参照していた箇所が複数あり、空配列や範囲外アクセスで例外が発生していた。 |
| **説明文の不整合** | 単語・熟語・表現バンクの説明が「Writing/Speakingで使う必須〜」のままだったため、Reading/Listening 対応後の現状と不一致だった。 |
| **Lexicon Writing: カテゴリは出るが問題が出ない** | `seed-lexicon.ts` は **lexicon_items** のみ投入しており **lexicon_questions** を一切作成していなかった。sets API は items でカテゴリ・件数を出し、questions API で出題するため、questions が 0 件だと「問題が登録されていない」ように見えていた。 |
| **Lexicon Speaking: このスキルのデータがありません** | 同上。items が ws_note から投入されていても、本番で seed 未実行や items 未投入の場合は sets が空になる。加えて questions が無いと出題できない。seed で items + questions の両方を投入するようにしたことで解消される。 |
| **Reading vocab 制限時間が短い** | Click モードの制限時間が全 skill で 10 秒固定だった。Reading のみ 30 秒に変更する分岐がなかった。 |

## 2. 変更ファイル一覧

- `app/training/vocab/page.tsx` — 例外ガード、Reading 30秒タイマー、説明文、表示「○秒制限」
- `app/training/idiom/page.tsx` — 例外ガード、説明文
- `app/training/lexicon/page.tsx` — 例外ガード、説明文
- `scripts/seed-lexicon.ts` — lexicon_items に `module` を明示、**lexicon_questions** の生成（Writing/Speaking の click / typing）を追加

## 3. 各不具合の修正内容

### 3.1 Client-side exception

- **vocab / idiom / lexicon** の各ページで以下を実施:
  - `handleClickAnswer` / `handleTypingSubmit` の先頭で  
    `questions.length === 0 || currentIndex < 0 || currentIndex >= questions.length` のとき早期 return。
  - Click タイマーで時間切れ submit する前に、上記と同じ範囲チェックを実施。範囲外の場合は submit しない。
  - 問題表示ブロックを IIFE で囲み、`currentQuestion = questions[currentIndex]` を参照する前に範囲チェックし、範囲外なら `return null`。表示はすべて `currentQuestion` 参照に統一。

### 3.2 説明文

- **単語練習 (vocab)**  
  「Writing/Speakingで使う必須単語を覚えましょう」  
  → 「Reading / Listening を含む4技能の必須単語を覚えましょう」（本文・Suspense 用 fallback の両方）
- **熟語練習 (idiom)**  
  「Writing/Speakingで使う必須熟語を覚えましょう」  
  → 「Reading / Listening を含む4技能の必須熟語を覚えましょう」
- **表現バンク (lexicon)**  
  「Writing/Speakingで使う必須表現を覚えましょう」  
  → 「Reading / Listening を含む4技能の必須表現を覚えましょう」

### 3.3 Lexicon Speaking / Writing 不整合

- **原因**: `seed-lexicon.ts` が **lexicon_items** のみ upsert しており、**lexicon_questions** を作成していなかった。
- **対応**:  
  - items 投入後、`module='lexicon'` かつ `skill in ('writing','speaking')` の **lexicon_items** を取得。  
  - 既存の **lexicon_questions** で各 `item_id` の click/typing の有無を確認。  
  - 各 item について、  
    - click が無い場合: 同一 (skill, category) の他表現から誤答を最大 3 つ選び、4 択の click 問題を 1 件 insert。  
    - typing_enabled かつ typing が無い場合: hint_first_char / hint_length を付与した typing 問題を 1 件 insert。  
  - 本番でこの seed を実行すれば、Writing/Speaking ともにカテゴリ表示と出題が可能になる。  
- **Speaking が no-data の場合**: `data/note/ws_note.md` に「Speaking」を含む見出し（例: `## Speaking - Cohesion`）があり、seed が実行されていれば items と questions が入る。本番で「このスキルのデータがありません」になる場合は、seed 未実行か、ws_note に Speaking セクションが無いかを確認すること。

### 3.4 Reading vocab 制限時間

- **変更**: `/training/vocab?skill=reading` の Click モードのみ、制限時間を **10 秒 → 30 秒** に変更。
- **実装**:  
  - タイマー用 `limitSeconds` を `selectedSkill === 'reading' ? 30 : 10` で設定。  
  - 時間切れ時の自動 submit の `time_ms` も `limitSeconds * 1000` を使用。  
  - カテゴリ選択時の「○秒制限」表示を、Reading のとき「30秒制限」、それ以外「10秒制限」に変更。

## 4. 本番で追加実行が必要なコマンド

- **Lexicon Writing/Speaking の items + questions を投入・更新する場合**（未実行 or 再投入したい場合）:
  ```bash
  # 環境変数 NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定したうえで
  npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-lexicon.ts
  ```
  またはプロジェクトの ts-node / tsx の実行方法に合わせて:
  ```bash
  npx tsx scripts/seed-lexicon.ts
  ```
- 既に **lexicon_items** だけ投入済みの DB でも、上記を実行すれば **lexicon_questions** が追加され、Writing/Speaking で出題可能になる。既に同一 item に click/typing 問題がある場合はスキップするため、二重投入はしない。

## 5. Build / Lint / tsc 結果

- **npm run build**: 成功（既存の ESLint 警告のみ）
- **npm run lint**: 成功（同上）
- **npx tsc --noEmit**: 成功

## 6. 既知の制約

- **Lexicon Speaking**: 表示されるデータは `data/note/ws_note.md` の内容に依存する。Speaking セクションが無い、または seed が本番で未実行の場合は「このスキルのデータがありません」のまま。
- **seed-lexicon**: 同一 (normalized, skill, category) の item は upsert で 1 件にまとまる。questions は「既存で click/typing が無い item に対してのみ」insert するため、再実行しても既存出題は重複しない。
- 今回の対象外: 大規模スキーマ変更、新規学習モジュール、音声再生、analytics。

## 7. 最低限の smoke test 観点

- `/training/vocab?skill=reading` で client-side exception が出ないこと。
- 上記で Click 開始後、制限表示が 30 秒であること（時間切れで自動 submit も 30 秒で発火すること）。
- `/training/lexicon` で Writing を選択し、カテゴリ選択後に出題が始まること（本番は seed 実行後）。
- `/training/lexicon` で Speaking を選択し、ws_note に Speaking があり seed 実行済みなら「このスキルのデータがありません」にならないこと。
- 単語練習・熟語練習・表現バンクの説明文が「Reading / Listening を含む4技能の〜」になっていること。
- Reading / Listening / Speaking / Writing の既存フローが壊れていないこと（既存の 10 秒制限は Reading 以外で維持）。
