/**
 * GET /api/vocab/questions
 * 単語問題生成（選択式10問）
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { VocabQuestion } from '@/lib/domain/types';

type Skill = 'reading' | 'listening' | 'writing' | 'speaking';
type Level = 'beginner' | 'intermediate' | 'advanced';

export async function GET(request: Request): Promise<Response> {
  console.log('[Vocab Questions API] Starting question generation...');

  try {
    const { searchParams } = new URL(request.url);
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
    const { data: vocabItems, error: vocabError } = await supabase
      .from('vocab_items')
      .select('*')
      .contains('skill_tags', [skill])
      .eq('level', level)
      .limit(100); // 最大100個から10問をランダム選択

    if (vocabError) {
      console.error('[Vocab Questions API] Database error:', vocabError);
      return Response.json(
        errorResponse('DATABASE_ERROR', vocabError.message || 'Failed to fetch vocab items', vocabError),
        { status: 500 }
      );
    }

    if (!vocabItems || vocabItems.length === 0) {
      return Response.json(
        errorResponse('NOT_FOUND', 'No vocab items found for the selected skill and level'),
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

