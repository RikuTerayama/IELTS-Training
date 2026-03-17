import type { Metadata } from 'next';

const TITLE = 'IELTS Speaking 対策 | AI 面接で Part 1-3 を練習';
const DESCRIPTION =
  'IELTS Speaking の Part 1-3 を AI 面接で練習し、Cue Card とフィードバックで定着させる Meridian の Speaking ページです。';

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
