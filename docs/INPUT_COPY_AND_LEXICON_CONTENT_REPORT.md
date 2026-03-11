# Input モジュール copy と Lexicon コンテンツ修正 報告

## 1. Root cause 一覧

| 論点 | Root cause |
|------|------------|
| **説明文が長い** | 前回ホットフィックスで「Reading / Listening を含む4技能の必須〜」に統一したが、より簡潔な「4技能の必須〜」が求められていた。 |
| **Lexicon speaking が EMPTY になる可能性** | (1) 本番で seed-lexicon 未実行だと items/questions が存在せず sets が空になる。(2) ws_note の Speaking セクションは存在するが、サブセクションが少ないと体感が薄い。Signposting など 1 サブセクション追加で内容を補強。 |
| **Lexicon writing の問題量・出題実感** | 同一カテゴリ内に他表現が少ない場合、click 問題の誤答候補が不足し、4 択に満たない or 1 問しか作れない状態があった。同一 skill 内の他カテゴリから誤答を補填していなかった。 |
| **Click 4 択の不足** | seed-lexicon で click 問題作成時、同一 category の others が 3 未満だと choices が 4 に満たず、出題が弱くなる。 |

## 2. 変更ファイル一覧

- `app/training/vocab/page.tsx` — 説明文を「4技能の必須単語を覚えましょう」に変更
- `app/training/idiom/page.tsx` — 説明文を「4技能の必須熟語を覚えましょう」に変更
- `app/training/lexicon/page.tsx` — 説明文を「4技能の必須表現を覚えましょう」に変更
- `scripts/seed-lexicon.ts` — click 問題の誤答を同一 skill から補填するロジックを追加（bySkill を利用）
- `data/note/ws_note.md` — Speaking に「### Signposting」サブセクションを追加
- `docs/INPUT_COPY_AND_LEXICON_CONTENT_REPORT.md` — 本報告（新規）

## 3. Copy 修正内容

| 画面 | 変更前 | 変更後 |
|------|--------|--------|
| 単語練習 | Reading / Listening を含む4技能の必須単語を覚えましょう | **4技能の必須単語を覚えましょう** |
| 熟語練習 | Reading / Listening を含む4技能の必須熟語を覚えましょう | **4技能の必須熟語を覚えましょう** |
| 表現バンク | Reading / Listening を含む4技能の必須表現を覚えましょう | **4技能の必須表現を覚えましょう** |

- 対象: 各ページのメイン説明と Suspense fallback 内の同じ文言（計 6 箇所）。
- home / 他ページの「単語練習」「熟語練習」「表現バンク」タイトルはそのまま（サブ説明のみ変更）。

## 4. Lexicon speaking / writing の修正内容

### 4.1 Speaking

- **原因**: 本番で seed 未実行だと sets が空。また ws_note の Speaking は「Linking words / Fillers / Opinion starters」のみで、やや薄い。
- **対応**:
  1. **ws_note.md** に「### Signposting」を追加（To start with, For example, As I said, So to sum up, That's why）。Speaking カテゴリ・問題数が増え、EMPTY になりにくくする。
  2. seed-lexicon の question 生成は従来どおり全 writing/speaking items に対して実行。誤答補填の強化（下記）で 1 カテゴリ 1 表現でも 4 択が作れる。

### 4.2 Writing / 問題量強化（共通）

- **原因**: 同一 category 内の他表現が 3 未満のとき、click 問題の wrongs が足りず、4 択にならない or 出題が弱い。
- **対応**: **scripts/seed-lexicon.ts** で、誤答候補を「同一 category」だけでなく「同一 skill 内の他カテゴリ」からも取得するよう変更。
  - `bySkillCategory` に加え `bySkill` を構築。
  - 各 item の click 問題用に、まず同一 category の他表現を `others` に使用。`others.length < 3` のとき、同一 skill の他表現で重複を除いて最大 3 件まで補填。
  - これにより、カテゴリ内が 1 表現でも 4 択が成立し、writing / speaking ともに「カテゴリは出るが問題が弱い」を解消。

## 5. コンテンツ監査結果と次優先事項

### 5.1 現状整理

| モジュール | Skill | ソース | 状態 |
|------------|--------|--------|------|
| **vocab** | Reading | data/vocab/reading/* (複数 question_type) | 充実。複数シードでカバー。 |
| **vocab** | Listening | data/vocab/listening/* (6 カテゴリ) | 充実。 |
| **idiom** | Reading | data/idiom/reading/* (6 カテゴリ) | 充実。 |
| **idiom** | Listening | data/idiom/listening/* (6 カテゴリ) | 充実。 |
| **lexicon** | Reading | data/lexicon/reading/* + seed-lexicon-reading | 充実。 |
| **lexicon** | Listening | data/lexicon/listening/* + seed-lexicon-listening | 充実。 |
| **lexicon** | Writing | data/note/ws_note.md + seed-lexicon | 今回で 4 択・出題強化済み。 |
| **lexicon** | Speaking | data/note/ws_note.md + seed-lexicon | 今回で Signposting 追加・4 択強化済み。 |

### 5.2 次に拡充すべき箇所（優先度順）

1. **高**: Lexicon Writing/Speaking の本番 seed 未実行対策  
   - デプロイ手順に「本番で `scripts/seed-lexicon.ts` を実行すること」を明記し、speaking/writing が EMPTY にならないようにする。

2. **中**: ws_note の Writing 表現の追加  
   - Task 1 / Task 2 の各サブセクションに、必要に応じて表現を数本ずつ追加すると、writing の出題量・バリエーションがさらに増える。

3. **中**: Lexicon Speaking の独立ソース  
   - 将来的に `data/note/speaking_note.md` などを用意し、ws_note と合わせて parse する形にすると、Speaking 専用の拡張がしやすい。

4. **低**: Vocab/Idiom の Writing・Speaking 技能  
   - 現状は Reading/Listening 中心。Writing/Speaking 用語彙・熟語を別ソースで増やす場合は、schema やルーティングの拡張が必要。

## 6. 本番で必要な追加コマンド

- **Lexicon Writing/Speaking の items + questions を投入・更新する場合**（初回 or 再投入）:
  ```bash
  npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-lexicon.ts
  ```
  または:
  ```bash
  npx tsx scripts/seed-lexicon.ts
  ```
- 環境変数: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` を設定して実行。
- ws_note.md を更新した場合は、上記を再実行すると新規分（例: Signposting）が追加され、既存 item は upsert で更新される。

## 7. Build / Lint / tsc 結果

- **npm run build**: 成功（既存の ESLint 警告のみ）。
- **npm run lint**: 成功（既存の react-hooks/exhaustive-deps 等の警告のみ）。
- **npx tsc --noEmit**: 成功。

## 8. 既知の制約

- Lexicon Speaking/Writing の表示は、本番で seed-lexicon を実行していることが前提。未実行の場合は「このスキルのデータがありません」となる。
- copy は「4技能の必須〜」に統一したのみ。home や他 API のタイトル表記は変更していない。
- 音声再生・新モジュール・大規模 schema 変更・analytics は今回の対象外。
