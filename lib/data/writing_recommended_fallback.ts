/**
 * AC-X1: Writing 推奨表現が API で空の場合のフォールバック（vocab/idiom 由来）
 */

export const WRITING_RECOMMENDED_FALLBACK: { module: 'lexicon' | 'idiom' | 'vocab'; expression: string; ja_hint?: string }[] = [
  { module: 'vocab', expression: 'in terms of', ja_hint: '〜の点では' },
  { module: 'idiom', expression: 'on the other hand', ja_hint: '一方で' },
  { module: 'vocab', expression: 'as a result', ja_hint: 'その結果' },
  { module: 'vocab', expression: 'for instance', ja_hint: '例えば' },
  { module: 'vocab', expression: 'it depends on', ja_hint: '〜次第です' },
];
