import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

const task2Topics = [
  { slug: 'education', title: 'Education' },
  { slug: 'technology', title: 'Technology' },
  { slug: 'environment', title: 'Environment' },
  { slug: 'health', title: 'Health' },
  { slug: 'work-career', title: 'Work & Career' },
  { slug: 'government-society', title: 'Government & Society' },
  { slug: 'media-advertising', title: 'Media & Advertising' },
  { slug: 'crime-punishment', title: 'Crime & Punishment' },
  { slug: 'culture-traditions', title: 'Culture & Traditions' },
  { slug: 'transport-urban', title: 'Transport & Urban Life' },
  { slug: 'work-life-balance', title: 'Work–Life Balance' },
  { slug: 'climate-change', title: 'Climate Change' },
  { slug: 'globalisation', title: 'Globalisation' },
  { slug: 'youth-age', title: 'Youth & Age' },
  { slug: 'family-children', title: 'Family & Children' },
  { slug: 'food-diet', title: 'Food & Diet' },
  { slug: 'sports', title: 'Sports' },
  { slug: 'arts', title: 'Arts' },
  { slug: 'tourism', title: 'Tourism' },
  { slug: 'housing', title: 'Housing' },
  { slug: 'equality-rights', title: 'Equality & Rights' },
  { slug: 'immigration', title: 'Immigration' },
  { slug: 'fashion', title: 'Fashion' },
  { slug: 'money-finance', title: 'Money & Finance' },
  { slug: 'space-exploration', title: 'Space Exploration' },
  { slug: 'animals-wildlife', title: 'Animals & Wildlife' },
  { slug: 'languages', title: 'Languages' },
  { slug: 'social-media', title: 'Social Media' },
  { slug: 'data-privacy', title: 'Data Privacy' },
  { slug: 'automation-jobs', title: 'Automation & Jobs' },
  { slug: 'renewable-energy', title: 'Renewable Energy' },
  { slug: 'waste-recycling', title: 'Waste & Recycling' },
  { slug: 'aging-population', title: 'Aging Population' },
  { slug: 'urbanisation', title: 'Urbanisation' },
  { slug: 'rural-life', title: 'Rural Life' },
  { slug: 'international-aid', title: 'International Aid' },
  { slug: 'consumerism', title: 'Consumerism' },
  { slug: 'advertising-ethics', title: 'Advertising Ethics' },
  { slug: 'censorship', title: 'Censorship' },
  { slug: 'scientific-research', title: 'Scientific Research' },
  { slug: 'museums', title: 'Museums' },
  { slug: 'music', title: 'Music' },
  { slug: 'films-cinema', title: 'Films & Cinema' },
  { slug: 'books-reading', title: 'Books & Reading' },
  { slug: 'gap-year', title: 'Gap Year' },
  { slug: 'online-learning', title: 'Online Learning' },
  { slug: 'nuclear-energy', title: 'Nuclear Energy' },
  { slug: 'water-shortage', title: 'Water Shortage' },
  { slug: 'deforestation', title: 'Deforestation' },
  { slug: 'vegetarianism', title: 'Vegetarianism' },
] as const;

type Slug = (typeof task2Topics)[number]['slug'];

const EXAMPLE_QUESTIONS: Record<Slug, string[]> = {
  education: [
    'Some people believe that university education should be free for everyone. To what extent do you agree or disagree?',
    'Schools should teach children academic subjects rather than life skills. Discuss both views and give your opinion.',
    'Governments should spend more money on improving access to the internet than on public transport. To what extent do you agree?',
  ],
  technology: [
    'Technology has made our lives more complicated. To what extent do you agree or disagree?',
    'Artificial intelligence will do more harm than good. Discuss both views and give your opinion.',
    'People rely too much on computers and mobile phones. Is this a positive or negative development?',
  ],
  environment: [
    'Individuals can do little to improve the environment; only governments and large companies can make a real difference. To what extent do you agree?',
    'Environmental problems are too big for individual countries to solve. We need international cooperation. Do you agree?',
    'Some people think that the best way to reduce pollution is to increase the cost of fuel. To what extent do you agree?',
  ],
  health: [
    'Governments should make healthy food cheaper and unhealthy food more expensive. Do you agree or disagree?',
    'Prevention is better than cure. Governments should spend more on health education than on treatment. To what extent do you agree?',
    'Some people believe that healthcare should be free for everyone. Others think that individuals should pay for their own medical costs. Discuss both views.',
  ],
  'work-career': [
    'People today change their jobs and living places more often than in the past. Is this a positive or negative development?',
    'Some people prefer to work from home. Others prefer to work in an office. Discuss both views and give your opinion.',
    'Job satisfaction is more important than salary when choosing a job. To what extent do you agree or disagree?',
  ],
  'government-society': [
    'Governments should spend money on measures to save languages with few speakers from dying out. To what extent do you agree?',
    'In some countries, young people are encouraged to work or travel for a year between finishing school and starting university. Discuss the advantages and disadvantages.',
    'Some people think that the government should spend money on public services rather than on arts such as music and painting. To what extent do you agree?',
  ],
  'media-advertising': [
    'Advertising encourages consumers to buy in quantity rather than promoting quality. To what extent do you agree or disagree?',
    'The media should not report details of crimes to the public. Do you agree or disagree?',
    'Social media has more negative than positive effects on young people. To what extent do you agree?',
  ],
  'crime-punishment': [
    'Some people believe that long prison sentences help reduce crime. Others think that there are better ways to reduce crime. Discuss both views and give your opinion.',
    'Prison is the best way to punish criminals. To what extent do you agree or disagree?',
    'Rehabilitation programmes are more effective than punishment for reducing reoffending. Do you agree or disagree?',
  ],
  'culture-traditions': [
    'Traditional customs and culture are being lost as technology develops. Is it important to keep them? To what extent do you agree?',
    'Some people think that cultural traditions may be destroyed when they are used as money-making attractions. Others believe that this is the only way to save them. Discuss both views.',
    'Museums and art galleries should show only local history and art rather than work from other countries. To what extent do you agree?',
  ],
  'transport-urban': [
    'The best way to solve traffic congestion in cities is to provide free public transport 24 hours a day, 7 days a week. To what extent do you agree or disagree?',
    'More people are moving to cities. Is this a positive or negative development?',
    'Governments should spend money on railways rather than roads. To what extent do you agree or disagree?',
  ],
  'work-life-balance': [
    'Employers should give their staff at least four weeks of holiday per year. To what extent do you agree or disagree?',
    'People work longer hours now than in the past. Is this a positive or negative development?',
    'Work-life balance is more important than career success. Discuss both views and give your opinion.',
  ],
  'climate-change': [
    'Climate change is the most serious threat facing the world today. To what extent do you agree or disagree?',
    'Individuals can do little to tackle climate change. Only governments and companies can make a real difference. Do you agree?',
    'Should governments tax air travel to reduce carbon emissions? Discuss both views and give your opinion.',
  ],
  globalisation: [
    'Globalisation has more benefits than drawbacks. To what extent do you agree or disagree?',
    'International companies are becoming more powerful. Is this a positive or negative development?',
    'As the world becomes more connected, local cultures are disappearing. Do you agree or disagree?',
  ],
  'youth-age': [
    'Young people today have more opportunities than previous generations. To what extent do you agree?',
    'The elderly should be cared for by their family rather than the state. Discuss both views.',
    'Some people think that experience is more important than youth in leadership. To what extent do you agree?',
  ],
  'family-children': [
    'Parents should spend more time with their children. To what extent do you agree or disagree?',
    'Children should be raised by their grandparents as well as parents. Discuss both views.',
    'Smaller families are better than large families. Do you agree or disagree?',
  ],
  'food-diet': [
    'Governments should ban unhealthy food in schools. To what extent do you agree?',
    'People eat more fast food today than in the past. Is this a positive or negative development?',
    'Organic food is worth the extra cost. To what extent do you agree or disagree?',
  ],
  sports: [
    'Governments should spend money on sports facilities rather than on the arts. To what extent do you agree?',
    'Professional athletes earn too much money. Do you agree or disagree?',
    'Sports bring people together. To what extent do you agree or disagree?',
  ],
  arts: [
    'Governments should fund the arts. To what extent do you agree or disagree?',
    'Art and music should be compulsory in schools. Discuss both views and give your opinion.',
    'Modern art is not as valuable as traditional art. Do you agree or disagree?',
  ],
  tourism: [
    'International tourism has more disadvantages than advantages. To what extent do you agree?',
    'Tourism damages the environment. Should we limit the number of tourists? Discuss both views.',
    'Tourism brings people from different cultures together. Is this a positive development?',
  ],
  housing: [
    'Governments should provide free housing for everyone. To what extent do you agree?',
    'It is better to rent a home than to buy one. Discuss both views and give your opinion.',
    'House prices in cities are too high. What solutions can you suggest?',
  ],
  'equality-rights': [
    'Men and women should have equal rights in all areas. To what extent do you agree?',
    'All people should have the right to free speech. Do you agree or disagree?',
    'Governments should do more to promote gender equality. To what extent do you agree?',
  ],
  immigration: [
    'Immigration has more benefits than drawbacks for the host country. To what extent do you agree?',
    'Governments should limit the number of immigrants. Discuss both views and give your opinion.',
    'Immigrants should adopt the culture of their new country. Do you agree or disagree?',
  ],
  fashion: [
    'Fashion is a waste of money. To what extent do you agree or disagree?',
    'Young people care too much about their appearance. Do you agree or disagree?',
    'The fashion industry has a negative impact on the environment. To what extent do you agree?',
  ],
  'money-finance': [
    'Money is the most important factor for achieving happiness. To what extent do you agree?',
    'Governments should help people to manage their finances. Do you agree or disagree?',
    'People should save money rather than spend it. Discuss both views and give your opinion.',
  ],
  'space-exploration': [
    'Space exploration is a waste of money. The funds should be spent on more urgent needs. Do you agree?',
    'Governments should invest in space programmes. To what extent do you agree or disagree?',
    'Space travel will become common in the future. Is this a positive or negative development?',
  ],
  'animals-wildlife': [
    'Zoos should be abolished. Do you agree or disagree?',
    'Endangered species should be protected at all costs. To what extent do you agree?',
    'Keeping animals in captivity is cruel. Discuss both views and give your opinion.',
  ],
  languages: [
    'Everyone should learn at least one foreign language. To what extent do you agree?',
    'English will become the only global language. Is this a positive or negative development?',
    'Minority languages should be protected. To what extent do you agree or disagree?',
  ],
  'social-media': [
    'Social media has more negative than positive effects. To what extent do you agree?',
    'Social media companies should be regulated more strictly. Do you agree or disagree?',
    'People should limit their use of social media. Discuss both views and give your opinion.',
  ],
  'data-privacy': [
    'Governments should have the right to access people\'s private data for security. Do you agree?',
    'Personal data is worth more than oil. To what extent do you agree or disagree?',
    'Companies should not sell users\' data without their consent. To what extent do you agree?',
  ],
  'automation-jobs': [
    'Robots will replace many jobs in the future. Is this a positive or negative development?',
    'Governments should provide a universal basic income when jobs are automated. Do you agree?',
    'Automation makes life easier. To what extent do you agree or disagree?',
  ],
  'renewable-energy': [
    'Governments should invest more in renewable energy. To what extent do you agree?',
    'Fossil fuels should be phased out as soon as possible. Discuss both views and give your opinion.',
    'Solar and wind power are the best solutions to climate change. Do you agree or disagree?',
  ],
  'waste-recycling': [
    'Governments should make recycling compulsory. To what extent do you agree?',
    'Plastic should be banned. Discuss both views and give your opinion.',
    'Individuals can do little to reduce waste. Only businesses can make a difference. Do you agree?',
  ],
  'aging-population': [
    'An aging population creates more problems than benefits. To what extent do you agree?',
    'Governments should raise the retirement age. Discuss both views and give your opinion.',
    'The elderly should be encouraged to work longer. Do you agree or disagree?',
  ],
  urbanisation: [
    'Living in cities is better than living in the countryside. To what extent do you agree?',
    'Urbanisation causes more problems than it solves. Do you agree or disagree?',
    'Cities should limit the number of cars. Discuss both views and give your opinion.',
  ],
  'rural-life': [
    'Country life is better than city life. To what extent do you agree or disagree?',
    'Governments should do more to support rural communities. Do you agree or disagree?',
    'Young people are leaving the countryside for cities. Is this a positive or negative development?',
  ],
  'international-aid': [
    'Rich countries should give more aid to poor countries. To what extent do you agree?',
    'International aid does more harm than good. Discuss both views and give your opinion.',
    'Governments should spend aid money on education rather than infrastructure. Do you agree?',
  ],
  consumerism: [
    'Consumerism is damaging society. To what extent do you agree or disagree?',
    'People buy too many things they do not need. What are the causes and solutions?',
    'Buying goods makes people happy. Do you agree or disagree?',
  ],
  'advertising-ethics': [
    'Advertising aimed at children should be banned. To what extent do you agree?',
    'Advertisements tell us what we want rather than what we need. Do you agree or disagree?',
    'Advertising has a negative effect on society. Discuss both views and give your opinion.',
  ],
  censorship: [
    'Governments should censor the internet. To what extent do you agree or disagree?',
    'Free speech should never be limited. Do you agree or disagree?',
    'Some content should be banned from social media. Discuss both views and give your opinion.',
  ],
  'scientific-research': [
    'Governments should fund scientific research even when it has no practical use. Do you agree?',
    'Animal testing is necessary for medical progress. To what extent do you agree?',
    'Scientific progress has more benefits than drawbacks. Do you agree or disagree?',
  ],
  museums: [
    'Museums should be free for everyone. To what extent do you agree or disagree?',
    'Museums are more important than ever in the digital age. Do you agree or disagree?',
    'Governments should spend more on museums. Discuss both views and give your opinion.',
  ],
  music: [
    'Music should be taught in all schools. To what extent do you agree?',
    'Downloading music for free should be legal. Discuss both views and give your opinion.',
    'Music brings people together. Do you agree or disagree?',
  ],
  'films-cinema': [
    'Films have more influence than books. To what extent do you agree or disagree?',
    'Cinema attendance is declining. Is this a positive or negative development?',
    'Governments should fund the film industry. Do you agree or disagree?',
  ],
  'books-reading': [
    'Reading books is more beneficial than watching films. Do you agree or disagree?',
    'Libraries are still important in the digital age. To what extent do you agree?',
    'People read less than in the past. Is this a positive or negative development?',
  ],
  'gap-year': [
    'Taking a gap year before university is a good idea. To what extent do you agree?',
    'Young people should travel before starting work. Discuss both views and give your opinion.',
    'A gap year is a waste of time. Do you agree or disagree?',
  ],
  'online-learning': [
    'Online courses will replace traditional universities. To what extent do you agree?',
    'E-learning is as effective as classroom learning. Do you agree or disagree?',
    'Students learn better in a classroom than online. Discuss both views and give your opinion.',
  ],
  'nuclear-energy': [
    'Nuclear power is the best solution to climate change. Do you agree or disagree?',
    'Nuclear energy is too dangerous. To what extent do you agree or disagree?',
    'Governments should invest in nuclear power. Discuss both views and give your opinion.',
  ],
  'water-shortage': [
    'Water scarcity is one of the biggest problems facing the world. To what extent do you agree?',
    'Governments should limit water use in agriculture. Do you agree or disagree?',
    'Individuals can do little to solve water shortages. Do you agree or disagree?',
  ],
  deforestation: [
    'Deforestation is a serious global problem. What are the causes and solutions?',
    'Governments should ban the sale of products that contribute to deforestation. To what extent do you agree?',
    'Planting trees is the best way to fight climate change. Do you agree or disagree?',
  ],
  vegetarianism: [
    'Everyone should become vegetarian to protect the environment. To what extent do you agree?',
    'Eating meat is unhealthy. Do you agree or disagree?',
    'Vegetarianism is a personal choice. Governments should not promote it. Discuss both views.',
  ],
};

const OUTLINE_TEMPLATE = [
  'Intro: Paraphrase the question and state your position (agree / disagree / both).',
  'Body 1: First main idea with explanation and example.',
  'Body 2: Second main idea (or the other side) with explanation and example.',
  'Conclusion: Summarise your view in one or two sentences.',
];

const HIGH_SCORING_PHRASES = [
  'It is widely believed that…',
  'There is no doubt that…',
  'On the one hand… on the other hand…',
  'From my perspective…',
  'A prime example of this is…',
  'This has led to…',
  'In conclusion, I strongly believe that…',
  'To sum up, the benefits outweigh the drawbacks.',
];

const COMMON_MISTAKES = [
  'Not addressing all parts of the question (e.g. “discuss both views” but only giving one).',
  'Writing too little (aim for at least 250 words) or going off-topic.',
  'Using informal language or contractions (e.g. “don’t” instead of “do not”).',
  'Repeating the same ideas or vocabulary; vary your expressions.',
  'Forgetting a clear conclusion that restates your position.',
];

const TASK2_TOPIC_FAQ = [
  {
    question: 'How should I structure a Task 2 essay on this topic?',
    answer:
      'Use a clear 4-paragraph structure: introduction, two body paragraphs, and conclusion. Focus each body paragraph on one main reason or example.',
  },
  {
    question: 'What vocabulary should I use?',
    answer:
      'Use topic-specific nouns and verbs, plus linking phrases (however, moreover, as a result). Avoid memorized templates; keep it natural.',
  },
  {
    question: 'Can I practice this in exam mode?',
    answer:
      'Yes. Use Exam Mode to write under test-like conditions and get band-style feedback.',
  },
] as const;

function buildFaqPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: TASK2_TOPIC_FAQ.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
  };
}

export async function generateStaticParams() {
  return task2Topics.map((t) => ({ slug: t.slug }));
}

type Props = { params: { slug: string } };

export default async function Task2TopicPage({ params }: Props) {
  const { slug } = params;
  const topic = task2Topics.find((t) => t.slug === slug);
  if (!topic) notFound();

  const questions = EXAMPLE_QUESTIONS[topic.slug];
  const examUrl = '/task/select?task_type=Task%202&mode=exam';
  const practiceUrl = '/task/select?task_type=Task%202';

  const faqJsonLd = buildFaqPageJsonLd();

  return (
    <Layout variant="public">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-4xl">
            IELTS Writing Task 2 Topic: {topic.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Example questions, outline template, and tips for &quot;{topic.title}&quot;. Practice with AI feedback in exam or practice mode.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={examUrl} className={cn(buttonPrimary, 'inline-flex')}>
              Start exam mode
            </Link>
            <Link href={practiceUrl} className={cn(buttonSecondary, 'inline-flex')}>
              Start practice
            </Link>
            <Link href="/pricing" className="text-sm text-indigo-600 hover:underline">
              View pricing
            </Link>
            <Link href="/writing" className="text-sm text-indigo-600 hover:underline">
              Back to Writing hub
            </Link>
          </div>
        </section>

        {/* Example questions */}
        <section className="mb-12" aria-labelledby="examples-heading">
          <h2 id="examples-heading" className="mb-6 text-xl font-bold text-text">
            Example questions
          </h2>
          <ul className="space-y-4">
            {questions.map((q, i) => (
              <li key={i} className={cn('p-4 rounded-xl', cardBase)}>
                <p className="text-text">{q}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Outline template */}
        <section className="mb-12" aria-labelledby="outline-heading">
          <h2 id="outline-heading" className="mb-6 text-xl font-bold text-text">
            Outline template
          </h2>
          <ul className="list-disc list-inside space-y-2 rounded-2xl border border-border bg-surface p-6 text-sm text-text-muted">
            {OUTLINE_TEMPLATE.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* High-scoring phrases */}
        <section className="mb-12" aria-labelledby="phrases-heading">
          <h2 id="phrases-heading" className="mb-6 text-xl font-bold text-text">
            High-scoring phrases
          </h2>
          <ul className="flex flex-wrap gap-2">
            {HIGH_SCORING_PHRASES.map((phrase, i) => (
              <li
                key={i}
                className={cn('rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text', cardBase)}
              >
                {phrase}
              </li>
            ))}
          </ul>
        </section>

        {/* Common mistakes */}
        <section className="mb-12" aria-labelledby="mistakes-heading">
          <h2 id="mistakes-heading" className="mb-6 text-xl font-bold text-text">
            Common mistakes
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-text-muted">
            {COMMON_MISTAKES.map((mistake, i) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-border pt-8 text-center">
          <p className="mb-4 text-sm text-text-muted">Ready to write? Choose a mode and get AI feedback.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={examUrl} className={cn(buttonPrimary, 'inline-flex')}>
              Start exam mode
            </Link>
            <Link href={practiceUrl} className={cn(buttonSecondary, 'inline-flex')}>
              Start practice
            </Link>
            <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
              View pricing
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12 border-t border-border pt-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-xl font-bold text-text">
            FAQ
          </h2>
          <ul className="space-y-4">
            {TASK2_TOPIC_FAQ.map((item, i) => (
              <li key={i} className={cn('rounded-lg border border-border bg-surface p-4', cardBase)}>
                <h3 className="font-semibold text-text">{item.question}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{item.answer}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-text-muted">
            <Link href={examUrl} className="text-indigo-600 hover:underline">Try exam mode</Link>
            {' · '}
            <Link href="/pricing" className="text-indigo-600 hover:underline">View pricing</Link>
          </p>
        </section>
      </div>
    </Layout>
  );
}
