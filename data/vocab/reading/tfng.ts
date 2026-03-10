/**
 * True / False / Not Given
 * 20+ questions, topic/difficulty distributed
 */

import type { ReadingQuestionSeed } from './types';
import { CATEGORY_BY_TYPE } from './types';

const C = CATEGORY_BY_TYPE.tfng;

export const TFNG_SEED: ReadingQuestionSeed[] = [
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The study lasted for six months.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Researchers observed the participants over a period of six months, recording their progress at regular intervals.',
    strategy: 'Find the explicit statement about duration.',
    meta: { topic: 'science', difficulty: 'beginner' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'All participants were under the age of 30.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The survey included 500 volunteers from various backgrounds. They were asked to complete a questionnaire and attend two follow-up sessions.',
    strategy: 'Age is not mentioned in the passage.',
    meta: { topic: 'health', difficulty: 'beginner' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The majority of respondents supported the proposal.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Only 35 per cent of those surveyed said they would support the new policy. The rest were either opposed or undecided.',
    strategy: '35% is a minority, not a majority.',
    meta: { topic: 'education', difficulty: 'beginner' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Funding for the project came from the government.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The project received £2 million in funding. Researchers used this to purchase equipment and hire additional staff.',
    strategy: 'The source of funding is not stated.',
    meta: { topic: 'science', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The technology was first developed in Japan.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The technology was first developed in Japan in the early 1990s, before being adopted by manufacturers in other countries.',
    meta: { topic: 'technology', difficulty: 'beginner' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Deforestation has increased in the last twenty years.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Satellite data shows that the rate of deforestation has risen significantly over the past two decades, particularly in tropical regions.',
    meta: { topic: 'environment', difficulty: 'beginner' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The treatment is suitable for all age groups.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The new drug has been approved for use in adults. Clinical trials are ongoing to assess its safety and effectiveness in children.',
    meta: { topic: 'health', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Students must pass an entrance exam to enrol.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The programme is open to anyone with a secondary school qualification. No entrance exam is required, but applicants are asked to submit a short written statement.',
    meta: { topic: 'education', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The experiment was repeated three times.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'To ensure reliability, the team used a standardised procedure and collected data under controlled conditions. Results were consistent across different batches.',
    meta: { topic: 'science', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The building was completed in 1850.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Construction began in 1847 and the building was completed in 1850. It has since been restored twice, most recently in 2003.',
    meta: { topic: 'history', difficulty: 'beginner' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The software is free to download.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The software is available for Windows and Mac. A basic version can be used for personal projects, while the professional version includes additional features.',
    meta: { topic: 'technology', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Pollution levels have fallen in the city centre.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Since the introduction of the low-emission zone, pollution levels in the city centre have fallen by an average of 20 per cent. Monitoring continues to track long-term trends.',
    meta: { topic: 'environment', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The author believes that change is unnecessary.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The author argues that reform is essential if the system is to meet future challenges. Without change, he suggests, the current approach will become unsustainable.',
    meta: { topic: 'education', difficulty: 'advanced' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The disease affects only humans.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The disease can be transmitted between humans and certain animal species. This has raised concerns about the need for a coordinated response across human and veterinary health services.',
    meta: { topic: 'health', difficulty: 'advanced' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The theory was widely accepted when first proposed.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'When the theory was first put forward in the 1920s, it was met with scepticism. It took several decades and further evidence before it gained general acceptance.',
    meta: { topic: 'science', difficulty: 'advanced' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The device requires an internet connection.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The device can store up to 32 GB of data and has a battery life of approximately ten hours. It is designed for use in the field where connectivity may be limited.',
    meta: { topic: 'technology', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The treaty was signed by more than 100 countries.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The international treaty was opened for signature in 2015 and has since been ratified by over 120 countries. It aims to limit global temperature rise and support adaptation.',
    meta: { topic: 'environment', difficulty: 'advanced' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Attendance at the event was lower than expected.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The event attracted participants from more than 30 countries. Organisers described the level of interest as encouraging and announced that the event would be held again next year.',
    meta: { topic: 'education', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The empire extended across three continents.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'At its height, the empire controlled territory in Europe, North Africa, and the Middle East. Its borders shifted over time as a result of military campaigns and treaties.',
    meta: { topic: 'history', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Exercise is more effective than medication for this condition.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Guidelines recommend a combination of medication and lifestyle changes, including regular exercise. Studies have shown that both can improve outcomes when used together.',
    meta: { topic: 'health', difficulty: 'advanced' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The material was discovered by accident.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The material was discovered by accident in 1945 when a researcher noticed unusual properties in a sample that had been left near a heat source. Further experiments confirmed its potential.',
    meta: { topic: 'science', difficulty: 'intermediate' },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The system is no longer in use.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Although the system was developed in the 1980s, it remains in use today. Updates have been made to improve security and compatibility with modern hardware.',
    meta: { topic: 'technology', difficulty: 'advanced' },
  },
];
