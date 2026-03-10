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
    meta: {
      topic: 'history',
      difficulty: 'intermediate',
      explanation: 'The paragraph describes when and where wind and water power were first used (centuries ago, Persia, China, Rome) and says they "laid the foundation" for today\'s sector—i.e. origins.',
      distractor_note: '"Problems with fossil fuels" and "Future technology" are not discussed; "Government policy" is not mentioned.',
    },
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
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'The main idea is difficulties: "obstacles", "equipment failures", "unpredictable weather", "limited access", "delayed progress", "setbacks". The heading captures this.',
      distractor_note: '"Successful experiments" is the opposite; "Public opinion" and "Funding sources" are not discussed.',
    },
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
    meta: {
      topic: 'health',
      difficulty: 'intermediate',
      explanation: 'The paragraph describes the method: random assignment, two groups, what each group received (treatment vs placebo), and when outcomes were measured. So "how" the experiment was conducted.',
      distractor_note: '"Why the study failed" is not suggested; "Interview" and "Recommendations" are unrelated.',
    },
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
    meta: {
      topic: 'technology',
      difficulty: 'beginner',
      explanation: 'The paragraph is about a "clear shift" in how people shop: more online, fewer physical visits, comparing prices on phones. So a change in consumer behaviour.',
      distractor_note: '"History of retail" is too broad; "Technical specifications" and "Environmental legislation" are not mentioned.',
    },
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
    meta: {
      topic: 'education',
      difficulty: 'intermediate',
      explanation: 'The paragraph focuses on early identification and support ("early age", "before five") and the positive result ("better outcomes", "catch up"). So the benefits of early intervention.',
      distractor_note: '"Cost", "Staff training", and "Patient complaints" are not discussed.',
    },
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
    meta: {
      topic: 'environment',
      difficulty: 'intermediate',
      explanation: 'The paragraph lists causes (deforestation, urban expansion, intensive farming) that "have reduced the area" for wildlife—i.e. causes of habitat loss.',
      distractor_note: '"Benefits of wildlife" and "New species" are not the focus; "Tourism" is not mentioned.',
    },
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
    meta: {
      topic: 'health',
      difficulty: 'beginner',
      explanation: 'The paragraph is about diet (balanced diet, fruit and vegetables, processed foods, sugar) and its effect on reducing disease risk—i.e. the role of diet in disease prevention.',
      distractor_note: '"Surgery", "History of medicine", and "Cost" are not discussed.',
    },
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
    meta: {
      topic: 'science',
      difficulty: 'advanced',
      explanation: 'The paragraph lists weaknesses: small sample, single region, short follow-up. It says "these factors should be considered when interpreting"—so limitations of the study.',
      distractor_note: '"Main results" would be outcomes; "Acknowledgements" and "Future research" are different sections.',
    },
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
    meta: {
      topic: 'technology',
      difficulty: 'intermediate',
      explanation: 'The paragraph is about how technology (automation, AI) affects work: jobs lost, new roles, retraining. So the impact of technology on employment.',
      distractor_note: '"Education in the past", "Leisure", and "Transport" are not the main idea.',
    },
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
    meta: {
      topic: 'history',
      difficulty: 'advanced',
      explanation: 'The paragraph gives "explanations for the collapse" and lists reasons: economic problems, invasions, political instability. So reasons for the decline of the empire.',
      distractor_note: '"Military victories" and "Art and culture" are not about decline; "Daily life" is unrelated.',
    },
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
    meta: {
      topic: 'education',
      difficulty: 'beginner',
      explanation: 'The paragraph describes changes schools have made: flexible spaces, digital tools, project-based activities. So how schools are adapting to change.',
      distractor_note: '"University admissions", "Sports", and "School buildings" are not the focus.',
    },
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
    meta: {
      topic: 'environment',
      difficulty: 'intermediate',
      explanation: 'The paragraph presents "evidence" (temperatures, ice caps, weather) and "Scientific data" that "support these observations"—i.e. evidence of climate change.',
      distractor_note: '"Weather forecasting", "Ocean travel", and "Farming methods" are not discussed.',
    },
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
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'The paragraph describes a sequence: review literature → design experiment → ethical approval → data collection → analysis → publication. So steps in the research process.',
      distractor_note: '"Famous scientists", "Equipment", and "Publication fees" are not the main idea.',
    },
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
    meta: {
      topic: 'health',
      difficulty: 'intermediate',
      explanation: 'The paragraph covers what patients experience (symptoms) and how the condition is confirmed (blood test, imaging)—i.e. symptoms and diagnosis.',
      distractor_note: '"History of the hospital", "Nursing care", and "Medical insurance" are not discussed.',
    },
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
    meta: {
      topic: 'history',
      difficulty: 'advanced',
      explanation: 'The paragraph describes how writing emerged, its early use, and how it spread and was adapted—i.e. the development of writing systems.',
      distractor_note: '"Modern languages", "Translation software", and "Famous writers" are not the focus.',
    },
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
    meta: {
      topic: 'education',
      difficulty: 'beginner',
      explanation: 'The paragraph lists benefits: own pace, any time, remote access, wide range of courses. So advantages of online learning.',
      distractor_note: '"School uniforms", "Examination systems", and "Teacher recruitment" are not mentioned.',
    },
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
    meta: {
      topic: 'environment',
      difficulty: 'advanced',
      explanation: 'The paragraph describes measures (agreements, phasing out harmful chemicals) and the result (recovery of the ozone hole). So measures to protect the ozone layer.',
      distractor_note: '"Space exploration", "Weather patterns", and "Plant growth" are unrelated.',
    },
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
    meta: {
      topic: 'science',
      difficulty: 'advanced',
      explanation: 'The paragraph describes which brain areas are involved when we process language (read/hear words, left/right hemisphere). So how the brain processes language.',
      distractor_note: '"Learning vocabulary", "Bilingual education", and "Speech disorders" are not the focus.',
    },
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
    meta: {
      topic: 'health',
      difficulty: 'beginner',
      explanation: 'The paragraph links sitting for long periods to health risks (heart disease, diabetes, back pain). So risks of sedentary behaviour.',
      distractor_note: '"Benefits of sleep", "Dietary guidelines", and "Mental health support" are not the topic.',
    },
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
    meta: {
      topic: 'technology',
      difficulty: 'beginner',
      explanation: 'The paragraph describes the growth of social media since the mid-2000s and its effects. So the rise of social media.',
      distractor_note: '"Print newspapers", "Radio", and "Postal services" are not discussed.',
    },
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
    meta: {
      topic: 'history',
      difficulty: 'advanced',
      explanation: 'The paragraph describes economic effects: debt, shortages, reconstruction, changes in the global economy. So economic consequences of the war.',
      distractor_note: '"Military strategy", "Role of women", and "Peace negotiations" are not the focus.',
    },
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
    meta: {
      topic: 'education',
      difficulty: 'intermediate',
      explanation: 'The paragraph describes adjustments (extra time, assistive technology, learning assistant) so all students can participate—i.e. support for students with disabilities.',
      distractor_note: '"Examination results", "School holidays", and "Parent-teacher meetings" are not discussed.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'The discovery of the material',
    choices: ['The discovery of the material', 'Uses in medicine', 'Environmental impact', 'Cost of production'],
    passage_excerpt:
      'The material was discovered by accident in 1945 when a researcher noticed unusual properties in a sample that had been left near a heat source. Further experiments confirmed its potential for industrial use.',
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'The paragraph describes how and when the material was discovered (by accident, 1945, heat source). So the discovery of the material.',
      distractor_note: 'Uses, impact, and cost are not the main focus.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best fits this paragraph?',
    correct_expression: 'Recommendations for a healthy diet',
    choices: ['Recommendations for a healthy diet', 'History of nutrition', 'Food packaging', 'Restaurant reviews'],
    passage_excerpt:
      'Health authorities recommend limiting processed foods and sugar to maintain long-term health. A balanced diet rich in fruit and vegetables can lower the risk of heart disease and some cancers.',
    meta: {
      topic: 'health',
      difficulty: 'beginner',
      explanation: 'The paragraph gives recommendations: limit processed foods/sugar, balanced diet, fruit and vegetables. So recommendations for a healthy diet.',
      distractor_note: 'History, packaging, and reviews are not mentioned.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the most appropriate heading.',
    correct_expression: 'Why the event will be repeated',
    choices: ['Why the event will be repeated', 'Ticket prices', 'Location details', 'List of speakers'],
    passage_excerpt:
      'Organisers described the level of interest as encouraging and announced that the event would be held again next year. Plans are already under way to secure a larger venue.',
    meta: {
      topic: 'education',
      difficulty: 'intermediate',
      explanation: 'The paragraph explains that interest was encouraging and the event will be held again—i.e. why it will be repeated.',
      distractor_note: 'Prices, location, and speakers are not the main point.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'Transmission of the disease',
    choices: ['Transmission of the disease', 'Treatment options', 'Vaccine development', 'Patient stories'],
    passage_excerpt:
      'The disease can be transmitted between humans and certain animal species. This has raised concerns about a coordinated response across human and veterinary health services.',
    meta: {
      topic: 'health',
      difficulty: 'advanced',
      explanation: 'The paragraph focuses on how the disease is transmitted (humans and animals) and the response. So transmission of the disease.',
      distractor_note: 'Treatment, vaccine, and patient stories are not discussed.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best matches the paragraph?',
    correct_expression: 'Initial reaction to the theory',
    choices: ['Initial reaction to the theory', 'Later applications', 'Biography of the author', 'Related experiments'],
    passage_excerpt:
      'When the theory was first put forward, it was met with scepticism. It took several decades and further evidence before it gained general acceptance.',
    meta: {
      topic: 'science',
      difficulty: 'advanced',
      explanation: 'The paragraph describes the initial reaction (scepticism) and later acceptance. So initial reaction to the theory.',
      distractor_note: 'Applications, biography, and related experiments are not the focus.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the best heading for this paragraph.',
    correct_expression: 'Benefits of combining treatments',
    choices: ['Benefits of combining treatments', 'Side effects', 'Cost comparison', 'Patient feedback'],
    passage_excerpt:
      'Guidelines recommend a combination of medication and lifestyle changes, including regular exercise. Studies have shown that both can improve outcomes when used together.',
    meta: {
      topic: 'health',
      difficulty: 'intermediate',
      explanation: 'The paragraph recommends combining medication and exercise and states both improve outcomes together. So benefits of combining treatments.',
      distractor_note: 'Side effects, cost, and feedback are not discussed.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best fits this paragraph?',
    correct_expression: 'Design for use in remote areas',
    choices: ['Design for use in remote areas', 'Customer reviews', 'Warranty information', 'Competitor comparison'],
    passage_excerpt:
      'The device can store up to 32 GB of data and has a battery life of approximately ten hours. It is designed for use in the field where connectivity may be limited.',
    meta: {
      topic: 'technology',
      difficulty: 'intermediate',
      explanation: 'The paragraph describes design features (storage, battery) for use where connectivity is limited—i.e. remote areas.',
      distractor_note: 'Reviews, warranty, and competitors are not mentioned.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'Reasons for the empire\'s collapse',
    choices: ['Reasons for the empire\'s collapse', 'Military victories', 'Art and culture', 'Daily life'],
    passage_excerpt:
      'Historians have put forward several explanations for the collapse. These include economic problems, invasions from the north, and internal political instability.',
    meta: {
      topic: 'history',
      difficulty: 'intermediate',
      explanation: 'The paragraph gives explanations for the collapse and lists reasons. So reasons for the empire\'s collapse.',
      distractor_note: 'Victories, art, and daily life are not discussed.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best matches the paragraph?',
    correct_expression: 'Recovery of the ozone layer',
    choices: ['Recovery of the ozone layer', 'Space travel', 'Weather prediction', 'Crop yields'],
    passage_excerpt:
      'International agreements have led to the phasing out of chemicals that damage the ozone layer. As a result, the ozone hole over Antarctica has begun to show signs of recovery.',
    meta: {
      topic: 'environment',
      difficulty: 'advanced',
      explanation: 'The paragraph describes measures and the result: the ozone hole "has begun to show signs of recovery". So recovery of the ozone layer.',
      distractor_note: 'Space, weather, and crops are not mentioned.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the most appropriate heading.',
    correct_expression: 'A shift in shopping habits',
    choices: ['A shift in shopping habits', 'History of retail', 'Technical specifications', 'Environmental law'],
    passage_excerpt:
      'Sales data from the past decade reveals a clear shift in how people shop. Online purchases have risen steadily, while visits to physical stores have declined.',
    meta: {
      topic: 'technology',
      difficulty: 'beginner',
      explanation: 'The paragraph describes a "clear shift" in how people shop (online up, physical down). So a shift in shopping habits.',
      distractor_note: 'History, specifications, and law are not the focus.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'Completion date of the building',
    choices: ['Completion date of the building', 'Architect\'s biography', 'Current use', 'Visitor numbers'],
    passage_excerpt:
      'Construction began in 1847 and the building was completed in 1850. It has since been restored twice and is now open to the public.',
    meta: {
      topic: 'history',
      difficulty: 'beginner',
      explanation: 'The paragraph gives the completion date (1850) and construction dates. So completion date of the building.',
      distractor_note: 'Architect, current use, and visitors are secondary.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best fits this paragraph?',
    correct_expression: 'Limitations of the study',
    choices: ['Limitations of the study', 'Main results', 'Funding sources', 'Author background'],
    passage_excerpt:
      'The sample size was relatively small, and participants were drawn from a single region. Further research with larger and more diverse groups is recommended.',
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'The paragraph describes limitations (small sample, single region) and recommends further research. So limitations of the study.',
      distractor_note: 'Results, funding, and author are not the focus.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the best heading for this paragraph.',
    correct_expression: 'Impact of the low-emission zone',
    choices: ['Impact of the low-emission zone', 'Vehicle technology', 'Public transport', 'Parking charges'],
    passage_excerpt:
      'Since the introduction of the low-emission zone, pollution levels in the city centre have fallen by an average of 20 per cent. Other cities are now considering similar schemes.',
    meta: {
      topic: 'environment',
      difficulty: 'beginner',
      explanation: 'The paragraph describes the impact of the zone: pollution "have fallen by an average of 20 per cent". So impact of the low-emission zone.',
      distractor_note: 'Technology, transport, and parking are not discussed.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best matches the paragraph?',
    correct_expression: 'Origin of the technology',
    choices: ['Origin of the technology', 'Current sales', 'Future plans', 'User reviews'],
    passage_excerpt:
      'The technology was first developed in Japan in the early 1990s, before being adopted by manufacturers in other countries.',
    meta: {
      topic: 'technology',
      difficulty: 'beginner',
      explanation: 'The paragraph states where and when the technology was first developed. So origin of the technology.',
      distractor_note: 'Sales, plans, and reviews are not mentioned.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'Causes of wildlife decline',
    choices: ['Causes of wildlife decline', 'Benefits of conservation', 'New species', 'Tourism'],
    passage_excerpt:
      'Deforestation, urban expansion, and intensive farming have reduced the area available for wildlife. Many species are now confined to smaller, fragmented areas.',
    meta: {
      topic: 'environment',
      difficulty: 'intermediate',
      explanation: 'The paragraph lists causes (deforestation, expansion, farming) that reduced area for wildlife. So causes of wildlife decline.',
      distractor_note: 'Conservation benefits, new species, and tourism are not the focus.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best fits this paragraph?',
    correct_expression: 'Method of the experiment',
    choices: ['Method of the experiment', 'Why the study failed', 'Interview with the author', 'Recommendations'],
    passage_excerpt:
      'Participants were randomly assigned to two groups. Group A received the treatment twice daily for six weeks; Group B received a placebo. Outcomes were measured at the start, midpoint, and end.',
    meta: {
      topic: 'health',
      difficulty: 'intermediate',
      explanation: 'The paragraph describes the method: random assignment, two groups, treatment vs placebo, measurement times. So method of the experiment.',
      distractor_note: 'Failure, interview, and recommendations are not discussed.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Select the best heading for this paragraph.',
    correct_expression: 'Number of countries that ratified the treaty',
    choices: ['Number of countries that ratified the treaty', 'Aims of the agreement', 'Review process', 'Alternatives'],
    passage_excerpt:
      'The international treaty was opened for signature in 2015 and has since been ratified by over 120 countries. It aims to limit global temperature rise.',
    meta: {
      topic: 'environment',
      difficulty: 'advanced',
      explanation: 'The paragraph states the treaty "has since been ratified by over 120 countries". So number of countries that ratified the treaty.',
      distractor_note: 'Aims, review, and alternatives are secondary.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Which heading best matches the paragraph?',
    correct_expression: 'Language and the brain',
    choices: ['Language and the brain', 'Vocabulary learning', 'Bilingualism', 'Speech therapy'],
    passage_excerpt:
      'When we read or hear words, different areas of the brain are activated. The left hemisphere is typically more involved in language tasks, but the right hemisphere also plays a role.',
    meta: {
      topic: 'science',
      difficulty: 'advanced',
      explanation: 'The paragraph describes how the brain is involved in language (areas activated, left/right hemisphere). So language and the brain.',
      distractor_note: 'Vocabulary, bilingualism, and therapy are not the focus.',
    },
  },
  {
    question_type: 'matching_headings',
    category: C,
    mode: 'click',
    prompt: 'Choose the best heading for this paragraph.',
    correct_expression: 'Early use of wind and water power',
    choices: ['Early use of wind and water power', 'Problems with fossil fuels', 'Future technology', 'Government policy'],
    passage_excerpt:
      'Wind and water have been used as sources of power for centuries. Early windmills were built in Persia around 500 AD. These simple technologies laid the foundation for today\'s renewable sector.',
    meta: {
      topic: 'history',
      difficulty: 'intermediate',
      explanation: 'The paragraph describes early use (centuries, Persia 500 AD, wind and water). So early use of wind and water power.',
      distractor_note: 'Fossil fuels, future tech, and policy are not discussed.',
    },
  },
];
