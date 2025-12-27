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
  const startTime = Date.now();
  console.log('[Vocab Questions API] Starting question generation...');
  console.log('[Vocab Questions API] Request URL:', request.url);

  try {
    const { searchParams } = request.nextUrl;
    const skill = searchParams.get('skill') as Skill;
    const level = searchParams.get('level') as Level;
    console.log('[Vocab Questions API] Query params - skill:', skill, 'level:', level);

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

    console.log('[Vocab Questions API] Creating Supabase client...');
    const supabase = await createClient();
    console.log('[Vocab Questions API] Getting user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Vocab Questions API] Authentication failed:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }
    console.log('[Vocab Questions API] User authenticated:', user.id);

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

    console.log('[Vocab Questions API] Total items fetched:', allItems?.length || 0);
    
    // デバッグ: 取得したデータのサンプルをログ出力
    if (allItems && allItems.length > 0) {
      const sampleItems = allItems.slice(0, 5).map(item => ({
        word: item.word,
        level: item.level,
        skill_tags: item.skill_tags,
      }));
      console.log('[Vocab Questions API] Sample items:', sampleItems);
      
      // レベル別の集計
      const levelCounts = allItems.reduce((acc, item) => {
        const itemLevel = item.level || 'unknown';
        acc[itemLevel] = (acc[itemLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('[Vocab Questions API] Items by level:', levelCounts);
      
      // skill_tags別の集計（最初の5件）
      const skillTagsSamples = allItems.slice(0, 10).map(item => ({
        word: item.word,
        skill_tags: item.skill_tags,
      }));
      console.log('[Vocab Questions API] Skill tags samples:', skillTagsSamples);
    }
    
    // クライアント側でskill_tagsをフィルタリング
    const vocabItems = (allItems || []).filter(item => {
      if (!item.skill_tags || !Array.isArray(item.skill_tags)) {
        console.log('[Vocab Questions API] Item without skill_tags:', item.id, item.word);
        return false;
      }
      const includes = item.skill_tags.includes(skill);
      if (!includes) {
        // ログが多すぎるので、最初の3件だけログ出力
        if (Math.random() < 0.1) {
          console.log('[Vocab Questions API] Item skill_tags mismatch:', item.id, item.word, 'tags:', item.skill_tags, 'looking for:', skill);
        }
      }
      return includes;
    });

    console.log('[Vocab Questions API] Filtered vocab items:', vocabItems.length);
    
    // フィルタリング後のレベル別集計
    if (vocabItems.length > 0) {
      const filteredLevelCounts = vocabItems.reduce((acc, item) => {
        const itemLevel = item.level || 'unknown';
        acc[itemLevel] = (acc[itemLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('[Vocab Questions API] Filtered items by level:', filteredLevelCounts);
    }

    if (!vocabItems || vocabItems.length === 0) {
      console.error('[Vocab Questions API] No vocab items found. Total items:', allItems?.length || 0);
      console.error('[Vocab Questions API] Sample items (first 3):', allItems?.slice(0, 3).map(item => ({
        id: item.id,
        word: item.word,
        skill_tags: item.skill_tags,
        level: item.level
      })));
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

    console.log('[Vocab Questions API] Generated questions:', questions.length);
    const duration = Date.now() - startTime;
    console.log('[Vocab Questions API] Request completed in', duration, 'ms');

    return Response.json(successResponse(questions));
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[Vocab Questions API] Unexpected error after', duration, 'ms:', error);
    console.error('[Vocab Questions API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

