/**
 * GET /api/feedback/attempt/:attemptId
 * Attempt IDから最新のフィードバック取得
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { Feedback } from '@/lib/domain/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ attemptId: string }> | { attemptId: string } }
): Promise<Response> {
  try {
    // Next.js 15+ では params が Promise になる可能性がある
    const resolvedParams = params instanceof Promise ? await params : params;
    const attemptId = resolvedParams.attemptId;

    console.log('[Feedback Attempt API] Fetching feedback for attempt:', attemptId);

    if (!attemptId || attemptId === 'undefined') {
      console.error('[Feedback Attempt API] Invalid attemptId:', attemptId);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid attempt ID'),
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Feedback Attempt API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Feedback Attempt API] User authenticated:', user.email);

    // attemptがユーザーのものか確認
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select('id')
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .single();

    if (attemptError || !attempt) {
      console.error('[Feedback Attempt API] Attempt not found:', attemptError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    console.log('[Feedback Attempt API] Attempt found, querying feedbacks...');

    // 最新のフィードバック取得
    const { data: feedback, error } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(); // single() ではなく maybeSingle() を使用（存在しない場合は null を返す）

    if (error) {
      console.error('[Feedback Attempt API] Database error:', error);
      return Response.json(
        errorResponse('DATABASE_ERROR', error.message || 'Failed to fetch feedback', error),
        { status: 500 }
      );
    }

    if (!feedback) {
      console.log('[Feedback Attempt API] Feedback not found for attempt:', attemptId);
      // フィードバックが存在しない場合は、空のレスポンスを返す（404ではなく200）
      return Response.json(
        successResponse(null),
        { status: 200 }
      );
    }

    console.log('[Feedback Attempt API] Feedback found successfully');

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

