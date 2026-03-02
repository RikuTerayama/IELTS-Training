'use client';

import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

export default function SpeakingTask2Page() {
  const router = useRouter();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-text">Speaking Task 2 - スピーチ・説明</h1>
        <p className="text-text-muted mb-8">
          IELTS Speaking Part 2の形式で、トピックについて1-2分間の説明をする瞬間英作文を練習します
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/training/speaking/task2/drill?category=work_study')}
            className="px-8 py-3 bg-accent-violet text-accent-violet-foreground rounded-md hover:bg-accent-violet-hover transition-colors font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            瞬間英作文を開始
          </button>
        </div>
      </div>
    </Layout>
  );
}

