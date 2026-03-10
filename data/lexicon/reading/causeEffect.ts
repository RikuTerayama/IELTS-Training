/**
 * Cause / Effect – signal phrases and collocations
 */

import type { ReadingLexiconSeed } from './types';

const C = 'reading_lexicon_cause_effect' as const;

export const CAUSE_EFFECT_SEED: ReadingLexiconSeed[] = [
  {
    category: C,
    mode: 'click',
    prompt: 'The rise in temperature _____ the melting of the ice caps.',
    correct_expression: 'results in',
    choices: ['results in', 'depends on', 'differs from', 'refers to'],
    meta: {
      explanation: '"Results in" signals a cause–effect link: the cause (rise in temperature) leads to the effect (melting).',
      usage_note: 'X results in Y = X が Y を引き起こす。Academic で頻出。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Poor diet can _____ a range of health problems.',
    correct_expression: 'lead to',
    choices: ['lead to', 'account for', 'deal with', 'focus on'],
    meta: {
      explanation: '"Lead to" expresses cause and effect: one factor brings about another.',
      usage_note: 'X leads to Y = X が Y につながる。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The experiment _____ that the treatment was effective.',
    correct_expression: 'demonstrated',
    choices: ['demonstrated', 'assumed', 'denied', 'ignored'],
    meta: {
      explanation: '"Demonstrated" signals that evidence supports a claim (effect/conclusion).',
      usage_note: 'demonstrate that = ～であることを示す・実証する。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Stress is often _____ by heavy workloads.',
    correct_expression: 'caused by',
    choices: ['caused by', 'replaced by', 'known as', 'based on'],
    meta: {
      explanation: '"Caused by" explicitly marks the cause (heavy workloads) of the effect (stress).',
      usage_note: 'X is caused by Y = X は Y が原因で起こる。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The policy was introduced _____ reduce inequality.',
    correct_expression: 'in order to',
    choices: ['in order to', 'as well as', 'rather than', 'such as'],
    meta: {
      explanation: '"In order to" signals purpose or intended effect.',
      usage_note: 'in order to + V = ～するために（目的・意図された結果）。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the lack of funding, the project was delayed.',
    correct_expression: 'Due to',
    choices: ['Due to', 'Apart from', 'According to', 'As opposed to'],
    meta: {
      explanation: '"Due to" introduces the cause of a stated effect or situation.',
      usage_note: 'Due to X = X が原因で。フォーマルな原因表現。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The findings _____ that further research is needed.',
    correct_expression: 'suggest',
    choices: ['suggest', 'prevent', 'require', 'avoid'],
    meta: {
      explanation: '"Suggest" signals that evidence or data points to a conclusion or implication.',
      usage_note: 'findings suggest that = 結果は～を示唆している。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Overfishing _____ a decline in fish populations.',
    correct_expression: 'has contributed to',
    choices: ['has contributed to', 'has resulted from', 'has consisted of', 'has relied on'],
    meta: {
      explanation: '"Has contributed to" indicates that a factor is one cause of an effect.',
      usage_note: 'X has contributed to Y = X が Y の一因となっている。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The disease _____ from a genetic mutation.',
    correct_expression: 'arises',
    choices: ['arises', 'benefits', 'excludes', 'replaces'],
    meta: {
      explanation: '"Arises from" signals that something (effect) has its origin or cause in something else.',
      usage_note: 'X arises from Y = X は Y に起因する。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ these factors, the outcome was predictable.',
    correct_expression: 'Given',
    choices: ['Given', 'Unless', 'Whereas', 'Besides'],
    meta: {
      explanation: '"Given" introduces a cause or condition that leads to a conclusion.',
      usage_note: 'Given X = X を考慮すると。原因・条件から結果へ。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The report _____ a link between smoking and illness.',
    correct_expression: 'establishes',
    choices: ['establishes', 'reduces', 'doubts', 'postpones'],
    meta: {
      explanation: '"Establishes" signals that evidence supports a causal or correlational link.',
      usage_note: 'establish a link between X and Y = X と Y の関連を立証する。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Climate change is _____ more frequent extreme weather.',
    correct_expression: 'giving rise to',
    choices: ['giving rise to', 'taking part in', 'making use of', 'getting rid of'],
    meta: {
      explanation: '"Giving rise to" means causing or producing (cause → effect).',
      usage_note: 'X is giving rise to Y = X が Y を引き起こしている。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The shortage _____ from poor harvests.',
    correct_expression: 'resulted',
    choices: ['resulted', 'suffered', 'emerged', 'departed'],
    meta: {
      explanation: '"Resulted from" states that the effect (shortage) was caused by something (poor harvests).',
      usage_note: 'X resulted from Y = X は Y の結果であった。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The study _____ that sleep loss affects performance.',
    correct_expression: 'revealed',
    choices: ['revealed', 'assumed', 'refused', 'delayed'],
    meta: {
      explanation: '"Revealed" indicates that research or evidence has shown a cause–effect relationship.',
      usage_note: 'reveal that = ～であることを明らかにする。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the high demand, prices increased.',
    correct_expression: 'As a result of',
    choices: ['As a result of', 'In spite of', 'In addition to', 'In place of'],
    meta: {
      explanation: '"As a result of" introduces the cause; the main clause states the effect.',
      usage_note: 'As a result of X = X の結果として。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The new law _____ a reduction in pollution.',
    correct_expression: 'brought about',
    choices: ['brought about', 'broke down', 'went through', 'looked into'],
    meta: {
      explanation: '"Brought about" means caused or produced (effect).',
      usage_note: 'X brought about Y = X が Y をもたらした。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The failure was _____ by a lack of planning.',
    correct_expression: 'brought about',
    choices: ['brought about', 'turned down', 'carried out', 'taken over'],
    meta: {
      explanation: '"Brought about" (passive) states the cause of the effect (failure).',
      usage_note: 'X was brought about by Y = X は Y によって引き起こされた。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'Research _____ a strong correlation between the two variables.',
    correct_expression: 'has shown',
    choices: ['has shown', 'has avoided', 'has ignored', 'has denied'],
    meta: {
      explanation: '"Has shown" signals that evidence supports a relationship (often causal or correlational).',
      usage_note: 'research has shown that = 研究により～であることが示されている。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The intervention _____ to improve outcomes.',
    correct_expression: 'was designed',
    choices: ['was designed', 'was prevented', 'was confused', 'was reduced'],
    meta: {
      explanation: '"Was designed to" indicates intended effect or purpose.',
      usage_note: 'X was designed to Y = X は Y することを目的に設計された。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the evidence, we can conclude that the treatment works.',
    correct_expression: 'On the basis of',
    choices: ['On the basis of', 'In contrast to', 'Regardless of', 'In favour of'],
    meta: {
      explanation: '"On the basis of" introduces the cause/evidence that supports a conclusion (effect).',
      usage_note: 'On the basis of X = X に基づいて。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The effect _____ the cause was not immediately obvious.',
    correct_expression: 'of',
    choices: ['of', 'for', 'with', 'to'],
    passage_excerpt: 'The effect of the cause was not immediately obvious. Scientists needed several years to establish the link.',
    meta: {
      explanation: '"Effect of" links the result to its cause (the effect of the cause).',
      usage_note: 'the effect of X = X による効果・結果。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'This _____ a chain of events that changed the industry.',
    correct_expression: 'triggered',
    choices: ['triggered', 'reversed', 'repeated', 'simplified'],
    meta: {
      explanation: '"Triggered" means initiated or caused (a chain of effects).',
      usage_note: 'X triggered Y = X が Y を引き金にした。',
    },
  },
];
