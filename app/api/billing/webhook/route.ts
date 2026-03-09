/**
 * POST /api/billing/webhook
 * Stripe webhook endpoint: verify signature and sync subscription plan.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import Stripe from 'stripe';
import { getStripeClient } from '@/lib/server/stripe';
import { getSupabaseAdminClient } from '@/lib/server/supabaseAdmin';

type PlanType = 'free' | 'pro';

function normalizeText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getExpandableId(
  value:
    | string
    | Stripe.Customer
    | Stripe.DeletedCustomer
    | Stripe.Subscription
    | null
    | undefined
): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return typeof value.id === 'string' ? value.id : null;
}

function planFromSubscriptionStatus(status: Stripe.Subscription.Status): PlanType {
  return status === 'active' || status === 'trialing' ? 'pro' : 'free';
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = normalizeText(session.metadata?.user_id);
  if (!userId) {
    return;
  }

  const customerId = getExpandableId(
    session.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null
  );
  const subscriptionId = getExpandableId(
    session.subscription as string | Stripe.Subscription | null
  );

  if (!customerId && !subscriptionId) {
    return;
  }

  const updates: Record<string, unknown> = {};
  if (customerId) updates.stripe_customer_id = customerId;
  if (subscriptionId) updates.stripe_subscription_id = subscriptionId;
  updates.plan_updated_at = new Date().toISOString();

  const adminSupabase = getSupabaseAdminClient();
  const { error } = await (adminSupabase
    .from('profiles') as any)
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('[StripeWebhook] checkout.session.completed profile update failed', {
      userId,
      customerId,
      subscriptionId,
      error: error.message,
    });
  }
}

async function findProfileIdByCustomerOrMetadata(
  customerId: string | null,
  metadataUserId: string | null
): Promise<string | null> {
  const adminSupabase = getSupabaseAdminClient();

  if (customerId) {
    const { data: profileByCustomer, error } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle<{ id: string }>();

    if (error) {
      console.error('[StripeWebhook] profile lookup by customer failed', {
        customerId,
        error: error.message,
      });
    } else if (profileByCustomer?.id) {
      return profileByCustomer.id;
    }
  }

  if (metadataUserId) {
    return metadataUserId;
  }

  return null;
}

async function handleSubscriptionEvent(subscription: Stripe.Subscription): Promise<void> {
  const customerId = getExpandableId(
    subscription.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null
  );
  const metadataUserId = normalizeText(subscription.metadata?.user_id);
  const profileId = await findProfileIdByCustomerOrMetadata(customerId, metadataUserId);

  if (!profileId) {
    console.error('[StripeWebhook] subscription event skipped: profile not found', {
      customerId,
      subscriptionId: subscription.id,
    });
    return;
  }

  const plan = planFromSubscriptionStatus(subscription.status);
  const updates: Record<string, unknown> = {
    plan,
    stripe_subscription_id: subscription.id,
    plan_updated_at: new Date().toISOString(),
  };
  if (customerId) {
    updates.stripe_customer_id = customerId;
  }

  const adminSupabase = getSupabaseAdminClient();
  const { error } = await (adminSupabase
    .from('profiles') as any)
    .update(updates)
    .eq('id', profileId);

  if (error) {
    console.error('[StripeWebhook] subscription profile update failed', {
      profileId,
      customerId,
      subscriptionId: subscription.id,
      status: subscription.status,
      error: error.message,
    });
  }
}

function readWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }
  return secret;
}

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    const webhookSecret = readWebhookSecret();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? `Webhook signature verification failed: ${error.message}` : 'Webhook signature verification failed',
      },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error('[StripeWebhook] event handling failed', {
      type: event.type,
      error: error instanceof Error ? error.message : error,
    });
  }

  return Response.json({ received: true });
}
