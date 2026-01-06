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
 */
export const cardBase = cn(
  'rounded-xl border border-border bg-surface text-text shadow-theme'
);

/**
 * カードタイトルクラス
 */
export const cardTitle = cn(
  'text-base font-semibold text-text'
);

/**
 * カード説明文クラス
 */
export const cardDesc = cn(
  'text-sm text-text-muted'
);

/**
 * 入力欄ベースクラス
 */
export const inputBase = cn(
  'w-full rounded-md border border-border bg-surface-2 text-text',
  'placeholder:text-placeholder',
  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
  'transition-all duration-200'
);

/**
 * テキストエリアベースクラス
 */
export const textareaBase = cn(
  inputBase,
  'resize-y min-h-[100px]'
);

/**
 * 選択可能カードのベースクラス
 */
export const selectableCardBase = cn(
  'rounded-xl border-2 px-6 py-4 text-left transition-all duration-200',
  'cursor-pointer'
);

/**
 * 選択可能カード - 選択状態
 */
export const selectableSelected = cn(
  selectableCardBase,
  'border-primary bg-accent-indigo/10 text-text'
);

/**
 * 選択可能カード - 未選択状態
 */
export const selectableUnselected = cn(
  selectableCardBase,
  'border-border bg-transparent text-text',
  'hover:border-primary/50 hover:bg-surface-2'
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
 */
export const buttonPrimary = cn(
  'rounded-md bg-primary text-primary-foreground px-4 py-2',
  'hover:bg-primary-hover',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-colors duration-200 font-semibold'
);

/**
 * ボタンベースクラス（セカンダリ）
 */
export const buttonSecondary = cn(
  'rounded-md border border-border bg-surface-2 text-text px-4 py-2',
  'hover:bg-surface hover:border-border-strong',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-colors duration-200'
);

