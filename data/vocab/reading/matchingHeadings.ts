/**
 * Matching Headings – choose the best heading for a paragraph
 * 20+ questions, topic/difficulty distributed
 */

import type { ReadingQuestionSeed } from './types';
import { CATEGORY_BY_TYPE } from './types';

const C = CATEGORY_BY_TYPE.matching_headings;

export const MATCHING_HEADINGS_SEED: ReadingQuestionSeed[] = [
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'The origins of renewable energy',
    choices: [
      'The origins of renewable energy',
      'Problems with fossil fuels',
      'Future technology',
      'Government policy',
    ],
    passage_excerpt:
      "Wind and water have been used as sources of power for centuries. Early windmills were built in Persia around 500 AD, while water wheels were common in ancient China and Rome. These simple technologies laid the foundation for today's renewable energy sector.",
    strategy: 'The paragraph focuses on history and origins, not problems or future.',
    meta: { topic: 'history', difficulty: 'intermediate' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best fits this paragraph?',
    correct_expression: 'Challenges faced by researchers',
    choices: [
      'Challenges faced by researchers',
      'Successful experiments',
      'Public opinion',
      'Funding sources',
    ],
    passage_excerpt:
      'Scientists working on the project encountered numerous obstacles. Equipment failures, unpredictable weather, and limited access to remote sites delayed progress. Despite these setbacks, the team remained committed to their goals.',
    strategy: 'Key phrases: obstacles, delays, setbacks.',
    meta: { topic: 'science', difficulty: 'intermediate' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the most appropriate heading.',
    correct_expression: 'How the experiment was conducted',
    choices: [
      'How the experiment was conducted',
      'Why the study failed',
      'Interview with the author',
      'Recommendations for readers',
    ],
    passage_excerpt:
      'Participants were randomly assigned to two groups. Group A received the new treatment twice daily for six weeks, while Group B received a placebo. Researchers measured outcomes at the start, midpoint, and end of the study.',
    strategy: 'The text describes methodology: groups, treatment, measurements.',
    meta: { topic: 'health', difficulty: 'intermediate' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'A change in consumer behaviour',
    choices: [
      'A change in consumer behaviour',
      'The history of retail',
      'Technical specifications',
      'Environmental legislation',
    ],
    passage_excerpt:
      'Sales data from the past decade reveals a clear shift in how people shop. Online purchases have risen steadily, while visits to physical stores have declined. Many consumers now compare prices on their phones before buying.',
    meta: { topic: 'technology', difficulty: 'beginner' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best matches the paragraph?',
    correct_expression: 'The benefits of early intervention',
    choices: [
      'The benefits of early intervention',
      'Cost of treatment',
      'Staff training',
      'Patient complaints',
    ],
    passage_excerpt:
      'Studies show that identifying and addressing learning difficulties at an early age leads to better outcomes. Children who receive support before the age of five often catch up with their peers, while delays can have long-term effects.',
    meta: { topic: 'education', difficulty: 'intermediate' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the best heading for this paragraph.',
    correct_expression: 'Causes of habitat loss',
    choices: [
      'Causes of habitat loss',
      'Benefits of wildlife',
      'New species discovered',
      'Tourism and conservation',
    ],
    passage_excerpt:
      'Deforestation, urban expansion, and intensive farming have reduced the area available for wildlife. As a result, many species are confined to smaller and more fragmented areas, which affects their ability to find food and reproduce.',
    meta: { topic: 'environment', difficulty: 'intermediate' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best fits the paragraph?',
    correct_expression: 'The role of diet in disease prevention',
    choices: [
      'The role of diet in disease prevention',
      'Surgery options',
      'History of medicine',
      'Cost of healthcare',
    ],
    passage_excerpt:
      'Research has consistently shown that a balanced diet rich in fruit and vegetables can lower the risk of heart disease and some cancers. Health authorities recommend limiting processed foods and sugar to maintain long-term health.',
    meta: { topic: 'health', difficulty: 'beginner' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the most appropriate heading.',
    correct_expression: 'Limitations of the study',
    choices: [
      'Limitations of the study',
      'Main results',
      'Acknowledgements',
      'Future research',
    ],
    passage_excerpt:
      'The sample size was relatively small, and participants were drawn from a single region. In addition, the follow-up period of six months may not be long enough to observe long-term effects. These factors should be considered when interpreting the findings.',
    meta: { topic: 'science', difficulty: 'advanced' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the best heading for this paragraph.',
    correct_expression: 'The impact of technology on employment',
    choices: [
      'The impact of technology on employment',
      'Education in the past',
      'Leisure activities',
      'Transport systems',
    ],
    passage_excerpt:
      'Automation and artificial intelligence are changing the nature of work. Some jobs have disappeared, while new roles have been created. Governments and employers are being urged to invest in retraining so that workers can adapt to these changes.',
    meta: { topic: 'technology', difficulty: 'intermediate' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best matches the paragraph?',
    correct_expression: 'Reasons for the decline of the empire',
    choices: [
      'Reasons for the decline of the empire',
      'Military victories',
      'Art and culture',
      'Daily life',
    ],
    passage_excerpt:
      'Historians have put forward several explanations for the collapse. These include economic problems, invasions from the north, and internal political instability. No single factor is thought to be entirely responsible.',
    meta: { topic: 'history', difficulty: 'advanced' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'How schools are adapting to change',
    choices: [
      'How schools are adapting to change',
      'University admissions',
      'Sports in education',
      'School buildings',
    ],
    passage_excerpt:
      'Many schools have introduced flexible learning spaces and digital tools to support different styles of learning. Teachers are also encouraged to use project-based activities that develop problem-solving skills as well as subject knowledge.',
    meta: { topic: 'education', difficulty: 'beginner' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best fits this paragraph?',
    correct_expression: 'Evidence of climate change',
    choices: [
      'Evidence of climate change',
      'Weather forecasting',
      'Ocean travel',
      'Farming methods',
    ],
    passage_excerpt:
      'Rising global temperatures, melting ice caps, and more frequent extreme weather events are widely cited as evidence that the climate is changing. Scientific data from ice cores and satellite measurements support these observations.',
    meta: { topic: 'environment', difficulty: 'intermediate' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the most appropriate heading.',
    correct_expression: 'Steps in the research process',
    choices: [
      'Steps in the research process',
      'Famous scientists',
      'Equipment used',
      'Publication fees',
    ],
    passage_excerpt:
      'The team began by reviewing existing literature, then designed the experiment and obtained ethical approval. Data collection took place over twelve months, after which the results were analysed and written up for publication.',
    meta: { topic: 'science', difficulty: 'intermediate' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'Symptoms and diagnosis',
    choices: [
      'Symptoms and diagnosis',
      'History of the hospital',
      'Nursing care',
      'Medical insurance',
    ],
    passage_excerpt:
      'Patients typically experience fatigue, fever, and loss of appetite. A blood test is used to confirm the diagnosis, and in some cases further imaging may be required. Early detection improves the chances of a full recovery.',
    meta: { topic: 'health', difficulty: 'intermediate' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best matches the paragraph?',
    correct_expression: 'The development of writing systems',
    choices: [
      'The development of writing systems',
      'Modern languages',
      'Translation software',
      'Famous writers',
    ],
    passage_excerpt:
      'Writing first emerged in Mesopotamia around 3200 BCE. Early scripts were mainly used for record-keeping. Over time, writing spread to other regions and was adapted for different languages and purposes.',
    meta: { topic: 'history', difficulty: 'advanced' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the best heading for this paragraph.',
    correct_expression: 'Advantages of online learning',
    choices: [
      'Advantages of online learning',
      'School uniforms',
      'Examination systems',
      'Teacher recruitment',
    ],
    passage_excerpt:
      'Students can study at their own pace and access materials at any time. Those who live in remote areas or have other commitments find it easier to fit learning into their schedule. In addition, a wide range of courses is available from institutions around the world.',
    meta: { topic: 'education', difficulty: 'beginner' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best fits the paragraph?',
    correct_expression: 'Measures to protect the ozone layer',
    choices: [
      'Measures to protect the ozone layer',
      'Space exploration',
      'Weather patterns',
      'Plant growth',
    ],
    passage_excerpt:
      'International agreements have led to the phasing out of chemicals that damage the ozone layer. As a result, the ozone hole over Antarctica has begun to show signs of recovery. Scientists continue to monitor the situation closely.',
    meta: { topic: 'environment', difficulty: 'advanced' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the most appropriate heading.',
    correct_expression: 'How the brain processes language',
    choices: [
      'How the brain processes language',
      'Learning vocabulary',
      'Bilingual education',
      'Speech disorders',
    ],
    passage_excerpt:
      'When we read or hear words, different areas of the brain are activated. The left hemisphere is typically more involved in language tasks, but the right hemisphere also plays a role in understanding context and tone.',
    meta: { topic: 'science', difficulty: 'advanced' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the best heading for this paragraph.',
    correct_expression: 'Risks of sedentary behaviour',
    choices: [
      'Risks of sedentary behaviour',
      'Benefits of sleep',
      'Dietary guidelines',
      'Mental health support',
    ],
    passage_excerpt:
      'Sitting for long periods has been linked to an increased risk of heart disease, diabetes, and back pain. Experts recommend breaking up sitting time with short walks or stretches, and aiming for at least 150 minutes of moderate activity per week.',
    meta: { topic: 'health', difficulty: 'beginner' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best matches the paragraph?',
    correct_expression: 'The rise of social media',
    choices: [
      'The rise of social media',
      'Print newspapers',
      'Radio broadcasting',
      'Postal services',
    ],
    passage_excerpt:
      'Social media platforms have grown rapidly since the mid-2000s. They have changed how people communicate, share news, and conduct business. Concerns have been raised about privacy, misinformation, and the impact on mental health.',
    meta: { topic: 'technology', difficulty: 'beginner' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'Economic consequences of the war',
    choices: [
      'Economic consequences of the war',
      'Military strategy',
      'Role of women',
      'Peace negotiations',
    ],
    passage_excerpt:
      'The conflict left many countries in debt and caused widespread shortages of food and fuel. Reconstruction took decades, and some regions never fully recovered. The war also accelerated changes in the global economy.',
    meta: { topic: 'history', difficulty: 'advanced' },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best fits the paragraph?',
    correct_expression: 'Support for students with disabilities',
    choices: [
      'Support for students with disabilities',
      'Examination results',
      'School holidays',
      'Parent-teacher meetings',
    ],
    passage_excerpt:
      'Schools are required to make reasonable adjustments so that all students can participate fully. This may include extra time in exams, assistive technology, or support from a learning assistant. The aim is to remove barriers to learning.',
    meta: { topic: 'education', difficulty: 'intermediate' },
  },
];
