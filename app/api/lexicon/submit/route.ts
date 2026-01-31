/**
 * POST /api/lexicon/submit
 * 回答を送信して正誤判定・ログ保存
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { normalizeExpression } from '@/lib/lexicon/normalize';
import { updateSRSState } from '@/lib/lexicon/srs';
import { getTokyoDateString } from '@/lib/utils/dateTokyo';
import { z } from 'zod';

const SubmitRequestSchema = z.object({
  question_id: z.string().uuid(),
  user_answer: z.string().optional(),
  time_ms: z.number().int().min(0).optional(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    // バリデーション
    const validationResult = SubmitRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid request body', validationResult.error.errors),
        { status: 400 }
      );
    }

    const { question_id, user_answer, time_ms } = validationResult.data;

    const supabase = await createClient();

    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    // 問題を取得
    const { data: question, error: questionError } = await supabase
      .from('lexicon_questions')
      .select('id, mode, correct_expression, item_id, module')
      .eq('id', question_id)
      .single();

    if (questionError || !question) {
      console.error('[POST /api/lexicon/submit] Question not found:', questionError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Lexicon question not found'),
        { status: 404 }
      );
    }

    // 正誤判定
    let isCorrect = false;
    if (question.mode === 'click') {
      // clickモード: user_answerがcorrect_expressionと一致するか
      isCorrect = user_answer === question.correct_expression;
    } else if (question.mode === 'typing') {
      // typingモード: 正規化して比較
      if (user_answer) {
        const normalizedUserAnswer = normalizeExpression(user_answer);
        const normalizedCorrect = normalizeExpression(question.correct_expression);
        isCorrect = normalizedUserAnswer === normalizedCorrect;
      }
    }

    // moduleを取得（question.moduleから、無い場合は'lexicon'をデフォルト）
    const module = question.module || 'lexicon';

    // item_idを取得（question.item_idが無い場合はcorrect_expressionで引く）
    let itemId = question.item_id;
    if (!itemId) {
      // correct_expressionからitemを検索
      const { data: item } = await supabase
        .from('lexicon_items')
        .select('id')
        .eq('expression', question.correct_expression)
        .eq('module', module)
        .limit(1)
        .single();
      
      if (item) {
        itemId = item.id;
      }
    }

    // ログを保存（item_idがあればそれも保存して紐付ける）
    const { error: logError } = await supabase
      .from('lexicon_logs')
      .insert({
        user_id: user.id,
        item_id: itemId || null,
        mode: question.mode,
        module: module,
        is_correct: isCorrect,
        user_answer: user_answer || null,
        time_ms: time_ms || null,
      });

    if (logError) {
      console.error('[POST /api/lexicon/submit] Log insert error:', logError);
      return Response.json(
        errorResponse('DATABASE_ERROR', logError.message),
        { status: 500 }
      );
    }

    // SRS状態を更新（item_idがある場合のみ）
    if (itemId) {
      const today = getTokyoDateString();
      
      // 現在のSRS状態を取得
      const { data: currentState } = await supabase
        .from('lexicon_srs_state')
        .select('stage, next_review_on, last_review_on, correct_streak, total_correct, total_wrong')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('mode', question.mode)
        .eq('module', module)
        .single();

      // SRS状態を更新
      const updatedState = updateSRSState(currentState, isCorrect, today);

      // upsert
      const { error: srsError } = await supabase
        .from('lexicon_srs_state')
        .upsert(
          {
            user_id: user.id,
            item_id: itemId,
            mode: question.mode,
            module: module,
            stage: updatedState.stage,
            next_review_on: updatedState.next_review_on,
            last_review_on: updatedState.last_review_on,
            correct_streak: updatedState.correct_streak,
            total_correct: updatedState.total_correct,
            total_wrong: updatedState.total_wrong,
          },
          {
            onConflict: 'user_id,item_id,mode',
          }
        );

      if (srsError) {
        console.error('[POST /api/lexicon/submit] SRS update error:', srsError);
        // SRS更新エラーはログのみ（回答は保存済み）
      }
    }

    return Response.json(
      successResponse({
        is_correct: isCorrect,
        correct_expression: question.correct_expression,
      })
    );
  } catch (error) {
    console.error('[POST /api/lexicon/submit] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
