/**
 * GET /api/progress/reading-vocab-history
 * Reading vocab (Academic v1) answer history and stats
 * Joins lexicon_logs with lexicon_questions for question_id-based reading logs
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { countReadingDueToday } from '@/lib/db/reading-srs';

export type ReadingVocabHistoryItem = {
  id: string;
  question_type: string | null;
  category: string;
  is_correct: boolean;
  user_answer: string | null;
  created_at: string;
  prompt: string;
};

export type ReadingVocabStatsByType = {
  question_type: string;
  total: number;
  correct: number;
  accuracy_percent: number;
};

export type ReadingVocabStatsBySkill = {
  skill: string;
  total: number;
  correct: number;
  accuracy_percent: number;
};

export type ReadingVocabHistoryResponse = {
  history: ReadingVocabHistoryItem[];
  stats_by_type: ReadingVocabStatsByType[];
  stats_by_skill: ReadingVocabStatsBySkill[];
  due_count: number;
};

const QUESTION_TYPE_LABELS: Record<string, string> = {
  paraphrase_drill: 'Paraphrase Drill',
  matching_headings: 'Matching Headings',
  tfng: 'True / False / Not Given',
  summary_completion: 'Summary Completion',
  matching_information: 'Matching Information',
  sentence_completion: 'Sentence Completion',
};

const READING_SKILL_LABELS: Record<string, string> = {
  paraphrase: 'Paraphrase',
  skimming: 'Skimming',
  scanning: 'Scanning',
  detail: 'Detail',
  inference: 'Inference',
  not_given_confusion: 'Not Given',
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

    // 1. Get reading questions (skill=reading, module=vocab) including meta for reading_skill
    const { data: readingQuestions, error: qError } = await supabase
      .from('lexicon_questions')
      .select('id, prompt, question_type, category, meta')
      .eq('skill', 'reading')
      .eq('module', 'vocab');

    if (qError || !readingQuestions || readingQuestions.length === 0) {
      const due_count = await countReadingDueToday(supabase, user.id);
      return Response.json(
        successResponse({
          history: [],
          stats_by_type: [],
          stats_by_skill: [],
          due_count,
        } as ReadingVocabHistoryResponse)
      );
    }

    const questionIds = readingQuestions.map((q) => q.id);
    const questionById = new Map(readingQuestions.map((q) => [q.id, q]));

    // 2. Get logs where question_id in reading questions, user_id = user
    const { data: logs, error: logsError } = await supabase
      .from('lexicon_logs')
      .select('id, question_id, is_correct, user_answer, created_at')
      .eq('user_id', user.id)
      .in('question_id', questionIds)
      .order('created_at', { ascending: false })
      .limit(50);

    if (logsError) {
      console.error('[reading-vocab-history] logs error:', logsError);
      return Response.json(
        errorResponse('DATABASE_ERROR', logsError.message),
        { status: 500 }
      );
    }

    const logList = logs || [];

    // 3. Build history (latest 10)
    const history: ReadingVocabHistoryItem[] = logList.slice(0, 10).map((log) => {
      const q = log.question_id ? questionById.get(log.question_id) : undefined;
      return {
        id: log.id,
        question_type: q?.question_type ?? null,
        category: q?.category ?? '',
        is_correct: log.is_correct,
        user_answer: log.user_answer ?? null,
        created_at: log.created_at,
        prompt: q?.prompt ?? '',
      };
    });

    // 4. Build stats by question_type
    const statsByTypeMap = new Map<string, { total: number; correct: number }>();
    const types = ['paraphrase_drill', 'matching_headings', 'tfng', 'summary_completion', 'matching_information', 'sentence_completion'];

    for (const qt of types) {
      statsByTypeMap.set(qt, { total: 0, correct: 0 });
    }

    for (const log of logList) {
      const q = log.question_id ? questionById.get(log.question_id) : undefined;
      const qt = q?.question_type ?? 'unknown';
      if (!statsByTypeMap.has(qt)) {
        statsByTypeMap.set(qt, { total: 0, correct: 0 });
      }
      const s = statsByTypeMap.get(qt)!;
      s.total++;
      if (log.is_correct) s.correct++;
    }

    const stats_by_type: ReadingVocabStatsByType[] = Array.from(statsByTypeMap.entries())
      .filter(([, s]) => s.total > 0)
      .map(([question_type, s]) => ({
        question_type: QUESTION_TYPE_LABELS[question_type] ?? question_type,
        total: s.total,
        correct: s.correct,
        accuracy_percent: Math.round((s.correct / s.total) * 100),
      }));

    // 5. Build stats by reading_skill (weakness-aware)
    const statsBySkillMap = new Map<string, { total: number; correct: number }>();
    for (const log of logList) {
      const q = log.question_id ? questionById.get(log.question_id) : undefined;
      const meta = q?.meta as { reading_skill?: string } | null | undefined;
      const skill = meta?.reading_skill ?? 'other';
      if (!statsBySkillMap.has(skill)) statsBySkillMap.set(skill, { total: 0, correct: 0 });
      const s = statsBySkillMap.get(skill)!;
      s.total++;
      if (log.is_correct) s.correct++;
    }
    const stats_by_skill: ReadingVocabStatsBySkill[] = Array.from(statsBySkillMap.entries())
      .filter(([, s]) => s.total > 0)
      .map(([skill, s]) => ({
        skill: READING_SKILL_LABELS[skill] ?? skill,
        total: s.total,
        correct: s.correct,
        accuracy_percent: Math.round((s.correct / s.total) * 100),
      }));

    const due_count = await countReadingDueToday(supabase, user.id);

    return Response.json(
      successResponse({
        history,
        stats_by_type,
        stats_by_skill,
        due_count,
      } as ReadingVocabHistoryResponse)
    );
  } catch (error) {
    console.error('[reading-vocab-history] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
