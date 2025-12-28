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
    router.push('/task/select');
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

          {/* Trainingセクション */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">📚 Training</h2>
            <div className="space-y-4">
              {/* Writing */}
              <div>
                <h3 className="mb-3 text-md font-semibold text-gray-800">Writing</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push('/training/writing/task1')}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1">Task 1</div>
                    <div className="text-sm text-gray-600">グラフ・図表・地図の説明</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/writing/task2')}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1">Task 2</div>
                    <div className="text-sm text-gray-600">エッセイライティング</div>
                  </button>
                </div>
              </div>

              {/* Vocabulary */}
              <div>
                <h3 className="mb-3 text-md font-semibold text-gray-800">Vocabulary</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push('/training/vocabulary')}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1">単語練習</div>
                    <div className="text-sm text-gray-600">語彙力を向上させましょう</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/vocabulary/review')}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1">復習</div>
                    <div className="text-sm text-gray-600">間違えた問題を復習</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Blogセクション */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">📝 Blog</h2>
            <p className="mb-4 text-gray-700">
              IELTS学習に役立つ記事や最新情報をお届けします
            </p>
            <a
              href="https://ieltsconsult.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Blogを読む →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

