'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

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
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/home" className="text-xl font-bold text-primary hover:text-primary-hover transition-colors duration-200">
              IELTS Training
            </Link>
            {/* デスクトップナビゲーション */}
            <nav className="hidden md:flex gap-4">
              <Link href="/home" className="text-text-muted hover:text-text transition-colors duration-200">
                Home
              </Link>
              <Link href="/progress" className="text-text-muted hover:text-text transition-colors duration-200">
                Progress
              </Link>
              <Link href="/vocab" className="text-text-muted hover:text-text transition-colors duration-200">
                Vocab
              </Link>
              <Link 
                href="https://ieltsconsult.netlify.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text transition-colors duration-200"
              >
                Blog
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* デスクトップユーザー情報 */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-slate-400">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="rounded bg-slate-700/50 px-3 py-1 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-500 transition-colors"
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
                className="p-2 text-text-muted hover:text-text focus:outline-none transition-colors duration-200"
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
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-3">
              <Link
                href="/home"
                onClick={() => setMenuOpen(false)}
                className="text-text-muted hover:text-text py-2 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/progress"
                onClick={() => setMenuOpen(false)}
                className="text-text-muted hover:text-text py-2 transition-colors duration-200"
              >
                Progress
              </Link>
              <Link
                href="/vocab"
                onClick={() => setMenuOpen(false)}
                className="text-text-muted hover:text-text py-2 transition-colors duration-200"
              >
                Vocab
              </Link>
              <Link
                href="https://ieltsconsult.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="text-text-muted hover:text-text py-2 transition-colors duration-200"
              >
                Blog
              </Link>
              {user ? (
                <>
                  <div className="pt-2 border-t border-border mt-2">
                    <div className="text-sm text-text-muted py-2">{user.email}</div>
                    <button
                      onClick={handleLogout}
                      className="rounded bg-surface-2 border border-border px-3 py-2 text-sm text-text hover:bg-surface w-full text-left transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-border mt-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary-hover block text-center transition-colors duration-200"
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

