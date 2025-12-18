/**
 * LLMレスポンスのJSON抽出/バリデーション/リトライ
 */

import type { LLMResponse } from '@/lib/domain/types';

/**
 * LLMレスポンスがJSONかチェック
 */
export function isLLMResponse(obj: unknown): obj is LLMResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as LLMResponse).schema_version === 'string'
  );
}

/**
 * テキストからJSON部分を抽出
 * LLMがJSON以外のテキストを含む場合に対応
 */
export function extractJSON(text: string): unknown {
  // JSONブロックを探す（```json ... ``` または { ... }）
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    return JSON.parse(jsonBlockMatch[1]);
  }

  // 最初の { から最後の } までを抽出
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonText = text.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonText);
  }

  // そのままパースを試みる
  return JSON.parse(text);
}

/**
 * JSONパースとリトライ（最大3回）
 */
export async function parseLLMResponseWithRetry(
  getResponse: () => Promise<string>,
  maxRetries: number = 3
): Promise<unknown> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await getResponse();
      const parsed = extractJSON(response);

      // schema_versionチェック
      if (!isLLMResponse(parsed)) {
        throw new Error('Missing schema_version in LLM response');
      }

      return parsed;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i === maxRetries - 1) {
        throw new Error(
          `LLM call failed after ${maxRetries} retries: ${lastError.message}`
        );
      }

      // リトライ前に少し待機（指数バックオフ）
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw new Error('Unexpected error in parseLLMResponseWithRetry');
}

