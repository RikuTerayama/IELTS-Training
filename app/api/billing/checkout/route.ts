/**
 * POST /api/billing/checkout
 * Create Stripe Checkout session for Pro subscription.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { successResponse, errorResponse } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient, buildSiteUrl, getProPriceIds } from '@/lib/server/stripe';

type CheckoutInterval = 'monthly' | 'annual';

type CheckoutBody = {
  interval?: CheckoutInterval;
  price_id?: string;
};

type CheckoutResponse = {
  url: string;
};

type ProfileRow = {
  stripe_customer_id: string | null;
};

function normalizePriceId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function resolvePriceId(interval: CheckoutInterval, explicitPriceId?: string | null): string {
  if (explicitPriceId) return explicitPriceId;

  const ids = getProPriceIds();
  const legacyFallback = normalizePriceId(process.env.STRIPE_PRICE_ID_PRO);

  const resolved =
    interval === 'monthly'
      ? ids.monthly ?? legacyFallback
      : ids.annual ?? legacyFallback;

  if (!resolved) {
    if (interval === 'annual') {
      throw new Error(
        'STRIPE_PRICE_ID_PRO_ANNUAL (or STRIPE_PRICE_ID_PRO) is not configured'
      );
    }
    throw new Error(
      'STRIPE_PRICE_ID_PRO_MONTHLY (or STRIPE_PRICE_ID_PRO) is not configured'
    );
  }

  return resolved;
}

function getSessionCustomerId(
  customer: string | { id: string } | null | undefined
): string | null {
  if (!customer) return null;
  if (typeof customer === 'string') return customer;
  return customer.id ?? null;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(errorResponse('UNAUTHORIZED', 'Not authenticated'), {
        status: 401,
      });
    }

    const body = (await request.json().catch(() => ({}))) as CheckoutBody;
    if (body.interval !== 'monthly' && body.interval !== 'annual') {
      return Response.json(
        errorResponse('BAD_REQUEST', 'interval must be monthly or annual'),
        { status: 400 }
      );
    }

    const { data: profileRow, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle<ProfileRow>();

    if (profileError) {
      throw profileError;
    }

    const stripeCustomerId = normalizePriceId(profileRow?.stripe_customer_id);
    const explicitPriceId = normalizePriceId(body.price_id);
    const priceId = resolvePriceId(body.interval, explicitPriceId);

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: buildSiteUrl(
        '/billing/success?session_id={CHECKOUT_SESSION_ID}'
      ),
      cancel_url: buildSiteUrl('/pricing?canceled=1'),
      allow_promotion_codes: true,
      customer: stripeCustomerId ?? undefined,
      customer_email: stripeCustomerId ? undefined : user.email ?? undefined,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        plan_interval: body.interval,
      },
    });

    const sessionUrl = normalizePriceId(session.url);
    if (!sessionUrl) {
      throw new Error('Failed to create checkout URL');
    }

    const createdCustomerId = getSessionCustomerId(
      session.customer as string | { id: string } | null | undefined
    );

    if (createdCustomerId && createdCustomerId !== stripeCustomerId) {
      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: createdCustomerId,
          plan_updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }

    return Response.json(successResponse<CheckoutResponse>({ url: sessionUrl }));
  } catch (error) {
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
