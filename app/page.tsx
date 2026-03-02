'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { getContactFormEmbedUrl, CONTACT_GOOGLE_FORM_URL, CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/constants/contact';

// --- アニメーションコンポーネント ---
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

// --- アイコンコンポーネント ---
const Icons = {
  Check: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  Chart: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Brain: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Pencil: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Book: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  ArrowRight: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>,
  Alert: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Target: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Layers: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
};

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const supabase = createClient();

  // --- スムーズスクロール機能 ---
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const redirectUrl = typeof window !== 'undefined' 
          ? `${window.location.origin}/home`
          : '/home';
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (signUpError) throw signUpError;

        if (data.user && !data.session) {
          setSignUpSuccess(true);
          setLoading(false);
          return;
        }

        if (data.session) {
          setLoading(false);
          await new Promise(resolve => setTimeout(resolve, 300));
          window.location.href = '/onboarding';
          return;
        }
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (!signInData.session) {
          throw new Error('ログインに失敗しました。セッションが作成されませんでした。');
        }

        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          throw new Error('ログインに失敗しました。セッションが保存されませんでした。');
        }
        
        setLoading(false);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', signInData.user.id)
          .single();

        if (profile && !profile.onboarding_completed) {
          window.location.href = '/onboarding';
        } else {
          window.location.href = '/home';
        }
        return;
      }
    } catch (err) {
      let errorMessage = 'An error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
        if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'メールアドレスまたはパスワードが正しくありません。';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'メールアドレスが確認されていません。確認メールを確認してください。';
        } else if (err.message.includes('User not found')) {
          errorMessage = 'ユーザーが見つかりません。サインアップしてください。';
        }
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setResendingEmail(true);
    setError(null);
    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/home`
        : '/home';
      
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (resendError) throw resendError;
      setError(null);
      alert('確認メールを再送信しました。メールボックス（スパムフォルダも含む）を確認してください。');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メールの再送信に失敗しました');
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary text-text font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 背景装飾 */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/60 rounded-[100%] blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-50/40 rounded-[100%] blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* ヘッダー */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/50" />
        <div className="container mx-auto px-6 h-16 flex items-center justify-between relative z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              IELTS Training
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Contact
            </button>
            <Link 
              href="https://ieltsconsult.netlify.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-0">
        
        {/* ヒーローセクション */}
        <div className="container mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            {/* 左側: コピー */}
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
                {/* 例外: ヒーロー強調のため text-display より大きい text-5xl/lg:text-7xl を維持 */}
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-text leading-[1.1]">
                  Score Higher with <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Intelligent</span> Feedback.
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <p className="text-body-lg text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  データ駆動型アプローチで、IELTSスコアの伸び悩みを打破する。<br className="hidden lg:block"/>
                  最新のAIがあなたのライティングを瞬時に分析し、合格への最短ルートを提示します。
                </p>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Icons.Check className="w-3 h-3" /></div>
                    即時スコア判定
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Icons.Check className="w-3 h-3" /></div>
                    論理構成アドバイス
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Icons.Check className="w-3 h-3" /></div>
                    学習ロードマップ
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* 右側: フォーム */}
            <FadeIn delay={0.5} className="lg:col-span-5 w-full max-w-md mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-surface/80 backdrop-blur-xl rounded-2xl shadow-xl ring-1 ring-border p-8">
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">
                      {isSignUp ? 'Get started for free' : 'Welcome back'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {isSignUp ? 'クレジットカードは不要です' : 'アカウントにアクセス'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                        placeholder="hello@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 text-xs text-red-600 flex items-start gap-2 animate-fadeIn">
                        <Icons.Alert className="w-4 h-4 shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}

                    {signUpSuccess && (
                      <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-sm text-indigo-900">
                        <p className="font-bold mb-1">Check your inbox</p>
                        <p className="opacity-80 text-xs mb-2">確認メールを送信しました。リンクをクリックして完了してください。</p>
                        <button
                          type="button"
                          onClick={handleResendConfirmation}
                          disabled={resendingEmail}
                          className="text-xs font-semibold underline hover:text-indigo-700"
                        >
                          {resendingEmail ? '送信中...' : 'メールが届かない場合'}
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || signUpSuccess}
                      className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {isSignUp ? 'Create Account' : 'Sign In'}
                          <Icons.ArrowRight className="w-4 h-4 opacity-80" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                        setSignUpSuccess(false);
                      }}
                      className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                    >
                      {isSignUp ? 'すでにアカウントをお持ちですか？ ログイン' : 'アカウントをお持ちでないですか？ 新規登録'}
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* 課題解決セクション */}
        <section className="py-24 bg-surface border-y border-border">
          <div className="container mx-auto px-6">
            <FadeIn className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                なぜ、独学でのスコアアップは難しいのか
              </h2>
              <p className="text-slate-500 text-lg">
                多くのIELTS学習者が直面する共通の課題があります。
              </p>
            </FadeIn>
            
            <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
              <StaggerItem>
                <div className="p-8 rounded-2xl bg-surface-2 border border-border">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Alert className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">フィードバックの欠如</h3>
                  <p className="text-slate-600 leading-relaxed">
                    自分のライティングやスピーキングのどこが間違っているのか、どう改善すべきかが客観的に分からない。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-8 rounded-2xl bg-surface-2 border border-border">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Chart className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">成長の停滞</h3>
                  <p className="text-slate-600 leading-relaxed">
                    同じような表現ばかり使ってしまい、バンドスコア5.5〜6.0の壁をなかなか超えられない。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-8 rounded-2xl bg-surface-2 border border-border">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">非効率な学習戦略</h3>
                  <p className="text-slate-600 leading-relaxed">
                    闇雲に問題を解くだけで、体系的な語彙強化や論理構成のトレーニングができていない。
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Features セクション (Bento Grid) */}
        <section id="features" className="py-24 bg-bg-secondary">
          <div className="container mx-auto px-6">
            <FadeIn className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-slate-500 text-lg">
                AI技術と学習科学を組み合わせた、オールインワンの学習プラットフォーム
              </p>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
              <StaggerItem>
                <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[220px] flex flex-col">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">AI Instant Feedback</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    提出から数秒で、試験官レベルの詳細なフィードバックを受け取れます。文法ミスだけでなく、語彙の多様性や論理構成まで分析します。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[220px] flex flex-col">
                  <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Book className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">Smart Vocabulary</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    文脈に基づいた語彙学習。忘却曲線に基づくSRSシステムで、効率的に定着させます。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[220px] flex flex-col">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Chart className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">Visual Progress</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    日々の学習進捗と弱点を可視化。自分の成長を実感しながら学習を継続できます。
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[220px] flex flex-col">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">レベル別カリキュラム</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    現在のレベル（Beginner / Intermediate / Advanced）に合わせて、最適な学習コンテンツを自動で提供します。
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Pricing セクション */}
        <section id="pricing" className="py-24 bg-surface border-y border-border">
          <div className="container mx-auto px-6">
            <FadeIn className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                今は完全無料で始められます
              </h2>
              <p className="text-slate-500 text-lg">
                MVP期間中は、すべての機能を無料でお試しいただけます。
              </p>
            </FadeIn>
            
            <FadeIn delay={0.2} className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border-2 border-indigo-200 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  LIMITED TIME
                </div>
                <div className="text-center mb-6">
                  <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-600/10 text-indigo-700 text-xs font-bold">
                    FREE PLAN
                  </div>
                  <div className="text-5xl font-bold text-slate-900 mb-2">
                    ¥0
                  </div>
                  <div className="text-slate-500 text-sm">/ 月</div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {[
                    'AIによる即時フィードバック（無制限）',
                    'Writing Task 1/2 練習',
                    'Speaking練習',
                    '語彙・熟語・表現バンク学習',
                    '進捗可視化・弱点分析',
                    '忘却曲線ベースの復習システム',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 text-indigo-600">
                        <Icons.Check className="w-5 h-5" />
                      </div>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
                >
                  無料で始める
                </button>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3} className="mt-8 text-center text-sm text-slate-500">
              <p>※ 将来的に有料プランを導入する可能性がありますが、現在のユーザーには移行期間を設けます。</p>
            </FadeIn>
          </div>
        </section>

        {/* About セクション */}
        <section id="about" className="py-24 bg-surface border-y border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <FadeIn className="text-center mb-16">
                <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                  IELTS Trainingについて
                </h2>
                <p className="text-slate-500 text-lg">
                  データ駆動型アプローチで、IELTSスコアアップをサポートします
                </p>
              </FadeIn>
              
              <div className="space-y-12">
                <FadeIn delay={0.1}>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                      ミッション
                    </h3>
                    <p className="text-text-muted leading-relaxed bg-surface-2 p-6 rounded-xl border border-border">
                      IELTS Trainingは、AI技術を活用して、すべての学習者が効率的にIELTSスコアを向上させられるプラットフォームを目指しています。
                      独学では難しい「客観的なフィードバック」と「データに基づく学習戦略」を提供することで、目標スコア達成をサポートします。
                    </p>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.2}>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                      技術スタック
                    </h3>
                    <StaggerContainer className="grid md:grid-cols-2 gap-4" staggerDelay={0.1}>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">フロントエンド</div>
                          <div className="text-sm text-text-muted">Next.js 14, React, TypeScript, Tailwind CSS</div>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">バックエンド</div>
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
                          <div className="font-semibold text-text mb-2">その他</div>
                          <div className="text-sm text-text-muted">Zod (バリデーション), SRSアルゴリズム</div>
                        </div>
                      </StaggerItem>
                    </StaggerContainer>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Contact セクション（Google Forms 埋め込み + 別タブリンク + mailto） */}
        <section id="contact" className="py-24 bg-bg-secondary">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <FadeIn className="text-center mb-12">
                <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                  お問い合わせ
                </h2>
                <p className="text-slate-500 text-lg">
                  ご質問やフィードバックをお待ちしています
                </p>
              </FadeIn>
              <FadeIn delay={0.1} className="space-y-4">
                <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                  <iframe
                    src={getContactFormEmbedUrl()}
                    title="お問い合わせフォーム"
                    className="w-full border-0"
                    style={{ height: 'min(1000px, 90vh)' }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <a
                    href={CONTACT_GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-medium underline"
                  >
                    別タブで開く
                  </a>
                  {CONTACT_EMAIL && CONTACT_EMAIL !== 'support@example.com' && (
                    <a href={CONTACT_MAILTO} className="text-slate-600 hover:text-slate-800">
                      メールで問い合わせ
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
               <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-indigo-600 rounded text-white flex items-center justify-center">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="font-bold text-slate-900">IELTS Training</span>
               </Link>
               <p className="text-sm text-slate-500 leading-relaxed">
                 AI-powered IELTS preparation platform designed to help you achieve your target score efficiently.
               </p>
            </div>
            
            <div className="md:col-start-3">
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 cursor-pointer transition-colors text-left">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-600 cursor-pointer transition-colors text-left">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-indigo-600 cursor-pointer transition-colors text-left">
                    About
                  </button>
                </li>
                <li>
                  <Link 
                    href="https://ieltsconsult.netlify.app/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="hover:text-indigo-600 cursor-pointer transition-colors text-left">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} IELTS Training. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-400">
              <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-slate-600 transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => setShowTermsOfService(true)} className="hover:text-slate-600 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy モーダル */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowPrivacyPolicy(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-8 space-y-6 text-slate-700">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">1. 個人情報の収集</h3>
                <p className="leading-relaxed">
                  IELTS Training（以下「当サービス」）は、サービス提供のために以下の個人情報を収集します：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>メールアドレス（アカウント作成時）</li>
                  <li>パスワード（暗号化して保存）</li>
                  <li>学習レベル（初級・中級・上級）</li>
                  <li>学習履歴（回答内容、フィードバック、進捗データ）</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">2. 個人情報の利用目的</h3>
                <p className="leading-relaxed">
                  収集した個人情報は、以下の目的でのみ利用します：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>サービスの提供・運営</li>
                  <li>学習進捗の可視化と分析</li>
                  <li>AIによるフィードバック生成</li>
                  <li>サービス改善のための統計データ作成</li>
                  <li>重要なお知らせの配信</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">3. 個人情報の管理</h3>
                <p className="leading-relaxed">
                  当サービスは、Supabase（PostgreSQL）を使用して個人情報を安全に管理しています。
                  パスワードは暗号化され、学習データは認証済みユーザーのみがアクセス可能です。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">4. 第三者への提供</h3>
                <p className="leading-relaxed">
                  当サービスは、法令に基づく場合を除き、個人情報を第三者に提供することはありません。
                  AIフィードバック生成のため、OpenAIやGroqなどのLLMサービスに回答内容を送信しますが、
                  これらはサービス提供に必要な最小限の情報のみです。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">5. 個人情報の削除</h3>
                <p className="leading-relaxed">
                  アカウント削除により、すべての個人情報と学習データが削除されます。
                  アカウント削除は、設定画面から行うことができます。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">6. お問い合わせ</h3>
                <p className="leading-relaxed">
                  個人情報に関するお問い合わせは、Contactセクションからご連絡ください。
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  最終更新日: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service モーダル */}
      {showTermsOfService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowTermsOfService(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Terms of Service</h2>
              <button
                onClick={() => setShowTermsOfService(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-8 space-y-6 text-slate-700">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">1. サービスの利用</h3>
                <p className="leading-relaxed">
                  IELTS Training（以下「当サービス」）は、IELTS学習をサポートするためのプラットフォームです。
                  当サービスを利用することにより、本利用規約に同意したものとみなされます。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">2. アカウント</h3>
                <p className="leading-relaxed mb-2">
                  アカウント作成には、有効なメールアドレスとパスワードが必要です。
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>アカウント情報は正確に登録してください</li>
                  <li>アカウントの管理責任はユーザーにあります</li>
                  <li>不正アクセスが疑われる場合は、すぐにパスワードを変更してください</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">3. 利用規約の遵守</h3>
                <p className="leading-relaxed mb-2">
                  ユーザーは、以下の行為を禁止します：
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>他のユーザーに迷惑をかける行為</li>
                  <li>当サービスの運営を妨害する行為</li>
                  <li>AIフィードバックを不正に利用する行為</li>
                  <li>その他、当サービスが不適切と判断する行為</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">4. サービスの内容</h3>
                <p className="leading-relaxed">
                  当サービスは、AI技術を活用したIELTS学習サポートを提供します。
                  AIによるフィードバックは参考情報であり、実際のIELTS試験の結果を保証するものではありません。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">5. サービスの変更・終了</h3>
                <p className="leading-relaxed">
                  当サービスは、事前の通知なく、サービスの内容を変更または終了する場合があります。
                  現在は無料で提供していますが、将来的に有料プランを導入する可能性があります。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">6. 免責事項</h3>
                <p className="leading-relaxed">
                  当サービスは、以下の事項について責任を負いません：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>AIフィードバックの正確性</li>
                  <li>IELTS試験の結果</li>
                  <li>サービス利用による損害</li>
                  <li>システムの不具合やメンテナンスによる利用不可</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">7. 知的財産権</h3>
                <p className="leading-relaxed">
                  当サービスのコンテンツ（テキスト、デザイン、ロゴ等）の知的財産権は、
                  当サービスまたはその提供者に帰属します。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">8. 規約の変更</h3>
                <p className="leading-relaxed">
                  当サービスは、本利用規約を変更する場合があります。
                  変更後の規約は、当サービス上に掲載した時点から効力を生じます。
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  最終更新日: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}