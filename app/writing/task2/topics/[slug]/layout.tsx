import type { Metadata } from 'next';

const task2Topics = [
  { slug: 'education', title: 'Education' },
  { slug: 'technology', title: 'Technology' },
  { slug: 'environment', title: 'Environment' },
  { slug: 'health', title: 'Health' },
  { slug: 'work-career', title: 'Work & Career' },
  { slug: 'government-society', title: 'Government & Society' },
  { slug: 'media-advertising', title: 'Media & Advertising' },
  { slug: 'crime-punishment', title: 'Crime & Punishment' },
  { slug: 'culture-traditions', title: 'Culture & Traditions' },
  { slug: 'transport-urban', title: 'Transport & Urban Life' },
] as const;

type Props = { params: { slug: string }; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const topic = task2Topics.find((t) => t.slug === slug);
  if (!topic) {
    return { title: 'Topic Not Found' };
  }
  const title = `IELTS Writing Task 2: ${topic.title} | Examples, Outline & AI Feedback`;
  const description = `Practice IELTS Writing Task 2 on "${topic.title}" with example questions, a clear outline template, and AI feedback in practice or exam mode.`;
  const canonical = `/writing/task2/topics/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default function Task2TopicLayout({ children }: Props) {
  return <>{children}</>;
}
