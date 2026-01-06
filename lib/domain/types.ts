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
  task_type?: 'Task 1' | 'Task 2'; // Task 1 Step Learning用
  mode?: 'training' | 'exam'; // Task 1 Step Learning用
  level: 'beginner' | 'intermediate' | 'advanced';
  draft_content: DraftContent;
  step_state?: Task1StepState; // Task 1 Step Learning用
  review_state?: Task1ReviewState; // Task 1 Step Learning用
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

// ==================== Task 1 Step Learning型 ====================
export interface Task1StepState {
  step1?: string; // グラフは何を示しているか
  step2?: string; // 大まかな特徴（Overview）
  step3?: string; // 特徴1
  step4?: string; // 特徴2
  step5?: string; // 特徴3
  step6?: string; // 統合回答
  step1_fixed?: string; // レビュー反映後
  step2_fixed?: string;
  step3_fixed?: string;
  step4_fixed?: string;
  step5_fixed?: string;
  observations?: Task1Observation[]; // 図表上の観察メモ（付箋）
  key_numbers?: Task1KeyNumber[]; // 登録した数字
  checklist?: Task1Checklist; // チェックリスト状態
  timers?: Task1Timers; // Exam用タイマー
}

export interface Task1Observation {
  id: string;
  x: number; // 画像上のX座標（0-100%）
  y: number; // 画像上のY座標（0-100%）
  text: string;
  tags?: string[]; // 任意のタグ
}

export interface Task1KeyNumber {
  value: number | string; // 数値または文字列（例: "50%"）
  unit?: string; // 単位（例: "million", "%", "years"）
  context: string; // 文脈（例: "Population in 2020"）
}

export interface Task1Checklist {
  has_overview?: boolean; // Overviewがあるか
  has_comparison?: boolean; // 比較表現があるか
  has_numbers?: boolean; // 数字の根拠があるか
  has_paragraphs?: boolean; // 段落があるか
  word_count_ok?: boolean; // 語数が適切か（150-200語）
  tense_consistent?: boolean; // 時制が一貫しているか
  [key: string]: boolean | undefined; // その他のチェック項目
}

export interface Task1Timers {
  step1_start?: string; // ISO 8601
  step2_start?: string;
  step3_start?: string;
  step4_start?: string;
  step5_start?: string;
  step6_start?: string;
  total_elapsed?: number; // 秒
}

export interface Task1ReviewState {
  step_review?: {
    status: 'pending' | 'completed' | 'error';
    feedback_payload?: Task1StepReviewFeedback;
    updated_at?: string;
  };
  final_review?: {
    status: 'pending' | 'completed' | 'error';
    feedback_payload?: Task1FinalReviewFeedback;
    updated_at?: string;
  };
}

export interface Task1StepReviewFeedback {
  schema_version: string;
  step_feedbacks: Array<{
    step_index: 1 | 2 | 3 | 4 | 5;
    is_valid: boolean;
    issues: Array<{
      category: 'TR' | 'CC' | 'LR' | 'GRA' | 'structure' | 'content';
      description: string;
      suggestion: string;
      example_before?: string;
      example_after?: string;
    }>;
    strengths?: string[];
  }>;
  top_priority_fix: {
    step_index: 1 | 2 | 3 | 4 | 5;
    issue: string;
    fix_guidance: string;
  };
  number_validation?: {
    extracted_numbers: Array<{ value: string; context: string }>;
    registered_numbers: Array<{ value: string; context: string }>;
    mismatches: Array<{ extracted: string; registered?: string }>;
  };
}

export interface Task1FinalReviewFeedback {
  schema_version: string;
  overall_band_range: string;
  dimensions: DimensionFeedback[];
  strengths: Strength[];
  band_up_actions: BandUpAction[];
  rewrite_targets: RewriteTarget[];
  vocab_suggestions: VocabSuggestion[];
  sentence_highlights: Array<{
    sentence_index: number;
    sentence_text: string;
    tags: Array<'TR' | 'CC' | 'LR' | 'GRA'>;
    comment: string;
    suggested_rewrite?: string;
  }>;
  number_validation?: {
    extracted_numbers: Array<{ value: string; context: string }>;
    registered_numbers: Array<{ value: string; context: string }>;
    mismatches: Array<{ extracted: string; registered?: string }>;
    has_mismatch: boolean;
  };
  metadata: FeedbackMetadata;
}

// ==================== User Skill Stats型 ====================
export interface UserSkillStats {
  user_id: string;
  counters: {
    overview_missing?: number;
    comparison_missing?: number;
    tense_inconsistent?: number;
    article_errors?: number;
    number_mismatch?: number;
    [key: string]: number | undefined;
  };
  updated_at: string;
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

// ==================== Speaking関連型 ====================

export interface SpeakingSession {
  id: string;
  user_id: string;
  mode: 'drill' | 'mock';
  part?: 'part1' | 'part2' | 'part3';
  topic?: string;
  level?: 'B1' | 'B2' | 'C1';
  started_at: string;
  completed_at?: string;
  total_questions: number;
  average_band?: number;
  created_at: string;
}

export interface SpeakingPrompt {
  id: string;
  session_id?: string;
  mode: 'drill' | 'mock';
  part?: 'part1' | 'part2' | 'part3';
  topic?: string;
  level?: 'B1' | 'B2' | 'C1';
  jp_intent: string;
  expected_style?: string;
  target_points?: {
    vocabulary?: string[];
    grammar?: string[];
    discourse?: string[];
  };
  model_answer: string;
  paraphrases: string[];
  cue_card?: {
    topic: string;
    points: string[];
  };
  followup_question?: string;
  time_limit: number;
  created_at: string;
}

export interface SpeakingAttempt {
  id: string;
  user_id: string;
  session_id: string;
  prompt_id: string;
  user_response: string;
  audio_url?: string;
  response_time?: number;
  word_count?: number;
  wpm?: number;
  filler_count: number;
  long_pause_count: number;
  submitted_at: string;
  created_at: string;
}

export interface SpeakingFeedback {
  id: string;
  attempt_id: string;
  fluency_band: number;
  lexical_band: number;
  grammar_band: number;
  pronunciation_band: number;
  overall_band: number;
  evidence: {
    fluency: string;
    lexical: string;
    grammar: string;
    pronunciation: string;
  };
  top_fixes: Array<{
    priority: 1 | 2 | 3;
    dimension: 'fluency' | 'lexical' | 'grammar' | 'pronunciation';
    issue: string;
    suggestion: string;
  }>;
  rewrite: string;
  micro_drills: Array<{
    jp_intent: string;
    model_answer: string;
  }>;
  weakness_tags: string[];
  created_at: string;
}

export interface SpeakingReview {
  id: string;
  user_id: string;
  attempt_id: string;
  weakness_tags: string[];
  review_due_date: string; // YYYY-MM-DD
  review_count: number;
  is_favorite: boolean;
  user_notes?: string;
  status: 'pending' | 'reviewed' | 'mastered' | 'skipped';
  created_at: string;
  updated_at: string;
}

// LLMレスポンス型（瞬間英作文用）
export interface InstantSpeakingPromptResponse extends LLMResponse {
  jp_intent: string;
  expected_style: 'casual' | 'formal' | 'polite';
  target_points: {
    vocabulary?: string[];
    grammar?: string[];
    discourse?: string[];
  };
  model_answer: string;
  paraphrases: string[];
  cue_card?: {
    topic: string;
    points: string[];
  };
  followup_question?: string;
  time_limit: number;
}

export interface SpeakingEvaluationResponse extends LLMResponse {
  band_estimates: {
    fluency: number;
    lexical: number;
    grammar: number;
    pronunciation: number;
    overall: number;
  };
  evidence: {
    fluency: string;
    lexical: string;
    grammar: string;
    pronunciation: string;
  };
  top_fixes: Array<{
    priority: 1 | 2 | 3;
    dimension: 'fluency' | 'lexical' | 'grammar' | 'pronunciation';
    issue: string;
    suggestion: string;
  }>;
  rewrite: string;
  micro_drills: Array<{
    jp_intent: string;
    model_answer: string;
  }>;
  weakness_tags: string[];
}

// FollowUpQuestion型（既存のWriting→Speaking変換で使用）
export interface FollowUpQuestion {
  question: string;
  context?: string;
}

export interface SpeakingPromptGenerationResponse extends LLMResponse {
  summary_prompt: string;
  follow_up_questions: FollowUpQuestion[];
  required_vocab: RequiredVocab[];
}

