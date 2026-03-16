import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

const speakingTopics = [
  { slug: 'work-study', title: 'Work & Study', apiTopic: 'work_study' },
  { slug: 'hometown', title: 'Hometown', apiTopic: 'hometown' },
  { slug: 'free-time', title: 'Free Time', apiTopic: 'free_time' },
  { slug: 'travel', title: 'Travel', apiTopic: 'travel' },
  { slug: 'technology', title: 'Technology', apiTopic: 'technology' },
] as const;

type Slug = (typeof speakingTopics)[number]['slug'];

const SAMPLE_QUESTIONS: Record<Slug, { part1: string; part2: string; part3: string }> = {
  'work-study': {
    part1: 'Do you work or are you a student?',
    part2:
      'Describe a job or course you found rewarding. You should say what it was, why you chose it, and what you learned.',
    part3: 'How has technology changed the way people work or study?',
  },
  hometown: {
    part1: 'Where is your hometown?',
    part2:
      'Describe a place in your hometown you like. You should say where it is, what you do there, and why you like it.',
    part3: 'Why do some people choose to leave their hometown?',
  },
  'free-time': {
    part1: 'What do you like to do in your free time?',
    part2:
      'Describe a hobby you enjoy. You should say when you started it, how often you do it, and why you like it.',
    part3: 'Do you think people have enough free time today?',
  },
  travel: {
    part1: 'Do you like travelling?',
    part2:
      'Describe a trip you remember well. You should say where you went, who you were with, and what you did.',
    part3: 'How can tourism affect local communities?',
  },
  technology: {
    part1: 'How often do you use technology?',
    part2:
      'Describe a piece of technology you use every day. You should say what it is, how you use it, and why it is useful.',
    part3: 'Will technology replace some jobs in the future?',
  },
};

const QUICK_TIPS = [
  'トピックに入ったら、答えの軸を 2〜3 個だけ決めてから話し始めます。',
  '短すぎる答えは避け、理由や例を 1 つ添えるとまとまりやすくなります。',
  'Part 2 は Cue Card のポイントを 1 分で整理してから話し始めます。',
  '難しい表現を無理に使うよりも、自然な語順で最後まで言い切る方が評価につながります。',
  '話したあとも、改善点を次の回答にすぐ反映することを意識します。',
] as const;

const SPEAKING_TOPIC_FAQ = [
  {
    question: 'このトピックで Part 2 を練習するときのコツは？',
    answer:
      '1 分で 2〜3 個の軸を決め、Cue Card のポイントに沿って 1〜2 分で話せる流れを作るのがおすすめです。',
  },
  {
    question: 'テキスト中心でも練習できますか？',
    answer:
      'はい。まずはテキストで構成と語彙を安定させ、その後に音声練習へ広げると Speaking の型が崩れにくくなります。',
  },
  {
    question: 'スコアはどの程度参考になりますか？',
    answer:
      'Fluency、Lexical Resource、Grammar、Pronunciation の観点で見ています。音声をもとに評価されるため、学習の目安として活用してください。',
  },
] as const;

function buildFaqPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SPEAKING_TOPIC_FAQ.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
  };
}

export async function generateStaticParams() {
  return speakingTopics.map((topic) => ({ slug: topic.slug }));
}

type Props = { params: { slug: string } };

export default async function SpeakingTopicPage({ params }: Props) {
  const { slug } = params;
  const topic = speakingTopics.find((item) => item.slug === slug);

  if (!topic) {
    notFound();
  }

  const samples = SAMPLE_QUESTIONS[topic.slug];
  const faqJsonLd = buildFaqPageJsonLd();

  return (
    <Layout variant="public">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-4xl">
            IELTS Speaking トピック: {topic.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-text-muted">
            「{topic.title}」に関連する Part 1-3 の質問例と、答え方の考え方をまとめています。
            そのまま AI 面接に入り、改善点まで確認できます。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex')}>
              このトピックで AI 面接を始める
            </Link>
            <Link href="/pricing" className={cn(buttonSecondary, 'inline-flex')}>
              料金を見る
            </Link>
            <Link href="/speaking" className="text-sm font-medium text-indigo-600 hover:underline">
              Speaking に戻る
            </Link>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="part-guide-heading">
          <h2 id="part-guide-heading" className="mb-6 text-xl font-bold text-text">
            Part 別の見方
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className="font-semibold text-text">Part 1</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                「{topic.title}」に関する身近な質問に短く答えるパートです。2〜3 文でまずは明確に返します。
              </p>
            </div>
            <div className={cn('rounded-2xl border-indigo-200 p-6', cardBase)}>
              <h3 className="font-semibold text-text">Part 2 / Cue Card</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {topic.title} に関連するテーマで 1〜2 分話します。Cue Card のポイントを軸に話を組み立てます。
              </p>
            </div>
            <div className={cn('rounded-2xl p-6', cardBase)}>
              <h3 className="font-semibold text-text">Part 3</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Part 2 を広げた抽象的な議論です。意見だけでなく理由まで言うのがポイントです。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="samples-heading">
          <h2 id="samples-heading" className="mb-6 text-xl font-bold text-text">
            サンプル質問
          </h2>
          <ul className="space-y-4">
            <li className={cn('rounded-xl p-4', cardBase)}>
              <span className="text-xs font-medium text-indigo-600">Part 1</span>
              <p className="mt-1 text-text">{samples.part1}</p>
            </li>
            <li className={cn('rounded-xl p-4', cardBase)}>
              <span className="text-xs font-medium text-indigo-600">Part 2</span>
              <p className="mt-1 text-text">{samples.part2}</p>
            </li>
            <li className={cn('rounded-xl p-4', cardBase)}>
              <span className="text-xs font-medium text-indigo-600">Part 3</span>
              <p className="mt-1 text-text">{samples.part3}</p>
            </li>
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="tips-heading">
          <h2 id="tips-heading" className="mb-6 text-xl font-bold text-text">
            すぐ使えるコツ
          </h2>
          <ul className="list-inside list-disc space-y-2 text-sm leading-7 text-text-muted">
            {QUICK_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="border-t border-border pt-8 text-center">
          <Link href="/exam/speaking" className={cn(buttonPrimary, 'inline-flex')}>
            Exam Mode でこのトピックを練習する
          </Link>
        </section>

        <section className="mt-12 border-t border-border pt-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-xl font-bold text-text">
            よくある質問
          </h2>
          <ul className="space-y-4">
            {SPEAKING_TOPIC_FAQ.map((item) => (
              <li key={item.question} className={cn('rounded-lg bg-surface p-4', cardBase)}>
                <h3 className="font-semibold text-text">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-text-muted">{item.answer}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-text-muted">
            <Link href="/exam/speaking" className="text-indigo-600 hover:underline">
              AI 面接を始める
            </Link>
            {' ・ '}
            <Link href="/pricing" className="text-indigo-600 hover:underline">
              料金を見る
            </Link>
          </p>
        </section>
      </div>
    </Layout>
  );
}
