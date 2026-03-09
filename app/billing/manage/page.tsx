'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';
import type { ApiResponse } from '@/lib/api/response';

type PortalResponse = { url: string };

export default function BillingManagePage() {
  const [status, setStatus] = useState<'loading' | 'redirect' | 'no_account' | 'unauthorized' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/billing/portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ return_path: '/home' }),
        });
        const data = (await res.json()) as ApiResponse<PortalResponse>;
        if (cancelled) return;
        if (res.status === 401) {
          setStatus('unauthorized');
          return;
        }
        if (res.status === 400 && data.error?.code === 'NO_BILLING_ACCOUNT') {
          setStatus('no_account');
          return;
        }
        if (data.ok && data.data?.url) {
          setStatus('redirect');
          window.location.href = data.data.url;
          return;
        }
        setStatus('error');
        setErrorMessage(data.error?.message || 'Failed to open billing portal.');
      } catch {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage('Network error.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading' || status === 'redirect') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-xl">
          <div className={cn('p-8 rounded-2xl', cardBase)}>
            <p className="text-text-muted">Redirecting...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (status === 'unauthorized') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-xl">
          <div className={cn('p-8 rounded-2xl', cardBase)}>
            <h1 className="text-xl font-bold text-text">Manage billing</h1>
            <p className="mt-2 text-sm text-text-muted">Please log in to manage your billing.</p>
            <Link href="/login" className={cn(buttonPrimary, 'mt-6 inline-flex')}>
              Log in
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (status === 'no_account') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-xl">
          <div className={cn('p-8 rounded-2xl', cardBase)}>
            <h1 className="text-xl font-bold text-text">Manage billing</h1>
            <p className="mt-2 text-sm text-text-muted">No billing account yet.</p>
            <Link href="/pricing" className={cn(buttonPrimary, 'mt-6 inline-flex')}>
              Go to Pricing
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <div className={cn('p-8 rounded-2xl', cardBase, 'border-red-200 bg-red-50/80')}>
          <h1 className="text-xl font-bold text-red-900">Manage billing</h1>
          <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
              Go to Pricing
            </Link>
            <Link href="/home" className={cn(buttonSecondary, 'inline-flex')}>
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
