/**
 * Task1関連のヘルパー関数
 */

import { detectTask1Genre } from './task1Image';

/**
 * Task1のジャンル名を日本語で取得
 */
export function getTask1GenreName(question: string): string {
  const genre = detectTask1Genre(question);
  
  const genreNames: Record<string, string> = {
    line_chart: 'ラインチャート',
    bar_chart: '棒グラフ',
    pie_chart: '円グラフ',
    table: '表',
    multiple_charts: '複数の図表',
    diagram: 'ダイアグラム',
    map: '地図',
  };
  
  return genre ? genreNames[genre] || 'グラフ・図表' : 'グラフ・図表';
}

/**
 * Task1のジャンル名を英語で取得（より具体的な表現用）
 */
export function getTask1GenreNameEnglish(question: string): string {
  const genre = detectTask1Genre(question);
  
  const genreNames: Record<string, string> = {
    line_chart: 'このラインチャート',
    bar_chart: 'この棒グラフ',
    pie_chart: 'この円グラフ',
    table: 'この表',
    multiple_charts: 'これらの図表',
    diagram: 'このダイアグラム',
    map: 'この地図',
  };
  
  return genre ? genreNames[genre] || 'このグラフ・図表' : 'このグラフ・図表';
}

/**
 * テキストの語数をカウント（IELTS基準）
 */
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  // 連続する空白で分割し、空文字列を除外
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * 段落数をカウント
 */
export function countParagraphs(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  // 空行で分割し、空文字列を除外
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  return paragraphs.length > 0 ? paragraphs.length : 1; // 最低1段落
}

/**
 * テキストから数字を抽出
 */
export function extractNumbers(text: string): Array<{ value: string; context: string }> {
  if (!text || text.trim().length === 0) return [];
  
  const numbers: Array<{ value: string; context: string }> = [];
  
  // パターン: 数字（整数、小数、パーセント、単位付き）
  const numberPattern = /\b(\d+(?:\.\d+)?)\s*([%]|million|billion|thousand|years?|months?|days?)?\b/gi;
  
  // 文単位で分割
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  sentences.forEach((sentence, sentenceIndex) => {
    let match;
    while ((match = numberPattern.exec(sentence)) !== null) {
      const value = match[1] + (match[2] || '');
      const context = sentence.trim().substring(0, 100); // 最大100文字
      numbers.push({ value, context });
    }
  });
  
  return numbers;
}

/**
 * チェックリスト項目を自動判定
 */
export function evaluateChecklist(text: string): {
  has_overview: boolean;
  has_comparison: boolean;
  has_numbers: boolean;
  has_paragraphs: boolean;
  word_count_ok: boolean;
  tense_consistent: boolean;
} {
  if (!text || text.trim().length === 0) {
    return {
      has_overview: false,
      has_comparison: false,
      has_numbers: false,
      has_paragraphs: false,
      word_count_ok: false,
      tense_consistent: true, // 空なら一貫しているとみなす
    };
  }

  const wordCount = countWords(text);
  const paragraphCount = countParagraphs(text);
  const extractedNumbers = extractNumbers(text);

  // Overviewの検出（"overall", "in general", "generally", "summary"などのキーワード）
  const overviewKeywords = /\b(overall|in general|generally|summary|to summarize|in summary|in conclusion)\b/i;
  const has_overview = overviewKeywords.test(text);

  // 比較表現の検出
  const comparisonKeywords = /\b(compared to|compared with|in contrast|whereas|while|however|on the other hand|similarly|likewise|more than|less than|higher|lower|increase|decrease)\b/i;
  const has_comparison = comparisonKeywords.test(text);

  // 数字の有無
  const has_numbers = extractedNumbers.length > 0;

  // 段落の有無（2段落以上）
  const has_paragraphs = paragraphCount >= 2;

  // 語数チェック（150-200語が理想、ただし100-250語の範囲ならOK）
  const word_count_ok = wordCount >= 100 && wordCount <= 250;

  // 時制の一貫性（簡易版：過去形と現在形の混在をチェック）
  const pastTensePattern = /\b(was|were|had|did|went|came|became|increased|decreased|rose|fell)\b/i;
  const presentTensePattern = /\b(is|are|has|have|do|does|go|come|become|increases|decreases|rises|falls)\b/i;
  const hasPastTense = pastTensePattern.test(text);
  const hasPresentTense = presentTensePattern.test(text);
  // 両方ある場合は不整合の可能性（ただし、Task 1では過去のデータを現在形で説明することもあるので、厳密ではない）
  const tense_consistent = !(hasPastTense && hasPresentTense) || text.toLowerCase().includes('shows') || text.toLowerCase().includes('illustrates');

  return {
    has_overview,
    has_comparison,
    has_numbers,
    has_paragraphs,
    word_count_ok,
    tense_consistent,
  };
}

