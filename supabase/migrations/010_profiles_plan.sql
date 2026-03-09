-- Add plan field to profiles for Pro entitlement (free/pro)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT;

UPDATE public.profiles
SET plan = 'free'
WHERE plan IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN plan SET DEFAULT 'free';

ALTER TABLE public.profiles
  ALTER COLUMN plan SET NOT NULL;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_plan_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'pro'));
