/**
 * GET /api/progress/reading-lexicon-history
 * Reading Lexicon (Academic Reading Signal Bank) history and stats
 * question_type='signal', module='lexicon', skill='reading'
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { countReadingLexiconDueToday } from '@/lib/db/reading-srs';

export type ReadingLexiconHistoryItem = {
  id: string;
  category: string;
  is_correct: boolean;
  user_answer: string | null;
  created_at: string;
  prompt: string;
};

export type ReadingLexiconStatsByCategory = {
  category: string;
  category_label: string;
  total: number;
  correct: number;
  accuracy_percent: number;
};

export type ReadingLexiconHistoryResponse = {
  history: ReadingLexiconHistoryItem[];
  stats_by_category: ReadingLexiconStatsByCategory[];
  due_count: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  reading_lexicon_cause_effect: 'Cause / Effect',
  reading_lexicon_contrast_concession: 'Contrast / Concession',
  reading_lexicon_definition_classification: 'Definition / Classification',
  reading_lexicon_evidence_claim: 'Evidence / Claim',
  reading_lexicon_process_sequence: 'Process / Sequence',
  reading_lexicon_trend_change: 'Trend / Change',
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

    const { data: readingLexiconQuestions, error: qError } = await supabase
      .from('lexicon_questions')
      .select('id, prompt, category')
      .eq('skill', 'reading')
      .eq('module', 'lexicon');

    if (qError) {
      const due_count = await countReadingLexiconDueToday(supabase, user.id);
      return Response.json(
        successResponse({
          history: [],
          stats_by_category: [],
          due_count,
        } as ReadingLexiconHistoryResponse)
      );
    }

    const questions = readingLexiconQuestions ?? [];
    const questionIds = questions.map((q) => q.id);
    const questionById = new Map(questions.map((q) => [q.id, q]));

    if (questionIds.length === 0) {
      const due_count = await countReadingLexiconDueToday(supabase, user.id);
      return Response.json(
        successResponse({
          history: [],
          stats_by_category: [],
          due_count,
        } as ReadingLexiconHistoryResponse)
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
      console.error('[reading-lexicon-history] logs error:', logsError);
      return Response.json(
        errorResponse('DATABASE_ERROR', logsError.message),
        { status: 500 }
      );
    }

    const logList = logs ?? [];

    const history: ReadingLexiconHistoryItem[] = logList.slice(0, 10).map((log) => {
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

    const stats_by_category: ReadingLexiconStatsByCategory[] = Array.from(
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

    const due_count = await countReadingLexiconDueToday(supabase, user.id);

    return Response.json(
      successResponse({
        history,
        stats_by_category,
        due_count,
      } as ReadingLexiconHistoryResponse)
    );
  } catch (error) {
    console.error('[reading-lexicon-history] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
