'use client';

import Link from 'next/link';
import { BrandLink } from '@/components/branding/Brand';
import { PUBLIC_NAV } from '@/lib/config/nav';

/**
 * Public shell footer: no authenticated progress summary.
 * Logo and links only; safe for public/SEO pages.
 */
export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            {PUBLIC_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="hover:text-text transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
            <Link href="/#contact" className="hover:text-text transition-colors duration-200">
              Contact
            </Link>
          </div>
          <div>
            <BrandLink
              href="/"
              size={30}
              textClassName="text-base"
              linkClassName="transition-opacity duration-200 hover:opacity-90"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
