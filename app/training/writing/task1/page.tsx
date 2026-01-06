'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { cn, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

export default function WritingTask1Page() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<{
    level: 'beginner' | 'intermediate' | 'advanced';
    genre: string | null;
    mode: 'training' | 'exam';
    weaknesses: string[];
    reasoning: {
      level_reason: string;
      genre_reason: string;
      mode_reason: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 推薦を取得
    fetch('/api/task1/recommendation')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setRecommendation(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStartRecommended = async () => {
    if (!recommendation) return;

    try {
      const generateRes = await fetch('/api/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: recommendation.level,
          task_type: 'Task 1',
          genre: recommendation.genre,
        }),
      });

      if (!generateRes.ok) {
        throw new Error('Failed to generate task');
      }

      const generateData = await generateRes.json();
      if (generateData.ok) {
        // 推薦されたmodeをURLクエリパラメータに含める
        const modeParam = recommendation.mode === 'exam' ? '?mode=exam' : '';
        router.push(`/task/${generateData.data.id}${modeParam}`);
      }
    } catch (error) {
      console.error('Failed to start recommended task:', error);
      alert('タスクの生成に失敗しました');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-text">Task 1 - グラフ・図表・地図の説明</h1>
        
        {/* 推薦タスク */}
        {!loading && recommendation && (
          <div className={cn('mb-8 rounded-lg border border-primary/20 bg-accent-indigo/10 p-6 shadow-sm')}>
            <h2 className={cn('mb-4 text-lg font-semibold', 'text-text')}>おすすめタスク</h2>
            <div className="mb-4 space-y-2 text-sm">
              <p className="text-text">
                <strong>レベル:</strong> {recommendation.level}
              </p>
              <p className="text-text">
                <strong>ジャンル:</strong> {recommendation.genre || 'ランダム'}
              </p>
              <p className="text-text">
                <strong>モード:</strong> {recommendation.mode}
              </p>
              {recommendation.weaknesses.length > 0 && (
                <div className="mt-2">
                  <p className={cn('text-sm font-medium', 'text-text')}>改善すべき点:</p>
                  <ul className={cn('list-disc pl-5 text-sm', 'text-text-muted')}>
                    {recommendation.weaknesses.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={handleStartRecommended}
              className={cn('px-6 py-2', buttonPrimary)}
            >
              推薦タスクを開始
            </button>
          </div>
        )}

        <p className="mb-8 text-text-muted">
          タスクタイプ、レベル、形式を選択して開始してください
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => router.push('/task/select?task_type=Task 1')}
            className="rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            タスクを選択
          </button>
          <button
            onClick={() => router.push('/training/writing/task1/progress')}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-8 py-3 font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            進捗を見る
          </button>
        </div>
      </div>
    </Layout>
  );
}

