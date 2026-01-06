# IELTS Training アプリケーション - Writing Task 1 実装レポート

## 1. アプリケーション概要

**IELTS Training**は、IELTS Writing/Speaking向けの学習アプリケーション（MVP実装）です。Next.js 14 + TypeScript + Tailwind CSS + Supabaseで構築されており、LLM（OpenAI/Groq API）を活用したタスク生成とフィードバック機能を提供します。

### 主要機能
- タスク生成（LLM連携）
- レベル別回答入力（初級/中級/上級）
- フィードバック生成（LLM連携、4次元評価）
- 穴埋め問題（初級/中級向け）
- 書き直し機能（最大2箇所、最大3回）
- 進捗トラッキング

---

## 2. Writing Task 1 の実装状況

### 2.1 実装完了機能

#### ✅ タスク生成
- **API**: `POST /api/tasks/generate`
- **LLMプロンプト**: `lib/llm/prompts/task_generate.ts`
- Task 1専用のプロンプトが実装済み
- ジャンル指定可能（line_chart, bar_chart, pie_chart, table, multiple_charts, diagram, map）

#### ✅ 画面実装
- **エントリーポイント**: `/app/training/writing/task1/page.tsx`
- **タスク画面**: `/app/task/[taskId]/page.tsx`（Task 1とTask 2を統合）
- Task 1の場合、画像表示コンポーネントが自動的に表示される

#### ✅ 画像管理システム
- **コンポーネント**: `components/task/Task1Image.tsx`
- **ユーティリティ**: `lib/utils/task1Image.ts`, `lib/utils/task1Helpers.ts`
- 質問文から自動的にジャンルを検出し、適切な画像を表示
- バッチ管理システム（batch1〜batch7、各レベル3問）

#### ✅ レベル別対応
- **初級（beginner）**: Band 5.0-5.5目標、PREPガイド表示、日本語→英語の段階的アプローチ
- **中級（intermediate）**: Band 6.0-6.5目標、PREPガイド表示、英語PREP形式入力
- **上級（advanced）**: Band 6.5-7.0目標、PREPガイドなし、英語自由記述

---

## 3. Task 1 の特徴と実装詳細

### 3.1 タスク生成プロセス

#### LLMプロンプト構造
```typescript
// lib/llm/prompts/task_generate.ts
function buildTask1Prompt(
  level: 'beginner' | 'intermediate' | 'advanced',
  genre: string | null
): string
```

**プロンプトの特徴**:
- レベルに応じた適切な難易度のタスクを生成
- ジャンル指定可能（指定なしの場合はランダム）
- 必須語彙3〜5語を自動生成（日本語訳付き）
- 初級/中級向けにPREPガイド構造を提供

**生成されるJSON形式**:
```json
{
  "schema_version": "1.0",
  "level": "beginner",
  "question_type": "Task 1",
  "question": "IELTS Task 1 question text...",
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
```

### 3.2 画像表示システム

#### ジャンル検出機能
```typescript
// lib/utils/task1Image.ts
export function detectTask1Genre(question: string): string | null
```

**対応ジャンル**:
- `line_chart`: ラインチャート（時系列データ）
- `bar_chart`: 棒グラフ（カテゴリー比較）
- `pie_chart`: 円グラフ（割合・構成比）
- `table`: 表（テーブル）
- `multiple_charts`: 複数の図表
- `diagram`: ダイアグラム（プロセス・構造）
- `map`: 地図（地理的情報）

#### 画像パス管理
- **バッチシステム**: batch1〜batch7（各ジャンルに対応）
- **レベル対応**: 各バッチ内に3つの画像（beginner=1, intermediate=2, advanced=3）
- **命名規則**:
  - batch1: `/images/task1/batch1/1.png`, `/images/task1/batch1/2.png`, `/images/task1/batch1/3.png`
  - batch2以降: `/images/task1/batch2/2-1.png`, `/images/task1/batch2/2-2.png`, `/images/task1/batch2/2-3.png`

**現在の画像配置**:
```
public/images/task1/
├── batch1/ (line_chart)
│   ├── 1.png (beginner)
│   ├── 2.png (intermediate)
│   └── 3.png (advanced)
├── batch2/ (bar_chart)
│   ├── 2-1.png (beginner)
│   ├── 2-2.png (intermediate)
│   └── 2-3.png (advanced)
├── batch3/ (pie_chart)
│   ├── 3-1.png (beginner)
│   ├── 3-2.png (intermediate)
│   └── 3-3.png (advanced)
└── batch4/ (table)
    ├── 4-1.png (beginner)
    ├── 4-2.png (intermediate)
    └── 4-3.png (advanced)
```

#### 画像コンポーネント
```typescript
// components/task/Task1Image.tsx
<Task1Image
  question={task.question}
  level={level}
  alt="Task 1 Chart or Diagram"
  className="w-full"
/>
```

**機能**:
- 質問文とレベルから自動的に画像パスを決定
- 画像読み込みエラー時のフォールバック表示
- 開発環境でのデバッグ情報表示

### 3.3 タスク画面での表示

#### Task 1専用の表示ロジック
```typescript
// app/task/[taskId]/page.tsx
{task.question_type === 'Task 1' && (
  <div className="mb-4">
    <Task1Image
      question={task.question}
      level={level}
      alt="Task 1 Chart or Diagram"
      className="w-full"
    />
  </div>
)}
```

**表示内容**:
1. **お題セクション**: 質問文 + 画像（Task 1の場合）
2. **目標Band表示**: レベルに応じた目標Band範囲
3. **必須語彙表示**: 3〜5語の必須語彙（タグ形式）
4. **PREPガイド**: 初級/中級のみ表示
5. **入力エリア**: レベル別の入力形式

---

## 4. データ構造

### 4.1 Task型定義
```typescript
// lib/domain/types.ts
export interface Task {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  question: string; // IELTS形式のお題
  question_type: 'Task 1' | 'Task 2';
  required_vocab: RequiredVocab[]; // 3〜5語
  prep_guide?: PrepGuide; // 初級/中級のみ
  created_at: string;
}
```

### 4.2 データベーススキーマ
```sql
-- tasksテーブル
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  question TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('Task 1', 'Task 2')),
  required_vocab JSONB NOT NULL,
  prep_guide JSONB,
  is_cached BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. APIエンドポイント

### 5.1 タスク生成API
```
POST /api/tasks/generate
```

**リクエスト**:
```json
{
  "level": "beginner",
  "task_type": "Task 1",
  "genre": "line_chart" // オプション
}
```

**レスポンス**:
```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "level": "beginner",
    "question": "The graph below shows...",
    "question_type": "Task 1",
    "required_vocab": [...],
    "prep_guide": {...}
  }
}
```

### 5.2 タスク取得API
```
GET /api/tasks/:taskId
```

### 5.3 回答送信API
```
POST /api/tasks/:taskId/submit
```

**リクエスト**:
```json
{
  "level": "beginner",
  "draft_content": {
    "final": "ユーザーの回答テキスト"
  }
}
```

---

## 6. フィードバックシステムとの連携

### 6.1 フィードバック生成
- Task 1もTask 2と同じフィードバック生成APIを使用
- `POST /api/llm/feedback` で4次元評価（TR, CC, LR, GRA）を生成
- Task 1特有の評価基準はLLMプロンプト内で処理

### 6.2 フィードバック内容
- **Overall Band Range**: レベルに応じたBand推定
- **4次元評価**: TR（Task Response）、CC（Coherence and Cohesion）、LR（Lexical Resource）、GRA（Grammatical Range and Accuracy）
- **Band-up Actions**: 最大3つの改善提案（優先順位付き）
- **Rewrite Targets**: 最大2箇所の書き直し対象
- **Vocab Suggestions**: 語彙改善提案

---

## 7. レベル別の学習フロー

### 7.1 初級（Beginner）
1. **タスク選択**: `/training/writing/task1` → タスクを選択
2. **タスク画面**: 画像 + 質問文 + PREPガイド + 必須語彙を表示
3. **入力**: 日本語で回答 → 英語で回答（自由記述）
4. **送信**: `/api/tasks/:taskId/submit`
5. **穴埋め問題**: `/fillin/[attemptId]`（初級/中級のみ）
6. **フィードバック**: `/feedback/[attemptId]`

### 7.2 中級（Intermediate）
1. **タスク選択**: 同様
2. **タスク画面**: 画像 + 質問文 + PREPガイド + 必須語彙を表示
3. **入力**: 英語でPREP形式で回答
4. **送信**: 同様
5. **穴埋め問題**: 同様
6. **フィードバック**: 同様

### 7.3 上級（Advanced）
1. **タスク選択**: 同様
2. **タスク画面**: 画像 + 質問文 + 必須語彙を表示（PREPガイドなし）
3. **入力**: 英語で自由記述
4. **送信**: 同様
5. **フィードバック**: 直接フィードバック画面へ（穴埋め問題スキップ）

---

## 8. 技術スタック

### 8.1 フロントエンド
- **Next.js 14**: App Router
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **React**: UI構築

### 8.2 バックエンド
- **Next.js Route Handlers**: APIエンドポイント
- **Supabase**: データベース（PostgreSQL）
- **LLM API**: OpenAI API または Groq API

### 8.3 画像管理
- **静的ファイル**: `public/images/task1/` に配置
- **動的パス生成**: 質問文とレベルから自動決定

---

## 9. 今後の拡張可能性

### 9.1 実装済み機能
- ✅ タスク生成（LLM連携）
- ✅ 画像表示システム
- ✅ レベル別入力
- ✅ フィードバック生成
- ✅ 穴埋め問題（初級/中級）
- ✅ 書き直し機能

### 9.2 未実装機能（設計済み）
- ⏳ Speaking練習画面（Task 1からSpeakingプロンプト生成）
- ⏳ 単語学習機能との連携
- ⏳ 進捗トラッキング（Task 1専用の統計）

### 9.3 改善の余地
- 画像の動的生成（LLMでグラフ生成）
- より多様なジャンル対応
- Task 1専用のフィードバックプロンプト最適化
- 画像とテキストの連携強化

---

## 10. 設計ドキュメントとの整合性

### 10.1 実装済み設計
- ✅ タスク生成プロンプト（`07_LLMプロンプトテンプレート.md`）
- ✅ TypeScript型定義（`06_TypeScript型定義.md`）
- ✅ API設計（`08_API設計_統一フォーマット.md`）
- ✅ 画面遷移図（`01_画面遷移図.md`）

### 10.2 設計との差異
- 画像管理システムは実装時に追加（設計ドキュメントには詳細なし）
- バッチ管理システムは実装時の最適化

---

## 11. まとめ

Writing Task 1は、以下の特徴を持つ実装となっています：

1. **LLMによる動的タスク生成**: レベルとジャンルに応じたタスクを自動生成
2. **画像表示システム**: 質問文から自動的にジャンルを検出し、適切な画像を表示
3. **レベル別対応**: 初級/中級/上級で異なる学習フローを提供
4. **統合されたフィードバック**: Task 2と同じフィードバックシステムを使用
5. **拡張可能な設計**: 新しいジャンルや画像の追加が容易

現在の実装はMVP段階ですが、基本的な機能は完成しており、ユーザーがTask 1の練習を開始できる状態です。

---

**作成日**: 2024年
**対象**: ChatGPTへのインプット用
**バージョン**: MVP実装

