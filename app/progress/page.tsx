'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { AttemptHistory, ProgressSummary } from '@/lib/domain/types';

export default function ProgressPage() {
  const [history, setHistory] = useState<AttemptHistory[]>([]);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 履歴取得
    fetch('/api/progress/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setHistory(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // サマリー取得
    fetch('/api/progress/summary')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSummary(data.data);
        }
      })
      .catch(console.error);
  }, []);

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
          {/* Attempts一覧 */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Attempts一覧（最新10件）</h2>
            {history.length === 0 ? (
              <p className="text-text-muted">まだタスクがありません</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-border pb-2"
                  >
                    <div>
                      <p className="text-sm">
                        {new Date(item.completed_at).toLocaleDateString('ja-JP')} {item.level}{' '}
                        Band {item.band_estimate}
                      </p>
                      {item.weakness_tags.length > 0 && (
                        <p className="text-xs text-text-muted">
                          弱点: {item.weakness_tags.join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/feedback/${item.id}`)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      詳細
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 平均bandと弱点タグ推移 */}
          {summary && (
            <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">進捗サマリー</h2>
              <div className="space-y-2">
                {summary.average_band && (
                  <p>
                    平均band: <span className="font-medium">{summary.average_band}</span>
                  </p>
                )}
                {summary.weakness_tags.length > 0 && (
                  <p>
                    弱点タグ推移: <span className="font-medium">最近は{summary.weakness_tags.join(', ')}が弱め</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

