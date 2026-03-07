import type { SupabaseClient } from '@supabase/supabase-js';
import { errorResponse, type ApiResponse } from '@/lib/api/response';

type UsageScope = 'writing' | 'speaking';
type UsageLimitReason = 'DAILY_LIMIT' | 'TOO_FAST' | 'UNAUTHORIZED';

type ConsumeOrThrow429Params = {
  supabase: SupabaseClient;
  userId: string;
  scope: UsageScope;
  writingDelta?: number;
  speakingDelta?: number;
  llmUsed?: boolean;
  upgradeUrl?: string;
};

type ConsumeUsageResult = {
  ok: boolean;
  writingCount: number;
  speakingCount: number;
  remainingWriting: number;
  remainingSpeaking: number;
  reason: UsageLimitReason | null;
};

type ConsumeUsageRpcRow = {
  ok: boolean;
  writing_count: number;
  speaking_count: number;
  remaining_writing: number;
  remaining_speaking: number;
  reason: UsageLimitReason | null;
};

type UsageLimitConfig = {
  writingLimit: number;
  speakingLimit: number;
  minIntervalSeconds: number;
  upgradeUrl: string;
};

const DEFAULT_FREE_DAILY_WRITING_LIMIT = 10;
const DEFAULT_FREE_DAILY_SPEAKING_LIMIT = 5;
const DEFAULT_LLM_MIN_INTERVAL_SECONDS = 2;
const DEFAULT_UPGRADE_URL = '/#pricing';

export class UsageRateLimitError extends Error {
  readonly statusCode = 429;
  readonly payload: ApiResponse<never>;

  constructor(args: {
    scope: UsageScope;
    reason: UsageLimitReason | null;
    limit: number;
    remaining: number;
    upgradeUrl: string;
  }) {
    const message =
      args.reason === 'TOO_FAST'
        ? 'Too many requests. Please wait a moment.'
        : 'Daily limit reached';

    super(message);
    this.name = 'UsageRateLimitError';
    this.payload = errorResponse('RATE_LIMIT', message, {
      scope: args.scope,
      limit: args.limit,
      remaining: args.remaining,
      upgrade_url: args.upgradeUrl,
      reason: args.reason,
    });
  }
}

export function isUsageRateLimitError(error: unknown): error is UsageRateLimitError {
  return error instanceof UsageRateLimitError;
}

export function toUsageRateLimitResponse(error: unknown): Response | null {
  if (!isUsageRateLimitError(error)) return null;
  return Response.json(error.payload, { status: error.statusCode });
}

function parseEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getTokyoDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === 'year')?.value ?? '1970';
  const month = parts.find((p) => p.type === 'month')?.value ?? '01';
  const day = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${year}-${month}-${day}`;
}

function getUsageLimitConfig(overrideUpgradeUrl?: string): UsageLimitConfig {
  return {
    writingLimit: parseEnvInt('FREE_DAILY_WRITING_LIMIT', DEFAULT_FREE_DAILY_WRITING_LIMIT),
    speakingLimit: parseEnvInt('FREE_DAILY_SPEAKING_LIMIT', DEFAULT_FREE_DAILY_SPEAKING_LIMIT),
    minIntervalSeconds: parseEnvInt(
      'LLM_MIN_INTERVAL_SECONDS',
      DEFAULT_LLM_MIN_INTERVAL_SECONDS
    ),
    upgradeUrl: overrideUpgradeUrl || process.env.UPGRADE_URL || DEFAULT_UPGRADE_URL,
  };
}

function getProUserIds(): Set<string> {
  const raw = process.env.PRO_USER_IDS || '';
  const ids = raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return new Set(ids);
}

function toResult(row: ConsumeUsageRpcRow): ConsumeUsageResult {
  return {
    ok: Boolean(row.ok),
    writingCount: Number(row.writing_count) || 0,
    speakingCount: Number(row.speaking_count) || 0,
    remainingWriting: Number(row.remaining_writing) || 0,
    remainingSpeaking: Number(row.remaining_speaking) || 0,
    reason: row.reason ?? null,
  };
}

async function consumeUsageViaRpc(args: {
  supabase: SupabaseClient;
  usageDate: string;
  writingDelta: number;
  speakingDelta: number;
  config: UsageLimitConfig;
}): Promise<ConsumeUsageResult | null> {
  const { data, error } = await args.supabase.rpc('consume_usage', {
    p_usage_date: args.usageDate,
    p_writing_delta: args.writingDelta,
    p_speaking_delta: args.speakingDelta,
    p_writing_limit: args.config.writingLimit,
    p_speaking_limit: args.config.speakingLimit,
    p_min_interval_seconds: args.config.minIntervalSeconds,
  });

  if (error) {
    const lower = (error.message || '').toLowerCase();
    if (lower.includes('consume_usage') && lower.includes('function')) {
      return null;
    }
    throw error;
  }

  if (!data) return null;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  return toResult(row as ConsumeUsageRpcRow);
}

async function consumeUsageFallback(args: {
  supabase: SupabaseClient;
  userId: string;
  usageDate: string;
  writingDelta: number;
  speakingDelta: number;
  config: UsageLimitConfig;
}): Promise<ConsumeUsageResult> {
  const { supabase, userId, usageDate, writingDelta, speakingDelta, config } = args;

  const { data: existingRow, error: readError } = await supabase
    .from('user_usage_daily')
    .select('writing_count, speaking_count, last_llm_at')
    .eq('user_id', userId)
    .eq('usage_date', usageDate)
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  const writingCount = existingRow?.writing_count ?? 0;
  const speakingCount = existingRow?.speaking_count ?? 0;
  const lastLlmAt = existingRow?.last_llm_at ? new Date(existingRow.last_llm_at) : null;

  if (config.minIntervalSeconds > 0 && lastLlmAt) {
    const elapsedMs = Date.now() - lastLlmAt.getTime();
    if (elapsedMs < config.minIntervalSeconds * 1000) {
      return {
        ok: false,
        writingCount,
        speakingCount,
        remainingWriting: Math.max(config.writingLimit - writingCount, 0),
        remainingSpeaking: Math.max(config.speakingLimit - speakingCount, 0),
        reason: 'TOO_FAST',
      };
    }
  }

  const nextWriting = writingCount + writingDelta;
  const nextSpeaking = speakingCount + speakingDelta;

  if (nextWriting > config.writingLimit || nextSpeaking > config.speakingLimit) {
    return {
      ok: false,
      writingCount,
      speakingCount,
      remainingWriting: Math.max(config.writingLimit - writingCount, 0),
      remainingSpeaking: Math.max(config.speakingLimit - speakingCount, 0),
      reason: 'DAILY_LIMIT',
    };
  }

  const { error: upsertError } = await supabase.from('user_usage_daily').upsert(
    {
      user_id: userId,
      usage_date: usageDate,
      writing_count: nextWriting,
      speaking_count: nextSpeaking,
      last_llm_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,usage_date' }
  );

  if (upsertError) {
    throw upsertError;
  }

  return {
    ok: true,
    writingCount: nextWriting,
    speakingCount: nextSpeaking,
    remainingWriting: Math.max(config.writingLimit - nextWriting, 0),
    remainingSpeaking: Math.max(config.speakingLimit - nextSpeaking, 0),
    reason: null,
  };
}

export async function consumeOrThrow429(params: ConsumeOrThrow429Params): Promise<void> {
  const llmUsed = params.llmUsed ?? true;
  if (!llmUsed) return;

  if (getProUserIds().has(params.userId)) {
    return;
  }

  const writingDelta = Math.max(
    0,
    params.writingDelta ?? (params.scope === 'writing' ? 1 : 0)
  );
  const speakingDelta = Math.max(
    0,
    params.speakingDelta ?? (params.scope === 'speaking' ? 1 : 0)
  );

  if (writingDelta === 0 && speakingDelta === 0) return;

  const config = getUsageLimitConfig(params.upgradeUrl);
  const usageDate = getTokyoDateString();

  let result = await consumeUsageViaRpc({
    supabase: params.supabase,
    usageDate,
    writingDelta,
    speakingDelta,
    config,
  });

  if (!result) {
    result = await consumeUsageFallback({
      supabase: params.supabase,
      userId: params.userId,
      usageDate,
      writingDelta,
      speakingDelta,
      config,
    });
  }

  if (result.ok) return;

  const limit = params.scope === 'writing' ? config.writingLimit : config.speakingLimit;
  const remaining =
    params.scope === 'writing' ? result.remainingWriting : result.remainingSpeaking;

  throw new UsageRateLimitError({
    scope: params.scope,
    reason: result.reason,
    limit,
    remaining,
    upgradeUrl: config.upgradeUrl,
  });
}
