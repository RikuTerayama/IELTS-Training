'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { Task, ProgressSummary } from '@/lib/domain/types';

export default function HomePage() {
  const [recommendedTask, setRecommendedTask] = useState<{
    task: Task;
    estimated_time: number;
  } | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 推奨タスク取得
    fetch('/api/tasks/recommended')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setRecommendedTask(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // 進捗サマリー取得
    fetch('/api/progress/summary')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSummary(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleStartTask = () => {
    if (recommendedTask) {
      router.push(`/task/${recommendedTask.task.id}`);
    }
  };

  const handleChooseLevel = () => {
    // TODO: レベル選択モーダル（簡易版では初級に固定）
    router.push('/task/new?level=beginner');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* カード1: 今日のおすすめ */}
          {recommendedTask && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">今日のおすすめ</h2>
              <div className="space-y-2">
                <p>
                  レベル: <span className="font-medium">{recommendedTask.task.level}</span>
                </p>
                <p>
                  所要時間: <span className="font-medium">{recommendedTask.estimated_time}分</span>
                </p>
                <button
                  onClick={handleStartTask}
                  className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Start
                </button>
              </div>
            </div>
          )}

          {/* カード2: 弱点タグ */}
          {summary && summary.weakness_tags.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">弱点タグ</h2>
              <p className="text-gray-700">
                最近は{summary.weakness_tags.join(', ')}が弱め
              </p>
            </div>
          )}

          {/* クイックアクション */}
          <div className="flex gap-4">
            <button
              onClick={handleChooseLevel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Choose level
            </button>
            <button
              onClick={() => router.push('/vocab')}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Vocab 10問
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

