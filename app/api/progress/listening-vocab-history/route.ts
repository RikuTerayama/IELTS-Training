/**
 * GET /api/progress/listening-vocab-history
 * Listening Vocab v1 history and stats
 * skill='listening', module='vocab'
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { countListeningDueToday } from '@/lib/db/listening-srs';

export type ListeningVocabHistoryItem = {
  id: string;
  category: string;
  is_correct: boolean;
  user_answer: string | null;
  created_at: string;
  prompt: string;
};

export type ListeningVocabStatsByCategory = {
  category: string;
  category_label: string;
  total: number;
  correct: number;
  accuracy_percent: number;
};

export type ListeningVocabHistoryResponse = {
  history: ListeningVocabHistoryItem[];
  stats_by_category: ListeningVocabStatsByCategory[];
  due_count: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  vocab_listening_form_note: 'Form / note completion',
  vocab_listening_campus_daily: 'Campus / daily life',
  vocab_listening_lecture: 'Lecture vocabulary',
  vocab_listening_numbers_dates_spelling: 'Numbers / dates / spelling',
  vocab_listening_spoken_distractors: 'Spoken distractors',
  vocab_listening_paraphrase_conversation: 'Paraphrase in conversation',
};

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(errorResponse('UNAUTHORIZED', 'Not authenticated'), {
        status: 401,
      });
    }

    const { data: listeningVocabQuestions, error: qError } = await supabase
      .from('lexicon_questions')
      .select('id, prompt, category')
      .eq('skill', 'listening')
      .eq('module', 'vocab');

    if (qError) {
      let due_count = 0;
      try {
        due_count = await countListeningDueToday(supabase, user.id);
      } catch {
        // listening_srs_state may not exist yet
      }
      return Response.json(
        successResponse({
          history: [],
          stats_by_category: [],
          due_count,
        } as ListeningVocabHistoryResponse)
      );
    }

    const questions = listeningVocabQuestions ?? [];
    const questionIds = questions.map((q) => q.id);
    const questionById = new Map(questions.map((q) => [q.id, q]));

    if (questionIds.length === 0) {
      let due_count = 0;
      try {
        due_count = await countListeningDueToday(supabase, user.id);
      } catch {
        // listening_srs_state may not exist yet
      }
      return Response.json(
        successResponse({
          history: [],
          stats_by_category: [],
          due_count,
        } as ListeningVocabHistoryResponse)
      );
    }

    const { data: logs, error: logsError } = await supabase
      .from('lexicon_logs')
      .select('id, question_id, is_correct, user_answer, created_at')
      .eq('user_id', user.id)
      .in('question_id', questionIds)
      .order('created_at', { ascending: false })
      .limit(50);

    if (logsError) {
      console.error('[listening-vocab-history] logs error:', logsError);
      return Response.json(
        errorResponse('DATABASE_ERROR', logsError.message),
        { status: 500 }
      );
    }

    const logList = logs ?? [];

    const history: ListeningVocabHistoryItem[] = logList.slice(0, 10).map((log) => {
      const q = log.question_id ? questionById.get(log.question_id) : undefined;
      return {
        id: log.id,
        category: q?.category ?? '',
        is_correct: log.is_correct,
        user_answer: log.user_answer ?? null,
        created_at: log.created_at,
        prompt: q?.prompt ?? '',
      };
    });

    const statsByCategoryMap = new Map<string, { total: number; correct: number }>();
    for (const log of logList) {
      const q = log.question_id ? questionById.get(log.question_id) : undefined;
      const cat = q?.category ?? 'unknown';
      if (!statsByCategoryMap.has(cat)) {
        statsByCategoryMap.set(cat, { total: 0, correct: 0 });
      }
      const s = statsByCategoryMap.get(cat)!;
      s.total++;
      if (log.is_correct) s.correct++;
    }

    const stats_by_category: ListeningVocabStatsByCategory[] = Array.from(
      statsByCategoryMap.entries()
    )
      .filter(([, s]) => s.total > 0)
      .map(([category, s]) => ({
        category,
        category_label: CATEGORY_LABELS[category] ?? category,
        total: s.total,
        correct: s.correct,
        accuracy_percent: Math.round((s.correct / s.total) * 100),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));

    let due_count = 0;
    try {
      due_count = await countListeningDueToday(supabase, user.id);
    } catch {
      // listening_srs_state may not exist yet
    }

    return Response.json(
      successResponse({
        history,
        stats_by_category,
        due_count,
      } as ListeningVocabHistoryResponse)
    );
  } catch (error) {
    console.error('[listening-vocab-history] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
