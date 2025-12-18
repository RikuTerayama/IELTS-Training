/**
 * 統一APIレスポンス形式
 * 全APIレスポンスはこの形式に統一する
 */
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * 成功レスポンスを生成
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    ok: true,
    data,
  };
}

/**
 * エラーレスポンスを生成
 */
export function errorResponse(
  code: string,
  message: string,
  details?: unknown
): ApiResponse<never> {
  return {
    ok: false,
    error: {
      code,
      message,
      details,
    },
  };
}

/**
 * エラーハンドリング共通関数
 */
export function handleApiError(error: unknown): ApiResponse<never> {
  if (error instanceof Error) {
    return errorResponse('INTERNAL_ERROR', error.message);
  }

  return errorResponse('UNKNOWN_ERROR', 'An unknown error occurred');
}

