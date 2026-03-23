import type { ApiResponse } from './response';

type ApiErrorBody = ApiResponse<unknown> | null | undefined;

export function isUnauthorizedApiResponse(
  response: { status: number },
  body?: ApiErrorBody
): boolean {
  return response.status === 401 || body?.error?.code === 'UNAUTHORIZED';
}

export function redirectToLoginWithNext(nextPath?: string): void {
  if (typeof window === 'undefined') return;

  const fallbackNext = `${window.location.pathname}${window.location.search}`;
  const safeNext = nextPath && nextPath.startsWith('/') ? nextPath : fallbackNext;
  const loginUrl = `/login?next=${encodeURIComponent(safeNext)}`;

  window.location.assign(loginUrl);
}

export function getUserFacingSubmissionError(
  response: { status: number },
  body?: ApiErrorBody,
  fallbackMessage = '\u9001\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u5165\u529b\u5185\u5bb9\u3092\u78ba\u8a8d\u3057\u3066\u3001\u3082\u3046\u4e00\u5ea6\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002'
): string {
  const code = body?.error?.code;
  const message = body?.error?.message;

  if (isUnauthorizedApiResponse(response, body)) {
    return '\u30ed\u30b0\u30a4\u30f3\u304c\u5fc5\u8981\u3067\u3059\u3002\u30ed\u30b0\u30a4\u30f3\u5f8c\u306b\u7d9a\u304d\u304b\u3089\u518d\u958b\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
  }

  if (response.status === 400 || code === 'BAD_REQUEST') {
    if (!message) return fallbackMessage;

    if (
      message === 'Invalid request body' ||
      message === 'Submission payload is invalid' ||
      message === 'Submission payload is not valid JSON'
    ) {
      return fallbackMessage;
    }

    if (
      message === 'Answer text is required' ||
      /required/i.test(message) ||
      /invalid/i.test(message)
    ) {
      return fallbackMessage;
    }
  }

  return message || fallbackMessage;
}

export function getUserFacingTranscriptionError(
  response: { status: number },
  body?: ApiErrorBody,
  fallbackMessage = '\u6587\u5b57\u8d77\u3053\u3057\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u3082\u3046\u4e00\u5ea6\u9332\u97f3\u3059\u308b\u304b\u3001\u30c6\u30ad\u30b9\u30c8\u3067\u56de\u7b54\u3057\u3066\u304f\u3060\u3055\u3044\u3002'
): string {
  const code = body?.error?.code;

  if (isUnauthorizedApiResponse(response, body)) {
    return '\u30ed\u30b0\u30a4\u30f3\u304c\u5fc5\u8981\u3067\u3059\u3002\u30ed\u30b0\u30a4\u30f3\u5f8c\u306b\u7d9a\u304d\u304b\u3089\u518d\u958b\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
  }

  if (response.status === 413 || code === 'PAYLOAD_TOO_LARGE') {
    return '\u97f3\u58f0\u304c\u9577\u3059\u304e\u308b\u304b\u5927\u304d\u3059\u304e\u307e\u3059\u3002\u77ed\u3081\u306b\u9332\u97f3\u3057\u76f4\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
  }

  if (response.status === 415 || code === 'UNSUPPORTED_MEDIA_TYPE') {
    return '\u3053\u306e\u97f3\u58f0\u5f62\u5f0f\u306b\u306f\u5bfe\u5fdc\u3057\u3066\u3044\u307e\u305b\u3093\u3002\u3082\u3046\u4e00\u5ea6\u9332\u97f3\u3059\u308b\u304b\u3001\u30c6\u30ad\u30b9\u30c8\u3067\u56de\u7b54\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
  }

  if (response.status === 503 || code === 'SERVICE_UNAVAILABLE') {
    return '\u73fe\u5728\u306f\u97f3\u58f0\u5165\u529b\u3092\u4f7f\u3048\u307e\u305b\u3093\u3002\u30c6\u30ad\u30b9\u30c8\u56de\u7b54\u3067\u7d9a\u3051\u3066\u304f\u3060\u3055\u3044\u3002';
  }

  if (response.status === 504 || code === 'UPSTREAM_TIMEOUT') {
    return '\u6587\u5b57\u8d77\u3053\u3057\u306b\u6642\u9593\u304c\u304b\u304b\u3063\u3066\u3044\u307e\u3059\u3002\u3082\u3046\u4e00\u5ea6\u9332\u97f3\u3059\u308b\u304b\u3001\u30c6\u30ad\u30b9\u30c8\u3067\u56de\u7b54\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
  }

  if (response.status === 400 || code === 'BAD_REQUEST' || code === 'TRANSCRIPTION_FAILED') {
    return fallbackMessage;
  }

  return fallbackMessage;
}
