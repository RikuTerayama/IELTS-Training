/**
 * 問い合わせ導線（確実に届く形）
 * メール・Google Forms URL は環境変数で差し替え可能。未設定時はプレースホルダ。
 */

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@example.com';

/** Google Forms のお問い合わせフォーム URL（空なら非表示） */
export const CONTACT_GOOGLE_FORM_URL =
  process.env.NEXT_PUBLIC_CONTACT_GOOGLE_FORM_URL || '';

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** 外部リンク（ナビ用）。環境変数で差し替え可能 */
export const BLOG_OFFICIAL_URL =
  process.env.NEXT_PUBLIC_BLOG_OFFICIAL_URL || 'https://ieltsconsult.netlify.app/';

/** Note（未確定なら TODO 用プレースホルダ。空ならナビで非表示可） */
export const BLOG_NOTE_URL =
  process.env.NEXT_PUBLIC_BLOG_NOTE_URL || '';
