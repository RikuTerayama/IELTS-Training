/**
 * IELTS Speaking常用フレーズ（日本語→英語変換練習用）
 */

export interface SpeakingPhrase {
  id: string;
  japanese: string; // 日本語フレーズ
  english: string; // 正答例（複数のバリエーションも可能）
  english_variations?: string[]; // 別の言い回し
  topic: string; // トピック（'introduction', 'work_study', 'hometown', etc.）
  level: 'B1' | 'B2' | 'C1';
}

export const SPEAKING_PHRASES: SpeakingPhrase[] = [
  // Introduction & Work/Study
  {
    id: '1',
    japanese: '私は学生で、政治学を専攻しています。',
    english: "I'm a student majoring in political science.",
    english_variations: [
      "I'm studying political science at university.",
      "I'm a political science student.",
    ],
    topic: 'work_study',
    level: 'B2',
  },
  {
    id: '2',
    japanese: '私はIT企業でソフトウェアエンジニアとして働いています。',
    english: "I work as a software engineer at an IT company.",
    english_variations: [
      "I'm employed as a software engineer in the IT industry.",
      "I'm a software engineer working for an IT company.",
    ],
    topic: 'work_study',
    level: 'B2',
  },
  {
    id: '3',
    japanese: '出身地を自然に伝えたい。都市名だけではなく、簡単な説明も加えたい。',
    english: "I'm from Tokyo, which is the capital of Japan. It's a bustling city with over 13 million people.",
    english_variations: [
      "I come from Tokyo, the capital city of Japan. It's quite large and very lively.",
      "I'm originally from Tokyo. It's Japan's capital, so it's a major metropolitan area.",
    ],
    topic: 'introduction',
    level: 'B2',
  },
  {
    id: '4',
    japanese: '故郷の良い点と悪い点をバランス良く述べたい。',
    english: "My hometown has a good balance of being peaceful but not too remote. The downside is that it can be a bit quiet sometimes.",
    english_variations: [
      "What I like about my hometown is its peaceful atmosphere. However, it might feel a bit too quiet for some people.",
      "My hometown's charm is its tranquility, but the trade-off is that it's sometimes lacking in entertainment options.",
    ],
    topic: 'hometown',
    level: 'B2',
  },
  {
    id: '5',
    japanese: '将来について述べる際、確定的な言い方ではなく、可能性を示す表現を使いたい。',
    english: "I think I'll probably stay here for a while, but I'm open to moving somewhere else if the right opportunity comes up.",
    english_variations: [
      "I'm planning to stay in my hometown for the foreseeable future, though I wouldn't rule out relocating if something interesting comes along.",
      "For now, I intend to remain here, but I'm flexible about moving if circumstances change.",
    ],
    topic: 'hometown',
    level: 'B2',
  },
  {
    id: '6',
    japanese: '申し訳ないが断る（約束を断る）。理由も添えたいが、長々と説明したくない。',
    english: "I'm sorry, but I won't be able to make it to that appointment. I have a prior commitment that I can't reschedule.",
    english_variations: [
      "I'm afraid I can't make it to that appointment. Unfortunately, I already have something else planned.",
      "I'd love to, but I have a prior engagement that I need to attend.",
    ],
    topic: 'social',
    level: 'B2',
  },
  {
    id: '7',
    japanese: '柔らかく提案する。自分のアイデアを押し付けるのではなく、提案として伝えたい。',
    english: "Maybe we could consider trying a different approach? I think it might work better that way.",
    english_variations: [
      "How about we give another method a try? It might be more effective.",
      "Perhaps we should explore an alternative option. I believe it could yield better results.",
    ],
    topic: 'social',
    level: 'B2',
  },
  {
    id: '8',
    japanese: '質問に対して、理由を述べ、具体例を挙げ、結論でまとめたい。',
    english: "I enjoy reading because it helps me relax. For example, when I read a good novel, I can completely forget about my daily stress. That's why I always keep a book with me.",
    english_variations: [
      "Reading is one of my favorite pastimes because it's so relaxing. Take last week, for instance - I was reading a thriller and time just flew by. That's exactly why I love it.",
      "I find reading very relaxing, which is why I enjoy it so much. Just yesterday, I spent an entire afternoon with a book and felt completely refreshed. That's the kind of effect it has on me.",
    ],
    topic: 'hobbies',
    level: 'B2',
  },
  {
    id: '9',
    japanese: '趣味について簡潔に説明したい。',
    english: "I'm really into photography. I enjoy taking pictures of landscapes and street scenes in my spare time.",
    english_variations: [
      "Photography is one of my main hobbies. I love capturing landscapes and urban scenes.",
      "I have a passion for photography, especially landscape and street photography.",
    ],
    topic: 'hobbies',
    level: 'B1',
  },
  {
    id: '10',
    japanese: '食べ物の好みについて説明したい。',
    english: "I'm quite fond of Japanese cuisine, particularly sushi and ramen. I like how fresh and flavorful they are.",
    english_variations: [
      "I really enjoy Japanese food, especially sushi and ramen. They're so fresh and tasty.",
      "Japanese cuisine is my favorite, particularly sushi and ramen. I appreciate their freshness and flavor.",
    ],
    topic: 'food',
    level: 'B1',
  },
  // 追加のフレーズは必要に応じて追加
];

/**
 * トピックとレベルでフレーズをフィルタリング
 */
export function getPhrasesByTopicAndLevel(
  topic: string,
  level: 'B1' | 'B2' | 'C1' = 'B2',
  count: number = 10
): SpeakingPhrase[] {
  const filtered = SPEAKING_PHRASES.filter(
    (phrase) => phrase.topic === topic && phrase.level === level
  );
  
  // ランダムにシャッフルして指定数まで取得
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * ランダムにフレーズを取得
 */
export function getRandomPhrases(count: number = 10): SpeakingPhrase[] {
  const shuffled = [...SPEAKING_PHRASES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

