/**
 * 今日のメニューAPIのZodスキーマ
 * GET /api/menu/today のレスポンス型定義
 */

import { z } from 'zod';

/**
 * レベル状態スキーマ
 */
const LevelStateSchema = z.object({
  level: z.number().int().min(1),
  exp: z.number().int().min(0),
  nextLevelExp: z.number().int().min(1),
});

/**
 * XP状態スキーマ
 */
const XPStateSchema = z.object({
  input: LevelStateSchema,
  output: LevelStateSchema,
});

/**
 * Inputモジュールカードスキーマ
 */
const InputModuleCardSchema = z.object({
  module: z.enum(["vocab", "idiom", "lexicon"]),
  title: z.string().min(1),
  description: z.string().min(1),
  cta: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  }),
});

/**
 * Outputモジュールカードスキーマ
 */
const OutputModuleCardSchema = z.object({
  module: z.enum(["writing_task1", "writing_task2", "speaking"]),
  title: z.string().min(1),
  description: z.string().min(1),
  cta: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  }),
});

/**
 * 通知スキーマ
 */
const NoticeSchema = z.object({
  type: z.enum(["info", "warning"]),
  message: z.string().min(1),
});

/**
 * 今日のメニュースキーマ
 * output は Speaking / Writing Task2 の2件（min(1) で互換性を保持）
 */
export const TodayMenuSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式である必要があります"),
  xp: XPStateSchema,
  input: z.array(InputModuleCardSchema).min(1),
  output: z.array(OutputModuleCardSchema).min(1).max(10),
  notices: z.array(NoticeSchema).optional().default([]),
});

/**
 * 今日のメニューの型
 */
export type TodayMenu = z.infer<typeof TodayMenuSchema>;
