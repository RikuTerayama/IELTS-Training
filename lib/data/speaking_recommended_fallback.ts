/**
 * AC-S3: 推奨表現がAPIで空の場合のUIフォールバック（vocab/idiom 由来の表現例）
 */

export const RECOMMENDED_EXPRESSIONS_FALLBACK: { expression: string; ja_hint?: string }[] = [
  { expression: 'in terms of', ja_hint: '〜の点では' },
  { expression: 'on the other hand', ja_hint: '一方で' },
  { expression: 'as a result', ja_hint: 'その結果' },
  { expression: 'for instance', ja_hint: '例えば' },
  { expression: 'it depends on', ja_hint: '〜次第です' },
  { expression: 'to sum up', ja_hint: 'まとめると' },
  { expression: 'take ... for granted', ja_hint: '〜を当然と思う' },
  { expression: 'play a key role', ja_hint: '重要な役割を果たす' },
];
