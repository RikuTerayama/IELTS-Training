export const SPEAKING_TOPICS = [
  { slug: 'work-study', apiTopic: 'work_study', titleJa: '\u4ed5\u4e8b\u30fb\u5b66\u696d', titleEn: 'Work & Study' },
  { slug: 'hometown', apiTopic: 'hometown', titleJa: '\u3075\u308b\u3055\u3068', titleEn: 'Hometown' },
  { slug: 'free-time', apiTopic: 'free_time', titleJa: '\u81ea\u7531\u6642\u9593', titleEn: 'Free Time' },
  { slug: 'travel', apiTopic: 'travel', titleJa: '\u65c5\u884c', titleEn: 'Travel' },
  { slug: 'technology', apiTopic: 'technology', titleJa: '\u30c6\u30af\u30ce\u30ed\u30b8\u30fc', titleEn: 'Technology' },
] as const;

export type SpeakingTopicSlug = (typeof SPEAKING_TOPICS)[number]['slug'];
export type SpeakingTopicApiValue = (typeof SPEAKING_TOPICS)[number]['apiTopic'];

export function getSpeakingTopicBySlug(slug: string) {
  return SPEAKING_TOPICS.find((topic) => topic.slug === slug);
}

export function getSpeakingTopicByApiTopic(apiTopic: string) {
  return SPEAKING_TOPICS.find((topic) => topic.apiTopic === apiTopic);
}
