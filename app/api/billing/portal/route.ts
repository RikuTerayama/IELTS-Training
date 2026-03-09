/**
 * POST /api/billing/portal
 * Create Stripe Customer Portal session.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { successResponse, errorResponse } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient, buildSiteUrl } from '@/lib/server/stripe';

type PortalBody = {
  return_path?: string;
};

type PortalResponse = {
  url: string;
};

type ProfileRow = {
  stripe_customer_id: string | null;
};

function normalizeText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeReturnPath(value: unknown): string | null {
  const path = normalizeText(value);
  if (!path) return null;
  if (!path.startsWith('/')) return null;
  return path;
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

    const { data: profileRow, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle<ProfileRow>();

    if (profileError) {
      throw profileError;
    }

    const stripeCustomerId = normalizeText(profileRow?.stripe_customer_id);
    if (!stripeCustomerId) {
      return Response.json(
        errorResponse('NO_BILLING_ACCOUNT', 'No billing account yet'),
        { status: 400 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as PortalBody;
    const returnPath = normalizeReturnPath(body.return_path) ?? '/home';
    const explicitReturnUrl = normalizeText(process.env.STRIPE_PORTAL_RETURN_URL);
    const returnUrl = explicitReturnUrl ?? buildSiteUrl(returnPath);

    const stripe = getStripeClient();
    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    return Response.json(successResponse<PortalResponse>({ url: portal.url }));
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
