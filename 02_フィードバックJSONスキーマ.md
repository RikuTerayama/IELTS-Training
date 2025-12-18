# フィードバックJSONスキーマ

## TypeScript型定義

```typescript
// フィードバック全体の型
export interface Feedback {
  overall_band_range: string; // 例: "6.0-6.5"
  dimensions: DimensionFeedback[];
  strengths: Strength[];
  band_up_actions: BandUpAction[];
  rewrite_targets: RewriteTarget[];
  vocab_suggestions: VocabSuggestion[];
  metadata: FeedbackMetadata;
}

// 4次元評価（TR/CC/LR/GRA）
export interface DimensionFeedback {
  dimension: 'TR' | 'CC' | 'LR' | 'GRA';
  band_estimate: string; // 例: "6.0"
  short_comment: string; // 1〜2文の短評（日本語可）
  evidence: Evidence[]; // 根拠となる該当文/例
  explanation?: string; // 補足説明（IELTS用語の説明など）
}

// 根拠（該当文の引用）
export interface Evidence {
  paragraph_id: string; // 段落ID（例: "p1", "p2"）
  sentence_id?: string; // 文ID（例: "p1-s2"）
  text: string; // 該当テキスト（50文字程度）
  issue_type: 'positive' | 'negative'; // 良い点か改善点か
  note?: string; // 補足メモ
}

// 強み
export interface Strength {
  dimension: 'TR' | 'CC' | 'LR' | 'GRA';
  description: string; // 具体的な強みの説明
  example?: string; // 該当箇所の例
}

// Band-upアクション（最大3つ、優先順位付き）
export interface BandUpAction {
  priority: 1 | 2 | 3; // 1が最優先
  dimension: 'TR' | 'CC' | 'LR' | 'GRA';
  title: string; // アクションのタイトル（例: "トピックセンテンスを明確に"）
  description: string; // 具体的な改善方法の説明
  concrete_example: string; // 具体例（改善前→改善後）
  next_task_suggestion?: string; // 次回タスクでの実践方法
  resources?: string[]; // 参考リソース（URLやテキスト）
}

// 書き直し対象
export interface RewriteTarget {
  target_id: string; // 一意のID（例: "p1-s2"）
  paragraph_id: string;
  sentence_id?: string;
  original_text: string; // 元のテキスト
  issue_description: string; // 何が問題か（日本語可）
  rewrite_guidance: string; // 修正方針（具体的な指示）
  dimension: 'TR' | 'CC' | 'LR' | 'GRA'; // どの次元の改善か
  priority: 'high' | 'medium' | 'low';
}

// 語彙提案
export interface VocabSuggestion {
  original_word: string; // 元の単語/表現
  suggestion_type: 'synonym' | 'collocation' | 'upgrade' | 'correction';
  suggestions: string[]; // 提案される語彙（最大3つ）
  context: string; // 使用文脈
  explanation?: string; // なぜこの語彙が良いか
  example_sentence?: string; // 使用例文
}

// メタデータ
export interface FeedbackMetadata {
  task_id: string;
  response_id: string;
  user_level: 'beginner' | 'intermediate' | 'advanced';
  generated_at: string; // ISO 8601形式
  model_version?: string; // LLMモデルバージョン
  is_rewrite: boolean; // 書き直し版かどうか
  parent_feedback_id?: string; // 書き直しの場合、元のフィードバックID
}
```

## JSON Schema（検証用）

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "overall_band_range",
    "dimensions",
    "strengths",
    "band_up_actions",
    "rewrite_targets",
    "vocab_suggestions",
    "metadata"
  ],
  "properties": {
    "overall_band_range": {
      "type": "string",
      "pattern": "^[0-9]\\.[0-9]-[0-9]\\.[0-9]$",
      "description": "総合Band推定（例: 6.0-6.5）"
    },
    "dimensions": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "items": {
        "type": "object",
        "required": ["dimension", "band_estimate", "short_comment", "evidence"],
        "properties": {
          "dimension": {
            "type": "string",
            "enum": ["TR", "CC", "LR", "GRA"]
          },
          "band_estimate": {
            "type": "string",
            "pattern": "^[0-9]\\.[0-9]$"
          },
          "short_comment": {
            "type": "string",
            "maxLength": 200
          },
          "evidence": {
            "type": "array",
            "minItems": 1,
            "maxItems": 3,
            "items": {
              "type": "object",
              "required": ["paragraph_id", "text", "issue_type"],
              "properties": {
                "paragraph_id": { "type": "string" },
                "sentence_id": { "type": "string" },
                "text": { "type": "string", "maxLength": 100 },
                "issue_type": { "type": "string", "enum": ["positive", "negative"] },
                "note": { "type": "string" }
              }
            }
          },
          "explanation": { "type": "string" }
        }
      }
    },
    "strengths": {
      "type": "array",
      "minItems": 0,
      "maxItems": 2,
      "items": {
        "type": "object",
        "required": ["dimension", "description"],
        "properties": {
          "dimension": { "type": "string", "enum": ["TR", "CC", "LR", "GRA"] },
          "description": { "type": "string" },
          "example": { "type": "string" }
        }
      }
    },
    "band_up_actions": {
      "type": "array",
      "minItems": 1,
      "maxItems": 3,
      "items": {
        "type": "object",
        "required": ["priority", "dimension", "title", "description", "concrete_example"],
        "properties": {
          "priority": { "type": "integer", "enum": [1, 2, 3] },
          "dimension": { "type": "string", "enum": ["TR", "CC", "LR", "GRA"] },
          "title": { "type": "string", "maxLength": 50 },
          "description": { "type": "string", "maxLength": 300 },
          "concrete_example": { "type": "string" },
          "next_task_suggestion": { "type": "string" },
          "resources": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    },
    "rewrite_targets": {
      "type": "array",
      "minItems": 0,
      "items": {
        "type": "object",
        "required": [
          "target_id",
          "paragraph_id",
          "original_text",
          "issue_description",
          "rewrite_guidance",
          "dimension",
          "priority"
        ],
        "properties": {
          "target_id": { "type": "string" },
          "paragraph_id": { "type": "string" },
          "sentence_id": { "type": "string" },
          "original_text": { "type": "string" },
          "issue_description": { "type": "string" },
          "rewrite_guidance": { "type": "string" },
          "dimension": { "type": "string", "enum": ["TR", "CC", "LR", "GRA"] },
          "priority": { "type": "string", "enum": ["high", "medium", "low"] }
        }
      }
    },
    "vocab_suggestions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["original_word", "suggestion_type", "suggestions", "context"],
        "properties": {
          "original_word": { "type": "string" },
          "suggestion_type": {
            "type": "string",
            "enum": ["synonym", "collocation", "upgrade", "correction"]
          },
          "suggestions": {
            "type": "array",
            "minItems": 1,
            "maxItems": 3,
            "items": { "type": "string" }
          },
          "context": { "type": "string" },
          "explanation": { "type": "string" },
          "example_sentence": { "type": "string" }
        }
      }
    },
    "metadata": {
      "type": "object",
      "required": ["task_id", "response_id", "user_level", "generated_at", "is_rewrite"],
      "properties": {
        "task_id": { "type": "string" },
        "response_id": { "type": "string" },
        "user_level": {
          "type": "string",
          "enum": ["beginner", "intermediate", "advanced"]
        },
        "generated_at": { "type": "string", "format": "date-time" },
        "model_version": { "type": "string" },
        "is_rewrite": { "type": "boolean" },
        "parent_feedback_id": { "type": "string" }
      }
    }
  }
}
```

## 実装上の制約とガイドライン

### 1. ユーザーを圧倒しない設計
- `band_up_actions` は最大3つまで（優先順位1, 2, 3）
- `strengths` は最大2つまで（モチベーション維持）
- `evidence` は各次元で最大3つまで
- 説明文は簡潔に（`short_comment` は200文字以内）

### 2. 全文書き換え禁止
- `rewrite_targets` で指定された範囲のみ編集可能
- フロントエンドで全文編集を無効化
- `rewrite_targets` が空の場合は書き直し機能を非表示

### 3. IELTS用語の補足
- `explanation` フィールドで用語説明を追加可能
- 例: "CC (Coherence and Cohesion) = 一貫性と結束性。段落間の論理的なつながりを指します"

### 4. 具体性の確保
- `concrete_example` は必ず「改善前→改善後」の形式
- `rewrite_guidance` は抽象的でなく、具体的な指示
- `next_task_suggestion` で次回の実践方法を明示

### 5. キャッシュ・再利用
- 同じ回答内容に対してはフィードバックを再利用可能
- `response_id` をキーにキャッシュ
- 書き直し版は `parent_feedback_id` で関連付け

## データベース保存形式（Supabase）

```sql
-- feedbacks テーブル
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES user_responses(id),
  overall_band_range TEXT NOT NULL,
  dimensions JSONB NOT NULL, -- DimensionFeedback[]
  strengths JSONB NOT NULL, -- Strength[]
  band_up_actions JSONB NOT NULL, -- BandUpAction[]
  rewrite_targets JSONB NOT NULL, -- RewriteTarget[]
  vocab_suggestions JSONB NOT NULL, -- VocabSuggestion[]
  metadata JSONB NOT NULL, -- FeedbackMetadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  parent_feedback_id UUID REFERENCES feedbacks(id), -- 書き直しの場合
  is_rewrite BOOLEAN DEFAULT FALSE
);

-- インデックス
CREATE INDEX idx_feedbacks_response_id ON feedbacks(response_id);
CREATE INDEX idx_feedbacks_parent_id ON feedbacks(parent_feedback_id);
```

## LLMプロンプト設計のヒント

### フィードバック生成時のプロンプト構造
1. **入力**: ユーザーの回答全文、タスクのお題、ユーザーレベル
2. **出力形式**: 上記JSONスキーマに厳密に従う
3. **制約の明示**:
   - "band_up_actions は最大3つ、優先順位1, 2, 3で出力"
   - "rewrite_targets は全文書き換えではなく、特定の段落/文のみ指定"
   - "日本人学習者向けに、IELTS用語には補足説明を追加"
4. **具体性の要求**: "抽象的なアドバイスではなく、改善前→改善後の具体例を含める"

