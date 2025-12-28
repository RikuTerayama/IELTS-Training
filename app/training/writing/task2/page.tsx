'use client';

import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

export default function WritingTask2Page() {
  const router = useRouter();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Task 2 - エッセイライティング</h1>
        <p className="text-gray-600 mb-8">
          タスクタイプ、レベル、エッセータイプを選択して開始してください
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/task/select?task_type=Task 2')}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            タスクを選択
          </button>
        </div>
      </div>
    </Layout>
  );
}
