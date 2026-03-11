/**
 * Definition / reference phrases – IELTS Reading
 */

import type { ReadingIdiomSeed } from './types';

const C = 'idiom_reading_definition_reference' as const;

export const DEFINITION_REFERENCE_SEED: ReadingIdiomSeed[] = [
  {
    category: C,
    mode: 'click',
    prompt: '"Biodiversity" _____ the variety of life in a given area.',
    correct_expression: 'refers to',
    choices: ['refers to', 'results in', 'depends on', 'leads to'],
    passage_excerpt: 'The term "biodiversity" refers to the variety of life in a given area.',
    meta: {
      explanation: '"Refers to" introduces a definition (what the term means).',
      paraphrase_tip: 'refers to = means, denotes',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the report, "sustainability" means meeting present needs without compromising the future.',
    correct_expression: 'According to',
    choices: ['According to', 'Due to', 'Instead of', 'Regardless of'],
    passage_excerpt: 'According to the report, "sustainability" means meeting present needs without compromising the future.',
    meta: {
      explanation: '"According to" attributes a definition or claim to a source.',
      paraphrase_tip: 'according to = as stated by, in the view of',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The concept _____ the idea that behaviour is shaped by context.',
    correct_expression: 'is defined as',
    choices: ['is defined as', 'is known as', 'is regarded as', 'is seen as'],
    passage_excerpt: 'The concept is defined as the idea that behaviour is shaped by context.',
    meta: {
      explanation: '"Is defined as" introduces the formal definition of the concept.',
      paraphrase_tip: 'is defined as = means, is',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ "ecosystem", we mean a community of living organisms and their environment.',
    correct_expression: 'By',
    choices: ['By', 'For', 'With', 'In'],
    passage_excerpt: 'By "ecosystem", we mean a community of living organisms and their environment.',
    meta: {
      explanation: '"By X we mean Y" is a standard way to define a term.',
      usage_note: 'Common in academic writing for definitions.',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The term is _____ the practice of farming without synthetic chemicals.',
    correct_expression: 'used to describe',
    choices: ['used to describe', 'used to be', 'used to do', 'used for'],
    passage_excerpt: 'The term is used to describe the practice of farming without synthetic chemicals.',
    meta: {
      explanation: '"Used to describe" introduces what the term refers to (definition).',
      paraphrase_tip: 'used to describe = means, denotes',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the author, "efficiency" here means output per unit of input.',
    correct_expression: 'For',
    choices: ['For', 'To', 'With', 'By'],
    passage_excerpt: 'For the author, "efficiency" here means output per unit of input.',
    meta: {
      explanation: '"For the author" attributes the definition to the author.',
      usage_note: '"For X" = in X\'s usage or view.',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'This _____ what economists call "market failure".',
    correct_expression: 'is what',
    choices: ['is what', 'is that', 'is when', 'is why'],
    passage_excerpt: 'This is what economists call "market failure".',
    meta: {
      explanation: '"Is what X call Y" defines or labels something (reference to a term).',
      paraphrase_tip: 'is what X call = is known as (by X), is termed',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the text, "urban sprawl" denotes unplanned city expansion.',
    correct_expression: 'In',
    choices: ['In', 'On', 'At', 'To'],
    passage_excerpt: 'In the text, "urban sprawl" denotes unplanned city expansion.',
    meta: {
      explanation: '"In the text" refers to where the definition or usage appears.',
      paraphrase_tip: 'in the text = in this passage/source',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The phrase _____ the period between initial contact and agreement.',
    correct_expression: 'denotes',
    choices: ['denotes', 'prevents', 'extends', 'reduces'],
    passage_excerpt: 'The phrase denotes the period between initial contact and agreement.',
    meta: {
      explanation: '"Denotes" means "refers to" or "means" (definition).',
      paraphrase_tip: 'denotes = means, refers to',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the foregoing, "capacity" means the maximum amount that can be held.',
    correct_expression: 'In line with',
    choices: ['In line with', 'In place of', 'In view of', 'In terms of'],
    passage_excerpt: 'In line with the foregoing, "capacity" means the maximum amount that can be held.',
    meta: {
      explanation: '"In line with the foregoing" refers back to what was said before (reference).',
      usage_note: '"The foregoing" = what was stated earlier.',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The study _____ "exposure" as contact with the substance for at least one hour.',
    correct_expression: 'defines',
    choices: ['defines', 'describes', 'discovers', 'determines'],
    passage_excerpt: 'The study defines "exposure" as contact with the substance for at least one hour.',
    meta: {
      explanation: '"Defines X as Y" gives the formal definition.',
      paraphrase_tip: 'defines ... as = means, is taken to mean',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the dictionary, the word has two meanings.',
    correct_expression: 'According to',
    choices: ['According to', 'Instead of', 'Apart from', 'Ahead of'],
    passage_excerpt: 'According to the dictionary, the word has two meanings.',
    meta: {
      explanation: '"According to" attributes the information (definition) to a source.',
      paraphrase_tip: 'according to = as stated in',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The abbreviation _____ "World Health Organization".',
    correct_expression: 'stands for',
    choices: ['stands for', 'refers to', 'points to', 'leads to'],
    passage_excerpt: 'The abbreviation WHO stands for "World Health Organization".',
    meta: {
      explanation: '"Stands for" gives the meaning of an abbreviation or symbol.',
      paraphrase_tip: 'stands for = means, is short for',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ this paper, "bias" is any systematic deviation from the true value.',
    correct_expression: 'In',
    choices: ['In', 'On', 'At', 'For'],
    passage_excerpt: 'In this paper, "bias" is any systematic deviation from the true value.',
    meta: {
      explanation: '"In this paper" refers to the current text and its definitions.',
      paraphrase_tip: 'in this paper = in this article/text',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The term _____ any change in the genetic makeup of a population.',
    correct_expression: 'encompasses',
    choices: ['encompasses', 'excludes', 'reduces', 'delays'],
    passage_excerpt: 'The term encompasses any change in the genetic makeup of a population.',
    meta: {
      explanation: '"Encompasses" means "includes" or "covers" (definition by scope).',
      paraphrase_tip: 'encompasses = includes, covers',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the above definition, we can proceed.',
    correct_expression: 'With',
    choices: ['With', 'By', 'For', 'From'],
    passage_excerpt: 'With the above definition in mind, we can proceed.',
    meta: {
      explanation: '"With the above definition" refers back to a definition given earlier.',
      usage_note: 'Reference to previous text.',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The expression _____ the same as "carbon footprint" in this context.',
    correct_expression: 'is used to mean',
    choices: ['is used to mean', 'is used to be', 'is used to do', 'is used for'],
    passage_excerpt: 'The expression is used to mean the same as "carbon footprint" in this context.',
    meta: {
      explanation: '"Is used to mean" introduces how a term is used (definition in context).',
      paraphrase_tip: 'is used to mean = means (here), denotes',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the first paragraph, the key concept is introduced.',
    correct_expression: 'In',
    choices: ['In', 'On', 'At', 'To'],
    passage_excerpt: 'In the first paragraph, the key concept is introduced.',
    meta: {
      explanation: '"In the first paragraph" is a reference to location in the text.',
      paraphrase_tip: 'reference to a specific part of the text',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The word _____ both the process and the result.',
    correct_expression: 'denotes',
    choices: ['denotes', 'prevents', 'extends', 'confirms'],
    passage_excerpt: 'The word denotes both the process and the result.',
    meta: {
      explanation: '"Denotes" means "refers to" (definition: what the word covers).',
      paraphrase_tip: 'denotes = means, refers to',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the author\'s usage, "impact" includes both positive and negative effects.',
    correct_expression: 'In',
    choices: ['In', 'On', 'For', 'With'],
    passage_excerpt: 'In the author\'s usage, "impact" includes both positive and negative effects.',
    meta: {
      explanation: '"In the author\'s usage" attributes a definition to the author.',
      paraphrase_tip: 'in X\'s usage = as X uses the term',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: 'The phrase _____ the following: a period of rapid growth.',
    correct_expression: 'refers to',
    choices: ['refers to', 'results in', 'depends on', 'leads to'],
    passage_excerpt: 'The phrase "boom" refers to the following: a period of rapid growth.',
    meta: {
      explanation: '"Refers to" introduces the definition or meaning.',
      paraphrase_tip: 'refers to = means',
    },
  },
  {
    category: C,
    mode: 'click',
    prompt: '_____ the previous section, "yield" means the amount produced.',
    correct_expression: 'As in',
    choices: ['As in', 'As for', 'As to', 'As of'],
    passage_excerpt: 'As in the previous section, "yield" means the amount produced.',
    meta: {
      explanation: '"As in the previous section" refers back to an earlier definition.',
      paraphrase_tip: 'as in = as (defined) in',
    },
  },
];
