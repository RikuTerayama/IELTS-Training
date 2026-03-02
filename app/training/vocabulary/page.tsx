'use client';

import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

export default function VocabularyPage() {
  const router = useRouter();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">単語練習</h1>
        <p className="text-text-muted mb-8">
          技能とレベルを選択して開始してください
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/training/vocab')}
            className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
          >
            単語練習を開始
          </button>
        </div>
      </div>
    </Layout>
  );
}

