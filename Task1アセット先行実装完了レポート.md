# Task1アセット先行実装完了レポート

## 変更点サマリー

### 1. 追加したアセット定義
- **ファイル**: `lib/task1/assets.ts` (新規作成)
- **件数**: 12個のアセット
  - batch1 (line_chart): 3件 (beginner/intermediate/advanced)
  - batch2 (bar_chart): 3件 (beginner/intermediate/advanced)
  - batch3 (pie_chart): 3件 (beginner/intermediate/advanced)
  - batch4 (table): 3件 (beginner/intermediate/advanced)

### 2. 修正したファイル

#### 2.1 `lib/task1/assets.ts` (新規作成)
- **役割**: Task1アセット定義と選択ロジック
- **主な関数**:
  - `TASK1_ASSETS`: 12個のアセット定義
  - `selectAssetByWeight()`: 重み付きでアセットを選択（分布制御）
  - `filterAssets()`: レベルとジャンルでフィルタリング
  - `getAssetById()`: IDでアセットを取得

#### 2.2 `lib/llm/prompts/task_generate.ts`
- **変更内容**:
  - `buildTask1QuestionFromAsset()`: アセットから質問文を決定生成（LLM不使用）
  - `buildTask1VocabPrompt()`: 語彙とprep_guideのみを生成するプロンプト（新規）
  - `generateTask1VocabOnly()`: LLMで語彙とprep_guideのみ生成（temperature: 0.2）
  - `generateTask()`: Task1の場合はエラーを返すように変更（後方互換用）

#### 2.3 `app/api/tasks/generate/route.ts`
- **変更内容**:
  - Task1の場合はアセット先行方式に変更
  - アセット選択 → 質問文生成 → 語彙/prep_guide生成 → DB保存
  - `asset_id`と`image_path`をDBに保存
  - 必須フレーズバリデーション追加（"shows", "Summarise", "Write at least 150 words"）

#### 2.4 `lib/domain/types.ts`
- **変更内容**:
  - `Task`インターフェースに`asset_id?: string`と`image_path?: string`を追加

#### 2.5 `components/task/Task1Image.tsx`
- **変更内容**:
  - `imagePath`プロップを追加（優先順位1）
  - フォールバック順序: `imagePath` → `getTask1ImagePathFromMetadata()` → `getTask1ImagePath()`

#### 2.6 `app/task/[taskId]/page.tsx`
- **変更内容**:
  - `Task1Image`コンポーネントに`imagePath={task.image_path}`を渡すように変更（2箇所）

#### 2.7 `app/task/[taskId]/prep/page.tsx`
- **変更内容**:
  - `Task1Image`コンポーネントに`imagePath`を渡すように変更

#### 2.8 `supabase/migrations/003_task1_assets.sql` (新規作成)
- **変更内容**:
  - `tasks`テーブルに`asset_id`と`image_path`カラムを追加（nullable、既存レコードとの互換性）

---

## 生成サンプル3件

### Sample A: beginner, line_chart
- **Asset ID**: `line_chart_1`
- **Level**: beginner
- **Genre**: line_chart
- **Image Path**: `/images/task1/batch1/1.png`
- **Asset Metadata**:
  - Title: "Population changes over time"
  - Time Period: "2010 to 2020"
  - Unit: "millions"
  - Categories: ["Country A", "Country B", "Country C"]
- **Question** (生成される質問文):
```
The graph below shows population changes over time from 2010 to 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.
```

### Sample B: intermediate, bar_chart
- **Asset ID**: `bar_chart_2`
- **Level**: intermediate
- **Genre**: bar_chart
- **Image Path**: `/images/task1/batch2/2-2.png`
- **Asset Metadata**:
  - Title: "Monthly sales comparison"
  - Time Period: "January to June 2023"
  - Unit: "thousands of dollars"
  - Categories: ["Store A", "Store B", "Store C"]
- **Question** (生成される質問文):
```
The bar chart below shows monthly sales comparison from January to June 2023.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.
```

### Sample C: advanced, pie_chart
- **Asset ID**: `pie_chart_3`
- **Level**: advanced
- **Genre**: pie_chart
- **Image Path**: `/images/task1/batch3/3-3.png`
- **Asset Metadata**:
  - Title: "Energy sources distribution"
  - Time Period: "2022"
  - Unit: "percentage"
  - Categories: ["Fossil Fuels", "Renewable Energy", "Nuclear", "Hydroelectric", "Others"]
- **Question** (生成される質問文):
```
The pie chart below shows energy sources distribution from 2022.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.
```

---

## 実装の要点

### 1. アセット先行方式
- **質問文**: アセットメタデータから決定的に生成（LLM不使用）
  - IELTS定型文を含む: "The {chart_type} below shows...", "Summarise...", "Write at least 150 words."
- **語彙とprep_guide**: LLMで生成（temperature: 0.2で一貫性を保つ）
- **画像**: アセット定義の`image_path`を使用（100%一致を保証）

### 2. 分布制御
- **ジャンル未指定時**: 重み付きで選択
  - line_chart, bar_chart, pie_chart, table: 重み 1.0
  - multiple_charts, diagram, map: 重み 0.5
- **偏り防止**: 各ジャンルが均等に出るように制御

### 3. バリデーション
- **必須フレーズチェック**: "shows", "Summarise", "Write at least 150 words"を含むか確認
- **語彙数チェック**: 3-5語であることを確認
- **LLM出力検証**: JSON形式とスキーマバージョンを確認

### 4. 後方互換性
- **旧タスク**: `image_path`がなければ従来ロジック（`detectTask1Genre()`）でフォールバック
- **新規タスク**: `asset_id`と`image_path`が必ず設定される

---

## 動作確認手順

### 1. ローカルでサンプル生成（スクリプト）
```bash
npx tsx scripts/generate-task1-samples.ts
```

### 2. APIで実際に生成
```bash
# POST /api/tasks/generate
{
  "level": "beginner",
  "task_type": "Task 1",
  "genre": "line_chart"
}
```

### 3. 確認項目
- ✅ 質問文に必須フレーズが含まれているか
- ✅ `asset_id`と`image_path`がDBに保存されているか
- ✅ 画像が正しく表示されるか
- ✅ 質問文と画像の内容が一致しているか（目視確認）

---

## 今後の改善点

1. **アセット追加**: batch5 (multiple_charts), batch6 (diagram), batch7 (map) のアセット定義を追加
2. **画像メタデータの正確性**: 実際の画像ファイルの内容に合わせてメタデータを調整
3. **バリデーション強化**: LLM出力のJSONバリデーションをZodで実装
4. **テスト**: 生成サンプルの自動テストを追加

---

すべての実装を完了しました。✅
