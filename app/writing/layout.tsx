import type { Metadata } from 'next';

const TITLE = 'IELTS Writing対策 | Task 2 AI添削・Practice・Exam Mode';
const DESCRIPTION =
  'IELTS Writing Task 2 の Practice、Exam Mode、AI添削をまとめて使える Writing hub。PREP で整理してから書く練習と、本番想定の演習を切り替えられます。';

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
