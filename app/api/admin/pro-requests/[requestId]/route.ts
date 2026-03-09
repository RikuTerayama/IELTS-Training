/**
 * PATCH/POST /api/admin/pro-requests/[requestId]
 * Admin: approve or reject a pro request.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { isAdmin } from '@/lib/server/adminAuth';
import { getSupabaseAdminClient } from '@/lib/server/supabaseAdmin';

type ProRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
type ProRequestAction = 'approve' | 'reject';

type ProRequestRow = {
  id: string;
  user_id: string;
  status: ProRequestStatus;
  reason: string | null;
  expected_usage: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ActionBody = {
  action?: ProRequestAction;
};

type ActionResponse = {
  request: ProRequestRow;
  profile: { id: string; plan: 'pro' } | null;
};

async function handleAction(
  request: Request,
  context: { params: { requestId: string } }
): Promise<Response> {
  try {
    const requestId = context.params.requestId;
    if (!requestId) {
      return Response.json(errorResponse('BAD_REQUEST', 'requestId is required'), {
        status: 400,
      });
    }

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

    if (!isAdmin(user.id)) {
      return Response.json(errorResponse('FORBIDDEN', 'Admin access required'), {
        status: 403,
      });
    }

    const body = (await request.json().catch(() => ({}))) as ActionBody;
    if (body.action !== 'approve' && body.action !== 'reject') {
      return Response.json(errorResponse('BAD_REQUEST', 'action must be approve or reject'), {
        status: 400,
      });
    }

    const adminSupabase = getSupabaseAdminClient();

    const { data: existing, error: existingError } = await adminSupabase
      .from('pro_requests')
      .select('id, user_id, status, reason, expected_usage, notes, created_at, updated_at')
      .eq('id', requestId)
      .maybeSingle<ProRequestRow>();

    if (existingError) {
      throw existingError;
    }

    if (!existing) {
      return Response.json(errorResponse('NOT_FOUND', 'Pro request not found'), {
        status: 404,
      });
    }

    if (existing.status !== 'pending') {
      return Response.json(
        errorResponse('INVALID_STATUS', 'Only pending requests can be updated'),
        { status: 409 }
      );
    }

    const nextStatus: ProRequestStatus =
      body.action === 'approve' ? 'approved' : 'rejected';

    const { data: updatedRequestRaw, error: updateRequestError } = await (adminSupabase
      .from('pro_requests') as any)
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select('id, user_id, status, reason, expected_usage, notes, created_at, updated_at')
      .single();

    if (updateRequestError) {
      throw updateRequestError;
    }
    const updatedRequest = updatedRequestRaw as ProRequestRow;

    let profile: ActionResponse['profile'] = null;

    if (body.action === 'approve') {
      const { error: updateProfileError } = await (adminSupabase
        .from('profiles') as any)
        .update({
          plan: 'pro',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.user_id);

      if (updateProfileError) {
        throw updateProfileError;
      }

      profile = { id: existing.user_id, plan: 'pro' };
    }

    return Response.json(
      successResponse<ActionResponse>({
        request: updatedRequest,
        profile,
      })
    );
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

export async function PATCH(
  request: Request,
  context: { params: { requestId: string } }
): Promise<Response> {
  return handleAction(request, context);
}

export async function POST(
  request: Request,
  context: { params: { requestId: string } }
): Promise<Response> {
  return handleAction(request, context);
}
