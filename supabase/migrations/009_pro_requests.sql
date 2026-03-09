-- In-app Pro request intake table

CREATE TABLE IF NOT EXISTS public.pro_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  reason TEXT,
  expected_usage TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pro_requests_user_id
  ON public.pro_requests (user_id);

CREATE INDEX IF NOT EXISTS idx_pro_requests_status_created_at
  ON public.pro_requests (status, created_at DESC);

ALTER TABLE public.pro_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own pro requests" ON public.pro_requests;
CREATE POLICY "Users can select own pro requests"
  ON public.pro_requests
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own pro requests" ON public.pro_requests;
CREATE POLICY "Users can insert own pro requests"
  ON public.pro_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
