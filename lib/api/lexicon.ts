/**
 * Lexicon API クライアント
 */

import type { ApiResponse } from './response';

export interface LexiconSetsResponse {
  sets: Record<string, {
    items_total: number;
    items_typing_enabled: number;
    questions_click: number;
    questions_typing: number;
    due_click: number;
    due_typing: number;
  }>;
}

export interface LexiconQuestion {
  question_id: string;
  prompt: string;
  choices?: string[];
  hint_first_char?: string;
  hint_length?: number;
  item_id?: string;
}

export interface LexiconQuestionsResponse {
  questions: LexiconQuestion[];
}

export interface LexiconSubmitRequest {
  question_id: string;
  user_answer?: string;
  time_ms?: number;
}

export interface LexiconSubmitResponse {
  is_correct: boolean;
  correct_expression: string;
}

/**
 * Lexicon setsを取得
 */
export async function fetchLexiconSets(
  skill: 'writing' | 'speaking',
  module: 'lexicon' | 'idiom' = 'lexicon'
): Promise<ApiResponse<LexiconSetsResponse>> {
  const response = await fetch(`/api/lexicon/sets?skill=${skill}&module=${module}`);
  return response.json();
}

/**
 * Lexicon questionsを取得
 */
export async function fetchLexiconQuestions(
  skill: 'writing' | 'speaking',
  category: string,
  mode: 'click' | 'typing',
  limit: number = 10,
  module: 'lexicon' | 'idiom' = 'lexicon'
): Promise<ApiResponse<LexiconQuestionsResponse>> {
  const response = await fetch(
    `/api/lexicon/questions?skill=${skill}&category=${category}&mode=${mode}&limit=${limit}&module=${module}`
  );
  return response.json();
}

/**
 * Lexicon回答を送信
 */
export async function submitLexiconAnswer(
  question_id: string,
  user_answer?: string,
  time_ms?: number
): Promise<ApiResponse<LexiconSubmitResponse>> {
  const response = await fetch('/api/lexicon/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question_id,
      user_answer,
      time_ms,
    }),
  });
  return response.json();
}
