'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

function BillingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <div className={cn('p-8 rounded-2xl', cardBase, 'border-green-200 bg-green-50/80')}>
        <h1 className="text-xl font-bold text-green-900">Payment successful</h1>
        <p className="mt-2 text-sm text-green-800">
          Your plan will be activated shortly. If you do not see the change, refresh the page in a minute.
        </p>
        {sessionId && (
          <p className="mt-2 text-xs text-green-700 font-mono">Session: {sessionId.slice(0, 24)}...</p>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/home" className={cn(buttonPrimary, 'inline-flex')}>
            Go to Home
          </Link>
          <Link href="/billing/manage" className={cn(buttonSecondary, 'inline-flex')}>
            Manage billing
          </Link>
          <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
            Back to Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="container mx-auto px-4 py-12 max-w-xl text-center text-text-muted">Loading...</div>}>
        <BillingSuccessContent />
      </Suspense>
    </Layout>
  );
}
