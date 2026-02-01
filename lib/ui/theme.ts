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
 * LandingPageのデザイン言語に合わせて更新: bg-white, border-slate-200, rounded-2xl, shadow-sm
 */
export const cardBase = cn(
  'rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm',
  'hover:shadow-md transition-shadow duration-200'
);

/**
 * カードタイトルクラス
 * LandingPageのデザイン言語に合わせて更新: text-slate-900, font-bold
 */
export const cardTitle = cn(
  'text-lg font-bold text-slate-900 tracking-tight'
);

/**
 * カード説明文クラス
 * LandingPageのデザイン言語に合わせて更新: text-slate-600
 */
export const cardDesc = cn(
  'text-sm text-slate-600 leading-relaxed'
);

/**
 * 入力欄ベースクラス
 * LandingPageのデザイン言語に合わせて更新: border-slate-200, bg-white, text-slate-900
 */
export const inputBase = cn(
  'w-full rounded-lg border border-slate-200 bg-white text-slate-900',
  'placeholder:text-slate-400',
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
 * LandingPageのデザイン言語に合わせて更新: border-indigo-600, bg-indigo-50
 */
export const selectableSelected = cn(
  selectableCardBase,
  'border-indigo-600 bg-indigo-50 text-slate-900 shadow-sm'
);

/**
 * 選択可能カード - 未選択状態
 * LandingPageのデザイン言語に合わせて更新: border-slate-200, hover効果
 */
export const selectableUnselected = cn(
  selectableCardBase,
  'border-slate-200 bg-white text-slate-900',
  'hover:border-indigo-500/50 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5'
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
 * LandingPageのデザイン言語に合わせて更新: border-slate-200, bg-white
 */
export const buttonSecondary = cn(
  'rounded-lg border border-slate-200 bg-white text-slate-700 px-4 py-2',
  'hover:bg-slate-50 hover:border-slate-300 shadow-sm',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-all duration-200 active:scale-95'
);

