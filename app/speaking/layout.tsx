import type { Metadata } from 'next';

const TITLE = 'IELTS Speaking対策 | AI面接でPart 1-3を練習';
const DESCRIPTION =
  'IELTS Speaking の Part 1-3 を AI interviewer で練習できる Speaking hub。Cue Card と band-style feedback を使って、本番に近い準備ができます。';

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
