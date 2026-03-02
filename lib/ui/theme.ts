/**
 * 共通テーマクラス定義
 * ダークモード対応の統一されたUIクラスを提供
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名をマージするユーティリティ
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * カードベースクラス
 * ダークモード対応: bg-surface / border-border / text-text
 */
export const cardBase = cn(
  'rounded-2xl border border-border bg-surface text-text shadow-sm',
  'hover:shadow-md transition-shadow duration-200'
);

/**
 * カードタイトルクラス
 * ダークモード対応: text-text
 */
export const cardTitle = cn(
  'text-heading-3 font-bold text-text tracking-tight'
);

/**
 * カード説明文クラス
 * ダークモード対応: text-text-muted。タイポ: text-small
 */
export const cardDesc = cn(
  'text-small text-text-muted leading-relaxed'
);

/**
 * 入力欄ベースクラス
 * ダークモード対応: border-border / bg-surface / text-text / placeholder
 */
export const inputBase = cn(
  'w-full rounded-lg border border-border bg-surface text-text',
  'placeholder:text-placeholder',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
  'transition-all duration-200 px-4 py-3'
);

/**
 * テキストエリアベースクラス
 * LandingPageのデザイン言語に合わせて更新: leading-relaxed
 */
export const textareaBase = cn(
  inputBase,
  'resize-y min-h-[120px] leading-relaxed'
);

/**
 * 選択可能カードのベースクラス
 * LandingPageのデザイン言語に合わせて更新: rounded-2xl
 */
export const selectableCardBase = cn(
  'rounded-2xl border-2 px-6 py-4 text-left transition-all duration-200',
  'cursor-pointer'
);

/**
 * 選択可能カード - 選択状態
 * ダークモード対応: text-text（indigoアクセントは維持）
 */
export const selectableSelected = cn(
  selectableCardBase,
  'border-indigo-600 bg-indigo-50 text-text shadow-sm dark:bg-indigo-950/50 dark:border-indigo-500'
);

/**
 * 選択可能カード - 未選択状態
 * ダークモード対応: border-border / bg-surface / text-text
 */
export const selectableUnselected = cn(
  selectableCardBase,
  'border-border bg-surface text-text',
  'hover:border-indigo-500/50 hover:bg-surface-2 hover:shadow-md hover:-translate-y-0.5'
);

/**
 * バッジベースクラス
 */
export const badgeBase = cn(
  'inline-flex items-center rounded-full border border-border',
  'bg-surface-2 px-2 py-0.5 text-xs text-text',
  'font-medium'
);

/**
 * ボタンベースクラス（プライマリ）
 * LandingPageのデザイン言語に合わせて更新: bg-indigo-600, rounded-lg, shadow-sm, active:scale-95
 */
export const buttonPrimary = cn(
  'rounded-lg bg-indigo-600 text-white px-4 py-2 font-semibold',
  'hover:bg-indigo-700 shadow-sm',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-all duration-200 active:scale-95'
);

/**
 * ボタンベースクラス（セカンダリ）
 * ダークモード対応: border-border / bg-surface / text-text
 */
export const buttonSecondary = cn(
  'rounded-lg border border-border bg-surface text-text px-4 py-2',
  'hover:bg-surface-2 hover:border-border-strong shadow-sm',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-all duration-200 active:scale-95'
);

