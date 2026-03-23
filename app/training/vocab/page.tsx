'use client';

import { Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
import { VocabPageContent } from '@/components/vocab/VocabPageContent';
import { cn, cardDesc, cardTitle } from '@/lib/ui/theme';

export default function TrainingVocabPage() {
  return (
    <Layout variant="public">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className={cn('mb-2 text-2xl font-bold', cardTitle)}>単語練習</h1>
              <p className={cn('text-sm', cardDesc)}>4技能別の単語カテゴリを選んで、短いセットから練習できます。</p>
            </div>
            <div className="py-12 text-center text-text-muted">読み込み中...</div>
          </div>
        }
      >
        <VocabPageContent />
      </Suspense>
    </Layout>
  );
}
