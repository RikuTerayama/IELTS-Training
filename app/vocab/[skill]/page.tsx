import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import {
  bodyText,
  buttonPrimary,
  cardBase,
  cardTitle,
  cn,
  helperText,
  pageTitle,
  sectionTitle,
  subsectionTitle,
} from '@/lib/ui/theme';
import {
  VOCAB_PUBLIC_SKILL_LIST,
  getVocabPublicSkill,
} from '@/lib/content/vocabPublic';

type Props = {
  params: {
    skill: string;
  };
};

function buildLoginUrl(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

export async function generateStaticParams() {
  return VOCAB_PUBLIC_SKILL_LIST.map((skill) => ({ skill: skill.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skill = getVocabPublicSkill(params.skill);

  if (!skill) {
    return { title: 'ページが見つかりません' };
  }

  return {
    title: skill.metadataTitle,
    description: skill.metadataDescription,
    alternates: {
      canonical: `/vocab/${skill.slug}`,
    },
    openGraph: {
      title: skill.metadataTitle,
      description: skill.metadataDescription,
      url: `/vocab/${skill.slug}`,
    },
  };
}

export default function VocabSkillPublicPage({ params }: Props) {
  const skill = getVocabPublicSkill(params.skill);

  if (!skill) notFound();

  return (
    <Layout variant="public">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className={cn(pageTitle, 'mb-4')}>{skill.pageTitle}</h1>
          <p className={cn(bodyText, 'mx-auto max-w-3xl text-balance text-lg md:text-body-lg')}>
            {skill.intro}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href={skill.trainingHref} className={cn(buttonPrimary, 'inline-flex')}>
              {skill.primaryCtaLabel}
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link
                href={buildLoginUrl('/home')}
                className="text-sm font-medium text-text-muted transition-colors hover:text-text hover:underline"
              >
                学習ホームにログイン
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-text-muted transition-colors hover:text-text hover:underline"
              >
                料金を見る
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-16" aria-labelledby="practice-heading">
          <h2 id="practice-heading" className={cn(sectionTitle, 'mb-6')}>
            練習できること
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {skill.practiceItems.map((item) => (
              <div key={item.title} className={cn(cardBase, 'rounded-2xl p-6')}>
                <h3 className={cardTitle}>{item.title}</h3>
                <p className={cn(helperText, 'mt-2')}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className={cn(sectionTitle, 'mb-6')}>
            使い方
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {skill.howTo.map((step, index) => (
              <li key={step.title} className={cn(cardBase, 'list-none rounded-2xl p-6')}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <h3 className={cn(subsectionTitle, 'mt-3 text-card-title')}>{step.title}</h3>
                <p className={cn(helperText, 'mt-2')}>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className={cn(sectionTitle, 'mb-6')}>
            関連リンク
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/vocab"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-5 py-3 font-medium text-primary',
                'hover:border-primary/70 hover:bg-primary/15 transition-colors'
              )}
            >
              単語トップ
            </Link>
            {skill.relatedLinks.map(({ href, label }) => (
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

        <section className="border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className={cn(sectionTitle, 'mb-6')}>
            よくある質問
          </h2>
          <ul className="space-y-4">
            {skill.faq.map((item) => (
              <li key={item.question} className={cn(cardBase, 'rounded-lg bg-surface p-4')}>
                <h3 className={cardTitle}>{item.question}</h3>
                <p className={cn(helperText, 'mt-2 text-sm leading-7')}>{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
