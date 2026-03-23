import type { Metadata } from 'next';

const TITLE = 'IELTS Listening | 公開ハブと今後の学習導線';
const DESCRIPTION =
  'Meridian の Listening 公開ハブです。現在使えるインプット導線と、順次公開予定の Listening 学習の全体像を確認できます。';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/listening',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/listening',
  },
};

export default function ListeningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

