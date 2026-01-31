/**
 * Idiom Master Data
 * Writing/Speakingで使う必須熟語を網羅的に登録
 * 各expressionは最低1問以上の問題に必ず登場する
 */

export interface IdiomMasterItem {
  skill: 'writing' | 'speaking';
  category: string;
  expression: string;
  ja_hint: string;
  typing_enabled: boolean;
  variants?: string[]; // 展開済みバリエーション
  notes?: string; // 任意
}

export const IDIOM_MASTER: IdiomMasterItem[] = [
  // ==================== Speaking - Idioms ====================
  
  // 日常会話でよく使う熟語
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'break the ice',
    ja_hint: '緊張をほぐす、場を和ませる',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'get along with',
    ja_hint: '〜と仲良くする',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'look forward to',
    ja_hint: '〜を楽しみにする',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'come up with',
    ja_hint: '〜を思いつく、考え出す',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'put up with',
    ja_hint: '〜を我慢する',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'run out of',
    ja_hint: '〜を使い果たす',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'get rid of',
    ja_hint: '〜を取り除く、処分する',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'make up for',
    ja_hint: '〜を埋め合わせる、補う',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'catch up with',
    ja_hint: '〜に追いつく',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_common_idioms',
    expression: 'keep up with',
    ja_hint: '〜についていく、維持する',
    typing_enabled: true,
  },

  // 意見・考えを表現する熟語
  {
    skill: 'speaking',
    category: 'speaking_opinion_idioms',
    expression: 'in my opinion',
    ja_hint: '私の意見では',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_opinion_idioms',
    expression: 'from my point of view',
    ja_hint: '私の見方では',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_opinion_idioms',
    expression: 'as far as I\'m concerned',
    ja_hint: '私に関して言えば',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_opinion_idioms',
    expression: 'to be honest',
    ja_hint: '正直に言うと',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_opinion_idioms',
    expression: 'to tell the truth',
    ja_hint: '本当のことを言うと',
    typing_enabled: true,
  },

  // 時間・頻度を表現する熟語
  {
    skill: 'speaking',
    category: 'speaking_time_idioms',
    expression: 'once in a while',
    ja_hint: '時々、たまに',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_time_idioms',
    expression: 'from time to time',
    ja_hint: '時々',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_time_idioms',
    expression: 'now and then',
    ja_hint: '時々、たまに',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_time_idioms',
    expression: 'all of a sudden',
    ja_hint: '突然',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_time_idioms',
    expression: 'sooner or later',
    ja_hint: '遅かれ早かれ',
    typing_enabled: true,
  },

  // ==================== Writing - Idioms ====================
  
  // エッセイで使う熟語
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'in other words',
    ja_hint: '言い換えれば',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'on the other hand',
    ja_hint: '一方で',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'as a result',
    ja_hint: '結果として',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'in conclusion',
    ja_hint: '結論として',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'for instance',
    ja_hint: '例えば',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'such as',
    ja_hint: '例えば、〜のような',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'due to',
    ja_hint: '〜が原因で',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'owing to',
    ja_hint: '〜が原因で',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'in spite of',
    ja_hint: '〜にもかかわらず',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_essay_idioms',
    expression: 'regardless of',
    ja_hint: '〜に関係なく',
    typing_enabled: true,
  },
];
