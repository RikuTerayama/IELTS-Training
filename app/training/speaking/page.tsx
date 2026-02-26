'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

/** SPK-FR-2: カテゴリ × Task1〜3 のマトリクス。カテゴリを変えてもTaskは揃う */
const SPEAKING_CATEGORIES: { id: string; label: string; description: string }[] = [
  { id: 'work_study', label: 'Work & Study', description: '仕事・勉強・教育' },
  { id: 'hometown', label: 'Hometown', description: '故郷・住まい' },
  { id: 'hobbies', label: 'Hobbies', description: '趣味・余暇' },
  { id: 'technology', label: 'Technology', description: 'テクノロジー' },
  { id: 'environment', label: 'Environment', description: '環境・自然' },
  { id: 'introduction', label: 'Introduction', description: '自己紹介・日常' },
  { id: 'social', label: 'Social', description: '人間関係・社会' },
  { id: 'food', label: 'Food', description: '食べ物・食習慣' },
  { id: 'place', label: 'Place', description: '場所・旅行' },
  { id: 'event', label: 'Event', description: '出来事・経験' },
  { id: 'person', label: 'Person', description: '人物・影響を受けた人' },
  { id: 'education', label: 'Education', description: '教育・学習' },
  { id: 'society', label: 'Society', description: '社会・文化' },
  { id: 'culture', label: 'Culture', description: '文化・伝統' },
];

const TASKS = [
  { task: 1, label: 'Task 1', shortLabel: '1', description: '短問短答（複数質問・Nextで進行）' },
  { task: 2, label: 'Task 2', shortLabel: '2', description: 'Cue card（Prep 1分 / Speak 2分）' },
  { task: 3, label: 'Task 3', shortLabel: '3', description: 'Discussion（深掘り質問）' },
] as const;

type Step = 'category' | 'task';

export default function SpeakingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // URL から category, task を復元（例: /training/speaking?category=work_study&task=2）
  const categoryFromUrl = searchParams.get('category');
  const taskFromUrl = searchParams.get('task');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('task');
  };

  const handleTaskSelect = (task: number) => {
    if (!selectedCategory) return;
    router.push(`/training/speaking/task${task}/drill?category=${encodeURIComponent(selectedCategory)}`);
  };

  const handleBackToCategory = () => {
    setSelectedCategory(null);
    setStep('category');
  };

  const categoryLabel = selectedCategory
    ? SPEAKING_CATEGORIES.find((c) => c.id === selectedCategory)?.label ?? selectedCategory
    : '';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className={cn('text-2xl font-bold mb-2', cardTitle)}>Speaking</h1>
          <p className={cn('text-sm', cardDesc)}>
            カテゴリを選んでから Task 1・2・3 のいずれかで練習します。音声・テキスト入力はありません。
          </p>
        </div>

        {step === 'category' && (
          <div className="space-y-4">
            <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>カテゴリを選択</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SPEAKING_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 border-border bg-surface-2 text-left',
                    'hover:border-primary hover:bg-accent-indigo/10',
                    'transition-all duration-200',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                  )}
                >
                  <div className={cn('font-semibold', cardTitle)}>{cat.label}</div>
                  <div className={cn('text-xs mt-1', cardDesc)}>{cat.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'task' && selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToCategory}
                className={cn('text-sm', buttonSecondary)}
              >
                ← カテゴリを変える
              </button>
              <span className={cn('font-semibold', cardTitle)}>カテゴリ: {categoryLabel}</span>
            </div>
            <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>Task を選択（SPK-FR-1: Task1〜3）</h2>
            <div className="grid gap-4">
              {TASKS.map((t) => (
                <button
                  key={t.task}
                  onClick={() => handleTaskSelect(t.task)}
                  className={cn(
                    'p-6 rounded-xl border-2 border-border bg-surface-2 text-left',
                    'hover:border-primary hover:bg-accent-indigo/10',
                    'transition-all duration-200',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                  )}
                >
                  <div className={cn('font-semibold text-lg', cardTitle)}>{t.label}</div>
                  <div className={cn('text-sm mt-1', cardDesc)}>{t.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="/home" className={cn('text-sm', buttonSecondary)}>
            ← Home に戻る
          </Link>
        </div>
      </div>
    </Layout>
  );
}
