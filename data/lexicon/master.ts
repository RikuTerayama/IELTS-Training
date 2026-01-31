/**
 * Lexicon Master Data
 * Writing/Speakingで使う必須表現を網羅的に登録
 * 各expressionは最低1問以上の問題に必ず登場する
 */

export interface LexiconMasterItem {
  skill: 'writing' | 'speaking';
  category: string;
  expression: string;
  ja_hint: string;
  typing_enabled: boolean;
  variants?: string[]; // 展開済みバリエーション（例: ["in contrast", "by contrast"]）
  notes?: string; // 任意（例: "whereasは文中のみ"）
}

export const LEXICON_MASTER: LexiconMasterItem[] = [
  // ==================== Writing Task 1 - Graph ====================
  
  // 1文目動詞群
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'show',
    ja_hint: 'グラフが「示す」',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'illustrate',
    ja_hint: 'グラフが「示す」',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'provide information on',
    ja_hint: 'グラフが「情報を提供する」',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'compare in terms of',
    ja_hint: 'グラフが「〜の観点から比較する」',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'display',
    ja_hint: 'グラフが「表示する」',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'give data on',
    ja_hint: 'グラフが「データを与える」',
    typing_enabled: true,
  },
  
  // 数量
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'the number of',
    ja_hint: '〜の数',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'the amount of',
    ja_hint: '〜の量',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'the percentage of',
    ja_hint: '〜の割合',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'the proportion of',
    ja_hint: '〜の割合',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'the share of',
    ja_hint: '〜のシェア',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'the figure for',
    ja_hint: '〜の数値',
    typing_enabled: true,
  },
  
  // 増減・停滞・変動・ピーク/ボトム表現
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'increase',
    ja_hint: '増加する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'rise',
    ja_hint: '上昇する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'grow',
    ja_hint: '成長する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'decline',
    ja_hint: '減少する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'fall',
    ja_hint: '下降する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'decrease',
    ja_hint: '減少する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'remain unchanged',
    ja_hint: '変化しない',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'remain static',
    ja_hint: '変化しない',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'fluctuate',
    ja_hint: '変動する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'vary',
    ja_hint: '変化する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'peak at',
    ja_hint: '〜でピークに達する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'hit the lowest point',
    ja_hint: '最低点に達する',
    typing_enabled: true,
  },
  
  // 程度副詞形容詞
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'significant',
    ja_hint: '重要な',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'significantly',
    ja_hint: '著しく',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'slight',
    ja_hint: 'わずかな',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'slightly',
    ja_hint: 'わずかに',
    typing_enabled: true,
  },
  
  // 比較対照
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'while',
    ja_hint: '一方で（接続詞）',
    typing_enabled: true,
    notes: 'whereasとの使い分け',
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'whereas',
    ja_hint: '一方で（接続詞、文中のみ）',
    typing_enabled: true,
    notes: '文中のみ使用、whileとの使い分け',
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'in contrast',
    ja_hint: '対照的に',
    typing_enabled: true,
    variants: ['by contrast'],
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'by contrast',
    ja_hint: '対照的に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'on the other hand',
    ja_hint: '一方で',
    typing_enabled: true,
  },
  
  // 予測
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'be predicted to',
    ja_hint: '〜と予測される',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'be projected to',
    ja_hint: '〜と予測される',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'be anticipated to',
    ja_hint: '〜と予想される',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'It is likely that',
    ja_hint: '〜する可能性が高い',
    typing_enabled: false, // 可変スロットがあるため
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'It is expected that',
    ja_hint: '〜が期待される',
    typing_enabled: false, // 可変スロットがあるため
  },
  
  // 数値パラフレーズ
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'a fifth',
    ja_hint: '5分の1',
    typing_enabled: true,
    variants: ['one fifth'],
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'one fifth',
    ja_hint: '5分の1',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'a quarter',
    ja_hint: '4分の1',
    typing_enabled: true,
    variants: ['one quarter'],
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'one quarter',
    ja_hint: '4分の1',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'slightly under a third',
    ja_hint: '3分の1をわずかに下回る',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'roughly a third',
    ja_hint: '約3分の1',
    typing_enabled: true,
    variants: ['approximately a third', 'about a third'],
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'nearly a half',
    ja_hint: 'ほぼ半分',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'around two thirds',
    ja_hint: '約3分の2',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'three quarters',
    ja_hint: '4分の3',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_graph',
    expression: 'well over three quarters',
    ja_hint: '4分の3を大幅に超える',
    typing_enabled: true,
  },
  
  // ==================== Writing Task 1 - Diagram ====================
  
  {
    skill: 'writing',
    category: 'writing_task1_diagram',
    expression: 'to the north of',
    ja_hint: '〜の北に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_diagram',
    expression: 'to the south of',
    ja_hint: '〜の南に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_diagram',
    expression: 'to the east of',
    ja_hint: '〜の東に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_diagram',
    expression: 'to the west of',
    ja_hint: '〜の西に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_diagram',
    expression: 'on the left',
    ja_hint: '左側に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_diagram',
    expression: 'on the right',
    ja_hint: '右側に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_diagram',
    expression: 'at the top',
    ja_hint: '上部に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_diagram',
    expression: 'at the bottom',
    ja_hint: '下部に',
    typing_enabled: true,
  },
  
  // ==================== Writing Task 1 - Process ====================
  
  {
    skill: 'writing',
    category: 'writing_task1_process',
    expression: 'stage',
    ja_hint: '段階',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_process',
    expression: 'step',
    ja_hint: 'ステップ',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_process',
    expression: 'phase',
    ja_hint: 'フェーズ',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_process',
    expression: 'produce',
    ja_hint: '生産する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_process',
    expression: 'involve',
    ja_hint: '含む',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_process',
    expression: 'separate',
    ja_hint: '分離する',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_process',
    expression: 'first',
    ja_hint: '最初に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_process',
    expression: 'then',
    ja_hint: '次に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_process',
    expression: 'finally',
    ja_hint: '最後に',
    typing_enabled: true,
  },
  
  // ==================== Writing Task 1 - Phrases ====================
  
  {
    skill: 'writing',
    category: 'writing_task1_phrases',
    expression: 'Overall',
    ja_hint: '全体的に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_phrases',
    expression: 'In general',
    ja_hint: '一般的に',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_phrases',
    expression: 'Generally speaking',
    ja_hint: '一般的に言えば',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task1_phrases',
    expression: 'On the whole',
    ja_hint: '全体的に',
    typing_enabled: true,
  },
  
  // ==================== Writing Task 2 - Phrases ====================
  
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'In my opinion',
    ja_hint: '私の意見では',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'I believe',
    ja_hint: '私は信じる',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'I think',
    ja_hint: '私は思う',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'From my perspective',
    ja_hint: '私の視点から',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'On the one hand',
    ja_hint: '一方では',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'On the other hand',
    ja_hint: '他方では',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'However',
    ja_hint: 'しかし',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'Nevertheless',
    ja_hint: 'それにもかかわらず',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'Moreover',
    ja_hint: 'さらに',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'Furthermore',
    ja_hint: 'さらに',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'In conclusion',
    ja_hint: '結論として',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'To sum up',
    ja_hint: '要約すると',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'In summary',
    ja_hint: '要約すると',
    typing_enabled: true,
  },
  {
    skill: 'writing',
    category: 'writing_task2_phrases',
    expression: 'To conclude',
    ja_hint: '結論として',
    typing_enabled: true,
  },
  
  // ==================== Speaking - Cohesion ====================
  
  {
    skill: 'speaking',
    category: 'speaking_cohesion',
    expression: 'And',
    ja_hint: 'そして',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_cohesion',
    expression: 'But',
    ja_hint: 'しかし',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_cohesion',
    expression: 'So',
    ja_hint: 'だから',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_cohesion',
    expression: 'Because',
    ja_hint: 'なぜなら',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_cohesion',
    expression: 'Although',
    ja_hint: '〜にもかかわらず',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_cohesion',
    expression: 'While',
    ja_hint: '一方で',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_cohesion',
    expression: 'Since',
    ja_hint: '〜以来',
    typing_enabled: true,
  },
  
  // ==================== Speaking - Fluency ====================
  
  {
    skill: 'speaking',
    category: 'speaking_fluency',
    expression: 'Well',
    ja_hint: 'えーと',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_fluency',
    expression: 'Actually',
    ja_hint: '実際には',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_fluency',
    expression: 'I mean',
    ja_hint: 'つまり',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_fluency',
    expression: 'You know',
    ja_hint: 'ほら',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_fluency',
    expression: 'Let me see',
    ja_hint: 'えーと',
    typing_enabled: true,
  },
  
  // ==================== Speaking - Chunks ====================
  
  {
    skill: 'speaking',
    category: 'speaking_chunks',
    expression: 'seem to',
    ja_hint: '〜のようだ',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_chunks',
    expression: 'may',
    ja_hint: '〜かもしれない',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_chunks',
    expression: 'generally',
    ja_hint: '一般的に',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_chunks',
    expression: 'however',
    ja_hint: 'しかし',
    typing_enabled: true,
  },
  {
    skill: 'speaking',
    category: 'speaking_chunks',
    expression: 'furthermore',
    ja_hint: 'さらに',
    typing_enabled: true,
  },
];
