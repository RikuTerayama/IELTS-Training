/**
 * GET /api/lexicon/questions
 * 問題を取得（未回答優先）
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getTokyoDateString } from '@/lib/utils/dateTokyo';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill'); // 'writing' | 'speaking'
    const category = searchParams.get('category');
    const mode = searchParams.get('mode'); // 'click' | 'typing'
    const module = searchParams.get('module') || 'lexicon'; // 'lexicon' | 'idiom' (default: 'lexicon')
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!skill || !['writing', 'speaking'].includes(skill)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'skill parameter is required and must be "writing" or "speaking"'),
        { status: 400 }
      );
    }

    if (!mode || !['click', 'typing'].includes(mode)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'mode parameter is required and must be "click" or "typing"'),
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const today = getTokyoDateString();

    // 1. dueItems: next_review_on <= today の item_id を取得（そのcategoryに属するもの）
    let dueItemsQuery = supabase
      .from('lexicon_srs_state')
      .select('item_id')
      .eq('user_id', user.id)
      .eq('mode', mode)
      .eq('module', module)
      .lte('next_review_on', today);

    // categoryでフィルタ（item_idからcategoryを引く必要がある）
    let categoryFilter: string[] = [];
    if (category) {
      const { data: categoryItems } = await supabase
        .from('lexicon_items')
        .select('id')
        .eq('skill', skill)
        .eq('category', category)
        .eq('module', module);
      categoryFilter = (categoryItems || []).map(item => item.id);
      
      if (categoryFilter.length > 0) {
        dueItemsQuery = dueItemsQuery.in('item_id', categoryFilter);
      } else {
        // categoryにitemが無い場合は空
        categoryFilter = [];
      }
    } else {
      // category未指定の場合はskill全体
      const { data: skillItems } = await supabase
        .from('lexicon_items')
        .select('id')
        .eq('skill', skill)
        .eq('module', module);
      categoryFilter = (skillItems || []).map(item => item.id);
      
      if (categoryFilter.length > 0) {
        dueItemsQuery = dueItemsQuery.in('item_id', categoryFilter);
      }
    }

    const { data: dueStates } = await dueItemsQuery;
    const dueItemIds = new Set((dueStates || []).map(s => s.item_id));

    // 2. newItems: そのユーザーの srs_state が存在しない item（そのcategory）
    let newItemsQuery = supabase
      .from('lexicon_items')
      .select('id')
      .eq('skill', skill)
      .eq('module', module);

    if (category) {
      newItemsQuery = newItemsQuery.eq('category', category);
    }

    // typingモードの場合は typing_enabled=true を必須条件
    if (mode === 'typing') {
      newItemsQuery = newItemsQuery.eq('typing_enabled', true);
    }

    const { data: allItems } = await newItemsQuery;
    const allItemIds = new Set((allItems || []).map(item => item.id));

    // 既存のSRS状態を取得
    const { data: existingStates } = await supabase
      .from('lexicon_srs_state')
      .select('item_id')
      .eq('user_id', user.id)
      .eq('mode', mode)
      .eq('module', module)
      .in('item_id', Array.from(allItemIds));

    const existingItemIds = new Set((existingStates || []).map(s => s.item_id));
    const newItemIds = Array.from(allItemIds).filter(id => !existingItemIds.has(id));

    // 3. 優先配分: まず due から最大 limit、足りなければ new で埋める
    const selectedItemIds: string[] = [];
    
    // due優先
    const dueItemIdsArray = Array.from(dueItemIds).filter(id => allItemIds.has(id));
    selectedItemIds.push(...dueItemIdsArray.slice(0, limit));
    
    // 足りなければnewで埋める
    if (selectedItemIds.length < limit) {
      const remaining = limit - selectedItemIds.length;
      selectedItemIds.push(...newItemIds.slice(0, remaining));
    }

    if (selectedItemIds.length === 0) {
      return Response.json(successResponse({ questions: [] }));
    }

    // 4. item_idを軸に、該当itemの question を優先して取得
    const { data: questionsByItem } = await supabase
      .from('lexicon_questions')
      .select('id, prompt, correct_expression, choices, hint_first_char, hint_length, item_id')
      .eq('skill', skill)
      .eq('mode', mode)
      .eq('module', module)
      .in('item_id', selectedItemIds);

    // item_idごとにグループ化
    const questionsByItemId: Record<string, any[]> = {};
    for (const q of questionsByItem || []) {
      if (q.item_id) {
        if (!questionsByItemId[q.item_id]) {
          questionsByItemId[q.item_id] = [];
        }
        questionsByItemId[q.item_id].push(q);
      }
    }

    // selectedItemIdsの順序で、各itemから1問ずつ選択（複数ある場合はランダム）
    const selectedQuestions: any[] = [];
    for (const itemId of selectedItemIds) {
      const itemQuestions = questionsByItemId[itemId];
      if (itemQuestions && itemQuestions.length > 0) {
        // ランダムに1問選択
        const randomQuestion = itemQuestions[Math.floor(Math.random() * itemQuestions.length)];
        selectedQuestions.push(randomQuestion);
      }
    }

    // 足りない場合はfallback（category+modeからランダム取得）
    if (selectedQuestions.length < limit) {
      const remaining = limit - selectedQuestions.length;
      const selectedItemIdsSet = new Set(selectedItemIds);
      
      let fallbackQuery = supabase
        .from('lexicon_questions')
        .select('id, prompt, correct_expression, choices, hint_first_char, hint_length, item_id')
        .eq('skill', skill)
        .eq('mode', mode)
        .eq('module', module);
      
      if (category) {
        fallbackQuery = fallbackQuery.eq('category', category);
      }

      const { data: fallbackQuestions } = await fallbackQuery;
      const fallbackFiltered = (fallbackQuestions || []).filter(q => 
        !q.item_id || !selectedItemIdsSet.has(q.item_id)
      );
      
      // ランダムに選択
      for (let i = 0; i < remaining && i < fallbackFiltered.length; i++) {
        const randomIdx = Math.floor(Math.random() * fallbackFiltered.length);
        selectedQuestions.push(fallbackFiltered[randomIdx]);
        fallbackFiltered.splice(randomIdx, 1);
      }
    }

    // レスポンス形式に変換
    const questions = selectedQuestions.map(q => ({
      question_id: q.id,
      prompt: q.prompt,
      choices: q.choices || undefined,
      hint_first_char: q.hint_first_char || undefined,
      hint_length: q.hint_length || undefined,
      item_id: q.item_id || undefined,
    }));

    return Response.json(successResponse({ questions }));
  } catch (error) {
    console.error('[GET /api/lexicon/questions] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
