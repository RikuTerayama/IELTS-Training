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
  { href: '/home#input', label: 'Input' },
  { href: '/home#output', label: 'Output' },
  { href: '/progress', label: 'Progress' },
  { href: '/home#blog', label: 'Blog / Note' },
];

export const BLOG_URL = 'https://ieltsconsult.netlify.app/';
