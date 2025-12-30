'use client';

import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

export default function SpeakingTask2Page() {
  const router = useRouter();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Speaking Task 2 - スピーチ・説明</h1>
        <p className="text-gray-600 mb-8">
          IELTS Speaking Part 2の形式で、トピックについて1-2分間の説明をする瞬間英作文を練習します
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/training/speaking/task2/drill')}
            className="px-8 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-semibold"
          >
            瞬間英作文を開始
          </button>
        </div>
      </div>
    </Layout>
  );
}

