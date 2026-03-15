'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';
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
    question: 'Pro はいつ有効になりますか？',
    answer:
      'お支払い完了後、すぐに Pro が有効になります。反映されない場合はページを再読み込みするか、1分ほどお待ちください。',
    link: { href: '/billing/manage', label: '請求管理' },
  },
  {
    question: 'サブスクリプションの管理・解約はどうすればよいですか？',
    answer: '請求管理ページで支払い方法の変更・解約・プラン変更ができます。',
    link: { href: '/billing/manage', label: '請求管理' },
  },
  {
    question: 'Pro に含まれるものは？',
    answer:
      'Writing / Speaking AI の無制限（または上限引き上げ）、待ち時間の短縮、フィードバック履歴の全件閲覧、優先演算（今後対応予定）です。',
    link: { href: '/home', label: 'ホームへ' },
  },
  {
    question: '無料枠は毎日リセットされますか？',
    answer: 'はい。無料の1日あたりの上限（Writing AI・Speaking AI など）は毎日 0:00 JST にリセットされます。',
  },
  {
    question: '月額と年額を切り替えられますか？',
    answer:
      'はい。請求管理からプラン変更できます。Stripe の顧客ポータルでアップグレードや支払い周期の変更が可能です。',
    link: { href: '/billing/manage', label: '請求管理' },
  },
  {
    question: '請求で問題が起きた場合は？',
    answer:
      '請求管理で請求書の確認や支払い情報の更新ができます。請求書払いなど手動承認をご希望の場合は Request Pro をご利用ください。',
    link: { href: '/pro/request', label: 'Request Pro' },
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
        setError('Please log in to upgrade.');
        return;
      }
      if (data.ok && data.data?.url) {
        window.location.href = data.data.url;
        return;
      }
      setError(data.error?.message || 'Failed to start checkout.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout variant="public">
      <FaqJsonLd />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold text-text">料金</h1>
        <p className="mb-8 text-text-muted">プランを選んでください。</p>

        {!usageLoading && isPro && (
          <div className={cn(
            'mb-6 p-6 rounded-2xl border',
            'border-green-200 bg-green-50/80 dark:border-green-700 dark:bg-green-900/30',
            'shadow-sm'
          )}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-green-300 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-900 dark:border-green-600 dark:bg-green-800/50 dark:text-green-100">
                Pro 有効
              </span>
            </div>
            <p className="mt-2 font-semibold text-green-900 dark:text-green-100">現在 Pro プランをご利用中です。</p>
            <p className="mt-1 text-sm text-green-800 dark:text-green-200">サブスクリプションの管理またはホームへ戻る。</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/billing/manage" className={cn(buttonPrimary, 'inline-flex !bg-green-600 hover:!bg-green-700')}>
                請求管理
              </Link>
              <Link href="/home" className={cn(buttonSecondary, 'inline-flex')}>
                ホームへ
              </Link>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-text">Billing:</span>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="interval"
              checked={interval === 'monthly'}
              onChange={() => setInterval('monthly')}
              className="h-4 w-4 border-border text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-text">Monthly</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="interval"
              checked={interval === 'annual'}
              onChange={() => setInterval('annual')}
              className="h-4 w-4 border-border text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-text">Annual</span>
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className={cn('p-6 rounded-2xl', cardBase, interval === 'monthly' && 'ring-2 ring-indigo-500 ring-offset-2')}>
            <h2 className="text-lg font-bold text-text">Pro Monthly</h2>
            <p className="mt-1 text-sm text-text-muted">Billed monthly</p>
            <p className="mt-4 text-2xl font-bold text-text">—</p>
            <p className="text-xs text-text-muted">Price set in Stripe</p>
          </div>
          <div className={cn('p-6 rounded-2xl', cardBase, interval === 'annual' && 'ring-2 ring-indigo-500 ring-offset-2')}>
            <h2 className="text-lg font-bold text-text">Pro Annual</h2>
            <p className="mt-1 text-sm text-text-muted">Billed annually (save ~{SAVINGS_PERCENT}%)</p>
            <p className="mt-4 text-2xl font-bold text-text">—</p>
            <p className="text-xs text-text-muted">Price set in Stripe</p>
          </div>
        </div>

        {unauthorized && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/30">
            <p className="text-sm text-amber-800 dark:text-amber-200">アップグレードにはログインが必要です。</p>
            <Link href="/login" className={cn(buttonPrimary, 'mt-3 inline-flex')}>
              ログイン
            </Link>
          </div>
        )}

        {!unauthorized && (
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={loading || isPro}
              className={cn(buttonPrimary, (loading || isPro) && 'opacity-50 cursor-not-allowed')}
            >
              {loading ? 'リダイレクト中...' : isPro ? 'Pro ご利用中' : 'Pro にアップグレード'}
            </button>
            <Link href="/billing/manage" className={cn(buttonSecondary, 'inline-flex')}>
              請求管理
            </Link>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <section className="mt-16 border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-xl font-bold text-text">
            よくある質問
          </h2>
          <ul className="space-y-6">
            {PRICING_FAQ.map((item, i) => (
              <li key={i} className={cn('rounded-lg border border-border bg-surface p-4', cardBase)}>
                <h3 className="font-semibold text-text">{item.question}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {item.answer}
                  {item.link && (
                    <>
                      {' '}
                      <Link href={item.link.href} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        {item.link.label}
                      </Link>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
