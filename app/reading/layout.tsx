import type { Metadata } from 'next';

const TITLE = 'IELTS Reading Practice | Vocabulary & Question Types';
const DESCRIPTION =
  'Build reading skills with Academic Reading vocabulary and question-type practice. Paraphrase, matching headings, and more. Full passage practice coming next.';

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
