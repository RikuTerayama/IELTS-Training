'use client';

import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

export default function WritingTask2Page() {
  const router = useRouter();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-text">Task 2 - エッセイライティング</h1>
        <p className="text-text-muted mb-8">
          タスクタイプ、レベル、エッセータイプを選択して開始してください
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/task/select?task_type=Task 2')}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            タスクを選択
          </button>
        </div>
      </div>
    </Layout>
  );
}

