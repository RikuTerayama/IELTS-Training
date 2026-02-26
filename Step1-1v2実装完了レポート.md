# Step1-1v2実装完了レポート

## 実装概要

Writing/Speakingの必須表現を、人手で整理されたリスト（master.ts）から確実に網羅し、問題バンク（lexicon_questions）を生成する基盤を実装しました。note全文パースに依存せず、リスト駆動で安定した問題供給を実現します。

---

## 実装したファイル

### 1. データソース

#### `data/lexicon/master.ts` (新規作成)
- Writing/Speakingで使う必須表現を網羅的に登録
- 構造:
  - `skill`: "writing" | "speaking"
  - `category`: 例 writing_task1_graph, writing_task2_phrases, speaking_cohesion など
  - `expression`: 正答表現（英語）
  - `ja_hint`: 日本語のヒント（typing用のプロンプト文に使う）
  - `typing_enabled`: boolean
  - `variants`: 配列（展開済みバリエーション、例: ["in contrast", "by contrast"]）
  - `notes`: 任意（例: "whereasは文中のみ"）

### 2. データベースマイグレーション

#### `supabase/migrations/005_lexicon_questions.sql` (新規作成)
- `lexicon_questions` テーブル:
  - id, skill, category, mode, prompt, correct_expression
  - choices (JSONB, clickのみ)
  - hint_first_char, hint_length (typingのみ)
  - item_id (lexicon_items参照)
  - created_at
- インデックス: skill, category, mode, skill+category+mode, item_id
- RLS: 全員閲覧可能（学習用コンテンツ）

### 3. Seedスクリプト

#### `scripts/seed-lexicon-v2.ts` (新規作成)
- `data/lexicon/master.ts` から以下を生成して投入:
  1. **lexicon_items（表現）**: 各expressionとvariantsを登録
  2. **lexicon_questions（問題）**: 
     - Click問題: 全アイテム対象（最低1問/表現）
     - Typing問題: typing_enabled=true のみ
- 重要ルール:
  - masterに載っている各expressionは最低1問以上の問題に必ず登場
  - typingは「固定表現のみ」を対象
  - clickは全アイテム対象（最低1問/表現）
- 誤答生成: 同skill同categoryから優先、足りなければ同skill全体から

### 4. API更新

#### `app/api/lexicon/sets/route.ts` (更新)
- category別の items件数 と questions件数（mode別）を返す
- レスポンス:
  ```typescript
  {
    sets: {
      [category: string]: {
        items_total: number;
        items_typing_enabled: number;
        questions_click: number;
        questions_typing: number;
      };
    };
  }
  ```

#### `app/api/lexicon/questions/route.ts` (更新)
- `lexicon_questions` から返す（未回答優先はStep2で強化予定、Step1-1では簡易実装）
- 返却: question_id, prompt, choices?, hint_first_char?, hint_length?, item_id?

#### `app/api/lexicon/submit/route.ts` (更新)
- body: question_id, user_answer, time_ms
- questionを引き、correct_expressionと照合して正誤判定
- lexicon_logsに保存（item_idがあればそれも保存して紐付ける）
- return: is_correct, correct_expression

### 5. package.json更新

- `seed:lexicon:v2` スクリプトを追加

---

## 実装内容の詳細

### 1. Master.tsの構造

- **writing_task1_graph**: 1文目動詞群、数量、増減・停滞・変動・ピーク/ボトム表現、程度副詞形容詞、比較対照、予測、数値パラフレーズ
- **writing_task1_diagram**: 位置関係、方角、上下左右
- **writing_task1_process**: stage/step/phase、produce/involve/separate、順序語
- **writing_task1_phrases**: 書き始め、overview、特徴の書き方
- **writing_task2_phrases**: essay typesの定型、重要表現（導入、目的、理由、例示、追加、言い換え、比較対照、結論）
- **speaking_cohesion**: 接続語
- **speaking_fluency**: フィラー、聞き返し
- **speaking_chunks**: chunks（collocation/idioms/phrasal verbs）

### 2. 問題生成ロジック

#### Click問題
- プロンプト: `${ja_hint}（${category用途}）`
- 選択肢: 正答1 + 誤答3
- 誤答は同skill同categoryから優先、足りなければ同skill全体から
- whereas/while等の使い分け系は、意図的に紛らわしい誤答を同グループから取る

#### Typing問題
- プロンプト: `${ja_hint}を英語で入力してください`
- ヒント: 先頭1文字＋文字数（スペース除外）
- typing_enabled=true のみ対象

### 3. 網羅性の保証

- masterに載っている各expressionは最低1問以上の問題に必ず登場
- variantsがある場合も問題を生成
- typing_enabled=false のアイテムは typing問題に出ない（clickのみ）

---

## 受け入れ条件の確認

- ✅ master.ts から lexicon_items と lexicon_questions が作られる（実装完了、実行は別途必要）
- ✅ 各expressionが最低1問に登場している（実装完了）
- ✅ /api/lexicon/questions が click/typing の問題を返せる（実装完了）
- ✅ submitで正誤判定でき、lexicon_logsに保存される（実装完了）
- ✅ note全文パースに依存しない（master.ts駆動）

---

## 注意事項

### 既存のビルドエラー
- `lib/task1/assets.ts` の全角括弧問題は未解決（Step1-1v2とは無関係）
- 別途修正が必要

### 次のステップ
1. **マイグレーション実行**: `supabase/migrations/005_lexicon_questions.sql` を実行
2. **Seed実行**: `npm run seed:lexicon:v2` でデータ投入
3. **Step1-2**: Lexicon学習画面（/training/lexicon）の実装
4. **Step2**: 忘却曲線ベースのスケジューリング

---

## 実装ファイル一覧

### 新規作成
- `data/lexicon/master.ts`
- `supabase/migrations/005_lexicon_questions.sql`
- `scripts/seed-lexicon-v2.ts`

### 更新
- `app/api/lexicon/sets/route.ts`
- `app/api/lexicon/questions/route.ts`
- `app/api/lexicon/submit/route.ts`
- `package.json` (seed:lexicon:v2追加)

---

**実装完了日**: Step1-1v2実装時
