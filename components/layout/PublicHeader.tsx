'use client';

import { PUBLIC_NAV } from '@/lib/config/nav';
import { SiteHeader } from './SiteHeader';

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
  return (
    <SiteHeader
      mode="public"
      brandHref="/"
      navItems={PUBLIC_NAV}
      floating={variant === 'floating'}
      contactHref={contactHref}
      loginHref={loginHref}
    />
  );
}

