-- Free plan usage limits for LLM-heavy routes

CREATE TABLE IF NOT EXISTS public.user_usage_daily (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,
  writing_count INTEGER NOT NULL DEFAULT 0,
  speaking_count INTEGER NOT NULL DEFAULT 0,
  last_llm_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_user_usage_daily_user_date
  ON public.user_usage_daily (user_id, usage_date);

ALTER TABLE public.user_usage_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own usage daily" ON public.user_usage_daily;
CREATE POLICY "Users can select own usage daily"
  ON public.user_usage_daily
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own usage daily" ON public.user_usage_daily;
CREATE POLICY "Users can insert own usage daily"
  ON public.user_usage_daily
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own usage daily" ON public.user_usage_daily;
CREATE POLICY "Users can update own usage daily"
  ON public.user_usage_daily
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.consume_usage(
  p_usage_date DATE,
  p_writing_delta INTEGER,
  p_speaking_delta INTEGER,
  p_writing_limit INTEGER,
  p_speaking_limit INTEGER,
  p_min_interval_seconds INTEGER
)
RETURNS TABLE (
  ok BOOLEAN,
  writing_count INTEGER,
  speaking_count INTEGER,
  remaining_writing INTEGER,
  remaining_speaking INTEGER,
  reason TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
  v_row public.user_usage_daily%ROWTYPE;
  v_writing_delta INTEGER := GREATEST(COALESCE(p_writing_delta, 0), 0);
  v_speaking_delta INTEGER := GREATEST(COALESCE(p_speaking_delta, 0), 0);
  v_writing_limit INTEGER := COALESCE(p_writing_limit, 0);
  v_speaking_limit INTEGER := COALESCE(p_speaking_limit, 0);
  v_min_interval_seconds INTEGER := GREATEST(COALESCE(p_min_interval_seconds, 0), 0);
  v_next_writing INTEGER;
  v_next_speaking INTEGER;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN QUERY
    SELECT
      FALSE,
      0,
      0,
      GREATEST(v_writing_limit, 0),
      GREATEST(v_speaking_limit, 0),
      'UNAUTHORIZED';
    RETURN;
  END IF;

  INSERT INTO public.user_usage_daily (user_id, usage_date)
  VALUES (v_user_id, p_usage_date)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  SELECT *
  INTO v_row
  FROM public.user_usage_daily
  WHERE user_id = v_user_id
    AND usage_date = p_usage_date
  FOR UPDATE;

  IF v_min_interval_seconds > 0
     AND v_row.last_llm_at IS NOT NULL
     AND NOW() < (v_row.last_llm_at + make_interval(secs => v_min_interval_seconds)) THEN
    RETURN QUERY
    SELECT
      FALSE,
      v_row.writing_count,
      v_row.speaking_count,
      GREATEST(v_writing_limit - v_row.writing_count, 0),
      GREATEST(v_speaking_limit - v_row.speaking_count, 0),
      'TOO_FAST';
    RETURN;
  END IF;

  v_next_writing := v_row.writing_count + v_writing_delta;
  v_next_speaking := v_row.speaking_count + v_speaking_delta;

  IF (v_writing_limit >= 0 AND v_next_writing > v_writing_limit)
     OR (v_speaking_limit >= 0 AND v_next_speaking > v_speaking_limit) THEN
    RETURN QUERY
    SELECT
      FALSE,
      v_row.writing_count,
      v_row.speaking_count,
      GREATEST(v_writing_limit - v_row.writing_count, 0),
      GREATEST(v_speaking_limit - v_row.speaking_count, 0),
      'DAILY_LIMIT';
    RETURN;
  END IF;

  UPDATE public.user_usage_daily
  SET writing_count = v_next_writing,
      speaking_count = v_next_speaking,
      last_llm_at = CASE
        WHEN (v_writing_delta > 0 OR v_speaking_delta > 0) THEN NOW()
        ELSE v_row.last_llm_at
      END,
      updated_at = NOW()
  WHERE user_id = v_user_id
    AND usage_date = p_usage_date;

  RETURN QUERY
  SELECT
    TRUE,
    v_next_writing,
    v_next_speaking,
    GREATEST(v_writing_limit - v_next_writing, 0),
    GREATEST(v_speaking_limit - v_next_speaking, 0),
    NULL::TEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_usage(
  DATE,
  INTEGER,
  INTEGER,
  INTEGER,
  INTEGER,
  INTEGER
) TO authenticated;
