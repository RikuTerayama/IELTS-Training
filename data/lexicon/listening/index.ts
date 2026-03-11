/**
 * Listening Lexicon v1 – combined seed and validation
 */

export * from './types';
export { LECTURE_SIGNPOSTING_SEED } from './lectureSignposting';
export { EXPLANATION_EXAMPLE_SEED } from './explanationExample';
export { COMPARE_CONTRAST_SEED } from './compareContrast';
export { EMPHASIS_STANCE_SEED } from './emphasisStance';
export { PROCESS_SEQUENCE_SEED } from './processSequence';
export { SEMINAR_DISCUSSION_SEED } from './seminarDiscussion';

import { LECTURE_SIGNPOSTING_SEED } from './lectureSignposting';
import { EXPLANATION_EXAMPLE_SEED } from './explanationExample';
import { COMPARE_CONTRAST_SEED } from './compareContrast';
import { EMPHASIS_STANCE_SEED } from './emphasisStance';
import { PROCESS_SEQUENCE_SEED } from './processSequence';
import { SEMINAR_DISCUSSION_SEED } from './seminarDiscussion';
import type { ListeningLexiconSeed } from './types';

export const LISTENING_LEXICON_SEED: ListeningLexiconSeed[] = [
  ...LECTURE_SIGNPOSTING_SEED,
  ...EXPLANATION_EXAMPLE_SEED,
  ...COMPARE_CONTRAST_SEED,
  ...EMPHASIS_STANCE_SEED,
  ...PROCESS_SEQUENCE_SEED,
  ...SEMINAR_DISCUSSION_SEED,
];

export interface ListeningLexiconValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateListeningLexiconSeed(questions: ListeningLexiconSeed[]): ListeningLexiconValidationResult {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const prefix = `Question ${i + 1} (${q.category}):`;

    if (!q.category?.trim()) errors.push(`${prefix} missing category`);
    if (!q.mode || q.mode !== 'click') errors.push(`${prefix} mode must be "click"`);
    if (!q.prompt?.trim()) errors.push(`${prefix} missing prompt`);
    if (!q.correct_expression?.trim()) errors.push(`${prefix} missing correct_expression`);
    if (!q.meta?.explanation?.trim()) errors.push(`${prefix} meta.explanation is required`);

    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      errors.push(`${prefix} at least 2 choices required`);
    } else if (!q.choices.includes(q.correct_expression)) {
      errors.push(`${prefix} correct_expression must be one of the choices`);
    }

    const key = `${q.category}|${q.prompt.slice(0, 60)}|${q.correct_expression}`;
    if (seen.has(key)) errors.push(`${prefix} duplicate (category, prompt, answer)`);
    seen.add(key);
  }

  return { ok: errors.length === 0, errors };
}
