/**
 * Reading Lexicon (Academic Reading Signal Bank) – types and categories
 */

export const READING_LEXICON_CATEGORIES = [
  'reading_lexicon_cause_effect',
  'reading_lexicon_contrast_concession',
  'reading_lexicon_definition_classification',
  'reading_lexicon_evidence_claim',
  'reading_lexicon_process_sequence',
  'reading_lexicon_trend_change',
] as const;
export type ReadingLexiconCategory = (typeof READING_LEXICON_CATEGORIES)[number];

export const READING_LEXICON_CATEGORY_LABELS: Record<ReadingLexiconCategory, string> = {
  reading_lexicon_cause_effect: 'Cause / Effect',
  reading_lexicon_contrast_concession: 'Contrast / Concession',
  reading_lexicon_definition_classification: 'Definition / Classification',
  reading_lexicon_evidence_claim: 'Evidence / Claim',
  reading_lexicon_process_sequence: 'Process / Sequence',
  reading_lexicon_trend_change: 'Trend / Change',
};

export interface ReadingLexiconMeta {
  explanation?: string;
  usage_note?: string;
}

export interface ReadingLexiconSeed {
  category: ReadingLexiconCategory;
  mode: 'click' | 'typing';
  prompt: string;
  correct_expression: string;
  choices?: string[];
  hint_first_char?: string;
  hint_length?: number;
  passage_excerpt?: string;
  strategy?: string;
  meta?: ReadingLexiconMeta;
}
