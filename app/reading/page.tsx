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

const QUESTION_TYPES = [
  {
    id: 'paraphrase',
    label: '言い換え / 語彙',
    desc: '言い換えと Academic 語彙をまとめて確認し、本文の中で意味を取りにいく力を整えます。',
  },
  {
    id: 'matching-headings',
    label: '見出し対応',
    desc: '各段落の要点をつかみ、似た選択肢を見分ける練習を短いセットで行います。',
  },
  {
    id: 'tfng',
    label: 'TFNG',
    desc: '本文と設問の関係を判定し、根拠の有無まで丁寧に見分ける感覚を固めます。',
  },
  {
    id: 'summary',
    label: '要約穴埋め',
    desc: '要約の流れを追いながら、必要な語句とキーワードを拾う練習です。',
  },
  {
    id: 'matching-info',
    label: '情報対応',
    desc: '複数段落にまたがる情報を照合し、どこに根拠があるかを見抜く練習です。',
  },
  {
    id: 'sentence',
    label: '文完成',
    desc: '本文の表現を手掛かりに、文を自然に完成させる設問へ対応します。',
  },
] as const;

const READING_FAQ = [
  {
    question: 'どこから Reading を始めればよいですか？',
    answer:
      'まずは Reading 単語の短いセットから始めるのがおすすめです。言い換え・見出し対応・TFNG などを少しずつ回すと、本文理解の土台が整います。',
  },
  {
    question: 'Reading は無料プランでも使えますか？',
    answer:
      'はい。Reading の単語練習と復習は無料プランでも始められます。より広い学習導線や AI 機能を使いたい場合は料金ページを確認してください。',
  },
  {
    question: 'Writing や Speaking にもつながりますか？',
    answer:
      'Reading で身につけた言い換え、Academic 語彙、要点把握は Writing と Speaking にもそのまま効きます。先に Reading を回すとアウトプットの質が安定しやすくなります。',
  },
] as const;

const HUB_LINKS = [
  { href: '/listening', label: 'Listening' },
  { href: '/writing', label: 'Writing' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/vocab', label: '単語' },
] as const;

function buildLoginUrl(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

export default function ReadingPage() {
  return (
    <Layout variant="public">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className={cn(pageTitle, 'mb-4')}>IELTS Reading 対策</h1>
          <p className={cn(bodyText, 'mx-auto max-w-2xl text-lg md:text-body-lg')}>
            Academic Reading で頻出の設問タイプ、言い換え、語彙を日本語ガイド付きで練習できます。
            短いセットから始めて、復習を回しながら精度を上げていく構成です。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/vocab?skill=reading" className={cn(buttonPrimary, 'inline-flex')}>
              Reading 練習を始める
            </Link>
            <Link href={buildLoginUrl('/home')} className={cn(buttonSecondary, 'inline-flex')}>
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
            {QUESTION_TYPES.map((item) => (
              <div key={item.id} className={cn('rounded-2xl p-6', cardBase)}>
                <h3 className={cardTitle}>{item.label}</h3>
                <p className={cn(helperText, 'mt-2')}>{item.desc}</p>
              </div>
            ))}
          </div>
          <p className={cn(helperText, 'mt-4')}>
            これらの設問タイプは
            {' '}
            <Link href="/vocab?skill=reading" className="font-medium text-primary hover:underline">
              Reading 練習
            </Link>
            {' '}
            で順番に確認できます。短い反復で基礎を固める設計です。
          </p>
        </section>

        <section className="mb-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className={cn(sectionTitle, 'mb-6')}>使い方</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                1
              </span>
              <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>Reading を選ぶ</h3>
              <p className={cn(helperText, 'mt-2')}>
                <Link href="/vocab?skill=reading" className="text-primary hover:underline">
                  単語練習
                </Link>
                {' '}
                から Reading スキルを選び、設問タイプごとの練習に入ります。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                2
              </span>
              <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>復習を回す</h3>
              <p className={cn(helperText, 'mt-2')}>
                間違えた設問は SRS で再表示されます。短いセットでも続けるほど Reading の精度が上がります。
              </p>
            </li>
            <li className={cn('list-none rounded-2xl p-6', cardBase)}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                3
              </span>
              <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>アウトプットにつなげる</h3>
              <p className={cn(helperText, 'mt-2')}>
                Reading で拾った言い換えや語彙は、そのまま Writing と Speaking の表現補強にもつながります。
              </p>
            </li>
          </ol>
        </section>

        <section className="mb-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className={cn(sectionTitle, 'mb-6')}>関連リンク</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/vocab?skill=reading"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border-2 border-primary/50 bg-primary/10 px-5 py-3 font-medium text-primary',
                'hover:border-primary/70 hover:bg-primary/20 transition-colors'
              )}
            >
              Reading 練習
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
          <h2 id="faq-heading" className={cn(sectionTitle, 'mb-6')}>よくある質問</h2>
          <ul className="space-y-4">
            {READING_FAQ.map((item) => (
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
