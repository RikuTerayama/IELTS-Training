/**
 * GET /api/progress/summary
 * 進捗サマリー取得
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { ProgressSummary } from '@/lib/domain/types';

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    // 完了タスク数
    const { count: totalAttempts } = await supabase
      .from('attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'submitted');

    // 最新のBand推定と弱点タグ
    const today = new Date().toISOString().split('T')[0];
    const { data: dailyState } = await supabase
      .from('daily_state')
      .select('latest_band_estimate, weakness_tags')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    const summary: ProgressSummary = {
      total_attempts: totalAttempts || 0,
      latest_band_estimate: dailyState?.latest_band_estimate || '5.0-5.5',
      weakness_tags: (dailyState?.weakness_tags as ProgressSummary['weakness_tags']) || [],
    };

    return Response.json(successResponse(summary));
  } catch (error) {
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

