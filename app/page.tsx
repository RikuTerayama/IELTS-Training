'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* 装飾背景（Blob） */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-3xl opacity-50" />
      </div>

      {/* ヘッダー */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              IELTS Training
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link 
              href="https://ieltsconsult.netlify.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Official Blog
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-28 pb-20">
        
        {/* ヒーローセクション */}
        <div className="container mx-auto px-6 mb-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* 左側: コピー */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase">
                New Generation Platform
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
                AIと共に、<br className="hidden lg:block" />
                <span className="text-blue-600">IELTSスコア</span>を<br className="lg:hidden" />
                確実なものに。
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                最新のAIフィードバックとデータ分析で、あなたの英語学習を効率化。<br />
                ライティングの添削から語彙力強化まで、目標スコア達成への最短ルートを提供します。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                {['即時フィードバック', '進捗の可視化', 'レベル別カリキュラム'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 font-medium bg-white/60 px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* 右側: フォーム */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-900/10 border border-white/50 p-8 transform transition hover:scale-[1.01] duration-300">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {isSignUp ? 'アカウント作成' : 'ログイン'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-2">
                    {isSignUp ? '無料で学習を始めましょう' : '学習を再開しましょう'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">メールアドレス</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                      required
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">パスワード</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-start gap-2">
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {error}
                    </div>
                  )}

                  {signUpSuccess && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
                      <p className="font-bold mb-1">確認メールを送信しました</p>
                      <p className="opacity-90">メールボックスをご確認ください。</p>
                      <button
                        type="button"
                        onClick={handleResendConfirmation}
                        disabled={resendingEmail}
                        className="mt-2 text-xs font-semibold underline hover:text-blue-900"
                      >
                        {resendingEmail ? '送信中...' : 'メールが届かない場合はこちら'}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || signUpSuccess}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        処理中...
                      </span>
                    ) : (isSignUp ? 'アカウントを作成する' : 'ログインする')}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">or</span></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                      setSignUpSuccess(false);
                    }}
                    className="w-full text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : '初めての方はこちら（新規登録）'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* 悩み解決セクション */}
        <section className="py-20 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">こんな悩みはありませんか？</h2>
              <p className="text-slate-500">独学でのIELTS対策につきものの課題を解決します</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: "😰", 
                  title: "フィードバックがない", 
                  desc: "書いても正解がわからず、改善ポイントが見えないまま時間だけが過ぎていく..." 
                },
                { 
                  icon: "📉", 
                  title: "成長が実感できない", 
                  desc: "毎日勉強しているのにスコアが伸びず、モチベーション維持が難しい..." 
                },
                { 
                  icon: "🌀", 
                  title: "何からやるべきか迷う", 
                  desc: "単語、文法、構成... 自分の弱点に合った効率的な学習法がわからない..." 
                },
              ].map((item, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* バリュープロポジション */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 -skew-y-3 origin-top-left transform scale-110 z-0" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Features</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-6">
                スコアアップに必要な<br/>すべてをここに。
              </h2>
              <p className="text-slate-600 text-lg">
                テクノロジーと学習科学に基づいた機能で、あなたの学習を強力にバックアップします。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-slate-100 flex flex-col md:flex-row gap-6 items-start hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl">🤖</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">AIによる即座のフィードバック</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    提出後数秒で、予想バンドスコアと詳細な改善提案を受け取れます。文法ミスだけでなく、論理構成や語彙の適切さまで分析します。
                  </p>
                  <ul className="space-y-2">
                    {['バンドスコア自動評価', '文法・語彙の添削', '論理構成のアドバイス'].map(item => (
                      <li key={item} className="flex items-center text-sm text-slate-700 font-medium">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-slate-100 flex flex-col md:flex-row gap-6 items-start hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">📈</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">進捗の可視化と分析</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    学習履歴をグラフ化し、成長を一目で確認。苦手なトピックや弱点タグ（冠詞、時制など）を自動抽出し、効率的な復習を促します。
                  </p>
                  <ul className="space-y-2">
                    {['スコア推移グラフ', '弱点タグ分析', '学習履歴管理'].map(item => (
                      <li key={item} className="flex items-center text-sm text-slate-700 font-medium">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-slate-100 flex flex-col md:flex-row gap-6 items-start hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl">📝</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">段階的な学習サポート</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    あなたのレベル（初級・中級・上級）に合わせたタスクを提供。PREP法を用いたガイド付きライティングで、論理的な文章力を養います。
                  </p>
                  <ul className="space-y-2">
                    {['レベル別タスク', 'PREPガイド機能', '穴埋めトレーニング'].map(item => (
                      <li key={item} className="flex items-center text-sm text-slate-700 font-medium">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-slate-100 flex flex-col md:flex-row gap-6 items-start hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl">📖</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">4技能別 単語トレーニング</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    IELTS頻出の1200語を収録。Reading/Listening/Writing/Speakingの技能別に最適化された単語セットで、実践的な語彙力を強化します。
                  </p>
                  <ul className="space-y-2">
                    {['技能・難易度別リスト', 'クイズ形式の練習', '1200語データベース'].map(item => (
                      <li key={item} className="flex items-center text-sm text-slate-700 font-medium">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 使い方ステップ */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">学習の進め方</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { step: 1, title: 'アカウント登録', text: 'レベルを選択し、学習を開始します。' },
                { step: 2, title: 'タスク選択', text: '今の自分に最適な問題を選びます。' },
                { step: 3, title: 'ライティング', text: 'ガイドに従ってエッセイを作成します。' },
                { step: 4, title: 'AI分析', text: '即座にスコアと修正案を確認します。' },
                { step: 5, title: '進捗確認', text: 'グラフで成長と弱点を把握します。' },
                { step: 6, title: '単語学習', text: 'スキマ時間で語彙力を強化します。' },
              ].map((item) => (
                <div key={item.step} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-blue-300 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl group-hover:opacity-20 transition-opacity text-blue-900">
                    {item.step}
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold mb-4 shadow-md shadow-blue-200">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                今すぐ無料で始める
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-xl font-bold text-slate-800">IELTS Training</div>
            <div className="text-sm text-slate-500">
              Empowering learners to achieve their target scores.
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} IELTS Training. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
