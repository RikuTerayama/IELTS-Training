'use client';

import { useState } from 'react';
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
  const supabase = createClient();

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
        {/* ヒーローセクション */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* 左側: 紹介セクション */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              IELTS Training Platform
            </h1>
            <p className="text-lg text-gray-600">
              IELTSのスキルを向上させるための包括的なトレーニングプラットフォーム<br />
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
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div>
                  <label htmlFor="landing-email" className="block text-sm font-medium text-gray-700">
                    メール
                  </label>
                  <input
                    id="landing-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="landing-password" className="block text-sm font-medium text-gray-700">
                    パスワード
                  </label>
                  <input
                    id="landing-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {isSignUp && (
                  <div>
                    <label htmlFor="landing-level" className="block text-sm font-medium text-gray-700">
                      初期レベル
                    </label>
                    <select
                      id="landing-level"
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

        {/* 学習者のよくある悩み */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            学習者のよくある悩み
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">😰</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">フィードバックが得られない</h3>
              <p className="text-gray-600">
                自分の書いたエッセイがどの程度のスコアなのか、どこを改善すべきか分からない
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">進捗が見えない</h3>
              <p className="text-gray-600">
                練習を続けているが、自分の成長が実感できず、モチベーションが下がる
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">効率的な学習方法が分からない</h3>
              <p className="text-gray-600">
                何を練習すれば良いか、どの単語を覚えれば良いか分からず迷っている
              </p>
            </div>
          </div>
        </section>

        {/* このサイトで提供したい価値 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            このサイトで提供したい価値
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">AIによる即座のフィードバック</h3>
              <p className="text-gray-700 mb-4">
                提出後すぐに、バンドスコアの評価と詳細なフィードバックを受け取れます。文法、語彙、論理構成など、各観点での改善点を明確に提示します。
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• バンドスコアの自動評価</li>
                <li>• 具体的な改善提案</li>
                <li>• 弱点の特定と対策</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">進捗の可視化</h3>
              <p className="text-gray-700 mb-4">
                過去の回答履歴を一覧で確認でき、自分の成長を実感できます。弱点タグの分析により、重点的に練習すべき分野が明確になります。
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• スコアの推移グラフ</li>
                <li>• 弱点タグの分析</li>
                <li>• 学習履歴の管理</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">段階的な学習サポート</h3>
              <p className="text-gray-700 mb-4">
                初級・中級・上級のレベル別に最適化されたタスクと、PREPガイドによる学習支援で、無理なくステップアップできます。
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• レベル別タスクの提供</li>
                <li>• PREPガイドによる学習支援</li>
                <li>• 穴埋め練習（初級・中級）</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">4技能別の単語練習</h3>
              <p className="text-gray-700 mb-4">
                Reading、Listening、Writing、Speakingの各技能に特化した単語を、難易度別に練習できます。IELTSに頻出する重要単語を効率的に習得できます。
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 技能別・難易度別の単語分類</li>
                <li>• 選択式クイズ形式</li>
                <li>• 1200語の充実した語彙データベース</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 使い方 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            使い方
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">アカウント作成</h3>
                  <p className="text-gray-600">
                    メールアドレスとパスワードでアカウントを作成します。初期レベル（初級・中級・上級）を選択してください。
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">タスクを選択</h3>
                  <p className="text-gray-600">
                    ホーム画面から推奨タスクを選択するか、新しいタスクを作成します。自分のレベルに合ったタスクを選びましょう。
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">エッセイを書く</h3>
                  <p className="text-gray-600">
                    タスクの指示に従ってエッセイを書きます。初級・中級の方は、PREPガイドを参考にしながら日本語で骨組みを作成し、その後英語で完成させます。
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">フィードバックを確認</h3>
                  <p className="text-gray-600">
                    提出後、AIによる詳細なフィードバックとバンドスコアの評価を受け取ります。改善点を確認し、必要に応じて書き直しを行います。
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">進捗を確認</h3>
                  <p className="text-gray-600">
                    Progressページで過去の回答履歴を確認し、自分の成長を実感します。弱点タグを確認して、重点的に練習すべき分野を把握します。
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">単語練習</h3>
                  <p className="text-gray-600">
                    Vocabページで、4技能別・難易度別の単語を練習します。定期的に練習することで、IELTSに必要な語彙力を効率的に向上させます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 IELTS Training. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
