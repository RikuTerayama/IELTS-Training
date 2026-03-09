import type { Metadata } from 'next';

const TITLE = 'IELTS Writing Practice | Task 2 AI Feedback & Exam Mode';
const DESCRIPTION =
  'Improve IELTS Writing Task 2 with AI feedback, band-style scoring, and structured PREP practice. Switch between practice and exam mode.';

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
