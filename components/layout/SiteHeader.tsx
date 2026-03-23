'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BrandLink } from '@/components/branding/Brand';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

type SiteHeaderProps = {
  mode: 'public' | 'app';
  brandHref: string;
  navItems: readonly NavItem[];
  floating?: boolean;
  contactHref?: string;
  loginHref?: string;
  userEmail?: string | null;
  onLogout?: () => void | Promise<void>;
};

function NavLink({
  href,
  label,
  external,
  className,
  onClick,
}: NavItem & { className: string; onClick?: () => void }) {
  if (external) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}

export function SiteHeader({
  mode,
  brandHref,
  navItems,
  floating = false,
  contactHref,
  loginHref = '/login',
  userEmail,
  onLogout,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasUser = mode === 'app' && Boolean(userEmail);

  const headerClass = floating
    ? 'fixed top-0 z-50 w-full transition-all duration-300'
    : 'sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm';

  return (
    <header className={headerClass}>
      {floating ? (
        <div className="absolute inset-0 border-b border-border/60 bg-bg/85 backdrop-blur-xl" />
      ) : null}
      <div className="container relative z-10 mx-auto px-4 py-3 sm:px-6">
        <div className="flex min-h-[44px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <BrandLink
              href={brandHref}
              size={mode === 'app' ? 38 : 36}
              priority={floating}
              textClassName="text-base text-primary sm:text-lg"
              linkClassName="transition-opacity duration-200 hover:opacity-90"
            />
            <nav className="hidden flex-wrap items-center gap-3 md:flex lg:gap-5">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  className="text-text-muted transition-colors duration-200 hover:text-text"
                />
              ))}
              {contactHref ? (
                <Link
                  href={contactHref}
                  className="text-text-muted transition-colors duration-200 hover:text-text"
                >
                  お問い合わせ
                </Link>
              ) : null}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {mode === 'app' ? (
                hasUser ? (
                  <>
                    <span className="hidden text-sm text-text-muted xl:block">{userEmail}</span>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text transition-colors duration-200 hover:bg-surface"
                    >
                      ログアウト
                    </button>
                  </>
                ) : (
                  <Link
                    href={loginHref}
                    className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground transition-colors duration-200 hover:bg-primary-hover"
                  >
                    ログイン
                  </Link>
                )
              ) : (
                <Link
                  href={loginHref}
                  className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground transition-colors duration-200 hover:bg-primary-hover"
                >
                  ログイン
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition-colors duration-200 hover:text-text"
                aria-label={menuOpen ? 'ナビゲーションメニューを閉じる' : 'ナビゲーションメニューを開く'}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
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

        {menuOpen ? (
          <nav className="mt-3 rounded-2xl border border-border bg-surface/95 p-4 shadow-theme backdrop-blur-sm md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text"
                />
              ))}
              {contactHref ? (
                <Link
                  href={contactHref}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text"
                >
                  お問い合わせ
                </Link>
              ) : null}

              <div className="mt-2 border-t border-border pt-3">
                {mode === 'app' && hasUser ? (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-text-muted">
                      {userEmail}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        void onLogout?.();
                      }}
                      className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-left text-sm text-text transition-colors duration-200 hover:bg-surface"
                    >
                      ログアウト
                    </button>
                  </div>
                ) : (
                  <Link
                    href={loginHref}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg bg-primary px-3 py-2 text-center text-sm text-primary-foreground transition-colors duration-200 hover:bg-primary-hover"
                  >
                    ログイン
                  </Link>
                )}
              </div>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

