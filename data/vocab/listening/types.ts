/**
 * Listening Vocab v1 – types and categories
 * IELTS Listening: form/note, campus, lecture, numbers/spelling, distractors, paraphrase
 */

export const LISTENING_VOCAB_CATEGORIES = [
  'vocab_listening_form_note',
  'vocab_listening_campus_daily',
  'vocab_listening_lecture',
  'vocab_listening_numbers_dates_spelling',
  'vocab_listening_spoken_distractors',
  'vocab_listening_paraphrase_conversation',
] as const;
export type ListeningVocabCategory = (typeof LISTENING_VOCAB_CATEGORIES)[number];

export const LISTENING_VOCAB_CATEGORY_LABELS: Record<ListeningVocabCategory, string> = {
  vocab_listening_form_note: 'Form / note completion',
  vocab_listening_campus_daily: 'Campus / daily life',
  vocab_listening_lecture: 'Lecture vocabulary',
  vocab_listening_numbers_dates_spelling: 'Numbers / dates / spelling',
  vocab_listening_spoken_distractors: 'Spoken distractors',
  vocab_listening_paraphrase_conversation: 'Paraphrase in conversation',
};

export type ListeningQuestionType =
  | 'form_note_completion'
  | 'campus_daily_life'
  | 'lecture_vocabulary'
  | 'numbers_dates_spelling'
  | 'spoken_distractors'
  | 'paraphrase_in_conversation';

export interface ListeningQuestionMeta {
  /** Why the answer is correct / tip for listening */
  explanation?: string;
  /** Short transcript snippet (for future audio clip placement) */
  transcript_excerpt?: string;
  /** e.g. 'student', 'receptionist', 'lecturer' for future audio */
  speaker_type?: string;
}

export interface ListeningQuestionSeed {
  question_type: ListeningQuestionType;
  category: string;
  mode: 'click' | 'typing';
  prompt: string;
  correct_expression: string;
  choices?: string[];
  hint_first_char?: string;
  hint_length?: number;
  /** Context sentence or mini transcript (text-first; audio later) */
  passage_excerpt: string;
  strategy?: string;
  meta?: ListeningQuestionMeta;
}

export const CATEGORY_BY_TYPE: Record<ListeningQuestionType, string> = {
  form_note_completion: 'vocab_listening_form_note',
  campus_daily_life: 'vocab_listening_campus_daily',
  lecture_vocabulary: 'vocab_listening_lecture',
  numbers_dates_spelling: 'vocab_listening_numbers_dates_spelling',
  spoken_distractors: 'vocab_listening_spoken_distractors',
  paraphrase_in_conversation: 'vocab_listening_paraphrase_conversation',
};
