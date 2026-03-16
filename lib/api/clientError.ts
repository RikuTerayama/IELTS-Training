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
  fallbackMessage = '送信に失敗しました。入力内容を確認して、もう一度お試しください。'
): string {
  const code = body?.error?.code;
  const message = body?.error?.message;

  if (isUnauthorizedApiResponse(response, body)) {
    return 'ログインが必要です。ログイン後に続きから再開してください。';
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
