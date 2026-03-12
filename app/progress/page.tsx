'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { AttemptHistory, ProgressSummary } from '@/lib/domain/types';
import type { ApiResponse } from '@/lib/api/response';
import type { ReadingVocabHistoryResponse } from '@/app/api/progress/reading-vocab-history/route';
import type { ReadingLexiconHistoryResponse } from '@/app/api/progress/reading-lexicon-history/route';
import type { ListeningVocabHistoryResponse } from '@/app/api/progress/listening-vocab-history/route';
import type { ListeningIdiomHistoryResponse } from '@/app/api/progress/listening-idiom-history/route';
import type { ListeningLexiconHistoryResponse } from '@/app/api/progress/listening-lexicon-history/route';
import { READING_LEXICON_CATEGORY_LABELS } from '@/data/lexicon/reading/types';
import { LISTENING_IDIOM_CATEGORY_LABELS } from '@/data/idiom/listening';
import { LISTENING_LEXICON_CATEGORY_LABELS } from '@/data/lexicon/listening';

const LISTENING_VOCAB_CATEGORY_LABELS: Record<string, string> = {
  vocab_listening_form_note: 'Form / note completion',
  vocab_listening_campus_daily: 'Campus / daily life',
  vocab_listening_lecture: 'Lecture vocabulary',
  vocab_listening_numbers_dates_spelling: 'Numbers / dates / spelling',
  vocab_listening_spoken_distractors: 'Spoken distractors',
  vocab_listening_paraphrase_conversation: 'Paraphrase in conversation',
};

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
  const [readingLexiconHistory, setReadingLexiconHistory] = useState<ReadingLexiconHistoryResponse | null>(null);
  const [readingLexiconLoading, setReadingLexiconLoading] = useState(true);
  const [readingLexiconError, setReadingLexiconError] = useState<string | null>(null);
  const [listeningVocabHistory, setListeningVocabHistory] = useState<ListeningVocabHistoryResponse | null>(null);
  const [listeningVocabLoading, setListeningVocabLoading] = useState(true);
  const [listeningVocabError, setListeningVocabError] = useState<string | null>(null);
  const [listeningIdiomHistory, setListeningIdiomHistory] = useState<ListeningIdiomHistoryResponse | null>(null);
  const [listeningIdiomLoading, setListeningIdiomLoading] = useState(true);
  const [listeningIdiomError, setListeningIdiomError] = useState<string | null>(null);
  const [listeningLexiconHistory, setListeningLexiconHistory] = useState<ListeningLexiconHistoryResponse | null>(null);
  const [listeningLexiconLoading, setListeningLexiconLoading] = useState(true);
  const [listeningLexiconError, setListeningLexiconError] = useState<string | null>(null);
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

  useEffect(() => {
    setReadingLexiconLoading(true);
    setReadingLexiconError(null);
    fetch('/api/progress/reading-lexicon-history')
      .then((res) => {
        if (res.status === 401) {
          setReadingLexiconError('ログインが必要です');
          return { ok: false };
        }
        return res.json();
      })
      .then((data: ApiResponse<ReadingLexiconHistoryResponse>) => {
        if (data.ok && data.data) {
          setReadingLexiconHistory(data.data);
          setReadingLexiconError(null);
        } else if (data.error?.message) {
          setReadingLexiconError(data.error.message);
        }
      })
      .catch(() => setReadingLexiconError('Network error'))
      .finally(() => setReadingLexiconLoading(false));
  }, []);

  useEffect(() => {
    setListeningVocabLoading(true);
    setListeningVocabError(null);
    fetch('/api/progress/listening-vocab-history')
      .then((res) => {
        if (res.status === 401) {
          setListeningVocabError('ログインが必要です');
          return { ok: false };
        }
        return res.json();
      })
      .then((data: ApiResponse<ListeningVocabHistoryResponse>) => {
        if (data.ok && data.data) {
          setListeningVocabHistory(data.data);
          setListeningVocabError(null);
        } else if (data.error?.message) {
          setListeningVocabError(data.error.message);
        }
      })
      .catch(() => setListeningVocabError('Network error'))
      .finally(() => setListeningVocabLoading(false));
  }, []);

  useEffect(() => {
    setListeningIdiomLoading(true);
    setListeningIdiomError(null);
    fetch('/api/progress/listening-idiom-history')
      .then((res) => {
        if (res.status === 401) {
          setListeningIdiomError('ログインが必要です');
          return { ok: false };
        }
        return res.json();
      })
      .then((data: ApiResponse<ListeningIdiomHistoryResponse>) => {
        if (data.ok && data.data) {
          setListeningIdiomHistory(data.data);
          setListeningIdiomError(null);
        } else if (data.error?.message) {
          setListeningIdiomError(data.error.message);
        }
      })
      .catch(() => setListeningIdiomError('Network error'))
      .finally(() => setListeningIdiomLoading(false));
  }, []);

  useEffect(() => {
    setListeningLexiconLoading(true);
    setListeningLexiconError(null);
    fetch('/api/progress/listening-lexicon-history')
      .then((res) => {
        if (res.status === 401) {
          setListeningLexiconError('ログインが必要です');
          return { ok: false };
        }
        return res.json();
      })
      .then((data: ApiResponse<ListeningLexiconHistoryResponse>) => {
        if (data.ok && data.data) {
          setListeningLexiconHistory(data.data);
          setListeningLexiconError(null);
        } else if (data.error?.message) {
          setListeningLexiconError(data.error.message);
        }
      })
      .catch(() => setListeningLexiconError('Network error'))
      .finally(() => setListeningLexiconLoading(false));
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

          {/* Speaking 面接履歴 */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">スピーキング面接履歴</h2>
            <p className="mb-4 text-sm text-text-muted">直近の面接記録（Part 1 ベータ）。日付・Band・トピックで確認できます。</p>
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
                      詳細
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
                もう一度面接する
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
                {readingHistory.stats_by_skill?.length > 0 && (
                  <div className="mb-4 rounded-lg border border-border bg-surface-2 p-4">
                    <h3 className="mb-2 text-sm font-semibold">By skill (weakness-aware)</h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {readingHistory.stats_by_skill.map((s) => (
                        <div key={s.skill} className="text-sm">
                          <span className="font-medium">{s.skill}:</span>{' '}
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
                  ? 'Review Reading Vocab'
                  : 'Practice Reading Vocab'}
              </Link>
              <Link
                href="/training/lexicon?skill=reading"
                className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
              >
                Reading Lexicon (Signal Bank)
              </Link>
            </div>
          </div>

          {/* Reading Lexicon (Signal Bank) – 履歴・Due・カテゴリ別正答率 */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">Reading Lexicon (Signal Bank)</h2>
            <p className="mb-4 text-sm text-text-muted">
              Academic Reading の論理・構造・学術表現（Cause/Effect, Contrast, Evidence など）の練習記録。
              {readingLexiconHistory?.due_count != null && readingLexiconHistory.due_count > 0 && (
                <span className="ml-1 font-medium text-primary">
                  · Due today: {readingLexiconHistory.due_count}
                </span>
              )}
            </p>
            {readingLexiconLoading ? (
              <p className="text-sm text-text-muted">読み込み中...</p>
            ) : readingLexiconError ? (
              <p className="text-sm text-amber-600">{readingLexiconError}</p>
            ) : !readingLexiconHistory ||
              (readingLexiconHistory.history.length === 0 &&
                readingLexiconHistory.stats_by_category.length === 0 &&
                (readingLexiconHistory.due_count ?? 0) === 0) ? (
              <div className="rounded-lg border border-border bg-surface-2 p-6 text-center">
                <p className="text-sm text-text-muted">まだ Reading Lexicon の記録がありません</p>
                <p className="mt-1 text-xs text-text-muted">
                  表現バンクで Signal phrase を練習すると、ここに履歴と正答率が表示されます
                </p>
                <Link
                  href="/training/lexicon?skill=reading"
                  className="mt-4 inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                >
                  Reading Lexicon を始める
                </Link>
              </div>
            ) : (
              <>
                {readingLexiconHistory.stats_by_category.length > 0 && (
                  <div className="mb-4 rounded-lg border border-border bg-surface-2 p-4">
                    <h3 className="mb-2 text-sm font-semibold">By category（正答率）</h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {readingLexiconHistory.stats_by_category.map((s) => (
                        <div key={s.category} className="text-sm">
                          <span className="font-medium">{s.category_label}:</span>{' '}
                          {s.correct}/{s.total} ({s.accuracy_percent}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {readingLexiconHistory.history.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold">Recent attempts</h3>
                    <div className="space-y-2">
                      {readingLexiconHistory.history.map((item) => (
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
                              · {READING_LEXICON_CATEGORY_LABELS[item.category as keyof typeof READING_LEXICON_CATEGORY_LABELS] ?? item.category}{' '}
                              · {item.is_correct ? (
                                <span className="text-green-600">Correct</span>
                              ) : (
                                <span className="text-amber-600">Incorrect</span>
                              )}
                            </p>
                            {item.user_answer != null && item.user_answer !== '' && (
                              <p className="text-xs text-text-muted">Answer: {item.user_answer}</p>
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
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/training/lexicon?skill=reading"
                    className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                  >
                    {readingLexiconHistory?.due_count != null && readingLexiconHistory.due_count > 0
                      ? 'Review Reading Lexicon'
                      : 'Practice Reading Lexicon'}
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Listening Vocab v1 – 履歴・Due・カテゴリ別正答率 */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">Listening Vocab</h2>
            <p className="mb-4 text-sm text-text-muted">
              IELTS Listening の語彙練習（Form/note, Campus, Lecture, Numbers, Distractors, Paraphrase）の記録。
              {listeningVocabHistory?.due_count != null && listeningVocabHistory.due_count > 0 && (
                <span className="ml-1 font-medium text-primary">
                  · Due today: {listeningVocabHistory.due_count}
                </span>
              )}
            </p>
            {listeningVocabLoading ? (
              <p className="text-sm text-text-muted">読み込み中...</p>
            ) : listeningVocabError ? (
              <p className="text-sm text-amber-600">{listeningVocabError}</p>
            ) : !listeningVocabHistory ||
              (listeningVocabHistory.history.length === 0 &&
                listeningVocabHistory.stats_by_category.length === 0 &&
                (listeningVocabHistory.due_count ?? 0) === 0) ? (
              <div className="rounded-lg border border-border bg-surface-2 p-6 text-center">
                <p className="text-sm text-text-muted">まだ Listening Vocab の記録がありません</p>
                <p className="mt-1 text-xs text-text-muted">
                  単語練習で Listening を練習すると、ここに履歴と正答率が表示されます
                </p>
                <Link
                  href="/training/vocab?skill=listening"
                  className="mt-4 inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                >
                  Listening Vocab を始める
                </Link>
              </div>
            ) : (
              <>
                {listeningVocabHistory.stats_by_category.length > 0 && (
                  <div className="mb-4 rounded-lg border border-border bg-surface-2 p-4">
                    <h3 className="mb-2 text-sm font-semibold">By category（正答率）</h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {listeningVocabHistory.stats_by_category.map((s) => (
                        <div key={s.category} className="text-sm">
                          <span className="font-medium">{s.category_label}:</span>{' '}
                          {s.correct}/{s.total} ({s.accuracy_percent}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {listeningVocabHistory.history.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold">Recent attempts</h3>
                    <div className="space-y-2">
                      {listeningVocabHistory.history.map((item) => (
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
                              · {LISTENING_VOCAB_CATEGORY_LABELS[item.category] ?? item.category}{' '}
                              · {item.is_correct ? (
                                <span className="text-green-600">Correct</span>
                              ) : (
                                <span className="text-amber-600">Incorrect</span>
                              )}
                            </p>
                            {item.user_answer != null && item.user_answer !== '' && (
                              <p className="text-xs text-text-muted">Answer: {item.user_answer}</p>
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
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/training/vocab?skill=listening"
                    className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                  >
                    {listeningVocabHistory?.due_count != null && listeningVocabHistory.due_count > 0
                      ? 'Review Listening Vocab'
                      : 'Practice Listening Vocab'}
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Listening Idiom v1 – 履歴・Due・カテゴリ別正答率 */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">Listening Idiom</h2>
            <p className="mb-4 text-sm text-text-muted">
              句動詞・会話表現・口語パラフレーズ（Phrasal verbs, Conversational chunks など）の練習記録。
              {listeningIdiomHistory?.due_count != null && listeningIdiomHistory.due_count > 0 && (
                <span className="ml-1 font-medium text-primary">
                  · Due today: {listeningIdiomHistory.due_count}
                </span>
              )}
            </p>
            {listeningIdiomLoading ? (
              <p className="text-sm text-text-muted">読み込み中...</p>
            ) : listeningIdiomError ? (
              <p className="text-sm text-amber-600">{listeningIdiomError}</p>
            ) : !listeningIdiomHistory ||
              (listeningIdiomHistory.history.length === 0 &&
                listeningIdiomHistory.stats_by_category.length === 0 &&
                (listeningIdiomHistory.due_count ?? 0) === 0) ? (
              <div className="rounded-lg border border-border bg-surface-2 p-6 text-center">
                <p className="text-sm text-text-muted">まだ Listening Idiom の記録がありません</p>
                <p className="mt-1 text-xs text-text-muted">
                  熟語練習で Listening を練習すると、ここに履歴と正答率が表示されます
                </p>
                <Link
                  href="/training/idiom?skill=listening"
                  className="mt-4 inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                >
                  Listening Idiom を始める
                </Link>
              </div>
            ) : (
              <>
                {listeningIdiomHistory.stats_by_category.length > 0 && (
                  <div className="mb-4 rounded-lg border border-border bg-surface-2 p-4">
                    <h3 className="mb-2 text-sm font-semibold">By category（正答率）</h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {listeningIdiomHistory.stats_by_category.map((s) => (
                        <div key={s.category} className="text-sm">
                          <span className="font-medium">{s.category_label}:</span>{' '}
                          {s.correct}/{s.total} ({s.accuracy_percent}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {listeningIdiomHistory.history.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold">Recent attempts</h3>
                    <div className="space-y-2">
                      {listeningIdiomHistory.history.map((item) => (
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
                              · {LISTENING_IDIOM_CATEGORY_LABELS[item.category as keyof typeof LISTENING_IDIOM_CATEGORY_LABELS] ?? item.category}{' '}
                              · {item.is_correct ? (
                                <span className="text-green-600">Correct</span>
                              ) : (
                                <span className="text-amber-600">Incorrect</span>
                              )}
                            </p>
                            {item.user_answer != null && item.user_answer !== '' && (
                              <p className="text-xs text-text-muted">Answer: {item.user_answer}</p>
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
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/training/idiom?skill=listening"
                    className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                  >
                    {listeningIdiomHistory?.due_count != null && listeningIdiomHistory.due_count > 0
                      ? 'Review Listening Idiom'
                      : 'Practice Listening Idiom'}
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Listening Lexicon v1 – 履歴・Due・カテゴリ別正答率 */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">Listening Lexicon</h2>
            <p className="mb-4 text-sm text-text-muted">
              講義・セミナーの signposting、説明・例のマーカー、比較・対比、強調・スタンス、プロセス・順序、ディスカッション表現の練習記録。
              {listeningLexiconHistory?.due_count != null && listeningLexiconHistory.due_count > 0 && (
                <span className="ml-1 font-medium text-primary">
                  · Due today: {listeningLexiconHistory.due_count}
                </span>
              )}
            </p>
            {listeningLexiconLoading ? (
              <p className="text-sm text-text-muted">読み込み中...</p>
            ) : listeningLexiconError ? (
              <p className="text-sm text-amber-600">{listeningLexiconError}</p>
            ) : !listeningLexiconHistory ||
              (listeningLexiconHistory.history.length === 0 &&
                listeningLexiconHistory.stats_by_category.length === 0 &&
                (listeningLexiconHistory.due_count ?? 0) === 0) ? (
              <div className="rounded-lg border border-border bg-surface-2 p-6 text-center">
                <p className="text-sm text-text-muted">まだ Listening Lexicon の記録がありません</p>
                <p className="mt-1 text-xs text-text-muted">
                  表現バンクで Listening を練習すると、ここに履歴と正答率が表示されます
                </p>
                <Link
                  href="/training/lexicon?skill=listening"
                  className="mt-4 inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                >
                  Listening Lexicon を始める
                </Link>
              </div>
            ) : (
              <>
                {listeningLexiconHistory.stats_by_category.length > 0 && (
                  <div className="mb-4 rounded-lg border border-border bg-surface-2 p-4">
                    <h3 className="mb-2 text-sm font-semibold">By category（正答率）</h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {listeningLexiconHistory.stats_by_category.map((s) => (
                        <div key={s.category} className="text-sm">
                          <span className="font-medium">{s.category_label}:</span>{' '}
                          {s.correct}/{s.total} ({s.accuracy_percent}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {listeningLexiconHistory.history.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold">Recent attempts</h3>
                    <div className="space-y-2">
                      {listeningLexiconHistory.history.map((item) => (
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
                              · {LISTENING_LEXICON_CATEGORY_LABELS[item.category as keyof typeof LISTENING_LEXICON_CATEGORY_LABELS] ?? item.category}{' '}
                              · {item.is_correct ? (
                                <span className="text-green-600">Correct</span>
                              ) : (
                                <span className="text-amber-600">Incorrect</span>
                              )}
                            </p>
                            {item.user_answer != null && item.user_answer !== '' && (
                              <p className="text-xs text-text-muted">Answer: {item.user_answer}</p>
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
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/training/lexicon?skill=listening"
                    className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                  >
                    {listeningLexiconHistory?.due_count != null && listeningLexiconHistory.due_count > 0
                      ? 'Review Listening Lexicon'
                      : 'Practice Listening Lexicon'}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

