/**
 * Listening Idiom v1 – combined seed and validation
 */

export * from './types';
export { PHRASAL_VERBS_SEED } from './phrasalVerbs';
export { CONVERSATIONAL_CHUNKS_SEED } from './conversationalChunks';
export { CLARIFICATION_REPAIR_SEED } from './clarificationRepair';
export { AGREEMENT_HESITATION_SEED } from './agreementHesitation';
export { BOOKING_SERVICE_SEED } from './bookingService';
export { SPOKEN_PARAPHRASE_SEED } from './spokenParaphrase';

import { PHRASAL_VERBS_SEED } from './phrasalVerbs';
import { CONVERSATIONAL_CHUNKS_SEED } from './conversationalChunks';
import { CLARIFICATION_REPAIR_SEED } from './clarificationRepair';
import { AGREEMENT_HESITATION_SEED } from './agreementHesitation';
import { BOOKING_SERVICE_SEED } from './bookingService';
import { SPOKEN_PARAPHRASE_SEED } from './spokenParaphrase';
import type { ListeningIdiomSeed } from './types';

export const LISTENING_IDIOM_SEED: ListeningIdiomSeed[] = [
  ...PHRASAL_VERBS_SEED,
  ...CONVERSATIONAL_CHUNKS_SEED,
  ...CLARIFICATION_REPAIR_SEED,
  ...AGREEMENT_HESITATION_SEED,
  ...BOOKING_SERVICE_SEED,
  ...SPOKEN_PARAPHRASE_SEED,
];

export interface ListeningIdiomValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateListeningIdiomSeed(questions: ListeningIdiomSeed[]): ListeningIdiomValidationResult {
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
