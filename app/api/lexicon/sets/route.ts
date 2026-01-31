/**
 * GET /api/lexicon/sets
 * categoryごとの件数、typing_enabled件数を返す
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getTokyoDateString } from '@/lib/utils/dateTokyo';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill'); // 'writing' | 'speaking'
    const module = searchParams.get('module') || 'lexicon'; // 'lexicon' | 'idiom' (default: 'lexicon')

    if (!skill || !['writing', 'speaking'].includes(skill)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'skill parameter is required and must be "writing" or "speaking"'),
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 認証チェック（due件数を取得するため）
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const today = getTokyoDateString();

    // items件数を取得
    const { data: items, error: itemsError } = await supabase
      .from('lexicon_items')
      .select('category, typing_enabled')
      .eq('skill', skill)
      .eq('module', module);

    if (itemsError) {
      console.error('[GET /api/lexicon/sets] Items error:', itemsError);
      return Response.json(
        errorResponse('DATABASE_ERROR', itemsError.message),
        { status: 500 }
      );
    }

    // questions件数を取得（mode別）
    const { data: questions, error: questionsError } = await supabase
      .from('lexicon_questions')
      .select('category, mode')
      .eq('skill', skill)
      .eq('module', module);

    if (questionsError) {
      console.error('[GET /api/lexicon/sets] Questions error:', questionsError);
      return Response.json(
        errorResponse('DATABASE_ERROR', questionsError.message),
        { status: 500 }
      );
    }

    // categoryごとに集計
    const sets: Record<string, { 
      items_total: number; 
      items_typing_enabled: number;
      questions_click: number;
      questions_typing: number;
      due_click: number;
      due_typing: number;
    }> = {};

    // items集計
    for (const item of items || []) {
      if (!sets[item.category]) {
        sets[item.category] = {
          items_total: 0,
          items_typing_enabled: 0,
          questions_click: 0,
          questions_typing: 0,
          due_click: 0,
          due_typing: 0,
        };
      }
      sets[item.category].items_total++;
      if (item.typing_enabled) {
        sets[item.category].items_typing_enabled++;
      }
    }

    // questions集計（mode別）
    for (const question of questions || []) {
      if (!sets[question.category]) {
        sets[question.category] = {
          items_total: 0,
          items_typing_enabled: 0,
          questions_click: 0,
          questions_typing: 0,
          due_click: 0,
          due_typing: 0,
        };
      }
      if (question.mode === 'click') {
        sets[question.category].questions_click++;
      } else if (question.mode === 'typing') {
        sets[question.category].questions_typing++;
      }
    }

    // due件数を取得（category別、mode別）
    const categoryList = Object.keys(sets);
    for (const cat of categoryList) {
      // そのcategoryのitem_idを取得
      const { data: categoryItems } = await supabase
        .from('lexicon_items')
        .select('id')
        .eq('skill', skill)
        .eq('category', cat)
        .eq('module', module);
      
      const categoryItemIds = (categoryItems || []).map(item => item.id);
      
      if (categoryItemIds.length > 0) {
        // clickモードのdue件数
        const { data: dueClickStates } = await supabase
          .from('lexicon_srs_state')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('mode', 'click')
          .eq('module', module)
          .in('item_id', categoryItemIds)
          .lte('next_review_on', today);
        
        sets[cat].due_click = dueClickStates?.length || 0;

        // typingモードのdue件数
        const { data: dueTypingStates } = await supabase
          .from('lexicon_srs_state')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('mode', 'typing')
          .eq('module', module)
          .in('item_id', categoryItemIds)
          .lte('next_review_on', today);
        
        sets[cat].due_typing = dueTypingStates?.length || 0;
      }
    }

    return Response.json(successResponse({ sets }));
  } catch (error) {
    console.error('[GET /api/lexicon/sets] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
