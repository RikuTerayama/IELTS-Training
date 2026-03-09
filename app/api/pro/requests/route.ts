/**
 * GET /api/pro/requests
 * POST /api/pro/requests
 * In-app Pro request endpoint (auth required).
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

type ProRequestRow = {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason: string | null;
  expected_usage: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ProRequestPayload = {
  reason?: string;
  expected_usage?: string;
  notes?: string;
};

function normalizeText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { supabase, user: null as null };
  }

  return { supabase, user };
}

export async function GET(): Promise<Response> {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) {
      return Response.json(errorResponse('UNAUTHORIZED', 'Not authenticated'), {
        status: 401,
      });
    }

    const { data, error } = await supabase
      .from('pro_requests')
      .select('id, user_id, status, reason, expected_usage, notes, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle<ProRequestRow>();

    if (error) {
      throw error;
    }

    return Response.json(successResponse(data ?? null));
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

export async function POST(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) {
      return Response.json(errorResponse('UNAUTHORIZED', 'Not authenticated'), {
        status: 401,
      });
    }

    const body = (await request.json().catch(() => ({}))) as ProRequestPayload;
    const reason = normalizeText(body.reason);
    const expectedUsage = normalizeText(body.expected_usage);
    const notes = normalizeText(body.notes);

    const { data: pendingRequest, error: pendingCheckError } = await supabase
      .from('pro_requests')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .limit(1)
      .maybeSingle<{ id: string }>();

    if (pendingCheckError) {
      throw pendingCheckError;
    }

    if (pendingRequest) {
      return Response.json(
        errorResponse('ALREADY_REQUESTED', 'A pending pro request already exists'),
        { status: 409 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from('pro_requests')
      .insert({
        user_id: user.id,
        status: 'pending',
        reason,
        expected_usage: expectedUsage,
        notes,
      })
      .select('id, user_id, status, reason, expected_usage, notes, created_at, updated_at')
      .single<ProRequestRow>();

    if (insertError) {
      throw insertError;
    }

    return Response.json(successResponse(inserted));
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
