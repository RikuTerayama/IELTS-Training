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
    meta: {
      topic: 'science',
      difficulty: 'beginner',
      explanation: 'The passage states "over a period of six months" and "recording their progress at regular intervals", so the study length is explicitly given.',
      distractor_note: 'False would mean the study did not last six months; Not Given would mean the duration was never stated.',
      passage_group: 'tfng_six_month_study',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Progress was recorded at regular intervals.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Researchers observed the participants over a period of six months, recording their progress at regular intervals.',
    strategy: 'Find the explicit statement about how progress was recorded.',
    meta: {
      topic: 'science',
      difficulty: 'beginner',
      explanation: 'The passage states "recording their progress at regular intervals".',
      distractor_note: 'Not Given would mean interval recording was not stated; here it is explicit.',
      passage_group: 'tfng_six_month_study',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The research lasted longer than a year.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Researchers observed the participants over a period of six months, recording their progress at regular intervals.',
    strategy: 'Six months is not longer than a year.',
    meta: {
      topic: 'science',
      difficulty: 'beginner',
      explanation: 'The passage says "over a period of six months". Six months is less than a year, so the statement is false.',
      distractor_note: 'Not Given would apply if duration was not stated; here it is (six months).',
      passage_group: 'tfng_six_month_study',
    },
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
    meta: {
      topic: 'health',
      difficulty: 'beginner',
      explanation: 'The passage does not mention age at all. We only know there were 500 volunteers and they did a questionnaire and follow-up sessions.',
      distractor_note: 'True would require an explicit statement about age; False would require a statement that some were 30 or over. Neither appears.',
    },
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
    meta: {
      topic: 'education',
      difficulty: 'beginner',
      explanation: '35% supported the policy. A majority would be over 50%. The passage says "only 35 per cent" and "the rest were either opposed or undecided", so the statement is contradicted.',
      distractor_note: 'Not Given would apply if the passage did not give figures for support. Here it does—35%—so we can judge the claim as false.',
    },
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
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'The passage says the project received £2 million in funding but does not say who provided it. Government, private donors, or others are not mentioned.',
      distractor_note: 'True would need an explicit government source; False would need a statement that funding was not from government. Neither is there.',
    },
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
    meta: {
      topic: 'technology',
      difficulty: 'beginner',
      explanation: 'The passage clearly states "first developed in Japan in the early 1990s".',
      distractor_note: 'False would mean it was not first developed in Japan; Not Given would mean the origin was not stated.',
    },
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
    meta: {
      topic: 'environment',
      difficulty: 'beginner',
      explanation: '"Over the past two decades" = last twenty years; "the rate of deforestation has risen significantly" matches the statement.',
      distractor_note: 'The passage gives a clear trend, so we can answer True rather than Not Given.',
    },
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
    meta: {
      topic: 'health',
      difficulty: 'intermediate',
      explanation: 'We are told it is approved for adults and trials are ongoing for children. The passage does not say it is suitable for all ages—only that children are still being studied.',
      distractor_note: 'True would require a clear statement that all age groups can use it; False would require a statement that it is not suitable for some ages. We have neither.',
    },
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
    meta: {
      topic: 'education',
      difficulty: 'intermediate',
      explanation: 'The passage states "No entrance exam is required". So the claim that students must pass an entrance exam is false.',
      distractor_note: 'Not Given would apply if the passage did not mention exams. Here it explicitly says no exam is required.',
    },
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
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'The passage mentions "different batches" and "consistent" results but never says the experiment was repeated three times. The number of repetitions is not stated.',
      distractor_note: 'True would need "three times" in the text; False would need a different number or that it was not repeated. Neither appears.',
    },
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
    meta: {
      topic: 'history',
      difficulty: 'beginner',
      explanation: 'The passage states "the building was completed in 1850" explicitly.',
      distractor_note: 'The date is clearly given, so the answer is True, not Not Given.',
    },
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
    meta: {
      topic: 'technology',
      difficulty: 'intermediate',
      explanation: 'The passage says the software is "available" and mentions "basic" and "professional" versions but never states whether it is free to download or paid.',
      distractor_note: 'Price or cost is not mentioned, so we cannot say True or False—hence Not Given.',
    },
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
    meta: {
      topic: 'environment',
      difficulty: 'intermediate',
      explanation: 'The passage states "pollution levels in the city centre have fallen by an average of 20 per cent", so the statement is directly supported.',
      distractor_note: 'The text gives a clear cause (low-emission zone) and effect (fall in pollution), so True is correct.',
    },
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
    meta: {
      topic: 'education',
      difficulty: 'advanced',
      explanation: 'The author says reform is "essential" and that without change the approach will become "unsustainable". So the author believes change is necessary, not unnecessary.',
      distractor_note: 'The author\'s view is clearly stated, so we can answer False. Not Given would mean the author\'s view was not expressed.',
    },
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
    meta: {
      topic: 'health',
      difficulty: 'advanced',
      explanation: 'The passage says the disease "can be transmitted between humans and certain animal species", so it affects both humans and animals. "Only humans" is contradicted.',
      distractor_note: 'Not Given would apply if the passage did not mention animals. Here it explicitly mentions animal species and veterinary health.',
    },
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
    meta: {
      topic: 'science',
      difficulty: 'advanced',
      explanation: 'The passage says the theory was "met with scepticism" when first put forward and "took several decades" to gain acceptance. So it was not widely accepted at first.',
      distractor_note: 'The timeline is clear: first scepticism, later acceptance. So the statement is false.',
    },
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
    meta: {
      topic: 'technology',
      difficulty: 'intermediate',
      explanation: 'The passage says the device is for use "where connectivity may be limited" but does not say whether it requires an internet connection or can work offline. Requirement of internet is not stated.',
      distractor_note: 'We can infer it might work offline, but the passage does not explicitly say "requires" or "does not require" internet. So Not Given.',
    },
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
    meta: {
      topic: 'environment',
      difficulty: 'advanced',
      explanation: '"Ratified by over 120 countries" means more than 120 have signed/ratified. So "more than 100" is true.',
      distractor_note: 'Ratification is the formal adoption of a treaty, so "signed" in the question is satisfied by "ratified by over 120".',
    },
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
    meta: {
      topic: 'education',
      difficulty: 'intermediate',
      explanation: 'The passage gives numbers (30+ countries) and says interest was "encouraging" but never states what was "expected" or whether attendance was above or below expectations.',
      distractor_note: 'Without a stated expectation, we cannot judge if attendance was lower than expected. Hence Not Given.',
    },
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
    meta: {
      topic: 'history',
      difficulty: 'intermediate',
      explanation: 'Europe, North Africa, and the Middle East are three distinct regions. Although "continent" is not used, Europe is a continent; North Africa is part of Africa; the Middle East spans Asia (and sometimes Africa). So "three continents" is supported.',
      distractor_note: 'The passage explicitly lists three areas that correspond to three continents, so True is correct.',
    },
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
    meta: {
      topic: 'health',
      difficulty: 'advanced',
      explanation: 'The passage says both medication and exercise improve outcomes "when used together". It does not compare which is more effective on its own.',
      distractor_note: 'True would need a statement that exercise is more effective; False would need that medication is more effective or equal. The passage only says "both" help together.',
    },
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
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'The passage states "discovered by accident" and describes the accidental circumstance (left near a heat source).',
      distractor_note: 'The wording in the passage matches the statement exactly, so True.',
    },
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
    meta: {
      topic: 'technology',
      difficulty: 'advanced',
      explanation: '"Remains in use today" directly contradicts "no longer in use". The system is still in use.',
      distractor_note: 'Not Given would mean the passage did not say whether it is still in use. Here it explicitly says "remains in use today".',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The event will be held again next year.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Organisers described the level of interest as encouraging and announced that the event would be held again next year.',
    meta: {
      topic: 'education',
      difficulty: 'beginner',
      explanation: 'The passage explicitly states "the event would be held again next year".',
      distractor_note: 'False would mean it will not be held; Not Given would mean the passage does not say. Here it is clearly stated.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Participants were required to have a university degree.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The event attracted participants from more than 30 countries. Workshops covered a range of topics from climate science to public policy.',
    strategy: 'Check whether any participation requirement (e.g. degree) is stated.',
    meta: {
      topic: 'education',
      difficulty: 'beginner',
      explanation: 'The passage does not state whether participants were required to have a degree. Participation requirements are not mentioned.',
      distractor_note: 'True would need an explicit degree requirement; False would need a statement that no degree was required. Neither appears.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Pollution levels in the city centre have fallen.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Since the introduction of the low-emission zone, pollution levels in the city centre have fallen by an average of 20 per cent.',
    meta: {
      topic: 'environment',
      difficulty: 'beginner',
      explanation: 'The passage states "pollution levels in the city centre have fallen by an average of 20 per cent".',
      distractor_note: 'False would mean they have not fallen; Not Given would mean the passage does not say. Here it is explicitly stated.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The treaty has been ratified by over 100 countries.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The international treaty was opened for signature in 2015 and has since been ratified by over 120 countries.',
    meta: {
      topic: 'environment',
      difficulty: 'intermediate',
      explanation: 'Over 120 countries is over 100, so the statement is true.',
      distractor_note: 'False would mean 100 or fewer; the passage says over 120.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The material was discovered intentionally.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The material was discovered by accident in 1945 when a researcher noticed unusual properties in a sample that had been left near a heat source.',
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: '"By accident" means it was not intentional. The statement says "intentionally", which is the opposite.',
      distractor_note: 'True would mean it was on purpose; the passage says "by accident".',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The disease can be transmitted between humans and animals.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The disease can be transmitted between humans and certain animal species. This has raised concerns about a coordinated response.',
    meta: {
      topic: 'health',
      difficulty: 'advanced',
      explanation: 'The passage states "transmitted between humans and certain animal species".',
      distractor_note: 'False would mean it cannot; Not Given would mean the passage does not say. Here it is clearly stated.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The theory was immediately accepted by the scientific community.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'When the theory was first put forward, it was met with scepticism. It took several decades and further evidence before it gained general acceptance.',
    meta: {
      topic: 'science',
      difficulty: 'advanced',
      explanation: 'The passage says it was "met with scepticism" and took "several decades" to gain acceptance. So it was not immediately accepted.',
      distractor_note: 'True would mean immediate acceptance; the passage says the opposite.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Medication and exercise together improve outcomes.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Studies have shown that both medication and lifestyle changes, including regular exercise, can improve outcomes when used together.',
    meta: {
      topic: 'health',
      difficulty: 'intermediate',
      explanation: 'The passage states "both... can improve outcomes when used together" (medication and lifestyle/exercise).',
      distractor_note: 'False would mean they do not; Not Given would mean the passage does not say. Here it is stated.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The device is designed for use where connectivity is unlimited.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The device is designed for use in the field where connectivity may be limited. It can store up to 32 GB of data and has a battery life of approximately ten hours.',
    meta: {
      topic: 'technology',
      difficulty: 'intermediate',
      explanation: 'The passage says "where connectivity may be limited", so connectivity is not unlimited. The statement is contradicted.',
      distractor_note: 'True would mean unlimited connectivity; the passage says "limited".',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The sample size was large.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The sample size was relatively small, and participants were drawn from a single region. Further research with larger groups is recommended.',
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'The passage states "The sample size was relatively small". So the statement "large" is false.',
      distractor_note: 'True would mean large; the passage says "relatively small".',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Funding for the study came from the government.',
    correct_expression: 'Not Given',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The study received £500,000 in funding. Researchers used the money to purchase equipment and recruit participants from five regions.',
    meta: {
      topic: 'science',
      difficulty: 'intermediate',
      explanation: 'The passage says the study received funding but does not state the source (government, private, etc.).',
      distractor_note: 'True would need an explicit government source; False would need a statement that it was not from government. Neither appears.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Health authorities recommend limiting processed foods.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Health authorities recommend limiting processed foods and sugar to maintain long-term health.',
    meta: {
      topic: 'health',
      difficulty: 'beginner',
      explanation: 'The passage states "Health authorities recommend limiting processed foods and sugar".',
      distractor_note: 'False would mean they do not recommend this; Not Given would mean the passage does not say. Here it is stated.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The left hemisphere is more involved in language tasks.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The left hemisphere is typically more involved in language tasks, but the right hemisphere also plays a role in understanding context and tone.',
    meta: {
      topic: 'science',
      difficulty: 'advanced',
      explanation: 'The passage states "The left hemisphere is typically more involved in language tasks".',
      distractor_note: 'False would mean it is not; Not Given would mean the passage does not say. Here it is explicitly stated.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Reform is described as optional.',
    correct_expression: 'False',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'The author argues that reform is essential if the system is to meet future challenges. Without change, the approach will become unsustainable.',
    meta: {
      topic: 'education',
      difficulty: 'advanced',
      explanation: 'The passage says reform is "essential", not optional. So the statement is false.',
      distractor_note: 'True would mean optional; the passage says "essential".',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Online purchases have increased over the past decade.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Sales data from the past decade reveals a clear shift. Online purchases have risen steadily, while visits to physical stores have declined.',
    meta: {
      topic: 'technology',
      difficulty: 'beginner',
      explanation: 'The passage states "Online purchases have risen steadily" over the past decade.',
      distractor_note: 'False would mean they have not risen; Not Given would mean the passage does not say. Here it is stated.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'The ozone hole has begun to recover.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'International agreements have led to the phasing out of chemicals that damage the ozone layer. As a result, the ozone hole over Antarctica has begun to show signs of recovery.',
    meta: {
      topic: 'environment',
      difficulty: 'advanced',
      explanation: 'The passage states the ozone hole "has begun to show signs of recovery".',
      distractor_note: 'False would mean no recovery; Not Given would mean the passage does not say. Here it is stated.',
    },
  },
  {
    question_type: 'tfng',
    category: C,
    mode: 'click',
    prompt: 'Schools are required to make reasonable adjustments.',
    correct_expression: 'True',
    choices: ['True', 'False', 'Not Given'],
    passage_excerpt:
      'Schools are required to make reasonable adjustments so that all students can participate fully. This may include extra time in exams or assistive technology.',
    meta: {
      topic: 'education',
      difficulty: 'intermediate',
      explanation: 'The passage states "Schools are required to make reasonable adjustments".',
      distractor_note: 'False would mean they are not required; Not Given would mean the passage does not say. Here it is stated.',
    },
  },
];
