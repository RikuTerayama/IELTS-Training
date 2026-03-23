export const SPEAKING_TOPICS = [
  { slug: 'work-study', apiTopic: 'work_study', titleJa: '\u4ed5\u4e8b\u30fb\u5b66\u696d', titleEn: 'Work & Study' },
  { slug: 'hometown', apiTopic: 'hometown', titleJa: '\u3075\u308b\u3055\u3068', titleEn: 'Hometown' },
  { slug: 'free-time', apiTopic: 'free_time', titleJa: '\u81ea\u7531\u6642\u9593', titleEn: 'Free Time' },
  { slug: 'travel', apiTopic: 'travel', titleJa: '\u65c5\u884c', titleEn: 'Travel' },
  { slug: 'technology', apiTopic: 'technology', titleJa: '\u30c6\u30af\u30ce\u30ed\u30b8\u30fc', titleEn: 'Technology' },
  { slug: 'people', apiTopic: 'people', titleJa: '\u4eba\u7269', titleEn: 'People' },
  { slug: 'daily-routine', apiTopic: 'daily_routine', titleJa: '\u65e5\u5e38\u7fd2\u6163', titleEn: 'Daily Routine' },
  { slug: 'memories', apiTopic: 'memories', titleJa: '\u601d\u3044\u51fa', titleEn: 'Memories' },
  { slug: 'future-plans', apiTopic: 'future_plans', titleJa: '\u5c06\u6765\u306e\u8a08\u753b', titleEn: 'Future Plans' },
] as const;

export type SpeakingTopicSlug = (typeof SPEAKING_TOPICS)[number]['slug'];
export type SpeakingTopicApiValue = (typeof SPEAKING_TOPICS)[number]['apiTopic'];

export function getSpeakingTopicBySlug(slug: string) {
  return SPEAKING_TOPICS.find((topic) => topic.slug === slug);
}

export function getSpeakingTopicByApiTopic(apiTopic: string) {
  return SPEAKING_TOPICS.find((topic) => topic.apiTopic === apiTopic);
}
