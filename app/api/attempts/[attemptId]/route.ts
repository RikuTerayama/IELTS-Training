/**
 * GET /api/attempts/:attemptId
 * Attempt詳細取得
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ attemptId: string }> | { attemptId: string } }
): Promise<Response> {
  try {
    // Next.js 15+ では params が Promise になる可能性がある
    const resolvedParams = params instanceof Promise ? await params : params;
    const attemptId = resolvedParams.attemptId;

    console.log('[Attempts API] Fetching attempt:', attemptId);

    if (!attemptId || attemptId === 'undefined') {
      console.error('[Attempts API] Invalid attemptId:', attemptId);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid attempt ID'),
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Attempts API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Attempts API] User authenticated:', user.email);
    console.log('[Attempts API] Querying attempts table for ID:', attemptId);

    const { data: attempt, error } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('[Attempts API] Database error:', error);
      return Response.json(
        errorResponse('DATABASE_ERROR', error.message || 'Failed to fetch attempt', error),
        { status: 500 }
      );
    }

    if (!attempt) {
      console.error('[Attempts API] Attempt not found for ID:', attemptId);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    console.log('[Attempts API] Attempt found successfully');
    return Response.json(successResponse(attempt));
  } catch (error) {
    console.error('[Attempts API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

