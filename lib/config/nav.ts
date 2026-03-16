/**
 * Centralized nav config for public vs app shell.
 * Public: marketing/SEO pages. App: authenticated learner dashboard and flows.
 */

export const PUBLIC_NAV = [
  { href: '/reading', label: 'Reading' },
  { href: '/writing', label: 'Writing' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/vocab', label: '単語' },
  { href: '/pricing', label: '料金' },
] as const;

export const APP_NAV: Array<{ href: string; label: string; external?: boolean }> = [
  { href: '/home', label: 'ホーム' },
  { href: '/home#input', label: 'インプット' },
  { href: '/home#output', label: 'アウトプット' },
  { href: '/progress', label: '進捗' },
  { href: '/home#blog', label: '記事 / Note' },
];

export const BLOG_URL = 'https://ieltsconsult.netlify.app/';
