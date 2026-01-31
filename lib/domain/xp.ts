/**
 * 経験値（XP）とレベルシステム
 * Input Lv と Output Lv は分離
 */

import type { LearningArea } from './learning';

/**
 * XPエリア（Input/Output）
 */
export type XPArea = "input" | "output";

/**
 * レベル状態
 */
export interface LevelState {
  level: number;
  exp: number;
  nextLevelExp: number;
}

/**
 * ユーザーのXP状態（Input/Output分離）
 */
export interface UserXPState {
  input: LevelState;
  output: LevelState;
}

/**
 * 次のレベルに必要な経験値を計算（ダミー実装）
 * 後工程で忘却曲線ベースの計算に差し替える前提
 * 
 * @param currentLevel 現在のレベル
 * @returns 次のレベルに必要な経験値
 */
export function calculateNextLevelExp(currentLevel: number): number {
  // ダミー計算: 100 + level * 50
  // 例: Lv1 → 150, Lv2 → 200, Lv3 → 250
  return 100 + currentLevel * 50;
}

/**
 * 経験値からレベルを計算（ダミー実装）
 * 後工程で差し替える前提
 * 
 * @param totalExp 累積経験値
 * @returns レベル
 */
export function calculateLevelFromExp(totalExp: number): number {
  // ダミー計算: レベル1から開始、150expでLv2、200expでLv3...
  let level = 1;
  let requiredExp = 0;
  
  while (totalExp >= requiredExp) {
    level++;
    requiredExp += calculateNextLevelExp(level - 1);
  }
  
  return Math.max(1, level - 1);
}

/**
 * 現在のレベルで次のレベルまでの残り経験値を計算
 * 
 * @param currentLevel 現在のレベル
 * @param currentExp 現在の経験値
 * @returns 次のレベルまでの残り経験値
 */
export function calculateRemainingExp(currentLevel: number, currentExp: number): number {
  const nextLevelExp = calculateNextLevelExp(currentLevel);
  return Math.max(0, nextLevelExp - currentExp);
}

/**
 * ダミーのLevelStateを生成（Step0用）
 * 
 * @param area Input/Output
 * @returns ダミーのLevelState
 */
export function createDummyLevelState(area: XPArea): LevelState {
  // ダミー値: Lv1, Exp 50, NextLevelExp 150
  return {
    level: 1,
    exp: 50,
    nextLevelExp: calculateNextLevelExp(1),
  };
}

/**
 * ダミーのUserXPStateを生成（Step0用）
 * 
 * @returns ダミーのUserXPState
 */
export function createDummyUserXPState(): UserXPState {
  return {
    input: createDummyLevelState("input"),
    output: createDummyLevelState("output"),
  };
}
