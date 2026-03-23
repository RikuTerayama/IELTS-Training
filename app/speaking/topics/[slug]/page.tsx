import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import {
  bodyText,
  buttonPrimary,
  buttonSecondary,
  cardBase,
  cardTitle,
  cn,
  helperText,
  pageTitle,
  sectionTitle,
} from '@/lib/ui/theme';
import { getSpeakingTopicBySlug, SPEAKING_TOPICS } from '@/lib/content/speakingTopics';

const SAMPLE_QUESTIONS = {
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
  people: {
    part1: 'Do you enjoy meeting new people?',
    part2: 'Describe a person who has influenced you. You should say who the person is, how you know them, and why they influenced you.',
    part3: 'Why do some people become role models in society?',
  },
  'daily-routine': {
    part1: 'What is your daily routine like?',
    part2: 'Describe a part of your daily routine that you enjoy. You should say what you do, when you do it, and why it is important to you.',
    part3: 'How have daily routines changed because of technology?',
  },
  memories: {
    part1: 'Do you often think about the past?',
    part2: 'Describe a memory that makes you smile. You should say what happened, when it happened, and why you still remember it.',
    part3: 'Why are some memories easier to remember than others?',
  },
  'future-plans': {
    part1: 'Do you often think about the future?',
    part2: 'Describe a goal you would like to achieve in the future. You should say what it is, why it matters to you, and how you plan to achieve it.',
    part3: 'How do young people today plan for their future?',
  },
} as const;

const QUICK_TIPS = [
  '\u30c8\u30d4\u30c3\u30af\u306b\u5165\u3063\u305f\u3089\u3001\u7b54\u3048\u306e\u8ef8\u3092 2\u301c3 \u500b\u3060\u3051\u6c7a\u3081\u3066\u304b\u3089\u8a71\u3057\u59cb\u3081\u307e\u3059\u3002',
  '\u77ed\u3059\u304e\u308b\u7b54\u3048\u306f\u907f\u3051\u3001\u7406\u7531\u3084\u4f8b\u3092 1 \u3064\u6dfb\u3048\u308b\u3068\u307e\u3068\u307e\u308a\u3084\u3059\u304f\u306a\u308a\u307e\u3059\u3002',
  'Part 2 \u306f Cue Card \u306e\u30dd\u30a4\u30f3\u30c8\u3092 1 \u5206\u3067\u6574\u7406\u3057\u3066\u304b\u3089\u8a71\u3057\u59cb\u3081\u307e\u3059\u3002',
  '\u96e3\u3057\u3044\u8868\u73fe\u3092\u7121\u7406\u306b\u4f7f\u3046\u3088\u308a\u3082\u3001\u81ea\u7136\u306a\u8a9e\u9806\u3067\u6700\u5f8c\u307e\u3067\u8a00\u3044\u5207\u308b\u65b9\u304c\u8a55\u4fa1\u306b\u3064\u306a\u304c\u308a\u307e\u3059\u3002',
  '\u8a71\u3057\u305f\u3042\u3068\u3082\u3001\u6539\u5584\u70b9\u3092\u6b21\u306e\u56de\u7b54\u306b\u3059\u3050\u53cd\u6620\u3059\u308b\u3053\u3068\u3092\u610f\u8b58\u3057\u307e\u3059\u3002',
] as const;

const FAQ = [
  {
    question: '\u3053\u306e\u30c8\u30d4\u30c3\u30af\u3067 Part 2 \u3092\u7df4\u7fd2\u3059\u308b\u3068\u304d\u306e\u30b3\u30c4\u306f\uff1f',
    answer: '1 \u5206\u3067 2\u301c3 \u500b\u306e\u8ef8\u3092\u6c7a\u3081\u3001Cue Card \u306e\u30dd\u30a4\u30f3\u30c8\u306b\u6cbf\u3063\u3066 1\u301c2 \u5206\u3067\u8a71\u305b\u308b\u6d41\u308c\u3092\u4f5c\u308b\u306e\u304c\u304a\u3059\u3059\u3081\u3067\u3059\u3002',
  },
  {
    question: '\u30c6\u30ad\u30b9\u30c8\u4e2d\u5fc3\u3067\u3082\u7df4\u7fd2\u3067\u304d\u307e\u3059\u304b\uff1f',
    answer: '\u306f\u3044\u3002\u307e\u305a\u306f\u30c6\u30ad\u30b9\u30c8\u3067\u69cb\u6210\u3068\u8a9e\u5f59\u3092\u5b89\u5b9a\u3055\u305b\u3001\u305d\u306e\u5f8c\u306b\u97f3\u58f0\u7df4\u7fd2\u3078\u5e83\u3052\u308b\u3068 Speaking \u306e\u578b\u304c\u5d29\u308c\u306b\u304f\u304f\u306a\u308a\u307e\u3059\u3002',
  },
  {
    question: '\u30b9\u30b3\u30a2\u306f\u3069\u306e\u7a0b\u5ea6\u53c2\u8003\u306b\u306a\u308a\u307e\u3059\u304b\uff1f',
    answer: 'Fluency\u3001Lexical Resource\u3001Grammar\u3001Pronunciation \u306e\u89b3\u70b9\u3067\u898b\u3066\u3044\u307e\u3059\u3002\u97f3\u58f0\u3092\u3082\u3068\u306b\u8a55\u4fa1\u3055\u308c\u308b\u305f\u3081\u3001\u5b66\u7fd2\u306e\u76ee\u5b89\u3068\u3057\u3066\u6d3b\u7528\u3057\u3066\u304f\u3060\u3055\u3044\u3002',
  },
] as const;

function buildFaqPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
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
  return SPEAKING_TOPICS.map((topic) => ({ slug: topic.slug }));
}

type Props = { params: { slug: string } };

export default async function SpeakingTopicPage({ params }: Props) {
  const topic = getSpeakingTopicBySlug(params.slug);
  if (!topic) notFound();

  const samples = SAMPLE_QUESTIONS[topic.slug];
  const faqJsonLd = buildFaqPageJsonLd();

  return (
    <Layout variant="public">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-12 text-center">
          <h1 className={cn(pageTitle, 'mb-4')}>
            {'IELTS Speaking \u30c8\u30d4\u30c3\u30af | '}
            {topic.titleJa}
            {'\uff08'}
            {topic.titleEn}
            {'\uff09'}
          </h1>
          <p className={cn(bodyText, 'mx-auto max-w-2xl text-lg md:text-body-lg')}>
            {'\u300c'}{topic.titleJa}{'\u300d\u306b\u95a2\u9023\u3059\u308b Part 1-3 \u306e\u8cea\u554f\u4f8b\u3068\u3001\u7b54\u3048\u65b9\u306e\u8003\u3048\u65b9\u3092\u307e\u3068\u3081\u3066\u3044\u307e\u3059\u3002\u305d\u306e\u307e\u307e AI \u9762\u63a5\u306b\u5165\u308a\u3001\u6539\u5584\u70b9\u307e\u3067\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex')}>
              {'\u3053\u306e\u30c8\u30d4\u30c3\u30af\u3067 AI \u9762\u63a5\u3092\u59cb\u3081\u308b'}
            </Link>
            <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
              {'\u6599\u91d1\u3092\u898b\u308b'}
            </Link>
            <Link href="/speaking" className="text-sm font-medium text-primary hover:underline">
              {'Speaking \u306b\u623b\u308b'}
            </Link>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="part-guide-heading">
          <h2 id="part-guide-heading" className={cn(sectionTitle, 'mb-6')}>
            {'Part \u5225\u306e\u898b\u65b9'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className={cardTitle}>Part 1</h3>
              <p className={cn(helperText, 'mt-2')}>
                {'\u300c'}{topic.titleJa}{'\u300d\u306b\u95a2\u3059\u308b\u8eab\u8fd1\u306a\u8cea\u554f\u306b\u77ed\u304f\u7b54\u3048\u308b\u30d1\u30fc\u30c8\u3067\u3059\u30022\u301c3 \u6587\u3067\u307e\u305a\u306f\u660e\u78ba\u306b\u8fd4\u3057\u307e\u3059\u3002'}
              </p>
            </div>
            <div className={cn('rounded-2xl border-primary/30 p-6', cardBase)}>
              <h3 className={cardTitle}>Part 2 / Cue Card</h3>
              <p className={cn(helperText, 'mt-2')}>
                {topic.titleJa}
                {' \u306b\u95a2\u9023\u3059\u308b\u30c6\u30fc\u30de\u3067 1\u301c2 \u5206\u8a71\u3057\u307e\u3059\u3002Cue Card \u306e\u30dd\u30a4\u30f3\u30c8\u3092\u8ef8\u306b\u8a71\u3092\u7d44\u307f\u7acb\u3066\u307e\u3059\u3002'}
              </p>
            </div>
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className={cardTitle}>Part 3</h3>
              <p className={cn(helperText, 'mt-2')}>
                {'Part 2 \u3092\u5e83\u3052\u305f\u62bd\u8c61\u7684\u306a\u8b70\u8ad6\u3067\u3059\u3002\u610f\u898b\u3060\u3051\u3067\u306a\u304f\u7406\u7531\u307e\u3067\u8a00\u3046\u306e\u304c\u30dd\u30a4\u30f3\u30c8\u3067\u3059\u3002'}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="samples-heading">
          <h2 id="samples-heading" className={cn(sectionTitle, 'mb-6')}>
            {'\u30b5\u30f3\u30d7\u30eb\u8cea\u554f'}
          </h2>
          <ul className="space-y-4">
            <li className={cn('rounded-xl p-4', cardBase)}>
              <span className="text-xs font-medium text-primary">Part 1</span>
              <p className="mt-1 text-text">{samples.part1}</p>
            </li>
            <li className={cn('rounded-xl p-4', cardBase)}>
              <span className="text-xs font-medium text-primary">Part 2</span>
              <p className="mt-1 text-text">{samples.part2}</p>
            </li>
            <li className={cn('rounded-xl p-4', cardBase)}>
              <span className="text-xs font-medium text-primary">Part 3</span>
              <p className="mt-1 text-text">{samples.part3}</p>
            </li>
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="tips-heading">
          <h2 id="tips-heading" className={cn(sectionTitle, 'mb-6')}>
            {'\u3059\u3050\u4f7f\u3048\u308b\u30b3\u30c4'}
          </h2>
          <ul className="list-inside list-disc space-y-2 text-helper leading-7 text-text-muted">
            {QUICK_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="border-t border-border pt-8 text-center">
          <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex')}>
            {'Exam Mode \u3067\u3053\u306e\u30c8\u30d4\u30c3\u30af\u3092\u7df4\u7fd2\u3059\u308b'}
          </Link>
        </section>

        <section className="mt-12 border-t border-border pt-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className={cn(sectionTitle, 'mb-6')}>
            {'\u3088\u304f\u3042\u308b\u8cea\u554f'}
          </h2>
          <ul className="space-y-4">
            {FAQ.map((item) => (
              <li key={item.question} className={cn('rounded-lg bg-surface p-4', cardBase)}>
                <h3 className={cardTitle}>{item.question}</h3>
                <p className={cn(helperText, 'mt-2 text-sm leading-7')}>{item.answer}</p>
              </li>
            ))}
          </ul>
          <p className={cn(helperText, 'mt-4 text-sm')}>
            <Link href="/exam/speaking" className="text-primary hover:underline">
              {'AI \u9762\u63a5\u3092\u59cb\u3081\u308b'}
            </Link>
            {' \u30fb '}
            <Link href="/pricing" className="text-primary hover:underline">
              {'\u6599\u91d1\u3092\u898b\u308b'}
            </Link>
          </p>
        </section>
      </div>
    </Layout>
  );
}
