/**
 * Reading Academic v1 – shared types and constants
 */

export type ReadingQuestionType =
  | 'paraphrase_drill'
  | 'matching_headings'
  | 'tfng'
  | 'summary_completion'
  | 'matching_information'
  | 'sentence_completion';

export const READING_TOPICS = [
  'education',
  'environment',
  'science',
  'health',
  'technology',
  'history',
] as const;
export type ReadingTopic = (typeof READING_TOPICS)[number];

export const READING_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;
export type ReadingDifficulty = (typeof READING_DIFFICULTIES)[number];

/** Skill / weakness tag for weakness-aware review */
export const READING_SKILLS = [
  'paraphrase',
  'skimming',
  'scanning',
  'detail',
  'inference',
  'not_given_confusion',
] as const;
export type ReadingSkill = (typeof READING_SKILLS)[number];

export const READING_SKILL_LABELS: Record<ReadingSkill, string> = {
  paraphrase: 'Paraphrase',
  skimming: 'Skimming',
  scanning: 'Scanning',
  detail: 'Detail',
  inference: 'Inference',
  not_given_confusion: 'Not Given',
};

export interface ReadingQuestionMeta {
  topic?: ReadingTopic;
  difficulty?: ReadingDifficulty;
  /** Optional: rationale / why the answer is correct */
  explanation?: string;
  /** Optional: common distractor or pitfall */
  distractor_note?: string;
  /** Optional: useful paraphrase to learn */
  paraphrase_tip?: string;
  /** Optional: group id for passage-based mini sets (same passage = same id) */
  passage_group?: string;
  /** Optional: skill/weakness for progress and review */
  reading_skill?: ReadingSkill;
}

export interface ReadingQuestionSeed {
  question_type: ReadingQuestionType;
  category: string;
  mode: 'click' | 'typing';
  prompt: string;
  correct_expression: string;
  choices?: string[];
  hint_first_char?: string;
  hint_length?: number;
  passage_excerpt: string;
  strategy?: string;
  meta?: ReadingQuestionMeta;
}

export const CATEGORY_BY_TYPE: Record<ReadingQuestionType, string> = {
  paraphrase_drill: 'vocab_reading_paraphrase_drill',
  matching_headings: 'vocab_reading_matching_headings',
  tfng: 'vocab_reading_tfng',
  summary_completion: 'vocab_reading_summary_completion',
  matching_information: 'vocab_reading_matching_information',
  sentence_completion: 'vocab_reading_sentence_completion',
};
