import {
  getUserFacingSubmissionError,
  isUnauthorizedApiResponse,
  redirectToLoginWithNext,
} from './clientError';
import type { ApiResponse } from './response';

export interface LexiconSetsResponse {
  sets: Record<
    string,
    {
      items_total: number;
      items_typing_enabled: number;
      questions_click: number;
      questions_typing: number;
      due_click: number;
      due_typing: number;
    }
  >;
  total_due?: number;
  filters_meta?: { topics: string[]; difficulties: string[] };
}

export interface LexiconQuestion {
  question_id: string;
  prompt: string;
  choices?: string[];
  hint_first_char?: string;
  hint_length?: number;
  item_id?: string;
  question_type?:
    | 'paraphrase_drill'
    | 'matching_headings'
    | 'tfng'
    | 'summary_completion'
    | 'matching_information'
    | 'sentence_completion'
    | 'signal';
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
  weak_skill?: string;
}

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
      if (params.weak_skill) search.set('weak_skill', params.weak_skill);
    }
  }

  const response = await fetch(`/api/lexicon/questions?${search.toString()}`);
  return response.json();
}

export async function submitLexiconAnswer(
  question_id: string,
  user_answer?: string,
  time_ms?: number
): Promise<ApiResponse<LexiconSubmitResponse>> {
  const fallbackMessage =
    '\u9001\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u3082\u3046\u4e00\u5ea6\u62bc\u3057\u3066\u304f\u3060\u3055\u3044\u3002';

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

  const body = (await response.json().catch(() => null)) as ApiResponse<LexiconSubmitResponse> | null;

  if (isUnauthorizedApiResponse(response, body)) {
    redirectToLoginWithNext();
    return {
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message:
          '\u30ed\u30b0\u30a4\u30f3\u304c\u5fc5\u8981\u3067\u3059\u3002\u30ed\u30b0\u30a4\u30f3\u5f8c\u306b\u7d9a\u304d\u304b\u3089\u518d\u958b\u3057\u3066\u304f\u3060\u3055\u3044\u3002',
      },
    };
  }

  if (!response.ok || !body?.ok) {
    const normalizedMessage =
      response.status >= 500 || response.status === 408 || response.status === 429
        ? fallbackMessage
        : getUserFacingSubmissionError(response, body, fallbackMessage);

    return {
      ok: false,
      error: {
        code: body?.error?.code ?? 'REQUEST_FAILED',
        message: normalizedMessage,
        details: body?.error?.details,
      },
    };
  }

  return body;
}
