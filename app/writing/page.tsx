'use client';

import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

const WRITING_FAQ = [
  {
    question: 'What’s the difference between practice and exam mode?',
    answer:
      'Practice mode lets you use PREP: plan and structure ideas before writing. Exam mode simulates test conditions—you write in one go and get band-style feedback. Both give you targeted suggestions. See the dashboard for more.',
  },
  {
    question: 'Does it support Task 1?',
    answer:
      'This hub focuses on Task 2. Task 1 support is currently limited. Check the app dashboard and pricing for the latest features.',
  },
  {
    question: 'How accurate is the band score?',
    answer:
      'Scores are band-style estimates from an AI trained on IELTS criteria. Use them as a guide for improvement; for official results you need a real IELTS test.',
  },
];

export default function WritingPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-4xl">
            IELTS Writing Practice
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Task 2 AI feedback with practice (PREP) and exam-style writing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/task/select?task_type=Task%202&mode=exam"
              className={cn(buttonPrimary, 'inline-flex')}
            >
              Start exam mode
            </Link>
            <Link
              href="/task/select?task_type=Task%202"
              className={cn(buttonSecondary, 'inline-flex')}
            >
              Start practice
            </Link>
            <Link href="/pricing" className="text-sm text-indigo-600 hover:underline">
              View pricing
            </Link>
          </div>
        </section>

        {/* What you can practice */}
        <section className="mb-16" aria-labelledby="practice-heading">
          <h2 id="practice-heading" className="mb-6 text-xl font-bold text-text">
            What you can practice
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className={cn('p-6 rounded-2xl', cardBase)}>
              <h3 className="font-semibold text-text">Practice (PREP)</h3>
              <p className="mt-2 text-sm text-text-muted">
                Plan and structure ideas before writing.
              </p>
            </div>
            <div className={cn('p-6 rounded-2xl', cardBase, 'border-indigo-200')}>
              <h3 className="font-semibold text-text">Exam mode</h3>
              <p className="mt-2 text-sm text-text-muted">
                Write under test-like conditions and get band-style feedback.
              </p>
            </div>
            <div className={cn('p-6 rounded-2xl', cardBase)}>
              <h3 className="font-semibold text-text">Rewrite</h3>
              <p className="mt-2 text-sm text-text-muted">
                Iterate based on targeted suggestions.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className="mb-6 text-xl font-bold text-text">
            How it works
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                1
              </span>
              <h3 className="mt-3 font-semibold text-text">Choose mode</h3>
              <p className="mt-2 text-sm text-text-muted">
                Pick practice (with PREP) or exam mode from the <Link href="/task/select" className="text-indigo-600 hover:underline">task selector</Link> or your <Link href="/home" className="text-indigo-600 hover:underline">dashboard</Link>.
              </p>
            </li>
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                2
              </span>
              <h3 className="mt-3 font-semibold text-text">Write</h3>
              <p className="mt-2 text-sm text-text-muted">
                In practice you can plan first; in exam mode you write under time pressure. Submit when ready.
              </p>
            </li>
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                3
              </span>
              <h3 className="mt-3 font-semibold text-text">Get feedback</h3>
              <p className="mt-2 text-sm text-text-muted">
                Receive band-style scores and weak-point suggestions. Use <Link href="/pricing" className="text-indigo-600 hover:underline">Pro</Link> for more attempts and rewrites.
              </p>
            </li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-xl font-bold text-text">
            FAQ
          </h2>
          <ul className="space-y-4">
            {WRITING_FAQ.map((item, i) => (
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
