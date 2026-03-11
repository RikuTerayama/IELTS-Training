/**
 * Listening Idiom v1 – types and categories
 * Phrasal verbs, conversational chunks, clarification, agreement, booking, spoken paraphrase
 */

export const LISTENING_IDIOM_CATEGORIES = [
  'idiom_listening_phrasal_verbs',
  'idiom_listening_conversational_chunks',
  'idiom_listening_clarification_repair',
  'idiom_listening_agreement_hesitation',
  'idiom_listening_booking_service',
  'idiom_listening_spoken_paraphrase',
] as const;
export type ListeningIdiomCategory = (typeof LISTENING_IDIOM_CATEGORIES)[number];

export const LISTENING_IDIOM_CATEGORY_LABELS: Record<ListeningIdiomCategory, string> = {
  idiom_listening_phrasal_verbs: 'Phrasal verbs',
  idiom_listening_conversational_chunks: 'Conversational chunks',
  idiom_listening_clarification_repair: 'Clarification / repair',
  idiom_listening_agreement_hesitation: 'Agreement / hesitation',
  idiom_listening_booking_service: 'Booking / service language',
  idiom_listening_spoken_paraphrase: 'Spoken paraphrase',
};

export interface ListeningIdiomMeta {
  explanation: string;
  transcript_excerpt?: string;
  speaker_type?: string;
  distractor_note?: string;
  paraphrase_tip?: string;
}

export interface ListeningIdiomSeed {
  category: ListeningIdiomCategory;
  mode: 'click';
  prompt: string;
  correct_expression: string;
  choices: string[];
  passage_excerpt?: string;
  strategy?: string;
  meta: ListeningIdiomMeta;
}
