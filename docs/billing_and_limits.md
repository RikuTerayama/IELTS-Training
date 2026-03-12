# Billing And Limits (Stripe Operation)

This document defines Free limits and Stripe billing operation after Checkout, Webhook, and Portal integration.

## Free Limits (Default)

- Writing AI: `10 / day`
- Speaking AI: `5 / day`
- Minimum interval between LLM calls: `2 seconds`
- Day boundary: JST (`Asia/Tokyo`)

## Counted API Routes

Only calls that actually enter an LLM branch are counted.

### Writing scope

- `POST /api/tasks/generate`
  - Task 1: counted only when `generateTask1VocabOnly(...)` is called
  - Task 2: counted only when `generateTask(...)` is called
- `POST /api/llm/prep-evaluation`
- `POST /api/llm/prep-to-essay`
- `POST /api/llm/feedback`
  - Not counted when existing feedback is reused
  - Counted only for new feedback generation
- `POST /api/tasks/[taskId]/rewrite`
- `POST /api/task1/review/steps`
- `POST /api/task1/review/final`

### Speaking scope

- `POST /api/speaking/prompts/generate`
  - Not counted when preset prompt path is used
  - Counted only when LLM generation path is used
- `POST /api/speaking/evaluations`

## Stripe Environment Variables

Required:

- `STRIPE_SECRET_KEY` (server only)
- `STRIPE_WEBHOOK_SECRET` (server only)
- `STRIPE_PRICE_ID_PRO_MONTHLY` (server only)
- `STRIPE_PRICE_ID_PRO_ANNUAL` (server only)

Optional / compatibility:

- `STRIPE_PRICE_ID_PRO` (legacy fallback for missing monthly/annual IDs)
- `STRIPE_PORTAL_RETURN_URL` (default fallback is `${SITE_URL}/home`)
- `NEXT_PUBLIC_SITE_URL` or `SITE_URL` (used for absolute success/cancel URLs)

Existing limits env (still used):

- `FREE_DAILY_WRITING_LIMIT`
- `FREE_DAILY_SPEAKING_LIMIT`
- `LLM_MIN_INTERVAL_SECONDS`
- `UPGRADE_URL`

## Billing Routes

- Checkout API: `POST /api/billing/checkout`
  - Starts subscription for `monthly` or `annual`
  - Returns Stripe Checkout URL
- **Prices API: `GET /api/billing/prices`**
  - Returns Pro Monthly / Pro Annual display prices (formatted amount and currency) for the Pricing page.
  - Uses the same `STRIPE_PRICE_ID_PRO_MONTHLY` and `STRIPE_PRICE_ID_PRO_ANNUAL` (or `STRIPE_PRICE_ID_PRO`) as checkout. Fetches each price from Stripe and returns `{ monthly: { amount, currency, formatted } | null, annual: ... }`. No auth required. If env or Stripe fetch fails, returns `null` for that interval; the UI shows "—" and "価格はStripeで設定されています".
- Webhook API: `POST /api/billing/webhook`
  - Verifies Stripe signature
  - Syncs `profiles.plan` using subscription status
- Portal API: `POST /api/billing/portal`
  - Returns Stripe Customer Portal URL
- Manage page: `/billing/manage`
  - Calls portal API and redirects user to Stripe Portal

## Return URLs

- Success: `/billing/success`
- Cancel: `/pricing?canceled=1`
- Portal return: `/home` (or `STRIPE_PORTAL_RETURN_URL` if set)

## Plan Source Of Truth

The only source of truth for plan updates is Stripe Webhook.

- `checkout.session.completed`
  - Saves `stripe_customer_id` and `stripe_subscription_id` (best effort)
  - Does not update `profiles.plan`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
  - Updates `profiles.plan` by subscription status:
    - `active` or `trialing` => `pro`
    - otherwise => `free`

Do not update `profiles.plan` in Checkout API handlers.

## Stripe Dashboard Setup (Webhook)

1. Open Stripe Dashboard -> Developers -> Webhooks.
2. Add endpoint:
   - Production: `https://ielts-training.onrender.com/api/billing/webhook`
3. Subscribe events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy Signing Secret and set `STRIPE_WEBHOOK_SECRET` in hosting env.

## 429 Response Behavior (Limits)

When usage limit or minimum interval is exceeded, APIs return HTTP `429` in `ApiResponse` shape:

```json
{
  "ok": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "Daily limit reached",
    "details": {
      "scope": "writing",
      "limit": 10,
      "remaining": 0,
      "upgrade_url": "/#pricing",
      "reason": "DAILY_LIMIT"
    }
  }
}
```

`reason` values:

- `DAILY_LIMIT`
- `TOO_FAST`

## Migration Apply Memo

Apply these migrations in production DB:

- `supabase/migrations/008_usage_limits.sql`
- `supabase/migrations/010_profiles_plan.sql`
- `supabase/migrations/011_profiles_billing.sql`
