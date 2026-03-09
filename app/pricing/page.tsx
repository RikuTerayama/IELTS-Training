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

const SAVINGS_PERCENT = 17;

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
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold text-text">Pricing</h1>
        <p className="mb-8 text-text-muted">Choose your plan.</p>

        {!usageLoading && isPro && (
          <div className={cn('mb-6 p-6 rounded-2xl', cardBase, 'border-green-200 bg-green-50/80')}>
            <p className="font-semibold text-green-900">You are currently Pro.</p>
            <p className="mt-1 text-sm text-green-800">Manage your subscription below.</p>
            <Link href="/billing/manage" className={cn(buttonSecondary, 'mt-4 inline-flex')}>
              Manage billing
            </Link>
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
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">Please log in to upgrade.</p>
            <Link href="/login" className={cn(buttonPrimary, 'mt-3 inline-flex')}>
              Log in
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
              {loading ? 'Redirecting...' : isPro ? 'You are Pro' : 'Upgrade to Pro'}
            </button>
            <Link href="/billing/manage" className={cn(buttonSecondary, 'inline-flex')}>
              Manage billing
            </Link>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
      </div>
    </Layout>
  );
}
