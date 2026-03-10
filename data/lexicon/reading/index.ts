/**
 * Reading Lexicon (Academic Reading Signal Bank) – combined seed
 */

import { CAUSE_EFFECT_SEED } from './causeEffect';
import { CONTRAST_CONCESSION_SEED } from './contrastConcession';
import { DEFINITION_CLASSIFICATION_SEED } from './definitionClassification';
import { EVIDENCE_CLAIM_SEED } from './evidenceClaim';
import { PROCESS_SEQUENCE_SEED } from './processSequence';
import { TREND_CHANGE_SEED } from './trendChange';
import type { ReadingLexiconSeed } from './types';

export * from './types';
export { CAUSE_EFFECT_SEED } from './causeEffect';
export { CONTRAST_CONCESSION_SEED } from './contrastConcession';
export { DEFINITION_CLASSIFICATION_SEED } from './definitionClassification';
export { EVIDENCE_CLAIM_SEED } from './evidenceClaim';
export { PROCESS_SEQUENCE_SEED } from './processSequence';
export { TREND_CHANGE_SEED } from './trendChange';

export const READING_LEXICON_SEED: ReadingLexiconSeed[] = [
  ...CAUSE_EFFECT_SEED,
  ...CONTRAST_CONCESSION_SEED,
  ...DEFINITION_CLASSIFICATION_SEED,
  ...EVIDENCE_CLAIM_SEED,
  ...PROCESS_SEQUENCE_SEED,
  ...TREND_CHANGE_SEED,
];

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateReadingLexiconSeed(questions: ReadingLexiconSeed[]): ValidationResult {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const prefix = `Question ${i + 1} (${q.category}):`;

    if (!q.prompt?.trim()) errors.push(`${prefix} missing prompt`);
    if (!q.correct_expression?.trim()) errors.push(`${prefix} missing correct_expression`);
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
    if (seen.has(key)) errors.push(`${prefix} duplicate`);
    seen.add(key);
  }

  return { ok: errors.length === 0, errors };
}
