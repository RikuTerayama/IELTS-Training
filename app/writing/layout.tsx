import type { Metadata } from 'next';

const TITLE = 'IELTS Writing対策 | Task 2 練習と AI フィードバック';
const DESCRIPTION =
  'IELTS Writing Task 2 の Practice / Exam Mode と AI フィードバックを使える Meridian の Writing 対策ページです。';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/writing',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/writing',
  },
};

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
