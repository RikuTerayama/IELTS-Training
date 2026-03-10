/**
 * Evidence / Claim – signal phrases
 */

import type { ReadingLexiconSeed } from './types';

const C = 'reading_lexicon_evidence_claim' as const;

export const EVIDENCE_CLAIM_SEED: ReadingLexiconSeed[] = [
  {
    category: C,
    mode: 'click',
    prompt: '_____ the latest research, the theory is well supported.',
    correct_expression: 'According to',
    choices: ['According to', 'Despite', 'Instead of', 'Apart from'],
    meta: {
      explanation: '"According to" introduces a source (evidence or authority) for a claim.',
      usage_note: 'According to X = X によると。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The data _____ the hypothesis.',
    correct_expression: 'supports',
    choices: ['supports', 'rejects', 'ignores', 'reduces'],
    meta: {
      explanation: '"Supports" signals that evidence backs a claim or hypothesis.',
      usage_note: 'X supports Y = X は Y を裏付ける。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ suggests that the policy has been effective.',
    correct_expression: 'Evidence',
    choices: ['Evidence', 'Doubt', 'Confusion', 'Delay'],
    meta: {
      explanation: '"Evidence" introduces or refers to data that supports a claim.',
      usage_note: 'Evidence suggests that = 証拠は～を示唆している。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Studies have _____ that the effect is significant.',
    correct_expression: 'shown',
    choices: ['shown', 'denied', 'avoided', 'delayed'],
    meta: {
      explanation: '"Shown" indicates that research has demonstrated a claim.',
      usage_note: 'studies have shown that = 研究により～であることが示されている。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The authors _____ that further work is needed.',
    correct_expression: 'argue',
    choices: ['argue', 'avoid', 'ignore', 'reduce'],
    meta: {
      explanation: '"Argue" signals a claim or position put forward by the author.',
      usage_note: 'X argue that = X は～と主張している。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'This claim is _____ by several independent studies.',
    correct_expression: 'backed up',
    choices: ['backed up', 'ruled out', 'given up', 'cut off'],
    meta: {
      explanation: '"Backed up" means supported by evidence.',
      usage_note: 'X is backed up by Y = X は Y によって裏付けられている。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the data, there is no clear trend.',
    correct_expression: 'Based on',
    choices: ['Based on', 'Apart from', 'Instead of', 'Regardless of'],
    meta: {
      explanation: '"Based on" introduces the evidence or basis for a claim.',
      usage_note: 'Based on X = X に基づいて。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The report _____ that standards have declined.',
    correct_expression: 'claims',
    choices: ['claims', 'avoids', 'reduces', 'delays'],
    meta: {
      explanation: '"Claims" introduces a statement that the author or source asserts.',
      usage_note: 'X claims that = X は～と主張している。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'There is _____ to suggest that the intervention works.',
    correct_expression: 'evidence',
    choices: ['evidence', 'doubt', 'confusion', 'delay'],
    meta: {
      explanation: '"Evidence" (noun) refers to data or facts supporting a claim.',
      usage_note: 'There is evidence to suggest that = ～を示唆する証拠がある。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The findings _____ the need for policy change.',
    correct_expression: 'underline',
    choices: ['underline', 'ignore', 'reject', 'reduce'],
    meta: {
      explanation: '"Underline" means emphasise or highlight (often a claim or implication).',
      usage_note: 'X underlines Y = X は Y を裏付ける・強調する。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ Smith (2020), the effect is negligible.',
    correct_expression: 'According to',
    choices: ['According to', 'Despite', 'Instead of', 'Apart from'],
    meta: {
      explanation: '"According to" cites a source (author/year) for a claim.',
      usage_note: 'According to X = X によると。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The results _____ the initial hypothesis.',
    correct_expression: 'confirm',
    choices: ['confirm', 'reject', 'ignore', 'delay'],
    meta: {
      explanation: '"Confirm" signals that evidence supports a prior claim or hypothesis.',
      usage_note: 'X confirm Y = X は Y を裏付ける。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'It has been _____ that the two variables are linked.',
    correct_expression: 'demonstrated',
    choices: ['demonstrated', 'denied', 'avoided', 'reduced'],
    meta: {
      explanation: '"Demonstrated" indicates that evidence has shown a claim to be true.',
      usage_note: 'It has been demonstrated that = ～であることが示されている。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The study _____ a strong correlation.',
    correct_expression: 'found',
    choices: ['found', 'lost', 'ignored', 'rejected'],
    meta: {
      explanation: '"Found" reports a result or piece of evidence from research.',
      usage_note: 'The study found (that) = 研究では～が明らかになった。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ this view, critics point to a lack of data.',
    correct_expression: 'Against',
    choices: ['Against', 'For', 'With', 'From'],
    meta: {
      explanation: '"Against" introduces opposition to a claim or view.',
      usage_note: 'Against this view = この見解に反して。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The evidence _____ this conclusion.',
    correct_expression: 'points to',
    choices: ['points to', 'rules out', 'gives up', 'cuts off'],
    meta: {
      explanation: '"Points to" indicates that evidence suggests or supports a conclusion.',
      usage_note: 'X points to Y = X は Y を示している。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Researchers _____ that the effect may be temporary.',
    correct_expression: 'suggest',
    choices: ['suggest', 'prevent', 'require', 'avoid'],
    meta: {
      explanation: '"Suggest" introduces a claim or interpretation based on evidence.',
      usage_note: 'X suggest that = X は～を示唆している。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The data _____ the assumption that demand would fall.',
    correct_expression: 'contradicts',
    choices: ['contradicts', 'supports', 'ignores', 'repeats'],
    meta: {
      explanation: '"Contradicts" signals that evidence goes against a claim or assumption.',
      usage_note: 'X contradicts Y = X は Y と矛盾する。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ a recent survey, most respondents agreed.',
    correct_expression: 'According to',
    choices: ['According to', 'Despite', 'Instead of', 'Apart from'],
    meta: {
      explanation: '"According to" introduces the source of the claim (survey).',
      usage_note: 'According to X = X によると。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The report _____ that action is needed.',
    correct_expression: 'concludes',
    choices: ['concludes', 'avoids', 'ignores', 'delays'],
    meta: {
      explanation: '"Concludes" signals the final claim or recommendation of a report.',
      usage_note: 'X concludes that = X は～と結論づけている。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'There is no _____ for this claim.',
    correct_expression: 'evidence',
    choices: ['evidence', 'doubt', 'reason', 'cause'],
    meta: {
      explanation: '"Evidence" (negative) states that a claim lacks support.',
      usage_note: 'There is no evidence for X = X を裏付ける証拠はない。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The results _____ with previous findings.',
    correct_expression: 'are consistent',
    choices: ['are consistent', 'are inconsistent', 'disagree', 'conflict'],
    meta: {
      explanation: '"Are consistent with" means the evidence agrees with or supports other findings.',
      usage_note: 'X is consistent with Y = X は Y と一致している。',
    },
  },
];
