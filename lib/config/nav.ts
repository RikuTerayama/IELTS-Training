/**
 * Centralized nav config for public vs app shell.
 * Public: marketing/SEO pages. App: authenticated learner dashboard and flows.
 */

export const PUBLIC_NAV = [
  { href: '/reading', label: 'Reading' },
  { href: '/writing', label: 'Writing' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/vocab', label: 'Vocab' },
  { href: '/pricing', label: 'Pricing' },
] as const;

export const APP_NAV: Array<{ href: string; label: string; external?: boolean }> = [
  { href: '/home', label: 'Home' },
  { href: '/progress', label: 'Progress' },
  { href: '/vocab', label: 'Vocab' },
  { href: 'https://ieltsconsult.netlify.app/', label: 'Blog', external: true },
];

export const BLOG_URL = 'https://ieltsconsult.netlify.app/';
