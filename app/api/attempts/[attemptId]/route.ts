/**
 * GET /api/attempts/:attemptId
 * Attempt詳細取得
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(
  request: Request,
  { params }: { params: { attemptId: string } }
): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const { data: attempt, error } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', params.attemptId)
      .eq('user_id', user.id)
      .single();

    if (error || !attempt) {
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    return Response.json(successResponse(attempt));
  } catch (error) {
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

