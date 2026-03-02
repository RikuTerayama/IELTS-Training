/**
 * 問い合わせ導線（確実に届く形）
 * メール・Google Forms URL は環境変数で差し替え可能。未設定時はプレースホルダ。
 */

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@example.com';

/** Google Forms のお問い合わせフォーム URL（未設定時は下記フォールバック。後から env に移せる） */
const CONTACT_FORM_VIEW_URL =
  process.env.NEXT_PUBLIC_CONTACT_GOOGLE_FORM_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSe8CCgMzEvuc2Nz7xNh-laT3YbyXMNVyfUsukjjg0sL7TggvQ/viewform?usp=publish-editor';

/** 埋め込み用 URL（embedded=true）。iframe src に使用 */
export function getContactFormEmbedUrl(): string {
  const base = CONTACT_FORM_VIEW_URL.split('?')[0];
  return `${base}?embedded=true`;
}

/** 別タブで開く用の表示URL（そのまま） */
export const CONTACT_GOOGLE_FORM_URL = CONTACT_FORM_VIEW_URL;

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** 外部リンク（ナビ用）。環境変数で差し替え可能 */
export const BLOG_OFFICIAL_URL =
  process.env.NEXT_PUBLIC_BLOG_OFFICIAL_URL || 'https://ieltsconsult.netlify.app/';

/** Note（未確定なら TODO 用プレースホルダ。空ならナビで非表示可） */
export const BLOG_NOTE_URL =
  process.env.NEXT_PUBLIC_BLOG_NOTE_URL || '';
