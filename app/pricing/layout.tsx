import type { Metadata } from 'next';

const TITLE = 'Meridian Pro Pricing | Monthly & Annual Plans';
const DESCRIPTION =
  'Upgrade to Meridian Pro for unlimited Writing/Speaking AI feedback, faster practice, and full history.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
