'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/home" className="text-xl font-bold text-blue-600">
              IELTS Training
            </Link>
            {/* デスクトップナビゲーション */}
            <nav className="hidden md:flex gap-4">
              <Link href="/home" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link href="/progress" className="text-gray-700 hover:text-blue-600">
                Progress
              </Link>
              <Link href="/vocab" className="text-gray-700 hover:text-blue-600">
                Vocab
              </Link>
              <Link 
                href="https://ieltsconsult.netlify.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600"
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
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
            </div>
            {/* ハンバーガーメニューボタン（モバイル） */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
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
        {/* モバイルメニュー */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-3">
              <Link
                href="/home"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 py-2"
              >
                Home
              </Link>
              <Link
                href="/progress"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 py-2"
              >
                Progress
              </Link>
              <Link
                href="/vocab"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 py-2"
              >
                Vocab
              </Link>
              <Link
                href="https://ieltsconsult.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 py-2"
              >
                Blog
              </Link>
              {user ? (
                <>
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="text-sm text-gray-600 py-2">{user.email}</div>
                    <button
                      onClick={handleLogout}
                      className="rounded bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 block text-center"
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

