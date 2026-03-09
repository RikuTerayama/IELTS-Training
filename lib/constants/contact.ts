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

const CONTACT_GOOGLE_FORM_USER_ID_ENTRY =
  process.env.NEXT_PUBLIC_CONTACT_GOOGLE_FORM_USER_ID_ENTRY || '';

/**
 * Contact Google Form URL を組み立て（embedded / userId prefill 対応）
 * @param userId - ログイン中の場合 Supabase user_id。ある場合のみ entry に prefill
 * @param embedded - true の場合 embedded=true を付与（iframe 用）
 */
export function buildContactGoogleFormUrl(params: {
  userId?: string | null;
  embedded?: boolean;
}): string {
  const { userId, embedded } = params;
  const base = CONTACT_FORM_VIEW_URL.split('?')[0];
  const existing = CONTACT_FORM_VIEW_URL.includes('?')
    ? new URLSearchParams(CONTACT_FORM_VIEW_URL.split('?')[1])
    : new URLSearchParams();
  if (embedded) {
    existing.set('embedded', 'true');
  }
  if (userId && CONTACT_GOOGLE_FORM_USER_ID_ENTRY) {
    existing.set(CONTACT_GOOGLE_FORM_USER_ID_ENTRY, encodeURIComponent(userId));
  }
  const query = existing.toString();
  return query ? `${base}?${query}` : base;
}

/** 埋め込み用 URL（embedded=true）。iframe src に使用。後方互換のため維持 */
export function getContactFormEmbedUrl(): string {
  return buildContactGoogleFormUrl({ embedded: true });
}

/** 別タブで開く用の表示URL（そのまま） */
export const CONTACT_GOOGLE_FORM_URL = CONTACT_FORM_VIEW_URL;

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** 外部リンク（ナビ用）。環境変数で差し替え可能 */
export const BLOG_OFFICIAL_URL =
  process.env.NEXT_PUBLIC_BLOG_OFFICIAL_URL || 'https://ieltsconsult.netlify.app/';

/** Note（公式。env 未設定時はフォールバックで確実に値あり） */
export const BLOG_NOTE_URL =
  process.env.NEXT_PUBLIC_BLOG_NOTE_URL || 'https://note.com/ielts_consult';
