'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { PUBLIC_NAV } from '@/lib/config/nav';

type PublicHeaderProps = {
  contactHref?: string;
  loginHref?: string;
  variant?: 'sticky' | 'floating';
};

export function PublicHeader({
  contactHref,
  loginHref = '/login',
  variant = 'sticky',
}: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isFloating = variant === 'floating';

  return (
    <header
      className={
        isFloating
          ? 'fixed top-0 z-50 w-full transition-all duration-300'
          : 'sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm'
      }
    >
      {isFloating ? (
        <div className="absolute inset-0 border-b border-border/50 bg-bg/80 backdrop-blur-xl" />
      ) : null}
      <div className={`container mx-auto relative z-10 ${isFloating ? 'px-6' : 'px-4 py-3'}`}>
        <div className={`flex items-center justify-between ${isFloating ? 'h-16' : ''}`}>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl font-bold text-primary hover:text-primary-hover transition-colors duration-200"
            >
              IELTS Training
            </Link>
            <nav className="hidden md:flex gap-4">
              {PUBLIC_NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-text-muted hover:text-text transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
              {contactHref ? (
                <Link
                  href={contactHref}
                  className="text-text-muted hover:text-text transition-colors duration-200"
                >
                  お問い合わせ
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <div className="hidden md:block">
              <Link
                href={loginHref}
                className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary-hover transition-colors duration-200"
              >
                ログイン
              </Link>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-text-muted hover:text-text transition-colors duration-200"
                aria-label={menuOpen ? 'ナビゲーションメニューを閉じる' : 'ナビゲーションメニューを開く'}
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
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-3">
              {PUBLIC_NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-muted hover:text-text py-2 transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
              {contactHref ? (
                <Link
                  href={contactHref}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-muted hover:text-text py-2 transition-colors duration-200"
                >
                  お問い合わせ
                </Link>
              ) : null}
              <div className="pt-2 border-t border-border mt-2">
                <Link
                  href={loginHref}
                  onClick={() => setMenuOpen(false)}
                  className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary-hover block text-center transition-colors duration-200"
                >
                  ログイン
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
