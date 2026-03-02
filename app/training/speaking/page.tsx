'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SPEAKING_CATEGORIES, DEFAULT_SPEAKING_CATEGORY, normalizeSpeakingCategory } from '@/lib/data/speaking_categories';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary } from '@/lib/ui/theme';

/** AC-O2/AC-S2: カテゴリ×Task選択画面。textarea・録音・回答入力は置かない。開始で task{n}/drill?category= へ遷移 */
const TASKS = [
  { id: 1, label: 'Task 1', desc: '基本的な質問・自己紹介' },
  { id: 2, label: 'Task 2', desc: 'Cue card（1分準備・2分スピーチ）' },
  { id: 3, label: 'Task 3', desc: '深掘りディスカッション' },
] as const;

function SpeakingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = normalizeSpeakingCategory(searchParams.get('category'));
  const taskParam = searchParams.get('task');
  const task = taskParam === '2' ? 2 : taskParam === '3' ? 3 : 1;

  const setCategory = useCallback(
    (slug: string) => {
      const u = new URLSearchParams(searchParams.toString());
      u.set('category', slug);
      if (taskParam) u.set('task', String(task));
      router.replace(`/training/speaking?${u.toString()}`);
    },
    [router, searchParams, taskParam]
  );
  const setTask = useCallback(
    (t: 1 | 2 | 3) => {
      const u = new URLSearchParams(searchParams.toString());
      u.set('task', String(t));
      if (!u.has('category')) u.set('category', category);
      router.replace(`/training/speaking?${u.toString()}`);
    },
    [router, searchParams, category]
  );

  useEffect(() => {
    const c = searchParams.get('category');
    if (!c) {
      const u = new URLSearchParams(searchParams.toString());
      u.set('category', DEFAULT_SPEAKING_CATEGORY);
      if (searchParams.get('task')) u.set('task', searchParams.get('task')!);
      router.replace(`/training/speaking?${u.toString()}`);
    }
  }, [searchParams, router]);

  const handleStart = () => {
    router.push(`/training/speaking/task${task}/drill?category=${encodeURIComponent(category)}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className={cn('text-2xl font-bold mb-2', cardTitle)}>Speaking練習</h1>
          <p className={cn('text-sm', cardDesc)}>カテゴリとTaskを選んで、実施画面へ進みましょう（入力欄はありません）</p>
        </div>

        {/* カテゴリ選択 */}
        <div className={cn('p-6 mb-6', cardBase)}>
          <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>カテゴリ</h2>
          <div className="flex flex-wrap gap-2">
            {SPEAKING_CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                  category === c.slug
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task選択 */}
        <div className={cn('p-6 mb-6', cardBase)}>
          <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>Task</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {TASKS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTask(t.id)}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  task === t.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-indigo-200'
                )}
              >
                <div className="font-bold text-slate-900">{t.label}</div>
                <div className="text-sm text-slate-600 mt-1">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 開始ボタン */}
        <div className="flex justify-center">
          <button onClick={handleStart} className={cn('px-8 py-3', buttonPrimary)}>
            {TASKS.find((t) => t.id === task)?.label ?? 'Task 1'} を開始
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default function SpeakingPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className={cn('text-2xl font-bold mb-2', cardTitle)}>Speaking練習</h1>
            <p className={cn('text-sm', cardDesc)}>カテゴリとTaskを選んで、実施画面へ進みましょう</p>
          </div>
          <div className="text-center text-text-muted py-12">読み込み中...</div>
        </div>
      </Layout>
    }>
      <SpeakingPageContent />
    </Suspense>
  );
}
