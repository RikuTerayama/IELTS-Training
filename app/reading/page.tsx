'use client';

import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

const QUESTION_TYPES = [
  { id: 'paraphrase', label: 'Paraphrase & vocabulary', desc: 'Match meanings and academic vocabulary in context.' },
  { id: 'matching-headings', label: 'Matching headings', desc: 'Choose the best heading for paragraphs.' },
  { id: 'tfng', label: 'True / False / Not Given', desc: 'Identify if statements agree with the text.' },
  { id: 'summary', label: 'Summary completion', desc: 'Fill gaps in a summary of the passage.' },
  { id: 'matching-info', label: 'Matching information', desc: 'Locate which paragraph contains given information.' },
  { id: 'sentence', label: 'Sentence completion', desc: 'Complete sentences with words from the text.' },
] as const;

const READING_FAQ = [
  {
    question: 'What can I practice now?',
    answer:
      'You can build Academic Reading vocabulary and question-type skills in Vocab: choose the Reading skill and practice paraphrase drill, matching headings, True/False/Not Given, summary completion, and more. Full passage-based reading practice is coming next.',
  },
  {
    question: 'Is Reading vocab free?',
    answer:
      'Reading vocabulary practice is available on the same free tier as other skills. Daily limits may apply for AI features. See Pricing for details.',
  },
  {
    question: 'How does this fit with Writing and Speaking?',
    answer:
      'Reading vocabulary and skills transfer to Writing (academic style) and Speaking (topic vocabulary). We recommend combining Reading vocab with Writing and Speaking practice for a full score boost.',
  },
];

const HUB_LINKS = [
  { href: '/writing', label: 'Writing' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/vocab', label: 'Vocab' },
];

function buildLoginUrl(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

export default function ReadingPage() {
  return (
    <Layout variant="public">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-4xl">
            IELTS Reading Practice
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Build Academic Reading vocabulary and question-type skills. Full passage practice is coming next.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/vocab?skill=reading"
              className={cn(buttonPrimary, 'inline-flex')}
            >
              Start with Reading vocab
            </Link>
            <Link
              href={buildLoginUrl('/home')}
              className={cn(buttonSecondary, 'inline-flex')}
            >
              Log in to dashboard
            </Link>
            <Link href="/pricing" className="text-sm text-primary hover:underline font-medium">
              View pricing
            </Link>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="practice-heading">
          <h2 id="practice-heading" className="mb-6 text-xl font-bold text-text">
            What you can practice
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {QUESTION_TYPES.map((t) => (
              <div key={t.id} className={cn('p-6 rounded-2xl', cardBase)}>
                <h3 className="font-semibold text-text">{t.label}</h3>
                <p className="mt-2 text-sm text-text-muted">{t.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-text-muted">
            These question types are available in <Link href="/vocab?skill=reading" className="text-primary hover:underline font-medium">Reading vocab</Link> now. Full passage-based practice is in development.
          </p>
        </section>

        <section className="mb-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className="mb-6 text-xl font-bold text-text">
            How it works
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                1
              </span>
              <h3 className="mt-3 font-semibold text-text">Start with vocab</h3>
              <p className="mt-2 text-sm text-text-muted">
                Go to <Link href="/vocab?skill=reading" className="text-primary hover:underline">Vocab</Link> and choose Reading. Practice by question type (paraphrase, matching headings, T/F/NG, etc.).
              </p>
            </li>
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                2
              </span>
              <h3 className="mt-3 font-semibold text-text">Review and repeat</h3>
              <p className="mt-2 text-sm text-text-muted">
                SRS-style review keeps difficult items in rotation. Track progress from your dashboard when logged in.
              </p>
            </li>
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                3
              </span>
              <h3 className="mt-3 font-semibold text-text">Full passages coming next</h3>
              <p className="mt-2 text-sm text-text-muted">
                Full Academic Reading passages with timed practice and band-style feedback are in development.
              </p>
            </li>
          </ol>
        </section>

        <section className="mb-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 text-xl font-bold text-text">
            Related
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/vocab?skill=reading"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-primary/50 bg-primary/10 text-primary font-medium',
                'hover:bg-primary/20 hover:border-primary/70 transition-colors'
              )}
            >
              Reading vocab
            </Link>
            {HUB_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-2 text-text font-medium',
                  'hover:bg-surface hover:border-border-strong transition-colors'
                )}
              >
                {label} hub
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-xl font-bold text-text">
            FAQ
          </h2>
          <ul className="space-y-4">
            {READING_FAQ.map((item, i) => (
              <li key={i} className={cn('rounded-lg border border-border bg-surface p-4', cardBase)}>
                <h3 className="font-semibold text-text">{item.question}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}