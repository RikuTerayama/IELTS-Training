import type { Metadata } from 'next';
import { getWritingTask2Topic } from '@/lib/content/writingTopics';

type Props = { params: { slug: string }; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getWritingTask2Topic(params.slug);

  if (!topic) {
    return { title: '\u30c8\u30d4\u30c3\u30af\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093' };
  }

  const title = `IELTS Writing Task 2 \u30c8\u30d4\u30c3\u30af | ${topic.titleJa}\uff08${topic.titleEn}\uff09`;
  const description = `IELTS Writing Task 2 \u306e\u300c${topic.titleJa}\uff08${topic.titleEn}\uff09\u300d\u3067\u3001\u4f8b\u984c\u3001\u69cb\u6210\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u3001Practice / Exam Mode \u3078\u306e\u5c0e\u7dda\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002`;
  const canonical = `/writing/task2/topics/${params.slug}`;

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

export default function Task2TopicLayout({ children }: Props) {
  return <>{children}</>;
}
