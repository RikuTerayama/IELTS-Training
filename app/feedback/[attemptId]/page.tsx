'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { Feedback, Attempt } from '@/lib/domain/types';

export default function FeedbackPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Attempt取得
    fetch(`/api/attempts/${attemptId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setAttempt(data.data);
          // Attempt取得後にフィードバック生成または取得
          generateOrFetchFeedback(data.data);
        }
      })
      .catch(console.error);
  }, [attemptId]);

  const generateOrFetchFeedback = async (attemptData: Attempt) => {
    setGenerating(true);

    try {
      // まず既存のフィードバックを確認
      const existingResponse = await fetch(`/api/feedback/attempt/${attemptId}`);
      const existingData = await existingResponse.json();

      if (existingData.ok && existingData.data) {
        setFeedback(existingData.data);
        setLoading(false);
        setGenerating(false);
        return;
      }

      // 既存がない場合は生成
      const response = await fetch('/api/llm/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempt_id: attemptId,
          task_id: attemptData.task_id,
          user_response_text: attemptData.draft_content.final || '',
          level: attemptData.level,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setFeedback(data.data.feedback);
      } else {
        alert(data.error?.message || 'フィードバック生成に失敗しました');
      }
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  if (loading || generating) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            {generating ? 'フィードバックを生成中...' : '読み込み中...'}
          </div>
        </div>
      </Layout>
    );
  }

  if (!feedback) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">フィードバックが見つかりません</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Overall Band */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">
              Overall Band: {feedback.overall_band_range}
            </h2>
          </div>

          {/* Band-up actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">次にBandを上げる3つの行動</h2>
            <div className="space-y-4">
              {feedback.band_up_actions.map((action) => (
                <div key={action.priority} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">
                    {action.priority}. {action.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    <strong>理由:</strong> {action.why}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    <strong>方法:</strong> {action.how}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    <strong>例:</strong> {action.example}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4次元評価 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">4次元評価</h2>
            <div className="space-y-2">
              {feedback.dimensions.map((dim) => (
                <div key={dim.dimension} className="border-b border-gray-100 pb-2">
                  <p className="text-sm">
                    <strong>
                      {dim.dimension}
                      {dim.dimension === 'TR' && '（問いに答える）'}
                      {dim.dimension === 'CC' && '（論理の流れ）'}
                      {dim.dimension === 'LR' && '（語彙の幅）'}
                      {dim.dimension === 'GRA' && '（文法の正確さ）'}
                    </strong>
                    : {dim.short_comment} (Band: {dim.band_estimate})
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4">
            {feedback.rewrite_targets.length > 0 && (
              <button
                onClick={() => router.push(`/rewrite/${attemptId}`)}
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Rewrite
              </button>
            )}
            <button
              onClick={() => router.push(`/speak/${attemptId}`)}
              className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Speak
            </button>
            <button
              onClick={() => router.push('/home')}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              次のタスク
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

