'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

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
        router.push(`/task/${generateData.data.id}`);
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
          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800/50 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">おすすめタスク</h2>
            <div className="mb-4 space-y-2 text-sm">
              <p className="text-slate-700 dark:text-slate-200">
                <strong>レベル:</strong> {recommendation.level}
              </p>
              <p className="text-slate-700 dark:text-slate-200">
                <strong>ジャンル:</strong> {recommendation.genre || 'ランダム'}
              </p>
              <p className="text-slate-700 dark:text-slate-200">
                <strong>モード:</strong> {recommendation.mode}
              </p>
              {recommendation.weaknesses.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">改善すべき点:</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                    {recommendation.weaknesses.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={handleStartRecommended}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
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

