'use client';

import { SiteFooter } from './SiteFooter';

type PublicFooterProps = {
  contactHref?: string;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfService?: () => void;
};

export function PublicFooter({
  contactHref,
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}: PublicFooterProps) {
  return (
    <SiteFooter
      brandHref="/"
      contactHref={contactHref}
      onOpenPrivacyPolicy={onOpenPrivacyPolicy}
      onOpenTermsOfService={onOpenTermsOfService}
    />
  );
}

