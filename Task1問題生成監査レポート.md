# Task1問題生成監査レポート
## IELTS本番からの乖離原因特定と改善設計のための現状分析

---

## 1. 生成フロー概要（入口→API→DB→UI）

### 1.1 エントリーポイント
- **画面1**: `/task/select?task_type=Task%201`
  - ファイル: `app/task/select/page.tsx` (99-107行目)
  - ユーザーがTask 1、レベル、ジャンルを選択
  - 「開始」ボタンで `/api/tasks/generate` をPOST

- **画面2**: `/training/writing/task1`
  - ファイル: `app/training/writing/task1/page.tsx` (40-47行目)
  - 推薦APIから取得した設定で自動生成
  - 同じ `/api/tasks/generate` をPOST

### 1.2 APIフロー
1. **`POST /api/tasks/generate`** (`app/api/tasks/generate/route.ts`)
   - 認証チェック (15-23行目)
   - リクエストパラメータ: `{ level, task_type: 'Task 1', genre }` (27-28行目)
   - `generateTask()` を呼び出し (50行目)
   - 生成結果を `tasks` テーブルに保存 (70-81行目)

2. **`lib/llm/prompts/task_generate.ts`** の `generateTask()` (151-175行目)
   - `buildTask1Prompt()` でプロンプト構築 (156行目)
   - `callLLM()` を呼び出し (161-164行目)
   - `parseLLMResponseWithRetry()` でJSON解析 (160行目)

3. **`lib/llm/client.ts`** の `callLLM()` (48-179行目)
   - プロバイダー: Groq/OpenAI/Gemini/HuggingFace (環境変数で制御)
   - デフォルト: Groq (`llama-3.1-8b-instant`)
   - パラメータ: `temperature: 0.7`, `max_tokens: 2000`, `response_format: { type: 'json_object' }`

### 1.3 データベース保存
- **テーブル**: `tasks` (Supabase)
- **保存フィールド** (`app/api/tasks/generate/route.ts` 72-78行目):
  - `level`
  - `question` (LLMが生成した質問文)
  - `question_type: 'Task 1'`
  - `required_vocab` (JSONB配列)
  - `prep_guide` (JSONB, 初級/中級のみ)
  - `is_cached: false`

### 1.4 UI表示
- **画面**: `/task/[taskId]` (`app/task/[taskId]/page.tsx`)
- 画像表示: `components/task/Task1Image.tsx`
  - 質問文からジャンルを検出 (`lib/utils/task1Image.ts` の `detectTask1Genre()`)
  - ジャンル+レベルから画像パスを決定 (`getTask1ImagePath()`)
  - 既存の画像ファイルを参照: `/images/task1/batch{1-7}/{level}.png`

---

## 2. 生成ロジックの所在（ファイル一覧＋役割）

### 2.1 プロンプト構築
- **`lib/llm/prompts/task_generate.ts`**
  - `buildTask1Prompt()` (22-83行目): Task1用プロンプト生成
  - `generateTask()` (151-175行目): LLM呼び出しとレスポンス解析

### 2.2 LLMクライアント
- **`lib/llm/client.ts`**
  - `callLLM()` (48-179行目): 複数プロバイダー対応
  - デフォルト設定 (41-46行目): Groq, temperature: 0.7, max_tokens: 2000

### 3.3 レスポンス解析
- **`lib/llm/parse.ts`**
  - `extractJSON()` (22-39行目): テキストからJSON抽出
  - `parseLLMResponseWithRetry()` (44-76行目): 最大3回リトライ

### 2.4 画像管理
- **`lib/utils/task1Image.ts`**
  - `detectTask1Genre()` (15-62行目): 質問文からジャンル検出（文字列マッチング）
  - `getTask1ImagePath()` (71-118行目): ジャンル+レベル→画像パス変換

### 2.5 型定義
- **`lib/domain/types.ts`**
  - `TaskGenerationResponse` (391-397行目): LLMレスポンスの型

---

## 3. LLM呼び出し詳細（モデル/プロンプト/パラメータ）

### 3.1 使用モデル
- **デフォルト**: Groq `llama-3.1-8b-instant`
- **環境変数で変更可能**: `LLM_PROVIDER`, `LLM_MODEL`
- **対応プロバイダー**: Groq/OpenAI/Gemini/HuggingFace

### 3.2 プロンプト全文（Task1）
`lib/llm/prompts/task_generate.ts` 22-83行目:

```
You are an IELTS Writing Task 1 question generator for Japanese learners.

Generate an IELTS Writing Task 1 question appropriate for the user's level.

User Level: {level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

Task Type: Task 1 (Graph/Chart/Diagram/Map description)
{genreInstruction}

Requirements:
1. Generate a realistic IELTS Task 1 question with appropriate data
2. Provide 3-5 required vocabulary words with:
   - word (English)
   - meaning (Japanese)
   - skill_tags (array of 'writing', 'speaking', 'reading', 'listening')
3. For beginner/intermediate levels, provide a simple guide structure

Output JSON format:
{
  "schema_version": "1.0",
  "level": "{level}",
  "question_type": "Task 1",
  "question": "IELTS Task 1 question text describing the graph/chart/diagram/map",
  "required_vocab": [
    {
      "word": "example",
      "meaning": "例",
      "skill_tags": ["writing", "speaking"]
    }
  ],
  "prep_guide": {
    "point": "Describe the main features",
    "reason": "Provide specific data points",
    "example": "Include comparisons",
    "point_again": "Summarize the key trends",
    "structure": ["Introduction", "Overview", "Details"]
  }
}

Note: For advanced level, prep_guide can be null or minimal.
```

**ジャンル指定部分** (36-38行目):
- 指定あり: `Generate a {ジャンル説明} task.`
- 指定なし: `Generate a random Task 1 format (line chart, bar chart, pie chart, table, multiple charts, diagram, or map).`

### 3.3 APIパラメータ
- **`temperature`**: 0.7 (固定)
- **`max_tokens`**: 2000 (デフォルト)
- **`response_format`**: `{ type: 'json_object' }` (JSONモード強制)

### 3.4 問題点
- **プロンプトが簡素すぎる**: "realistic IELTS Task 1 question" と指示するだけで、具体的な形式要件がない
- **データの妥当性チェックがない**: 数値の範囲、単位、期間などが指定されていない
- **画像との整合性が取れない**: LLMが生成する質問文と、既存画像ファイルが一致しない可能性が高い

---

## 4. 現状の出題サンプル（プロンプトから推測される内容）

### サンプルA（推測: Line Chart）
- **質問文（LLM生成想定）**: "The graph below shows the changes in population from 2010 to 2020 in three countries."
- **画像**: `/images/task1/batch1/{1|2|3}.png` (質問文のキーワードから検出)
- **必須語彙**: LLMが生成（3-5語）
- **問題点**: 質問文の内容と画像の数値/期間/国名が一致しない可能性が高い

### サンプルB（推測: Bar Chart）
- **質問文（LLM生成想定）**: "The bar chart compares the sales of different products in 2023."
- **画像**: `/images/task1/batch2/2-{1|2|3}.png`
- **必須語彙**: LLMが生成
- **問題点**: 同じく画像との不整合

### サンプルC（推測: Pie Chart）
- **質問文（LLM生成想定）**: "The pie chart illustrates the distribution of energy sources in Japan."
- **画像**: `/images/task1/batch3/3-{1|2|3}.png`
- **必須語彙**: LLMが生成
- **問題点**: 同じく画像との不整合

**注意**: 実際のサンプルは未取得。上記はプロンプトから推測した内容。

---

## 5. 乖離要因の仮説（根拠付き）

### 5.1 プロンプトの不足
**根拠**: `lib/llm/prompts/task_generate.ts` 22-83行目
- **問題**: "realistic IELTS Task 1 question" という抽象的な指示のみ
- **不足項目**:
  - IELTS本番の典型的な指示文形式（"The graph/chart shows...", "Summarise the information...", "Write at least 150 words"）
  - グラフのタイトル、軸ラベル、単位、期間の指定方法
  - 数値の妥当性（0や負値の回避、単位の整合性、桁数の妥当性）

### 5.2 画像と質問文の不整合
**根拠**: `lib/utils/task1Image.ts` 15-62行目, `components/task/Task1Image.tsx` 30-31行目
- **問題**: LLMが生成する質問文と、既存画像ファイル（`/images/task1/batch*/`) が独立
- **検出方法**: 文字列マッチングのみ（"line chart", "bar chart" などのキーワード）
- **結果**: 質問文に "The graph shows sales from 2020-2025" と書かれていても、画像が "population 2010-2020" の場合、完全に不一致

### 5.3 ジャンル分布の偏り
**根拠**: `lib/llm/prompts/task_generate.ts` 36-38行目
- **問題**: "random" 指定時の分布制御がない
- **結果**: line_chart ばかり生成される、または特定ジャンルが全く出ない可能性

### 5.4 数値データの妥当性
**根拠**: プロンプトに数値検証の指示がない
- **問題**: 
  - 急激すぎる増減（例: 10 → 1000）
  - 単位の不整合（million と thousand が混在）
  - 0や負値の出現
  - 桁数の異常（3桁 vs 7桁）
- **結果**: 非現実的なデータが生成される可能性

### 5.5 指示文の形式
**根拠**: プロンプトに具体的な形式指定がない
- **問題**: IELTS本番の典型的な指示文が生成されない可能性
  - 例: "The graph below shows...", "Summarise the information...", "Write at least 150 words"
- **結果**: 形式がバラバラで、本番との乖離

### 5.6 難易度反映の不足
**根拠**: `lib/llm/prompts/task_generate.ts` 44-47行目
- **問題**: レベルはBand目標でしか指定されていない
- **不足項目**:
  - データの複雑さ（初級: 単一グラフ、上級: 複合グラフ）
  - 時制の複雑さ（初級: 過去形のみ、上級: 過去/現在/未来の混在）
  - 比較の複雑さ（初級: 2項目、上級: 5項目以上）

### 5.7 禁止事項の未指定
**根拠**: プロンプトに禁止事項の明示がない
- **問題**: 
  - 原因推測（"because", "due to" などの説明）
  - 意見や提案（"should", "I think" など）
  - 未来予測（"will", "might" など）
- **結果**: Task1の要件に反する内容が混入する可能性

---

## 6. 改善設計の論点（実装前）

### 6.1 プロンプト改善
- **具体的な形式要件を追加**:
  - IELTS本番の典型的な指示文テンプレート
  - グラフのタイトル、軸ラベル、単位、期間の指定方法
  - 数値の妥当性チェック（範囲、単位、桁数）
- **難易度別の詳細要件**:
  - 初級: 単一グラフ、過去形のみ、2-3項目
  - 中級: 単一/複合グラフ、過去/現在混在、3-5項目
  - 上級: 複合グラフ、過去/現在/未来混在、5項目以上

### 6.2 画像生成方式の検討
- **方式A: 画像をLLMに生成させる**
  - DALL-E / Midjourney / Stable Diffusion を使用
  - 質問文と画像を同時生成して整合性を保証
  - **課題**: コスト、品質、IELTS本番らしさ
- **方式B: 質問文を画像に合わせる**
  - 既存画像のメタデータ（タイトル、軸、数値）を事前定義
  - LLMに「このメタデータに基づいて質問文を生成」と指示
  - **課題**: 画像メタデータの管理、柔軟性の低下
- **方式C: 問題バンク方式**
  - 問題+画像のペアを事前に作成（人間による）
  - LLMはバンクから選択するだけ
  - **課題**: 問題数が限られる、動的生成ができない

### 6.3 バリデーション追加
- **数値検証**:
  - 0や負値の検出
  - 単位の整合性（million vs thousand）
  - 桁数の妥当性
- **形式検証**:
  - 指示文の形式チェック
  - 禁止語句の検出（"because", "should", "I think"）
- **画像整合性検証**:
  - 質問文の内容と画像のメタデータの照合

### 6.4 ジャンル分布制御
- **分布の明示**:
  - 各ジャンルの出現確率を指定
  - ユーザーの学習履歴に基づく調整
- **バランス確保**:
  - 連続で同じジャンルが出ない制御
  - 全ジャンルが均等に出る制御

### 6.5 データ生成ロジックの改善
- **テンプレート方式**:
  - 各ジャンルごとにテンプレートを用意
  - LLMはテンプレートに数値を埋め込むだけ
- **制約付き生成**:
  - 数値の範囲、単位、期間を事前に指定
  - LLMに「この制約内で生成」と指示

---

## 7. ChatGPT貼り付け用「最小パック」（コピペ用）

### 重要ファイルパス
- **プロンプト**: `lib/llm/prompts/task_generate.ts` (22-83行目)
- **LLMクライアント**: `lib/llm/client.ts` (48-179行目)
- **画像管理**: `lib/utils/task1Image.ts` (15-118行目)
- **API**: `app/api/tasks/generate/route.ts` (10-106行目)

### プロンプト全文（Task1）
```
You are an IELTS Writing Task 1 question generator for Japanese learners.

Generate an IELTS Writing Task 1 question appropriate for the user's level.

User Level: {level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

Task Type: Task 1 (Graph/Chart/Diagram/Map description)
{genreInstruction}

Requirements:
1. Generate a realistic IELTS Task 1 question with appropriate data
2. Provide 3-5 required vocabulary words with:
   - word (English)
   - meaning (Japanese)
   - skill_tags (array of 'writing', 'speaking', 'reading', 'listening')
3. For beginner/intermediate levels, provide a simple guide structure

Output JSON format:
{
  "schema_version": "1.0",
  "level": "{level}",
  "question_type": "Task 1",
  "question": "IELTS Task 1 question text describing the graph/chart/diagram/map",
  "required_vocab": [...],
  "prep_guide": {...}
}
```

### サンプル3つ（推測）
**Sample A**: "The graph below shows the changes in population from 2010 to 2020 in three countries."
**Sample B**: "The bar chart compares the sales of different products in 2023."
**Sample C**: "The pie chart illustrates the distribution of energy sources in Japan."

### 乖離要因上位5つ
1. **プロンプトの不足**: "realistic" という抽象指示のみで、具体的な形式要件がない
2. **画像との不整合**: LLM生成の質問文と既存画像ファイルが独立
3. **数値データの妥当性**: 検証ロジックがない（急激な増減、単位不整合、0/負値）
4. **指示文の形式**: IELTS本番の典型的な形式が指定されていない
5. **難易度反映の不足**: Band目標のみで、データの複雑さが指定されていない

### 制約（技術/UX）
- **技術制約**:
  - LLMプロバイダー: Groq/OpenAI/Gemini/HuggingFace（環境変数で切り替え）
  - デフォルト: Groq `llama-3.1-8b-instant`（コスト重視）
  - 画像は既存ファイル参照のみ（生成機能なし）
- **UX制約**:
  - ユーザーはレベル/ジャンルを選択して即座に問題を生成することを期待
  - 画像との整合性が崩れると学習効果が低下
  - 難易度が適切でないとユーザーのモチベーションが下がる

### 改善目標
- IELTS本番に近い問題形式（指示文、数値データ、グラフ形式）
- 画像と質問文の整合性保証
- 難易度に応じた適切な複雑さ
- 禁止事項の排除（原因推測、意見、提案）

---

以上が現状分析の全容です。

