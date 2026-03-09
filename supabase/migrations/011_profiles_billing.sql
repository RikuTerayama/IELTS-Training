-- Add Stripe billing identifiers to profiles.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan_updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
  ON public.profiles (stripe_customer_id);
