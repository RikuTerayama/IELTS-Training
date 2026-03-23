'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import type { ApiResponse } from '@/lib/api/response';
import type { AttemptHistory, ProgressSummary } from '@/lib/domain/types';
import { BLOG_NOTE_URL, BLOG_OFFICIAL_URL } from '@/lib/constants/contact';
import {
  badgeBase,
  bodyText,
  buttonPrimary,
  buttonSecondary,
  cardBase,
  cardDesc,
  cardTitle,
  cn,
  helperText,
  pageTitle,
  sectionTitle,
  subsectionTitle,
  surfaceSoftBadge,
  surfaceSoftBody,
  surfaceSoftCard,
  surfaceSoftTitle,
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
  TR: 'Task Response',
  CC: '構成',
  LR: '語彙',
  GRA: '文法',
};

const READING_TYPE_LABELS: Record<string, string> = {
  'Paraphrase Drill': '言い換え / 語彙',
  'Matching Headings': '見出し対応',
  'True / False / Not Given': 'TFNG',
  'Summary Completion': '要約穴埋め',
  'Matching Information': '情報対応',
  'Sentence Completion': '文完成',
};

const ACTIVITY_KIND_LABELS: Record<DashboardActivity['kind'], string> = {
  writing: 'Writing',
  speaking: 'Speaking',
  reading: 'Reading',
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
  if (!value) return 'Reading';
  return READING_TYPE_LABELS[value] ?? value;
}

function buildReadingDetail(item: ReadingVocabHistoryItem): string {
  const type = localizeReadingType(item.question_type);
  const status = item.is_correct ? '正解' : '要復習';
  return `${type} / ${status}`;
}

function formatSpeakingPart(part: string | null | undefined): string {
  if (!part) return 'Session';
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
          {badge ? (
            <span className={cn(badgeBase, 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-200')}>
              {badge}
            </span>
          ) : null}
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
      title: `Writing フィードバック / Band ${item.band_estimate}`,
      detail:
        item.weakness_tags.length > 0
          ? `今の重点: ${getWeaknessText(item.weakness_tags) ?? '最新のフィードバックを確認'}`
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
          : item.topic ?? item.question_preview ?? '直近の Speaking を確認',
      occurredAt: item.created_at,
      href: `/speaking/feedback/${item.id}`,
      ctaLabel: '結果を見る',
    }));

    const readingActivities: DashboardActivity[] = (readingHistory?.history ?? []).map((item) => ({
      id: item.id,
      kind: 'reading',
      title: 'Reading',
      detail: buildReadingDetail(item),
      occurredAt: item.created_at,
      href: '/training/vocab?skill=reading',
      ctaLabel: 'Reading 復習へ',
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
        title: 'まずは Reading から始める',
        description:
          'ログイン直後は Reading の復習から始めると、Writing や Speaking にもつながる学習リズムを作りやすくなります。',
        href: '/training/vocab?skill=reading',
        label: 'Reading を始める',
        secondaryHref: '/task/select?task_type=Task%202',
        secondaryLabel: 'Writing を開く',
      };
    }

    if (allAiUsageSpent) {
      return {
        eyebrow: '今日のおすすめ',
        title: '今日はインプット中心で整える',
        description:
          '今日の AI 利用枠を使い切っているので、Reading と単語の復習を進めるのが安全です。アウトプットは明日また再開できます。',
        href: '/training/vocab?skill=reading',
        label: 'Reading 復習へ',
        secondaryHref: '/training/vocab',
        secondaryLabel: '単語を開く',
      };
    }

    if (readingDueCount > 0) {
      return {
        eyebrow: '今日のおすすめ',
        title: `Reading の復習が ${readingDueCount} 件あります`,
        description:
          '忘れかけている項目を先に整えると、その後の Writing / Speaking の定着も安定します。短いセッションでも進めやすい導線です。',
        href: '/training/vocab?skill=reading',
        label: 'Reading 復習を始める',
        secondaryHref: '/progress',
        secondaryLabel: '進捗を見る',
      };
    }

    if (weaknessText) {
      return {
        eyebrow: '今日のおすすめ',
        title: `Writing の重点は ${weaknessText}`,
        description:
          '直近のフィードバックを踏まえて、Task 2 をもう 1 本書くと改善点が最も定着しやすい状態です。Practice から入るのが安全です。',
        href: '/task/select?task_type=Task%202',
        label: 'Writing Practice を始める',
        secondaryHref: '/progress',
        secondaryLabel: '進捗を見返す',
      };
    }

    if (speakingHistory.length > 0) {
      return {
        eyebrow: '今日のおすすめ',
        title: 'Speaking をもう 1 セット進める',
        description:
          '直近で Speaking を使っているので、間を空けすぎずにもう 1 セッション進めると感覚を維持しやすくなります。',
        href: '/exam/speaking',
        label: 'Speaking を始める',
        secondaryHref: '/progress',
        secondaryLabel: '結果を確認する',
      };
    }

    return {
      eyebrow: '今日のおすすめ',
      title: 'アウトプットを一本進める',
      description:
        '今日は Writing か Speaking のどちらかを 1 本だけでも進めるのがおすすめです。短時間でも進捗に反映されます。',
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
        eyebrow: 'インプット',
        description:
          readingDueCount > 0
            ? `今日の復習が ${readingDueCount} 件あります。まずは Reading から始めると、その後の定着も安定します。`
            : 'Academic Reading の問題タイプ別に入り、Reading の土台を整えられます。',
        href: '/training/vocab?skill=reading',
        ctaLabel: readingDueCount > 0 ? 'Reading 復習を始める' : 'Reading を始める',
        badge: readingDueCount > 0 ? `復習 ${readingDueCount}` : undefined,
      },
      {
        title: '単語',
        eyebrow: 'インプット',
        description: 'Reading・Listening と連動する単語復習をまとめて進められます。',
        href: '/training/vocab',
        ctaLabel: '単語を開く',
      },
      {
        title: 'Listening',
        eyebrow: 'インプット',
        description:
          'Listening の公開ハブで、現在使える入口と今後の公開予定を確認できます。今は単語・熟語・表現から土台を整える段階です。',
        href: '/listening',
        ctaLabel: 'Listening を見る',
        badge: '準備中',
      },
      {
        title: '熟語',
        eyebrow: 'インプット',
        description: '熟語や言い換え表現を確認して、Reading / Listening の理解を底上げします。',
        href: '/training/idiom',
        ctaLabel: '熟語を開く',
      },
      {
        title: '表現',
        eyebrow: 'インプット',
        description: 'Writing / Speaking に使いやすい表現バンクを確認できます。',
        href: '/training/lexicon',
        ctaLabel: '表現バンクを開く',
      },
    ],
    [readingDueCount]
  );

  const outputCards = useMemo<HubCard[]>(
    () => [
      {
        title: 'Writing Practice',
        eyebrow: 'アウトプット',
        description: 'PREP で構成を整えながら、弱点を意識して書き進められるモードです。',
        href: '/task/select?task_type=Task%202',
        ctaLabel: 'Practice を始める',
        badge: weaknessText ? `重点: ${weaknessText}` : undefined,
      },
      {
        title: 'Writing Exam Mode',
        eyebrow: 'アウトプット',
        description: '本番に近い流れで一気に書き、提出後すぐにフィードバックを確認できます。',
        href: '/task/select?task_type=Task%202&mode=exam',
        ctaLabel: 'Exam Mode を開く',
      },
      {
        title: 'Speaking',
        eyebrow: 'アウトプット',
        description: 'AI interviewer で Part 1-3 を進め、結果までまとめて確認できます。',
        href: '/exam/speaking',
        ctaLabel: 'Speaking を始める',
      },
      {
        title: '結果 / フィードバック',
        eyebrow: 'アウトプット',
        description: 'Writing と Speaking の履歴を見返して、次の 1 本に反映しやすくします。',
        href: '/progress',
        ctaLabel: '進捗を開く',
      },
    ],
    [weaknessText]
  );

  const blogCards = useMemo<HubCard[]>(
    () => [
      {
        title: 'Blog',
        eyebrow: '記事 / Note',
        description: 'IELTS 学習の考え方や運用のコツを公式 Blog で確認できます。',
        href: BLOG_OFFICIAL_URL,
        ctaLabel: 'Blog を開く',
        external: true,
      },
      {
        title: 'Note',
        eyebrow: '記事 / Note',
        description: '短めの学習メモや補足は Note 側で追えます。復習の入口として使えます。',
        href: BLOG_NOTE_URL,
        ctaLabel: 'Note を開く',
        external: true,
      },
      {
        title: '公開ガイド',
        eyebrow: '記事 / Note',
        description: 'Reading / Writing / Speaking の公開ガイドへ戻って、全体像を整理できます。',
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
              <span className={badgeBase}>学習ハブ</span>
              <div className="space-y-3">
                <h1 className={pageTitle}>学習ホーム</h1>
                <p className={cn(bodyText, 'max-w-3xl')}>
                  次にやること、直近の学習、各レーンへの入口をここにまとめています。まずは今日のおすすめから 1 本選べば十分です。
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.8fr)]">
              <div className={cn(surfaceSoftCard, 'space-y-5 p-5')}>
                <div className="space-y-2">
                  <span className={surfaceSoftBadge}>{recommendedAction.eyebrow}</span>
                  <h2 className={cn(subsectionTitle, surfaceSoftTitle)}>{recommendedAction.title}</h2>
                  <p className={cn(surfaceSoftBody, 'text-helper md:text-body-base')}>
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
                  <h2 className={subsectionTitle}>
                    {resumeActivity ? resumeActivity.title : 'まだ学習履歴がありません'}
                  </h2>
                  <p className={cardDesc}>
                    {resumeActivity
                      ? `${resumeActivity.detail} / ${formatDateTime(resumeActivity.occurredAt)}`
                      : '最初の 1 セッションを終えると、ここに前回の続きが表示されます。'}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {resumeActivity ? (
                    <Link href={resumeActivity.href} className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                      {resumeActivity.ctaLabel}
                    </Link>
                  ) : (
                    <Link href="/training/vocab?skill=reading" className={cn(buttonSecondary, 'inline-flex items-center justify-center')}>
                      Reading を始める
                    </Link>
                  )}
                  <Link href="/progress" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
                    進捗を見る
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(cardBase, 'space-y-5 p-6')}>
            <div className="space-y-2">
              <span className={badgeBase}>進捗サマリー</span>
              <h2 className={subsectionTitle}>今の学習状況</h2>
              <p className={cardDesc}>
                直近の提出と結果を見て、今日どのレーンを進めるべきかをざっくり判断できます。
              </p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className={cn(cardBase, 'space-y-1 p-4')}>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Writing 提出数</dt>
                <dd className="text-2xl font-bold text-text">{summary?.total_attempts ?? 0}</dd>
              </div>
              <div className={cn(cardBase, 'space-y-1 p-4')}>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Band 推定</dt>
                <dd className="text-2xl font-bold text-text">{summary?.latest_band_estimate ?? '-'}</dd>
              </div>
              <div className={cn(cardBase, 'space-y-1 p-4')}>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">今の重点</dt>
                <dd className="text-sm font-medium text-text">
                  {weaknessText
                    ? `Writing: ${weaknessText}`
                    : weakestReadingSkill
                      ? `Reading: ${weakestReadingSkill.skill}`
                      : 'Reading か Writing から最初の 1 本を進めましょう'}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="input" className="space-y-4">
          <div className="space-y-2">
            <span className={badgeBase}>インプット</span>
            <h2 className={sectionTitle}>読みながら土台を整える</h2>
            <p className={cn(helperText, 'max-w-3xl md:text-body-base')}>
              Reading / Listening / 単語 / 熟語 / 表現をまとめて確認できるレーンです。今日の復習がある日は、ここから入るのが安定します。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {inputCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section id="output" className="space-y-4">
          <div className="space-y-2">
            <span className={badgeBase}>アウトプット</span>
            <h2 className={sectionTitle}>書いて話して仕上げる</h2>
            <p className={cn(helperText, 'max-w-3xl md:text-body-base')}>
              Writing と Speaking の Practice / Exam / フィードバックをまとめたレーンです。次の 1 本をここから選べます。
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
            <span className={badgeBase}>記事 / Note</span>
            <h2 className={sectionTitle}>視点を増やす</h2>
            <p className={cn(helperText, 'max-w-3xl md:text-body-base')}>
              すぐ実践に入らない日でも、記事 / Note と公開ガイドで学び方を整理できます。学習の解像度を上げたいときに使えます。
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
              <span className={badgeBase}>最近の学習</span>
              <h2 className={subsectionTitle}>最近の学習</h2>
              <p className={cardDesc}>
                直近で触った結果をまとめています。続きから進めたいときはここを見れば十分です。
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
                        <span className="text-xs text-text-muted">{formatDateTime(activity.occurredAt)}</span>
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
                <h3 className={subsectionTitle}>まだ学習履歴がありません</h3>
                <p className={cardDesc}>
                  まずはインプットかアウトプットを 1 セット進めると、ここに履歴が表示されます。最初の学習を始めましょう。
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/training/vocab?skill=reading" className={cn(buttonPrimary, 'inline-flex items-center justify-center')}>
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
                <span className={badgeBase}>進捗サマリー</span>
                <h2 className={subsectionTitle}>今の重点</h2>
              </div>
              <ul className="space-y-3 text-sm leading-relaxed text-text-muted">
                <li>
                  {weaknessText
                    ? `Writing は ${weaknessText} を重点的に整えるフェーズです。Practice から入ると改善点を反映しやすいです。`
                    : 'Writing の弱点タグはまだ少ないので、まずは 1 本提出して傾向を取りましょう。'}
                </li>
                <li>
                  {weakestReadingSkill
                    ? `Reading は ${weakestReadingSkill.skill} の正答率が ${weakestReadingSkill.accuracy_percent}% です。インプットの最初にここを進めると安定します。`
                    : 'Reading の統計はまだ少ないので、数セッション進めてから苦手を見ましょう。'}
                </li>
                <li>
                  {summary?.latest_band_estimate
                    ? `最新の Band 推定は ${summary.latest_band_estimate} です。次に 1 本進めて、改善が反映されたか確認しましょう。`
                    : 'まだ Band 推定が出ていません。Writing を 1 本提出すると学習の目安が見えやすくなります。'}
                </li>
              </ul>
            </div>

            <div className={cn(cardBase, 'space-y-4 p-6')}>
              <div className="space-y-2">
                <span className={badgeBase}>プランと残り枠</span>
                <h2 className={subsectionTitle}>プランと残り枠</h2>
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
                      {usageToday.is_pro ? 'Pro 利用中' : '無料プラン'}
                    </span>
                    <span className="text-sm text-text-muted">リセット: {formatResetAt(usageToday.reset_at)}</span>
                  </div>

                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className={cn(cardBase, 'space-y-1 p-4')}>
                      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Writing AI 残り回数</dt>
                      <dd className="text-xl font-bold text-text">
                        {usageToday.is_pro ? '上限なし' : `${usageToday.writing_remaining} / ${usageToday.writing_limit}`}
                      </dd>
                    </div>
                    <div className={cn(cardBase, 'space-y-1 p-4')}>
                      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Speaking AI 残り回数</dt>
                      <dd className="text-xl font-bold text-text">
                        {usageToday.is_pro ? '上限なし' : `${usageToday.speaking_remaining} / ${usageToday.speaking_limit}`}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {usageToday.is_pro ? (
                      <>
                        <Link href="/billing/manage" className={cn(buttonPrimary, 'inline-flex items-center justify-center')}>
                          支払い設定を開く
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
                          Pro リクエストを見る
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className={cardDesc}>
                    現在の利用状況を取得できませんでした。必要なら料金ページからプランの違いを確認できます。
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
