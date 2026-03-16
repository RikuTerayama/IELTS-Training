import type { Metadata } from 'next';

const TITLE = 'IELTS Reading対策 | 語彙・設問タイプ練習';
const DESCRIPTION =
  'IELTS Reading の語彙、言い換え、設問タイプ別の練習ができる hub。paraphrase、matching headings、TFNG などを日本語ベースで整理して学べます。';

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
