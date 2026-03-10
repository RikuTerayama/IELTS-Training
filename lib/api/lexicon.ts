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
  /** Reading の場合のみ: 全カテゴリの復習Due合計 */
  total_due?: number;
  /** Reading の場合のみ: フィルタ用 topic / difficulty 一覧 */
  filters_meta?: { topics: string[]; difficulties: string[] };
}

export interface LexiconQuestion {
  question_id: string;
  prompt: string;
  choices?: string[];
  hint_first_char?: string;
  hint_length?: number;
  item_id?: string;
  question_type?: 'paraphrase_drill' | 'matching_headings' | 'tfng' | 'summary_completion' | 'matching_information' | 'sentence_completion' | 'signal';
  strategy?: string;
  passage_excerpt?: string;
  meta?: Record<string, unknown>;
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
  skill: 'writing' | 'speaking' | 'reading' | 'listening',
  module: 'lexicon' | 'idiom' | 'vocab' = 'lexicon'
): Promise<ApiResponse<LexiconSetsResponse>> {
  const response = await fetch(`/api/lexicon/sets?skill=${skill}&module=${module}`);
  return response.json();
}

export interface LexiconQuestionsParams {
  review_only?: boolean;
  new_only?: boolean;
  question_type?: string;
  topic?: string;
  difficulty?: string;
}

/**
 * Lexicon questionsを取得
 * Reading の場合: review_only / new_only / topic / difficulty でフィルタ可能
 */
export async function fetchLexiconQuestions(
  skill: 'writing' | 'speaking' | 'reading' | 'listening',
  category: string,
  mode: 'click' | 'typing',
  limit: number = 10,
  module: 'lexicon' | 'idiom' | 'vocab' = 'lexicon',
  params?: LexiconQuestionsParams
): Promise<ApiResponse<LexiconQuestionsResponse>> {
  const search = new URLSearchParams({
    skill,
    category,
    mode,
    limit: String(limit),
    module,
  });
  if ((skill === 'reading' || skill === 'listening') && params) {
    if (params.review_only) search.set('review_only', 'true');
    if (params.new_only) search.set('new_only', 'true');
    if (params.question_type) search.set('question_type', params.question_type);
    if (skill === 'reading') {
      if (params.topic) search.set('topic', params.topic);
      if (params.difficulty) search.set('difficulty', params.difficulty);
    }
  }
  const response = await fetch(`/api/lexicon/questions?${search.toString()}`);
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
