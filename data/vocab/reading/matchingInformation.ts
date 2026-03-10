/**
 * Matching Information – which paragraph contains this information?
 * 20+ questions, topic/difficulty distributed
 */

import type { ReadingQuestionSeed } from './types';
import { CATEGORY_BY_TYPE } from './types';

const C = CATEGORY_BY_TYPE.matching_information;

export const MATCHING_INFORMATION_SEED: ReadingQuestionSeed[] = [
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph contains the information that wind and water power have been used for centuries?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Wind and water have been used as sources of power for centuries. Early windmills were built in Persia around 500 AD. Paragraph B: Today, solar panels are the fastest-growing renewable technology. Paragraph C: Governments have set targets to reduce carbon emissions. Paragraph D: The cost of batteries has fallen sharply in the last decade.",
    strategy: 'Look for the paragraph that mentions the long history of wind and water power.',
    meta: {
      topic: 'history',
      difficulty: 'beginner',
      explanation: 'Paragraph A states "Wind and water have been used as sources of power for centuries" and gives the example of Persia around 500 AD.',
      distractor_note: 'B and D discuss current technology and cost; C discusses government targets. Only A describes historical use.',
      passage_group: 'match_info_renewable_history',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph mentions early windmills in Persia?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Wind and water have been used as sources of power for centuries. Early windmills were built in Persia around 500 AD. Paragraph B: Today, solar panels are the fastest-growing renewable technology. Paragraph C: Governments have set targets to reduce carbon emissions. Paragraph D: The cost of batteries has fallen sharply in the last decade.",
    strategy: 'Look for the paragraph that mentions Persia and windmills.',
    meta: {
      topic: 'history',
      difficulty: 'beginner',
      explanation: 'Paragraph A states "Early windmills were built in Persia around 500 AD".',
      distractor_note: 'B, C, and D do not mention Persia or early windmills.',
      passage_group: 'match_info_renewable_history',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where is the information that the sample size was relatively small?',
    correct_expression: 'Paragraph B',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The study aimed to measure the effect of the new drug. Paragraph B: The sample size was relatively small, and participants were drawn from a single region. Paragraph C: Results showed a significant improvement in symptoms. Paragraph D: Further research with larger groups is recommended.",
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'Paragraph B explicitly states "The sample size was relatively small" and adds that participants were from a single region.',
      distractor_note: 'A describes the aim; C describes results; D makes a recommendation. The limitation is in B.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph mentions that pollution levels have fallen in the city centre?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Since the introduction of the low-emission zone, pollution levels in the city centre have fallen by an average of 20 per cent. Paragraph B: Other cities are now considering similar schemes. Paragraph C: Critics argue that the zone has shifted traffic to surrounding areas. Paragraph D: Monitoring continues to track long-term trends.",
    meta: {
      topic: 'environment',
      difficulty: 'beginner',
      explanation: 'Paragraph A states "pollution levels in the city centre have fallen by an average of 20 per cent".',
      distractor_note: 'B and C discuss other cities and critics; D discusses monitoring. The fall in pollution is only in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where can you find the claim that early intervention leads to better outcomes?',
    correct_expression: 'Paragraph B',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Learning difficulties affect a significant number of children. Paragraph B: Studies show that identifying and addressing learning difficulties at an early age leads to better outcomes. Children who receive support before five often catch up. Paragraph C: Funding for such programmes has been inconsistent. Paragraph D: Parents are often the first to notice signs of difficulty.",
    meta: {
      topic: 'education',
      difficulty: 'intermediate',
      explanation: 'Paragraph B states "identifying and addressing learning difficulties at an early age leads to better outcomes" and "support before five".',
      distractor_note: 'A and D describe prevalence and who notices; C discusses funding. The outcome claim is in B.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph describes how the experiment was conducted?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Participants were randomly assigned to two groups. Group A received the treatment twice daily for six weeks; Group B received a placebo. Outcomes were measured at the start, midpoint, and end. Paragraph B: The results were published in a leading journal. Paragraph C: The team received funding from a government body. Paragraph D: Future work will focus on long-term follow-up.",
    meta: {
      topic: 'health',
      difficulty: 'intermediate',
      explanation: 'Paragraph A describes the method: random assignment, two groups, treatment vs placebo, and when outcomes were measured.',
      distractor_note: 'B is about publication; C about funding; D about future work. Only A describes how the experiment was conducted.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where is the statement that the technology was first developed in Japan?',
    correct_expression: 'Paragraph C',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Many devices now use this type of display. Paragraph B: Sales have increased year on year. Paragraph C: The technology was first developed in Japan in the early 1990s, before being adopted elsewhere. Paragraph D: Researchers are working on the next generation.",
    meta: {
      topic: 'technology',
      difficulty: 'beginner',
      explanation: 'Paragraph C states "The technology was first developed in Japan in the early 1990s".',
      distractor_note: 'A and B describe current use and sales; D describes future research. The origin is only in C.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph explains the causes of habitat loss?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Deforestation, urban expansion, and intensive farming have reduced the area available for wildlife. Many species are now confined to smaller, fragmented areas. Paragraph B: Conservation groups have called for stronger laws. Paragraph C: Some species have adapted to urban environments. Paragraph D: International agreements have had mixed success.",
    meta: {
      topic: 'environment',
      difficulty: 'intermediate',
      explanation: 'Paragraph A lists causes: deforestation, urban expansion, intensive farming, and describes the result (reduced area, fragmented).',
      distractor_note: 'B and D discuss responses; C discusses adaptation. The causes are only in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where is the view that reform is essential stated?',
    correct_expression: 'Paragraph B',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The current system has been in place for twenty years. Paragraph B: The author argues that reform is essential if the system is to meet future challenges. Without change, the approach will become unsustainable. Paragraph C: Several options have been put forward. Paragraph D: Implementation would require broad support.",
    meta: {
      topic: 'education',
      difficulty: 'advanced',
      explanation: 'Paragraph B contains "reform is essential" and "Without change... unsustainable".',
      distractor_note: 'A describes the status quo; C and D discuss options and implementation. The "essential" view is in B.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph mentions that the disease can be transmitted between humans and animals?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The disease can be transmitted between humans and certain animal species. This has raised concerns about a coordinated response across human and veterinary health services. Paragraph B: Vaccination programmes have been rolled out in some regions. Paragraph C: Symptoms typically appear within two weeks. Paragraph D: Research into new treatments is ongoing.",
    meta: {
      topic: 'health',
      difficulty: 'advanced',
      explanation: 'Paragraph A states "transmitted between humans and certain animal species" and mentions veterinary services.',
      distractor_note: 'B, C, and D discuss vaccination, symptoms, and research. Transmission type is only in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where can you find the information that the theory was initially met with scepticism?',
    correct_expression: 'Paragraph B',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The theory was first proposed in the 1920s. Paragraph B: When the theory was first put forward, it was met with scepticism. It took several decades and further evidence before it gained general acceptance. Paragraph C: Today it is taught in universities worldwide. Paragraph D: Applications of the theory have spread to many fields.",
    meta: {
      topic: 'science',
      difficulty: 'advanced',
      explanation: 'Paragraph B states "met with scepticism" and "several decades... before it gained general acceptance".',
      distractor_note: 'A only gives the date; C and D describe current status. The initial scepticism is in B.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph describes a change in how people shop?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Sales data from the past decade reveals a clear shift in how people shop. Online purchases have risen steadily, while visits to physical stores have declined. Paragraph B: Retailers have invested in their websites. Paragraph C: Delivery times have improved. Paragraph D: Some high streets have seen a revival.",
    meta: {
      topic: 'technology',
      difficulty: 'beginner',
      explanation: 'Paragraph A describes "a clear shift in how people shop", with online up and physical visits down.',
      distractor_note: 'B–D describe responses or other trends. The shift in behaviour is in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where is the building completion date given?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Construction began in 1847 and the building was completed in 1850. It has since been restored twice. Paragraph B: The architect was influenced by classical design. Paragraph C: The building now houses a museum. Paragraph D: Visitor numbers have increased in recent years.",
    meta: {
      topic: 'history',
      difficulty: 'beginner',
      explanation: 'Paragraph A states "the building was completed in 1850".',
      distractor_note: 'B–D discuss design, current use, and visitors. The date is only in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph states that both medication and exercise can improve outcomes when used together?',
    correct_expression: 'Paragraph B',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The condition affects millions of people. Paragraph B: Guidelines recommend a combination of medication and lifestyle changes, including regular exercise. Studies have shown that both can improve outcomes when used together. Paragraph C: Side effects are generally mild. Paragraph D: Long-term data are still being collected.",
    meta: {
      topic: 'health',
      difficulty: 'intermediate',
      explanation: 'Paragraph B says "both can improve outcomes when used together" referring to medication and exercise.',
      distractor_note: 'A describes prevalence; C and D discuss side effects and data. The combined effect is in B.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where is the number of countries that ratified the treaty mentioned?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The international treaty was opened for signature in 2015 and has since been ratified by over 120 countries. Paragraph B: It aims to limit global temperature rise. Paragraph C: Each country sets its own targets. Paragraph D: Progress is reviewed every five years.",
    meta: {
      topic: 'environment',
      difficulty: 'advanced',
      explanation: 'Paragraph A states "ratified by over 120 countries".',
      distractor_note: 'B–D describe aims and process. The number is only in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph explains why the empire collapsed?',
    correct_expression: 'Paragraph B',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: At its height, the empire controlled territory on three continents. Paragraph B: Historians have put forward several explanations for the collapse. These include economic problems, invasions from the north, and internal political instability. Paragraph C: Written records from the period are scarce. Paragraph D: Archaeological evidence continues to emerge.",
    meta: {
      topic: 'history',
      difficulty: 'intermediate',
      explanation: 'Paragraph B gives "explanations for the collapse" and lists economic problems, invasions, and political instability.',
      distractor_note: 'A describes extent; C and D discuss sources. The reasons for collapse are in B.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where is the suggestion that the device can be used where connectivity is limited?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The device can store up to 32 GB of data and has a battery life of approximately ten hours. It is designed for use in the field where connectivity may be limited. Paragraph B: A range of accessories is available. Paragraph C: The manufacturer plans to release an updated model. Paragraph D: User reviews have been positive.",
    meta: {
      topic: 'technology',
      difficulty: 'intermediate',
      explanation: 'Paragraph A states "designed for use in the field where connectivity may be limited".',
      distractor_note: 'B–D discuss accessories, updates, and reviews. The connectivity point is only in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph describes support for students with disabilities?',
    correct_expression: 'Paragraph B',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Schools must meet certain standards. Paragraph B: Schools are required to make reasonable adjustments so that all students can participate fully. This may include extra time in exams, assistive technology, or support from a learning assistant. Paragraph C: Funding for these measures varies. Paragraph D: Training for staff has been expanded.",
    meta: {
      topic: 'education',
      difficulty: 'intermediate',
      explanation: 'Paragraph B describes "reasonable adjustments", "extra time", "assistive technology", and "learning assistant"—support for participation.',
      distractor_note: 'A is general; C and D discuss funding and training. The support measures are in B.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where is the discovery of the material by accident described?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The material was discovered by accident in 1945 when a researcher noticed unusual properties in a sample that had been left near a heat source. Paragraph B: Further experiments confirmed its potential. Paragraph C: It was first used in consumer products in the 1960s. Paragraph D: Demand has grown rapidly in recent years.",
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'Paragraph A states "discovered by accident" and describes the circumstance (left near a heat source).',
      distractor_note: 'B–D describe follow-up, use, and demand. The accidental discovery is only in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph states that the system remains in use today?',
    correct_expression: 'Paragraph B',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The system was developed in the 1980s. Paragraph B: Although the system was developed in the 1980s, it remains in use today. Updates have been made to improve security and compatibility. Paragraph C: Some users have requested a modern replacement. Paragraph D: Support will continue for at least five more years.",
    meta: {
      topic: 'technology',
      difficulty: 'advanced',
      explanation: 'Paragraph B states "it remains in use today" and mentions updates.',
      distractor_note: 'A only gives the date; C and D discuss replacement and support. The "still in use" claim is in B.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where can you find the recommendation to limit processed foods and sugar?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: Research has shown that a balanced diet rich in fruit and vegetables can lower the risk of heart disease and some cancers. Health authorities recommend limiting processed foods and sugar to maintain long-term health. Paragraph B: Exercise is also important. Paragraph C: Sleep and stress play a role. Paragraph D: Individual needs vary.",
    meta: {
      topic: 'health',
      difficulty: 'beginner',
      explanation: 'Paragraph A states "Health authorities recommend limiting processed foods and sugar".',
      distractor_note: 'B–D discuss exercise, sleep, and variation. The dietary recommendation is in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph mentions that the event would be held again next year?',
    correct_expression: 'Paragraph B',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: The event attracted participants from more than 30 countries. Paragraph B: Organisers described the level of interest as encouraging and announced that the event would be held again next year. Paragraph C: Workshops covered a range of topics. Paragraph D: Feedback from attendees was collected.",
    meta: {
      topic: 'education',
      difficulty: 'intermediate',
      explanation: 'Paragraph B states "announced that the event would be held again next year".',
      distractor_note: 'A gives participant numbers; C and D describe workshops and feedback. The repeat announcement is in B.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Where is the role of the left hemisphere in language tasks mentioned?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: When we read or hear words, different areas of the brain are activated. The left hemisphere is typically more involved in language tasks, but the right hemisphere also plays a role in understanding context and tone. Paragraph B: Damage to these areas can affect speech. Paragraph C: Children acquire language rapidly. Paragraph D: Bilingualism may have cognitive benefits.",
    meta: {
      topic: 'science',
      difficulty: 'advanced',
      explanation: 'Paragraph A states "The left hemisphere is typically more involved in language tasks".',
      distractor_note: 'B–D discuss damage, acquisition, and bilingualism. The hemisphere role is only in A.',
    },
  },
  {
    question_type: 'matching_information',
    category: C,
    mode: 'click',
    prompt: 'Which paragraph describes the phasing out of chemicals that damage the ozone layer?',
    correct_expression: 'Paragraph A',
    choices: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
    passage_excerpt:
      "Paragraph A: International agreements have led to the phasing out of chemicals that damage the ozone layer. As a result, the ozone hole over Antarctica has begun to show signs of recovery. Paragraph B: Scientists continue to monitor the situation. Paragraph C: The problem was first identified in the 1980s. Paragraph D: Alternatives to the harmful chemicals are now widely used.",
    meta: {
      topic: 'environment',
      difficulty: 'advanced',
      explanation: 'Paragraph A states "International agreements have led to the phasing out of chemicals that damage the ozone layer".',
      distractor_note: 'B–D discuss monitoring, history, and alternatives. The phasing out is in A.',
    },
  },
];
