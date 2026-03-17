import type { Metadata } from 'next';
import { getSpeakingTopicBySlug } from '@/lib/content/speakingTopics';

type Props = { params: { slug: string }; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getSpeakingTopicBySlug(params.slug);

  if (!topic) {
    return { title: '\u30c8\u30d4\u30c3\u30af\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093' };
  }

  const title = `IELTS Speaking \u30c8\u30d4\u30c3\u30af | ${topic.titleJa}\uff08${topic.titleEn}\uff09`;
  const description = `IELTS Speaking \u306e\u300c${topic.titleJa}\uff08${topic.titleEn}\uff09\u300d\u3067\u3001Part 1-3 \u306e\u8cea\u554f\u4f8b\u3001Cue Card\u3001AI \u9762\u63a5\u3078\u306e\u5c0e\u7dda\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002`;
  const canonical = `/speaking/topics/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

export default function TopicLayout({ children }: Props) {
  return <>{children}</>;
}
