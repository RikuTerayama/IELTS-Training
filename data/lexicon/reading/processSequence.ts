/**
 * Process / Sequence – signal phrases
 */

import type { ReadingLexiconSeed } from './types';

const C = 'reading_lexicon_process_sequence' as const;

export const PROCESS_SEQUENCE_SEED: ReadingLexiconSeed[] = [
  {
    category: C,
    mode: 'click',
    prompt: '_____ the data was collected, it was analysed.',
    correct_expression: 'Once',
    choices: ['Once', 'Unless', 'Whereas', 'Although'],
    meta: {
      explanation: '"Once" introduces the first step; the main clause gives the next step.',
      usage_note: 'Once X = X した後で・一度 X すると。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The process _____ four main stages.',
    correct_expression: 'involves',
    choices: ['involves', 'avoids', 'reduces', 'rejects'],
    meta: {
      explanation: '"Involves" signals that a process includes certain steps or stages.',
      usage_note: 'X involves Y = X には Y が含まれる。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the sample was prepared, it was heated to 100°C.',
    correct_expression: 'First',
    choices: ['First', 'However', 'Therefore', 'Moreover'],
    meta: {
      explanation: '"First" marks the initial step in a sequence.',
      usage_note: 'First = まず・第一に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ , the mixture is stirred for five minutes.',
    correct_expression: 'Next',
    choices: ['Next', 'Instead', 'Thus', 'Hence'],
    meta: {
      explanation: '"Next" introduces the following step in a process.',
      usage_note: 'Next = 次に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The final _____ is to cool the product.',
    correct_expression: 'step',
    choices: ['step', 'cause', 'effect', 'claim'],
    meta: {
      explanation: '"Step" names one stage in a process.',
      usage_note: 'the final step = 最終段階。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ this, the solution is filtered.',
    correct_expression: 'Following',
    choices: ['Following', 'Preventing', 'Ignoring', 'Rejecting'],
    meta: {
      explanation: '"Following" indicates that one step comes after another.',
      usage_note: 'Following X = X の後に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The procedure _____ with a safety check.',
    correct_expression: 'begins',
    choices: ['begins', 'ends', 'avoids', 'delays'],
    meta: {
      explanation: '"Begins with" marks the start of a process or sequence.',
      usage_note: 'X begins with Y = X は Y で始まる。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the initial phase, the system enters a steady state.',
    correct_expression: 'After',
    choices: ['After', 'Before', 'Unless', 'Although'],
    meta: {
      explanation: '"After" indicates the order of steps (initial phase then steady state).',
      usage_note: 'After X = X の後に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ step, the temperature was recorded.',
    correct_expression: 'At each',
    choices: ['At each', 'For no', 'Without any', 'Instead of'],
    meta: {
      explanation: '"At each step" signals that something happens at every stage.',
      usage_note: 'At each step = 各段階で。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The sequence _____ with data collection and ends with analysis.',
    correct_expression: 'starts',
    choices: ['starts', 'avoids', 'reduces', 'rejects'],
    meta: {
      explanation: '"Starts with" marks the beginning of a sequence.',
      usage_note: 'X starts with Y = X は Y で始まる。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the preparation is complete, the experiment can begin.',
    correct_expression: 'Once',
    choices: ['Once', 'Unless', 'Whereas', 'Although'],
    meta: {
      explanation: '"Once" links a condition or completed step to the next action.',
      usage_note: 'Once X = X したら（完了後）。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ , the results are checked for errors.',
    correct_expression: 'Subsequently',
    choices: ['Subsequently', 'Previously', 'Nevertheless', 'Moreover'],
    meta: {
      explanation: '"Subsequently" indicates a step that follows in time.',
      usage_note: 'Subsequently = その後。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The first _____ is to define the problem.',
    correct_expression: 'stage',
    choices: ['stage', 'cause', 'effect', 'claim'],
    meta: {
      explanation: '"Stage" names a phase in a process.',
      usage_note: 'the first stage = 第一段階。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ this stage, the material is dried.',
    correct_expression: 'During',
    choices: ['During', 'Before', 'After', 'Without'],
    meta: {
      explanation: '"During" indicates that something happens within a step or period.',
      usage_note: 'During X = X の間に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The process _____ three distinct phases.',
    correct_expression: 'consists of',
    choices: ['consists of', 'depends on', 'leads to', 'results from'],
    meta: {
      explanation: '"Consists of" lists the components or stages of a process.',
      usage_note: 'X consists of Y = X は Y から成る。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the previous step, add the catalyst.',
    correct_expression: 'Following',
    choices: ['Following', 'Preventing', 'Ignoring', 'Rejecting'],
    meta: {
      explanation: '"Following" gives the order: do the previous step, then add the catalyst.',
      usage_note: 'Following X = X に続いて。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the mixture cools, crystals form.',
    correct_expression: 'As',
    choices: ['As', 'Although', 'Unless', 'Whereas'],
    meta: {
      explanation: '"As" links two simultaneous or sequential events in a process.',
      usage_note: 'As X = X するとともに・X の際に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The _____ step involves testing the product.',
    correct_expression: 'next',
    choices: ['next', 'last', 'only', 'same'],
    meta: {
      explanation: '"Next" (adjective) identifies the following step.',
      usage_note: 'the next step = 次の段階。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ , the solution is heated. Then it is cooled.',
    correct_expression: 'First',
    choices: ['First', 'However', 'Therefore', 'Moreover'],
    meta: {
      explanation: '"First" marks the first step; "then" the second.',
      usage_note: 'First... Then = まず…次に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The procedure _____ by repeating the cycle.',
    correct_expression: 'concludes',
    choices: ['concludes', 'begins', 'avoids', 'delays'],
    meta: {
      explanation: '"Concludes" signals the final step or end of a process.',
      usage_note: 'X concludes by Y = X は Y で終わる。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ to this, the data was validated.',
    correct_expression: 'Prior',
    choices: ['Prior', 'Due', 'According', 'Similar'],
    meta: {
      explanation: '"Prior to" means before (in sequence).',
      usage_note: 'Prior to X = X の前に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the second stage, the first must be completed.',
    correct_expression: 'Before',
    choices: ['Before', 'After', 'During', 'Without'],
    meta: {
      explanation: '"Before" establishes order: first stage then second.',
      usage_note: 'Before X = X の前に。',
    },
  },
];
