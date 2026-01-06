/**
 * Task 1 進捗ダッシュボード
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { UserSkillStats, Attempt } from '@/lib/domain/types';

export default function Task1ProgressPage() {
  const router = useRouter();
  const [skillStats, setSkillStats] = useState<UserSkillStats | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [recommendation, setRecommendation] = useState<{
    level: 'beginner' | 'intermediate' | 'advanced';
    genre: string | null;
    mode: 'training' | 'exam';
    weaknesses: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // user_skill_statsを取得
    fetch('/api/task1/recommendation')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setRecommendation(data.data);
        }
      })
      .catch(console.error);

    // 直近のattemptsを取得
    fetch('/api/progress/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const task1Attempts = data.data.filter(
            (a: Attempt) => a.task_type === 'Task 1'
          );
          setRecentAttempts(task1Attempts.slice(0, 10));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStartRecommendedTask = async () => {
    if (!recommendation) return;

    try {
      // タスクを生成
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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  const weaknessLabels: Record<string, string> = {
    overview_missing: 'Overview欠如',
    comparison_missing: '比較表現不足',
    tense_inconsistent: '時制不一致',
    article_errors: '冠詞エラー',
    number_mismatch: '数字不一致',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Task 1 進捗ダッシュボード</h1>

          {/* 推薦タスク */}
          {recommendation && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800/50 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">おすすめタスク</h2>
              <div className="mb-4 space-y-2">
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  <strong>レベル:</strong> {recommendation.level}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  <strong>ジャンル:</strong> {recommendation.genre || 'ランダム'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  <strong>モード:</strong> {recommendation.mode}
                </p>
                {recommendation.weaknesses.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">改善すべき点:</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                      {recommendation.weaknesses.map((w) => (
                        <li key={w}>{weaknessLabels[w] || w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={handleStartRecommendedTask}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                推薦タスクを開始
              </button>
            </div>
          )}

          {/* 弱点統計 */}
          {skillStats && Object.keys(skillStats.counters).length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">弱点統計</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {Object.entries(skillStats.counters).map(([key, value]) => (
                  <div key={key} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700/50 p-3">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {weaknessLabels[key] || key}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 直近のattempts */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">最近の練習</h2>
            {recentAttempts.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">まだ練習記録がありません</p>
            ) : (
              <div className="space-y-2">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700/50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {attempt.level} - {attempt.mode || 'training'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {new Date(attempt.created_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/task/${attempt.task_id}`)}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      続きから
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

