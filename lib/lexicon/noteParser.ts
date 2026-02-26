/**
 * Writing/Speaking Noteパーサ
 * ws_note.md から語彙・熟語・定型表現を抽出
 */

import { normalizeExpression } from './normalize';

export interface ParsedLexiconItem {
  skill: 'writing' | 'speaking';
  category: string;
  expression: string;
  typing_enabled: boolean;
}

/**
 * 見出しからskillを推定
 */
function inferSkillFromHeading(heading: string): 'writing' | 'speaking' {
  const lowerHeading = heading.toLowerCase();
  
  // Speakingセクション以降はspeaking
  if (lowerHeading.includes('speaking')) {
    return 'speaking';
  }
  
  // Task1/Task2/Essay/graph/diagram/process は writing
  if (
    lowerHeading.includes('task 1') ||
    lowerHeading.includes('task 2') ||
    lowerHeading.includes('essay') ||
    lowerHeading.includes('graph') ||
    lowerHeading.includes('diagram') ||
    lowerHeading.includes('process')
  ) {
    return 'writing';
  }
  
  // デフォルトはwriting
  return 'writing';
}

/**
 * 見出しからcategoryを生成（snake_case化）
 */
function generateCategoryFromHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // 英数字とスペース以外を削除
    .replace(/\s+/g, '_')          // スペースをアンダースコアに
    .replace(/^_+|_+$/g, '');      // 前後のアンダースコアを削除
}

/**
 * 括弧内代替を展開（最低限の2種）
 * - "in(by) contrast" → ["in contrast", "by contrast"]
 * - "a(one) third" → ["a third", "one third"]
 */
function expandParentheses(expression: string): string[] {
  // "in(by) contrast" パターン
  const pattern1 = /(\w+)\((\w+)\)\s+(\w+)/;
  const match1 = expression.match(pattern1);
  
  if (match1) {
    const before = expression.substring(0, match1.index!);
    const after = expression.substring(match1.index! + match1[0].length);
    const prefix = match1[1];
    const alt = match1[2];
    const suffix = match1[3];
    
    return [
      `${before}${prefix} ${suffix}${after}`.trim(),
      `${before}${alt} ${suffix}${after}`.trim(),
    ];
  }
  
  // "a(one) third" パターン（同じパターンで処理可能）
  // 上記でマッチしなかった場合はそのまま返す
  return [expression];
}

/**
 * 可変スロット表現を検出（"—", "…" を含む）
 */
function hasVariableSlot(expression: string): boolean {
  return expression.includes('—') || expression.includes('…') || expression.includes('...');
}

/**
 * 行から表現を抽出
 */
function extractExpressionsFromLine(line: string): string[] {
  // 英字を含む行のみ処理
  if (!/[a-zA-Z]/.test(line)) {
    return [];
  }
  
  // カンマ区切り、スラッシュ区切りで分割
  // ただし "and then" のような固定表現は壊さない（簡易実装）
  const separators = /[,/]/;
  const parts = line.split(separators);
  
  const expressions: string[] = [];
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed && /[a-zA-Z]/.test(trimmed)) {
      // 括弧内代替を展開
      const expanded = expandParentheses(trimmed);
      expressions.push(...expanded);
    }
  }
  
  return expressions.length > 0 ? expressions : [line.trim()];
}

/**
 * ws_note.md をパースしてLexiconアイテムを抽出
 * 
 * @param noteContent ws_note.md の内容
 * @returns パースされたLexiconアイテムの配列
 */
export function parseNote(noteContent: string): ParsedLexiconItem[] {
  const lines = noteContent.split('\n');
  const items: ParsedLexiconItem[] = [];
  
  let currentSkill: 'writing' | 'speaking' = 'writing';
  let currentCategory = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // 空行はスキップ
    if (!trimmed) {
      continue;
    }
    
    // 見出し（# で始まる）を検出
    if (trimmed.startsWith('#')) {
      const heading = trimmed.replace(/^#+\s*/, '');
      currentSkill = inferSkillFromHeading(heading);
      currentCategory = generateCategoryFromHeading(heading);
      continue;
    }
    
    // サブ見出し（## で始まる）を検出
    if (trimmed.startsWith('##')) {
      const heading = trimmed.replace(/^#+\s*/, '');
      // サブ見出しはcategoryを更新（親見出し + サブ見出し）
      const parentCategory = currentCategory;
      const subCategory = generateCategoryFromHeading(heading);
      currentCategory = parentCategory ? `${parentCategory}_${subCategory}` : subCategory;
      continue;
    }
    
    // 表現を抽出
    const expressions = extractExpressionsFromLine(trimmed);
    
    for (const expression of expressions) {
      if (!expression || !/[a-zA-Z]/.test(expression)) {
        continue;
      }
      
      // 可変スロット表現は typing_enabled=false
      const typingEnabled = !hasVariableSlot(expression);
      
      // categoryが空の場合はデフォルト
      const category = currentCategory || 'general';
      
      items.push({
        skill: currentSkill,
        category,
        expression: expression.trim(),
        typing_enabled: typingEnabled,
      });
    }
  }
  
  return items;
}
