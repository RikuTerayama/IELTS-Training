/**
 * GET /api/vocab/incorrect
 * 間違えた単語問題を取得
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    // vocab_logsから間違えた問題を取得
    const { data: vocabLogs, error: fetchError } = await supabase
      .from('vocab_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('[Vocab Incorrect API] Database fetch error:', fetchError);
      return Response.json(
        errorResponse('DATABASE_ERROR', fetchError.message || 'Failed to fetch vocab logs', fetchError),
        { status: 500 }
      );
    }

    // 間違えた問題を抽出
    const incorrectQuestions: Array<{
      vocab_id: string;
      question_id: string;
      question: any;
      user_answer: string;
      correct_answer: string;
      session_date: string;
      created_at: string;
    }> = [];

    vocabLogs.forEach((log) => {
      const answers = log.answers as Array<{
        question_id: string;
        user_answer: string;
        is_correct: boolean;
      }>;
      const questions = log.questions as Array<{
        vocab_id: string;
        question_id: string;
        question: any;
        correct_answer: string;
        options?: Array<{ id: string; text: string }>;
      }>;

      answers.forEach((answer) => {
        if (!answer.is_correct) {
          const question = questions.find((q) => q.question_id === answer.question_id);
          if (question) {
            incorrectQuestions.push({
              vocab_id: question.vocab_id,
              question_id: answer.question_id,
              question: {
                ...question.question,
                options: question.options || [],
                correct_answer: question.correct_answer,
              },
              user_answer: answer.user_answer,
              correct_answer: question.correct_answer,
              session_date: log.session_date,
              created_at: log.created_at,
            });
          }
        }
      });
    });

    // vocab_itemsから単語情報を取得
    const vocabIds = [...new Set(incorrectQuestions.map((q) => q.vocab_id))];
    const { data: vocabItems, error: vocabError } = await supabase
      .from('vocab_items')
      .select('*')
      .in('id', vocabIds);

    if (vocabError) {
      console.error('[Vocab Incorrect API] Vocab items fetch error:', vocabError);
      // vocab_itemsの取得に失敗しても、incorrectQuestionsは返す
    }

    // 単語情報をマージ
    const vocabMap = new Map(
      (vocabItems || []).map((item) => [item.id, item])
    );

    const result = incorrectQuestions.map((q) => ({
      ...q,
      vocab: vocabMap.get(q.vocab_id) || null,
    }));

    return Response.json(
      successResponse({
        incorrect_questions: result,
        total: result.length,
      })
    );
  } catch (error) {
    console.error('[Vocab Incorrect API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

