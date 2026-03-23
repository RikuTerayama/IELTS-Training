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
import { SPEAKING_TOPICS } from '@/lib/content/speakingTopics';

const SPEAKING_FAQ = [
  {
    question: '無料プランでも使えますか？',
    answer:
      '無料プランでも Speaking AI は試せます。毎日の残り回数を確認しながら進め、継続的に使いたい場合は Pro を検討してください。',
  },
  {
    question: 'マイクは必須ですか？',
    answer:
      '現在の AI 面接は音声ベースです。まずは質問例と構成を確認して、その後に音声練習へ進む使い方がおすすめです。',
  },
  {
    question: 'スコアはどの程度参考になりますか？',
    answer:
      'Fluency、Lexical Resource、Grammar、Pronunciation の観点で band-style feedback を返します。学習の目安として使い、公式スコアとは分けて考えてください。',
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
          <h1 className={cn(pageTitle, 'mb-4')}>IELTS Speaking 対策</h1>
          <p className={cn(bodyText, 'mx-auto max-w-2xl text-lg md:text-body-lg')}>
            AI interviewer と Part 1-3 の構成で Speaking を練習できます。Cue Card と band-style feedback を使って、
            本番に近い流れで感覚を整えるページです。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex')}>
              AI 面接を始める
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
          <h2 id="practice-heading" className={cn(sectionTitle, 'mb-6')}>練習できること</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className={cardTitle}>Part 1</h3>
              <p className={cn(helperText, 'mt-2')}>
                身近な質問に対して短く明確に答えるウォームアップです。答えの型を安定させるのに向いています。
              </p>
            </div>
            <div className={cn('rounded-2xl border-primary/30 p-6', cardBase)}>
              <h3 className={cardTitle}>Part 2 / Cue Card</h3>
              <p className={cn(helperText, 'mt-2')}>
                1〜2 分で話すパートです。Cue Card のポイントを整理して、話の流れを組み立てます。
              </p>
            </div>
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className={cardTitle}>Part 3</h3>
              <p className={cn(helperText, 'mt-2')}>
                Part 2 を広げた抽象度の高い質問に答えます。意見だけでなく理由まで言う練習に向いています。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className={cn(sectionTitle, 'mb-6')}>使い方</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                1
              </span>
              <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>トピックと Part を選ぶ</h3>
              <p className={cn(helperText, 'mt-2')}>
                仕事・学業 / 旅行 などのトピックと、Part 1 / 2 / 3 を選んで AI 面接を開始します。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                2
              </span>
              <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>話す</h3>
              <p className={cn(helperText, 'mt-2')}>
                現在の AI 面接では音声で回答します。Part 2 は Cue Card を見ながら構成を立ててから話せます。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                3
              </span>
              <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>フィードバックを確認する</h3>
              <p className={cn(helperText, 'mt-2')}>
                band-style feedback と改善ポイントを見返し、次の面接で試すべき表現を確認します。
              </p>
            </li>
          </ol>
        </section>

        <section className="mb-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className={cn(sectionTitle, 'mb-6')}>関連リンク</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/listening"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text',
                'hover:bg-surface hover:border-primary/50 transition-colors'
              )}
            >
              Listening
            </Link>
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
              <h2 id="topics-heading" className={sectionTitle}>トピック</h2>
              <p className={cn(helperText, 'mt-2')}>
                Part 1-3 でよく使うトピック別に、サンプル質問と答え方の導線を確認できます。
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {SPEAKING_TOPICS.map((topic) => (
              <Link
                key={topic.apiTopic}
                href={`/speaking/topics/${topic.slug}`}
                className={cn(
                  'rounded-2xl border border-border bg-surface p-6 text-left transition-all',
                  'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md',
                  cardBase
                )}
              >
                <h3 className={cardTitle}>{topic.titleJa}</h3>
                <p className={cn(helperText, 'mt-2')}>
                  サンプル質問と Cue Card の考え方をまとめて確認できます。
                </p>
                <p className="mt-4 text-sm font-medium text-primary">トピックを見る</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className={cn(sectionTitle, 'mb-6')}>よくある質問</h2>
          <ul className="space-y-4">
            {SPEAKING_FAQ.map((item) => (
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
