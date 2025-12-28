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

