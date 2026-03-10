/**
 * Listening Vocab v1 – combined seed and validation
 */

import { FORM_NOTE_COMPLETION_SEED } from './formNoteCompletion';
import { CAMPUS_DAILY_LIFE_SEED } from './campusDailyLife';
import { LECTURE_VOCABULARY_SEED } from './lectureVocabulary';
import { NUMBERS_DATES_SPELLING_SEED } from './numbersDatesSpelling';
import { SPOKEN_DISTRACTORS_SEED } from './spokenDistractors';
import { PARAPHRASE_IN_CONVERSATION_SEED } from './paraphraseInConversation';
import type { ListeningQuestionSeed } from './types';

export * from './types';
export { FORM_NOTE_COMPLETION_SEED } from './formNoteCompletion';
export { CAMPUS_DAILY_LIFE_SEED } from './campusDailyLife';
export { LECTURE_VOCABULARY_SEED } from './lectureVocabulary';
export { NUMBERS_DATES_SPELLING_SEED } from './numbersDatesSpelling';
export { SPOKEN_DISTRACTORS_SEED } from './spokenDistractors';
export { PARAPHRASE_IN_CONVERSATION_SEED } from './paraphraseInConversation';

export const LISTENING_VOCAB_SEED: ListeningQuestionSeed[] = [
  ...FORM_NOTE_COMPLETION_SEED,
  ...CAMPUS_DAILY_LIFE_SEED,
  ...LECTURE_VOCABULARY_SEED,
  ...NUMBERS_DATES_SPELLING_SEED,
  ...SPOKEN_DISTRACTORS_SEED,
  ...PARAPHRASE_IN_CONVERSATION_SEED,
];

export interface ListeningValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateListeningSeed(questions: ListeningQuestionSeed[]): ListeningValidationResult {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const prefix = `Question ${i + 1} (${q.question_type}):`;

    if (!q.prompt?.trim()) errors.push(`${prefix} missing prompt`);
    if (!q.correct_expression?.trim()) errors.push(`${prefix} missing correct_expression`);
    if (!q.passage_excerpt?.trim()) errors.push(`${prefix} missing passage_excerpt`);
    if (!q.category?.trim()) errors.push(`${prefix} missing category`);
    if (!q.mode || !['click', 'typing'].includes(q.mode)) errors.push(`${prefix} invalid mode`);

    if (q.mode === 'click') {
      if (!Array.isArray(q.choices) || q.choices.length < 2) {
        errors.push(`${prefix} click mode requires at least 2 choices`);
      }
      if (q.choices && !q.choices.includes(q.correct_expression)) {
        errors.push(`${prefix} correct_expression must be one of the choices`);
      }
    }

    if (q.mode === 'typing' && (q.hint_first_char == null || q.hint_length == null)) {
      errors.push(`${prefix} typing mode should have hint_first_char and hint_length`);
    }

    const key = `${q.category}|${q.mode}|${q.prompt.slice(0, 50)}|${q.correct_expression}`;
    if (seen.has(key)) errors.push(`${prefix} duplicate (same category, mode, prompt, answer)`);
    seen.add(key);
  }

  return { ok: errors.length === 0, errors };
}
