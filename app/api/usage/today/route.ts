/**
 * GET /api/usage/today
 * Return today's free-plan usage summary for UI remaining counts.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { successResponse, errorResponse } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';
import { addDays, getTokyoDateString } from '@/lib/utils/dateTokyo';

const DEFAULT_FREE_DAILY_WRITING_LIMIT = 10;
const DEFAULT_FREE_DAILY_SPEAKING_LIMIT = 5;

type UsageTodayData = {
  is_pro: boolean;
  writing_limit: number;
  speaking_limit: number;
  writing_used: number;
  speaking_used: number;
  writing_remaining: number;
  speaking_remaining: number;
  reset_at: string;
};

type UsageRow = {
  writing_count: number | null;
  speaking_count: number | null;
};

function parseEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getProUserIds(): Set<string> {
  const raw = process.env.PRO_USER_IDS || '';
  const ids = raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return new Set(ids);
}

function toResetAt(usageDate: string): string {
  return `${addDays(usageDate, 1)}T00:00:00+09:00`;
}

export async function GET(): Promise<Response> {
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

    const usageDate = getTokyoDateString();
    const writingLimit = parseEnvInt(
      'FREE_DAILY_WRITING_LIMIT',
      DEFAULT_FREE_DAILY_WRITING_LIMIT
    );
    const speakingLimit = parseEnvInt(
      'FREE_DAILY_SPEAKING_LIMIT',
      DEFAULT_FREE_DAILY_SPEAKING_LIMIT
    );
    const isPro = getProUserIds().has(user.id);

    const { data: usageRow, error: usageError } = await supabase
      .from('user_usage_daily')
      .select('writing_count, speaking_count')
      .eq('user_id', user.id)
      .eq('usage_date', usageDate)
      .maybeSingle<UsageRow>();

    if (usageError) {
      throw usageError;
    }

    const writingUsed = Number(usageRow?.writing_count ?? 0) || 0;
    const speakingUsed = Number(usageRow?.speaking_count ?? 0) || 0;

    const payload: UsageTodayData = {
      is_pro: isPro,
      writing_limit: writingLimit,
      speaking_limit: speakingLimit,
      writing_used: writingUsed,
      speaking_used: speakingUsed,
      writing_remaining: Math.max(writingLimit - writingUsed, 0),
      speaking_remaining: Math.max(speakingLimit - speakingUsed, 0),
      reset_at: toResetAt(usageDate),
    };

    return Response.json(successResponse(payload));
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
