'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

/**
 * FR-7, FR-8: /vocab は廃止。恒久リダイレクトで /training/vocab?skill=speaking へ。
 * 通常は middleware で 308 リダイレクトされるが、クライアント遷移時のフォールバックとしてこのページでリダイレクトする。
 */
export default function VocabRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/training/vocab?skill=speaking');
  }, [router]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <p className="text-slate-600">語彙学習は /training/vocab に移動しました。リダイレクトしています...</p>
      </div>
    </Layout>
  );
}
