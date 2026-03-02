/**
 * GET /api/task1/recommendation
 * Task 1の次タスク推薦
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(request: Request): Promise<Response> {
  console.log('[Task1 Recommendation API] Starting...');
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Task1 Recommendation API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Task1 Recommendation API] User authenticated:', user.email);

    // user_skill_statsを取得
    const { data: skillStats } = await supabase
      .from('user_skill_stats')
      .select('counters')
      .eq('user_id', user.id)
      .maybeSingle();

    const counters = (skillStats?.counters || {}) as Record<string, number>;

    // 直近のattemptを取得（弱点分析用）
    const { data: recentAttempts } = await supabase
      .from('attempts')
      .select('level, review_state')
      .eq('user_id', user.id)
      .eq('task_type', 'Task 1')
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false })
      .limit(5);

    // 弱点を分析
    const weaknesses: string[] = [];
    
    // カウンターから弱点を特定
    if ((counters.overview_missing || 0) > 2) {
      weaknesses.push('overview_missing');
    }
    if ((counters.comparison_missing || 0) > 2) {
      weaknesses.push('comparison_missing');
    }
    if ((counters.number_mismatch || 0) > 1) {
      weaknesses.push('number_accuracy');
    }
    if ((counters.tense_inconsistent || 0) > 1) {
      weaknesses.push('tense_consistency');
    }

    // 直近のattemptからレベルを推測
    let recommendedLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
    if (recentAttempts && recentAttempts.length > 0) {
      const levels = recentAttempts.map(a => a.level);
      const levelCounts = {
        beginner: levels.filter(l => l === 'beginner').length,
        intermediate: levels.filter(l => l === 'intermediate').length,
        advanced: levels.filter(l => l === 'advanced').length,
      };
      
      // 最も多いレベルを推薦（ただし、弱点が多い場合は1つ下げる）
      const maxLevel = Object.entries(levelCounts).reduce((a, b) => 
        levelCounts[a[0] as keyof typeof levelCounts] > levelCounts[b[0] as keyof typeof levelCounts] ? a : b
      )[0] as 'beginner' | 'intermediate' | 'advanced';
      
      recommendedLevel = maxLevel;
      if (weaknesses.length > 2 && maxLevel !== 'beginner') {
        // 弱点が多い場合は1つ下げる
        const levelOrder: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];
        const currentIndex = levelOrder.indexOf(maxLevel);
        if (currentIndex > 0) {
          recommendedLevel = levelOrder[currentIndex - 1];
        }
      }
    }

    // ジャンル推薦（弱点に応じて）
    // デフォルトはランダム、弱点があればそれに対応するジャンルを推薦
    let recommendedGenre: string | null = null;
    
    // 簡易ロジック: 弱点に応じたジャンル推薦
    // 実際にはより複雑なロジックを実装可能
    if (weaknesses.includes('number_accuracy')) {
      // 数字の正確性が弱い場合は、シンプルなグラフ（line_chart）を推薦
      recommendedGenre = 'line_chart';
    } else if (weaknesses.includes('comparison_missing')) {
      // 比較表現が弱い場合は、比較しやすいグラフ（bar_chart）を推薦
      recommendedGenre = 'bar_chart';
    }

    // モード推薦（弱点が多い場合はtraining、少ない場合はexam）
    const recommendedMode: 'training' | 'exam' = weaknesses.length > 2 ? 'training' : 'exam';

    console.log('[Task1 Recommendation API] Recommendation generated:', {
      level: recommendedLevel,
      genre: recommendedGenre,
      mode: recommendedMode,
      weaknesses,
    });

    return Response.json(successResponse({
      level: recommendedLevel,
      genre: recommendedGenre,
      mode: recommendedMode,
      weaknesses,
      reasoning: {
        level_reason: `Based on recent attempts and ${weaknesses.length} identified weaknesses`,
        genre_reason: recommendedGenre 
          ? `Recommended ${recommendedGenre} to address: ${weaknesses.join(', ')}`
          : 'Random genre recommended',
        mode_reason: recommendedMode === 'training' 
          ? 'Training mode recommended due to multiple weaknesses'
          : 'Exam mode recommended - ready for challenge',
      },
    }));
  } catch (error) {
    console.error('[Task1 Recommendation API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

