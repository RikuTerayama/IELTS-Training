/**
 * 学習ドメイン定義
 * Input/Outputの概念と学習コンテンツの種別を定義
 */

/**
 * 学習エリア（Input/Output）
 */
export type LearningArea = "input" | "output";

/**
 * スキル（Writing/Speaking）
 */
export type Skill = "writing" | "speaking";

/**
 * 学習モジュールキー
 */
export type ModuleKey =
  | "vocab"           // 語彙
  | "idiom"           // 熟語
  | "lexicon"         // 表現バンク（Step1で実装予定）
  | "writing_task1"   // Writing Task 1
  | "writing_task2"   // Writing Task 2
  | "speaking";       // Speaking

/**
 * 練習モード
 */
export type PracticeMode = "click" | "typing";

/**
 * Inputモジュール（定着: 認知と想起）
 */
export type InputModule = "vocab" | "idiom" | "lexicon";

/**
 * Outputモジュール（運用: 使わせる制約）
 */
export type OutputModule = "writing_task1" | "writing_task2" | "speaking";

/**
 * モジュールがInputかOutputかを判定
 */
export function isInputModule(module: ModuleKey): module is InputModule {
  return module === "vocab" || module === "idiom" || module === "lexicon";
}

/**
 * モジュールがOutputかどうかを判定
 */
export function isOutputModule(module: ModuleKey): module is OutputModule {
  return module === "writing_task1" || module === "writing_task2" || module === "speaking";
}

/**
 * モジュールから学習エリアを取得
 */
export function getLearningArea(module: ModuleKey): LearningArea {
  return isInputModule(module) ? "input" : "output";
}
