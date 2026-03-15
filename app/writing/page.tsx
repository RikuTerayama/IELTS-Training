'use client';

import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

const TASK2_TOPICS = [
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
    <Layout variant="public">
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
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">
              Log in to dashboard
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
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
            <div className={cn('p-6 rounded-2xl', cardBase, 'border-primary/30')}>
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
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                1
              </span>
              <h3 className="mt-3 font-semibold text-text">Choose mode</h3>
              <p className="mt-2 text-sm text-text-muted">
                Pick practice (with PREP) or exam mode from the <Link href="/task/select" className="text-primary hover:underline font-medium">task selector</Link> or your <Link href="/home" className="text-primary hover:underline font-medium">dashboard</Link>.
              </p>
            </li>
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                2
              </span>
              <h3 className="mt-3 font-semibold text-text">Write</h3>
              <p className="mt-2 text-sm text-text-muted">
                In practice you can plan first; in exam mode you write under time pressure. Submit when ready.
              </p>
            </li>
            <li className={cn('p-6 rounded-2xl', cardBase, 'list-none')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                3
              </span>
              <h3 className="mt-3 font-semibold text-text">Get feedback</h3>
              <p className="mt-2 text-sm text-text-muted">
                Receive band-style scores and weak-point suggestions. Use <Link href="/pricing" className="text-primary hover:underline font-medium">Pro</Link> for more attempts and rewrites.
              </p>
            </li>
          </ol>
        </section>

        {/* Related hubs */}
        <section className="mb-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 text-xl font-bold text-text">
            Related
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/reading" className={cn('inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-2 text-text font-medium hover:bg-surface hover:border-primary/50 transition-colors')}>
              Reading hub
            </Link>
            <Link href="/speaking" className={cn('inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-2 text-text font-medium hover:bg-surface hover:border-primary/50 transition-colors')}>
              Speaking hub
            </Link>
            <Link href="/vocab" className={cn('inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-2 text-text font-medium hover:bg-surface hover:border-primary/50 transition-colors')}>
              Vocab
            </Link>
          </div>
        </section>

        {/* Task 2 Topics */}
        <section className="mb-16" aria-labelledby="topics-heading">
          <h2 id="topics-heading" className="mb-6 text-xl font-bold text-text">
            Task 2 topics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {TASK2_TOPICS.map((t) => (
              <Link
                key={t.slug}
                href={`/writing/task2/topics/${t.slug}`}
                className={cn(
                  'p-6 rounded-2xl border border-border bg-surface text-left transition-all',
                  'hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5',
                  cardBase
                )}
              >
                <h3 className="font-semibold text-text">{t.title}</h3>
                <p className="mt-2 text-sm text-primary">View topic →</p>
              </Link>
            ))}
          </div>
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
