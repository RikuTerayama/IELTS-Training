'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn, buttonSecondary, buttonPrimary } from '@/lib/ui/theme';
import { BLOG_OFFICIAL_URL, BLOG_NOTE_URL } from '@/lib/constants/contact';

/** ナビ項目（正規導線はクエリ無し）。/vocab は使わず /training/vocab が正。 */
const NAV_INPUT = [
  { label: 'Vocab', href: '/training/vocab', enabled: true },
  { label: 'Idiom', href: '/training/idiom', enabled: true },
  { label: 'Bank', href: '/training/lexicon', enabled: true },
] as const;

const NAV_OUTPUT = [
  { label: 'Speaking', href: '/training/speaking', enabled: true },
  { label: 'Writing', href: '/task/select?task_type=Task%202', enabled: true },
] as const;

const NAV_BLOG: { label: string; href: string; enabled: boolean }[] = [
  { label: 'Official Blog', href: BLOG_OFFICIAL_URL, enabled: true },
  { label: 'Note', href: BLOG_NOTE_URL || '#', enabled: !!BLOG_NOTE_URL },
];

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<'input' | 'output' | 'blog' | null>(null);
  const [desktopOpenGroup, setDesktopOpenGroup] = useState<'input' | 'output' | 'blog' | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    setMenuOpen(false);
  };

  const toggleMobileGroup = (g: 'input' | 'output' | 'blog') => {
    setOpenGroup((prev) => (prev === g ? null : g));
  };

  const toggleDesktopGroup = (g: 'input' | 'output' | 'blog') => {
    setDesktopOpenGroup((prev) => (prev === g ? null : g));
  };

  return (
    <header className="sticky top-0 w-full z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-xl border-b border-border/50" />
      <div className="container mx-auto px-6 h-16 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-text">
              IELTS Training
            </span>
          </Link>
          {/* デスクトップナビ: Input / Output / Blog ドロップダウン */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/home" className="text-ui font-medium text-text-muted hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded">
              Home
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDesktopGroup('input')}
                className={cn(
                  'text-sm font-medium px-2 py-1 rounded transition-colors duration-200',
                  desktopOpenGroup === 'input' ? 'text-primary bg-selectable-selected-bg' : 'text-text-muted hover:text-indigo-600'
                )}
              >
                Input
              </button>
              {desktopOpenGroup === 'input' && (
                <div className="absolute top-full left-0 mt-1 py-1 bg-surface rounded-lg border border-border shadow-lg min-w-[140px] z-50">
                  {NAV_INPUT.map((item) =>
                    item.enabled ? (
                      <Link key={item.label} href={item.href} className="block px-3 py-2 text-sm text-text hover:bg-surface-2 hover:text-indigo-600">
                        {item.label}
                      </Link>
                    ) : (
                      <span key={item.label} className="block px-3 py-2 text-sm text-slate-400 cursor-not-allowed opacity-70">
                        {item.label} <span className="text-xs">Coming soon</span>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDesktopGroup('output')}
                className={cn(
                  'text-sm font-medium px-2 py-1 rounded transition-colors duration-200',
                  desktopOpenGroup === 'output' ? 'text-primary bg-selectable-selected-bg' : 'text-text-muted hover:text-indigo-600'
                )}
              >
                Output
              </button>
              {desktopOpenGroup === 'output' && (
                <div className="absolute top-full left-0 mt-1 py-1 bg-surface rounded-lg border border-border shadow-lg min-w-[140px] z-50">
                  {NAV_OUTPUT.map((item) =>
                    item.enabled ? (
                      <Link key={item.label} href={item.href} className="block px-3 py-2 text-sm text-text hover:bg-surface-2 hover:text-indigo-600">
                        {item.label}
                      </Link>
                    ) : (
                      <span key={item.label} className="block px-3 py-2 text-sm text-slate-400 cursor-not-allowed opacity-70">
                        {item.label} <span className="text-xs">Coming soon</span>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDesktopGroup('blog')}
                className={cn(
                  'text-sm font-medium px-2 py-1 rounded transition-colors duration-200',
                  desktopOpenGroup === 'blog' ? 'text-primary bg-selectable-selected-bg' : 'text-text-muted hover:text-indigo-600'
                )}
              >
                Blog
              </button>
              {desktopOpenGroup === 'blog' && (
                <div className="absolute top-full left-0 mt-1 py-1 bg-surface rounded-lg border border-border shadow-lg min-w-[160px] z-50">
                  {NAV_BLOG.map((item) =>
                    item.enabled ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="block px-3 py-2 text-sm text-text hover:bg-surface-2 hover:text-indigo-600"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span key={item.label} className="block px-3 py-2 text-sm text-slate-400 cursor-not-allowed opacity-70">
                        {item.label} <span className="text-xs">Coming soon</span>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
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
                <span className="text-sm text-text-muted truncate max-w-[180px]">{user.email}</span>
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
      {/* モバイルメニュー（Input / Output / Blog アコーディオン） */}
      {menuOpen && (
        <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 px-6">
          <div className="flex flex-col gap-1">
            <Link href="/home" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-text-muted hover:text-indigo-600 py-2 transition-colors duration-200">
              Home
            </Link>
            <div className="border-b border-border pb-2">
              <button type="button" onClick={() => toggleMobileGroup('input')} className="w-full text-left text-sm font-medium text-text py-2 flex items-center justify-between">
                Input
                <span className="text-text-muted">{openGroup === 'input' ? '−' : '+'}</span>
              </button>
              {openGroup === 'input' && (
                <div className="pl-3 space-y-1">
                  {NAV_INPUT.map((item) =>
                    item.enabled ? (
                      <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="block py-1.5 text-sm text-text-muted hover:text-indigo-600">
                        {item.label}
                      </Link>
                    ) : (
                      <span key={item.label} className="block py-1.5 text-sm text-slate-400"> {item.label} <span className="text-xs">Coming soon</span></span>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="border-b border-border pb-2">
              <button type="button" onClick={() => toggleMobileGroup('output')} className="w-full text-left text-sm font-medium text-text py-2 flex items-center justify-between">
                Output
                <span className="text-text-muted">{openGroup === 'output' ? '−' : '+'}</span>
              </button>
              {openGroup === 'output' && (
                <div className="pl-3 space-y-1">
                  {NAV_OUTPUT.map((item) =>
                    item.enabled ? (
                      <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="block py-1.5 text-sm text-text-muted hover:text-indigo-600">
                        {item.label}
                      </Link>
                    ) : (
                      <span key={item.label} className="block py-1.5 text-sm text-slate-400"> {item.label} <span className="text-xs">Coming soon</span></span>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="border-b border-border pb-2">
              <button type="button" onClick={() => toggleMobileGroup('blog')} className="w-full text-left text-sm font-medium text-text py-2 flex items-center justify-between">
                Blog
                <span className="text-text-muted">{openGroup === 'blog' ? '−' : '+'}</span>
              </button>
              {openGroup === 'blog' && (
                <div className="pl-3 space-y-1">
                  {NAV_BLOG.map((item) =>
                    item.enabled ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={() => setMenuOpen(false)}
                        className="block py-1.5 text-sm text-text-muted hover:text-indigo-600"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span key={item.label} className="block py-1.5 text-sm text-slate-400"> {item.label} <span className="text-xs">Coming soon</span></span>
                    )
                  )}
                </div>
              )}
            </div>
            {user ? (
              <>
                <div className="pt-2 border-t border-border mt-2">
                  <div className="text-sm text-text-muted truncate max-w-[240px] py-2">{user.email}</div>
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
    </header>
  );
}
