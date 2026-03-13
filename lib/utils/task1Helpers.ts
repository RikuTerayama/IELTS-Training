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

  const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
  return words.length;
}

/**
 * 段落数をカウント
 */
export function countParagraphs(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  const paragraphs = text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0);
  return paragraphs.length > 0 ? paragraphs.length : 1;
}

/**
 * テキストから数字を抽出
 */
export function extractNumbers(text: string): Array<{ value: string; context: string }> {
  if (!text || text.trim().length === 0) return [];

  const numbers: Array<{ value: string; context: string }> = [];
  const numberPattern = /\b(\d+(?:\.\d+)?)\s*([%]|million|billion|thousand|years?|months?|days?)?\b/gi;
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0);

  sentences.forEach((sentence) => {
    let match: RegExpExecArray | null;
    while ((match = numberPattern.exec(sentence)) !== null) {
      const value = match[1] + (match[2] || '');
      const context = sentence.trim().substring(0, 100);
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
      tense_consistent: true,
    };
  }

  const wordCount = countWords(text);
  const paragraphCount = countParagraphs(text);
  const extractedNumbers = extractNumbers(text);
  const overviewKeywords = /\b(overall|in general|generally|summary|to summarize|in summary|in conclusion)\b/i;
  const comparisonKeywords = /\b(compared to|compared with|in contrast|whereas|while|however|on the other hand|similarly|likewise|more than|less than|higher|lower|increase|decrease)\b/i;
  const pastTensePattern = /\b(was|were|had|did|went|came|became|increased|decreased|rose|fell)\b/i;
  const presentTensePattern = /\b(is|are|has|have|do|does|go|come|become|increases|decreases|rises|falls)\b/i;
  const hasPastTense = pastTensePattern.test(text);
  const hasPresentTense = presentTensePattern.test(text);

  return {
    has_overview: overviewKeywords.test(text),
    has_comparison: comparisonKeywords.test(text),
    has_numbers: extractedNumbers.length > 0,
    has_paragraphs: paragraphCount >= 2,
    word_count_ok: wordCount >= 100 && wordCount <= 250,
    tense_consistent:
      !(hasPastTense && hasPresentTense) ||
      text.toLowerCase().includes('shows') ||
      text.toLowerCase().includes('illustrates'),
  };
}
