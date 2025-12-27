/**
 * POST /api/vocab/submit
 * 単語学習回答送信
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function POST(request: Request): Promise<Response> {
  console.log('[Vocab Submit API] Starting submission...');

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    const {
      skill,
      level,
      questions,
      answers,
      correct_answers,
    }: {
      skill: string;
      level: string;
      questions: Array<{ vocab_id: string; question_id: string }>;
      answers: Array<{ question_id: string; user_answer: string }>;
      correct_answers?: Array<{ question_id: string; correct_answer: string }>;
    } = requestBody;

    if (!skill || !level || !questions || !answers) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Missing required fields'),
        { status: 400 }
      );
    }

    console.log('[Vocab Submit API] Skill:', skill, 'Level:', level, 'Questions:', questions.length);

    if (!correct_answers) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'correct_answers are required'),
        { status: 400 }
      );
    }

    // スコアを計算
    let score = 0;
    const answerMap = new Map(answers.map(a => [a.question_id, a.user_answer]));
    const correctAnswerMap = new Map(
      correct_answers.map(a => [a.question_id, a.correct_answer])
    );

    correctAnswerMap.forEach((correctAnswer, questionId) => {
      const userAnswer = answerMap.get(questionId);
      if (userAnswer === correctAnswer) {
        score++;
      }
    });

    const today = new Date().toISOString().split('T')[0];

    // vocab_logsに保存（セッション全体を1レコードとして保存）
    const { error: insertError } = await supabase.from('vocab_logs').insert({
      user_id: user.id,
      vocab_id: questions[0]?.vocab_id || '', // セッションの代表vocab_id
      session_date: today,
      questions: questions,
      answers: answers.map(a => {
        const correctAnswer = correct_answers.find(ca => ca.question_id === a.question_id);
        return {
          ...a,
          is_correct: correctAnswer ? a.user_answer === correctAnswer.correct_answer : false,
        };
      }),
      score: score,
    });

    if (insertError) {
      console.error('[Vocab Submit API] Database insert error:', insertError);
      return Response.json(
        errorResponse('DATABASE_ERROR', insertError.message || 'Failed to save vocab log', insertError),
        { status: 500 }
      );
    }

    console.log('[Vocab Submit API] Submission saved successfully. Score:', score, '/', questions.length);

    return Response.json(
      successResponse({
        score,
        total: questions.length,
        message: 'Answers submitted successfully',
      })
    );
  } catch (error) {
    console.error('[Vocab Submit API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

