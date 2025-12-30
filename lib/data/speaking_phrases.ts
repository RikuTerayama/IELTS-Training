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
  // Task 2用のフレーズ
  {
    id: '11',
    japanese: '最近訪れた印象的な場所について、どこ・いつ・何をした・なぜ印象的だったかを順序立てて説明したい。',
    english: "I'd like to talk about a small art museum I visited in Kyoto last month. It was during a weekend trip, and I spent about two hours there exploring the contemporary art exhibits. What really impressed me was how the traditional architecture blended seamlessly with modern installations.",
    english_variations: [
      "I visited an art museum in Kyoto last month. I went there on a weekend and spent two hours looking at contemporary art. The thing that struck me most was the blend of traditional and modern design.",
      "Last month, I went to Kyoto and visited an art museum. I was there for about two hours on a weekend, exploring modern art. What caught my attention was the way old and new architecture came together.",
    ],
    topic: 'place',
    level: 'B2',
  },
  {
    id: '12',
    japanese: '子供時代に遊んだ場所について、具体的なエピソードを交えながら説明したい。',
    english: "When I was a child, I used to play in a park near my grandmother's house. I remember spending entire afternoons there with my cousins, especially during summer holidays. We'd climb trees, play hide and seek, and sometimes just sit under the big oak tree and talk.",
    english_variations: [
      "As a kid, I often played at a park close to my grandmother's place. I'd spend whole afternoons there with my cousins in the summer. We climbed trees, played games, and just relaxed under a big tree.",
      "I used to go to a park near my grandmother's house when I was young. During summer, my cousins and I would spend all afternoon there playing on the trees and having fun.",
    ],
    topic: 'place',
    level: 'B2',
  },
  {
    id: '13',
    japanese: '重要なイベントについて、いつ・どこで・何が起きた・なぜ重要だったかを説明したい。',
    english: "I want to talk about my graduation ceremony, which took place three years ago at my university. It was significant because it marked the end of my student life and the beginning of my career. I remember feeling both excited and nervous about what lay ahead.",
    english_variations: [
      "My graduation ceremony was really important to me. It happened three years ago at university and represented a major turning point in my life from student to professional.",
      "Three years ago, I graduated from university. The ceremony was a milestone event that closed one chapter and opened another in my life.",
    ],
    topic: 'event',
    level: 'B2',
  },
  // Task 3用のフレーズ
  {
    id: '14',
    japanese: '教育の重要性について、理由を述べ、具体例を挙げ、結論でまとめたい。',
    english: "Education is crucial because it opens doors to better opportunities. For instance, people with higher education often have more career options and earn better salaries. Therefore, I believe investing in education is essential for personal and social development.",
    english_variations: [
      "Education matters because it provides access to more opportunities. Those with advanced education typically have wider career choices and higher income. That's why I think education is vital for both individuals and society.",
      "The importance of education lies in the opportunities it creates. For example, well-educated individuals usually enjoy better job prospects. This is why education should be a priority for everyone.",
    ],
    topic: 'education',
    level: 'B2',
  },
  {
    id: '15',
    japanese: 'テクノロジーの影響について、良い点と悪い点をバランス良く述べたい。',
    english: "Technology has both advantages and disadvantages. On the positive side, it makes communication easier and improves efficiency. However, it can also lead to privacy concerns and reduce face-to-face interactions. So we need to find a balance.",
    english_variations: [
      "Technology brings benefits like easier communication and better efficiency, but it also raises privacy issues and reduces personal contact. We should use it wisely.",
      "While technology improves our lives through better communication and efficiency, it also creates privacy problems and less human interaction. Finding the right balance is key.",
    ],
    topic: 'technology',
    level: 'B2',
  },
  {
    id: '16',
    japanese: '環境問題について、問題点を説明し、解決策を提案したい。',
    english: "Environmental issues are a major concern today. Pollution and climate change are serious problems that affect everyone. I think we should focus on renewable energy and reduce our carbon footprint through small daily actions.",
    english_variations: [
      "The environment faces serious challenges like pollution and climate change. Solutions include switching to renewable energy and making eco-friendly choices in our daily lives.",
      "Environmental problems such as pollution and climate change need urgent attention. We can address them by using clean energy and being more environmentally conscious.",
    ],
    topic: 'environment',
    level: 'B2',
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
 * Task 2用のフレーズを取得（place, event, person など）
 */
export function getTask2Phrases(count: number = 10): SpeakingPhrase[] {
  const task2Topics = ['place', 'event', 'person'];
  const filtered = SPEAKING_PHRASES.filter(
    (phrase) => task2Topics.includes(phrase.topic)
  );
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Task 3用のフレーズを取得（education, technology, environment など）
 */
export function getTask3Phrases(count: number = 10): SpeakingPhrase[] {
  const task3Topics = ['education', 'technology', 'environment'];
  const filtered = SPEAKING_PHRASES.filter(
    (phrase) => task3Topics.includes(phrase.topic)
  );
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

