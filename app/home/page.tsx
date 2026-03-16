'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import type { ApiResponse } from '@/lib/api/response';
import type { AttemptHistory, ProgressSummary } from '@/lib/domain/types';
import {
  badgeBase,
  buttonPrimary,
  buttonSecondary,
  cardBase,
  cardDesc,
  cardTitle,
  cn,
} from '@/lib/ui/theme';

type UsageTodayData = {
  is_pro: boolean;
  writing_limit: number;
  speaking_limit: number;
  writing_used: number;
  speaking_used: number;
  writing_remaining: number;
  speaking_remaining: number;
  reset_at: string;
};

type SpeakingHistoryItem = {
  id: string;
  created_at: string;
  topic: string | null;
  part: string | null;
  question_preview: string;
  word_count: number | null;
  overall_band: number | string | null;
};

type ReadingVocabHistoryItem = {
  id: string;
  question_type: string | null;
  category: string;
  is_correct: boolean;
  user_answer: string | null;
  created_at: string;
  prompt: string;
};

type ReadingVocabHistoryResponse = {
  history: ReadingVocabHistoryItem[];
  stats_by_type: Array<{
    question_type: string;
    total: number;
    correct: number;
    accuracy_percent: number;
  }>;
  stats_by_skill: Array<{
    skill: string;
    skill_key: string;
    total: number;
    correct: number;
    accuracy_percent: number;
  }>;
  due_count: number;
};

type DashboardActivity = {
  id: string;
  kind: 'writing' | 'speaking' | 'reading';
  title: string;
  detail: string;
  occurredAt: string;
  href: string;
  ctaLabel: string;
};

type DashboardAction = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  label: string;
  secondaryHref: string;
  secondaryLabel: string;
};

const WEAKNESS_LABELS: Record<string, string> = {
  TR: 'Task response',
  CC: 'Coherence',
  LR: 'Lexical resource',
  GRA: 'Grammar',
};

async function fetchApi<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    const data = (await res.json()) as ApiResponse<T>;
    if (!data.ok) return null;
    return data.data ?? null;
  } catch {
    return null;
  }
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatResetAt(value: string | null | undefined): string {
  if (!value) return 'midnight JST';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'midnight JST';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

function getWeaknessText(tags: string[] | undefined): string | null {
  if (!tags?.length) return null;
  return tags.map((tag) => WEAKNESS_LABELS[tag] ?? tag).join(', ');
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function buildReadingDetail(item: ReadingVocabHistoryItem): string {
  const status = item.is_correct ? 'Answered correctly' : 'Needs another review';
  const type = item.question_type ?? 'Reading vocab';
  return `${type} · ${status}`;
}

export default function HomePage() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [writingHistory, setWritingHistory] = useState<AttemptHistory[]>([]);
  const [speakingHistory, setSpeakingHistory] = useState<SpeakingHistoryItem[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingVocabHistoryResponse | null>(null);
  const [usageToday, setUsageToday] = useState<UsageTodayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setLoading(true);

      const [
        summaryData,
        writingHistoryData,
        speakingHistoryData,
        readingHistoryData,
        usageTodayData,
      ] = await Promise.all([
        fetchApi<ProgressSummary>('/api/progress/summary'),
        fetchApi<AttemptHistory[]>('/api/progress/history'),
        fetchApi<SpeakingHistoryItem[]>('/api/progress/speaking-history'),
        fetchApi<ReadingVocabHistoryResponse>('/api/progress/reading-vocab-history'),
        fetchApi<UsageTodayData>('/api/usage/today'),
      ]);

      if (ignore) return;

      setSummary(summaryData);
      setWritingHistory(writingHistoryData ?? []);
      setSpeakingHistory(speakingHistoryData ?? []);
      setReadingHistory(readingHistoryData);
      setUsageToday(usageTodayData);
      setLoading(false);
    }

    void loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const weaknessText = getWeaknessText(summary?.weakness_tags);
  const hasAnyActivity =
    writingHistory.length > 0 ||
    speakingHistory.length > 0 ||
    Boolean(readingHistory?.history.length);

  const recentActivities = useMemo<DashboardActivity[]>(() => {
    const writingActivities: DashboardActivity[] = writingHistory.map((item) => ({
      id: item.id,
      kind: 'writing',
      title: `Writing feedback · ${item.band_estimate}`,
      detail:
        item.weakness_tags.length > 0
          ? `Focus: ${getWeaknessText(item.weakness_tags) ?? 'Review your latest draft'}`
          : `Level: ${item.level}`,
      occurredAt: item.completed_at,
      href: `/feedback/${item.id}`,
      ctaLabel: 'Review feedback',
    }));

    const speakingActivities: DashboardActivity[] = speakingHistory.map((item) => ({
      id: item.id,
      kind: 'speaking',
      title: `Speaking ${item.part?.toUpperCase() ?? 'session'}`,
      detail:
        item.overall_band != null
          ? `Band ${item.overall_band}${item.topic ? ` · ${item.topic}` : ''}`
          : (item.topic ?? item.question_preview) || 'View your latest speaking session',
      occurredAt: item.created_at,
      href: `/speaking/feedback/${item.id}`,
      ctaLabel: 'View feedback',
    }));

    const readingActivities: DashboardActivity[] = (readingHistory?.history ?? []).map((item) => ({
      id: item.id,
      kind: 'reading',
      title: 'Reading vocab',
      detail: buildReadingDetail(item),
      occurredAt: item.created_at,
      href: '/vocab?skill=reading',
      ctaLabel: 'Continue Reading',
    }));

    return [...writingActivities, ...speakingActivities, ...readingActivities]
      .sort((a, b) => toTimestamp(b.occurredAt) - toTimestamp(a.occurredAt))
      .slice(0, 5);
  }, [readingHistory?.history, speakingHistory, writingHistory]);

  const resumeActivity = recentActivities[0] ?? null;
  const allAiUsageSpent =
    usageToday != null &&
    !usageToday.is_pro &&
    usageToday.writing_remaining === 0 &&
    usageToday.speaking_remaining === 0;
  const readingDueCount = readingHistory?.due_count ?? 0;

  const recommendedAction = useMemo<DashboardAction>(() => {
    if (allAiUsageSpent) {
      return {
        eyebrow: 'Today',
        title: 'Your free AI attempts are used for today',
        description:
          'Keep learning with Reading vocab or review your previous feedback while you wait for the daily reset.',
        href: '/vocab?skill=reading',
        label: 'Open Reading',
        secondaryHref: '/progress',
        secondaryLabel: 'Review progress',
      };
    }

    if (!hasAnyActivity) {
      return {
        eyebrow: 'Recommended next step',
        title: 'Start with Reading',
        description:
          'Reading vocab is the lightest way to get momentum after login. You can move into Writing or Speaking once you are warm.',
        href: '/vocab?skill=reading',
        label: 'Start Reading',
        secondaryHref: '/task/select?task_type=Task%202',
        secondaryLabel: 'Open Writing',
      };
    }

    if (readingDueCount > 0) {
      return {
        eyebrow: 'Recommended next step',
        title: `Review ${readingDueCount} Reading item${readingDueCount === 1 ? '' : 's'} due today`,
        description:
          'You already have Reading review due. Clearing it first is the fastest way to keep your streak moving.',
        href: '/vocab?skill=reading',
        label: 'Review Reading',
        secondaryHref: '/progress',
        secondaryLabel: 'View progress',
      };
    }

    if (weaknessText && (usageToday?.is_pro || (usageToday?.writing_remaining ?? 1) > 0)) {
      return {
        eyebrow: 'Recommended next step',
        title: `Work on ${weaknessText}`,
        description:
          'Your recent writing data already highlights where you can gain band score next. Use a fresh Task 2 prompt while that feedback is still recent.',
        href: '/task/select?task_type=Task%202',
        label: 'Start Writing',
        secondaryHref: '/progress',
        secondaryLabel: 'Review trends',
      };
    }

    if (speakingHistory.length > 0 && (usageToday?.is_pro || (usageToday?.speaking_remaining ?? 1) > 0)) {
      return {
        eyebrow: 'Recommended next step',
        title: 'Run another Speaking interview',
        description:
          'You already have speaking history. Another short interview is the fastest way to keep feedback fresh and compare progress.',
        href: '/exam/speaking',
        label: 'Start Speaking',
        secondaryHref: '/progress',
        secondaryLabel: 'Review history',
      };
    }

    return {
      eyebrow: 'Recommended next step',
      title: 'Keep momentum with a fresh session',
      description:
        'Open the next practice lane directly from here: Reading for low-friction review, Writing for deeper feedback, or Speaking for live interview practice.',
      href: '/task/select?task_type=Task%202&mode=exam',
      label: 'Start Writing exam',
      secondaryHref: '/exam/speaking',
      secondaryLabel: 'Start Speaking',
    };
  }, [
    allAiUsageSpent,
    hasAnyActivity,
    readingDueCount,
    speakingHistory.length,
    usageToday?.is_pro,
    usageToday?.speaking_remaining,
    usageToday?.writing_remaining,
    weaknessText,
  ]);

  const quickAccessCards = useMemo(
    () => [
      {
        title: 'Reading',
        description:
          readingDueCount > 0
            ? `${readingDueCount} review item${readingDueCount === 1 ? '' : 's'} are due now.`
            : 'Practice question-type vocab and comprehension patterns.',
        href: '/vocab?skill=reading',
        ctaLabel: readingDueCount > 0 ? 'Review Reading' : 'Open Reading',
      },
      {
        title: 'Writing',
        description:
          weaknessText != null
            ? `Focus next on ${weaknessText}.`
            : 'Start Task 2 practice or exam mode.',
        href: '/task/select?task_type=Task%202',
        ctaLabel: 'Open Writing',
      },
      {
        title: 'Speaking',
        description:
          usageToday && !usageToday.is_pro
            ? `${usageToday.speaking_remaining} attempt${usageToday.speaking_remaining === 1 ? '' : 's'} left today.`
            : 'Interview practice with band-style feedback.',
        href: '/exam/speaking',
        ctaLabel: 'Open Speaking',
      },
      {
        title: 'Vocab',
        description: 'Open the full vocab trainer across Reading, Listening, Speaking, and Writing.',
        href: '/vocab',
        ctaLabel: 'Open Vocab',
      },
      {
        title: 'Progress',
        description:
          recentActivities.length > 0
            ? `You have ${recentActivities.length} recent learning record${recentActivities.length === 1 ? '' : 's'}.`
            : 'Track attempts, feedback, and due reviews.',
        href: '/progress',
        ctaLabel: 'View Progress',
      },
    ],
    [readingDueCount, recentActivities.length, usageToday, weaknessText]
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-2xl border border-border bg-surface p-6 text-center text-text-muted shadow-sm">
            Loading your dashboard...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-text-muted">
              Learner home
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
                Continue learning
              </h1>
              <p className="max-w-3xl text-base leading-7 text-text-muted">
                Pick up where you left off, review what needs attention, and jump straight into
                Reading, Writing, Speaking, or vocab practice.
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <div className={cn(cardBase, 'p-6 md:p-8')}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                {recommendedAction.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text md:text-3xl">
                {recommendedAction.title}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted">
                {recommendedAction.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={recommendedAction.href} className={buttonPrimary}>
                  {recommendedAction.label}
                </Link>
                <Link href={recommendedAction.secondaryHref} className={buttonSecondary}>
                  {recommendedAction.secondaryLabel}
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {readingDueCount > 0 && (
                  <span className={badgeBase}>Reading due: {readingDueCount}</span>
                )}
                {weaknessText && <span className={badgeBase}>Focus: {weaknessText}</span>}
                {usageToday && (
                  <span className={badgeBase}>
                    {usageToday.is_pro
                      ? 'Pro plan active'
                      : `Writing ${usageToday.writing_remaining} left · Speaking ${usageToday.speaking_remaining} left`}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-6">
              <section className={cn(cardBase, 'p-6')}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className={cardTitle}>Resume last activity</h2>
                    <p className={cn(cardDesc, 'mt-2')}>
                      Open your most recent feedback or continue the last skill you touched.
                    </p>
                  </div>
                  {resumeActivity && (
                    <span className={badgeBase}>
                      {resumeActivity.kind.charAt(0).toUpperCase() + resumeActivity.kind.slice(1)}
                    </span>
                  )}
                </div>

                {resumeActivity ? (
                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-text">{resumeActivity.title}</p>
                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        {resumeActivity.detail}
                      </p>
                      <p className="mt-2 text-xs text-text-muted">
                        Last active {formatDateTime(resumeActivity.occurredAt)}
                      </p>
                    </div>
                    <Link href={resumeActivity.href} className={buttonSecondary}>
                      {resumeActivity.ctaLabel}
                    </Link>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    <p className="text-sm leading-6 text-text-muted">
                      No completed activity yet. Start with Reading for a low-friction session, or
                      open Writing to get your first AI feedback.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/vocab?skill=reading" className={buttonPrimary}>
                        Start Reading
                      </Link>
                      <Link href="/task/select?task_type=Task%202" className={buttonSecondary}>
                        Open Writing
                      </Link>
                    </div>
                  </div>
                )}
              </section>

              <section className={cn(cardBase, 'p-6')}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className={cardTitle}>Plan and limits</h2>
                    <p className={cn(cardDesc, 'mt-2')}>
                      Keep track of daily AI usage and billing status from the app home.
                    </p>
                  </div>
                  <span className={badgeBase}>{usageToday?.is_pro ? 'Pro' : 'Free'}</span>
                </div>

                {usageToday?.is_pro ? (
                  <div className="mt-5 space-y-4">
                    <p className="text-sm leading-6 text-text-muted">
                      Pro is active. Writing and Speaking AI remain available without daily free-plan
                      limits.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/billing/manage" className={buttonSecondary}>
                        Manage billing
                      </Link>
                      <Link href="/pricing" className={buttonSecondary}>
                        View pricing
                      </Link>
                    </div>
                  </div>
                ) : usageToday ? (
                  <div className="mt-5 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-surface-2 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                          Writing AI
                        </p>
                        <p className="mt-2 text-2xl font-bold text-text">
                          {usageToday.writing_remaining}
                          <span className="ml-1 text-sm font-medium text-text-muted">
                            / {usageToday.writing_limit} left
                          </span>
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface-2 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                          Speaking AI
                        </p>
                        <p className="mt-2 text-2xl font-bold text-text">
                          {usageToday.speaking_remaining}
                          <span className="ml-1 text-sm font-medium text-text-muted">
                            / {usageToday.speaking_limit} left
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted">
                      Limits reset at {formatResetAt(usageToday.reset_at)}.
                    </p>
                    <Link href="/pricing" className={buttonSecondary}>
                      Upgrade to Pro
                    </Link>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    <p className="text-sm leading-6 text-text-muted">
                      Usage data is unavailable right now. You can still continue learning from the
                      modules below.
                    </p>
                    <Link href="/pricing" className={buttonSecondary}>
                      View pricing
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className={cardTitle}>Quick access</h2>
                <p className={cardDesc}>
                  Jump straight into the five places most learners need after login.
                </p>
              </div>
              <Link href="/progress" className="text-sm font-medium text-indigo-600 hover:underline">
                View all progress
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {quickAccessCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className={cn(cardBase, 'flex h-full flex-col justify-between p-5 hover:-translate-y-0.5')}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-text">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-text-muted">{card.description}</p>
                  </div>
                  <span className="mt-5 text-sm font-medium text-indigo-600">{card.ctaLabel}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <section className={cn(cardBase, 'p-6')}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className={cardTitle}>Recent activity</h2>
                  <p className={cardDesc}>
                    Review the latest learning actions across Writing, Speaking, and Reading.
                  </p>
                </div>
                {recentActivities.length > 0 && (
                  <span className={badgeBase}>{recentActivities.length} recent item{recentActivities.length === 1 ? '' : 's'}</span>
                )}
              </div>

              {recentActivities.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {recentActivities.map((item) => (
                    <div
                      key={`${item.kind}-${item.id}`}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={badgeBase}>
                            {item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}
                          </span>
                          <p className="text-sm font-semibold text-text">{item.title}</p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-text-muted">{item.detail}</p>
                        <p className="mt-2 text-xs text-text-muted">
                          {formatDateTime(item.occurredAt)}
                        </p>
                      </div>
                      <Link href={item.href} className="shrink-0 text-sm font-medium text-indigo-600 hover:underline">
                        {item.ctaLabel}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-border bg-surface-2 p-6">
                  <p className="text-sm leading-6 text-text-muted">
                    No recent activity yet. Your first sessions will appear here once you complete a
                    Reading, Writing, or Speaking task.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="/vocab?skill=reading" className={buttonPrimary}>
                      Start Reading
                    </Link>
                    <Link href="/task/select?task_type=Task%202" className={buttonSecondary}>
                      Start Writing
                    </Link>
                  </div>
                </div>
              )}
            </section>

            <div className="grid gap-6">
              <section className={cn(cardBase, 'p-6')}>
                <h2 className={cardTitle}>Progress snapshot</h2>
                <p className={cn(cardDesc, 'mt-2')}>
                  A compact view of your latest writing signal and overall activity.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-xl border border-border bg-surface-2 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                      Writing attempts
                    </p>
                    <p className="mt-2 text-2xl font-bold text-text">
                      {summary?.total_attempts ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-2 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                      Latest band estimate
                    </p>
                    <p className="mt-2 text-2xl font-bold text-text">
                      {summary?.latest_band_estimate ?? '-'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                    Current focus
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {weaknessText
                      ? `Most recent feedback points to ${weaknessText}.`
                      : 'Complete a Writing task to see a clearer weakness summary here.'}
                  </p>
                </div>
              </section>

              <section className={cn(cardBase, 'p-6')}>
                <h2 className={cardTitle}>Practice lanes</h2>
                <p className={cn(cardDesc, 'mt-2')}>
                  Stay inside the app for your next session. Open the public hubs only when you need broader context or examples.
                </p>
                <div className="mt-5 space-y-3">
                  <Link
                    href="/vocab?skill=reading"
                    className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm font-medium text-text hover:bg-surface"
                  >
                    <span>Reading practice</span>
                    <span className="text-text-muted">/vocab?skill=reading</span>
                  </Link>
                  <Link
                    href="/task/select?task_type=Task%202"
                    className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm font-medium text-text hover:bg-surface"
                  >
                    <span>Writing practice</span>
                    <span className="text-text-muted">/task/select</span>
                  </Link>
                  <Link
                    href="/exam/speaking"
                    className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm font-medium text-text hover:bg-surface"
                  >
                    <span>Speaking practice</span>
                    <span className="text-text-muted">/exam/speaking</span>
                  </Link>
                </div>
                <p className="mt-4 text-xs leading-6 text-text-muted">
                  Need broader guidance first? Visit the{' '}
                  <Link href="/reading" className="font-medium text-indigo-600 hover:underline">
                    Reading hub
                  </Link>
                  ,{' '}
                  <Link href="/writing" className="font-medium text-indigo-600 hover:underline">
                    Writing hub
                  </Link>
                  , or{' '}
                  <Link href="/speaking" className="font-medium text-indigo-600 hover:underline">
                    Speaking hub
                  </Link>
                  .
                </p>
              </section>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
