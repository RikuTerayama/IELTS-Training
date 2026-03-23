'use client';

import Link from 'next/link';
import { BrandLink } from '@/components/branding/Brand';
import { BLOG_NOTE_URL, BLOG_OFFICIAL_URL } from '@/lib/constants/contact';
import { PUBLIC_NAV } from '@/lib/config/nav';
import { cn, helperText, subsectionTitle } from '@/lib/ui/theme';

type SiteFooterProps = {
  brandHref?: string;
  contactHref?: string;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfService?: () => void;
};

export function SiteFooter({
  brandHref = '/',
  contactHref = '/#contact',
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/50 py-12 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <BrandLink href={brandHref} size={34} textClassName="text-lg" />
            <p className={helperText}>
              Meridian は、次の一手までつながる IELTS 学習アプリです。Reading / Listening / Writing / Speaking を、
              見返しまでつながる流れで続けられます。
            </p>
          </div>

          <div>
            <h2 className={cn(subsectionTitle, 'mb-3 text-card-title')}>ナビゲーション</h2>
            <ul className="space-y-2 text-sm text-text-muted">
              {PUBLIC_NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-text">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={contactHref} className="transition-colors hover:text-text">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={cn(subsectionTitle, 'mb-3 text-card-title')}>コンテンツ</h2>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a
                  href={BLOG_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-text"
                >
                  公式ブログ
                </a>
              </li>
              <li>
                <a
                  href={BLOG_NOTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-text"
                >
                  Note
                </a>
              </li>
              {onOpenPrivacyPolicy ? (
                <li>
                  <button
                    type="button"
                    onClick={onOpenPrivacyPolicy}
                    className="transition-colors hover:text-text"
                  >
                    プライバシーポリシー
                  </button>
                </li>
              ) : null}
              {onOpenTermsOfService ? (
                <li>
                  <button
                    type="button"
                    onClick={onOpenTermsOfService}
                    className="transition-colors hover:text-text"
                  >
                    利用規約
                  </button>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-sm text-text-muted">
          &copy; {currentYear} Meridian. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

