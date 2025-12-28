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

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    // 単語を取得（技能タグと難易度でフィルタ）
    // レベルでフィルタリング後、クライアント側でskill_tagsをフィルタリング
    // より多くのデータを取得してからフィルタリング（limitを増やす）
    const { data: allItems, error: vocabError } = await supabase
      .from('vocab_items')
      .select('*')
      .eq('level', level)
      .limit(500); // より多くのデータを取得してからフィルタリング

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
      return Response.json(
        errorResponse('NOT_FOUND', `No vocab items found for skill: ${skill}, level: ${level}. Please ensure SQL migration files have been executed.`),
        { status: 404 }
      );
    }

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
        .map((v) => ({
          text: questionType === 'en_to_ja' ? v.meaning : v.word,
        }));

      // 正解の位置をランダムに決定（0-3のランダムな位置）
      const correctPosition = Math.floor(Math.random() * 4);
      
      // 選択肢を配列に配置（正解をランダムな位置に配置）
      const allOptionsTexts: string[] = [];
      let wrongIndex = 0;
      for (let i = 0; i < 4; i++) {
        if (i === correctPosition) {
          allOptionsTexts.push(correctOption.text);
        } else {
          if (wrongIndex < wrongOptions.length) {
            allOptionsTexts.push(wrongOptions[wrongIndex].text);
            wrongIndex++;
          } else {
            // 誤答が不足している場合は、追加の誤答を取得
            const additionalWrong = vocabItems
              .filter(v => v.id !== item.id && !allOptionsTexts.includes(questionType === 'en_to_ja' ? v.meaning : v.word))
              .sort(() => Math.random() - 0.5)[0];
            if (additionalWrong) {
              allOptionsTexts.push(questionType === 'en_to_ja' ? additionalWrong.meaning : additionalWrong.word);
            }
          }
        }
      }
      
      // ABCD順にIDを振り直す（表示順序を固定）
      const allOptions = allOptionsTexts.map((text, index) => ({
        id: String.fromCharCode(65 + index), // A, B, C, D
        text: text,
      }));
      
      // 正解のIDを更新（正解のテキストがどの位置にあるか確認）
      const correctAnswerId = allOptions.find(opt => opt.text === correctOption.text)?.id || 'A';

      return {
        id: `q-${item.id}-${index}`,
        vocab_id: item.id,
        question_type: questionType,
        question:
          questionType === 'en_to_ja'
            ? `"${item.word}" の意味は？`
            : `"${item.meaning}" を表す英単語は？`,
        options: allOptions,
        correct_answer: correctAnswerId, // 正解のID（ABCD順に配置された後のID）
      };
    });

    return Response.json(successResponse(questions));
  } catch (error) {
    console.error('[Vocab Questions API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

