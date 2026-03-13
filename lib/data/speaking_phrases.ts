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
  // Task 1用のフレーズ（Introduction & Work/Study）
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
    japanese: '私は東京出身で、東京は日本の首都で1300万人以上の人が住む賑やかな都市です。',
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
    japanese: '私の故郷は平和ですが、少し静かすぎることが欠点です。',
    english: "My hometown is peaceful, but the downside is that it can be a bit too quiet sometimes.",
    english_variations: [
      "What I like about my hometown is its peaceful atmosphere. However, it might feel a bit too quiet for some people.",
      "My hometown's charm is its tranquility, but the trade-off is that it's sometimes lacking in entertainment options.",
    ],
    topic: 'hometown',
    level: 'B2',
  },
  {
    id: '5',
    japanese: '私はしばらくここに住む予定ですが、良い機会があれば他の場所に引っ越すことも考えています。',
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
    japanese: '申し訳ありませんが、前から予定があったもので変更できないため、その約束には参加できません。',
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
    japanese: '別のアプローチを試してみることを検討しませんか。その方がうまくいくかもしれませんが、いかがでしょうか。',
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
    japanese: 'リラックスできるので、私は読書が好きです。',
    english: "I enjoy reading because it helps me relax. For example, when I read a good novel, I can completely forget about my daily stress.",
    english_variations: [
      "Reading is one of my favorite pastimes because it's so relaxing. Take last week, for instance - I was reading a thriller and time just flew by.",
      "I find reading very relaxing, which is why I enjoy it so much. Just yesterday, I spent an entire afternoon with a book and felt completely refreshed.",
    ],
    topic: 'hobbies',
    level: 'B2',
  },
  {
    id: '9',
    japanese: '私は写真撮影が趣味で、空き時間に風景や街のシーンを撮影するのが好きです。',
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
    japanese: '私は日本料理が好きで、特に寿司とラーメンが好きです。',
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
    japanese: '私は先月京都で小さな美術館を訪れました。',
    english: "I visited a small art museum in Kyoto last month. It was during a weekend trip, and I spent about two hours there exploring the contemporary art exhibits.",
    english_variations: [
      "Last month, I went to an art museum in Kyoto. I went there on a weekend and spent two hours looking at contemporary art.",
      "I visited Kyoto last month and went to an art museum. I was there for about two hours on a weekend, exploring modern art.",
    ],
    topic: 'place',
    level: 'B2',
  },
  {
    id: '12',
    japanese: '私は子供の頃、祖母の家の近くにある公園でよく遊んでいました。',
    english: "When I was a child, I used to play in a park near my grandmother's house. I remember spending entire afternoons there with my cousins, especially during summer holidays.",
    english_variations: [
      "As a kid, I often played at a park close to my grandmother's place. I'd spend whole afternoons there with my cousins in the summer.",
      "I used to go to a park near my grandmother's house when I was young. During summer, my cousins and I would spend all afternoon there playing.",
    ],
    topic: 'place',
    level: 'B2',
  },
  {
    id: '13',
    japanese: '私は3年前に大学で卒業式に出席しました。',
    english: "I attended my graduation ceremony three years ago at my university. It was a significant event that marked the end of my student life and the beginning of my career.",
    english_variations: [
      "My graduation ceremony was really important to me. It happened three years ago at university and represented a major turning point in my life.",
      "Three years ago, I had my graduation ceremony at university. It was a milestone event that closed one chapter and opened another in my life.",
    ],
    topic: 'event',
    level: 'B2',
  },
  {
    id: '17',
    japanese: '私は先週末に友達と一緒に新しいカフェに行きました。',
    english: "I went to a new café with my friends last weekend. The coffee was really good, and the atmosphere was nice too.",
    english_variations: [
      "Last weekend, I visited a new café with friends. The coffee tasted great and I enjoyed the atmosphere.",
      "I tried out a new café with my friends last weekend. Both the coffee and the atmosphere were excellent.",
    ],
    topic: 'place',
    level: 'B1',
  },
  {
    id: '18',
    japanese: '私は高校時代に最も影響を受けた先生がいて、彼は数学の先生でした。',
    english: "There's a teacher who influenced me most during high school. He was my math teacher, and he taught me the importance of problem-solving.",
    english_variations: [
      "During high school, I had a math teacher who had a big impact on me. He showed me how important problem-solving is.",
      "A math teacher in high school really influenced me. He helped me understand the value of solving problems.",
    ],
    topic: 'person',
    level: 'B2',
  },
  // Task 3用のフレーズ
  {
    id: '14',
    japanese: 'より良い機会への扉を開くので、教育は重要です。',
    english: "Education is crucial because it opens doors to better opportunities. For instance, people with higher education often have more career options and earn better salaries.",
    english_variations: [
      "Education matters because it provides access to more opportunities. Those with advanced education typically have wider career choices and higher income.",
      "The importance of education lies in the opportunities it creates. For example, well-educated individuals usually enjoy better job prospects.",
    ],
    topic: 'education',
    level: 'B2',
  },
  {
    id: '15',
    japanese: 'テクノロジーには良い点と悪い点の両方があります。',
    english: "Technology has both advantages and disadvantages. On the positive side, it makes communication easier and improves efficiency. However, it can also lead to privacy concerns and reduce face-to-face interactions.",
    english_variations: [
      "Technology brings benefits like easier communication and better efficiency, but it also raises privacy issues and reduces personal contact.",
      "While technology improves our lives through better communication and efficiency, it also creates privacy problems and less human interaction.",
    ],
    topic: 'technology',
    level: 'B2',
  },
  {
    id: '16',
    japanese: '環境問題に対して、人々が日々できることを続けることが重要です。',
    english: "For environmental issues, it's important for people to continue doing what they can in their daily lives. We should focus on renewable energy and reduce our carbon footprint through small daily actions.",
    english_variations: [
      "When it comes to the environment, people need to keep doing small things every day. This includes using renewable energy and making eco-friendly choices.",
      "To address environmental problems, we must continue doing daily actions. We should switch to clean energy and be more environmentally conscious.",
    ],
    topic: 'environment',
    level: 'B2',
  },
  {
    id: '19',
    japanese: 'オンライン教育には柔軟性があるという利点があります。',
    english: "Online education has the advantage of flexibility. Students can learn at their own pace, which is particularly beneficial for those with other commitments.",
    english_variations: [
      "One benefit of online education is its flexibility. Learners can study when it suits them, which helps people with busy schedules.",
      "Online learning offers flexibility as a key advantage. Students can go at their own speed, making it ideal for people with other responsibilities.",
    ],
    topic: 'education',
    level: 'B2',
  },
  {
    id: '20',
    japanese: '社会問題を解決するには、政府と市民の両方が協力する必要があります。',
    english: "To solve social problems, both the government and citizens need to work together.",
    english_variations: [
      "Solving social issues requires cooperation between the government and the public.",
      "Addressing social problems demands collaboration from both authorities and individuals.",
    ],
    topic: 'society',
    level: 'B2',
  },
  // 追加のフレーズ（Task 1用）
  {
    id: '21',
    japanese: '私は英語を勉強するのが好きで、将来は英語を使う仕事に就きたいと思っています。',
    english: "I enjoy studying English, and I'd like to get a job that uses English in the future.",
    english_variations: [
      "I like learning English and hope to work in a field that requires English skills.",
      "English is something I enjoy studying, and I want to pursue a career that involves using English.",
    ],
    topic: 'work_study',
    level: 'B1',
  },
  {
    id: '22',
    japanese: '私の家族は4人で、両親と私と弟がいます。',
    english: "My family has four members - my parents, me, and my younger brother.",
    english_variations: [
      "There are four people in my family: my parents, myself, and my little brother.",
      "I have a family of four, including my parents and my younger brother.",
    ],
    topic: 'introduction',
    level: 'B1',
  },
  // 追加のフレーズ（Task 2用）
  {
    id: '23',
    japanese: '私は高校時代に参加した文化祭について話したいです。',
    english: "I'd like to talk about a school festival I participated in during high school. We spent a lot of time preparing for it, and it was a very memorable experience.",
    english_variations: [
      "I want to describe a cultural festival I took part in while in high school. The preparation took a long time, but it's one of my best memories.",
      "There was a school festival in high school that I was involved in. We put in a lot of effort preparing, and it became an unforgettable experience.",
    ],
    topic: 'event',
    level: 'B2',
  },
  {
    id: '24',
    japanese: '私のお気に入りの本は「ハリーポッター」シリーズで、子供の頃から何度も読んでいます。',
    english: "My favorite book series is 'Harry Potter.' I've read it many times since I was a child.",
    english_variations: [
      "I love the 'Harry Potter' books. I've been reading them repeatedly since childhood.",
      "The 'Harry Potter' series is my favorite. I've read it over and over since I was young.",
    ],
    topic: 'person',
    level: 'B1',
  },
  // 追加のフレーズ（Task 3用）
  {
    id: '25',
    japanese: '都市部と地方部の生活の違いについて考えると、それぞれに利点と欠点があると思います。',
    english: "When I think about the differences between urban and rural life, I believe each has its own advantages and disadvantages.",
    english_variations: [
      "Considering life in cities versus the countryside, both have their pros and cons in my opinion.",
      "Reflecting on urban versus rural living, I think each lifestyle offers different benefits and challenges.",
    ],
    topic: 'society',
    level: 'B2',
  },
  {
    id: '26',
    japanese: 'グローバル化は文化の多様性を促進する一方で、伝統的な文化が失われる可能性もあります。',
    english: "Globalization promotes cultural diversity, but it also has the potential to cause the loss of traditional cultures.",
    english_variations: [
      "While globalization encourages cultural variety, it might also lead to the disappearance of traditional ways of life.",
      "Globalization can increase cultural diversity, however it may also result in the decline of traditional cultures.",
    ],
    topic: 'culture',
    level: 'B2',
  },
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
 * Task 3用のフレーズを取得（education, technology, environment, society, culture など）
 */
export function getTask3Phrases(count: number = 10): SpeakingPhrase[] {
  const task3Topics = ['education', 'technology', 'environment', 'society', 'culture'];
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

