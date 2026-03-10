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
  { slug: 'work-life-balance', title: 'Work–Life Balance' },
  { slug: 'climate-change', title: 'Climate Change' },
  { slug: 'globalisation', title: 'Globalisation' },
  { slug: 'youth-age', title: 'Youth & Age' },
  { slug: 'family-children', title: 'Family & Children' },
  { slug: 'food-diet', title: 'Food & Diet' },
  { slug: 'sports', title: 'Sports' },
  { slug: 'arts', title: 'Arts' },
  { slug: 'tourism', title: 'Tourism' },
  { slug: 'housing', title: 'Housing' },
  { slug: 'equality-rights', title: 'Equality & Rights' },
  { slug: 'immigration', title: 'Immigration' },
  { slug: 'fashion', title: 'Fashion' },
  { slug: 'money-finance', title: 'Money & Finance' },
  { slug: 'space-exploration', title: 'Space Exploration' },
  { slug: 'animals-wildlife', title: 'Animals & Wildlife' },
  { slug: 'languages', title: 'Languages' },
  { slug: 'social-media', title: 'Social Media' },
  { slug: 'data-privacy', title: 'Data Privacy' },
  { slug: 'automation-jobs', title: 'Automation & Jobs' },
  { slug: 'renewable-energy', title: 'Renewable Energy' },
  { slug: 'waste-recycling', title: 'Waste & Recycling' },
  { slug: 'aging-population', title: 'Aging Population' },
  { slug: 'urbanisation', title: 'Urbanisation' },
  { slug: 'rural-life', title: 'Rural Life' },
  { slug: 'international-aid', title: 'International Aid' },
  { slug: 'consumerism', title: 'Consumerism' },
  { slug: 'advertising-ethics', title: 'Advertising Ethics' },
  { slug: 'censorship', title: 'Censorship' },
  { slug: 'scientific-research', title: 'Scientific Research' },
  { slug: 'museums', title: 'Museums' },
  { slug: 'music', title: 'Music' },
  { slug: 'films-cinema', title: 'Films & Cinema' },
  { slug: 'books-reading', title: 'Books & Reading' },
  { slug: 'gap-year', title: 'Gap Year' },
  { slug: 'online-learning', title: 'Online Learning' },
  { slug: 'nuclear-energy', title: 'Nuclear Energy' },
  { slug: 'water-shortage', title: 'Water Shortage' },
  { slug: 'deforestation', title: 'Deforestation' },
  { slug: 'vegetarianism', title: 'Vegetarianism' },
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
