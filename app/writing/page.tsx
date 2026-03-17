'use client';

import Link from 'next/link';
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
  subsectionTitle,
} from '@/lib/ui/theme';
import { WRITING_TASK2_TOPICS } from '@/lib/content/writingTopics';

const WRITING_FAQ = [
  {
    question: 'Practice と Exam Mode の違いは何ですか？',
    answer:
      'Practice は PREP を使って構成を整えながら書けるモードです。Exam Mode は本番に近い流れで書き、提出後に band-style feedback を受け取れます。',
  },
  {
    question: 'Task 1 も使えますか？',
    answer:
      'この公開ページでは主に Task 2 を案内しています。Task 1 の練習導線は学習ホームや関連ページから最新の状況を確認してください。',
  },
  {
    question: '表示される band はどのくらい参考になりますか？',
    answer:
      '表示される band は IELTS の観点に沿った AI 評価です。学習の目安として使い、公式スコアとは分けて考えてください。',
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
          <h1 className={cn(pageTitle, 'mb-4')}>IELTS Writing 対策</h1>
          <p className={cn(bodyText, 'mx-auto max-w-2xl text-lg md:text-body-lg')}>
            Task 2 の練習、Practice / Exam Mode、AI フィードバックをまとめて使える Writing 対策ページです。
            構成の確認から提出後の見直しまで、1ページで流れをつかめます。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/task/select?task_type=Task%202&mode=exam" className={cn(buttonPrimary, 'inline-flex')}>
              Exam Mode を始める
            </Link>
            <Link href="/task/select?task_type=Task%202" className={cn(buttonSecondary, 'inline-flex')}>
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
          <h2 id="practice-heading" className={cn(sectionTitle, 'mb-6')}>練習できること</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className={cardTitle}>Practice (PREP)</h3>
              <p className={cn(helperText, 'mt-2')}>
                PREP を使って論点と流れを整理しながら書けるモードです。構成を安定させたいときに向いています。
              </p>
            </div>
            <div className={cn('rounded-2xl border-primary/30 p-6', cardBase)}>
              <h3 className={cardTitle}>Exam Mode</h3>
              <p className={cn(helperText, 'mt-2')}>
                本番に近い流れで一気に書き、提出後に band-style feedback を確認できます。
              </p>
            </div>
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className={cardTitle}>Rewrite</h3>
              <p className={cn(helperText, 'mt-2')}>
                書いた内容をもとに書き直し、改善点を次の提出につなげられます。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className={cn(sectionTitle, 'mb-6')}>使い方</h2>
          <ol className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                1
              </span>
              <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>モードを選ぶ</h3>
              <p className={cn(helperText, 'mt-2')}>
                <Link href="/task/select?task_type=Task%202" className="font-medium text-primary hover:underline">
                  Task 2 を開く
                </Link>
                {' '}
                か、学習ホームから Practice / Exam Mode を選びます。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                2
              </span>
              <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>書いて提出する</h3>
              <p className={cn(helperText, 'mt-2')}>
                Practice では PREP で整理してから、Exam Mode では本番形式で一気に書けます。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                3
              </span>
              <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>改善点を次へつなげる</h3>
              <p className={cn(helperText, 'mt-2')}>
                band-style feedback と rewrite を使って、Task Response・構成・語彙・文法の改善点を確認します。
              </p>
            </li>
          </ol>
        </section>

        <section className="mb-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className={cn(sectionTitle, 'mb-6')}>関連リンク</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/reading" className={cn('inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text', 'hover:bg-surface hover:border-primary/50 transition-colors')}>
              Reading
            </Link>
            <Link href="/speaking" className={cn('inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text', 'hover:bg-surface hover:border-primary/50 transition-colors')}>
              Speaking
            </Link>
            <Link href="/vocab" className={cn('inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text', 'hover:bg-surface hover:border-primary/50 transition-colors')}>
              単語
            </Link>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="topics-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 id="topics-heading" className={sectionTitle}>Task 2 のトピック</h2>
              <p className={cn(helperText, 'mt-2')}>
                IELTS Task 2 で頻出のテーマをトピックページから確認できます。
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {WRITING_TASK2_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/writing/task2/topics/${topic.slug}`}
                className={cn(
                  'rounded-2xl border border-border bg-surface p-6 text-left transition-all',
                  'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md',
                  cardBase
                )}
              >
                <h3 className={cardTitle}>{topic.titleJa}</h3>
                <p className={cn(helperText, 'mt-2')}>
                  トピック別の例題、構成、関連表現の入口を確認できます。
                </p>
                <p className="mt-4 text-sm font-medium text-primary">トピックを見る</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className={cn(sectionTitle, 'mb-6')}>よくある質問</h2>
          <ul className="space-y-4">
            {WRITING_FAQ.map((item) => (
              <li key={item.question} className={cn('rounded-lg bg-surface p-4', cardBase)}>
                <h3 className={cardTitle}>{item.question}</h3>
                <p className={cn(helperText, 'mt-2 text-sm leading-7')}>{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
