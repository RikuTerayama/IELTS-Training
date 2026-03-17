'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  BLOG_NOTE_URL,
  BLOG_OFFICIAL_URL,
  buildContactGoogleFormUrl,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
} from '@/lib/constants/contact';
import { BrandLink, BrandMark } from '@/components/branding/Brand';
import { PublicHeader } from '@/components/layout/PublicHeader';
import {
  bodyText,
  buttonPrimary,
  buttonSecondary,
  cardBase,
  cn,
  helperText,
  sectionTitle,
  subsectionTitle,
  surfaceSoftBadge,
  surfaceSoftBody,
  surfaceSoftCard,
  surfaceSoftTitle,
} from '@/lib/ui/theme';

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Icons = {
  Brain: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Book: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Chart: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Pencil: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Layers: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253l8.25 4.5-8.25 4.5-8.25-4.5 8.25-4.5zm0 0l8.25 4.5M12 6.253L3.75 10.753M3.75 10.753v4.494L12 19.747l8.25-4.5v-4.494" />
    </svg>
  ),
  ArrowRight: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  Check: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
} as const;

const FEATURE_CARDS = [
  {
    title: 'AI フィードバック',
    description: 'Writing と Speaking の回答に対して、次に直すべき点が分かるフィードバックを返します。',
    icon: Icons.Brain,
    accent: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
  },
  {
    title: 'Reading と単語の反復',
    description: 'Reading と単語を短いセットで回しながら、意味を取る力と語彙の土台を整えます。',
    icon: Icons.Book,
    accent: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  {
    title: '進捗と見返し',
    description: '提出履歴、改善点、直近のおすすめを一つの流れで確認できます。',
    icon: Icons.Chart,
    accent: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
  },
  {
    title: 'Practice / Exam Mode',
    description: '構成を整える練習と、本番寄りのモードを用途に合わせて切り替えられます。',
    icon: Icons.Pencil,
    accent: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300',
  },
] as const;

const PRIVACY_SECTIONS = [
  {
    title: '1. 取得する情報',
    paragraphs: [
      'Meridian では、ログイン情報、学習履歴、フィードバック結果、お問い合わせ内容など、サービス提供に必要な情報を取得します。',
      '決済情報は Stripe で処理され、Meridian のサーバーにカード情報を保存しません。',
    ],
  },
  {
    title: '2. 利用目的',
    paragraphs: [
      '取得した情報は、学習記録の保存、フィードバックの提供、アカウント管理、障害対応、お問い合わせ対応のために利用します。',
    ],
  },
  {
    title: '3. 外部サービス',
    paragraphs: [
      '認証とデータ保存には Supabase、決済には Stripe、お問い合わせフォームには Google Forms を利用しています。',
    ],
  },
  {
    title: '4. お問い合わせ',
    paragraphs: [
      'プライバシーに関するお問い合わせは、ページ下部のお問い合わせフォームまたはメールから受け付けています。',
    ],
  },
] as const;

const TERMS_SECTIONS = [
  {
    title: '1. 利用範囲',
    paragraphs: [
      'Meridian は IELTS 学習支援サービスです。医療・法律・雇用判断などの目的では利用しないでください。',
    ],
  },
  {
    title: '2. アカウント',
    paragraphs: [
      '学習履歴、AI フィードバック、課金機能の利用にはログインが必要です。ログイン情報は適切に管理してください。',
    ],
  },
  {
    title: '3. 支払いとプラン',
    paragraphs: [
      '無料プランと Pro プランがあります。Pro の料金、請求、解約は支払い設定ページで確認できます。',
    ],
  },
  {
    title: '4. 免責',
    paragraphs: [
      'AI フィードバックや Band の表示は学習支援のための参考情報であり、公式スコアを保証するものではありません。',
    ],
  },
] as const;

function PolicyModal({
  title,
  sections,
  onClose,
}: {
  title: string;
  sections: ReadonlyArray<{ title: string; paragraphs: readonly string[] }>;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 px-4 py-8">
      <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-theme-lg">
        <div className="flex items-start justify-between gap-4">
          <h2 className={sectionTitle}>{title}</h2>
          <button type="button" onClick={onClose} className={buttonSecondary} aria-label="閉じる">
            閉じる
          </button>
        </div>
        <div className="mt-6 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h3 className={subsectionTitle}>{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className={bodyText}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-bg-secondary font-sans text-text selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-[100%] bg-indigo-50/60 blur-3xl opacity-70 dark:bg-indigo-950/30" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[800px] rounded-[100%] bg-sky-50/40 blur-3xl opacity-60 dark:bg-sky-950/20" />
      </div>

      <PublicHeader variant="floating" contactHref="/#contact" />

      <main className="relative z-10 pb-0 pt-32">
        <section className="px-6 pb-16 md:pb-24">
          <div className="container mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
              <FadeIn className="space-y-6">
                <span className={surfaceSoftBadge}>Meridian</span>
                <div className="space-y-4">
                  <h1 className="max-w-4xl text-balance text-display font-bold tracking-tight text-text">
                    Reading / Writing / Speaking を、ひとつの学習ループで続ける
                  </h1>
                  <p className={cn(bodyText, 'max-w-3xl text-lg md:text-body-lg')}>
                    Meridian は、インプット、アウトプット、フィードバック、見返しを一つの流れで回せる IELTS 学習アプリです。
                    まずは無料で始めて、必要になったら Pro に切り替えられます。
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href="/home" className={cn(buttonPrimary, 'inline-flex items-center gap-2')}>
                    学習ホームへ
                    <Icons.ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex items-center')}>
                    料金を見る
                  </Link>
                </div>
                <div className={cn(helperText, 'flex flex-wrap items-center gap-x-3 gap-y-2')}>
                  <Link href="/reading" className="font-medium text-primary hover:underline">
                    Reading
                  </Link>
                  <span>・</span>
                  <Link href="/writing" className="font-medium text-primary hover:underline">
                    Writing
                  </Link>
                  <span>・</span>
                  <Link href="/speaking" className="font-medium text-primary hover:underline">
                    Speaking
                  </Link>
                  <span>・</span>
                  <Link href="/vocab" className="font-medium text-primary hover:underline">
                    単語
                  </Link>
                </div>
                <p className={cn(helperText, 'rounded-xl border border-border bg-surface/80 p-4 backdrop-blur-sm')}>
                  学習メモや更新情報は
                  {' '}
                  <a href={BLOG_NOTE_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                    Note
                  </a>
                  {' '}
                  と
                  {' '}
                  <a href={BLOG_OFFICIAL_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                    公式ブログ
                  </a>
                  {' '}
                  で公開しています。
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className={cn(surfaceSoftCard, 'space-y-6 p-6 md:p-7')}>
                  <BrandMark size={72} priority className="items-center" textClassName="text-2xl" />
                  <div className="space-y-3">
                    <h2 className={cn(subsectionTitle, surfaceSoftTitle)}>まず見られること</h2>
                    <p className={cn(surfaceSoftBody, 'text-helper')}>
                      公開ハブで学習の全体像を確認し、ログイン後はホームからそのまま Reading / Writing / Speaking の実使用へ進めます。
                    </p>
                  </div>
                  <ul className={cn(surfaceSoftBody, 'space-y-3 text-sm')}>
                    {[
                      'Reading と単語の反復',
                      'Writing Practice / Exam Mode',
                      'Speaking AI 面接',
                      '進捗とフィードバックの見返し',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className={cn(surfaceSoftBadge, 'mt-0.5 rounded-full p-1')}>
                          <Icons.Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <section id="features" className="bg-bg-secondary py-24">
          <div className="container mx-auto px-6">
            <FadeIn className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className={cn(sectionTitle, 'mb-4')}>Meridian でできること</h2>
              <p className={cn(bodyText, 'text-lg')}>
                AI フィードバック、反復学習、進捗の見返しを一つの流れでつなげています。何を次にやるべきかが分かる構成です。
              </p>
            </FadeIn>

            <StaggerContainer className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2" staggerDelay={0.1}>
              {FEATURE_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <StaggerItem key={card.title}>
                    <div className={cn(cardBase, 'flex min-h-[240px] flex-col p-8')}>
                      <div className={cn('mb-6 flex h-12 w-12 items-center justify-center rounded-xl', card.accent)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className={cn(subsectionTitle, 'mb-3 text-card-title')}>{card.title}</h3>
                      <p className={cn(helperText, 'text-sm')}>{card.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        <section id="pricing" className="border-y border-border bg-surface py-24">
          <div className="container mx-auto px-6">
            <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
              <h2 className={cn(sectionTitle, 'mb-4')}>料金</h2>
              <p className={cn(bodyText, 'text-lg')}>
                まずは無料で始めて、Writing / Speaking を継続して使いたくなったら Pro を選べます。
              </p>
            </FadeIn>

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
              <FadeIn delay={0.1}>
                <article className={cn(cardBase, 'h-full p-7')}>
                  <h3 className={subsectionTitle}>無料プラン</h3>
                  <p className={cn(helperText, 'mt-2')}>
                    まずは公開ハブと毎日の AI 利用枠で学習の流れを試せます。
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-text-muted">
                    <li>Reading / 単語の学習導線</li>
                    <li>Writing / Speaking AI の無料枠</li>
                    <li>学習ホームと進捗の確認</li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/home" className={cn(buttonSecondary, 'inline-flex items-center')}>
                      無料で始める
                    </Link>
                  </div>
                </article>
              </FadeIn>

              <FadeIn delay={0.15}>
                <article className={cn(surfaceSoftCard, 'h-full p-7')}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={surfaceSoftBadge}>Meridian Pro</span>
                    <span className={surfaceSoftBadge}>継続学習向け</span>
                  </div>
                  <h3 className={cn(subsectionTitle, surfaceSoftTitle, 'mt-4')}>Pro プラン</h3>
                  <p className={cn(surfaceSoftBody, 'mt-2 text-helper')}>
                    毎日の AI 学習を増やして続けたい人向けに、利用枠と見返し導線を広げたプランです。
                  </p>
                  <ul className={cn(surfaceSoftBody, 'mt-6 space-y-2 text-sm')}>
                    <li>Writing / Speaking AI の継続利用</li>
                    <li>フィードバック履歴と進捗の見返し</li>
                    <li>支払い設定からのプラン管理</li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/pricing" className={cn(buttonPrimary, 'inline-flex items-center')}>
                      Pro の詳細を見る
                    </Link>
                  </div>
                </article>
              </FadeIn>
            </div>
          </div>
        </section>

        <section id="about" className="bg-bg-secondary py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
              <FadeIn>
                <h2 className={cn(sectionTitle, 'mb-4')}>About Meridian</h2>
                <p className={cn(bodyText, 'mb-6')}>
                  Meridian は、Reading / Writing / Speaking を分断せず、続けやすい一つの学習ループとして設計した IELTS 学習アプリです。
                </p>
                <div className={cn(cardBase, 'p-6')}>
                  <h3 className={cn(subsectionTitle, 'mb-3 text-card-title')}>ミッション</h3>
                  <p className={bodyText}>
                    学習者が「次に何をやるべきか」で迷わず、短い時間でも積み上がる体験を作ることを目指しています。
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="space-y-4">
                  <h2 className={cn(sectionTitle, 'mb-4')}>技術スタック</h2>
                  <StaggerContainer className="grid gap-4 md:grid-cols-2" staggerDelay={0.08}>
                    {[
                      ['フロントエンド', 'Next.js 14 / React / TypeScript / Tailwind CSS'],
                      ['バックエンド', 'Supabase / Next.js API Routes'],
                      ['AI / LLM', 'Groq / OpenAI'],
                      ['計測と運用', '学習履歴 / 安全なエラー処理 / 継続導線'],
                    ].map(([label, value]) => (
                      <StaggerItem key={label}>
                        <div className={cn(cardBase, 'p-5')}>
                          <h3 className={cn(subsectionTitle, 'mb-2 text-card-title')}>{label}</h3>
                          <p className={helperText}>{value}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-surface py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl">
              <FadeIn className="mb-12 text-center">
                <h2 className={cn(sectionTitle, 'mb-4')}>お問い合わせ</h2>
                <p className={cn(bodyText, 'text-lg')}>
                  アカウント、学習導線、請求、提案などの連絡はこちらから受け付けています。Google Forms 経由で送信されます。
                </p>
                {userId ? (
                  <p className={cn(helperText, 'mt-3 text-sm')}>
                    ログイン中のユーザーは、フォームにユーザー ID を付けた状態で開けます。必要なら追加説明を書き添えてください。
                  </p>
                ) : null}
              </FadeIn>
              <FadeIn delay={0.1} className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                  <iframe
                    src={buildContactGoogleFormUrl({ userId, embedded: true })}
                    title="お問い合わせフォーム"
                    className="w-full border-0"
                    style={{ height: 'min(1000px, 90vh)' }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <a
                    href={buildContactGoogleFormUrl({ userId, embedded: false })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline hover:no-underline"
                  >
                    新しいタブで開く
                  </a>
                  {CONTACT_EMAIL && CONTACT_EMAIL !== 'support@example.com' ? (
                    <a href={CONTACT_MAILTO} className="text-text-muted transition-colors hover:text-text">
                      メールで問い合わせる
                    </a>
                  ) : null}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3 md:col-span-2">
              <BrandLink href="/" size={34} textClassName="text-lg" />
              <p className={helperText}>
                Meridian は、Reading / Writing / Speaking を一つの学習ループで進める IELTS 学習アプリです。
              </p>
            </div>
            <div>
              <h2 className={cn(subsectionTitle, 'mb-3 text-card-title')}>リンク</h2>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link href="/reading" className="hover:text-text">Reading</Link></li>
                <li><Link href="/writing" className="hover:text-text">Writing</Link></li>
                <li><Link href="/speaking" className="hover:text-text">Speaking</Link></li>
                <li><Link href="/pricing" className="hover:text-text">料金</Link></li>
              </ul>
            </div>
            <div>
              <h2 className={cn(subsectionTitle, 'mb-3 text-card-title')}>コンテンツ</h2>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><a href={BLOG_OFFICIAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-text">公式ブログ</a></li>
                <li><a href={BLOG_NOTE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-text">Note</a></li>
                <li><button type="button" onClick={() => setShowPrivacyPolicy(true)} className="hover:text-text">プライバシーポリシー</button></li>
                <li><button type="button" onClick={() => setShowTermsOfService(true)} className="hover:text-text">利用規約</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 text-sm text-text-muted">
            &copy; {currentYear} Meridian. All rights reserved.
          </div>
        </div>
      </footer>

      {showPrivacyPolicy ? (
        <PolicyModal
          title="プライバシーポリシー"
          sections={PRIVACY_SECTIONS}
          onClose={() => setShowPrivacyPolicy(false)}
        />
      ) : null}
      {showTermsOfService ? (
        <PolicyModal
          title="利用規約"
          sections={TERMS_SECTIONS}
          onClose={() => setShowTermsOfService(false)}
        />
      ) : null}
    </div>
  );
}
