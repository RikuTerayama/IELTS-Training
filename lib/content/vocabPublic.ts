export type VocabSkillSlug = 'reading' | 'listening' | 'speaking' | 'writing';

type InfoBlock = {
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type RelatedLink = {
  href: string;
  label: string;
};

type VocabPublicSkill = {
  slug: VocabSkillSlug;
  label: string;
  pageTitle: string;
  metadataTitle: string;
  metadataDescription: string;
  hubDescription: string;
  intro: string;
  trainingHref: string;
  primaryCtaLabel: string;
  practiceItems: InfoBlock[];
  howTo: InfoBlock[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
};

const SHARED_RELATED_LINKS: RelatedLink[] = [
  { href: '/reading', label: 'Reading' },
  { href: '/listening', label: 'Listening' },
  { href: '/writing', label: 'Writing' },
  { href: '/speaking', label: 'Speaking' },
] as const;

export const VOCAB_PUBLIC_SKILLS: Record<VocabSkillSlug, VocabPublicSkill> = {
  reading: {
    slug: 'reading',
    label: 'Reading',
    pageTitle: 'Reading の単語学習',
    metadataTitle: 'Reading の単語学習 | IELTS 語彙ガイド',
    metadataDescription:
      'Academic Reading の設問でよく出る語彙と言い換えを整理してから、単語練習へ進める Meridian の公開ページです。',
    hubDescription: 'Academic Reading で頻出の語彙と言い換えを整理してから練習へ進みます。',
    intro:
      'Academic Reading でよく出る語彙と言い換えを、設問タイプと一緒に確認できる公開ページです。実際の単語練習はログイン後に /training/vocab で進められます。',
    trainingHref: '/training/vocab?skill=reading',
    primaryCtaLabel: 'Reading の単語練習を始める',
    practiceItems: [
      {
        title: '設問タイプごとの頻出語',
        description: '見出し対応、TFNG、要約穴埋めなどでよく出る語をまとめて確認できます。',
      },
      {
        title: '言い換えとパラフレーズ',
        description: '本文と設問の言い換えに気づくための語彙パターンを先に整理できます。',
      },
      {
        title: '復習前提の定着',
        description: 'SRS ベースの復習で、Reading に必要な語を短いセットで回せます。',
      },
    ],
    howTo: [
      {
        title: '公開ページで全体像を見る',
        description: 'まずは Reading に必要な語彙の方向性と、どこを先に固めるかを確認します。',
      },
      {
        title: '練習画面で始める',
        description: 'ログイン後に /training/vocab の Reading モードへ進み、カテゴリとモードを選んで始めます。',
      },
      {
        title: 'Reading 本編へ戻す',
        description: '単語で引っかかった箇所を見直し、そのまま Reading の設問練習に戻せます。',
      },
    ],
    faq: [
      {
        question: 'Reading の単語は何から始めればよいですか？',
        answer:
          'まずは設問で何度も出る語と、本文と設問の言い換えで使われやすい語から始めるのがおすすめです。',
      },
      {
        question: 'このページだけで練習できますか？',
        answer:
          'このページは公開ガイドです。実際の単語練習はログイン後に /training/vocab の Reading で進めます。',
      },
      {
        question: 'Reading と Writing に共通する語彙もありますか？',
        answer:
          'あります。Academic 語彙や言い換えは Writing にも効くため、単語を先に固めるとアウトプットが安定しやすくなります。',
      },
    ],
    relatedLinks: [...SHARED_RELATED_LINKS],
  },
  listening: {
    slug: 'listening',
    label: 'Listening',
    pageTitle: 'Listening の単語学習',
    metadataTitle: 'Listening の単語学習 | IELTS 語彙ガイド',
    metadataDescription:
      'Listening で聞き取りやすくするための語彙と表現を整理してから、単語練習へ進める Meridian の公開ページです。',
    hubDescription: '音声で拾いたい語彙と表現を先に整理してから練習へ進みます。',
    intro:
      'Listening で聞き取りやすくしたい語彙と表現を、日本語ガイド付きで整理できる公開ページです。実際の単語練習はログイン後に /training/vocab で進められます。',
    trainingHref: '/training/vocab?skill=listening',
    primaryCtaLabel: 'Listening の単語練習を始める',
    practiceItems: [
      {
        title: '講義と会話で出る語彙',
        description: '会話・アナウンス・講義で拾いたい語彙を、場面ごとに確認できます。',
      },
      {
        title: '音で拾うための表現',
        description: '聞こえた瞬間に意味へつなげたい基本語とフレーズを短く回せます。',
      },
      {
        title: '復習しやすいセット構成',
        description: '短い単位で回して、聞き取りで止まりやすい語を反復しやすくしています。',
      },
    ],
    howTo: [
      {
        title: 'Listening で止まる語を意識する',
        description: 'まずは音で拾えない語や、意味が遅れて出る語を公開ページで整理します。',
      },
      {
        title: '練習画面でカテゴリを選ぶ',
        description: 'ログイン後に /training/vocab の Listening へ進み、カテゴリごとに単語を練習します。',
      },
      {
        title: 'Listening 本編へ戻す',
        description: '音源で止まった語を復習し、そのまま Listening の公開ハブや本編へ戻せます。',
      },
    ],
    faq: [
      {
        question: 'Listening の単語は Reading と何が違いますか？',
        answer:
          'Reading よりも音で即座に意味へつなげる感覚が重要です。耳で拾った瞬間に意味が出る語を優先して固めます。',
      },
      {
        question: 'このページだけで練習できますか？',
        answer:
          'このページは公開ガイドです。実際の単語練習はログイン後に /training/vocab の Listening で進めます。',
      },
      {
        question: 'Listening が苦手でも先に単語をやる意味はありますか？',
        answer:
          'あります。聞き取りで止まる語を先に減らすだけでも、全体の理解速度がかなり安定します。',
      },
    ],
    relatedLinks: [...SHARED_RELATED_LINKS],
  },
  speaking: {
    slug: 'speaking',
    label: 'Speaking',
    pageTitle: 'Speaking の単語学習',
    metadataTitle: 'Speaking の単語学習 | IELTS 語彙ガイド',
    metadataDescription:
      'Speaking で言い換えと表現を増やすための語彙ガイドです。公開ページで方向性を確認してから単語練習へ進めます。',
    hubDescription: '言い換えや口頭で使いやすい表現を整理してから練習へ進みます。',
    intro:
      'Speaking で言い換えや自然な表現を増やしたいときの公開ページです。単語を先に整理してから、ログイン後に /training/vocab で練習へ進めます。',
    trainingHref: '/training/vocab?skill=speaking',
    primaryCtaLabel: 'Speaking の単語練習を始める',
    practiceItems: [
      {
        title: '言い換えの手札を増やす',
        description: '同じ語の繰り返しを避けるために、口頭で使いやすい言い換えを増やせます。',
      },
      {
        title: '話しやすい表現を定着させる',
        description: 'Part 1-3 で使いやすい語と短いフレーズを、説明しやすい形で確認できます。',
      },
      {
        title: 'フィードバック前提で見返す',
        description: 'Speaking 本編のフィードバックと行き来しながら、足りない語彙を後から補強できます。',
      },
    ],
    howTo: [
      {
        title: 'よく使うテーマを決める',
        description: '仕事・学業、趣味、旅行など、Speaking でよく出るテーマから先に選びます。',
      },
      {
        title: '練習画面で語彙を回す',
        description: 'ログイン後に /training/vocab の Speaking で、カテゴリとモードを選んで練習します。',
      },
      {
        title: 'AI 面接で使う',
        description: '覚えた語を Speaking 本編でそのまま使い、足りない表現を次の復習に戻します。',
      },
    ],
    faq: [
      {
        question: 'Speaking の単語は難しい表現を覚えるべきですか？',
        answer:
          '無理に難しい語を増やすより、自然に言い換えられる語と使いやすい表現を先に固める方が効果的です。',
      },
      {
        question: 'このページだけで練習できますか？',
        answer:
          'このページは公開ガイドです。実際の単語練習はログイン後に /training/vocab の Speaking で進めます。',
      },
      {
        question: 'Speaking AI とどうつなげればよいですか？',
        answer:
          '単語で手札を増やしたあとに AI 面接へ進み、使えなかった語や表現をフィードバック経由で見返す流れがおすすめです。',
      },
    ],
    relatedLinks: [...SHARED_RELATED_LINKS],
  },
  writing: {
    slug: 'writing',
    label: 'Writing',
    pageTitle: 'Writing の単語学習',
    metadataTitle: 'Writing の単語学習 | IELTS 語彙ガイド',
    metadataDescription:
      'Writing で使いやすい Academic 語彙と言い換えを整理してから、単語練習へ進める Meridian の公開ページです。',
    hubDescription: 'Academic 語彙と言い換えを整理してから Writing に戻せます。',
    intro:
      'Writing で語彙の幅と自然な言い換えを増やしたいときの公開ページです。まずは公開面で全体像を確認し、実際の単語練習はログイン後に /training/vocab で進められます。',
    trainingHref: '/training/vocab?skill=writing',
    primaryCtaLabel: 'Writing の単語練習を始める',
    practiceItems: [
      {
        title: 'Academic 語彙を固める',
        description: 'Task 2 で使いやすい抽象語や、説明に必要な基本語を優先して確認できます。',
      },
      {
        title: '言い換えを増やす',
        description: '同じ語の反復を避けるために、自然な paraphrase を先に整理できます。',
      },
      {
        title: 'フィードバック後に見返す',
        description: 'Writing の添削結果と行き来しながら、足りない語彙を後から補強できます。',
      },
    ],
    howTo: [
      {
        title: 'よく使うテーマを決める',
        description: '教育、環境、社会、テクノロジーなど、書く頻度の高いテーマから始めます。',
      },
      {
        title: '練習画面で始める',
        description: 'ログイン後に /training/vocab の Writing へ進み、カテゴリとモードを選んで回します。',
      },
      {
        title: 'Task 2 に戻す',
        description: '単語を整理したあとに Writing の Practice / Exam Mode へ戻し、実際の表現で使います。',
      },
    ],
    faq: [
      {
        question: 'Writing の単語はどこから始めればよいですか？',
        answer:
          'まずは Task 2 で繰り返し使う Academic 語彙と、自然な言い換えから始めるのがおすすめです。',
      },
      {
        question: 'このページだけで練習できますか？',
        answer:
          'このページは公開ガイドです。実際の単語練習はログイン後に /training/vocab の Writing で進めます。',
      },
      {
        question: 'Writing と Speaking の単語は共通しますか？',
        answer:
          '一部は共通しますが、Writing はより Academic 寄りの語、Speaking は口頭で使いやすい語を先に固めるのが効果的です。',
      },
    ],
    relatedLinks: [...SHARED_RELATED_LINKS],
  },
};

export const VOCAB_PUBLIC_SKILL_LIST = [
  VOCAB_PUBLIC_SKILLS.reading,
  VOCAB_PUBLIC_SKILLS.listening,
  VOCAB_PUBLIC_SKILLS.speaking,
  VOCAB_PUBLIC_SKILLS.writing,
] as const;

export function getVocabPublicSkill(skill: string) {
  return VOCAB_PUBLIC_SKILLS[skill as VocabSkillSlug];
}
