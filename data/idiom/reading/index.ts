/**
 * Reading Idiom v1 – combined seed and validation
 * IELTS Academic Reading で頻出する multi-word units / phrase patterns
 */

export * from './types';
export { CAUSE_REASON_SEED } from './causeReason';
export { CONTRAST_CONCESSION_SEED } from './contrastConcession';
export { DEFINITION_REFERENCE_SEED } from './definitionReference';
export { EVIDENCE_CLAIM_SEED } from './evidenceClaim';
export { QUANTITY_TREND_SEED } from './quantityTrend';
export { PROCESS_RELATION_SEED } from './processRelation';

import { CAUSE_REASON_SEED } from './causeReason';
import { CONTRAST_CONCESSION_SEED } from './contrastConcession';
import { DEFINITION_REFERENCE_SEED } from './definitionReference';
import { EVIDENCE_CLAIM_SEED } from './evidenceClaim';
import { QUANTITY_TREND_SEED } from './quantityTrend';
import { PROCESS_RELATION_SEED } from './processRelation';
import type { ReadingIdiomSeed } from './types';

export const READING_IDIOM_SEED: ReadingIdiomSeed[] = [
  ...CAUSE_REASON_SEED,
  ...CONTRAST_CONCESSION_SEED,
  ...DEFINITION_REFERENCE_SEED,
  ...EVIDENCE_CLAIM_SEED,
  ...QUANTITY_TREND_SEED,
  ...PROCESS_RELATION_SEED,
];

export interface ReadingIdiomValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateReadingIdiomSeed(questions: ReadingIdiomSeed[]): ReadingIdiomValidationResult {
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
