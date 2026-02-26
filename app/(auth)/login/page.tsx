'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // ローカルストレージからメールアドレスとパスワードを読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('ielts_training_email');
      const savedPassword = localStorage.getItem('ielts_training_password');
      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedPassword) {
        setPassword(savedPassword);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // サインアップ
        // 現在のオリジン（本番環境またはローカル）を使用してリダイレクトURLを設定
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

        // プロファイルは自動トリガーで作成される（onboarding_completed = false）
        // サインアップ成功（メール確認が必要な場合）
        if (data.user && !data.session) {
          setSignUpSuccess(true);
          setLoading(false);
          return; // メール確認が必要な場合はここで終了
        }

        // サインアップ成功でセッションがある場合（メール確認をスキップしている場合）
        if (data.session) {
          console.log('Sign up successful with session, redirecting...');
          setLoading(false);
          // セッションが確実にCookieに保存されるまで待つ
          await new Promise(resolve => setTimeout(resolve, 300));
          window.location.href = '/onboarding';
          return;
        }
      } else {
        // ログイン
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('Login error:', signInError);
          throw signInError;
        }

        // セッションが正しく取得できているか確認
        if (!signInData.session) {
          console.error('No session after login');
          throw new Error('ログインに失敗しました。セッションが作成されませんでした。');
        }

        // セッションを確認
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          console.error('Session not found after login');
          throw new Error('ログインに失敗しました。セッションが保存されませんでした。');
        }

        console.log('Login successful, session:', currentSession.user.email);
        
        // ログイン成功時にメールアドレスとパスワードをローカルストレージに保存
        if (typeof window !== 'undefined') {
          localStorage.setItem('ielts_training_email', email);
          localStorage.setItem('ielts_training_password', password);
        }
        
        // リダイレクト前にloadingをfalseに設定
        setLoading(false);
        
        // セッションを明示的に保存（@supabase/ssrが自動的にCookieに保存）
        // セッションが確実に保存されるまで待つ
        console.log('Waiting for session to be saved to cookies...');
        
        // セッションが確実にCookieに保存されるまで待つ（最大5秒）
        let sessionSaved = false;
        const maxAttempts = 50;
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // セッションを再確認
          const { data: { session: checkSession } } = await supabase.auth.getSession();
          if (checkSession) {
            // Cookieが保存されているか確認（document.cookieで確認可能な場合）
            try {
              const cookieString = document.cookie || '';
              const hasAuthCookie = cookieString.includes('sb-') && cookieString.includes('auth-token');
              if (hasAuthCookie || i >= 10) { // 10回試行後は強制的に続行
                sessionSaved = true;
                console.log(`Session confirmed (attempt ${i + 1}), redirecting...`);
                break;
              }
            } catch (error) {
              // Cookie確認でエラーが発生しても、セッションがあれば続行
              if (i >= 10) {
                sessionSaved = true;
                console.log(`Session exists, proceeding with redirect (attempt ${i + 1})...`);
                break;
              }
            }
          }
        }
        
        if (!sessionSaved) {
          console.warn('Session confirmation timeout, but redirecting anyway...');
        }
        
        // 追加の待機時間（Cookieが確実に保存されるまで）
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 目的ヒアリング完了状況を確認
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', signInData.user.id)
          .single();

        console.log('Profile onboarding status:', profile?.onboarding_completed);
        
        // 目的ヒアリング未完了の場合は目的ヒアリングページへ
        if (profile && !profile.onboarding_completed) {
          console.log('Redirecting to /onboarding...');
          window.location.href = '/onboarding';
        } else {
          console.log('Redirecting to /home...');
          window.location.href = '/home';
        }
        
        // リダイレクト後は処理を終了（この行には到達しないはず）
        return;
      }
    } catch (err) {
      console.error('Auth error:', err);
      // エラーメッセージを日本語で表示
      let errorMessage = 'An error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
        // Supabaseのエラーメッセージを日本語に変換
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

  // 確認メールを再送信
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
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] text-slate-900 font-sans relative overflow-hidden">
      {/* 背景装飾（LandingPageスタイル） */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-50/60 rounded-[100%] blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-blue-50/40 rounded-[100%] blur-3xl opacity-60" />
      </div>

      {/* ログインフォームカード */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-lg">
          {/* ロゴとタイトル */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              IELTS Training
            </h1>
            <p className="text-sm text-slate-500">
              {isSignUp ? '新規アカウントを作成' : 'アカウントにログイン'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="example@email.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-900">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">{error}</div>
                </div>
              </div>
            )}
            {signUpSuccess && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
                <div className="flex items-start gap-2 mb-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">サインアップが完了しました！</p>
                    <p className="mb-2">確認メールを送信しました。メールボックス（スパムフォルダも含む）を確認してください。</p>
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={resendingEmail}
                      className="text-emerald-700 hover:text-emerald-900 underline font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendingEmail ? '送信中...' : '確認メールを再送信'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || signUpSuccess}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {loading ? '処理中...' : isSignUp ? 'Sign Up' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
            >
              {isSignUp ? '既にアカウントをお持ちですか？' : '新規登録'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

