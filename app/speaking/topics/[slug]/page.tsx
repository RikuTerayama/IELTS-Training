import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

const speakingTopics = [
  { slug: 'work-study', title: 'Work & Study', apiTopic: 'work_study' },
  { slug: 'hometown', title: 'Hometown', apiTopic: 'hometown' },
  { slug: 'free-time', title: 'Free Time', apiTopic: 'free_time' },
  { slug: 'travel', title: 'Travel', apiTopic: 'travel' },
  { slug: 'technology', title: 'Technology', apiTopic: 'technology' },
] as const;

type Slug = (typeof speakingTopics)[number]['slug'];

const SAMPLE_QUESTIONS: Record<Slug, { part1: string; part2: string; part3: string }> = {
  'work-study': {
    part1: 'Do you work or are you a student?',
    part2: 'Describe a job or course you found rewarding. You should say what it was, why you chose it, and what you learned.',
    part3: 'How has technology changed the way people work or study?',
  },
  hometown: {
    part1: 'Where is your hometown?',
    part2: 'Describe a place in your hometown you like. You should say where it is, what you do there, and why you like it.',
    part3: 'Why do some people choose to leave their hometown?',
  },
  'free-time': {
    part1: 'What do you like to do in your free time?',
    part2: 'Describe a hobby you enjoy. You should say when you started it, how often you do it, and why you like it.',
    part3: 'Do you think people have enough free time today?',
  },
  travel: {
    part1: 'Do you like travelling?',
    part2: 'Describe a trip you remember well. You should say where you went, who you were with, and what you did.',
    part3: 'How can tourism affect local communities?',
  },
  technology: {
    part1: 'How often do you use technology?',
    part2: 'Describe a piece of technology you use every day. You should say what it is, how you use it, and why it is useful.',
    part3: 'Will technology replace some jobs in the future?',
  },
};

const QUICK_TIPS = [
  'Use topic-specific vocabulary to show range.',
  'Structure answers with a short intro, 1–2 main points, and a brief conclusion.',
  'Give concrete examples from your experience where relevant.',
  'In Part 2, use the cue card points to plan your talk before speaking.',
  'Keep answers clear and relevant; avoid going off-topic.',
];

const SPEAKING_TOPIC_FAQ = [
  {
    question: 'How do I practice Part 2 cue cards for this topic?',
    answer:
      'Spend 1 minute planning 2–3 ideas, then speak for 1–2 minutes with examples.',
  },
  {
    question: 'Do I need a microphone?',
    answer:
      'Not necessarily. You can practice in text mode first, then move to voice later.',
  },
  {
    question: 'How is my score calculated?',
    answer:
      'We provide band-style feedback across Fluency, Lexical Resource, Grammar, and Pronunciation.',
  },
] as const;

function buildFaqPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SPEAKING_TOPIC_FAQ.map((item) => ({
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
  return speakingTopics.map((t) => ({ slug: t.slug }));
}

type Props = { params: { slug: string } };

export default async function SpeakingTopicPage({ params }: Props) {
  const { slug } = params;
  const topic = speakingTopics.find((t) => t.slug === slug);
  if (!topic) notFound();

  const samples = SAMPLE_QUESTIONS[topic.slug];
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
            IELTS Speaking Topic: {topic.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Practice Part 1–3 questions and cue cards for &quot;{topic.title}&quot; with AI feedback.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex')}>
              Start interview
            </Link>
            <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
              View pricing
            </Link>
            <Link href="/speaking" className="text-sm text-indigo-600 hover:underline">
              Back to Speaking hub
            </Link>
          </div>
        </section>

        {/* Part guide */}
        <section className="mb-12" aria-labelledby="part-guide-heading">
          <h2 id="part-guide-heading" className="mb-6 text-xl font-bold text-text">
            Part guide
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className={cn('p-6 rounded-2xl', cardBase)}>
              <h3 className="font-semibold text-text">Part 1</h3>
              <p className="mt-2 text-sm text-text-muted">
                Short personal questions about {topic.title.toLowerCase()}. Warm up with 2–3 sentence answers.
              </p>
            </div>
            <div className={cn('p-6 rounded-2xl', cardBase, 'border-indigo-200')}>
              <h3 className="font-semibold text-text">Part 2 — Cue Card</h3>
              <p className="mt-2 text-sm text-text-muted">
                1–2 minute talk on a {topic.title.toLowerCase()}-related topic. Use the cue card points to plan.
              </p>
            </div>
            <div className={cn('p-6 rounded-2xl', cardBase)}>
              <h3 className="font-semibold text-text">Part 3</h3>
              <p className="mt-2 text-sm text-text-muted">
                Deeper discussion questions linked to Part 2. Give opinions and reasons.
              </p>
            </div>
          </div>
        </section>

        {/* Sample questions */}
        <section className="mb-12" aria-labelledby="samples-heading">
          <h2 id="samples-heading" className="mb-6 text-xl font-bold text-text">
            Sample questions
          </h2>
          <ul className="space-y-4">
            <li className={cn('p-4 rounded-xl', cardBase)}>
              <span className="text-xs font-medium text-indigo-600">Part 1</span>
              <p className="mt-1 text-text">{samples.part1}</p>
            </li>
            <li className={cn('p-4 rounded-xl', cardBase)}>
              <span className="text-xs font-medium text-indigo-600">Part 2</span>
              <p className="mt-1 text-text">{samples.part2}</p>
            </li>
            <li className={cn('p-4 rounded-xl', cardBase)}>
              <span className="text-xs font-medium text-indigo-600">Part 3</span>
              <p className="mt-1 text-text">{samples.part3}</p>
            </li>
          </ul>
        </section>

        {/* Quick tips */}
        <section className="mb-12" aria-labelledby="tips-heading">
          <h2 id="tips-heading" className="mb-6 text-xl font-bold text-text">
            Quick tips
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-text-muted">
            {QUICK_TIPS.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-border pt-8 text-center">
          <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex')}>
            Practice this topic in Exam Mode
          </Link>
        </section>

        {/* FAQ */}
        <section className="mt-12 border-t border-border pt-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-xl font-bold text-text">
            FAQ
          </h2>
          <ul className="space-y-4">
            {SPEAKING_TOPIC_FAQ.map((item, i) => (
              <li key={i} className={cn('rounded-lg border border-border bg-surface p-4', cardBase)}>
                <h3 className="font-semibold text-text">{item.question}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{item.answer}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-text-muted">
            <Link href="/exam/speaking" className="text-indigo-600 hover:underline">Start interview</Link>
            {' · '}
            <Link href="/pricing" className="text-indigo-600 hover:underline">View pricing</Link>
          </p>
        </section>
      </div>
    </Layout>
  );
}
