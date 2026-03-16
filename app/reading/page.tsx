'use client';

import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

const QUESTION_TYPES = [
  {
    id: 'paraphrase',
    label: 'Paraphrase / Vocabulary',
    desc: '言い換えと Academic 語彙を、文脈の中で素早く見抜く練習です。',
  },
  {
    id: 'matching-headings',
    label: 'Matching headings',
    desc: '段落ごとの要点をつかみ、最適な見出しを選ぶ力を鍛えます。',
  },
  {
    id: 'tfng',
    label: 'True / False / Not Given',
    desc: '本文と設問の関係を整理し、根拠の有無まで判断します。',
  },
  {
    id: 'summary',
    label: 'Summary completion',
    desc: '要約の空欄補充を通して、本文の流れとキーワードを確認します。',
  },
  {
    id: 'matching-info',
    label: 'Matching information',
    desc: '指定された情報がどの段落にあるかを素早く探す練習です。',
  },
  {
    id: 'sentence',
    label: 'Sentence completion',
    desc: '本文の表現を使って文を完成させる設問に対応します。',
  },
] as const;

const READING_FAQ = [
  {
    question: '今できる Reading 学習は何ですか？',
    answer:
      '現在は Vocab の Reading スキルで、paraphrase drill、matching headings、True / False / Not Given、summary completion などを練習できます。長文通しの演習は次フェーズで対応予定です。',
  },
  {
    question: 'Reading 語彙は無料で使えますか？',
    answer:
      'Reading 語彙の練習は他スキルと同じ Free プランで始められます。AI 機能には日次上限がある場合があります。詳しくは料金ページを確認してください。',
  },
  {
    question: 'Writing や Speaking にも役立ちますか？',
    answer:
      'Reading で身につく言い換え、Academic 語彙、論理の追い方は Writing と Speaking にもそのまま効きます。Reading を土台にすると Output の質も上がりやすくなります。',
  },
] as const;

const HUB_LINKS = [
  { href: '/writing', label: 'Writing hub' },
  { href: '/speaking', label: 'Speaking hub' },
  { href: '/vocab', label: 'Vocab' },
] as const;

function buildLoginUrl(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

export default function ReadingPage() {
  return (
    <Layout variant="public">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-4xl">
            IELTS Reading 対策
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-text-muted">
            Academic Reading で必要な語彙、言い換え、設問タイプ別の考え方をまとめて練習できます。
            長文通しの演習は次のフェーズで対応予定です。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/vocab?skill=reading" className={cn(buttonPrimary, 'inline-flex')}>
              Reading 語彙を始める
            </Link>
            <Link
              href={buildLoginUrl('/home')}
              className={cn(buttonSecondary, 'inline-flex')}
            >
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
            {QUESTION_TYPES.map((item) => (
              <div key={item.id} className={cn('rounded-2xl p-6', cardBase)}>
                <h3 className="font-semibold text-text">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-text-muted">
            これらの設問タイプは
            {' '}
            <Link
              href="/vocab?skill=reading"
              className="font-medium text-primary hover:underline"
            >
              Reading 語彙
            </Link>
            {' '}
            で今すぐ練習できます。長文読解のフル演習は開発中です。
          </p>
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
              <h3 className="mt-3 font-semibold text-text">Reading を選ぶ</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                <Link href="/vocab?skill=reading" className="text-primary hover:underline">
                  Vocab
                </Link>
                {' '}
                で Reading スキルを選び、設問タイプごとの練習に入ります。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                2
              </span>
              <h3 className="mt-3 font-semibold text-text">復習を回す</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                苦手な設問は SRS で再提示されます。短く何度も回すほど Reading の精度が安定します。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                3
              </span>
              <h3 className="mt-3 font-semibold text-text">Output に接続する</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Reading で拾った言い換えや語彙は、そのまま Writing と Speaking の表現力強化につながります。
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
              href="/vocab?skill=reading"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border-2 border-primary/50 bg-primary/10 px-5 py-3 font-medium text-primary',
                'hover:border-primary/70 hover:bg-primary/20 transition-colors'
              )}
            >
              Reading 語彙
            </Link>
            {HUB_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text',
                  'hover:border-border-strong hover:bg-surface transition-colors'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-xl font-bold text-text">
            よくある質問
          </h2>
          <ul className="space-y-4">
            {READING_FAQ.map((item) => (
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
