import type { Metadata } from 'next';

const TITLE = 'IELTS 単語学習 | 4技能別の公開ハブ';
const DESCRIPTION =
  'Meridian の単語学習を Reading / Listening / Speaking / Writing ごとに整理した公開ハブです。技能別の進め方を確認して、実際の練習は /training/vocab で進められます。';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/vocab',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/vocab',
  },
};

export default function VocabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
