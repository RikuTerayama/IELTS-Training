/**
 * GET /api/lexicon/sets
 * categoryごとの件数、typing_enabled件数を返す
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getReadingDueDate } from '@/lib/db/reading-srs';
import { getListeningDueDate } from '@/lib/db/listening-srs';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill'); // 'writing' | 'speaking' | 'reading' | 'listening'
    const moduleName = searchParams.get('module') || 'lexicon'; // 'lexicon' | 'idiom' (default: 'lexicon')

    if (!skill || !['writing', 'speaking', 'reading', 'listening'].includes(skill)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'skill parameter is required and must be "writing", "speaking", "reading", or "listening"'),
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const today = getReadingDueDate();
    const sets: Record<string, {
      items_total: number;
      items_typing_enabled: number;
      questions_click: number;
      questions_typing: number;
      due_click: number;
      due_typing: number;
    }> = {};

    // Reading: lexicon_questions + reading_srs_state で due 集計
    if (skill === 'reading') {
      const { data: questions, error: questionsError } = await supabase
        .from('lexicon_questions')
        .select('id, category, mode, meta')
        .eq('skill', 'reading')
        .eq('module', moduleName);

      if (questionsError) {
        console.error('[GET /api/lexicon/sets] Reading questions error:', questionsError);
        return Response.json(
          errorResponse('DATABASE_ERROR', questionsError.message),
          { status: 500 }
        );
      }

      for (const q of questions || []) {
        if (!sets[q.category]) {
          sets[q.category] = {
            items_total: 0,
            items_typing_enabled: 0,
            questions_click: 0,
            questions_typing: 0,
            due_click: 0,
            due_typing: 0,
          };
        }
        if (q.mode === 'click') sets[q.category].questions_click++;
        else if (q.mode === 'typing') sets[q.category].questions_typing++;
      }

      const categoryList = Object.keys(sets);
      for (const cat of categoryList) {
        const questionIdsInCat = (questions || [])
          .filter((q) => q.category === cat)
          .map((q) => q.id);
        if (questionIdsInCat.length === 0) continue;

        const { data: dueStates } = await supabase
          .from('reading_srs_state')
          .select('mode')
          .eq('user_id', user.id)
          .in('question_id', questionIdsInCat)
          .lte('next_review_on', today);
        for (const s of dueStates || []) {
          if (s.mode === 'click') sets[cat].due_click++;
          else if (s.mode === 'typing') sets[cat].due_typing++;
        }
      }
      const total_due = Object.values(sets).reduce((sum, s) => sum + s.due_click + s.due_typing, 0);
      const topicsSet = new Set<string>();
      const difficultiesSet = new Set<string>();
      for (const q of questions || []) {
        const m = (q as { meta?: { topic?: string; difficulty?: string } | null }).meta;
        if (m?.topic) topicsSet.add(m.topic);
        if (m?.difficulty) difficultiesSet.add(m.difficulty);
      }
      const filters_meta = {
        topics: [...topicsSet].sort(),
        difficulties: [...difficultiesSet].sort(),
      };
      return Response.json(successResponse({ sets, total_due, filters_meta }));
    }

    // Listening: lexicon_questions + listening_srs_state (same shape as Reading)
    if (skill === 'listening') {
      const today = getListeningDueDate();
      const { data: questions, error: questionsError } = await supabase
        .from('lexicon_questions')
        .select('id, category, mode, meta')
        .eq('skill', 'listening')
        .eq('module', moduleName);

      if (questionsError) {
        console.error('[GET /api/lexicon/sets] Listening questions error:', questionsError);
        return Response.json(
          errorResponse('DATABASE_ERROR', questionsError.message),
          { status: 500 }
        );
      }

      for (const q of questions || []) {
        if (!sets[q.category]) {
          sets[q.category] = {
            items_total: 0,
            items_typing_enabled: 0,
            questions_click: 0,
            questions_typing: 0,
            due_click: 0,
            due_typing: 0,
          };
        }
        if (q.mode === 'click') sets[q.category].questions_click++;
        else if (q.mode === 'typing') sets[q.category].questions_typing++;
      }

      const categoryList = Object.keys(sets);
      for (const cat of categoryList) {
        const questionIdsInCat = (questions || [])
          .filter((q) => q.category === cat)
          .map((q) => q.id);
        if (questionIdsInCat.length === 0) continue;

        const { data: dueStates } = await supabase
          .from('listening_srs_state')
          .select('mode')
          .eq('user_id', user.id)
          .in('question_id', questionIdsInCat)
          .lte('next_review_on', today);
        for (const s of dueStates || []) {
          if (s.mode === 'click') sets[cat].due_click++;
          else if (s.mode === 'typing') sets[cat].due_typing++;
        }
      }
      const total_due = Object.values(sets).reduce((sum, s) => sum + s.due_click + s.due_typing, 0);
      return Response.json(successResponse({ sets, total_due }));
    }

    // Writing/Speaking: items + questions + SRS due
    const { data: items, error: itemsError } = await supabase
      .from('lexicon_items')
      .select('category, typing_enabled')
      .eq('skill', skill)
      .eq('module', moduleName);

    if (itemsError) {
      console.error('[GET /api/lexicon/sets] Items error:', itemsError);
      return Response.json(
        errorResponse('DATABASE_ERROR', itemsError.message),
        { status: 500 }
      );
    }

    const { data: questions, error: questionsError } = await supabase
      .from('lexicon_questions')
      .select('category, mode')
      .eq('skill', skill)
      .eq('module', moduleName);

    if (questionsError) {
      console.error('[GET /api/lexicon/sets] Questions error:', questionsError);
      return Response.json(
        errorResponse('DATABASE_ERROR', questionsError.message),
        { status: 500 }
      );
    }

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
      if (item.typing_enabled) sets[item.category].items_typing_enabled++;
    }

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
      if (question.mode === 'click') sets[question.category].questions_click++;
      else if (question.mode === 'typing') sets[question.category].questions_typing++;
    }

    const categoryList = Object.keys(sets);
    for (const cat of categoryList) {
      const { data: categoryItems } = await supabase
        .from('lexicon_items')
        .select('id')
        .eq('skill', skill)
        .eq('category', cat)
        .eq('module', moduleName);

      const categoryItemIds = (categoryItems || []).map(item => item.id);

      if (categoryItemIds.length > 0) {
        const { data: dueClickStates } = await supabase
          .from('lexicon_srs_state')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('mode', 'click')
          .eq('module', moduleName)
          .in('item_id', categoryItemIds)
          .lte('next_review_on', today);
        sets[cat].due_click = dueClickStates?.length || 0;

        const { data: dueTypingStates } = await supabase
          .from('lexicon_srs_state')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('mode', 'typing')
          .eq('module', moduleName)
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
