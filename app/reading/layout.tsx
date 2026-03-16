import type { Metadata } from 'next';

const TITLE = 'IELTS Reading対策 | 設問タイプ練習と語彙強化';
const DESCRIPTION =
  'IELTS Reading の設問タイプ練習、言い換え・語彙確認、復習導線をまとめた Meridian の Reading ページです。';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/reading',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/reading',
  },
};

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
