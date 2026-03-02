'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

/**
 * W2-FR-2: /training/writing/task2 は廃止。
 * 通常は middleware で 308 リダイレクト。クライアント遷移時のフォールバック。
 */
export default function WritingTask2RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/task/select?task_type=Task%202');
  }, [router]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <p className="text-text-muted">Writing Task 2 はタスク選択画面に統合しました。リダイレクトしています...</p>
      </div>
    </Layout>
  );
}
