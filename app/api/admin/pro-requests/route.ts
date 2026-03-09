/**
 * GET /api/admin/pro-requests
 * Admin: list pro requests (pending by default).
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { isAdmin } from '@/lib/server/adminAuth';
import { getSupabaseAdminClient } from '@/lib/server/supabaseAdmin';

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

export async function GET(request: Request): Promise<Response> {
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

    if (!isAdmin(user.id)) {
      return Response.json(errorResponse('FORBIDDEN', 'Admin access required'), {
        status: 403,
      });
    }

    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('include_all') === '1';
    const status = searchParams.get('status');
    const adminSupabase = getSupabaseAdminClient();

    let query = adminSupabase
      .from('pro_requests')
      .select('id, user_id, status, reason, expected_usage, notes, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (status) {
      query = query.eq('status', status);
    } else if (!includeAll) {
      query = query.eq('status', 'pending');
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return Response.json(successResponse((data || []) as ProRequestRow[]));
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
