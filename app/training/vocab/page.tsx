'use client';

import { Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
import { VocabPageContent } from '@/components/vocab/VocabPageContent';
import { cn, cardTitle, cardDesc } from '@/lib/ui/theme';

export default function VocabPage() {
  return (
    <Layout variant="public">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className={cn('text-2xl font-bold mb-2', cardTitle)}>単語練習</h1>
              <p className={cn('text-sm', cardDesc)}>4技能の必須単語を覚えましょう</p>
            </div>
            <div className="text-center text-text-muted py-12">読み込み中...</div>
          </div>
        }
      >
        <VocabPageContent />
      </Suspense>
    </Layout>
  );
}
