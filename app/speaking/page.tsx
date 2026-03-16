'use client';

import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

const TOPICS = [
  { value: 'work_study', label: 'Work & Study', slug: 'work-study' },
  { value: 'hometown', label: 'Hometown', slug: 'hometown' },
  { value: 'free_time', label: 'Free Time', slug: 'free-time' },
  { value: 'travel', label: 'Travel', slug: 'travel' },
  { value: 'technology', label: 'Technology', slug: 'technology' },
] as const;

const SPEAKING_FAQ = [
  {
    question: 'Is it free?',
    answer:
      'Free tier has daily limits for Speaking AI. Upgrade to Pro for unlimited practice. See Pricing for details.',
  },
  {
    question: 'Do I need a microphone?',
    answer:
      'The current beta uses text input. Voice input may be added later. You can type your answers to practice structure and vocabulary.',
  },
  {
    question: 'How is the score calculated?',
    answer:
      'You receive band-style feedback (fluency, lexical, grammar, pronunciation) and an overall band. The AI evaluates your answer against IELTS criteria.',
  },
];

function buildLoginUrl(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

export default function SpeakingPage() {
  return (
    <Layout variant="public">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-4xl">
            IELTS Speaking Practice
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            AI interviewer for Parts 1-3, with cue cards and instant feedback.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex')}>
              Start interview
            </Link>
            <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
              View pricing
            </Link>
            <Link href={buildLoginUrl('/home')} className="text-sm font-medium text-primary hover:underline">
              Log in to dashboard
            </Link>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="practice-heading">
          <h2 id="practice-heading" className="mb-6 text-xl font-bold text-text">
            What you can practice
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className={cn('p-6 rounded-2xl', cardBase)}>
              <h3 className="font-semibold text-text">Part 1</h3>
              <p className="mt-2 text-sm text-text-muted">
                Personal questions about familiar topics. Short answers to warm up.
              </p>
            </div>
            <div className={cn('p-6 rounded-2xl', cardBase, 'border-primary/30')}>
              <h3 className="font-semibold text-text">Part 2 - Cue Card</h3>
              <p className="mt-2 text-sm text-text-muted">
                A 1-2 minute long turn. You get a cue card with a topic and points to cover. Plan and speak.
              </p>
            </div>
            <div className={cn('p-6 rounded-2xl', cardBase)}>
              <h3 className="font-semibold text-text">Part 3</h3>
              <p className="mt-2 text-sm text-text-muted">
                Discussion with deeper, more abstract questions linked to Part 2.
              </p>
            </div>
          </div>
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
              <h3 className="mt-3 font-semibold text-text">Choose topic & part</h3>
              <p className="mt-2 text-sm text-text-muted">
                Pick a topic (e.g. Work, Travel) and Part 1, 2, or 3. Start the interview.
              </p>
            </li>
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                2
              </span>
              <h3 className="mt-3 font-semibold text-text">Answer the question</h3>
              <p className="mt-2 text-sm text-text-muted">
                Type your answer (current beta). For Part 2, you will see a cue card with points to cover.
              </p>
            </li>
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                3
              </span>
              <h3 className="mt-3 font-semibold text-text">Get feedback</h3>
              <p className="mt-2 text-sm text-text-muted">
                Receive band-style scores (fluency, vocabulary, grammar, pronunciation) and improvement tips.
              </p>
            </li>
          </ol>
        </section>

        <section className="mb-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 text-xl font-bold text-text">
            Related
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/reading" className={cn('inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-2 text-text font-medium hover:bg-surface hover:border-primary/50 transition-colors')}>
              Reading hub
            </Link>
            <Link href="/writing" className={cn('inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-2 text-text font-medium hover:bg-surface hover:border-primary/50 transition-colors')}>
              Writing hub
            </Link>
            <Link href="/vocab" className={cn('inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-2 text-text font-medium hover:bg-surface hover:border-primary/50 transition-colors')}>
              Vocab
            </Link>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="topics-heading">
          <h2 id="topics-heading" className="mb-6 text-xl font-bold text-text">
            Topics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {TOPICS.map((t) => (
              <Link
                key={t.value}
                href={`/speaking/topics/${t.slug}`}
                className={cn(
                  'p-6 rounded-2xl border border-border bg-surface text-left transition-all',
                  'hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5',
                  cardBase
                )}
              >
                <h3 className="font-semibold text-text">{t.label}</h3>
                <p className="mt-2 text-sm text-primary">View topic →</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-xl font-bold text-text">
            FAQ
          </h2>
          <ul className="space-y-4">
            {SPEAKING_FAQ.map((item, i) => (
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