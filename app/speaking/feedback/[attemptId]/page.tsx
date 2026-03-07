'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';
import type { ApiResponse } from '@/lib/api/response';

type DetailData = {
  attempt: {
    id: string;
    created_at: string;
    user_response: string;
    word_count: number | null;
    prompt_id: string | null;
    session_id: string | null;
  };
  prompt: {
    id: string;
    part: string | null;
    topic: string | null;
    cue_card: { topic?: string; points?: string[] } | null;
    [key: string]: unknown;
  } | null;
  session: { topic: string | null; part: string | null; [key: string]: unknown } | null;
  feedback: {
    overall_band: number | null;
    fluency_band: number | null;
    lexical_band: number | null;
    grammar_band: number | null;
    pronunciation_band: number | null;
    evidence: unknown;
    top_fixes: unknown;
    rewrite: string | null;
    micro_drills: unknown;
    weakness_tags: unknown;
  } | null;
  derived: {
    question_text: string;
    cue_card_text: string | null;
  };
};

type Status = 'loading' | 'error' | 'ready';

export default function SpeakingFeedbackPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<DetailData | null>(null);

  useEffect(() => {
    if (!attemptId) {
      setErrorMessage('Invalid attempt ID');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMessage(null);
    fetch(`/api/speaking/attempts/${attemptId}/detail`)
      .then((res) => {
        if (res.status === 401) {
          setErrorMessage('ログインが必要です');
          setStatus('error');
          return null;
        }
        if (res.status === 404) {
          setErrorMessage('Not found');
          setStatus('error');
          return null;
        }
        return res.json();
      })
      .then((body: ApiResponse<DetailData> | null) => {
        if (body == null) return;
        if (body.ok && body.data) {
          setData(body.data);
          setStatus('ready');
        } else {
          setErrorMessage(body.error?.message ?? 'Failed to load');
          setStatus('error');
        }
      })
      .catch(() => {
        setErrorMessage('Network error');
        setStatus('error');
      });
  }, [attemptId]);

  const topic = data?.prompt?.topic ?? data?.session?.topic ?? '-';
  const part = data?.prompt?.part ?? data?.session?.part ?? '-';
  const showCueCard =
    data?.prompt?.part === 'part2' &&
    data?.prompt?.cue_card &&
    (data.prompt.cue_card.topic || (Array.isArray(data.prompt.cue_card.points) && data.prompt.cue_card.points.length > 0));
  const cueCard = data?.prompt?.cue_card;

  return (
    <Layout>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className={cn('text-2xl font-bold tracking-tight text-text', cardTitle)}>
          Speaking Feedback
        </h1>

        {status === 'loading' && (
          <p className="mt-4 text-text-muted">読み込み中...</p>
        )}

        {status === 'error' && (
          <div className="mt-6 space-y-4">
            <p className="text-amber-600 font-medium">{errorMessage}</p>
            {errorMessage === 'ログインが必要です' && (
              <Link href="/login" className="inline-block text-indigo-600 font-semibold hover:underline">
                Go to Login
              </Link>
            )}
            <div className="flex gap-3">
              <Link href="/progress" className={cn(buttonSecondary, 'inline-flex')}>
                Back to Progress
              </Link>
            </div>
          </div>
        )}

        {status === 'ready' && data && (
          <div className="mt-6 space-y-6">
            <p className="text-sm text-text-muted">
              {new Date(data.attempt.created_at).toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' })}
              {' · '}
              Topic: {topic} · Part: {part}
              {' · '}
              {data.attempt.word_count ?? 0} words
              {data.feedback?.overall_band != null && (
                <> · Band {data.feedback.overall_band}</>
              )}
            </p>

            {/* Section 1: Question */}
            <div className={cn('p-6', cardBase)}>
              <h2 className={cn('mb-3 text-lg font-semibold', cardTitle)}>Question</h2>
              {showCueCard && cueCard ? (
                <>
                  {cueCard.topic && (
                    <p className="text-lg font-semibold text-text mb-2">{cueCard.topic}</p>
                  )}
                  {Array.isArray(cueCard.points) && cueCard.points.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-text">
                      {cueCard.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="text-text leading-relaxed whitespace-pre-wrap">{data.derived.question_text || '—'}</p>
              )}
            </div>

            {/* Section 2: Your Answer */}
            <div className={cn('p-6', cardBase)}>
              <h2 className={cn('mb-3 text-lg font-semibold', cardTitle)}>Your Answer</h2>
              <p className="text-text leading-relaxed whitespace-pre-wrap">{data.attempt.user_response || '—'}</p>
            </div>

            {/* Section 3: Evaluation */}
            {data.feedback && (() => {
              const feedback = data.feedback;
              return (
              <div className={cn('p-6', cardBase)}>
                <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>Evaluation</h2>
                {feedback.overall_band != null && (
                  <div className="mb-4">
                    <span className="text-sm font-semibold text-text-muted">Overall Band: </span>
                    <span className="text-xl font-bold text-text">{feedback.overall_band}</span>
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2 mb-4">
                  {(['fluency_band', 'lexical_band', 'grammar_band', 'pronunciation_band'] as const).map((key) => {
                    const val = feedback[key];
                    if (val == null) return null;
                    const label = key.replace('_band', '').replace(/^./, (c) => c.toUpperCase());
                    return (
                      <div key={key} className="rounded-lg border border-border bg-surface-2 p-3">
                        <div className="text-xs font-semibold text-text-muted uppercase">{label}</div>
                        <div className="font-semibold text-text">{val}</div>
                        {typeof feedback.evidence === 'object' &&
                          feedback.evidence !== null &&
                          (feedback.evidence as Record<string, unknown>)[key.replace('_band', '')] != null && (
                          <p className="mt-1 text-sm text-text-muted">
                            {String((feedback.evidence as Record<string, unknown>)[key.replace('_band', '')])}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {Array.isArray(feedback.top_fixes) && feedback.top_fixes.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-text mb-2">Top fixes</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-text-muted">
                      {(feedback.top_fixes as Array<{ issue?: string; suggestion?: string }>)
                        .slice(0, 3)
                        .map((fix, i) => (
                          <li key={i}>{fix.issue ?? fix.suggestion ?? '-'}</li>
                        ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(feedback.weakness_tags) && feedback.weakness_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(feedback.weakness_tags as string[]).map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs font-medium text-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              );
            })()}

            {!data.feedback && (
              <div className={cn('p-6', cardBase)}>
                <p className="text-text-muted">評価はまだありません</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Link href="/progress" className={cn(buttonSecondary, 'inline-flex items-center')}>
                Back to Progress
              </Link>
              <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex items-center')}>
                Try another interview
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
