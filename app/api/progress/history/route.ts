/**
 * GET /api/progress/history
 * タスク履歴取得
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { AttemptHistory } from '@/lib/domain/types';

export async function GET(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const period = searchParams.get('period') || 'all';
    const weaknessTag = searchParams.get('weakness_tag');

    // 期間フィルター
    let dateFilter: Date | null = null;
    if (period === 'week') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (period === 'month') {
      dateFilter = new Date();
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    // attemptsとfeedbacksを結合して取得
    let query = supabase
      .from('attempts')
      .select(`
        id,
        task_id,
        level,
        submitted_at,
        feedbacks!inner (
          overall_band_range,
          dimensions
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false })
      .limit(10);

    if (level && ['beginner', 'intermediate', 'advanced'].includes(level)) {
      query = query.eq('level', level);
    }

    if (dateFilter) {
      query = query.gte('submitted_at', dateFilter.toISOString());
    }

    const { data: attempts, error } = await query;

    if (error) {
      throw error;
    }

    // 履歴データを整形
    const history: AttemptHistory[] = (attempts || []).map((attempt: any) => {
      const feedback = Array.isArray(attempt.feedbacks) ? attempt.feedbacks[0] : attempt.feedbacks;
      const dimensions = feedback?.dimensions || [];
      const weaknessTags = dimensions
        .filter((d: any) => parseFloat(d.band_estimate) < 6.0)
        .map((d: any) => d.dimension);

      return {
        id: attempt.id,
        task_id: attempt.task_id,
        level: attempt.level,
        band_estimate: feedback?.overall_band_range || '5.0-5.5',
        weakness_tags: weaknessTags.slice(0, 2) as AttemptHistory['weakness_tags'],
        completed_at: attempt.submitted_at || attempt.created_at,
      };
    });

    // 弱点タグでフィルター
    const filteredHistory = weaknessTag
      ? history.filter((h) => h.weakness_tags.includes(weaknessTag as any))
      : history;

    return Response.json(successResponse(filteredHistory));
  } catch (error) {
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

