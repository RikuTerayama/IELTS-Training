/**
 * POST /api/speaking/sessions
 * 瞬間英作文セッション作成
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const { mode, part, topic, level } = await request.json();

    if (!mode || !['drill', 'mock'].includes(mode)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid mode'),
        { status: 400 }
      );
    }

    // セッション作成
    const { data: session, error: insertError } = await supabase
      .from('speaking_sessions')
      .insert({
        user_id: user.id,
        mode,
        part: part || null,
        topic: topic || null,
        level: level || null,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Speaking Session API] Database error:', insertError);
      return Response.json(
        errorResponse('DATABASE_ERROR', insertError.message || 'Failed to create session'),
        { status: 500 }
      );
    }

    return Response.json(successResponse(session));
  } catch (error) {
    console.error('[Speaking Session API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'An unexpected error occurred'),
      { status: 500 }
    );
  }
}

