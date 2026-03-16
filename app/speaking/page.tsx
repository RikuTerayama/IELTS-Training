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
    question: '無料で使えますか？',
    answer:
      'Free プランでも Speaking AI は試せますが、日次上限があります。繰り返し練習したい場合は Pro を確認してください。',
  },
  {
    question: 'マイクは必要ですか？',
    answer:
      '現在の β はテキスト入力ベースです。まずは英文の組み立てと語彙を安定させ、その後に音声練習へ広げる使い方ができます。',
  },
  {
    question: 'スコアはどう決まりますか？',
    answer:
      'Fluency、Lexical Resource、Grammar、Pronunciation の観点で band-style feedback を返し、全体の目安も表示します。',
  },
] as const;

function buildLoginUrl(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

export default function SpeakingPage() {
  return (
    <Layout variant="public">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-4xl">
            IELTS Speaking 対策
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-text-muted">
            AI interviewer で Part 1-3 を練習できます。Cue Card と band-style feedback を使って、
            本番に近い流れで Speaking を整えます。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex')}>
              面接を始める
            </Link>
            <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
              料金を見る
            </Link>
            <Link href={buildLoginUrl('/home')} className="text-sm font-medium text-primary hover:underline">
              学習ホームにログイン
            </Link>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="practice-heading">
          <h2 id="practice-heading" className="mb-6 text-xl font-bold text-text">
            今できること
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className="font-semibold text-text">Part 1</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                身近なテーマについて短く答えるウォームアップです。答えの型を安定させるのに向いています。
              </p>
            </div>
            <div className={cn('rounded-2xl border-primary/30 p-6', cardBase)}>
              <h3 className="font-semibold text-text">Part 2 / Cue Card</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                1〜2 分で話す長めのパートです。Cue Card のポイントを使いながら構成を作れます。
              </p>
            </div>
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className="font-semibold text-text">Part 3</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Part 2 に関連する抽象度の高い質問に答えます。意見と理由を組み立てる練習です。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className="mb-6 text-xl font-bold text-text">
            使い方
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                1
              </span>
              <h3 className="mt-3 font-semibold text-text">トピックと Part を選ぶ</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Work / Travel などのトピックと、Part 1 / 2 / 3 を選んで面接を開始します。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                2
              </span>
              <h3 className="mt-3 font-semibold text-text">答える</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                現在の β ではテキスト入力で回答します。Part 2 は Cue Card を見ながら構成を組み立てられます。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                3
              </span>
              <h3 className="mt-3 font-semibold text-text">フィードバックを確認する</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                band-style feedback と改善ポイントを確認し、次の面接で言い直しを試します。
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
              href="/writing"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text',
                'hover:bg-surface hover:border-primary/50 transition-colors'
              )}
            >
              Writing
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
                トピック
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Part 1-3 でよく使うトピック別に、サンプル質問と考え方の入口を確認できます。
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {TOPICS.map((topic) => (
              <Link
                key={topic.value}
                href={`/speaking/topics/${topic.slug}`}
                className={cn(
                  'rounded-2xl border border-border bg-surface p-6 text-left transition-all',
                  'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md',
                  cardBase
                )}
              >
                <h3 className="font-semibold text-text">{topic.label}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  サンプル質問と Cue Card の考え方をまとめて確認できます。
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
            {SPEAKING_FAQ.map((item) => (
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
