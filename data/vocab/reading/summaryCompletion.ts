/**
 * Summary Completion – one word from the passage
 * 20+ questions, topic/difficulty distributed
 */

import type { ReadingQuestionSeed } from './types';
import { CATEGORY_BY_TYPE } from './types';

const C = CATEGORY_BY_TYPE.summary_completion;

export const SUMMARY_COMPLETION_SEED: ReadingQuestionSeed[] = [
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary. Use ONE WORD from the passage.',
    correct_expression: 'renewable',
    hint_first_char: 'R',
    hint_length: 9,
    passage_excerpt:
      'In recent years, there has been a growing focus on renewable energy sources such as solar and wind power. Governments worldwide are investing in clean technology to reduce carbon emissions.',
    strategy: 'The gap describes the type of energy. Find the adjective before "energy".',
    meta: { topic: 'environment', difficulty: 'beginner' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary with ONE WORD from the passage.',
    correct_expression: 'biodiversity',
    hint_first_char: 'B',
    hint_length: 11,
    passage_excerpt:
      'The rainforest is home to an enormous variety of plant and animal species. This biodiversity is under threat from deforestation and climate change.',
    strategy: 'The summary gap needs a noun meaning "variety of species".',
    meta: { topic: 'environment', difficulty: 'beginner' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap with ONE WORD from the passage.',
    correct_expression: 'consumption',
    hint_first_char: 'C',
    hint_length: 11,
    passage_excerpt:
      'Rising energy consumption has led to increased demand for fossil fuels. Many countries are now seeking alternative sources to meet their needs.',
    meta: { topic: 'science', difficulty: 'intermediate' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary. Use ONE WORD from the passage.',
    correct_expression: 'volunteers',
    hint_first_char: 'V',
    hint_length: 10,
    passage_excerpt:
      'The study relied on volunteers who agreed to participate without payment. Over 200 volunteers took part in the first phase of the research.',
    strategy: 'The gap refers to unpaid participants.',
    meta: { topic: 'health', difficulty: 'beginner' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap with ONE WORD from the passage.',
    correct_expression: 'habitats',
    hint_first_char: 'H',
    hint_length: 8,
    passage_excerpt:
      'Wildlife conservation efforts aim to protect natural habitats from destruction. Without suitable habitats, many species would face extinction.',
    meta: { topic: 'environment', difficulty: 'beginner' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary with ONE WORD from the passage.',
    correct_expression: 'curriculum',
    hint_first_char: 'C',
    hint_length: 9,
    passage_excerpt:
      'The new curriculum places greater emphasis on critical thinking and problem-solving. Schools have been given two years to implement the changes.',
    meta: { topic: 'education', difficulty: 'intermediate' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap. Use ONE WORD from the passage.',
    correct_expression: 'symptoms',
    hint_first_char: 'S',
    hint_length: 8,
    passage_excerpt:
      'Common symptoms include fever, headache, and fatigue. Anyone experiencing these symptoms for more than a few days should seek medical advice.',
    meta: { topic: 'health', difficulty: 'beginner' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary. Use ONE WORD from the passage.',
    correct_expression: 'hypothesis',
    hint_first_char: 'H',
    hint_length: 10,
    passage_excerpt:
      'The researchers began with the hypothesis that the treatment would reduce recovery time. The results of the trial supported this hypothesis.',
    meta: { topic: 'science', difficulty: 'intermediate' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap with ONE WORD from the passage.',
    correct_expression: 'innovation',
    hint_first_char: 'I',
    hint_length: 10,
    passage_excerpt:
      'The company has a strong record of innovation in digital services. Its latest product has been designed to meet the needs of small businesses.',
    meta: { topic: 'technology', difficulty: 'intermediate' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary with ONE WORD from the passage.',
    correct_expression: 'archaeologists',
    hint_first_char: 'A',
    hint_length: 13,
    passage_excerpt:
      'Archaeologists have uncovered the remains of a settlement dating back to 3000 BCE. The site is expected to provide new insights into early farming communities.',
    meta: { topic: 'history', difficulty: 'advanced' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap. Use ONE WORD from the passage.',
    correct_expression: 'emissions',
    hint_first_char: 'E',
    hint_length: 9,
    passage_excerpt:
      'The agreement sets targets for reducing greenhouse gas emissions. Countries are expected to submit updated plans every five years.',
    meta: { topic: 'environment', difficulty: 'intermediate' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary with ONE WORD from the passage.',
    correct_expression: 'tuition',
    hint_first_char: 'T',
    hint_length: 8,
    passage_excerpt:
      'Tuition fees have risen sharply in recent years. Many students rely on loans to cover the cost of their degree programmes.',
    meta: { topic: 'education', difficulty: 'intermediate' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap with ONE WORD from the passage.',
    correct_expression: 'vaccination',
    hint_first_char: 'V',
    hint_length: 11,
    passage_excerpt:
      'Vaccination has been one of the most effective ways to prevent infectious disease. Health authorities recommend that children receive a full schedule of vaccines.',
    meta: { topic: 'health', difficulty: 'intermediate' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary. Use ONE WORD from the passage.',
    correct_expression: 'sample',
    hint_first_char: 'S',
    hint_length: 6,
    passage_excerpt:
      'The study used a sample of 1,000 adults selected at random from the electoral register. The sample was designed to be representative of the population as a whole.',
    meta: { topic: 'science', difficulty: 'intermediate' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap with ONE WORD from the passage.',
    correct_expression: 'algorithm',
    hint_first_char: 'A',
    hint_length: 9,
    passage_excerpt:
      'The algorithm analyses data from millions of transactions to detect unusual patterns. It has been trained to identify potential fraud with a high degree of accuracy.',
    meta: { topic: 'technology', difficulty: 'advanced' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary with ONE WORD from the passage.',
    correct_expression: 'excavation',
    hint_first_char: 'E',
    hint_length: 11,
    passage_excerpt:
      'The excavation has revealed a series of walls and foundations. Work is expected to continue for at least another two years.',
    meta: { topic: 'history', difficulty: 'advanced' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap. Use ONE WORD from the passage.',
    correct_expression: 'deforestation',
    hint_first_char: 'D',
    hint_length: 13,
    passage_excerpt:
      'Deforestation is a major cause of habitat loss and climate change. Efforts to slow the rate of deforestation have had mixed success.',
    meta: { topic: 'environment', difficulty: 'advanced' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary with ONE WORD from the passage.',
    correct_expression: 'assessment',
    hint_first_char: 'A',
    hint_length: 10,
    passage_excerpt:
      'Student assessment is based on a combination of coursework and final examinations. The weighting of each component varies from module to module.',
    meta: { topic: 'education', difficulty: 'intermediate' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap with ONE WORD from the passage.',
    correct_expression: 'diagnosis',
    hint_first_char: 'D',
    hint_length: 10,
    passage_excerpt:
      'Early diagnosis improves the chances of successful treatment. Patients are encouraged to report any unusual symptoms to their doctor without delay.',
    meta: { topic: 'health', difficulty: 'advanced' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary with ONE WORD from the passage.',
    correct_expression: 'experiment',
    hint_first_char: 'E',
    hint_length: 10,
    passage_excerpt:
      'The experiment was conducted under controlled conditions. Each participant was tested individually to ensure consistent results.',
    meta: { topic: 'science', difficulty: 'beginner' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Fill in the gap. Use ONE WORD from the passage.',
    correct_expression: 'encryption',
    hint_first_char: 'E',
    hint_length: 10,
    passage_excerpt:
      'Encryption is used to protect sensitive data from unauthorised access. Modern systems use algorithms that are extremely difficult to break.',
    meta: { topic: 'technology', difficulty: 'advanced' },
  },
  {
    question_type: 'summary_completion',
    category: C,
    mode: 'typing',
    prompt: 'Complete the summary with ONE WORD from the passage.',
    correct_expression: 'civilisation',
    hint_first_char: 'C',
    hint_length: 12,
    passage_excerpt:
      'The civilisation flourished for over 500 years before its decline. Its achievements in architecture and writing continue to be studied today.',
    meta: { topic: 'history', difficulty: 'intermediate' },
  },
];
