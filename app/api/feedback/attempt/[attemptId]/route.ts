/**
 * GET /api/feedback/attempt/:attemptId
 * Attempt IDから最新のフィードバック取得
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { Feedback } from '@/lib/domain/types';

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

    // attemptがユーザーのものか確認
    const { data: attempt } = await supabase
      .from('attempts')
      .select('id')
      .eq('id', params.attemptId)
      .eq('user_id', user.id)
      .single();

    if (!attempt) {
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    // 最新のフィードバック取得
    const { data: feedback, error } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('attempt_id', params.attemptId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !feedback) {
      return Response.json(
        errorResponse('NOT_FOUND', 'Feedback not found'),
        { status: 404 }
      );
    }

    // JSONBフィールドをパース
    const feedbackData: Feedback = {
      schema_version: '1.0',
      overall_band_range: feedback.overall_band_range,
      dimensions: feedback.dimensions as Feedback['dimensions'],
      strengths: feedback.strengths as Feedback['strengths'],
      band_up_actions: feedback.band_up_actions as Feedback['band_up_actions'],
      rewrite_targets: feedback.rewrite_targets as Feedback['rewrite_targets'],
      vocab_suggestions: feedback.vocab_suggestions as Feedback['vocab_suggestions'],
      metadata: feedback.metadata as Feedback['metadata'],
    };

    return Response.json(successResponse(feedbackData));
  } catch (error) {
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

