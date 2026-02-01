'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn, buttonSecondary, buttonPrimary } from '@/lib/ui/theme';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50" />
      <div className="container mx-auto px-6 h-16 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              IELTS Training
            </span>
          </Link>
            {/* デスクトップナビゲーション */}
            <nav className="hidden md:flex gap-6">
              <Link href="/home" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                Home
              </Link>
              {/* Progressへのリンクは非表示（Step0: 依存を断つ） */}
              {/* <Link href="/progress" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                Progress
              </Link> */}
              <Link href="/vocab" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                Vocab
              </Link>
              <Link 
                href="https://ieltsconsult.netlify.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200"
              >
                Blog
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* デスクトップテーマトグル */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            {/* デスクトップユーザー情報 */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-slate-500">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className={cn('px-4 py-2 text-sm', buttonSecondary)}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={cn('px-4 py-2 text-sm', buttonPrimary)}
                >
                  Login
                </Link>
              )}
            </div>
            {/* ハンバーガーメニューボタン（モバイル） */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-slate-500 hover:text-slate-900 focus:outline-none transition-colors duration-200"
                aria-label="メニューを開く"
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
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              </button>
            </div>
          </div>
        </div>
        {/* モバイルメニュー */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <div className="flex flex-col gap-3">
              <Link
                href="/home"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 py-2 transition-colors duration-200"
              >
                Home
              </Link>
              {/* Progressへのリンクは非表示（Step0: 依存を断つ） */}
              {/* <Link
                href="/progress"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 py-2 transition-colors duration-200"
              >
                Progress
              </Link> */}
              <Link
                href="/vocab"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 py-2 transition-colors duration-200"
              >
                Vocab
              </Link>
              <Link
                href="https://ieltsconsult.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 py-2 transition-colors duration-200"
              >
                Blog
              </Link>
              {user ? (
                <>
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <div className="text-sm text-slate-500 py-2">{user.email}</div>
                    <button
                      onClick={handleLogout}
                      className={cn('w-full text-left', buttonSecondary)}
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className={cn('block text-center', buttonPrimary)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

