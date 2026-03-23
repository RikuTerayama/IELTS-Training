import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import {
  bodyText,
  cardBase,
  cardTitle,
  cn,
  helperText,
  pageTitle,
  sectionTitle,
  surfaceSoftBadge,
} from '@/lib/ui/theme';
import {
  VOCAB_PUBLIC_SKILL_LIST,
  getVocabPublicSkill,
} from '@/lib/content/vocabPublic';

type Props = {
  searchParams?: {
    skill?: string;
  };
};

const RELATED_LINKS = [
  { href: '/reading', label: 'Reading' },
  { href: '/listening', label: 'Listening' },
  { href: '/writing', label: 'Writing' },
  { href: '/speaking', label: 'Speaking' },
] as const;

const STEPS = [
  {
    title: '技能を選ぶ',
    description:
      'まずは Reading / Listening / Speaking / Writing のどこで単語を強化したいかを選びます。',
  },
  {
    title: '公開ページで全体像を見る',
    description:
      'いきなり練習へ入る前に、その技能で何を鍛えるかと使い方を短く確認できます。',
  },
  {
    title: '練習画面で進める',
    description:
      '実際の単語練習は /training/vocab に残し、公開面と学習面の役割を分けています。',
  },
] as const;

export default function VocabHubPage({ searchParams }: Props) {
  const requestedSkill = searchParams?.skill ? getVocabPublicSkill(searchParams.skill) : null;

  if (requestedSkill) {
    redirect(`/vocab/${requestedSkill.slug}`);
  }

  return (
    <Layout variant="public">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <section className="mb-16 text-center">
          <span className={surfaceSoftBadge}>公開ハブ</span>
          <h1 className={cn(pageTitle, 'mt-4')}>IELTS 単語学習</h1>
          <p className={cn(bodyText, 'mx-auto mt-4 max-w-3xl text-balance text-lg md:text-body-lg')}>
            Meridian の単語学習を Reading / Listening / Speaking / Writing の 4 技能ごとに整理した公開ページです。
            まずは技能別の進め方を確認して、実際の練習はログイン後に練習画面で進められます。
          </p>
        </section>

        <section className="mb-16" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className={cn(sectionTitle, 'mb-6')}>
            4技能の入口
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {VOCAB_PUBLIC_SKILL_LIST.map((skill) => (
              <Link
                key={skill.slug}
                href={`/vocab/${skill.slug}`}
                className={cn(
                  cardBase,
                  'flex h-full flex-col gap-4 rounded-2xl p-6 text-left transition-all',
                  'hover:-translate-y-0.5 hover:border-primary/30'
                )}
              >
                <div className="space-y-2">
                  <h3 className={cardTitle}>{skill.label}</h3>
                  <p className={helperText}>{skill.hubDescription}</p>
                </div>
                <div className="mt-auto">
                  <span className="text-sm font-medium text-primary">詳細を見る</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className={cn(sectionTitle, 'mb-6')}>
            進め方
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className={cn(cardBase, 'list-none rounded-2xl p-6')}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <h3 className={cn(cardTitle, 'mt-3')}>{step.title}</h3>
                <p className={cn(helperText, 'mt-2')}>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className={cn(sectionTitle, 'mb-6')}>
            関連リンク
          </h2>
          <div className="flex flex-wrap gap-4">
            {RELATED_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-5 py-3 font-medium text-text',
                  'hover:border-primary/50 hover:bg-surface transition-colors'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
