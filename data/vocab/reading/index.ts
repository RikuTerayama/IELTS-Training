/**
 * Reading Academic v1 – combined seed and validation
 */

import { PARAPHRASE_DRILL_SEED } from './paraphraseDrill';
import { MATCHING_HEADINGS_SEED } from './matchingHeadings';
import { TFNG_SEED } from './tfng';
import { SUMMARY_COMPLETION_SEED } from './summaryCompletion';
import { MATCHING_INFORMATION_SEED } from './matchingInformation';
import { SENTENCE_COMPLETION_SEED } from './sentenceCompletion';
import type { ReadingQuestionSeed } from './types';
import type { ReadingQuestionType } from './types';
import { READING_TOPICS, READING_DIFFICULTIES, READING_SKILLS } from './types';
import type { ReadingSkill } from './types';

export * from './types';

/** Default reading_skill by question_type for weakness-aware stats */
function defaultReadingSkill(type: ReadingQuestionType): ReadingSkill {
  switch (type) {
    case 'paraphrase_drill':
      return 'paraphrase';
    case 'matching_headings':
      return 'skimming';
    case 'tfng':
      return 'not_given_confusion';
    case 'summary_completion':
    case 'matching_information':
      return 'scanning';
    case 'sentence_completion':
      return 'detail';
    default:
      return 'detail';
  }
}
export { PARAPHRASE_DRILL_SEED } from './paraphraseDrill';
export { MATCHING_HEADINGS_SEED } from './matchingHeadings';
export { TFNG_SEED } from './tfng';
export { SUMMARY_COMPLETION_SEED } from './summaryCompletion';
export { MATCHING_INFORMATION_SEED } from './matchingInformation';
export { SENTENCE_COMPLETION_SEED } from './sentenceCompletion';

const RAW_READING_SEED: ReadingQuestionSeed[] = [
  ...PARAPHRASE_DRILL_SEED,
  ...MATCHING_HEADINGS_SEED,
  ...TFNG_SEED,
  ...SUMMARY_COMPLETION_SEED,
  ...MATCHING_INFORMATION_SEED,
  ...SENTENCE_COMPLETION_SEED,
];

/** Combined seed with default reading_skill applied where missing */
export const READING_ACADEMIC_SEED: ReadingQuestionSeed[] = RAW_READING_SEED.map((q) => ({
  ...q,
  meta: {
    ...q.meta,
    reading_skill: q.meta?.reading_skill ?? defaultReadingSkill(q.question_type),
  },
}));

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

/**
 * Simple validation: required fields, choices count, duplicates, topic/difficulty
 */
export function validateReadingSeed(questions: ReadingQuestionSeed[]): ValidationResult {
  const errors: string[] = [];
  const seen = new Map<string, number>();

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
    const firstIndex = seen.get(key);
    if (firstIndex !== undefined) {
      errors.push(`${prefix} duplicate (same category, mode, prompt, answer) — already at question ${firstIndex + 1}`);
    } else {
      seen.set(key, i);
    }

    if (q.meta) {
      if (q.meta.topic && !READING_TOPICS.includes(q.meta.topic)) {
        errors.push(`${prefix} invalid meta.topic: ${q.meta.topic}`);
      }
      if (q.meta.difficulty && !READING_DIFFICULTIES.includes(q.meta.difficulty)) {
        errors.push(`${prefix} invalid meta.difficulty: ${q.meta.difficulty}`);
      }
      if (q.meta.reading_skill && !READING_SKILLS.includes(q.meta.reading_skill)) {
        errors.push(`${prefix} invalid meta.reading_skill: ${q.meta.reading_skill}`);
      }
    }
    // New/updated questions should have meta.explanation for quality
  }

  return { ok: errors.length === 0, errors };
}
