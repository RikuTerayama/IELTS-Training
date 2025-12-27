/**
 * GET /api/vocab/questions
 * 単語問題生成（選択式10問）
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { VocabQuestion } from '@/lib/domain/types';
import { NextRequest } from 'next/server';

type Skill = 'reading' | 'listening' | 'writing' | 'speaking';
type Level = 'beginner' | 'intermediate' | 'advanced';

// 動的レンダリングを強制（認証が必要なため）
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  console.log('[Vocab Questions API] Starting question generation...');

  try {
    const { searchParams } = request.nextUrl;
    const skill = searchParams.get('skill') as Skill;
    const level = searchParams.get('level') as Level;

    if (!skill || !level) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'skill and level are required'),
        { status: 400 }
      );
    }

    if (!['reading', 'listening', 'writing', 'speaking'].includes(skill)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid skill'),
        { status: 400 }
      );
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid level'),
        { status: 400 }
      );
    }

    console.log('[Vocab Questions API] Skill:', skill, 'Level:', level);

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    // 単語を取得（技能タグと難易度でフィルタ）
    // 配列カラムに対しては.contains()を使用（skill_tags配列にskillが含まれているかチェック）
    // PostgreSQLの@>演算子を使用: skill_tags @> ARRAY[skill]
    let query = supabase
      .from('vocab_items')
      .select('*')
      .eq('level', level)
      .limit(100); // 最大100個から10問をランダム選択

    // 配列カラムのフィルタリング
    // .contains()が動作しない場合の代替案として、全データ取得後にフィルタリング
    const { data: allItems, error: vocabError } = await query;

    if (vocabError) {
      console.error('[Vocab Questions API] Database error:', vocabError);
      return Response.json(
        errorResponse('DATABASE_ERROR', vocabError.message || 'Failed to fetch vocab items', vocabError),
        { status: 500 }
      );
    }

    // クライアント側でskill_tagsをフィルタリング
    const vocabItems = (allItems || []).filter(item => {
      if (!item.skill_tags || !Array.isArray(item.skill_tags)) {
        return false;
      }
      return item.skill_tags.includes(skill);
    });

    if (!vocabItems || vocabItems.length === 0) {
      console.error('[Vocab Questions API] No vocab items found. Total items:', allItems?.length || 0);
      return Response.json(
        errorResponse('NOT_FOUND', `No vocab items found for skill: ${skill}, level: ${level}. Please ensure SQL migration files have been executed.`),
        { status: 404 }
      );
    }

    console.log('[Vocab Questions API] Found vocab items:', vocabItems.length);

    // 10問をランダムに選択
    const selectedItems = vocabItems
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    // 問題を生成
    const questions: VocabQuestion[] = selectedItems.map((item, index) => {
      // 問題タイプをランダムに決定（簡易版：英→日と日→英を交互に）
      const questionType: VocabQuestion['question_type'] =
        index % 2 === 0 ? 'en_to_ja' : 'ja_to_en';

      // 正解を含む選択肢を生成
      const correctOption = {
        id: 'A',
        text: questionType === 'en_to_ja' ? item.meaning : item.word,
      };

      // 誤答選択肢を生成（他の単語から取得）
      const wrongOptions = vocabItems
        .filter(v => v.id !== item.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((v, i) => ({
          id: String.fromCharCode(66 + i), // B, C, D
          text: questionType === 'en_to_ja' ? v.meaning : v.word,
        }));

      // 選択肢をシャッフル
      const allOptions = [correctOption, ...wrongOptions].sort(
        () => Math.random() - 0.5
      );

      return {
        id: `q-${item.id}-${index}`,
        vocab_id: item.id,
        question_type: questionType,
        question:
          questionType === 'en_to_ja'
            ? `"${item.word}" の意味は？`
            : `"${item.meaning}" を表す英単語は？`,
        options: allOptions,
        correct_answer: correctOption.id,
      };
    });

    console.log('[Vocab Questions API] Generated questions:', questions.length);

    return Response.json(successResponse(questions));
  } catch (error) {
    console.error('[Vocab Questions API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

