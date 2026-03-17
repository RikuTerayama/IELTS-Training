import type { Metadata } from 'next';

const TITLE = 'Meridian 料金 | Pro プランと支払い設定';
const DESCRIPTION =
  'Meridian Pro の料金、支払い間隔、利用できる機能を確認できる料金ページです。';

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
