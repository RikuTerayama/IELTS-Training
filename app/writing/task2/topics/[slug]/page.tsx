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

  return (
    <Layout>
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
      </div>
    </Layout>
  );
}
