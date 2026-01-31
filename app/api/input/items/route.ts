/**
 * GET /api/input/items
 * Output制約用のInput itemsを取得（item単位）
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getTokyoDateString } from '@/lib/utils/dateTokyo';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill'); // 'writing' | 'speaking'
    const modulesParam = searchParams.get('modules'); // 'lexicon,idiom,vocab' (省略時は全て)
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const strategy = searchParams.get('strategy') || 'due_first'; // 固定でOK

    if (!skill || !['writing', 'speaking'].includes(skill)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'skill parameter is required and must be "writing" or "speaking"'),
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

    // modulesをパース（省略時は全て）
    const modules = modulesParam
      ? modulesParam.split(',').map(m => m.trim()).filter(m => ['lexicon', 'idiom', 'vocab'].includes(m))
      : ['lexicon', 'idiom', 'vocab'];

    if (modules.length === 0) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid modules parameter'),
        { status: 400 }
      );
    }

    // 1. dueItems: next_review_on <= today の item_id を取得
    const { data: dueStates } = await supabase
      .from('lexicon_srs_state')
      .select('item_id, module')
      .eq('user_id', user.id)
      .eq('skill', skill)
      .in('module', modules)
      .lte('next_review_on', today);

    const dueItemIds = new Set((dueStates || []).map(s => s.item_id));
    const dueItemIdsByModule: Record<string, string[]> = {};
    for (const state of dueStates || []) {
      if (!dueItemIdsByModule[state.module]) {
        dueItemIdsByModule[state.module] = [];
      }
      dueItemIdsByModule[state.module].push(state.item_id);
    }

    // 2. newItems: srs_stateが存在しない item
    // まず全itemを取得
    const { data: allItems } = await supabase
      .from('lexicon_items')
      .select('id, module, skill, category, expression, ja_hint')
      .eq('skill', skill)
      .in('module', modules);

    const allItemIds = new Set((allItems || []).map(item => item.id));

    // 既存のSRS状態を取得
    const { data: existingStates } = await supabase
      .from('lexicon_srs_state')
      .select('item_id')
      .eq('user_id', user.id)
      .in('item_id', Array.from(allItemIds))
      .in('module', modules);

    const existingItemIds = new Set((existingStates || []).map(s => s.item_id));
    const newItemIds = Array.from(allItemIds).filter(id => !existingItemIds.has(id));

    // 3. 優先配分: まず due から最大 limit、足りなければ new で埋める
    const selectedItemIds: string[] = [];
    
    // due優先（moduleごとに均等に配分）
    const dueItemsByModule: Record<string, string[]> = {};
    for (const module of modules) {
      const moduleDueItems = dueItemIdsByModule[module] || [];
      dueItemsByModule[module] = moduleDueItems.filter(id => allItemIds.has(id));
    }

    // 各moduleから均等に取得
    let remaining = limit;
    let moduleIndex = 0;
    while (remaining > 0 && selectedItemIds.length < limit) {
      for (const module of modules) {
        if (remaining <= 0) break;
        const moduleDueItems = dueItemsByModule[module] || [];
        if (moduleDueItems.length > 0) {
          const itemId = moduleDueItems.shift();
          if (itemId && !selectedItemIds.includes(itemId)) {
            selectedItemIds.push(itemId);
            remaining--;
          }
        }
      }
      // 全moduleを1周しても取得できない場合は終了
      if (selectedItemIds.length === 0 || remaining === limit) break;
    }
    
    // 足りなければnewで埋める
    if (selectedItemIds.length < limit) {
      const remainingCount = limit - selectedItemIds.length;
      const newItemsToAdd = newItemIds
        .filter(id => !selectedItemIds.includes(id))
        .slice(0, remainingCount);
      selectedItemIds.push(...newItemsToAdd);
    }

    if (selectedItemIds.length === 0) {
      return Response.json(
        successResponse({
          date: today,
          items: [],
        })
      );
    }

    // 4. item_idから詳細情報を取得
    const { data: selectedItems } = await supabase
      .from('lexicon_items')
      .select('id, module, skill, category, expression, ja_hint')
      .in('id', selectedItemIds);

    // selectedItemIdsの順序を保持
    const itemsMap = new Map((selectedItems || []).map(item => [item.id, item]));
    const items = selectedItemIds
      .map(id => itemsMap.get(id))
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
      .map(item => ({
        module: item.module as 'lexicon' | 'idiom' | 'vocab',
        item_id: item.id,
        skill: item.skill as 'writing' | 'speaking',
        category: item.category,
        expression: item.expression,
        ja_hint: item.ja_hint || undefined,
      }));

    return Response.json(
      successResponse({
        date: today,
        items,
      })
    );
  } catch (error) {
    console.error('[GET /api/input/items] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
