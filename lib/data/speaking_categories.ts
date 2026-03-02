/**
 * Speaking カテゴリの単一定義（AC-S1: カテゴリ×Task マトリクスを常に成立させる）
 */

export const SPEAKING_CATEGORIES = [
  { slug: 'work_study', label: '仕事・勉強' },
  { slug: 'hometown', label: '故郷' },
  { slug: 'hobbies', label: '趣味' },
  { slug: 'technology', label: 'テクノロジー' },
  { slug: 'environment', label: '環境' },
  { slug: 'education', label: '教育' },
  { slug: 'society', label: '社会' },
  { slug: 'culture', label: '文化' },
  { slug: 'introduction', label: '自己紹介' },
  { slug: 'social', label: '社会生活' },
  { slug: 'event', label: 'イベント' },
  { slug: 'person', label: '人物' },
  { slug: 'place', label: '場所' },
] as const;

export type SpeakingCategorySlug = (typeof SPEAKING_CATEGORIES)[number]['slug'];

export const DEFAULT_SPEAKING_CATEGORY: SpeakingCategorySlug = 'work_study';

const slugSet = new Set<string>(SPEAKING_CATEGORIES.map((c) => c.slug));

export function isValidSpeakingCategory(slug: string | null): slug is SpeakingCategorySlug {
  return slug !== null && slugSet.has(slug);
}

export function normalizeSpeakingCategory(slug: string | null): SpeakingCategorySlug {
  return isValidSpeakingCategory(slug) ? slug : DEFAULT_SPEAKING_CATEGORY;
}
