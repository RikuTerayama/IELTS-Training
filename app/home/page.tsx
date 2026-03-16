'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import type { ApiResponse } from '@/lib/api/response';
import type { AttemptHistory, ProgressSummary } from '@/lib/domain/types';
import { BLOG_NOTE_URL, BLOG_OFFICIAL_URL } from '@/lib/constants/contact';
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

type HubCard = {
  title: string;
  eyebrow?: string;
  description: string;
  href: string;
  ctaLabel: string;
  badge?: string;
  external?: boolean;
};

const WEAKNESS_LABELS: Record<string, string> = {
  TR: 'タスク達成',
  CC: '構成',
  LR: '語彙',
  GRA: '文法',
};

const READING_TYPE_LABELS: Record<string, string> = {
  'Paraphrase Drill': 'Paraphrase Drill',
  'Matching Headings': 'Matching Headings',
  'True / False / Not Given': 'True / False / Not Given',
  'Summary Completion': 'Summary Completion',
  'Matching Information': 'Matching Information',
  'Sentence Completion': 'Sentence Completion',
};

const ACTIVITY_KIND_LABELS: Record<DashboardActivity['kind'], string> = {
  writing: 'Output',
  speaking: 'Output',
  reading: 'Input',
};

async function fetchApi<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as ApiResponse<T>;
    if (!data.ok) return null;
    return data.data ?? null;
  } catch {
    return null;
  }
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatResetAt(value: string | null | undefined): string {
  if (!value) return 'JST 0:00';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'JST 0:00';

  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

function getWeaknessText(tags: string[] | undefined): string | null {
  if (!tags?.length) return null;
  return tags.map((tag) => WEAKNESS_LABELS[tag] ?? tag).join(' / ');
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function localizeReadingType(value: string | null | undefined): string {
  if (!value) return 'Reading vocab';
  return READING_TYPE_LABELS[value] ?? value;
}

function buildReadingDetail(item: ReadingVocabHistoryItem): string {
  const type = localizeReadingType(item.question_type);
  const status = item.is_correct ? '正解' : '復習推奨';
  return `${type} / ${status}`;
}

function formatSpeakingPart(part: string | null | undefined): string {
  if (!part) return 'session';
  const normalized = part.toLowerCase();
  if (normalized === 'part1') return 'Part 1';
  if (normalized === 'part2') return 'Part 2';
  if (normalized === 'part3') return 'Part 3';
  return part;
}

function DashboardCard({
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  badge,
  external,
}: HubCard) {
  return (
    <article className={cn(cardBase, 'flex h-full flex-col gap-4 p-5')}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {eyebrow ? <span className={badgeBase}>{eyebrow}</span> : null}
          {badge ? <span className={cn(badgeBase, 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-200')}>{badge}</span> : null}
        </div>
        <div className="space-y-2">
          <h3 className={cardTitle}>{title}</h3>
          <p className={cardDesc}>{description}</p>
        </div>
      </div>
      <div className="mt-auto">
        <Link
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={cn(buttonSecondary, 'inline-flex items-center justify-center')}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
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
  const readingDueCount = readingHistory?.due_count ?? 0;
  const weakestReadingSkill = readingHistory?.stats_by_skill?.length
    ? [...readingHistory.stats_by_skill].sort((a, b) => a.accuracy_percent - b.accuracy_percent)[0]
    : null;

  const recentActivities = useMemo<DashboardActivity[]>(() => {
    const writingActivities: DashboardActivity[] = writingHistory.map((item) => ({
      id: item.id,
      kind: 'writing',
      title: `Writing feedback / Band ${item.band_estimate}`,
      detail:
        item.weakness_tags.length > 0
          ? `弱点: ${getWeaknessText(item.weakness_tags) ?? '最新のフィードバックを確認'}`
          : `レベル: ${item.level}`,
      occurredAt: item.completed_at,
      href: `/feedback/${item.id}`,
      ctaLabel: 'フィードバックを見る',
    }));

    const speakingActivities: DashboardActivity[] = speakingHistory.map((item) => ({
      id: item.id,
      kind: 'speaking',
      title: `Speaking ${formatSpeakingPart(item.part)}`,
      detail:
        item.overall_band != null
          ? `Band ${item.overall_band}${item.topic ? ` / ${item.topic}` : ''}`
          : item.topic ?? item.question_preview ?? '直近の Speaking 結果を確認',
      occurredAt: item.created_at,
      href: `/speaking/feedback/${item.id}`,
      ctaLabel: '面接結果を見る',
    }));

    const readingActivities: DashboardActivity[] = (readingHistory?.history ?? []).map((item) => ({
      id: item.id,
      kind: 'reading',
      title: 'Reading vocab',
      detail: buildReadingDetail(item),
      occurredAt: item.created_at,
      href: '/vocab?skill=reading',
      ctaLabel: 'Reading を続ける',
    }));

    return [...writingActivities, ...speakingActivities, ...readingActivities]
      .sort((a, b) => toTimestamp(b.occurredAt) - toTimestamp(a.occurredAt))
      .slice(0, 6);
  }, [readingHistory?.history, speakingHistory, writingHistory]);

  const hasAnyActivity = recentActivities.length > 0;
  const resumeActivity = recentActivities[0] ?? null;
  const allAiUsageSpent =
    usageToday != null &&
    !usageToday.is_pro &&
    usageToday.writing_remaining === 0 &&
    usageToday.speaking_remaining === 0;

  const recommendedAction = useMemo<DashboardAction>(() => {
    if (!hasAnyActivity) {
      return {
        eyebrow: '今日のおすすめ',
        title: '最初は Reading から始める',
        description:
          'ログイン直後は Reading の短いセッションが最も入りやすい導線です。慣れてきたら Writing や Speaking に広げられます。',
        href: '/vocab?skill=reading',
        label: 'Reading を始める',
        secondaryHref: '/task/select?task_type=Task%202',
        secondaryLabel: 'Writing を開く',
      };
    }

    if (allAiUsageSpent) {
      return {
        eyebrow: '今日のおすすめ',
        title: '今日は Input で積み上げる',
        description:
          'AI 枠を使い切っているので、Reading や vocab review を進めるのが最短です。Output は明日また再開できます。',
        href: '/vocab?skill=reading',
        label: 'Reading review に進む',
        secondaryHref: '/vocab',
        secondaryLabel: 'Vocab を開く',
      };
    }

    if (readingDueCount > 0) {
      return {
        eyebrow: '今日のおすすめ',
        title: `Reading の復習が ${readingDueCount} 件あります`,
        description:
          '忘れかけた問題を先に回収すると、その後の Writing / Speaking の理解も安定します。短いセットで進めて問題ありません。',
        href: '/vocab?skill=reading',
        label: 'Reading review を始める',
        secondaryHref: '/progress',
        secondaryLabel: 'Progress を見る',
      };
    }

    if (weaknessText) {
      return {
        eyebrow: '今日のおすすめ',
        title: `Writing の弱点は ${weaknessText}`,
        description:
          '直近のフィードバックを踏まえて、Task 2 をもう1本書くと改善が最も見えやすい状態です。Practice から入るのが安全です。',
        href: '/task/select?task_type=Task%202',
        label: 'Writing Practice を始める',
        secondaryHref: '/progress',
        secondaryLabel: 'Progress を見返す',
      };
    }

    if (speakingHistory.length > 0) {
      return {
        eyebrow: '今日のおすすめ',
        title: 'Speaking をもう1回回す',
        description:
          '直近で Speaking を触っているので、感覚が残っているうちにもう1セット進めるのが効率的です。',
        href: '/exam/speaking',
        label: 'Speaking を始める',
        secondaryHref: '/progress',
        secondaryLabel: '履歴を確認する',
      };
    }

    return {
      eyebrow: '今日のおすすめ',
      title: 'Output を1本進める',
      description:
        '今日は Writing か Speaking のどちらかを1本だけ完了させるのがおすすめです。短時間で前進を感じやすいタイミングです。',
      href: '/task/select?task_type=Task%202&mode=exam',
      label: 'Writing Exam Mode を開く',
      secondaryHref: '/exam/speaking',
      secondaryLabel: 'Speaking に切り替える',
    };
  }, [allAiUsageSpent, hasAnyActivity, readingDueCount, speakingHistory.length, weaknessText]);

  const inputCards = useMemo<HubCard[]>(
    () => [
      {
        title: 'Reading',
        eyebrow: 'Input',
        description:
          readingDueCount > 0
            ? `今日は ${readingDueCount} 件の review が残っています。まずは Reading vocab から回収するのが最短です。`
            : 'Academic Reading の語彙・設問タイプ練習に入ります。短いセットで始められます。',
        href: '/vocab?skill=reading',
        ctaLabel: readingDueCount > 0 ? 'Reading review を始める' : 'Reading を始める',
        badge: readingDueCount > 0 ? `Due ${readingDueCount}` : undefined,
      },
      {
        title: 'Vocab',
        eyebrow: 'Input',
        description: '語彙の反復学習と skill 別の review をまとめて進めます。',
        href: '/vocab',
        ctaLabel: 'Vocab を開く',
      },
      {
        title: 'Idiom',
        eyebrow: 'Input',
        description: '熟語や言い換え表現を確認して、Reading / Listening の理解を底上げします。',
        href: '/training/idiom',
        ctaLabel: 'Idiom を開く',
      },
      {
        title: 'Lexicon',
        eyebrow: 'Input',
        description: '表現バンクを回して、Writing / Speaking に使う言い回しを補強します。',
        href: '/training/lexicon',
        ctaLabel: 'Lexicon を開く',
      },
    ],
    [readingDueCount]
  );

  const outputCards = useMemo<HubCard[]>(
    () => [
      {
        title: 'Writing Practice',
        eyebrow: 'Output',
        description: 'PREP や整理しながら練習する導線です。弱点を潰しながら書きたいときに向いています。',
        href: '/task/select?task_type=Task%202',
        ctaLabel: 'Practice を始める',
        badge: weaknessText ? `Focus: ${weaknessText}` : undefined,
      },
      {
        title: 'Writing Exam Mode',
        eyebrow: 'Output',
        description: 'PREP を挟まずにそのまま本番想定で書く導線です。時間感覚を確認したい日に使います。',
        href: '/task/select?task_type=Task%202&mode=exam',
        ctaLabel: 'Exam Mode を開く',
      },
      {
        title: 'Speaking',
        eyebrow: 'Output',
        description: 'AI interviewer で Part 1-3 を回します。直近の感覚を維持したい日に向いています。',
        href: '/exam/speaking',
        ctaLabel: 'Speaking を始める',
      },
      {
        title: 'Results / Feedback',
        eyebrow: 'Output',
        description: 'Writing と Speaking の履歴や feedback を見返して、次の1本を決めます。',
        href: '/progress',
        ctaLabel: 'Progress を開く',
      },
    ],
    [weaknessText]
  );

  const blogCards = useMemo<HubCard[]>(
    () => [
      {
        title: 'Blog',
        eyebrow: 'Blog / Note',
        description: 'IELTS 学習の考え方や実践ノートを外部 blog で確認できます。',
        href: BLOG_OFFICIAL_URL,
        ctaLabel: 'Blog を開く',
        external: true,
      },
      {
        title: 'Note',
        eyebrow: 'Blog / Note',
        description: '短い気づきや学習メモを Note 側で追えます。軽く読む入り口として使えます。',
        href: BLOG_NOTE_URL,
        ctaLabel: 'Note を開く',
        external: true,
      },
      {
        title: 'Guides',
        eyebrow: 'Blog / Note',
        description: 'まず全体像を見たいときは、Reading / Writing / Speaking の公開ガイドへ戻れます。',
        href: '/reading',
        ctaLabel: '公開ガイドを見る',
      },
    ],
    []
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <section className={cn(cardBase, 'p-6 md:p-8')}>
              <div className="space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
                <div className="h-10 w-56 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-full animate-pulse rounded bg-surface-2 md:w-2/3" />
              </div>
            </section>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={cn(cardBase, 'space-y-4 p-5')}>
                  <div className="h-5 w-20 animate-pulse rounded bg-surface-2" />
                  <div className="h-8 w-40 animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-surface-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <div className={cn(cardBase, 'space-y-6 p-6 md:p-8')}>
            <div className="space-y-3">
              <span className={badgeBase}>Learning hub</span>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
                  学習ホーム
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-text-muted md:text-lg">
                  何を先にやるか、どのレーンで進めるか、どこで振り返るかをここで整理します。
                  まずは今日のおすすめから1つだけ進めれば十分です。
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.8fr)]">
              <div className={cn(cardBase, 'space-y-5 border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/20')}>
                <div className="space-y-2">
                  <span className={cn(badgeBase, 'border-indigo-200 bg-white/80 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-200')}>
                    {recommendedAction.eyebrow}
                  </span>
                  <h2 className="text-2xl font-bold text-text">{recommendedAction.title}</h2>
                  <p className="text-sm leading-relaxed text-text-muted md:text-base">
                    {recommendedAction.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={recommendedAction.href} className={cn(buttonPrimary, 'inline-flex items-center justify-center')}>
                    {recommendedAction.label}
                  </Link>
                  <Link href={recommendedAction.secondaryHref} className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                    {recommendedAction.secondaryLabel}
                  </Link>
                </div>
              </div>

              <div className={cn(cardBase, 'space-y-4 p-5')}>
                <div className="space-y-2">
                  <span className={badgeBase}>前回の続き</span>
                  <h2 className="text-xl font-semibold text-text">
                    {resumeActivity ? resumeActivity.title : 'まだ履歴がありません'}
                  </h2>
                  <p className={cardDesc}>
                    {resumeActivity
                      ? `${resumeActivity.detail} / ${formatDateTime(resumeActivity.occurredAt)}`
                      : '最初の1セッションが終わると、ここに直近の続きが表示されます。'}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {resumeActivity ? (
                    <Link href={resumeActivity.href} className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                      {resumeActivity.ctaLabel}
                    </Link>
                  ) : (
                    <Link href="/vocab?skill=reading" className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                      Reading を始める
                    </Link>
                  )}
                  <Link href="/progress" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
                    Progress を開く
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(cardBase, 'space-y-5 p-6')}>
            <div className="space-y-2">
                    <span className={badgeBase}>Progress snapshot</span>
              <h2 className="text-xl font-semibold text-text">今の学習状況</h2>
              <p className={cardDesc}>
                直近の結果と残り枠を見て、今日はどのレーンを回すべきか判断できます。
              </p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className={cn(cardBase, 'space-y-1 p-4')}>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        Writing attempts
                </dt>
                <dd className="text-2xl font-bold text-text">{summary?.total_attempts ?? 0}</dd>
              </div>
              <div className={cn(cardBase, 'space-y-1 p-4')}>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Latest band estimate
                </dt>
                <dd className="text-2xl font-bold text-text">
                  {summary?.latest_band_estimate ?? '-'}
                </dd>
              </div>
              <div className={cn(cardBase, 'space-y-1 p-4')}>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Current focus
                </dt>
                <dd className="text-sm font-medium text-text">
                  {weaknessText
                    ? `Writing: ${weaknessText}`
                    : weakestReadingSkill
                      ? `Reading: ${weakestReadingSkill.skill}`
                      : 'まずは Reading からスタート'}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="input" className="space-y-4">
          <div className="space-y-2">
            <span className={badgeBase}>Input</span>
            <h2 className="text-2xl font-bold text-text">読みながら積むレーン</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-text-muted md:text-base">
              Reading / 語彙 / 熟語 / 表現バンクをまとめて扱うゾーンです。短く反復したい日はここから入るのが最も安定します。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {inputCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section id="output" className="space-y-4">
          <div className="space-y-2">
            <span className={badgeBase}>Output</span>
            <h2 className="text-2xl font-bold text-text">書く・話すレーン</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-text-muted md:text-base">
              Writing と Speaking の Practice / Exam / feedback をまとめたゾーンです。今日1本やるならここから選びます。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {outputCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section id="blog" className="space-y-4">
          <div className="space-y-2">
            <span className={badgeBase}>Blog / Note</span>
            <h2 className="text-2xl font-bold text-text">知識を補うレーン</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-text-muted md:text-base">
              すぐ演習に入らない日でも、Blog / Note と公開ガイドで方針を整えられます。学習の解像度を上げたいときに使います。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {blogCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <div className={cn(cardBase, 'space-y-5 p-6')}>
            <div className="space-y-2">
                  <span className={badgeBase}>Recent activity</span>
              <h2 className="text-xl font-semibold text-text">最近の学習</h2>
              <p className={cardDesc}>
                直近で触った項目をまとめています。続きから再開したいときはここを見るのが最短です。
              </p>
            </div>

            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <article
                    key={`${activity.kind}-${activity.id}`}
                    className={cn(cardBase, 'flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between')}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={badgeBase}>{ACTIVITY_KIND_LABELS[activity.kind]}</span>
                        <span className="text-xs text-text-muted">
                          {formatDateTime(activity.occurredAt)}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-text">{activity.title}</h3>
                      <p className={cardDesc}>{activity.detail}</p>
                    </div>
                    <Link href={activity.href} className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                      {activity.ctaLabel}
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className={cn(cardBase, 'space-y-4 p-5')}>
                <h3 className="text-lg font-semibold text-text">まだ履歴がありません</h3>
                <p className={cardDesc}>
                  まずは Input から1セット進めるのがおすすめです。短時間で完了でき、次の Output にもつながります。
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/vocab?skill=reading" className={cn(buttonPrimary, 'inline-flex items-center justify-center')}>
                    Reading を始める
                  </Link>
                  <Link href="/task/select?task_type=Task%202" className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                    Writing を開く
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={cn(cardBase, 'space-y-4 p-6')}>
              <div className="space-y-2">
                <span className={badgeBase}>Progress snapshot</span>
                <h2 className="text-xl font-semibold text-text">今の焦点</h2>
              </div>
              <ul className="space-y-3 text-sm leading-relaxed text-text-muted">
                <li>
                  {weaknessText
                    ? `Writing は ${weaknessText} を重点的に見直すフェーズです。Practice から入ると改善点を拾いやすい状態です。`
                    : 'Writing の弱点タグはまだ少ないため、まずは1本提出して基準を作る段階です。'}
                </li>
                <li>
                  {weakestReadingSkill
                    ? `Reading は ${weakestReadingSkill.skill} の正答率が ${weakestReadingSkill.accuracy_percent}% です。Input の最初にここを回す価値があります。`
                    : 'Reading の skill 別統計はまだ少ないため、まずは数セット解いて傾向を作る段階です。'}
                </li>
                <li>
                  {summary?.latest_band_estimate
                    ? `直近の band estimate は ${summary.latest_band_estimate}。次に 1 本積むと変化を追いやすいタイミングです。`
                    : 'まだ band estimate は出ていません。Writing を1本提出すると Output の基準線ができます。'}
                </li>
              </ul>
            </div>

            <div className={cn(cardBase, 'space-y-4 p-6')}>
              <div className="space-y-2">
                <span className={badgeBase}>Plan / limits</span>
                <h2 className="text-xl font-semibold text-text">プランと残り枠</h2>
              </div>

              {usageToday ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        badgeBase,
                        usageToday.is_pro
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200'
                          : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200'
                      )}
                    >
                      {usageToday.is_pro ? 'Pro Active' : 'Free'}
                    </span>
                    <span className="text-sm text-text-muted">
                      リセット: {formatResetAt(usageToday.reset_at)}
                    </span>
                  </div>

                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className={cn(cardBase, 'space-y-1 p-4')}>
                      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        Writing AI
                      </dt>
                      <dd className="text-xl font-bold text-text">
                        {usageToday.is_pro
                          ? 'Unlimited'
                          : `${usageToday.writing_remaining} / ${usageToday.writing_limit}`}
                      </dd>
                    </div>
                    <div className={cn(cardBase, 'space-y-1 p-4')}>
                      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        Speaking AI
                      </dt>
                      <dd className="text-xl font-bold text-text">
                        {usageToday.is_pro
                          ? 'Unlimited'
                          : `${usageToday.speaking_remaining} / ${usageToday.speaking_limit}`}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {usageToday.is_pro ? (
                      <>
                        <Link href="/billing/manage" className={cn(buttonPrimary, 'inline-flex items-center justify-center')}>
                          支払いを管理する
                        </Link>
                        <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                          料金を見る
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/pricing" className={cn(buttonPrimary, 'inline-flex items-center justify-center')}>
                          Pro を確認する
                        </Link>
                        <Link href="/pro/request" className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                          Pro 申請を見る
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className={cardDesc}>
                    現在の利用枠を取得できませんでした。Pricing からプランの違いを確認できます。
                  </p>
                  <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                    料金を見る
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
