'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LandingPage() {
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

  useEffect(() => {
    // 既にログインしている場合はホームにリダイレクト
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push('/home');
      }
    });
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // サインアップ
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
            if (profileError.code === '23505') {
              // 既に存在する場合は無視
            } else {
              throw profileError;
            }
          }
        }

        // サインアップ成功（メール確認が必要な場合）
        if (data.user && !data.session) {
          setSignUpSuccess(true);
          setLoading(false);
          return;
        }

        // サインアップ成功でセッションがある場合
        if (data.session) {
          setLoading(false);
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
          throw signInError;
        }

        if (!signInData.session) {
          throw new Error('ログインに失敗しました。セッションが作成されませんでした。');
        }

        // セッションを確認
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          throw new Error('ログインに失敗しました。セッションが保存されませんでした。');
        }
        
        setLoading(false);
        
        // セッションが確実に保存されるまで待つ
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        window.location.href = '/home';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              IELTS Training
            </Link>
            <nav className="flex items-center gap-6">
              <Link 
                href="https://ieltsconsult.netlify.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左側: 紹介セクション */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              IELTS Writing
              <br />
              <span className="text-blue-600">Training Platform</span>
            </h1>
            <p className="text-lg text-gray-600">
              IELTS Writing Task 2のスキルを向上させるための包括的なトレーニングプラットフォームです。
              実践的なフィードバックと進捗追跡で、目標スコア達成をサポートします。
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">AIによる詳細なフィードバック</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">進捗の可視化と弱点分析</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">4技能別の単語練習</span>
              </div>
            </div>
          </div>

          {/* 右側: ログインフォーム */}
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
                {isSignUp ? '新規登録' : 'ログイン'}
              </h2>
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
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
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
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 IELTS Training. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
