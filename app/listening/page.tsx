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
  surfaceSoftBadge,
  surfaceSoftBody,
  surfaceSoftCard,
  surfaceSoftTitle,
} from '@/lib/ui/theme';

const CURRENT_PATHS = [
  {
    title: '単語で下地を整える',
    description: 'Listening と共通で効く語彙を先に固めると、聞き取りの精度を上げやすくなります。',
    href: '/home',
    ctaLabel: 'インプットを見る',
  },
  {
    title: '熟語と表現を増やす',
    description: '言い換えや定型表現を増やしておくと、音声のまとまりを拾いやすくなります。',
    href: '/home',
    ctaLabel: 'ホームから進める',
  },
  {
    title: 'Reading と行き来する',
    description: 'Reading の設問タイプや語彙を先に回しておくと、Listening の理解も安定しやすくなります。',
    href: '/reading',
    ctaLabel: 'Reading を見る',
  },
] as const;

const NEXT_STEPS = [
  'Listening 専用の公開ガイド',
  'Listening に寄せた単語・表現の整理',
  '見返しまで含めたインプット導線の拡張',
] as const;

const RELATED_LINKS = [
  { href: '/reading', label: 'Reading' },
  { href: '/writing', label: 'Writing' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/pricing', label: '料金' },
] as const;

export default function ListeningPage() {
  return (
    <Layout variant="public">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-16 text-center">
          <span className={surfaceSoftBadge}>公開ハブ</span>
          <h1 className={cn(pageTitle, 'mt-4')}>IELTS Listening</h1>
          <p className={cn(bodyText, 'mx-auto mt-4 max-w-2xl text-lg md:text-body-lg')}>
            Listening の専用トレーニング面は順次公開中です。現在は Listening とつながる単語・熟語・表現の入口と、
            今後の公開予定をまとめて確認できます。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/home" className={cn(buttonPrimary, 'inline-flex')}>
              インプットを見る
            </Link>
            <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
              料金を見る
            </Link>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="current-heading">
          <h2 id="current-heading" className={cn(sectionTitle, 'mb-6')}>
            今できること
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {CURRENT_PATHS.map((item) => (
              <article key={item.title} className={cn(cardBase, 'flex h-full flex-col gap-4 p-6')}>
                <div className="space-y-2">
                  <h3 className={cardTitle}>{item.title}</h3>
                  <p className={helperText}>{item.description}</p>
                </div>
                <div className="mt-auto">
                  <Link href={item.href} className={cn(buttonSecondary, 'inline-flex')}>
                    {item.ctaLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16" aria-labelledby="plan-heading">
          <div className={cn(surfaceSoftCard, 'space-y-4 p-6 md:p-7')}>
            <div className="space-y-2">
              <h2 id="plan-heading" className={cn(sectionTitle, surfaceSoftTitle)}>
                公開予定
              </h2>
              <p className={cn(surfaceSoftBody, 'text-helper')}>
                Listening は fake feature にせず、今ある導線から少しずつ広げています。専用面が整うまでは、
                まずインプットの基礎から使える状態を保ちます。
              </p>
            </div>
            <ul className={cn(surfaceSoftBody, 'space-y-2 text-sm')}>
              {NEXT_STEPS.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className={cn(sectionTitle, 'mb-6')}>
            関連リンク
          </h2>
          <div className="flex flex-wrap gap-4">
            {RELATED_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text',
                  'hover:border-primary/50 hover:bg-surface transition-colors'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

