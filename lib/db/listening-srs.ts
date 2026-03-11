/**
 * Listening SRS 状態テーブル (listening_srs_state) の型と共通集計
 * Listening Vocab の Due 集計に使用
 */

import type { createClient } from '@/lib/supabase/server';
import { getTokyoDateString } from '@/lib/utils/dateTokyo';

/** listening_srs_state の行型（DB スキーマに合わせる） */
export interface ListeningSrsStateRow {
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
export function getListeningDueDate(): string {
  return getTokyoDateString();
}

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * ユーザーの「今日 Due の Listening Vocab 件数」を集計する
 * skill=listening, module=vocab の question_id のみ対象
 */
export async function countListeningDueToday(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const today = getListeningDueDate();
  const { data: questions } = await supabase
    .from('lexicon_questions')
    .select('id')
    .eq('skill', 'listening')
    .eq('module', 'vocab');
  const questionIds = (questions ?? []).map((q) => q.id);
  if (questionIds.length === 0) return 0;
  const { data } = await supabase
    .from('listening_srs_state')
    .select('id')
    .eq('user_id', userId)
    .in('question_id', questionIds)
    .lte('next_review_on', today);
  return data?.length ?? 0;
}

/**
 * ユーザーの「今日 Due の Listening Idiom 件数」を集計する
 * skill=listening, module=idiom の question_id のみ対象
 */
export async function countListeningIdiomDueToday(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const today = getListeningDueDate();
  const { data: questions } = await supabase
    .from('lexicon_questions')
    .select('id')
    .eq('skill', 'listening')
    .eq('module', 'idiom');
  const questionIds = (questions ?? []).map((q) => q.id);
  if (questionIds.length === 0) return 0;
  const { data } = await supabase
    .from('listening_srs_state')
    .select('id')
    .eq('user_id', userId)
    .in('question_id', questionIds)
    .lte('next_review_on', today);
  return data?.length ?? 0;
}
