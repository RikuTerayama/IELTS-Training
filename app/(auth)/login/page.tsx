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
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="w-full max-w-md rounded-lg bg-surface border border-border p-8 shadow-theme-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-text">
          IELTS Training
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text">
              メール
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder="example@email.com"
              className="mt-1 block w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-gray-900 placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text">
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
              className="mt-1 block w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-gray-900 placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
          {error && (
            <div className="rounded-md bg-danger/10 border border-danger/20 p-3 text-sm text-danger">
              {error}
            </div>
          )}
          {signUpSuccess && (
            <div className="rounded-md bg-success-bg/50 border border-success-border/50 p-3 text-sm text-success">
              <p className="mb-2">サインアップが完了しました！</p>
              <p className="mb-2">確認メールを送信しました。メールボックス（スパムフォルダも含む）を確認してください。</p>
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendingEmail}
                className="text-link hover:text-link-hover underline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendingEmail ? '送信中...' : '確認メールを再送信'}
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={loading || signUpSuccess}
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary-hover disabled:bg-text-muted disabled:cursor-not-allowed transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {loading ? '処理中...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm text-link hover:text-link-hover transition-colors duration-200"
          >
            {isSignUp ? '既にアカウントをお持ちですか？' : '新規登録'}
          </button>
        </form>
      </div>
    </div>
  );
}

