'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { Feedback, Attempt } from '@/lib/domain/types';
import { cn, cardBase, cardTitle, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

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
      console.log('[FeedbackPage] Checking for existing feedback...');
      const existingResponse = await fetch(`/api/feedback/attempt/${attemptId}`);
      
      if (!existingResponse.ok && existingResponse.status !== 200) {
        console.log('[FeedbackPage] No existing feedback found (status:', existingResponse.status, '), generating new feedback...');
      } else {
        const existingData = await existingResponse.json();
        console.log('[FeedbackPage] Existing feedback response:', existingData);

        if (existingData.ok && existingData.data) {
          console.log('[FeedbackPage] Using existing feedback');
          setFeedback(existingData.data);
          setLoading(false);
          setGenerating(false);
          return;
        }
      }

      // 既存がない場合は生成
      console.log('[FeedbackPage] Generating new feedback...');
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        console.error('[FeedbackPage] Feedback generation failed:', errorData);
        throw new Error(errorData.error?.message || `Failed to generate feedback: ${response.status}`);
      }

      const data = await response.json();
      console.log('[FeedbackPage] Feedback generation response:', data);

      if (data.ok) {
        setFeedback(data.data.feedback);
      } else {
        console.error('[FeedbackPage] API returned error:', data.error);
        throw new Error(data.error?.message || 'フィードバック生成に失敗しました');
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
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-text-muted">
            {generating ? 'フィードバックを生成中...' : '読み込み中...'}
          </div>
        </div>
      </Layout>
    );
  }

  if (!feedback) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-text-muted">フィードバックが見つかりません</div>
        </div>
      </Layout>
    );
  }

  // Band Rangeをパース（例: "6.0-6.5" → { min: 6.0, max: 6.5 }）
  const parseBandRange = (range: string) => {
    const match = range.match(/(\d+\.\d+)-(\d+\.\d+)/);
    if (match) {
      return { min: parseFloat(match[1]), max: parseFloat(match[2]) };
    }
    const singleMatch = range.match(/(\d+\.\d+)/);
    if (singleMatch) {
      const val = parseFloat(singleMatch[1]);
      return { min: val, max: val };
    }
    return { min: 0, max: 0 };
  };

  const bandRange = parseBandRange(feedback.overall_band_range);
  const averageBand = (bandRange.min + bandRange.max) / 2;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="space-y-8">
          {/* Overall Band - Data Visualization Style */}
          <div className={cn('p-8 rounded-2xl', cardBase, 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200')}>
            <div className="text-center mb-6">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Overall Band Score</h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold text-indigo-600">{averageBand.toFixed(1)}</span>
                <span className="text-2xl font-semibold text-text-muted">/ 9.0</span>
              </div>
              <p className="text-sm text-text-muted mt-2">Range: {feedback.overall_band_range}</p>
            </div>
            {/* Band Progress Bar */}
            <div className="w-full h-4 bg-surface-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${(averageBand / 9.0) * 100}%` }}
              />
            </div>
          </div>

          {/* Band-up actions - Actionable Cards Style */}
          <div className={cn('p-8 rounded-2xl', cardBase)}>
            <h2 className="text-2xl font-bold tracking-tight text-text mb-6">次にBandを上げる3つの行動</h2>
            <div className="space-y-4">
              {feedback.band_up_actions.map((action) => {
                const priorityColors: Record<number, string> = {
                  1: 'indigo',
                  2: 'blue',
                  3: 'emerald',
                };
                const color = priorityColors[action.priority] || 'indigo';
                
                return (
                  <div 
                    key={action.priority} 
                    className={cn(
                      'p-6 rounded-xl border-2 border-border bg-surface',
                      'hover:shadow-md hover:border-indigo-300 transition-all duration-200',
                      'cursor-pointer'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-${color}-100 border border-${color}-200 flex items-center justify-center shrink-0`}>
                        <span className={`text-xl font-bold text-${color}-600`}>{action.priority}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text mb-3">{action.title}</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-text">理由:</span>
                            <span className="ml-2 text-text-muted">{action.why}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-text">方法:</span>
                            <span className="ml-2 text-text-muted">{action.how}</span>
                          </div>
                          <div className="mt-3 p-3 rounded-lg bg-surface-2 border border-border">
                            <span className="font-semibold text-text">例:</span>
                            <span className="ml-2 text-text-muted">{action.example}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4次元評価 - Data Visualization Style */}
          <div className={cn('p-8 rounded-2xl', cardBase)}>
            <h2 className="text-2xl font-bold tracking-tight text-text mb-6">4次元評価</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {feedback.dimensions.map((dim) => {
                const dimensionLabels: Record<string, string> = {
                  'TR': '問いに答える',
                  'CC': '論理の流れ',
                  'LR': '語彙の幅',
                  'GRA': '文法の正確さ',
                };
                const dimensionColors: Record<string, string> = {
                  'TR': 'indigo',
                  'CC': 'blue',
                  'LR': 'emerald',
                  'GRA': 'purple',
                };
                const color = dimensionColors[dim.dimension] || 'indigo';
                const bandValue = parseFloat(dim.band_estimate) || 0;
                
                return (
                  <div key={dim.dimension} className="p-6 rounded-xl bg-surface-2 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold text-text">{dim.dimension}</div>
                        <div className="text-xs text-text-muted">{dimensionLabels[dim.dimension]}</div>
                      </div>
                      <div className="text-2xl font-bold text-indigo-600">{bandValue.toFixed(1)}</div>
                    </div>
                    {/* Band Progress Bar */}
                    <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden mb-3">
                      <div 
                        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full transition-all duration-1000`}
                        style={{ width: `${(bandValue / 9.0) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">{dim.short_comment}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* アクションボタン - Paper Interface Style */}
          <div className="flex flex-wrap gap-4">
            {feedback.rewrite_targets.length > 0 && (
              <button
                onClick={() => router.push(`/rewrite/${attemptId}`)}
                className={cn('px-6 py-3', buttonPrimary, 'bg-emerald-600 hover:bg-emerald-700')}
              >
                Rewrite
              </button>
            )}
            <button
              onClick={() => router.push(`/speak/${attemptId}`)}
              className={cn('px-6 py-3', buttonPrimary, 'bg-purple-600 hover:bg-purple-700')}
            >
              Speak
            </button>
            <button
              onClick={() => router.push('/home')}
              className={cn('px-6 py-3', buttonSecondary)}
            >
              次のタスク
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

