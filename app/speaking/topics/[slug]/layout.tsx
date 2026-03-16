import type { Metadata } from 'next';

const speakingTopics = [
  { slug: 'work-study', title: 'Work & Study', apiTopic: 'work_study' },
  { slug: 'hometown', title: 'Hometown', apiTopic: 'hometown' },
  { slug: 'free-time', title: 'Free Time', apiTopic: 'free_time' },
  { slug: 'travel', title: 'Travel', apiTopic: 'travel' },
  { slug: 'technology', title: 'Technology', apiTopic: 'technology' },
] as const;

type Props = { params: { slug: string }; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const topic = speakingTopics.find((t) => t.slug === slug);
  if (!topic) {
    return { title: 'トピックが見つかりません' };
  }
  const title = `IELTS Speaking ${topic.title}対策 | Part 1-3練習とAIフィードバック`;
  const description = `IELTS Speaking の「${topic.title}」トピックに特化した Part 1-3 練習ページ。Cue Card と AI feedback を使って本番に近い対策ができます。`;
  const canonical = `/speaking/topics/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default function TopicLayout({ children }: Props) {
  return <>{children}</>;
}
