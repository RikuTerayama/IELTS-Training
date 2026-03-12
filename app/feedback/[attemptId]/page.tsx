'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
  const [error, setError] = useState<string | null>(null);
  const [isRateLimit, setIsRateLimit] = useState(false);
  const [upgradeUrl, setUpgradeUrl] = useState('/#pricing');

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
    setError(null);
    setIsRateLimit(false);

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

      const data = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      console.log('[FeedbackPage] Feedback generation response:', data);

      if (response.ok && data.ok) {
        setFeedback(data.data.feedback);
      } else {
        const err = data.error;
        if (err?.code === 'RATE_LIMIT' || response.status === 429) {
          setIsRateLimit(true);
          const details = err?.details;
          setUpgradeUrl(details && typeof details === 'object' && 'upgrade_url' in details && typeof (details as { upgrade_url?: string }).upgrade_url === 'string'
            ? (details as { upgrade_url: string }).upgrade_url
            : '/#pricing');
        }
        setError(err?.message || `Failed to generate feedback: ${response.status}`);
      }
    } catch (err) {
      console.error(err);
      setError('エラーが発生しました');
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
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <div className="space-y-4">
            <div className={cn('p-6 rounded-xl', cardBase, 'border-red-200 bg-red-50')}>
              <p className="text-sm text-red-800">
                {error || 'フィードバックが見つかりません'}
              </p>
            </div>
            {isRateLimit && (
              <div className={cn('p-6 rounded-xl', cardBase, 'border-amber-200 bg-amber-50/80')}>
                <h3 className="mb-1 font-semibold text-amber-900">
                  本日の無料枠に達しました
                </h3>
                <p className="mb-3 text-sm text-amber-800">
                  Pro にアップグレードすると回数無制限・履歴保存が利用できます。明日になると無料枠がリセットされます。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={upgradeUrl} className={cn(buttonPrimary)}>
                    料金を見る
                  </Link>
                  <Link href="/progress" className={cn(buttonSecondary, 'inline-flex')}>
                    履歴を見る
                  </Link>
                  <Link href="/home" className={cn(buttonSecondary, 'inline-flex')}>
                    ホームに戻る
                  </Link>
                </div>
              </div>
            )}
            {!isRateLimit && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push('/home')}
                  className={cn(buttonPrimary)}
                >
                  ホームに戻る
                </button>
              </div>
            )}
          </div>
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
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">総合 Band スコア</h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold text-indigo-600">{averageBand.toFixed(1)}</span>
                <span className="text-2xl font-semibold text-text-muted">/ 9.0</span>
              </div>
              <p className="text-sm text-text-muted mt-2">推定レンジ: {feedback.overall_band_range}</p>
              <p className="mt-2 text-xs text-text-muted">
                <Link href="/#pricing" className="text-indigo-600 hover:underline">Pro</Link>で回数無制限・履歴保存
              </p>
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
                const priorityStyles: Record<number, { bg: string; border: string; text: string }> = {
                  1: { bg: 'bg-indigo-100', border: 'border-indigo-200', text: 'text-indigo-600' },
                  2: { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-600' },
                  3: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-600' },
                };
                const style = priorityStyles[action.priority] ?? priorityStyles[1];
                return (
                  <div
                    key={action.priority}
                    className={cn(
                      'p-6 rounded-xl border-2 border-border bg-surface',
                      'hover:shadow-md hover:border-indigo-300 transition-all duration-200'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border', style.bg, style.border)}>
                        <span className={cn('text-xl font-bold', style.text)}>{action.priority}</span>
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

          {/* 良い点 */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className={cn('p-8 rounded-2xl', cardBase)}>
              <h2 className="text-2xl font-bold tracking-tight text-text mb-6">良い点</h2>
              <ul className="space-y-3">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">{s.dimension}</span>
                    <div>
                      <p className="text-sm text-text">{s.description}</p>
                      {s.example && <p className="mt-1 text-xs text-text-muted">例: {s.example}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4次元評価 - IELTS 基準名 */}
          <div className={cn('p-8 rounded-2xl', cardBase)}>
            <h2 className="text-2xl font-bold tracking-tight text-text mb-6">基準別評価</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {feedback.dimensions.map((dim) => {
                const dimensionNames: Record<string, string> = {
                  'TR': 'Task Response / Task Achievement',
                  'CC': 'Coherence and Cohesion',
                  'LR': 'Lexical Resource',
                  'GRA': 'Grammatical Range and Accuracy',
                };
                const dimensionBarClass: Record<string, string> = {
                  'TR': 'h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000',
                  'CC': 'h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000',
                  'LR': 'h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000',
                  'GRA': 'h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000',
                };
                const bandValue = parseFloat(dim.band_estimate) || 0;
                return (
                  <div key={dim.dimension} className="p-6 rounded-xl bg-surface-2 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm font-bold text-text">{dimensionNames[dim.dimension] ?? dim.dimension}</div>
                      </div>
                      <div className="text-2xl font-bold text-indigo-600">{bandValue.toFixed(1)}</div>
                    </div>
                    <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden mb-3">
                      <div
                        className={dimensionBarClass[dim.dimension] ?? dimensionBarClass['TR']}
                        style={{ width: `${(bandValue / 9.0) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">{dim.short_comment}</p>
                    {dim.explanation && <p className="mt-2 text-xs text-text-muted">{dim.explanation}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 具体的に直す箇所 */}
          {feedback.rewrite_targets && feedback.rewrite_targets.length > 0 && (
            <div className={cn('p-8 rounded-2xl', cardBase)}>
              <h2 className="text-2xl font-bold tracking-tight text-text mb-6">具体的に直す箇所</h2>
              <div className="space-y-4">
                {feedback.rewrite_targets.map((t, i) => (
                  <div key={t.target_id || i} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                    <p className="text-sm font-semibold text-text mb-1">該当文: {t.original_text}</p>
                    <p className="text-sm text-text-muted">{t.issue_description}</p>
                    <p className="mt-2 text-sm text-text"><span className="font-medium">修正のポイント:</span> {t.rewrite_guidance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 語彙の改善案 */}
          {feedback.vocab_suggestions && feedback.vocab_suggestions.length > 0 && (
            <div className={cn('p-8 rounded-2xl', cardBase)}>
              <h2 className="text-2xl font-bold tracking-tight text-text mb-6">語彙の改善案</h2>
              <div className="space-y-3">
                {feedback.vocab_suggestions.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface-2 border border-border">
                    <p className="text-sm font-medium text-text">&quot;{v.original_word}&quot; → {v.suggestions.join(', ')}</p>
                    {v.context && <p className="text-xs text-text-muted mt-1">文脈: {v.context}</p>}
                    {v.explanation && <p className="text-xs text-text-muted mt-1">{v.explanation}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex flex-wrap gap-4">
            {feedback.rewrite_targets && feedback.rewrite_targets.length > 0 && (
              <button
                onClick={() => router.push(`/rewrite/${attemptId}`)}
                className={cn('px-6 py-3', buttonPrimary, 'bg-emerald-600 hover:bg-emerald-700')}
              >
                改善して書き直す
              </button>
            )}
            <Link href="/progress" className={cn('px-6 py-3', buttonSecondary, 'inline-flex')}>
              履歴を見る
            </Link>
            <button
              onClick={() => router.push('/home')}
              className={cn('px-6 py-3', buttonSecondary)}
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

