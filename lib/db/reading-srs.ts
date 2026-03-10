/**
 * Reading SRS 状態テーブル (reading_srs_state) の型と共通集計
 * Home / training / progress で同じ前提の Due 集計を行う
 */

import type { createClient } from '@/lib/supabase/server';
import { getTokyoDateString } from '@/lib/utils/dateTokyo';

/** reading_srs_state の行型（DB スキーマに合わせる） */
export interface ReadingSrsStateRow {
  id: string;
  user_id: string;
  question_id: string;
  mode: 'click' | 'typing';
  stage: number;
  next_review_on: string;
  last_review_on: string | null;
  correct_streak: number;
  total_correct: number;
  total_wrong: number;
  updated_at: string | null;
}

/** Due 判定に使う今日の日付（Tokyo）を取得する共通関数 */
export function getReadingDueDate(): string {
  return getTokyoDateString();
}

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * ユーザーの「今日 Due の Reading 件数」を集計する
 * Home readingDue / progress due_count と整合させるためこの関数を共用する
 */
export async function countReadingDueToday(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const today = getReadingDueDate();
  const { data } = await supabase
    .from('reading_srs_state')
    .select('id')
    .eq('user_id', userId)
    .lte('next_review_on', today);
  return data?.length ?? 0;
}
