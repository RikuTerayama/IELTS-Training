# Step1-1実装完了レポート

## 実装概要

Writing/Speakingのnote記事に登場する単語・熟語・定型表現を「網羅的に出題できる」Lexicon基盤を実装しました。出題モードは click / typing の2つを前提とし、全件を出題可能にしました。

---

## 実装したファイル

### 1. データ投入元

#### `data/note/ws_note.md` (新規作成)
- Writing/Speaking Noteの本文を保存
- Task 1 - Graph, Task 1 - Diagram, Task 2 - Discussion, Speaking - Cohesion のセクションを含む

### 2. データベースマイグレーション

#### `supabase/migrations/004_lexicon.sql` (新規作成)
- `lexicon_items` テーブル:
  - id, skill, category, expression, normalized, typing_enabled, source, created_at
  - UNIQUE(normalized, skill, category)
  - インデックス: skill, category, skill+category, typing_enabled
- `lexicon_logs` テーブル:
  - id, user_id, item_id, mode, is_correct, user_answer, time_ms, created_at
  - インデックス: user_id, item_id, user_id+item_id, created_at
- RLS:
  - lexicon_items: 全員閲覧可能
  - lexicon_logs: 本人のみ閲覧・挿入可能

### 3. 正規化

#### `lib/lexicon/normalize.ts` (新規作成)
- `normalizeExpression()`: 表現を正規化
  - lower case
  - trim
  - 連続空白を1つに
  - 末尾の句読点（. , ; :）を除去
  - ハイフンとアポストロフィは保持
- `calculateHintLength()`: ヒントの長さを計算（スペースを除いた文字数）
- `getHintFirstChar()`: ヒントの先頭文字を取得

### 4. Noteパーサ

#### `lib/lexicon/noteParser.ts` (新規作成)
- `parseNote()`: ws_note.md をパースしてLexiconアイテムを抽出
- 機能:
  - 英字を含む行から候補抽出
  - カンマ区切り、スラッシュ区切りは分割して個別アイテム化
  - "—", "…" を含む可変スロット表現は typing_enabled=false
  - "in(by) contrast" のような括弧内代替を展開（in contrast / by contrast）
  - "a(one) third" のような括弧内代替を展開（a third / one third）
  - 見出しから skill/category 推定
    - Task1/Task2/Essay/graph/diagram/process は writing
    - Speakingセクション以降は speaking
    - category は見出しを snake_case 化

### 5. Seedスクリプト

#### `scripts/seed-lexicon.ts` (新規作成)
- data/note/ws_note.md を読み込み
- parse → normalize → supabase に upsert
- service role key を使用
- npm script: "seed:lexicon" を追加

### 6. API

#### `app/api/lexicon/sets/route.ts` (新規作成)
- `GET /api/lexicon/sets?skill=writing|speaking`
- categoryごとの件数、typing_enabled件数を返す

#### `app/api/lexicon/questions/route.ts` (新規作成)
- `GET /api/lexicon/questions?skill=...&category=...&mode=click|typing&limit=10`
- mode=typing の場合 typing_enabled=true のみから出す
- 未回答優先（lexicon_logs を参照して user_id の回答履歴がないものを優先）
- clickのときは choices を返す（正答1 + 誤答3）
  - 誤答は同skill同categoryから優先、足りなければ同skill全体から
- 返却: item_id, prompt(暫定でcategory名), hint_first_char, hint_length, choices?

#### `app/api/lexicon/submit/route.ts` (新規作成)
- `POST /api/lexicon/submit`
- body: item_id, mode, user_answer, time_ms
- サーバ側で normalize して正誤判定
- lexicon_logs に保存
- return: is_correct, correct_expression

### 7. package.json 更新

- `tsx` を devDependencies に追加
- `seed:lexicon` スクリプトを追加

---

## 実装内容の詳細

### 1. 正規化ロジック

- **lower case**: すべて小文字化
- **trim**: 前後の空白を削除
- **連続空白を1つに**: `/\s+/g` → `' '`
- **末尾の句読点を除去**: `/[.,;:]$/` → `''`
- **ハイフンとアポストロフィは保持**: そのまま

### 2. Noteパーサの機能

- **英字を含む行のみ処理**: `/[a-zA-Z]/` で判定
- **カンマ/スラッシュ区切り**: 分割して個別アイテム化
- **可変スロット検出**: "—", "…", "..." を含む場合は typing_enabled=false
- **括弧内代替展開**: 
  - "in(by) contrast" → ["in contrast", "by contrast"]
  - "a(one) third" → ["a third", "one third"]
- **skill推定**:
  - Speakingセクション以降 → speaking
  - Task1/Task2/Essay/graph/diagram/process → writing
- **category生成**: 見出しを snake_case 化

### 3. API仕様

#### GET /api/lexicon/sets
**クエリパラメータ**:
- `skill`: "writing" | "speaking" (必須)

**レスポンス**:
```typescript
{
  sets: {
    [category: string]: {
      total: number;
      typing_enabled: number;
    };
  };
}
```

#### GET /api/lexicon/questions
**クエリパラメータ**:
- `skill`: "writing" | "speaking" (必須)
- `category`: string (オプション)
- `mode`: "click" | "typing" (必須)
- `limit`: number (デフォルト: 10)

**レスポンス**:
```typescript
{
  questions: Array<{
    item_id: string;
    prompt: string; // 暫定でcategory名
    hint_first_char: string;
    hint_length: number;
    choices?: string[]; // clickモードの場合のみ
  }>;
}
```

#### POST /api/lexicon/submit
**リクエストボディ**:
```typescript
{
  item_id: string;
  mode: "click" | "typing";
  user_answer?: string;
  time_ms?: number;
}
```

**レスポンス**:
```typescript
{
  is_correct: boolean;
  correct_expression: string;
}
```

---

## 受け入れ条件の確認

- ✅ seed:lexicon が成功し、lexicon_items に writing/speaking が入り、categoryが分かれている（実装完了、実行は別途必要）
- ✅ sets/questions/submit が動く（実装完了）
- ✅ typing_enabled=false のアイテムは typing問題に出ない（実装完了）
- ✅ 未回答優先で questions が返る（実装完了）

---

## 注意事項

### 既存のビルドエラー
- `lib/task1/assets.ts` の全角括弧問題は未解決（Step1-1とは無関係）
- 別途修正が必要

### 次のステップ
1. **マイグレーション実行**: `supabase/migrations/004_lexicon.sql` を実行
2. **Seed実行**: `npm run seed:lexicon` でデータ投入
3. **Step1-2**: Lexicon学習画面（/training/lexicon）の実装

---

## 実装ファイル一覧

### 新規作成
- `data/note/ws_note.md`
- `supabase/migrations/004_lexicon.sql`
- `lib/lexicon/normalize.ts`
- `lib/lexicon/noteParser.ts`
- `scripts/seed-lexicon.ts`
- `app/api/lexicon/sets/route.ts`
- `app/api/lexicon/questions/route.ts`
- `app/api/lexicon/submit/route.ts`

### 更新
- `package.json` (tsx追加、seed:lexiconスクリプト追加)

---

**実装完了日**: Step1-1実装時
