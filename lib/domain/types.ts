/**
 * TypeScript型定義
 * 06_TypeScript型定義.md に準拠
 */

// ==================== 共通APIレスポンス ====================
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ==================== フィードバックJSON型 ====================
export interface Feedback {
  schema_version: string; // "1.0"
  overall_band_range: string; // "6.0-6.5"
  dimensions: DimensionFeedback[];
  strengths: Strength[];
  band_up_actions: BandUpAction[]; // 最大3つ、必ず1〜3
  rewrite_targets: RewriteTarget[]; // 最大2箇所
  vocab_suggestions: VocabSuggestion[];
  metadata: FeedbackMetadata;
}

export interface DimensionFeedback {
  dimension: 'TR' | 'CC' | 'LR' | 'GRA';
  band_estimate: string; // "6.0"
  short_comment: string; // 1行の短評（長文禁止）
  evidence: Evidence[]; // 根拠となる該当文/例（最大3つ）
  explanation?: string; // 補足説明（IELTS用語の説明など）
}

export interface Evidence {
  paragraph_id: string; // "p1"
  sentence_id?: string; // "p1-s2"
  text: string; // 該当テキスト（50文字程度）
  issue_type: 'positive' | 'negative';
  note?: string;
}

export interface Strength {
  dimension: 'TR' | 'CC' | 'LR' | 'GRA';
  description: string;
  example?: string;
}

export interface BandUpAction {
  priority: 1 | 2 | 3; // 必ず1, 2, 3のいずれか
  dimension: 'TR' | 'CC' | 'LR' | 'GRA';
  title: string; // 短いタイトル
  why: string; // 理由
  how: string; // 具体手順
  example: string; // 例文（改善前→改善後）
}

export interface RewriteTarget {
  target_id: string; // "p1-s2"
  paragraph_id: string;
  sentence_id?: string;
  original_text: string;
  issue_description: string;
  rewrite_guidance: string; // 修正方針
  dimension: 'TR' | 'CC' | 'LR' | 'GRA';
  priority: 'high' | 'medium' | 'low';
}

export interface VocabSuggestion {
  original_word: string;
  suggestion_type: 'synonym' | 'collocation' | 'upgrade' | 'correction';
  suggestions: string[]; // 最大3つ
  context: string;
  explanation?: string;
  example_sentence?: string;
}

export interface FeedbackMetadata {
  task_id: string;
  attempt_id: string;
  user_level: 'beginner' | 'intermediate' | 'advanced';
  generated_at: string; // ISO 8601形式
  model_version?: string;
  is_rewrite: boolean;
  parent_feedback_id?: string;
}

// ==================== タスク型 ====================
export interface Task {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  question: string; // IELTS形式のお題
  question_type: 'Task 1' | 'Task 2';
  required_vocab: RequiredVocab[]; // 3〜5語
  prep_guide?: PrepGuide; // 初級/中級のみ
  created_at: string;
}

export interface RequiredVocab {
  vocab_id?: string;
  word: string;
  meaning: string;
  skill_tags: ('writing' | 'speaking' | 'reading' | 'listening')[];
}

export interface PrepGuide {
  point: string; // P (Point) の説明
  reason: string; // R (Reason) の説明
  example: string; // E (Example) の説明
  point_again: string; // P (Point again) の説明
  structure: string[]; // 構成案
}

// ==================== 回答（Attempt）型 ====================
export interface Attempt {
  id: string;
  user_id: string;
  task_id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  draft_content: DraftContent;
  submitted_at?: string;
  status: 'draft' | 'submitted' | 'rewritten';
  rewrite_count: number;
  created_at: string;
  updated_at: string;
}

export interface DraftContent {
  japanese?: string; // 初級: 日本語回答
  skeleton?: string; // 初級: 英語骨格
  fill_in?: string; // 初級/中級: 穴埋め回答
  final?: string; // 最終回答（全レベル共通）
}

// ==================== 穴埋め問題型 ====================
export type FillInQuestionType = 
  | 'CC'    // 接続詞/指示語（However/Therefore/This/These）
  | 'LR'    // 言い換え（important→crucial）
  | 'GRA';  // 文結合（because/which/although で2文を1文に）

export interface FillInQuestion {
  id: string;
  attempt_id: string;
  question_type: FillInQuestionType;
  question_text: string; // 問題文（穴埋め箇所あり）
  options: FillInOption[]; // 4択
  correct_answer: string; // 正解のID
  user_answer?: string;
  is_correct?: boolean;
}

export interface FillInOption {
  id: string; // "A", "B", "C", "D"
  text: string;
}

// ==================== Speakingプロンプト型 ====================
export interface SpeakingPrompt {
  id: string;
  task_id: string;
  attempt_id?: string;
  summary_prompt: string; // 2分要約プロンプト
  follow_up_questions: FollowUpQuestion[]; // 5問
  required_vocab: RequiredVocab[]; // 3〜5語
  created_at: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
}

// ==================== 単語学習型 ====================
export interface VocabQuestion {
  id: string;
  vocab_id: string;
  question_type: 'en_to_ja' | 'ja_to_en' | 'context' | 'collocation';
  question: string;
  options: VocabOption[]; // 4択
  correct_answer: string;
}

export interface VocabOption {
  id: string; // "A", "B", "C", "D"
  text: string;
}

export interface VocabSession {
  id: string;
  user_id: string;
  session_date: string; // YYYY-MM-DD
  questions: VocabQuestion[];
  answers: VocabAnswer[];
  score?: number; // 正答数
}

export interface VocabAnswer {
  question_id: string;
  user_answer: string;
  is_correct: boolean;
}

// ==================== 進捗型 ====================
export interface ProgressSummary {
  total_attempts: number;
  latest_band_estimate: string; // "6.0-6.5"
  weakness_tags: ('TR' | 'CC' | 'LR' | 'GRA')[]; // 上位1〜2
  average_band?: string;
}

export interface AttemptHistory {
  id: string;
  task_id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  band_estimate: string;
  weakness_tags: ('TR' | 'CC' | 'LR' | 'GRA')[];
  completed_at: string;
}

export interface WeaknessTrend {
  date: string; // YYYY-MM-DD
  weakness_tags: ('TR' | 'CC' | 'LR' | 'GRA')[];
  band_estimate: string;
}

// ==================== 今日の状態型 ====================
export interface DailyState {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  recommended_task_id?: string;
  required_vocab: RequiredVocab[]; // 今日の必須語彙
  weakness_tags: ('TR' | 'CC' | 'LR' | 'GRA')[]; // 上位1〜2
  latest_band_estimate?: string;
  created_at: string;
  updated_at: string;
}

// ==================== ユーザープロファイル型 ====================
export interface Profile {
  id: string;
  email: string;
  initial_level: 'beginner' | 'intermediate' | 'advanced';
  current_level?: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

// ==================== LLMレスポンス型 ====================
export interface LLMResponse {
  schema_version: string; // "1.0"
  [key: string]: unknown;
}

export interface TaskGenerationResponse extends LLMResponse {
  level: 'beginner' | 'intermediate' | 'advanced';
  question_type?: 'Task 1' | 'Task 2';
  question: string;
  required_vocab: RequiredVocab[];
  prep_guide?: PrepGuide;
}

export interface FeedbackGenerationResponse extends LLMResponse, Feedback {
  // Feedback型を継承
}

export interface SpeakingPromptGenerationResponse extends LLMResponse {
  summary_prompt: string;
  follow_up_questions: FollowUpQuestion[];
  required_vocab: RequiredVocab[];
}

