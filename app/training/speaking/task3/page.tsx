'use client';

import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

export default function SpeakingTask3Page() {
  const router = useRouter();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Speaking Task 3 - 抽象的議論・意見</h1>
        <p className="text-gray-600 mb-8">
          IELTS Speaking Part 3の形式で、抽象的・理論的な質問に対する意見を述べる瞬間英作文を練習します
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/training/speaking/task3/drill')}
            className="px-8 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-semibold"
          >
            瞬間英作文を開始
          </button>
        </div>
      </div>
    </Layout>
  );
}

