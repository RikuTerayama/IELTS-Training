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
  { slug: 'work-life-balance', title: 'Work-life Balance' },
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
    question: 'Practice と Exam Mode の違いは何ですか？',
    answer:
      'Practice は PREP を使って考えを整理してから書けるモードです。Exam Mode は本番に近い流れで、PREP なしで書き切ってから band-style feedback を受けます。',
  },
  {
    question: 'Task 1 も使えますか？',
    answer:
      'この公開ページでは主に Task 2 を案内しています。Task 1 の対応状況は学習ホームや料金ページで最新の状態を確認してください。',
  },
  {
    question: '表示される band はどのくらい信頼できますか？',
    answer:
      '表示される band は IELTS の観点に沿った AI 推定です。改善の方向をつかむには十分役立ちますが、公式スコアの代わりではありません。',
  },
] as const;

function buildLoginUrl(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

export default function WritingPage() {
  return (
    <Layout variant="public">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-4xl">
            IELTS Writing 対策
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-text-muted">
            Task 2 の添削、Practice、Exam Mode を 1 つの流れで使える Writing 対策ページです。
            初稿の方向性確認から、band-style feedback を使った改善まで進められます。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/task/select?task_type=Task%202&mode=exam"
              className={cn(buttonPrimary, 'inline-flex')}
            >
              Exam Mode を始める
            </Link>
            <Link
              href="/task/select?task_type=Task%202"
              className={cn(buttonSecondary, 'inline-flex')}
            >
              Practice を始める
            </Link>
            <Link href={buildLoginUrl('/home')} className="text-sm font-medium text-primary hover:underline">
              学習ホームにログイン
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
              料金を見る
            </Link>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="practice-heading">
          <h2 id="practice-heading" className="mb-6 text-xl font-bold text-text">
            今できること
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className="font-semibold text-text">Practice (PREP)</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                PREP を使って論点整理をしてから書く練習です。初級〜中級の立ち上がりに向いています。
              </p>
            </div>
            <div className={cn('rounded-2xl border-primary/30 p-6', cardBase)}>
              <h3 className="font-semibold text-text">Exam Mode</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                本番に近い流れで一気に書き、提出後に band-style feedback を確認します。
              </p>
            </div>
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className="font-semibold text-text">Rewrite</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                返ってきた指摘をもとに書き直し、改善点を定着させます。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className="mb-6 text-xl font-bold text-text">
            使い方
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                1
              </span>
              <h3 className="mt-3 font-semibold text-text">モードを選ぶ</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                <Link
                  href="/task/select?task_type=Task%202"
                  className="font-medium text-primary hover:underline"
                >
                  Task 2 を開く
                </Link>
                {' '}
                または
                {' '}
                <Link href="/home" className="font-medium text-primary hover:underline">
                  学習ホーム
                </Link>
                {' '}
                から Practice / Exam Mode を選びます。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                2
              </span>
              <h3 className="mt-3 font-semibold text-text">書いて提出する</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Practice では PREP で考えを固めてから、Exam Mode では本番想定で一気に書きます。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                3
              </span>
              <h3 className="mt-3 font-semibold text-text">弱点を直す</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                band-style feedback と rewrite を使い、Task Response・構成・語彙・文法の改善に繋げます。
              </p>
            </li>
          </ol>
        </section>

        <section className="mb-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 text-xl font-bold text-text">
            関連リンク
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/reading"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text',
                'hover:bg-surface hover:border-primary/50 transition-colors'
              )}
            >
              Reading
            </Link>
            <Link
              href="/speaking"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text',
                'hover:bg-surface hover:border-primary/50 transition-colors'
              )}
            >
              Speaking
            </Link>
            <Link
              href="/vocab"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text',
                'hover:bg-surface hover:border-primary/50 transition-colors'
              )}
            >
              単語
            </Link>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="topics-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 id="topics-heading" className="text-xl font-bold text-text">
                Task 2 のトピック
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                IELTS Task 2 で頻出のテーマを topic page から確認できます。
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {TASK2_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/writing/task2/topics/${topic.slug}`}
                className={cn(
                  'rounded-2xl border border-border bg-surface p-6 text-left transition-all',
                  'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md',
                  cardBase
                )}
              >
                <h3 className="font-semibold text-text">{topic.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  トピックの考え方や関連表現の入口を確認できます。
                </p>
                <p className="mt-4 text-sm font-medium text-primary">トピックを見る</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-xl font-bold text-text">
            よくある質問
          </h2>
          <ul className="space-y-4">
            {WRITING_FAQ.map((item) => (
              <li key={item.question} className={cn('rounded-lg bg-surface p-4', cardBase)}>
                <h3 className="font-semibold text-text">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-text-muted">{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
