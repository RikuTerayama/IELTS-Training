'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import {
  bodyText,
  buttonPrimary,
  buttonSecondary,
  cardBase,
  cn,
  helperText,
  pageTitle,
  sectionTitle,
  subsectionTitle,
  surfaceSoftBadge,
  surfaceSoftBody,
  surfaceSoftCard,
  surfaceSoftTitle,
} from '@/lib/ui/theme';
import type { ApiResponse } from '@/lib/api/response';

type UsageTodayData = {
  is_pro: boolean;
  writing_limit: number;
  speaking_limit: number;
  writing_remaining: number;
  speaking_remaining: number;
  reset_at: string;
};

type CheckoutResponse = { url: string };

type PriceDisplay = { amount: number; currency: string; formatted: string } | null;
type PricesData = { monthly: PriceDisplay; annual: PriceDisplay };

const SAVINGS_PERCENT = 17;

const PRICING_FAQ: { question: string; answer: string; link?: { href: string; label: string } }[] = [
  {
    question: 'Pro はいつでも解約できますか？',
    answer:
      'はい。支払い設定ページからいつでも Pro を停止できます。停止後は次回更新日までは Pro の機能を使えます。',
    link: { href: '/billing/manage', label: '支払い設定' },
  },
  {
    question: '支払い間隔の変更はできますか？',
    answer: '支払い設定ページから、月額プランと年額プランの切り替えができます。',
    link: { href: '/billing/manage', label: '支払い設定' },
  },
  {
    question: 'Pro に含まれる機能は？',
    answer:
      'Writing / Speaking AI の回数制限解除、より多い練習量、フィードバック履歴の継続確認、進捗の見返しが含まれます。',
    link: { href: '/home', label: 'ホームへ' },
  },
  {
    question: '無料プランの回数はいつリセットされますか？',
    answer: '無料プランの 1 日あたりの Writing AI / Speaking AI 回数は、毎日 0:00 JST にリセットされます。',
  },
  {
    question: '月額と年額はどう選べばよいですか？',
    answer:
      'まずは支払い設定や料金ページで利用頻度を確認してください。継続して使うなら年額の方がコストを抑えやすい設計です。',
    link: { href: '/billing/manage', label: '支払い設定' },
  },
  {
    question: '支払いで問題が起きた場合は？',
    answer:
      '支払い設定から請求状況を確認できます。解決しない場合は、必要事項を添えて Pro リクエストから連絡してください。',
    link: { href: '/pro/request', label: 'Pro リクエスト' },
  },
];

function FaqJsonLd() {
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PRICING_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
    />
  );
}

export default function PricingPage() {
  const [interval, setInterval] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [usageLoading, setUsageLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch('/api/usage/today')
      .then((res) => {
        if (res.status === 401) {
          setUnauthorized(true);
          return null;
        }
        return res.json();
      })
      .then((data: ApiResponse<UsageTodayData> | null) => {
        if (data?.ok && data.data?.is_pro) setIsPro(true);
      })
      .catch(() => {})
      .finally(() => setUsageLoading(false));
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval }),
      });
      const data = (await res.json()) as ApiResponse<CheckoutResponse>;

      if (res.status === 401) {
        setUnauthorized(true);
        setError('アップグレードにはログインが必要です。');
        return;
      }

      if (data.ok && data.data?.url) {
        window.location.href = data.data.url;
        return;
      }

      setError(data.error?.message || 'チェックアウトの開始に失敗しました。');
    } catch {
      setError('通信に失敗しました。時間をおいてもう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const planCards: Array<{
    key: 'monthly' | 'annual';
    title: string;
    subtitle: string;
    detail: string;
    badge?: string;
    price: PriceDisplay;
    highlighted?: boolean;
  }> = [
    {
      key: 'monthly',
      title: 'Pro 月額',
      subtitle: '毎月支払い',
      detail: 'まずは短い期間で試したい人向けです。',
      price: null,
    },
    {
      key: 'annual',
      title: 'Pro 年額',
      subtitle: '年額支払い',
      detail: '継続して使う前提なら、年額の方が管理しやすい設計です。',
      badge: `約 ${SAVINGS_PERCENT}% お得`,
      price: null,
      highlighted: true,
    },
  ];

  return (
    <Layout variant="public">
      <FaqJsonLd />
      <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        <section className="mx-auto max-w-3xl text-center">
          <span className={surfaceSoftBadge}>Meridian Pro</span>
          <h1 className={cn(pageTitle, 'mt-4')}>料金</h1>
          <p className={cn(bodyText, 'mx-auto mt-4 max-w-2xl text-balance')}>
            無料プランで始めて、必要になったら Pro に切り替えられます。毎日の AI 利用枠、支払い設定、
            使える機能の違いをここでまとめて確認できます。
          </p>
        </section>

        {!usageLoading && isPro && (
          <section className={cn(surfaceSoftCard, 'mt-10 p-6 md:p-7')}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={surfaceSoftBadge}>Pro 利用中</span>
            </div>
            <h2 className={cn(subsectionTitle, surfaceSoftTitle, 'mt-3')}>現在 Pro プランを利用中です</h2>
            <p className={cn(surfaceSoftBody, 'mt-2 text-helper')}>
              支払い設定の確認、請求情報の更新、プランの見直しは支払い設定ページから行えます。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/billing/manage" className={cn(buttonPrimary, 'inline-flex')}>
                支払い設定を開く
              </Link>
              <Link href="/home" className={cn(buttonSecondary, 'inline-flex')}>
                ホームへ戻る
              </Link>
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <h2 className={sectionTitle}>支払い間隔</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="interval"
                  checked={interval === 'monthly'}
                  onChange={() => setInterval('monthly')}
                  className="h-4 w-4 border-border text-indigo-600 focus:ring-indigo-500"
                />
                <span>月額</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="interval"
                  checked={interval === 'annual'}
                  onChange={() => setInterval('annual')}
                  className="h-4 w-4 border-border text-indigo-600 focus:ring-indigo-500"
                />
                <span>年額</span>
              </label>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {planCards.map((plan) => {
              const active = interval === plan.key;
              const isSoftSurface = plan.highlighted;

              return (
                <article
                  key={plan.key}
                  className={cn(
                    isSoftSurface ? surfaceSoftCard : cardBase,
                    'relative h-full p-6 md:p-7',
                    active && 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-bg',
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {plan.highlighted ? <span className={surfaceSoftBadge}>{plan.badge}</span> : null}
                    {active ? (
                      <span className={cn(surfaceSoftBadge, !plan.highlighted && 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-200')}>
                        選択中
                      </span>
                    ) : null}
                  </div>
                  <h3 className={cn(subsectionTitle, plan.highlighted ? surfaceSoftTitle : 'text-text', 'mt-4')}>
                    {plan.title}
                  </h3>
                  <p className={cn(helperText, plan.highlighted ? surfaceSoftBody : 'text-text-muted', 'mt-1')}>
                    {plan.subtitle}
                  </p>
                  <p className={cn('mt-4 text-3xl font-bold', plan.highlighted ? surfaceSoftTitle : 'text-text')}>
                    価格は Stripe で表示
                  </p>
                  <p className={cn(helperText, plan.highlighted ? surfaceSoftBody : 'text-text-muted', 'mt-2')}>
                    {plan.detail}
                  </p>
                  <ul className={cn('mt-6 space-y-2 text-sm', plan.highlighted ? surfaceSoftBody : 'text-text-muted')}>
                    <li>Writing / Speaking AI の利用枠を広げて継続学習しやすくします。</li>
                    <li>フィードバック履歴と進捗の見返しを安定して使えます。</li>
                    <li>Writing / Speaking を毎日続ける人ほど Pro の価値が出やすい設計です。</li>
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {unauthorized && (
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-700 dark:bg-amber-900/30">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              アップグレードにはログインが必要です。ログイン後に料金ページへ戻れます。
            </p>
            <Link href="/login?next=%2Fpricing" className={cn(buttonPrimary, 'mt-4 inline-flex')}>
              ログイン
            </Link>
          </section>
        )}

        {!unauthorized && (
          <section className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={loading || isPro}
              className={cn(buttonPrimary, 'inline-flex', (loading || isPro) && 'cursor-not-allowed opacity-50')}
            >
              {loading ? 'チェックアウトを準備中...' : isPro ? 'Pro 利用中' : 'Pro にアップグレード'}
            </button>
            <Link href="/billing/manage" className={cn(buttonSecondary, 'inline-flex')}>
              支払い設定
            </Link>
          </section>
        )}

        {error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

        <section className="mt-16 border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className={sectionTitle}>よくある質問</h2>
          <ul className="mt-6 space-y-6">
            {PRICING_FAQ.map((item) => (
              <li key={item.question} className={cn(cardBase, 'rounded-2xl p-5')}>
                <h3 className={subsectionTitle}>{item.question}</h3>
                <p className={cn(helperText, 'mt-2')}>
                  {item.answer}
                  {item.link ? (
                    <>
                      {' '}
                      <Link href={item.link.href} className="text-indigo-600 hover:underline dark:text-indigo-300">
                        {item.link.label}
                      </Link>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
