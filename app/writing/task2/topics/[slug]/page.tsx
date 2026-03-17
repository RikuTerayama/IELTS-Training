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
import { getWritingTask2Topic, WRITING_TASK2_TOPICS } from '@/lib/content/writingTopics';

const OUTLINE_TEMPLATE = [
  '\u5c0e\u5165: \u8a2d\u554f\u3092\u8a00\u3044\u63db\u3048\u3001\u7acb\u5834\u3084\u7d50\u8ad6\u3092\u660e\u78ba\u306b\u793a\u3057\u307e\u3059\u3002',
  '\u672c\u65871: 1 \u3064\u76ee\u306e\u4e3b\u5f35\u3092\u7406\u7531\u3068\u4f8b\u3067\u652f\u3048\u307e\u3059\u3002',
  '\u672c\u65872: 2 \u3064\u76ee\u306e\u4e3b\u5f35\u3001\u307e\u305f\u306f\u53cd\u5bfe\u610f\u898b\u3078\u306e\u5bfe\u5fdc\u3092\u66f8\u304d\u307e\u3059\u3002',
  '\u7d50\u8ad6: \u81ea\u5206\u306e\u7acb\u5834\u3092\u77ed\u304f\u307e\u3068\u3081\u307e\u3059\u3002',
] as const;

const HIGH_SCORING_PHRASES = [
  'It is widely believed that ...',
  'There is no doubt that ...',
  'On the one hand ... on the other hand ...',
  'From my perspective ...',
  'A prime example of this is ...',
  'This has led to ...',
  'In conclusion, I strongly believe that ...',
  'To sum up, the benefits outweigh the drawbacks.',
] as const;

const COMMON_MISTAKES = [
  '\u8a2d\u554f\u30bf\u30a4\u30d7\u3092\u8aad\u307f\u9055\u3048\u3001Discuss both views \u306a\u306e\u306b\u7247\u65b9\u3060\u3051\u3092\u66f8\u3044\u3066\u3057\u307e\u3046\u3002',
  '250 \u8a9e\u306b\u5c4a\u304b\u305a\u3001\u7406\u7531\u3084\u4f8b\u304c\u4e0d\u8db3\u3057\u305f\u307e\u307e\u63d0\u51fa\u3057\u3066\u3057\u307e\u3046\u3002',
  '\u63a5\u7d9a\u8868\u73fe\u3060\u3051\u5897\u3084\u3057\u3066\u3001\u8ad6\u70b9\u306e\u3064\u306a\u304c\u308a\u304c\u5f31\u304f\u306a\u308b\u3002',
  '\u672c\u6587\u306e\u4e3b\u5f35\u304c\u5c0e\u5165\u3068\u7d50\u8ad6\u3067\u3076\u308c\u3066\u3057\u307e\u3046\u3002',
  '\u7d50\u8ad6\u3067\u65b0\u3057\u3044\u7406\u7531\u3084\u4f8b\u3092\u8ffd\u52a0\u3057\u3066\u3057\u307e\u3046\u3002',
] as const;

const FAQ = [
  {
    question: '\u3053\u306e\u30c8\u30d4\u30c3\u30af\u306e Task 2 \u306f\u3069\u3046\u7df4\u7fd2\u3059\u308c\u3070\u3088\u3044\u3067\u3059\u304b\uff1f',
    answer: '\u5c0e\u5165\u3067\u7acb\u5834\u3092\u660e\u78ba\u306b\u3057\u3001\u672c\u6587 2 \u6bb5\u843d\u3067\u7406\u7531\u3068\u4f8b\u3092\u652f\u3048\u308b\u6d41\u308c\u3092\u5148\u306b\u6c7a\u3081\u308b\u3068\u5b89\u5b9a\u3057\u307e\u3059\u3002Practice \u3067\u69cb\u6210\u3092\u78ba\u8a8d\u3057\u3066\u304b\u3089 Exam Mode \u306b\u5165\u308b\u306e\u304c\u304a\u3059\u3059\u3081\u3067\u3059\u3002',
  },
  {
    question: '\u3069\u3093\u306a\u4f8b\u3092\u5165\u308c\u308b\u3079\u304d\u3067\u3059\u304b\uff1f',
    answer: 'topic \u306b\u6cbf\u3063\u305f\u5177\u4f53\u4f8b\u3067\u3001cause / effect / solution / comparison \u3092\u652f\u3048\u3089\u308c\u308b\u3082\u306e\u3092\u9078\u3076\u3068\u8ad6\u70b9\u304c\u4f1d\u308f\u308a\u3084\u3059\u304f\u306a\u308a\u307e\u3059\u3002',
  },
  {
    question: 'Exam Mode \u3067\u3082\u6e96\u5099\u3067\u304d\u307e\u3059\u304b\uff1f',
    answer: '\u3053\u306e\u30da\u30fc\u30b8\u304b\u3089 Exam Mode \u306b\u9032\u3081\u307e\u3059\u3002\u672c\u756a\u306b\u8fd1\u3044\u6d41\u308c\u3067\u66f8\u3044\u3066\u304b\u3089\u3001AI \u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u3067\u898b\u76f4\u305b\u307e\u3059\u3002',
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

function buildExampleQuestions(topicEn: string) {
  return [
    `Some people believe that issues related to ${topicEn} should be given more priority by governments than individuals. To what extent do you agree or disagree?`,
    `Discuss both views and give your opinion on how ${topicEn} affects modern society.`,
    `What are the main causes of problems related to ${topicEn}, and what solutions can be suggested?`,
  ];
}

export async function generateStaticParams() {
  return WRITING_TASK2_TOPICS.map((topic) => ({ slug: topic.slug }));
}

type Props = { params: { slug: string } };

export default async function Task2TopicPage({ params }: Props) {
  const topic = getWritingTask2Topic(params.slug);
  if (!topic) notFound();

  const questions = buildExampleQuestions(topic.titleEn);
  const examUrl = '/task/select?task_type=Task%202&mode=exam';
  const practiceUrl = '/task/select?task_type=Task%202';
  const faqJsonLd = buildFaqPageJsonLd();

  return (
    <Layout variant="public">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-12 text-center">
          <h1 className={cn(pageTitle, 'mb-4')}>
            {'IELTS Writing Task 2 \u30c8\u30d4\u30c3\u30af | '}
            {topic.titleJa}
            {'\uff08'}
            {topic.titleEn}
            {'\uff09'}
          </h1>
          <p className={cn(bodyText, 'mx-auto max-w-2xl text-lg md:text-body-lg')}>
            {'\u300c'}{topic.titleJa}{'\u300d\u3067\u983b\u51fa\u306e\u8ad6\u70b9\u3001\u69cb\u6210\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u3001AI \u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u306b\u3064\u306a\u304c\u308b\u5c0e\u7dda\u3092\u307e\u3068\u3081\u3066\u3044\u307e\u3059\u3002Practice / Exam Mode \u306e\u3069\u3061\u3089\u304b\u3089\u3067\u3082\u3001\u305d\u306e\u307e\u307e Writing \u5b66\u7fd2\u3078\u5165\u308c\u307e\u3059\u3002'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={examUrl} className={cn(buttonPrimary, 'inline-flex')}>
              {'Exam Mode \u3092\u59cb\u3081\u308b'}
            </Link>
            <Link href={practiceUrl} className={cn(buttonSecondary, 'inline-flex')}>
              {'Practice \u3092\u59cb\u3081\u308b'}
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
              {'\u6599\u91d1\u3092\u898b\u308b'}
            </Link>
            <Link href="/writing" className="text-sm font-medium text-primary hover:underline">
              {'Writing \u306b\u623b\u308b'}
            </Link>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="examples-heading">
          <h2 id="examples-heading" className={cn(sectionTitle, 'mb-6')}>
            {'\u4f8b\u984c'}
          </h2>
          <ul className="space-y-4">
            {questions.map((question) => (
              <li key={question} className={cn('rounded-xl p-4', cardBase)}>
                <p className="text-text">{question}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="outline-heading">
          <h2 id="outline-heading" className={cn(sectionTitle, 'mb-6')}>
            {'\u69cb\u6210\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8'}
          </h2>
          <ul className="list-inside list-disc space-y-2 rounded-2xl border border-border bg-surface p-6 text-helper text-text-muted">
            {OUTLINE_TEMPLATE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="phrases-heading">
          <h2 id="phrases-heading" className={cn(sectionTitle, 'mb-6')}>
            {'\u4f7f\u3044\u3084\u3059\u3044\u8868\u73fe'}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {HIGH_SCORING_PHRASES.map((phrase) => (
              <li key={phrase} className={cn('rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text', cardBase)}>
                {phrase}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="mistakes-heading">
          <h2 id="mistakes-heading" className={cn(sectionTitle, 'mb-6')}>
            {'\u3088\u304f\u3042\u308b\u30df\u30b9'}
          </h2>
          <ul className="list-inside list-disc space-y-2 text-helper text-text-muted">
            {COMMON_MISTAKES.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </section>

        <section className="border-t border-border pt-8 text-center">
          <p className={cn(helperText, 'mb-4')}>
            {'\u3053\u306e\u307e\u307e\u30e2\u30fc\u30c9\u3092\u9078\u3073\u3001AI \u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u307e\u3067\u4e00\u6c17\u306b\u9032\u3081\u3089\u308c\u307e\u3059\u3002'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={examUrl} className={cn(buttonPrimary, 'inline-flex')}>
              {'Exam Mode \u3092\u59cb\u3081\u308b'}
            </Link>
            <Link href={practiceUrl} className={cn(buttonSecondary, 'inline-flex')}>
              {'Practice \u3092\u59cb\u3081\u308b'}
            </Link>
            <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
              {'\u6599\u91d1\u3092\u898b\u308b'}
            </Link>
          </div>
        </section>

        <section className="mt-12 border-t border-border pt-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className={cn(sectionTitle, 'mb-6')}>
            {'\u3088\u304f\u3042\u308b\u8cea\u554f'}
          </h2>
          <ul className="space-y-4">
            {FAQ.map((item) => (
              <li key={item.question} className={cn('rounded-lg border border-border bg-surface p-4', cardBase)}>
                <h3 className={cardTitle}>{item.question}</h3>
                <p className={cn(helperText, 'mt-2 text-sm leading-relaxed')}>{item.answer}</p>
              </li>
            ))}
          </ul>
          <p className={cn(helperText, 'mt-4 text-sm')}>
            <Link href={examUrl} className="text-primary hover:underline">
              {'Exam Mode \u3092\u59cb\u3081\u308b'}
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
