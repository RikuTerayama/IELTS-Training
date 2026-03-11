/**
 * Reading Idiom v1 – types and categories
 * IELTS Academic Reading で頻出する multi-word units / phrase patterns
 */

export const READING_IDIOM_CATEGORIES = [
  'idiom_reading_cause_reason',
  'idiom_reading_contrast_concession',
  'idiom_reading_definition_reference',
  'idiom_reading_evidence_claim',
  'idiom_reading_quantity_trend',
  'idiom_reading_process_relation',
] as const;
export type ReadingIdiomCategory = (typeof READING_IDIOM_CATEGORIES)[number];

export const READING_IDIOM_CATEGORY_LABELS: Record<ReadingIdiomCategory, string> = {
  idiom_reading_cause_reason: 'Cause / reason phrases',
  idiom_reading_contrast_concession: 'Contrast / concession phrases',
  idiom_reading_definition_reference: 'Definition / reference phrases',
  idiom_reading_evidence_claim: 'Evidence / claim phrases',
  idiom_reading_quantity_trend: 'Quantity / trend phrases',
  idiom_reading_process_relation: 'Process / relation phrases',
};

export interface ReadingIdiomMeta {
  explanation: string;
  usage_note?: string;
  distractor_note?: string;
  paraphrase_tip?: string;
  passage_excerpt?: string;
}

export interface ReadingIdiomSeed {
  category: ReadingIdiomCategory;
  mode: 'click';
  prompt: string;
  correct_expression: string;
  choices: string[];
  passage_excerpt?: string;
  strategy?: string;
  meta: ReadingIdiomMeta;
}
