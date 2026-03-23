'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { bodyText, buttonPrimary, buttonSecondary, cardBase, cardTitle, cn, helperText, pageTitle, sectionTitle } from '@/lib/ui/theme';
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
    model_answer?: string | null;
    paraphrases?: string[] | null;
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

const CRITERION_LABELS: Record<string, string> = {
  fluency: '流暢さとつながり',
  lexical: '語彙',
  grammar: '文法',
  pronunciation: '発音',
};

export default function SpeakingFeedbackPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<DetailData | null>(null);

  useEffect(() => {
    if (!attemptId) {
      setErrorMessage('無効な attempt ID です。');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    fetch(`/api/speaking/attempts/${attemptId}/detail`)
      .then((res) => {
        if (res.status === 401) {
          setErrorMessage('ログインが必要です。');
          setStatus('error');
          return null;
        }
        if (res.status === 404) {
          setErrorMessage('結果が見つかりませんでした。');
          setStatus('error');
          return null;
        }
        return res.json();
      })
      .then((body: ApiResponse<DetailData> | null) => {
        if (!body) return;
        if (body.ok && body.data) {
          setData(body.data);
          setStatus('ready');
          return;
        }
        setErrorMessage(body.error?.message ?? 'フィードバックの取得に失敗しました。');
        setStatus('error');
      })
      .catch(() => {
        setErrorMessage('通信に失敗しました。');
        setStatus('error');
      });
  }, [attemptId]);

  const topic = data?.prompt?.topic ?? data?.session?.topic ?? '-';
  const part = data?.prompt?.part ?? data?.session?.part ?? '-';
  const showCueCard =
    data?.prompt?.part === 'part2' &&
    data?.prompt?.cue_card &&
    (data.prompt.cue_card.topic ||
      (Array.isArray(data.prompt.cue_card.points) && data.prompt.cue_card.points.length > 0));
  const cueCard = data?.prompt?.cue_card;

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className={pageTitle}>Speaking フィードバック</h1>

        {status === 'loading' ? <p className={cn(helperText, 'mt-4')}>読み込み中...</p> : null}

        {status === 'error' ? (
          <div className="mt-6 space-y-4">
            <p className="font-medium text-amber-600">{errorMessage}</p>
            <div className="flex flex-wrap gap-3">
              {errorMessage === 'ログインが必要です。' ? (
                <Link href="/login" className={cn(buttonPrimary, 'inline-flex items-center')}>
                  ログインへ進む
                </Link>
              ) : null}
              <Link href="/progress" className={cn(buttonSecondary, 'inline-flex items-center')}>
                進捗へ戻る
              </Link>
            </div>
          </div>
        ) : null}

        {status === 'ready' && data ? (
          <div className="mt-6 space-y-6">
            <p className={helperText}>
              {new Date(data.attempt.created_at).toLocaleString('ja-JP', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
              {' ・ '}
              トピック: {topic}
              {' ・ '}
              Part: {part}
              {' ・ '}
              {data.attempt.word_count ?? 0} 語
              {data.feedback?.overall_band != null ? <> ・ Band {data.feedback.overall_band}</> : null}
            </p>

            <section className={cn('p-6', cardBase)}>
              <h2 className={cn(sectionTitle, 'mb-3 text-subsection-title')}>質問</h2>
              {showCueCard && cueCard ? (
                <>
                  {cueCard.topic ? <p className="mb-3 text-lg font-semibold text-text">{cueCard.topic}</p> : null}
                  {Array.isArray(cueCard.points) && cueCard.points.length > 0 ? (
                    <ul className="list-inside list-disc space-y-1 text-text">
                      {cueCard.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <p className={cn(bodyText, 'whitespace-pre-wrap')}>{data.derived.question_text || '-'}</p>
              )}
            </section>

            <section className={cn('p-6', cardBase)}>
              <h2 className={cn(sectionTitle, 'mb-3 text-subsection-title')}>あなたの回答</h2>
              <p className={cn(bodyText, 'whitespace-pre-wrap')}>{data.attempt.user_response || '-'}</p>
            </section>

            {data.feedback ? (
              <section className={cn('p-6', cardBase)}>
                <h2 className={cn(sectionTitle, 'mb-4 text-subsection-title')}>評価</h2>
                {data.feedback.overall_band != null ? (
                  <div className="mb-4">
                    <span className="text-sm font-semibold text-text-muted">総合 Band: </span>
                    <span className="text-xl font-bold text-text">{data.feedback.overall_band}</span>
                  </div>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  {(['fluency_band', 'lexical_band', 'grammar_band', 'pronunciation_band'] as const).map((key) => {
                    const value = data.feedback?.[key];
                    if (value == null) return null;
                    const evidenceKey = key.replace('_band', '');
                    return (
                      <div key={key} className="rounded-lg border border-border bg-surface-2 p-3">
                        <div className="text-xs font-semibold uppercase text-text-muted">
                          {CRITERION_LABELS[evidenceKey] ?? evidenceKey}
                        </div>
                        <div className="font-semibold text-text">{value}</div>
                        {typeof data.feedback?.evidence === 'object' &&
                        data.feedback.evidence !== null &&
                        (data.feedback.evidence as Record<string, unknown>)[evidenceKey] != null ? (
                          <p className="mt-1 text-sm text-text-muted">
                            {String((data.feedback.evidence as Record<string, unknown>)[evidenceKey])}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {Array.isArray(data.feedback.top_fixes) && data.feedback.top_fixes.length > 0 ? (
                  <div className="mt-4">
                    <h3 className={cardTitle}>優先して直したいポイント</h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-muted">
                      {(data.feedback.top_fixes as Array<{ issue?: string; suggestion?: string }>)
                        .slice(0, 3)
                        .map((fix, index) => (
                          <li key={index}>{fix.issue ?? fix.suggestion ?? '-'}</li>
                        ))}
                    </ul>
                  </div>
                ) : null}

                {Array.isArray(data.feedback.weakness_tags) && data.feedback.weakness_tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(data.feedback.weakness_tags as string[]).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs font-medium text-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : (
              <section className={cn('p-6', cardBase)}>
                <p className={helperText}>評価はまだありません。</p>
              </section>
            )}

            {typeof data.prompt?.model_answer === 'string' && data.prompt.model_answer.trim() ? (
              <section className={cn('p-6', cardBase)}>
                <h2 className={cn(sectionTitle, 'mb-3 text-subsection-title')}>模範解答</h2>
                <p className={cn(helperText, 'mb-2')}>
                  論点の流れやつなぎ表現の参考として見返してください。
                </p>
                <p className={cn(bodyText, 'whitespace-pre-wrap')}>{data.prompt.model_answer.trim()}</p>
              </section>
            ) : null}

            {typeof data.feedback?.rewrite === 'string' && data.feedback.rewrite.trim() ? (
              <section className={cn('p-6', cardBase)}>
                <h2 className={cn(sectionTitle, 'mb-3 text-subsection-title')}>あなたの回答の改善版</h2>
                <p className={cn(helperText, 'mb-2')}>
                  元の内容を活かしつつ、より自然に伝わる形へ整えた例です。
                </p>
                <p className={cn(bodyText, 'whitespace-pre-wrap')}>{data.feedback.rewrite.trim()}</p>
              </section>
            ) : null}

            {Array.isArray(data.feedback?.micro_drills) && data.feedback.micro_drills.length > 0 ? (
              <section className={cn('p-6', cardBase)}>
                <h2 className={cn(sectionTitle, 'mb-3 text-subsection-title')}>次回そのまま使えるフレーズ</h2>
                <div className="space-y-3">
                  {(data.feedback.micro_drills as Array<{ jp_intent?: string; model_answer?: string }>)
                    .slice(0, 2)
                    .map((drill, index) => (
                      <div key={index} className="rounded-lg border border-border bg-surface-2 p-3">
                        {drill.jp_intent ? <p className={cn(helperText, 'mb-1')}>{drill.jp_intent}</p> : null}
                        {drill.model_answer ? (
                          <p className={cn(bodyText, 'whitespace-pre-wrap')}>{drill.model_answer}</p>
                        ) : null}
                      </div>
                    ))}
                </div>
              </section>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Link href="/progress" className={cn(buttonSecondary, 'inline-flex items-center')}>
                進捗へ戻る
              </Link>
              <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex items-center')}>
                もう一度面接する
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
