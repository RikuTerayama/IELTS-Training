'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary, buttonSecondary, textareaBase } from '@/lib/ui/theme';
import type { ApiResponse } from '@/lib/api/response';

type Phase =
  | 'idle'
  | 'creating_session'
  | 'generating_prompt'
  | 'answering'
  | 'saving_attempt'
  | 'evaluating'
  | 'done'
  | 'error';

const TOPICS = [
  { value: 'work_study', label: 'Work & Study' },
  { value: 'hometown', label: 'Hometown' },
  { value: 'free_time', label: 'Free Time' },
  { value: 'travel', label: 'Travel' },
  { value: 'technology', label: 'Technology' },
] as const;

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

/** prompt 行から表示用・evaluation 用の質問テキストを組み立てる */
function buildPromptText(promptRow: Record<string, unknown>): string {
  const followup = promptRow?.followup_question as string | undefined;
  const question = promptRow?.question as string | undefined;
  const jpIntent = promptRow?.jp_intent as string | undefined;
  if (followup && String(followup).trim()) return String(followup).trim();
  if (question && String(question).trim()) return String(question).trim();
  if (jpIntent && String(jpIntent).trim()) return `(Intent) ${String(jpIntent).trim()}`;
  return '(No question text)';
}

const MIN_ANSWER_LENGTH = 30;

export default function ExamSpeakingPage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [topic, setTopic] = useState<string>(TOPICS[0].value);
  const [level, setLevel] = useState<string>(LEVELS[0].value);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [promptRow, setPromptRow] = useState<Record<string, unknown> | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedbackRow, setFeedbackRow] = useState<Record<string, unknown> | null>(null);

  const isLoading =
    phase === 'creating_session' ||
    phase === 'generating_prompt' ||
    phase === 'saving_attempt' ||
    phase === 'evaluating';

  const handleStartInterview = async () => {
    setErrorMessage(null);
    setPhase('creating_session');

    try {
      const sessionRes = await fetch('/api/speaking/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'mock',
          part: 'part1',
          topic,
          level: level || undefined,
        }),
      });
      const sessionData = (await sessionRes.json()) as ApiResponse<{ id: string }>;
      if (sessionRes.status === 401) {
        setErrorMessage('ログインが必要です');
        setPhase('error');
        return;
      }
      if (!sessionData.ok || !sessionData.data?.id) {
        setErrorMessage(sessionData.error?.message ?? 'Failed to create session');
        setPhase('error');
        return;
      }
      setSessionId(sessionData.data.id);

      setPhase('generating_prompt');
      const promptRes = await fetch('/api/speaking/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionData.data.id,
          mode: 'mock',
          topic,
          part: 'part1',
          level: level || undefined,
          use_preset: true,
        }),
      });
      const promptData = (await promptRes.json()) as ApiResponse<Record<string, unknown>>;
      if (promptRes.status === 401) {
        setErrorMessage('ログインが必要です');
        setPhase('error');
        return;
      }
      if (!promptData.ok || !promptData.data) {
        setErrorMessage(promptData.error?.message ?? 'Failed to generate prompt');
        setPhase('error');
        return;
      }
      setPromptRow(promptData.data);
      setAnswer('');
      setPhase('answering');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Network error');
      setPhase('error');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!sessionId || !promptRow || !promptRow.id) return;
    const trimmed = answer.trim();
    if (trimmed.length < MIN_ANSWER_LENGTH) {
      setErrorMessage(`Please enter at least ${MIN_ANSWER_LENGTH} characters.`);
      return;
    }
    setErrorMessage(null);
    setPhase('saving_attempt');

    try {
      const attemptRes = await fetch('/api/speaking/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          prompt_id: promptRow.id,
          user_response: trimmed,
        }),
      });
      const attemptData = (await attemptRes.json()) as ApiResponse<{ id: string }>;
      if (attemptRes.status === 401) {
        setErrorMessage('ログインが必要です');
        setPhase('error');
        return;
      }
      if (!attemptData.ok || !attemptData.data?.id) {
        setErrorMessage(attemptData.error?.message ?? 'Failed to save attempt');
        setPhase('error');
        return;
      }
      setAttemptId(attemptData.data.id);

      setPhase('evaluating');
      const promptText = buildPromptText(promptRow);
      const evalRes = await fetch('/api/speaking/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempt_id: attemptData.data.id,
          user_response: trimmed,
          prompt: promptText,
          metrics: { word_count: trimmed.split(/\s+/).length },
        }),
      });
      const evalData = (await evalRes.json()) as ApiResponse<Record<string, unknown>>;
      if (evalRes.status === 401) {
        setErrorMessage('ログインが必要です');
        setPhase('error');
        return;
      }
      if (!evalData.ok || !evalData.data) {
        setErrorMessage(evalData.error?.message ?? 'Failed to get evaluation');
        setPhase('error');
        return;
      }
      setFeedbackRow(evalData.data);
      setPhase('done');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Network error');
      setPhase('error');
    }
  };

  const handleTryAnother = () => {
    setPhase('idle');
    setErrorMessage(null);
    setSessionId(null);
    setPromptRow(null);
    setAttemptId(null);
    setFeedbackRow(null);
    setAnswer('');
  };

  const questionText = promptRow ? buildPromptText(promptRow) : '';

  return (
    <Layout>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8">
          <h1 className={cn('text-2xl font-bold tracking-tight text-text', cardTitle)}>
            Speaking AI Interviewer (Beta)
          </h1>
          <p className={cn('mt-1 text-text-muted', cardDesc)}>Part 1 (Text-only)</p>
        </header>

        {phase === 'error' && errorMessage && (
          <div className={cn('mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900')}>
            <p className="font-medium">{errorMessage}</p>
            {errorMessage === 'ログインが必要です' && (
              <Link href="/login" className="mt-2 inline-block text-indigo-600 font-semibold hover:underline">
                Go to Login
              </Link>
            )}
            <button
              type="button"
              onClick={handleTryAnother}
              className={cn('mt-3', buttonSecondary)}
            >
              Try again
            </button>
          </div>
        )}

        {phase === 'idle' && (
          <div className={cn('p-6', cardBase)}>
            <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={cn('w-full', 'rounded-lg border border-border bg-surface text-text px-4 py-2')}
                >
                  {TOPICS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">Level (optional)</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={cn('w-full', 'rounded-lg border border-border bg-surface text-text px-4 py-2')}
                >
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleStartInterview}
                disabled={isLoading}
                className={cn('w-full sm:w-auto', buttonPrimary)}
              >
                {isLoading ? 'Loading...' : 'Start Interview'}
              </button>
            </div>
          </div>
        )}

        {(phase === 'creating_session' || phase === 'generating_prompt') && (
          <div className={cn('p-6', cardBase)}>
            <p className="text-text-muted">Preparing your question...</p>
          </div>
        )}

        {(phase === 'answering' || phase === 'saving_attempt' || phase === 'evaluating') && (
          <div className="space-y-6">
            <div className={cn('p-6', cardBase)}>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Question</h3>
              <p className="text-lg text-text leading-relaxed">{questionText}</p>
            </div>
            <div className={cn('p-6', cardBase)}>
              <label className="block text-sm font-semibold text-text mb-2">Your answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={phase !== 'answering'}
                placeholder="Type your answer here (at least 30 characters)..."
                className={cn(textareaBase, 'min-h-[120px]')}
                rows={5}
              />
              <p className="mt-2 text-xs text-text-muted">
                {answer.trim().length} characters (min {MIN_ANSWER_LENGTH})
              </p>
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={isLoading || answer.trim().length < MIN_ANSWER_LENGTH}
                className={cn('mt-4', buttonPrimary)}
              >
                {phase === 'saving_attempt' || phase === 'evaluating'
                  ? 'Submitting...'
                  : 'Submit Answer'}
              </button>
            </div>
            {errorMessage && (
              <p className="text-sm text-amber-600">{errorMessage}</p>
            )}
          </div>
        )}

        {phase === 'done' && feedbackRow && (
          <div className="space-y-6">
            <div className={cn('p-6', cardBase)}>
              <h2 className={cn('mb-4 text-lg font-bold', cardTitle)}>Evaluation</h2>
              {feedbackRow.overall_band != null && (
                <div className="mb-4">
                  <span className="text-sm font-semibold text-text-muted">Overall Band: </span>
                  <span className="text-xl font-bold text-text">{String(feedbackRow.overall_band)}</span>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {['fluency_band', 'lexical_band', 'grammar_band', 'pronunciation_band'].map((key) => {
                  const val = feedbackRow[key];
                  const label = key.replace('_band', '').replace(/^./, (c) => c.toUpperCase());
                  if (val == null) return null;
                  return (
                    <div key={key} className="rounded-lg border border-border bg-surface-2 p-3">
                      <div className="text-xs font-semibold text-text-muted uppercase">{label}</div>
                      <div className="font-semibold text-text">{String(val)}</div>
                      {typeof feedbackRow.evidence === 'object' &&
                        feedbackRow.evidence !== null &&
                        (feedbackRow.evidence as Record<string, unknown>)[key.replace('_band', '')] != null && (
                        <p className="mt-1 text-sm text-text-muted">
                          {String((feedbackRow.evidence as Record<string, unknown>)[key.replace('_band', '')])}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {Array.isArray(feedbackRow.top_fixes) && feedbackRow.top_fixes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-text mb-2">Top fixes</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-text-muted">
                    {(feedbackRow.top_fixes as Array<{ issue?: string; suggestion?: string }>)
                      .slice(0, 3)
                      .map((fix, i) => (
                        <li key={i}>
                          {fix.issue ?? fix.suggestion ?? JSON.stringify(fix)}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleTryAnother} className={cn(buttonPrimary)}>
                Try another question
              </button>
              <Link href="/home" className={cn(buttonSecondary, 'inline-flex items-center')}>
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {phase === 'idle' && (
          <p className="mt-6">
            <Link href="/home" className="text-indigo-600 hover:underline">
              ← Back to Home
            </Link>
          </p>
        )}
      </div>
    </Layout>
  );
}
