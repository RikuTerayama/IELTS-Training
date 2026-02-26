/**
 * SRS（Spaced Repetition System）更新ロジック
 * 忘却曲線ベースの学習状態管理
 */

import { addDays, getTokyoDateString } from '@/lib/utils/dateTokyo';

/**
 * ステージと間隔（日）
 * stageIntervals[stage] が次の復習までの日数
 */
export const STAGE_INTERVALS = [0, 1, 3, 7, 14, 30];
export const MAX_STAGE = STAGE_INTERVALS.length - 1;

/**
 * SRS状態
 */
export interface SRSState {
  stage: number;
  next_review_on: string; // YYYY-MM-DD
  last_review_on?: string | null; // YYYY-MM-DD
  correct_streak: number;
  total_correct: number;
  total_wrong: number;
}

/**
 * SRS状態を更新
 * 
 * @param currentState 現在のSRS状態（初回の場合はnull）
 * @param isCorrect 正答かどうか
 * @param today 今日の日付（YYYY-MM-DD形式、Tokyo基準）
 * @returns 更新後のSRS状態
 */
export function updateSRSState(
  currentState: SRSState | null,
  isCorrect: boolean,
  today: string = getTokyoDateString()
): SRSState {
  if (!currentState) {
    // 初回: stage=0, next_review_on=today（newは今日出せる）
    return {
      stage: 0,
      next_review_on: today,
      last_review_on: null,
      correct_streak: 0,
      total_correct: 0,
      total_wrong: 0,
    };
  }

  if (isCorrect) {
    // 正答: stageを上げる、correct_streakを増やす
    const newStage = Math.min(currentState.stage + 1, MAX_STAGE);
    const interval = STAGE_INTERVALS[newStage];
    
    return {
      stage: newStage,
      next_review_on: addDays(today, interval),
      last_review_on: today,
      correct_streak: currentState.correct_streak + 1,
      total_correct: currentState.total_correct + 1,
      total_wrong: currentState.total_wrong,
    };
  } else {
    // 誤答: stageを0にリセット、correct_streakを0に、翌日復習
    return {
      stage: 0,
      next_review_on: addDays(today, 1), // 翌日復習
      last_review_on: today,
      correct_streak: 0,
      total_correct: currentState.total_correct,
      total_wrong: currentState.total_wrong + 1,
    };
  }
}

/**
 * 今日復習すべきかどうかを判定
 * 
 * @param nextReviewOn 次の復習日（YYYY-MM-DD形式）
 * @param today 今日の日付（YYYY-MM-DD形式、Tokyo基準）
 * @returns 今日復習すべきかどうか
 */
export function isDueToday(nextReviewOn: string, today: string = getTokyoDateString()): boolean {
  return nextReviewOn <= today;
}
