'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { AttemptHistory, ProgressSummary } from '@/lib/domain/types';
import type { ApiResponse } from '@/lib/api/response';
import type { ReadingVocabHistoryResponse } from '@/app/api/progress/reading-vocab-history/route';

type UsageTodayData = {
  is_pro: boolean;
  writing_limit: number;
  speaking_limit: number;
  writing_remaining: number;
  speaking_remaining: number;
  reset_at: string;
};

export interface SpeakingHistoryItem {
  id: string;
  created_at: string;
  topic: string | null;
  part: string | null;
  question_preview: string;
  word_count: number;
  overall_band?: number | null;
}

const READING_QUESTION_TYPE_LABELS: Record<string, string> = {
  paraphrase_drill: 'Paraphrase Drill',
  matching_headings: 'Matching Headings',
  tfng: 'True / False / Not Given',
  summary_completion: 'Summary Completion',
};

export default function ProgressPage() {
  const [history, setHistory] = useState<AttemptHistory[]>([]);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [speakingHistory, setSpeakingHistory] = useState<SpeakingHistoryItem[]>([]);
  const [speakingHistoryLoading, setSpeakingHistoryLoading] = useState(true);
  const [speakingHistoryError, setSpeakingHistoryError] = useState<string | null>(null);
  const [usageToday, setUsageToday] = useState<UsageTodayData | null>(null);
  const [readingHistory, setReadingHistory] = useState<ReadingVocabHistoryResponse | null>(null);
  const [readingHistoryLoading, setReadingHistoryLoading] = useState(true);
  const [readingHistoryError, setReadingHistoryError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/usage/today')
      .then((res) => res.json())
      .then((data: ApiResponse<UsageTodayData>) => {
        if (data.ok && data.data) setUsageToday(data.data);
      })
      .catch(() => {});
  }, []);

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

  useEffect(() => {
    setSpeakingHistoryLoading(true);
    setSpeakingHistoryError(null);
    fetch('/api/progress/speaking-history')
      .then((res) => {
        if (res.status === 401) {
          setSpeakingHistoryError('ログインが必要です');
          return { ok: false };
        }
        return res.json();
      })
      .then((data: ApiResponse<SpeakingHistoryItem[]>) => {
        if (data.ok && Array.isArray(data.data)) {
          setSpeakingHistory(data.data);
          setSpeakingHistoryError(null);
        } else if (data.error?.message) {
          setSpeakingHistoryError(data.error.message);
        }
      })
      .catch(() => setSpeakingHistoryError('Network error'))
      .finally(() => setSpeakingHistoryLoading(false));
  }, []);

  useEffect(() => {
    setReadingHistoryLoading(true);
    setReadingHistoryError(null);
    fetch('/api/progress/reading-vocab-history')
      .then((res) => {
        if (res.status === 401) {
          setReadingHistoryError('ログインが必要です');
          return { ok: false };
        }
        return res.json();
      })
      .then((data: ApiResponse<ReadingVocabHistoryResponse>) => {
        if (data.ok && data.data) {
          setReadingHistory(data.data);
          setReadingHistoryError(null);
        } else if (data.error?.message) {
          setReadingHistoryError(data.error.message);
        }
      })
      .catch(() => setReadingHistoryError('Network error'))
      .finally(() => setReadingHistoryLoading(false));
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
          {usageToday && !usageToday.is_pro && (
            <p className="text-sm text-gray-600 flex flex-wrap items-baseline gap-x-1">
              Need more attempts?{' '}
              <Link href="/#pricing" className="text-indigo-600 hover:underline">
                View pricing
              </Link>
            </p>
          )}
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

          {/* Speaking History（直近5件） */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">Speaking History</h2>
            <p className="mb-4 text-sm text-text-muted">Recent speaking interview attempts (Part 1 beta).</p>
            {speakingHistoryLoading ? (
              <p className="text-sm text-text-muted">読み込み中...</p>
            ) : speakingHistoryError ? (
              <p className="text-sm text-amber-600">{speakingHistoryError}</p>
            ) : speakingHistory.length === 0 ? (
              <p className="text-sm text-text-muted">まだスピーキング面接の記録がありません</p>
            ) : (
              <div className="space-y-2">
                {speakingHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text">
                        {new Date(item.created_at).toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' })}
                        {' · '}
                        {item.topic ?? '-'} / {item.part ?? '-'}
                        {' · '}
                        Band {item.overall_band != null ? item.overall_band : '-'}
                        {' · '}
                        {item.word_count} words
                      </p>
                      <p className="text-xs text-text-muted truncate" title={item.question_preview}>
                        {item.question_preview}
                      </p>
                    </div>
                    <Link
                      href={`/speaking/feedback/${item.id}`}
                      className="shrink-0 text-sm text-indigo-600 hover:underline"
                    >
                      View details
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link
                href="/exam/speaking"
                className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
              >
                Try another interview
              </Link>
            </div>
          </div>

          {/* Reading History (vocab Academic v1) */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">Reading History</h2>
            <p className="mb-4 text-sm text-text-muted">
              Recent Academic Reading vocab practice (paraphrase, headings, TFNG, summary).
              {readingHistory?.due_count != null && readingHistory.due_count > 0 && (
                <span className="ml-1 font-medium text-primary">
                  · Due today: {readingHistory.due_count}
                </span>
              )}
            </p>
            {readingHistoryLoading ? (
              <p className="text-sm text-text-muted">読み込み中...</p>
            ) : readingHistoryError ? (
              <p className="text-sm text-amber-600">{readingHistoryError}</p>
            ) : !readingHistory || (readingHistory.history.length === 0 && readingHistory.stats_by_type.length === 0) ? (
              <p className="text-sm text-text-muted">まだ Reading の記録がありません</p>
            ) : (
              <>
                {readingHistory.stats_by_type.length > 0 && (
                  <div className="mb-4 rounded-lg border border-border bg-surface-2 p-4">
                    <h3 className="mb-2 text-sm font-semibold">By question type</h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {readingHistory.stats_by_type.map((s) => (
                        <div key={s.question_type} className="text-sm">
                          <span className="font-medium">{s.question_type}:</span>{' '}
                          {s.correct}/{s.total} ({s.accuracy_percent}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {readingHistory.history.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-text">
                          {new Date(item.created_at).toLocaleString('ja-JP', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}{' '}
                          · {READING_QUESTION_TYPE_LABELS[item.question_type ?? ''] ?? item.question_type ?? '-'}{' '}
                          · {item.is_correct ? (
                            <span className="text-green-600">Correct</span>
                          ) : (
                            <span className="text-amber-600">Incorrect</span>
                          )}
                        </p>
                        {item.user_answer != null && item.user_answer !== '' && (
                          <p className="text-xs text-text-muted">
                            Answer: {item.user_answer}
                          </p>
                        )}
                        <p
                          className="mt-1 truncate text-xs text-text-muted"
                          title={item.prompt}
                        >
                          {item.prompt.slice(0, 80)}
                          {item.prompt.length > 80 ? '…' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/training/vocab?skill=reading"
                className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
              >
                {readingHistory?.due_count != null && readingHistory.due_count > 0
                  ? 'Review Reading'
                  : 'Practice Reading'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

