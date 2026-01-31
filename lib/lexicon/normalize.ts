/**
 * 表現の正規化
 * - lower case
 * - trim
 * - 連続空白を1つに
 * - 末尾の句読点（. , ; :）を除去
 * - ハイフンとアポストロフィは保持
 */

/**
 * 表現を正規化する
 * 
 * @param expression 元の表現
 * @returns 正規化された表現
 */
export function normalizeExpression(expression: string): string {
  let normalized = expression
    .toLowerCase()           // 小文字化
    .trim()                  // 前後の空白を削除
    .replace(/\s+/g, ' ')    // 連続空白を1つに
    .replace(/[.,;:]$/, ''); // 末尾の句読点を除去

  return normalized;
}

/**
 * ヒントの長さを計算（スペースを除いた文字数）
 * 
 * @param normalized 正規化された表現
 * @returns ヒントの長さ
 */
export function calculateHintLength(normalized: string): number {
  return normalized.replace(/\s/g, '').length;
}

/**
 * ヒントの先頭文字を取得
 * 
 * @param normalized 正規化された表現
 * @returns 先頭文字
 */
export function getHintFirstChar(normalized: string): string {
  return normalized.charAt(0).toUpperCase();
}
