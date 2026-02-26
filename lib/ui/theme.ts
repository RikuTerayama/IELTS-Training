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
 * カードベースクラス（TYPO/ダーク対応）
 * WRAP-FR-3: min-w-0 で flex 子のはみ出し防止
 */
export const cardBase = cn(
  'rounded-2xl border border-border bg-surface text-text shadow-theme min-w-0',
  'hover:shadow-theme-lg transition-shadow duration-200'
);

/**
 * カードタイトル（Heading 2 トークン）
 */
export const cardTitle = cn(
  'text-heading-2 font-bold text-text tracking-tight break-words'
);

/**
 * カード説明文（Small トークン）
 */
export const cardDesc = cn(
  'text-small text-text-muted leading-relaxed break-words'
);

/**
 * 入力欄ベース（UI トークン・ダーク対応）
 */
export const inputBase = cn(
  'w-full min-w-0 rounded-lg border border-border bg-surface text-text text-ui',
  'placeholder:text-placeholder',
  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
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
 * 選択可能カードのベースクラス（ダーク対応・折り返し）
 */
export const selectableCardBase = cn(
  'rounded-2xl border-2 border-border min-w-0 overflow-hidden px-4 sm:px-6 py-4 text-left transition-all duration-200',
  'cursor-pointer break-words'
);

/**
 * 選択可能カード - 選択状態（ダーク対応）
 */
export const selectableSelected = cn(
  selectableCardBase,
  'border-primary bg-accent-indigo/10 text-text shadow-sm'
);

/**
 * 選択可能カード - 未選択状態（ダーク対応）
 */
export const selectableUnselected = cn(
  selectableCardBase,
  'border-border bg-surface text-text',
  'hover:border-primary/50 hover:bg-surface-2 hover:shadow-theme-lg hover:-translate-y-0.5'
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
 * ボタン・プライマリ（UI トークン・ダーク対応）
 */
export const buttonPrimary = cn(
  'rounded-lg bg-primary text-primary-foreground px-4 py-2 text-ui font-semibold',
  'hover:bg-primary-hover shadow-theme',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--focus-ring))]',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-all duration-200 active:scale-95'
);

/**
 * ボタン・セカンダリ（ダーク対応）
 */
export const buttonSecondary = cn(
  'rounded-lg border border-border bg-surface text-text px-4 py-2 text-ui',
  'hover:bg-surface-2 hover:border-border-strong shadow-theme',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--focus-ring))]',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-all duration-200 active:scale-95'
);

