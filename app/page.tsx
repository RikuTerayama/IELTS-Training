'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

// --- アイコンコンポーネント（絵文字の代わりにこれらを使用します） ---
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
  const supabase = createClient();

  // --- ロジック部分は変更なし ---
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
  // --- ロジック終了 ---

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 背景の洗練された装飾 */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/60 rounded-[100%] blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-50/40 rounded-[100%] blur-3xl opacity-60" />
        {/* グリッドパターン */}
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

      <main className="relative z-10 pt-32 pb-24">
        
        {/* ヒーローセクション */}
        <div className="container mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            {/* 左側: コピー */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left pt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide uppercase shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                New AI Engine V2.0
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1]">
                Score Higher with <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Intelligent</span> Feedback.
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                データ駆動型アプローチで、IELTSスコアの伸び悩みを打破する。<br className="hidden lg:block"/>
                最新のAIがあなたのライティングを瞬時に分析し、合格への最短ルートを提示します。
              </p>
              
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
            </div>

            {/* 右側: フォーム */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl ring-1 ring-slate-900/5 p-8">
                  
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
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-lg shadow-slate-900/10 active:transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <>
                          {isSignUp ? 'Create Account' : 'Sign In'}
                          <Icons.ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setError(null);
                          setSignUpSuccess(false);
                        }}
                        className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                      >
                        {isSignUp ? 'すでにアカウントをお持ちの方' : '新規登録はこちら'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 課題解決セクション (Modern Cards) */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">なぜ、独学でのスコアアップは難しいのか</h2>
              <p className="text-slate-500 text-lg">多くの学習者が直面する「見えない壁」を、テクノロジーで可視化します。</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <Icons.Alert className="w-6 h-6 text-red-500" />, 
                  title: "フィードバックの欠如", 
                  desc: "ライティングの自己採点は不可能です。改善点が見えないまま、間違ったフォームで練習を続けていませんか？" 
                },
                { 
                  icon: <Icons.Chart className="w-6 h-6 text-orange-500" />, 
                  title: "成長の停滞", 
                  desc: "「書けるようになった気」がしていても、スコアが変わらない。客観的な指標がないため、スランプに陥りやすくなります。" 
                },
                { 
                  icon: <Icons.Layers className="w-6 h-6 text-blue-500" />, 
                  title: "非効率な学習戦略", 
                  desc: "自分に必要なのが単語力なのか、構成力なのか。優先順位を誤ると、膨大な時間を浪費することになります。" 
                },
              ].map((item, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features: Bento Grid Layout */}
        <section className="py-24 bg-[#FAFAFA]">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs mb-2 block">Our Solution</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                All-in-One Platform<br />for IELTS Success
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
              
              {/* Feature 1: Main AI - Large Box */}
              <div className="md:col-span-2 row-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/30">
                    <Icons.Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Instant Feedback</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      提出からわずか数秒で、IELTS認定試験官レベルの詳細な分析を提供します。
                      文法ミスだけでなく、「論理的一貫性」「語彙の多様性」など、評価基準に基づいた具体的な改善案を提示。
                    </p>
                    <div className="space-y-3">
                      {['予想バンドスコア算出', 'パラフレーズ提案', '論理構成の弱点指摘'].map((tag, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Icons.Check className="w-4 h-4 text-indigo-600" />
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Vocabulary - Small Box */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                  <Icons.Book className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Vocabulary</h3>
                <p className="text-slate-600 text-sm">
                  4技能別・頻出1200語を収録。文脈の中で使える「生きた語彙」を習得します。
                </p>
              </div>

              {/* Feature 3: Analytics - Small Box */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Icons.Chart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Visual Progress</h3>
                <p className="text-slate-600 text-sm">
                  日々の学習データを可視化。苦手なトピックや文法項目を自動で特定します。
                </p>
              </div>

              {/* Feature 4: Level Based - Wide Box */}
              <div className="md:col-span-3 bg-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="relative z-10 max-w-xl">
                  <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-xs font-bold">
                    PERSONALIZED
                  </div>
                  <h3 className="text-2xl font-bold mb-2">レベル別カリキュラム</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    現在の実力（初級・中級・上級）に合わせて、最適なタスクを提供。PREP法を用いたガイド付きライティングで、無理なく論理構成力を養います。
                  </p>
                </div>
                <div className="relative z-10 flex gap-4 shrink-0">
                  <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm text-center">
                    <div className="text-2xl font-bold text-indigo-400">120+</div>
                    <div className="text-xs text-slate-400 mt-1">Practice Topics</div>
                  </div>
                  <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm text-center">
                    <div className="text-2xl font-bold text-indigo-400">24/7</div>
                    <div className="text-xs text-slate-400 mt-1">AI Support</div>
                  </div>
                </div>
                
                {/* 装飾用背景 */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA セクション */}
        <section className="py-20 border-t border-slate-200">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Start your journey today.
            </h2>
            <p className="text-slate-600 mb-10 max-w-2xl mx-auto">
              必要なのは、目標に向かう意志だけ。<br/>
              効率的なツールで、あなたの可能性を最大限に引き出しましょう。
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:scale-105"
            >
              無料でアカウント作成
              <Icons.ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white">
                  <span className="font-bold text-xs">I</span>
                </div>
                <span className="font-bold text-slate-900">IELTS Training</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                AIを活用した次世代のIELTS学習プラットフォーム。<br/>
                科学的なアプローチで、確実なスコアアップをサポートします。
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-indigo-600 cursor-pointer">Features</li>
                <li className="hover:text-indigo-600 cursor-pointer">Pricing</li>
                <li className="hover:text-indigo-600 cursor-pointer">Testimonials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-indigo-600 cursor-pointer">About</li>
                <li className="hover:text-indigo-600 cursor-pointer">Blog</li>
                <li className="hover:text-indigo-600 cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} IELTS Training. All rights reserved.
            </div>
            <div className="flex gap-6">
              <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
