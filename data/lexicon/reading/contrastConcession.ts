/**
 * Contrast / Concession – signal phrases
 */

import type { ReadingLexiconSeed } from './types';

const C = 'reading_lexicon_contrast_concession' as const;

export const CONTRAST_CONCESSION_SEED: ReadingLexiconSeed[] = [
  {
    category: C,
    mode: 'click',
    prompt: '_____ previous studies, this one used a larger sample.',
    correct_expression: 'Unlike',
    choices: ['Unlike', 'Like', 'Despite', 'Because of'],
    meta: {
      explanation: '"Unlike" signals contrast between two things.',
      usage_note: 'Unlike X = X とは異なり。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the difficulties, the team completed the project on time.',
    correct_expression: 'Despite',
    choices: ['Despite', 'Because', 'Regarding', 'Concerning'],
    meta: {
      explanation: '"Despite" introduces a concession: something that might have prevented the outcome but did not.',
      usage_note: 'Despite X = X にもかかわらず。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The first method was effective; _____, the second was not.',
    correct_expression: 'in contrast',
    choices: ['in contrast', 'for example', 'as a result', 'in addition'],
    meta: {
      explanation: '"In contrast" signals a difference or opposite between two statements.',
      usage_note: 'in contrast = 対照的に・一方。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the fact that funding was limited, results were strong.',
    correct_expression: 'Although',
    choices: ['Although', 'Therefore', 'Moreover', 'Specifically'],
    meta: {
      explanation: '"Although" introduces a concession followed by a contrasting main clause.',
      usage_note: 'Although X = X であるが（譲歩）。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Some species flourished _____ others declined.',
    correct_expression: 'whereas',
    choices: ['whereas', 'because', 'when', 'if'],
    meta: {
      explanation: '"Whereas" links two contrasting clauses.',
      usage_note: 'X whereas Y = X であるのに対し Y。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ widespread criticism, the policy remained in place.',
    correct_expression: 'In spite of',
    choices: ['In spite of', 'Thanks to', 'Due to', 'According to'],
    meta: {
      explanation: '"In spite of" introduces a concession (similar to "despite").',
      usage_note: 'In spite of X = X にもかかわらず。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The data was inconclusive. _____, the researchers recommended further study.',
    correct_expression: 'Nevertheless',
    choices: ['Nevertheless', 'Consequently', 'Similarly', 'Specifically'],
    meta: {
      explanation: '"Nevertheless" signals a contrast or concession: despite the previous statement, the following holds.',
      usage_note: 'nevertheless = それにもかかわらず。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ earlier findings, the new results show a different pattern.',
    correct_expression: 'In contrast to',
    choices: ['In contrast to', 'In line with', 'In favour of', 'In place of'],
    meta: {
      explanation: '"In contrast to" explicitly marks a difference between two things.',
      usage_note: 'In contrast to X = X とは対照的に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The theory is widely accepted _____ some disagreement remains.',
    correct_expression: 'even though',
    choices: ['even though', 'so that', 'as if', 'in case'],
    meta: {
      explanation: '"Even though" introduces a concession: a fact that might seem to contradict the main clause.',
      usage_note: 'even though X = X であるにもかかわらず。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the two approaches differ in method, they share the same goal.',
    correct_expression: 'While',
    choices: ['While', 'Because', 'Unless', 'Until'],
    meta: {
      explanation: '"While" can introduce a contrast (here: differing in method vs. same goal).',
      usage_note: 'While X = X である一方で。対照。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The outcome was positive _____ the initial setbacks.',
    correct_expression: 'despite',
    choices: ['despite', 'owing to', 'apart from', 'along with'],
    meta: {
      explanation: '"Despite" (after the clause) links the outcome to a concession.',
      usage_note: 'X despite Y = Y にもかかわらず X。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Region A saw growth; _____, Region B saw a decline.',
    correct_expression: 'by contrast',
    choices: ['by contrast', 'for instance', 'as a result', 'in fact'],
    meta: {
      explanation: '"By contrast" introduces a contrasting statement.',
      usage_note: 'by contrast = 対照的に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the lack of support, the project succeeded.',
    correct_expression: 'Notwithstanding',
    choices: ['Notwithstanding', 'Concerning', 'Including', 'Following'],
    meta: {
      explanation: '"Notwithstanding" is a formal way to express concession.',
      usage_note: 'Notwithstanding X = X にもかかわらず。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The first group improved. The second, _____, did not.',
    correct_expression: 'however',
    choices: ['however', 'therefore', 'moreover', 'instead'],
    meta: {
      explanation: '"However" signals a contrast with the previous sentence.',
      usage_note: 'however = しかしながら。文頭・文中で対比。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ traditional methods, the new approach is faster.',
    correct_expression: 'Unlike',
    choices: ['Unlike', 'Like', 'Besides', 'Within'],
    meta: {
      explanation: '"Unlike" marks a difference between the new approach and traditional methods.',
      usage_note: 'Unlike X = X と違って。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The results were disappointing. _____, they provided useful data.',
    correct_expression: 'Even so',
    choices: ['Even so', 'For example', 'In other words', 'As a result'],
    meta: {
      explanation: '"Even so" concedes the previous point but adds a contrasting positive.',
      usage_note: 'even so = それでも。譲歩の後の逆接。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ it was expensive, the device proved cost-effective in the long run.',
    correct_expression: 'Although',
    choices: ['Although', 'Because', 'When', 'If'],
    meta: {
      explanation: '"Although" introduces a concession (expensive) before the contrasting outcome (cost-effective).',
      usage_note: 'Although X = X だが。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The policy was unpopular _____ it was effective.',
    correct_expression: 'yet',
    choices: ['yet', 'and', 'so', 'or'],
    meta: {
      explanation: '"Yet" links two contrasting ideas (unpopular vs. effective).',
      usage_note: 'X yet Y = X だが Y。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ some researchers disagree, the consensus is clear.',
    correct_expression: 'While',
    choices: ['While', 'Because', 'Unless', 'Until'],
    meta: {
      explanation: '"While" concedes that some disagree, then contrasts with the consensus.',
      usage_note: 'While X = X ではあるが。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The data from 2020 was incomplete. _____, trends were identifiable.',
    correct_expression: 'Nevertheless',
    choices: ['Nevertheless', 'Consequently', 'Similarly', 'Hence'],
    meta: {
      explanation: '"Nevertheless" signals that despite the incompleteness, something could still be said.',
      usage_note: 'nevertheless = それにもかかわらず。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the risks, the benefits were judged to be greater.',
    correct_expression: 'Despite',
    choices: ['Despite', 'Given', 'Regarding', 'Concerning'],
    meta: {
      explanation: '"Despite" introduces the concession (risks) before the main point (benefits greater).',
      usage_note: 'Despite X = X にもかかわらず。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Older models performed well; the new model, _____, performed better.',
    correct_expression: 'by contrast',
    choices: ['by contrast', 'for example', 'in addition', 'as a result'],
    meta: {
      explanation: '"By contrast" highlights the difference (old well vs. new better).',
      usage_note: 'by contrast = 対照的に。',
    },
  },
];
