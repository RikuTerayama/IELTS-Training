/**
 * Tokyo基準の日付ユーティリティ
 * サーバ側の「今日判定」は必ずTokyo基準にする（UTCズレ防止）
 */

/**
 * Tokyo基準で今日の日付文字列を取得（YYYY-MM-DD形式）
 */
export function getTokyoDateString(): string {
  const now = new Date();
  // Tokyo timezone (UTC+9)
  const tokyoTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const year = tokyoTime.getFullYear();
  const month = String(tokyoTime.getMonth() + 1).padStart(2, '0');
  const day = String(tokyoTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 日付文字列に指定日数を加算（YYYY-MM-DD形式）
 * 
 * @param dateString YYYY-MM-DD形式の日付文字列
 * @param days 加算する日数（負の値も可）
 * @returns YYYY-MM-DD形式の日付文字列
 */
export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString + 'T00:00:00+09:00'); // Tokyo timezone
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 日付文字列を比較（YYYY-MM-DD形式）
 * 
 * @param date1 日付文字列1
 * @param date2 日付文字列2
 * @returns date1 < date2 なら -1, date1 === date2 なら 0, date1 > date2 なら 1
 */
export function compareDates(date1: string, date2: string): number {
  if (date1 < date2) return -1;
  if (date1 > date2) return 1;
  return 0;
}
