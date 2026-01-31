/**
 * Vocab Master Data
 * Writing/Speakingで使う必須単語を網羅的に登録
 * 各expressionは最低1問以上の問題に必ず登場する
 */

export interface VocabMasterItem {
  skill: 'writing' | 'speaking';
  category: string;
  expression: string;
  ja_hint: string;
  typing_enabled: boolean;
  variants?: string[]; // 展開済みバリエーション
  notes?: string; // 任意
}

export const VOCAB_MASTER: VocabMasterItem[] = [
  // ==================== Writing Task 1 - Vocab ====================
  
  // グラフ・図表でよく使う単語
  {
    skill: 'writing',
    category: 'vocab_task1',
    expression: 'significant',
    ja_hint: '重要な、著しい',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task1',
    expression: 'substantial',
    ja_hint: '相当な、かなりの',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task1',
    expression: 'dramatic',
    ja_hint: '劇的な、急激な',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task1',
    expression: 'gradual',
    ja_hint: '徐々の、段階的な',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task1',
    expression: 'steady',
    ja_hint: '安定した、着実な',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task1',
    expression: 'fluctuate',
    ja_hint: '変動する、上下する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task1',
    expression: 'peak',
    ja_hint: 'ピーク、頂点',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task1',
    expression: 'decline',
    ja_hint: '減少する、下降する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task1',
    expression: 'surge',
    ja_hint: '急増する、急上昇する',
    typing_enabled: true,
  },

  // ==================== Writing Task 2 - Vocab ====================
  
  // エッセイでよく使う単語
  {
    skill: 'writing',
    category: 'vocab_task2',
    expression: 'controversial',
    ja_hint: '論争の的となる、物議を醸す',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task2',
    expression: 'beneficial',
    ja_hint: '有益な、有利な',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task2',
    expression: 'detrimental',
    ja_hint: '有害な、損害を与える',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task2',
    expression: 'inevitable',
    ja_hint: '避けられない、必然的な',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task2',
    expression: 'crucial',
    ja_hint: '極めて重要な、決定的な',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task2',
    expression: 'essential',
    ja_hint: '不可欠な、必須の',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task2',
    expression: 'considerable',
    ja_hint: 'かなりの、相当な',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task2',
    expression: 'widespread',
    ja_hint: '広範囲にわたる、普及した',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_task2',
    expression: 'prevalent',
    ja_hint: '広く普及している、一般的な',
    typing_enabled: true,
  },

  // ==================== Speaking - Vocab ====================
  
  // 日常会話でよく使う単語
  {
    skill: 'speaking',
    category: 'vocab_speaking',
    expression: 'convenient',
    ja_hint: '便利な、都合の良い',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'vocab_speaking',
    expression: 'efficient',
    ja_hint: '効率的な、能率的な',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'vocab_speaking',
    expression: 'flexible',
    ja_hint: '柔軟な、融通の利く',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'vocab_speaking',
    expression: 'reliable',
    ja_hint: '信頼できる、頼りになる',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'vocab_speaking',
    expression: 'affordable',
    ja_hint: '手頃な価格の、購入可能な',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'vocab_speaking',
    expression: 'sustainable',
    ja_hint: '持続可能な、維持できる',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'vocab_speaking',
    expression: 'accessible',
    ja_hint: 'アクセスしやすい、利用しやすい',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'vocab_speaking',
    expression: 'versatile',
    ja_hint: '多用途の、融通の利く',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'vocab_speaking',
    expression: 'practical',
    ja_hint: '実用的な、実際的な',
    typing_enabled: true,
  },

  // ==================== General Vocab ====================
  
  // 汎用的によく使う単語
  {
    skill: 'writing',
    category: 'vocab_general',
    expression: 'analyze',
    ja_hint: '分析する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_general',
    expression: 'evaluate',
    ja_hint: '評価する、査定する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_general',
    expression: 'implement',
    ja_hint: '実施する、実行する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_general',
    expression: 'enhance',
    ja_hint: '向上させる、強化する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_general',
    expression: 'facilitate',
    ja_hint: '促進する、容易にする',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_general',
    expression: 'maintain',
    ja_hint: '維持する、保持する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_general',
    expression: 'achieve',
    ja_hint: '達成する、成し遂げる',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_general',
    expression: 'establish',
    ja_hint: '確立する、設立する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'vocab_general',
    expression: 'demonstrate',
    ja_hint: '実証する、示す',
    typing_enabled: true,
  },
];
