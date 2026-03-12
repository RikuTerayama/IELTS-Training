/**
 * GET /api/billing/prices
 * Returns Pro plan display prices from Stripe (for Pricing page).
 * No auth required. Returns null for an interval if env or Stripe fetch fails.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { successResponse } from '@/lib/api/response';
import { getStripeClient, getProPriceIds } from '@/lib/server/stripe';

export type PriceDisplay = {
  amount: number;
  currency: string;
  formatted: string;
} | null;

export type PricesResponse = {
  monthly: PriceDisplay;
  annual: PriceDisplay;
};

function formatAmount(amount: number, currency: string): string {
  const cu = currency.toUpperCase();
  if (cu === 'JPY') {
    return `¥${Number(amount).toLocaleString('ja-JP')}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: cu,
  }).format(amount);
}

export async function GET() {
  const ids = getProPriceIds();
  const result: PricesResponse = { monthly: null, annual: null };

  try {
    const stripe = getStripeClient(); // throws if STRIPE_SECRET_KEY not set

    if (ids.monthly) {
      try {
        const price = await stripe.prices.retrieve(ids.monthly);
        if (price.unit_amount != null) {
          const amount = price.currency === 'jpy' ? price.unit_amount : price.unit_amount / 100;
          result.monthly = {
            amount,
            currency: price.currency.toUpperCase(),
            formatted: formatAmount(amount, price.currency),
          };
        }
      } catch {
        // leave monthly null
      }
    }

    if (ids.annual) {
      try {
        const price = await stripe.prices.retrieve(ids.annual);
        if (price.unit_amount != null) {
          const amount = price.currency === 'jpy' ? price.unit_amount : price.unit_amount / 100;
          result.annual = {
            amount,
            currency: price.currency.toUpperCase(),
            formatted: formatAmount(amount, price.currency),
          };
        }
      } catch {
        // leave annual null
      }
    }
  } catch {
    // STRIPE_SECRET_KEY not set or other error; return nulls
  }

  return Response.json(successResponse(result));
}
