/**
 * 穴埋め問題生成ロジック（共通関数）
 * サーバーサイドとクライアントサイドの両方で使用可能
 */

import type { FillInQuestion } from './types';

/**
 * 簡易ルールベースで穴埋め問題を生成
 * 後でLLMに移行可能な設計
 */
export function generateFillInQuestions(
  userResponseText: string,
  attemptId: string,
  level: 'beginner' | 'intermediate' | 'advanced'
): FillInQuestion[] {
  const questions: FillInQuestion[] = [];
  const text = userResponseText.toLowerCase();

  // CC（接続詞/指示語）問題の生成
  // 簡易ルール: "however", "therefore", "moreover" などの接続詞が少ない場合
  const connectors = ['however', 'therefore', 'moreover', 'furthermore', 'nevertheless', 'consequently'];
  const hasConnectors = connectors.some(conn => text.includes(conn));
  
  if (!hasConnectors && questions.length < 3) {
    questions.push({
      id: `q-${attemptId}-cc-1`,
      attempt_id: attemptId,
      question_type: 'CC',
      question_text: 'People do not need to commute. [    ] they can save time for other activities.',
      options: [
        { id: 'A', text: 'However' },
        { id: 'B', text: 'Therefore' },
        { id: 'C', text: 'Although' },
        { id: 'D', text: 'Meanwhile' },
      ],
      correct_answer: 'B',
    });
  }

  // LR（言い換え）問題の生成
  // 簡易ルール: "important", "good", "bad", "poor" などの基本的な語彙が使われている場合
  const basicWords = ['important', 'good', 'bad', 'poor', 'big', 'small', 'many', 'much'];
  const hasBasicWords = basicWords.some(word => text.includes(word));
  
  if (hasBasicWords && questions.length < 3) {
    questions.push({
      id: `q-${attemptId}-lr-1`,
      attempt_id: attemptId,
      question_type: 'LR',
      question_text: 'Students from [    ] families can study without worrying about money.',
      options: [
        { id: 'A', text: 'low-income' },
        { id: 'B', text: 'poor' },
        { id: 'C', text: 'bad' },
        { id: 'D', text: 'small' },
      ],
      correct_answer: 'A',
    });
  }

  // GRA（文結合）問題の生成
  // 簡易ルール: 短い文が多い場合（句読点で分割して、平均文長が短い）
  const sentences = userResponseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0
    ? sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length
    : 0;
  
  if (avgSentenceLength < 15 && avgSentenceLength > 0 && questions.length < 3) {
    questions.push({
      id: `q-${attemptId}-gra-1`,
      attempt_id: attemptId,
      question_type: 'GRA',
      question_text: 'Choose the best way to combine these two sentences:\n\n"Many people work from home. They can save time."',
      options: [
        { id: 'A', text: 'Many people work from home, which allows them to save time.' },
        { id: 'B', text: 'Many people work from home. They can save time.' },
        { id: 'C', text: 'Many people work from home, they can save time.' },
        { id: 'D', text: 'Many people work from home and they can save time.' },
      ],
      correct_answer: 'A',
    });
  }

  // 問題が1問も生成されなかった場合、デフォルト問題を追加
  if (questions.length === 0) {
    questions.push({
      id: `q-${attemptId}-cc-default`,
      attempt_id: attemptId,
      question_type: 'CC',
      question_text: 'Working from home has many advantages. [    ], it allows people to save time on commuting.',
      options: [
        { id: 'A', text: 'However' },
        { id: 'B', text: 'Therefore' },
        { id: 'C', text: 'For example' },
        { id: 'D', text: 'Although' },
      ],
      correct_answer: 'C',
    });
  }

  return questions;
}

