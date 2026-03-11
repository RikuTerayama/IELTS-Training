/**
 * Listening Lexicon v1 – types and categories
 * Lecture signposting, explanation/example, compare/contrast, emphasis, process/sequence, seminar discussion
 */

export const LISTENING_LEXICON_CATEGORIES = [
  'listening_lexicon_lecture_signposting',
  'listening_lexicon_explanation_example',
  'listening_lexicon_compare_contrast',
  'listening_lexicon_emphasis_stance',
  'listening_lexicon_process_sequence',
  'listening_lexicon_seminar_discussion',
] as const;
export type ListeningLexiconCategory = (typeof LISTENING_LEXICON_CATEGORIES)[number];

export const LISTENING_LEXICON_CATEGORY_LABELS: Record<ListeningLexiconCategory, string> = {
  listening_lexicon_lecture_signposting: 'Lecture signposting',
  listening_lexicon_explanation_example: 'Explanation / example markers',
  listening_lexicon_compare_contrast: 'Compare / contrast in speech',
  listening_lexicon_emphasis_stance: 'Emphasis / stance',
  listening_lexicon_process_sequence: 'Process / sequence in lectures',
  listening_lexicon_seminar_discussion: 'Seminar discussion signals',
};

export interface ListeningLexiconMeta {
  explanation: string;
  transcript_excerpt?: string;
  speaker_type?: string;
  usage_note?: string;
  distractor_note?: string;
}

export interface ListeningLexiconSeed {
  category: ListeningLexiconCategory;
  mode: 'click';
  prompt: string;
  correct_expression: string;
  choices: string[];
  passage_excerpt?: string;
  strategy?: string;
  meta: ListeningLexiconMeta;
}
