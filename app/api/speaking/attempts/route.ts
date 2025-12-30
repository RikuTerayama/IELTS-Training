/**
 * POST /api/speaking/attempts
 * 瞬間英作文回答保存
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

    const {
      session_id,
      prompt_id,
      user_response,
      response_time,
      word_count,
      wpm,
      filler_count,
      long_pause_count,
    } = await request.json();

    if (!session_id || !prompt_id || !user_response) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Missing required fields: session_id, prompt_id, user_response'),
        { status: 400 }
      );
    }

    // 回答を保存
    const { data: attempt, error: insertError } = await supabase
      .from('speaking_attempts')
      .insert({
        user_id: user.id,
        session_id,
        prompt_id,
        user_response,
        response_time: response_time || null,
        word_count: word_count || user_response.split(/\s+/).length,
        wpm: wpm || null,
        filler_count: filler_count || 0,
        long_pause_count: long_pause_count || 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Speaking Attempts API] Database error:', insertError);
      return Response.json(
        errorResponse('DATABASE_ERROR', insertError.message || 'Failed to save attempt'),
        { status: 500 }
      );
    }

    return Response.json(successResponse(attempt));
  } catch (error) {
    console.error('[Speaking Attempts API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'An unexpected error occurred'),
      { status: 500 }
    );
  }
}

