/**
 * Trend / Change – signal phrases
 */

import type { ReadingLexiconSeed } from './types';

const C = 'reading_lexicon_trend_change' as const;

export const TREND_CHANGE_SEED: ReadingLexiconSeed[] = [
  {
    category: C,
    mode: 'click',
    prompt: 'Sales have _____ steadily over the past decade.',
    correct_expression: 'increased',
    choices: ['increased', 'decreased', 'remained', 'stopped'],
    meta: {
      explanation: '"Increased" describes an upward trend.',
      usage_note: 'X have increased = X は増加してきた。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'There has been a _____ decline in the population.',
    correct_expression: 'gradual',
    choices: ['gradual', 'sudden', 'constant', 'rare'],
    meta: {
      explanation: '"Gradual" describes a trend that happens slowly over time.',
      usage_note: 'gradual decline = 徐々の減少。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The figure _____ from 50% in 2010 to 70% in 2020.',
    correct_expression: 'rose',
    choices: ['rose', 'fell', 'stayed', 'ceased'],
    meta: {
      explanation: '"Rose" signals an upward change (trend).',
      usage_note: 'X rose from A to B = X は A から B に上昇した。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the 1990s, demand has grown significantly.',
    correct_expression: 'Since',
    choices: ['Since', 'Until', 'Before', 'During'],
    meta: {
      explanation: '"Since" marks the start of a period over which a trend is observed.',
      usage_note: 'Since X = X 以来。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'A _____ shift in policy occurred in 2015.',
    correct_expression: 'significant',
    choices: ['significant', 'minor', 'temporary', 'rare'],
    meta: {
      explanation: '"Significant" emphasises that the change was notable.',
      usage_note: 'significant shift = 大きな変化。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The rate has _____ over time.',
    correct_expression: 'fluctuated',
    choices: ['fluctuated', 'stabilised', 'disappeared', 'continued'],
    meta: {
      explanation: '"Fluctuated" describes variation (up and down) over time.',
      usage_note: 'X has fluctuated = X は変動してきた。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ a sharp increase in 2020, levels have since fallen.',
    correct_expression: 'Following',
    choices: ['Following', 'Preventing', 'Ignoring', 'Rejecting'],
    meta: {
      explanation: '"Following" links a change (increase) to what happened next (fall).',
      usage_note: 'Following X = X の後に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The trend _____ a reversal in recent years.',
    correct_expression: 'has undergone',
    choices: ['has undergone', 'has avoided', 'has ignored', 'has delayed'],
    meta: {
      explanation: '"Has undergone" signals that a change or shift has occurred.',
      usage_note: 'X has undergone Y = X は Y を経験した。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Numbers _____ to rise until 2018.',
    correct_expression: 'continued',
    choices: ['continued', 'ceased', 'refused', 'rejected'],
    meta: {
      explanation: '"Continued" indicates that a trend persisted over a period.',
      usage_note: 'X continued to Y = X は Y し続けた。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'There was a _____ from manual to automated processes.',
    correct_expression: 'shift',
    choices: ['shift', 'cause', 'effect', 'claim'],
    meta: {
      explanation: '"Shift" names a change in direction or type.',
      usage_note: 'a shift from X to Y = X から Y への移行。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The percentage _____ from 30% to 45% between 2000 and 2010.',
    correct_expression: 'grew',
    choices: ['grew', 'shrank', 'stayed', 'ceased'],
    meta: {
      explanation: '"Grew" describes an upward trend over a period.',
      usage_note: 'X grew from A to B = X は A から B に増加した。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ a peak in 2015, the figure has declined.',
    correct_expression: 'After reaching',
    choices: ['After reaching', 'Before reaching', 'Without reaching', 'Instead of reaching'],
    meta: {
      explanation: '"After reaching" describes a trend that rose to a peak then changed.',
      usage_note: 'After reaching X = X に達した後。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The pattern has _____ over the last five years.',
    correct_expression: 'changed',
    choices: ['changed', 'remained', 'continued', 'ceased'],
    meta: {
      explanation: '"Changed" states that a trend or pattern is no longer the same.',
      usage_note: 'X has changed = X は変化してきた。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'A _____ decline was observed in the second quarter.',
    correct_expression: 'marked',
    choices: ['marked', 'slight', 'temporary', 'rare'],
    meta: {
      explanation: '"Marked" means noticeable or significant (describing the extent of change).',
      usage_note: 'marked decline = 顕著な減少。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The level _____ stable until 2020.',
    correct_expression: 'remained',
    choices: ['remained', 'increased', 'decreased', 'ceased'],
    meta: {
      explanation: '"Remained" indicates no change (stability) over a period.',
      usage_note: 'X remained Y = X は Y のままだった。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the early 2000s, there has been a steady rise.',
    correct_expression: 'Since',
    choices: ['Since', 'Until', 'Before', 'During'],
    meta: {
      explanation: '"Since" marks the start of the period of the trend.',
      usage_note: 'Since X = X 以来。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The data _____ a clear upward trend.',
    correct_expression: 'shows',
    choices: ['shows', 'hides', 'ignores', 'rejects'],
    meta: {
      explanation: '"Shows" signals that evidence or data indicates a trend.',
      usage_note: 'X shows Y = X は Y を示している。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Demand _____ dramatically during the pandemic.',
    correct_expression: 'fell',
    choices: ['fell', 'rose', 'stayed', 'ceased'],
    meta: {
      explanation: '"Fell" describes a downward change or trend.',
      usage_note: 'X fell = X は減少した。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The _____ from growth to decline was rapid.',
    correct_expression: 'transition',
    choices: ['transition', 'cause', 'effect', 'claim'],
    meta: {
      explanation: '"Transition" names a change from one state or trend to another.',
      usage_note: 'the transition from X to Y = X から Y への移行。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Values have _____ since the policy was introduced.',
    correct_expression: 'dropped',
    choices: ['dropped', 'risen', 'stabilised', 'continued'],
    meta: {
      explanation: '"Dropped" indicates a downward trend.',
      usage_note: 'X have dropped = X は下落してきた。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ a brief fall, the index recovered.',
    correct_expression: 'After',
    choices: ['After', 'Before', 'During', 'Without'],
    meta: {
      explanation: '"After" links a change (brief fall) to what followed (recovery).',
      usage_note: 'After X = X の後に。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The _____ has been downward over the last decade.',
    correct_expression: 'trend',
    choices: ['trend', 'cause', 'effect', 'evidence'],
    meta: {
      explanation: '"Trend" names the general direction of change over time.',
      usage_note: 'the trend has been X = 傾向は X であった。',
    },
  },
];
