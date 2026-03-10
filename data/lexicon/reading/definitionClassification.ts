/**
 * Definition / Classification – signal phrases
 */

import type { ReadingLexiconSeed } from './types';

const C = 'reading_lexicon_definition_classification' as const;

export const DEFINITION_CLASSIFICATION_SEED: ReadingLexiconSeed[] = [
  {
    category: C,
    mode: 'click',
    prompt: 'Biodiversity can be _____ as the variety of life on Earth.',
    correct_expression: 'defined',
    choices: ['defined', 'reduced', 'replaced', 'ignored'],
    meta: {
      explanation: '"Defined" introduces a definition.',
      usage_note: 'X can be defined as Y = X は Y と定義できる。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the term "sustainability" refers to the long-term use of resources.',
    correct_expression: 'In this context',
    choices: ['In this context', 'As a result', 'In contrast', 'For instance'],
    meta: {
      explanation: '"In this context" narrows or specifies the meaning of a term.',
      usage_note: 'In this context = この文脈では。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The study _____ three types of behaviour.',
    correct_expression: 'identified',
    choices: ['identified', 'avoided', 'delayed', 'rejected'],
    meta: {
      explanation: '"Identified" signals that categories or types have been distinguished.',
      usage_note: 'identify X = X を特定する・分類する。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'These can be _____ into two main groups.',
    correct_expression: 'divided',
    choices: ['divided', 'combined', 'removed', 'repeated'],
    meta: {
      explanation: '"Divided into" introduces a classification (splitting into groups).',
      usage_note: 'X can be divided into Y = X は Y に分類できる。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '"Ecosystem" _____ the community of living organisms and their environment.',
    correct_expression: 'refers to',
    choices: ['refers to', 'depends on', 'leads to', 'results from'],
    meta: {
      explanation: '"Refers to" introduces what a term means (definition).',
      usage_note: 'X refers to Y = X は Y を指す。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The first _____, known as Type A, is the most common.',
    correct_expression: 'category',
    choices: ['category', 'cause', 'effect', 'trend'],
    meta: {
      explanation: '"Category" names a class in a classification.',
      usage_note: 'category = カテゴリ・種類。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'This is _____ as a form of renewable energy.',
    correct_expression: 'classified',
    choices: ['classified', 'rejected', 'ignored', 'reduced'],
    meta: {
      explanation: '"Classified as" assigns something to a category.',
      usage_note: 'X is classified as Y = X は Y に分類される。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ "habitat" means the natural environment of an organism.',
    correct_expression: 'Strictly speaking',
    choices: ['Strictly speaking', 'As a result', 'In contrast', 'For example'],
    meta: {
      explanation: '"Strictly speaking" introduces a precise or narrow definition.',
      usage_note: 'Strictly speaking = 厳密に言えば。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The framework _____ four key dimensions.',
    correct_expression: 'distinguishes',
    choices: ['distinguishes', 'confuses', 'combines', 'eliminates'],
    meta: {
      explanation: '"Distinguishes" signals that categories or dimensions are being identified.',
      usage_note: 'distinguish X = X を区別する・分ける。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'These fall _____ two broad categories.',
    correct_expression: 'into',
    choices: ['into', 'under', 'over', 'through'],
    meta: {
      explanation: '"Fall into" introduces classification (things belong to categories).',
      usage_note: 'X fall into Y = X は Y に分類される。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The term _____ any system that recycles materials.',
    correct_expression: 'encompasses',
    choices: ['encompasses', 'excludes', 'reduces', 'delays'],
    meta: {
      explanation: '"Encompasses" means includes or covers (definition by scope).',
      usage_note: 'X encompasses Y = X は Y を含む。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ this includes both natural and artificial systems.',
    correct_expression: 'In this sense',
    choices: ['In this sense', 'As a result', 'By contrast', 'For instance'],
    meta: {
      explanation: '"In this sense" specifies the meaning or scope of a term.',
      usage_note: 'In this sense = この意味では。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The data was _____ by region and by age group.',
    correct_expression: 'categorised',
    choices: ['categorised', 'reduced', 'ignored', 'rejected'],
    meta: {
      explanation: '"Categorised" signals classification (organised into categories).',
      usage_note: 'categorise X by Y = X を Y で分類する。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'There are several _____ of this phenomenon.',
    correct_expression: 'types',
    choices: ['types', 'causes', 'results', 'reasons'],
    meta: {
      explanation: '"Types" introduces a classification (kinds or categories).',
      usage_note: 'types of X = X の種類。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ , "biodiversity" includes genetic, species, and ecosystem diversity.',
    correct_expression: 'Broadly speaking',
    choices: ['Broadly speaking', 'As a result', 'In contrast', 'For example'],
    meta: {
      explanation: '"Broadly speaking" introduces a wide or general definition.',
      usage_note: 'Broadly speaking = 広く言えば。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The participants were _____ into three groups.',
    correct_expression: 'assigned',
    choices: ['assigned', 'removed', 'replaced', 'rejected'],
    meta: {
      explanation: '"Assigned into" indicates classification (allocated to groups).',
      usage_note: 'X were assigned into Y = X は Y に割り当てられた。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'This _____ what economists call "externalities".',
    correct_expression: 'corresponds to',
    choices: ['corresponds to', 'differs from', 'depends on', 'refers to'],
    meta: {
      explanation: '"Corresponds to" links a concept to a defined term or category.',
      usage_note: 'X corresponds to Y = X は Y に相当する。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The _____ between the two concepts is important.',
    correct_expression: 'distinction',
    choices: ['distinction', 'similarity', 'cause', 'effect'],
    meta: {
      explanation: '"Distinction" refers to a difference used in classification or definition.',
      usage_note: 'the distinction between X and Y = X と Y の区別。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ , such systems are defined by their ability to self-correct.',
    correct_expression: 'By definition',
    choices: ['By definition', 'As a result', 'In contrast', 'For instance'],
    meta: {
      explanation: '"By definition" introduces a property that follows from the definition.',
      usage_note: 'By definition = 定義上。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The model _____ five distinct stages.',
    correct_expression: 'comprises',
    choices: ['comprises', 'reduces', 'excludes', 'replaces'],
    meta: {
      explanation: '"Comprises" means consists of (definition by components).',
      usage_note: 'X comprises Y = X は Y から成る。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'These _____ under the heading "structural factors".',
    correct_expression: 'fall',
    choices: ['fall', 'rise', 'differ', 'result'],
    meta: {
      explanation: '"Fall under" assigns items to a category or heading.',
      usage_note: 'X fall under Y = X は Y に含まれる。',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The _____ includes both direct and indirect effects.',
    correct_expression: 'definition',
    choices: ['definition', 'cause', 'trend', 'evidence'],
    meta: {
      explanation: '"Definition" names the act or result of defining.',
      usage_note: 'the definition includes = 定義には～が含まれる。',
    },
  },
];
