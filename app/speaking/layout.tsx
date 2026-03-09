import type { Metadata } from 'next';

const TITLE = 'IELTS Speaking Practice | AI Interviewer (Part 1–3)';
const DESCRIPTION =
  'Practice IELTS Speaking with an AI interviewer: Part 1, Part 2 cue cards, and Part 3 discussion. Get instant feedback and band-style scores.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/speaking',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/speaking',
  },
};

export default function SpeakingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
