'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialLevel, setInitialLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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

        // プロファイル作成
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email,
              initial_level: initialLevel,
            })
            .select()
            .single();

          if (profileError) {
            // 既に存在する場合は無視（ON CONFLICT相当）
            if (profileError.code === '23505') {
              console.log('[LoginPage] Profile already exists, continuing...');
            } else {
              console.error('[LoginPage] Profile creation error:', profileError);
              throw profileError;
            }
          }
        }

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
          window.location.href = '/home';
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
        
        // 直接 /home にリダイレクト（middlewareが認証状態を確認）
        console.log('Redirecting to /home...');
        
        // window.location.hrefを使用（フルページリロード）
        window.location.href = '/home';
        
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          IELTS Training
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メール
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {isSignUp && (
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                初期レベル
              </label>
              <select
                id="level"
                value={initialLevel}
                onChange={(e) => setInitialLevel(e.target.value as any)}
                autoComplete="off"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="beginner">初級</option>
                <option value="intermediate">中級</option>
                <option value="advanced">上級</option>
              </select>
            </div>
          )}
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {signUpSuccess && (
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
              <p className="mb-2">サインアップが完了しました！</p>
              <p className="mb-2">確認メールを送信しました。メールボックス（スパムフォルダも含む）を確認してください。</p>
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendingEmail}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                {resendingEmail ? '送信中...' : '確認メールを再送信'}
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={loading || signUpSuccess}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? '処理中...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm text-blue-600 hover:text-blue-700"
          >
            {isSignUp ? '既にアカウントをお持ちですか？' : '新規登録'}
          </button>
        </form>
      </div>
    </div>
  );
}

