'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { buildContactGoogleFormUrl, CONTACT_EMAIL, CONTACT_MAILTO, BLOG_OFFICIAL_URL, BLOG_NOTE_URL } from '@/lib/constants/contact';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { PUBLIC_NAV } from '@/lib/config/nav';

// --- 郢ｧ・｢郢昜ｹ斟鍋ｹ晢ｽｼ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ郢ｧ・ｳ郢晢ｽｳ郢晄亢繝ｻ郢晞亂ﾎｦ郢昴・---
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1], // easeOutExpo
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- 郢ｧ・｢郢ｧ・､郢ｧ・ｳ郢晢ｽｳ郢ｧ・ｳ郢晢ｽｳ郢晄亢繝ｻ郢晞亂ﾎｦ郢昴・---
const Icons = {
  Check: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  Chart: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Brain: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Pencil: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Book: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  ArrowRight: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>,
  Alert: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Target: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Layers: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Mic: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
};

const PRIVACY_SECTIONS = [
  {
    title: '1. Information we collect',
    paragraphs: [
      'IELTS Training stores the minimum account and learning data needed to run the service. This may include your email address, product usage history, submitted answers, and billing-related identifiers.',
    ],
    bullets: [
      'Account details needed for sign-in and support',
      'Learning progress such as attempts, feedback, and review history',
      'Operational logs needed to keep the service stable and secure',
      'Billing identifiers from payment providers when you upgrade',
    ],
  },
  {
    title: '2. How we use the information',
    paragraphs: [
      'We use this information to provide learning features, improve product quality, prevent abuse, and support billing or account recovery when needed.',
    ],
    bullets: [
      'Deliver practice, feedback, and progress tracking',
      'Improve reliability and diagnose service issues',
      'Operate billing, access control, and upgrade flows',
      'Respond to support or contact requests',
    ],
  },
  {
    title: '3. Storage and third parties',
    paragraphs: [
      'Data is processed using infrastructure such as Supabase for application data and Stripe for billing. AI-related requests may be sent to model providers to generate feedback or evaluation results.',
      'We only share the data required to perform those functions and do not sell personal information.',
    ],
  },
  {
    title: '4. Security',
    paragraphs: [
      'We take reasonable technical and operational measures to protect account and learning data. However, no internet service can guarantee perfect security.',
    ],
  },
  {
    title: '5. Your choices',
    paragraphs: [
      'You can contact us if you need help with account access, billing questions, or deletion requests. We may need to verify ownership before making account-level changes.',
    ],
  },
  {
    title: '6. Updates',
    paragraphs: [
      'We may update this Privacy Policy as the product evolves. Material changes will be reflected on this page with an updated revision date.',
    ],
  },
] as const;

const TERMS_SECTIONS = [
  {
    title: '1. Service overview',
    paragraphs: [
      'IELTS Training provides IELTS-focused learning tools, AI-assisted feedback, progress tracking, and related educational content. Feature availability may change over time.',
    ],
  },
  {
    title: '2. Accounts and access',
    paragraphs: [
      'You are responsible for maintaining the security of your account and for activity performed through it. Do not share credentials or attempt to access another user account.',
    ],
    bullets: [
      'Use accurate account information',
      'Keep your sign-in credentials private',
      'Do not misuse trial, quota, or billing systems',
    ],
  },
  {
    title: '3. AI output and learning guidance',
    paragraphs: [
      'AI-generated scores, rewrites, and recommendations are learning aids. They are not official IELTS scores and should be treated as guidance rather than guarantees.',
    ],
  },
  {
    title: '4. Acceptable use',
    paragraphs: [
      'Do not use the service to abuse infrastructure, scrape content, interfere with other users, or submit unlawful or harmful material.',
    ],
  },
  {
    title: '5. Billing and upgrades',
    paragraphs: [
      'Paid features may be offered through recurring or one-time billing. Pricing, limits, and billing terms are shown at checkout or on the Pricing page.',
    ],
  },
  {
    title: '6. Availability and changes',
    paragraphs: [
      'We may update, suspend, or discontinue features when needed for security, maintenance, or product changes. We aim to do this responsibly but cannot guarantee uninterrupted availability.',
    ],
  },
  {
    title: '7. Contact',
    paragraphs: [
      'If you have questions about these terms, contact us through the contact section on this page or by email.',
    ],
  },
] as const;

export default function LandingPage() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [landingMenuOpen, setLandingMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // --- 郢ｧ・ｹ郢晢｣ｰ郢晢ｽｼ郢ｧ・ｺ郢ｧ・ｹ郢ｧ・ｯ郢晢ｽｭ郢晢ｽｼ郢晢ｽｫ隶匁ｺｯ繝ｻ ---
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary text-text font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 髢ｭ譴ｧ蜍ｹ髯ｬ繝ｻ・｣・ｾ */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/60 rounded-[100%] blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-50/40 rounded-[100%] blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* 郢晏･繝｣郢敖郢晢ｽｼ */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-xl border-b border-border/50" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-text">
                IELTS Training
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              {PUBLIC_NAV.map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm font-medium text-text-muted hover:text-primary transition-colors">
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
              >
                Contact
              </button>
              <Link
                href="/login"
                className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Login
              </Link>
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setLandingMenuOpen((open) => !open)}
                className="p-2 text-text-muted hover:text-text transition-colors duration-200"
                aria-label={landingMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {landingMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {landingMenuOpen && (
            <nav className="md:hidden pb-4 border-t border-border/50 pt-4">
              <div className="flex flex-col gap-3">
                {PUBLIC_NAV.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setLandingMenuOpen(false)}
                    className="text-sm font-medium text-text-muted hover:text-text py-2 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setLandingMenuOpen(false);
                    scrollToSection('contact');
                  }}
                  className="text-left text-sm font-medium text-text-muted hover:text-text py-2 transition-colors"
                >
                  Contact
                </button>
                <Link
                  href="/login"
                  onClick={() => setLandingMenuOpen(false)}
                  className="mt-2 rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors text-center"
                >
                  Login
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-0">
        
        {/* 郢晏・繝ｻ郢晢ｽｭ郢晢ｽｼ郢ｧ・ｻ郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ */}
        <div className="container mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            {/* 陝ｾ・ｦ陋幢ｽｴ: 郢ｧ・ｳ郢晄鱒繝ｻ */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left pt-8">
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide uppercase shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  New AI Engine V2.0
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                {/* 關灘唱・､繝ｻ 郢晏・繝ｻ郢晢ｽｭ郢晢ｽｼ陟托ｽｷ髫ｱ・ｿ邵ｺ・ｮ邵ｺ貅假ｽ・text-display 郢ｧ蛹ｻ・願棔・ｧ邵ｺ髦ｪ・・text-5xl/lg:text-7xl 郢ｧ蝣､・ｶ・ｭ隰悶・*/}
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-text leading-[1.1]">
                  Score Higher with <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Intelligent</span> Feedback.
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <p className="text-body-lg text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  データ駆動のアプローチで、IELTSスコアの伸び悩みを最短距離で改善。<br className="hidden lg:block" />
                  最新のAIがあなたのライティングを数秒で分析し、次に取るべき学習ルートを提示します。
                </p>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 text-sm font-semibold text-text">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Icons.Check className="w-3 h-3" /></div>
                    即時スコア分析
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Icons.Check className="w-3 h-3" /></div>
                    弱点別アドバイス
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Icons.Check className="w-3 h-3" /></div>
                    学習ロードマップ
                  </div>
                </div>
                <a
                  href={BLOG_NOTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Icons.Book className="w-4 h-4" />
                  Noteを見る
                </a>
              </FadeIn>
            </div>

            {/* 陷ｿ・ｳ陋幢ｽｴ: 郢晢ｽ｡郢ｧ・､郢晢ｽｳ郢ｧ・｢郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ繝ｻ繝ｻriting, Speaking, Vocab, Pricing, Login繝ｻ繝ｻ*/}
            <FadeIn delay={0.5} className="lg:col-span-5 w-full max-w-md mx-auto">
              <div className="relative bg-surface/80 backdrop-blur-xl rounded-2xl shadow-theme-lg ring-1 ring-border p-8">
                <h2 className="text-xl font-bold text-text mb-2">今すぐ始める</h2>
                <p className="text-sm text-text-muted mb-6">
                  Reading・Writing・Speaking・語彙の練習と料金はこちらから。
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/reading"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Book className="w-5 h-5 text-primary" />
                      Reading
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/writing"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Pencil className="w-5 h-5 text-primary" />
                      Writing
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/speaking"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Mic className="w-5 h-5 text-primary" />
                      Speaking
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/vocab"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Book className="w-5 h-5 text-primary" />
                      Vocab
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Target className="w-5 h-5 text-primary" />
                      Pricing
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/login"
                    className="mt-2 w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-lg transition-colors text-center"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* 髫ｱ・ｲ鬯倡霜・ｧ・｣雎趣ｽｺ郢ｧ・ｻ郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ */}
        <section className="py-24 bg-surface border-y border-border">
          <div className="container mx-auto px-6">
            <FadeIn className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                なぜ、独学でのスコアアップは難しいのか
              </h2>
              <p className="text-text-muted text-lg">
                多くのIELTS学習者が直面する共通の課題があります。
              </p>
            </FadeIn>
            
            <StaggerContainer className="grid md:grid-cols-3 gap-6 md:gap-8" staggerDelay={0.15}>
              <StaggerItem>
                <div className="p-8 rounded-2xl bg-surface-2 border border-border min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Alert className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">フィードバックの不足</h3>
                  <p className="text-text-muted leading-relaxed text-sm">
                    自己採点だけでは、何が足りないのか、どこを直すべきかが見えにくく、改善が止まりがちです。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-8 rounded-2xl bg-surface-2 border border-border min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Chart className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">勉強の方向性</h3>
                  <p className="text-text-muted leading-relaxed text-sm">
                    どの順番で取り組めばよいか分からないまま続けても、Band 5.5 から 7.0 への壁を越えにくくなります。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-8 rounded-2xl bg-surface-2 border border-border min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">継続しにくい学習</h3>
                  <p className="text-text-muted leading-relaxed text-sm">
                    復習の優先度が見えないと、重要な練習や弱点対策が後回しになりやすくなります。
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Features 郢ｧ・ｻ郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ (Bento Grid) */}
        <section id="features" className="py-24 bg-bg-secondary">
          <div className="container mx-auto px-6">
            <FadeIn className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                スコアアップに必要なすべて
              </h2>
              <p className="text-text-muted text-lg">
                AI分析と学習導線を組み合わせた、オールインワンのIELTS学習プラットフォーム
              </p>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
              <StaggerItem>
                <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">AI 即時フィードバック</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    数秒でIELTS基準に沿ったフィードバックを返し、何を直すべきかを具体的に示します。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Book className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">スマート復習</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    重要な語彙や表現をSRSで定着させ、忘れやすい項目を効率よく復習できます。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Chart className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">進捗の可視化</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    日々の学習記録と成果を可視化し、次にやるべきことを迷わず選べるようにします。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">レベル別カリキュラム</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    現在のレベルに合わせて、無理なく続けられる学習コンテンツを段階的に提供します。
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* SEO髫ｪ蛟・ｽｺ荵昴・陝・ｽｦ驗吝・ﾎ懃ｹｧ・ｽ郢晢ｽｼ郢ｧ・ｹ陝・ｮ茨ｽｷ螟ｲ・ｼ蛹ｻ繝ｻ郢晢ｽｼ郢晢｣ｰ邵ｺ荵晢ｽ蛾坎蛟・ｽｺ荵昶・邵ｺ・ｮ陷繝ｻﾎ夂ｹ晢ｽｪ郢晢ｽｳ郢ｧ・ｯ繝ｻ繝ｻ*/}
        <section className="py-20 bg-surface border-y border-border">
          <div className="container mx-auto px-6">
            <FadeIn className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                学習リソース・記事
              </h2>
              <p className="text-text-muted text-lg">
                Reading / Speaking / Writing のトピック解説や対策記事はこちらから。
              </p>
            </FadeIn>
            <FadeIn delay={0.1} className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link
                href="/reading"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
              >
                <Icons.Book className="w-5 h-5 text-primary" />
                Reading hub
              </Link>
              <Link
                href="/speaking"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
              >
                <Icons.Mic className="w-5 h-5 text-primary" />
                Speaking hub
              </Link>
              <Link
                href="/writing"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
              >
                <Icons.Pencil className="w-5 h-5 text-primary" />
                Writing hub
              </Link>
              <Link
                href="/speaking/topics/work-study"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                Work &amp; Study (Speaking)
              </Link>
              <Link
                href="/writing/task2/topics/education"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                Education (Writing Task 2)
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* Pricing 郢ｧ・ｻ郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ - #pricing 邵ｺ・ｧ鬯溷ｸ呻ｽ鍋ｸｺ・ｧ邵ｺ髦ｪ笳・ｹ晢ｽｦ郢晢ｽｼ郢ｧ・ｶ郢晢ｽｼ邵ｺ險途o邵ｺ・ｮ關難ｽ｡陋滂ｽ､郢ｧ雋槫初騾・・・ｧ・｣邵ｺ・ｧ邵ｺ髦ｪ・・*/}
        <section
          id="pricing"
          className="py-24 bg-surface border-y border-border scroll-mt-24"
        >
          <div className="container mx-auto px-6 max-w-5xl">
            <FadeIn className="text-center mb-12">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                Pricing
              </h2>
              <p className="text-text-muted text-lg max-w-xl mx-auto">
                無料ではじめて、必要になったらAIフィードバックを拡張できます。
              </p>
            </FadeIn>

            <FadeIn delay={0.1} className="grid md:grid-cols-2 gap-8">
              {/* Free */}
              <div className="rounded-2xl border-2 border-border bg-surface-2 p-8 flex flex-col">
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 mb-3 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-bold">
                    Free
                  </div>
                  <div className="text-3xl font-bold text-text mb-1">¥0</div>
                  <div className="text-sm text-text-muted">/ month</div>
                </div>
                <div className="mb-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-text mb-2 uppercase tracking-wider">
                      Daily limits
                    </h4>
                    <ul className="space-y-1 text-sm text-text-muted">
                      <li>• Writing AI: up to 10/day</li>
                      <li>• Speaking AI: up to 5/day</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text mb-2 uppercase tracking-wider">
                      Included
                    </h4>
                    <ul className="space-y-2">
                      {['Practice (PREP / drills)', 'Exam mode (basic)', 'Recent progress history'].map(
                        (item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Icons.Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <span className="text-sm text-text">{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="mt-auto w-full py-3 px-4 border-2 border-border bg-surface text-text font-semibold rounded-lg hover:bg-surface-2 transition-colors"
                >
                  Start free
                </button>
              </div>

              {/* Pro - 郢敖郢晢ｽｼ郢ｧ・ｯ郢晢ｽ｢郢晢ｽｼ郢晏ｳｨ縲堤ｹｧ繧・＆郢晢ｽｳ郢晏現ﾎ帷ｹｧ・ｹ郢晁ご・｢・ｺ闖ｫ繝ｻ*/}
              <div className="rounded-2xl border-2 border-indigo-300 dark:border-indigo-600 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/70 dark:to-blue-950/60 p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Recommended
                </div>
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 mb-3 rounded-full bg-indigo-600/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 text-xs font-bold">
                    PRO
                  </div>
                  <div className="text-3xl font-bold text-text mb-1">
                    Pro pricing
                  </div>
                  <div className="text-sm text-text-muted">
                    Monthly / annual billing
                  </div>
                </div>
                <div className="mb-6 space-y-4">
                  <ul className="space-y-2">
                    {[
                      'Writing / Speaking AI with expanded access,',
                      'More room for repeated practice,',
                      'Full feedback review access',
                      'Priority for deeper practice loops',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icons.Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/pricing"
                  className="mt-auto w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 text-center"
                >
                  Upgrade to Pro
                </Link>
                <p className="mt-3 text-center">
                  <Link
                    href="/pro/request"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
                  >
                    Need manual approval? Request Pro
                  </Link>
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-8 text-center text-sm text-text-muted">
              <p>
                Secure checkout powered by Stripe.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* About 郢ｧ・ｻ郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ */}
        <section id="about" className="py-24 bg-surface border-y border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <FadeIn className="text-center mb-16">
                <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                  About IELTS Training
                </h2>
                <p className="text-text-muted text-lg">
                  データ駆動のアプローチで、IELTSスコア改善をサポートします。
                </p>
              </FadeIn>
              
              <div className="space-y-12">
                <FadeIn delay={0.1}>
                  <div>
                    <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                      Mission
                    </h3>
                    <p className="text-text-muted leading-relaxed bg-surface-2 p-6 rounded-xl border border-border">
                      IELTS Training は、AIを活用して IELTS 学習をより具体的で続けやすいものにするためのプラットフォームです。
                      単なる採点ではなく、フィードバックとデータにもとづく学習導線をセットで提供し、実際のスコア改善につなげます。
                    </p>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.2}>
                  <div>
                    <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                      Tech stack
                    </h3>
                    <StaggerContainer className="grid md:grid-cols-2 gap-4" staggerDelay={0.1}>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">Frontend</div>
                          <div className="text-sm text-text-muted">Next.js 14, React, TypeScript, Tailwind CSS</div>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">Backend</div>
                          <div className="text-sm text-text-muted">Supabase (PostgreSQL), Next.js API Routes</div>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">AI/LLM</div>
                          <div className="text-sm text-text-muted">Groq, OpenAI (GPT-4o-mini)</div>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">Other</div>
                          <div className="text-sm text-text-muted">Zod (validation), SRS algorithms</div>
                        </div>
                      </StaggerItem>
                    </StaggerContainer>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Contact 郢ｧ・ｻ郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ繝ｻ繝ｻoogle Forms 陜謎ｹ晢ｽ・恷・ｼ邵ｺ・ｿ + 陋ｻ・･郢ｧ・ｿ郢晄じﾎ懃ｹ晢ｽｳ郢ｧ・ｯ + mailto繝ｻ繝ｻ*/}
        <section id="contact" className="py-24 bg-bg-secondary scroll-mt-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <FadeIn className="text-center mb-12">
                <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                  Contact
                </h2>
                <p className="text-text-muted text-lg">
                  ご質問やフィードバックがあればご連絡ください。
                </p>
                {userId && (
                  <p className="mt-2 text-sm text-text-muted">
                    申し込みをスムーズにするため、ユーザーIDを自動でフォームに含めています。
                  </p>
                )}
              </FadeIn>
              <FadeIn delay={0.1} className="space-y-4">
                <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                  <iframe
                    src={buildContactGoogleFormUrl({ userId, embedded: true })}
                    title="Contact form"
                    className="w-full border-0"
                    style={{ height: 'min(1000px, 90vh)' }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <a
                    href={buildContactGoogleFormUrl({ userId, embedded: false })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-medium underline"
                  >
                    Open in a new tab
                  </a>
                  {CONTACT_EMAIL && CONTACT_EMAIL !== 'support@example.com' && (
                    <a href={CONTACT_MAILTO} className="text-text-muted hover:text-text transition-colors">
                      Contact by email
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

      </main>

      {/* 郢晁ｼ斐Ε郢ｧ・ｿ郢晢ｽｼ */}
      <footer className="bg-surface border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
               <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-indigo-600 rounded text-white flex items-center justify-center">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="font-bold text-text">IELTS Training</span>
               </Link>
               <p className="text-sm text-text-muted leading-relaxed">
                 AIで学習導線をサポートする IELTS 対策プラットフォーム
               </p>
            </div>
            
            <div className="md:col-start-3">
              <h4 className="font-bold text-text mb-4 text-sm">Service</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors text-left">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors text-left">
                    Pricing
                  </button>
                </li>
                <li>
                  <Link href="/speaking" className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                    Speaking hub
                  </Link>
                </li>
                <li>
                  <Link href="/writing" className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                    Writing hub
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-text mb-4 text-sm">Other</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors text-left">
                    About
                  </button>
                </li>
                <li>
                  <Link 
                    href={BLOG_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors text-left">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-text-subtle">
              © {new Date().getFullYear()} IELTS Training. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-text-subtle">
              <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-text transition-colors text-text-muted">
                Privacy Policy
              </button>
              <button onClick={() => setShowTermsOfService(true)} className="hover:text-text transition-colors text-text-muted">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy modal */}
      {showPrivacyPolicy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowPrivacyPolicy(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <h2 className="text-2xl font-bold text-text">Privacy Policy</h2>
              <button
                type="button"
                onClick={() => setShowPrivacyPolicy(false)}
                className="text-text-muted transition-colors hover:text-text"
                aria-label="Close Privacy Policy"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6 px-6 py-8 text-text">
              {PRIVACY_SECTIONS.map((section) => (
                <section key={section.title}>
                  <h3 className="mb-3 text-lg font-bold text-text">{section.title}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-text-muted">
                      {paragraph}
                    </p>
                  ))}
                  {'bullets' in section && section.bullets ? (
                    <ul className="ml-4 mt-3 list-disc list-inside space-y-1 text-text-muted">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-muted">
                  Last updated:{' '}
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service modal */}
      {showTermsOfService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowTermsOfService(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <h2 className="text-2xl font-bold text-text">Terms of Service</h2>
              <button
                type="button"
                onClick={() => setShowTermsOfService(false)}
                className="text-text-muted transition-colors hover:text-text"
                aria-label="Close Terms of Service"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6 px-6 py-8 text-text">
              {TERMS_SECTIONS.map((section) => (
                <section key={section.title}>
                  <h3 className="mb-3 text-lg font-bold text-text">{section.title}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-text-muted">
                      {paragraph}
                    </p>
                  ))}
                  {'bullets' in section && section.bullets ? (
                    <ul className="ml-4 mt-3 list-disc list-inside space-y-1 text-text-muted">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-muted">
                  Last updated:{' '}
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
