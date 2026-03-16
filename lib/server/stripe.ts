import 'server-only';
import Stripe from 'stripe';

export type ProBillingInterval = 'monthly' | 'annual';

type ProPriceIds = {
  monthly: string | null;
  annual: string | null;
};

let stripeClient: Stripe | null = null;

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export function getSiteBaseUrl(): string {
  const baseUrl =
    readEnv('NEXT_PUBLIC_SITE_URL') ||
    readEnv('SITE_URL') ||
    'http://localhost:3000';

  return normalizeBaseUrl(baseUrl);
}

export function buildSiteUrl(path: string): string {
  if (!path) return getSiteBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteBaseUrl()}${normalizedPath}`;
}

export function getStripeClient(): Stripe {
  if (stripeClient) return stripeClient;

  const secretKey = readEnv('STRIPE_SECRET_KEY');
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  stripeClient = new Stripe(secretKey, {
    appInfo: {
      name: 'Meridian',
    },
  });

  return stripeClient;
}

export function getProPriceIds(): ProPriceIds {
  const fallback = readEnv('STRIPE_PRICE_ID_PRO') ?? null;

  return {
    monthly: readEnv('STRIPE_PRICE_ID_PRO_MONTHLY') ?? fallback,
    annual: readEnv('STRIPE_PRICE_ID_PRO_ANNUAL') ?? null,
  };
}

export function getProPriceId(interval: ProBillingInterval): string {
  const ids = getProPriceIds();
  const priceId = interval === 'monthly' ? ids.monthly : ids.annual;

  if (!priceId) {
    if (interval === 'monthly') {
      throw new Error(
        'STRIPE_PRICE_ID_PRO_MONTHLY (or STRIPE_PRICE_ID_PRO) is not configured'
      );
    }
    throw new Error('STRIPE_PRICE_ID_PRO_ANNUAL is not configured');
  }

  return priceId;
}
