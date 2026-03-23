'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  fetchLexiconSets,
  fetchLexiconQuestions,
  submitLexiconAnswer,
  type LexiconQuestion,
  type LexiconSubmitResponse,
  type LexiconSetsResponse,
} from '@/lib/api/lexicon';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

type Skill = 'reading' | 'listening' | 'speaking' | 'writing';
type Mode = 'click' | 'typing';

type Step = 'skill' | 'category' | 'quiz';

interface QuizState {
  questions: LexiconQuestion[];
  currentIndex: number;
  answers: Array<{
    question_id: string;
    is_correct: boolean;
    user_answer?: string;
    time_ms?: number;
  }>;
  currentAnswer?: LexiconSubmitResponse;
  showResult: boolean;
}

const SUBMIT_RETRY_MESSAGE = '\u9001\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u3082\u3046\u4e00\u5ea6\u62bc\u3057\u3066\u304f\u3060\u3055\u3044\u3002';

function ComingSoonSkillsView({ basePath }: { basePath: string }) {
  return (
    <div className={cn('p-6', cardBase)}>
      <h2 className={cn('text-xl font-semibold mb-4', cardTitle)}>Coming soon</h2>
      <p className={cn('text-sm mb-6', cardDesc)}>この技能は準備中です。Speaking / Writing からお試しください。</p>
      <div className="flex flex-wrap gap-3">
        <Link href={`${basePath}?skill=speaking`} className={cn('px-4 py-2', buttonPrimary)}>Speaking を始める</Link>
        <Link href={`${basePath}?skill=writing`} className={cn('px-4 py-2', buttonSecondary)}>Writing を始める</Link>
      </div>
    </div>
  );
}

function VocabPageContent() {
  const searchParams = useSearchParams();
  const urlSkill = searchParams.get('skill') as Skill | null;
  const [step, setStep] = useState<Step>('skill');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [sets, setSets] = useState<LexiconSetsResponse['sets'] | null>(null);
  /** Reading 時のみ: 全カテゴリの復習Due合計（API total_due） */
  const [readingTotalDue, setReadingTotalDue] = useState<number | null>(null);
  /** Reading 時のみ: フィルタ用 topic/difficulty 一覧（API filters_meta） */
  const [readingFiltersMeta, setReadingFiltersMeta] = useState<{ topics: string[]; difficulties: string[] } | null>(null);
  /** Reading フィルタ: topic / difficulty */
  const [readingFilterTopic, setReadingFilterTopic] = useState<string | null>(null);
  const [readingFilterDifficulty, setReadingFilterDifficulty] = useState<string | null>(null);
  /** Reading/Listening 今回のクイズモード: 復習のみ / 新規のみ / 復習＋新規 */
  const [readingSessionMode, setReadingSessionMode] = useState<'review_only' | 'new_only' | 'all' | null>(null);
  /** Listening 時のみ: 全カテゴリの復習Due合計 */
  const [listeningTotalDue, setListeningTotalDue] = useState<number | null>(null);
  /** Reading 時のみ: 進捗APIの skill 別成績（苦手スキル導線用） */
  const [readingStatsBySkill, setReadingStatsBySkill] = useState<Array<{ skill: string; skill_key: string; total: number; correct: number; accuracy_percent: number }>>([]);
  /** Reading: 苦手スキル優先で開始するときの skill_key */
  const [weakSkillKey, setWeakSkillKey] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  /** Reading mini set: show brief set summary before next question/set */
  const [showSetSummary, setShowSetSummary] = useState(false);
  const [setSummaryData, setSetSummaryData] = useState<{ correct: number; total: number; setIndex?: number; setTotal?: number } | null>(null);
  const [clickTimer, setClickTimer] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitInFlightRef = useRef(false);
  const submitQuestionIdRef = useRef<string | null>(null);

  // URL ?skill=speaking|writing|reading|listening のとき fetch して category へ
  const validSkillQuery = urlSkill === 'speaking' || urlSkill === 'writing' || urlSkill === 'reading' || urlSkill === 'listening';
  useEffect(() => {
    if (!validSkillQuery) {
      setSelectedSkill(null);
      setStep('skill');
      return;
    }
    let cancelled = false;
    setSelectedSkill(urlSkill);
    setLoading(true);
    setError(null);
    fetchLexiconSets(urlSkill, 'vocab').then((response) => {
      if (cancelled) return;
      if (response.ok && response.data) {
        const setsData = response.data!.sets;
        if (Object.keys(setsData).length === 0) {
          setError(`${urlSkill === 'reading' ? 'Reading' : urlSkill === 'listening' ? 'Listening' : 'このスキル'}のデータがありません。シードを実行してください。`);
        } else {
          setSets(setsData);
          if (urlSkill === 'reading') {
            setReadingTotalDue(response.data!.total_due ?? 0);
            setReadingFiltersMeta(response.data!.filters_meta ?? null);
            setListeningTotalDue(null);
          } else if (urlSkill === 'listening') {
            setListeningTotalDue(response.data!.total_due ?? 0);
            setReadingTotalDue(null);
            setReadingFiltersMeta(null);
          } else {
            setReadingTotalDue(null);
            setReadingFiltersMeta(null);
            setListeningTotalDue(null);
          }
          setStep('category');
        }
      } else {
        setError(response.error?.message || 'Failed to fetch sets');
      }
    }).catch((err) => {
      if (cancelled) return;
      setError(err instanceof Error ? err.message : 'Unknown error');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [urlSkill]);

  // Reading: fetch skill-wise stats for weakness-aware CTA when on category step
  useEffect(() => {
    if (selectedSkill !== 'reading' || step !== 'category') {
      setReadingStatsBySkill([]);
      return;
    }
    let cancelled = false;
    fetch('/api/progress/reading-vocab-history').then((res) => res.json()).then((data) => {
      if (cancelled || !data?.data?.stats_by_skill) return;
      setReadingStatsBySkill(data.data.stats_by_skill);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [selectedSkill, step]);

  // Step A: skill選択
  const handleSkillSelect = async (skill: 'speaking' | 'writing' | 'reading' | 'listening') => {
    setSelectedSkill(skill);
    setLoading(true);
    setError(null);

    try {
      const response = await fetchLexiconSets(skill, 'vocab');
      if (response.ok && response.data) {
        const setsData = response.data.sets;
        if (Object.keys(setsData).length === 0) {
          setError(`${skill === 'reading' ? 'Reading' : skill === 'listening' ? 'Listening' : 'このスキル'}のデータがありません。シードを実行してください。`);
        } else {
          setSets(setsData);
          if (skill === 'reading') {
            setReadingTotalDue(response.data.total_due ?? 0);
            setReadingFiltersMeta(response.data.filters_meta ?? null);
            setListeningTotalDue(null);
          } else if (skill === 'listening') {
            setListeningTotalDue(response.data.total_due ?? 0);
            setReadingTotalDue(null);
            setReadingFiltersMeta(null);
          } else {
            setReadingTotalDue(null);
            setReadingFiltersMeta(null);
            setListeningTotalDue(null);
          }
          setStep('category');
        }
      } else {
        setError(response.error?.message || 'Failed to fetch sets');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Step B: category + mode選択 → quiz開始
  const handleStartQuiz = async (reviewOnly?: boolean, newOnly?: boolean, weakSkill?: string | null) => {
    if (!selectedCategory || !selectedMode || !selectedSkill) return;

    setLoading(true);
    setError(null);

    const readingParams =
      selectedSkill === 'reading'
        ? {
            review_only: reviewOnly,
            new_only: newOnly,
            topic: readingFilterTopic || undefined,
            difficulty: readingFilterDifficulty || undefined,
            weak_skill: weakSkill || undefined,
          }
        : undefined;
    const listeningParams =
      selectedSkill === 'listening'
        ? { review_only: reviewOnly, new_only: newOnly }
        : undefined;

    try {
      const response = await fetchLexiconQuestions(
        selectedSkill as 'speaking' | 'writing' | 'reading' | 'listening',
        selectedCategory,
        selectedMode,
        10,
        'vocab',
        readingParams ?? listeningParams
      );
        if (response.ok && response.data) {
        if (!response.data.questions || response.data.questions.length === 0) {
          const isReading = selectedSkill === 'reading';
          const isListening = selectedSkill === 'listening';
          const cat = sets?.[selectedCategory];
          const hasDue = cat && (cat.due_click > 0 || cat.due_typing > 0);
          setError(
            (isReading || isListening) && reviewOnly
              ? 'このカテゴリ・モードには、いま復習Dueの問題がありません。別のカテゴリやモードを選ぶか、「復習＋新規で開始」で練習を始めましょう。'
              : (isReading || isListening) && newOnly
                ? 'この条件に該当する新規問題はありません。「復習＋新規で開始」を試してください。'
                : (isReading || isListening) && hasDue
                  ? 'このカテゴリ・モードには復習Dueがありません。別のモードかカテゴリをお試しください。'
                  : isReading || isListening
                    ? 'このカテゴリに復習Dueも新規問題もありません。'
                    : 'この条件では問題がありません。別のカテゴリやモードをお試しください。'
          );
          return;
        }

        setShowSetSummary(false);
        setSetSummaryData(null);
        setQuizState({
          questions: response.data.questions,
          currentIndex: 0,
          answers: [],
          showResult: false,
        });
        if (selectedSkill === 'reading' || selectedSkill === 'listening') {
          setReadingSessionMode(reviewOnly ? 'review_only' : newOnly ? 'new_only' : 'all');
        } else {
          setReadingSessionMode(null);
        }
        setStep('quiz');

        // typingモードの場合は開始時刻を記録
        if (selectedMode === 'typing') {
          setTypingStartTime(Date.now());
        }
      } else {
        setError(response.error?.message || 'Failed to fetch questions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Click回答
  const stopClickTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setClickTimer(null);
  }, [timerInterval]);
  const applySubmitResult = useCallback(
    (questionId: string, userAnswer: string, timeMs: number, result: LexiconSubmitResponse) => {
      setQuizState((prev) => {
        if (!prev || prev.showResult) return prev;
        const activeQuestion = prev.questions[prev.currentIndex];
        if (!activeQuestion || activeQuestion.question_id !== questionId) {
          return prev;
        }
        return {
          ...prev,
          answers: [
            ...prev.answers,
            {
              question_id: questionId,
              is_correct: result.is_correct,
              user_answer: userAnswer,
              time_ms: timeMs,
            },
          ],
          currentAnswer: result,
          showResult: true,
        };
      });
    },
    []
  );
  const submitAnswer = useCallback(
    async (questionId: string, userAnswer: string, timeMs: number): Promise<boolean> => {
      if (!questionId) {
        setError(SUBMIT_RETRY_MESSAGE);
        return false;
      }
      if (submitInFlightRef.current && submitQuestionIdRef.current === questionId) {
        return false;
      }
      submitInFlightRef.current = true;
      submitQuestionIdRef.current = questionId;
      setLoading(true);
      setError(null);
      try {
        const response = await submitLexiconAnswer(questionId, userAnswer, timeMs);
        if (response.ok && response.data) {
          applySubmitResult(questionId, userAnswer, timeMs, response.data);
          if (selectedMode === 'typing') {
            setTypingStartTime(null);
          }
          return true;
        }
        setError(response.error?.message || SUBMIT_RETRY_MESSAGE);
        return false;
      } catch {
        setError(SUBMIT_RETRY_MESSAGE);
        return false;
      } finally {
        submitInFlightRef.current = false;
        submitQuestionIdRef.current = null;
        setLoading(false);
      }
    },
    [applySubmitResult, selectedMode]
  );
  const clickLimitSeconds = selectedSkill === 'reading' ? 30 : 20;
  const handleClickAnswer = async (choice: string) => {
    if (!quizState || !selectedMode) return;
    const { questions, currentIndex } = quizState;
    if (questions.length === 0 || currentIndex < 0 || currentIndex >= questions.length) return;
    const currentQuestion = questions[currentIndex];
    const timeMs = clickTimer !== null ? (clickLimitSeconds - clickTimer) * 1000 : 0;
    stopClickTimer();
    await submitAnswer(currentQuestion.question_id, choice, timeMs);
  };
  // Typing回答
  const handleTypingSubmit = async (answer: string): Promise<boolean> => {
    if (!quizState || !selectedMode || !typingStartTime) return false;
    const { questions, currentIndex } = quizState;
    if (questions.length === 0 || currentIndex < 0 || currentIndex >= questions.length) return false;
    const currentQuestion = questions[currentIndex];
    const timeMs = Date.now() - typingStartTime;
    return submitAnswer(currentQuestion.question_id, answer, timeMs);
  };
  const advanceToNextQuestion = () => {
    if (!quizState) return;
    const nextIndex = quizState.currentIndex + 1;
    setQuizState({
      ...quizState,
      currentIndex: nextIndex,
      showResult: false,
      currentAnswer: undefined,
    });
    if (selectedMode === 'typing') setTypingStartTime(Date.now());
    if (selectedMode === 'click') setClickTimer(null);
  };

  // 次の問題へ（Reading では同一 passage_group のセット完了時に簡易サマリーを表示）
  const handleNext = () => {
    if (!quizState) return;

    if (showSetSummary) {
      setShowSetSummary(false);
      setSetSummaryData(null);
      advanceToNextQuestion();
      return;
    }

    const nextIndex = quizState.currentIndex + 1;
    if (nextIndex >= quizState.questions.length) {
      advanceToNextQuestion();
      return;
    }

    const currentMeta = quizState.questions[quizState.currentIndex].meta as { passage_group?: string } | undefined;
    const pg = currentMeta?.passage_group;
    const nextMeta = quizState.questions[nextIndex].meta as { passage_group?: string } | undefined;
    const atSetBoundary = pg && nextMeta?.passage_group !== pg;

    if (atSetBoundary) {
      let start = quizState.currentIndex;
      while (start > 0) {
        const prevMeta = quizState.questions[start - 1].meta as { passage_group?: string } | undefined;
        if (prevMeta?.passage_group !== pg) break;
        start--;
      }
      const total = quizState.currentIndex - start + 1;
      const correct = quizState.answers.slice(start, quizState.currentIndex + 1).filter((a) => a.is_correct).length;
      const setInfo = getReadingSetInfo(quizState.questions, quizState.currentIndex);
      setSetSummaryData({
        correct,
        total,
        setIndex: setInfo?.setIndex,
        setTotal: setInfo?.setTotal,
      });
      setShowSetSummary(true);
      return;
    }

    advanceToNextQuestion();
  };

  // Clickタイマー処理
  useEffect(() => {
    // 既存のタイマーをクリア
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    if (step === 'quiz' && selectedMode === 'click' && quizState && !quizState.showResult) {
      const limitSeconds = clickLimitSeconds;
      const timeMs = limitSeconds * 1000;
      let timer = limitSeconds;
      setClickTimer(timer);

      const interval = setInterval(() => {
        timer--;
        setClickTimer(timer);

        if (timer <= 0) {
          clearInterval(interval);
          setTimerInterval(null);
          const { questions, currentIndex } = quizState;
          if (questions.length > 0 && currentIndex >= 0 && currentIndex < questions.length) {
            const currentQuestion = questions[currentIndex];
            void submitAnswer(currentQuestion.question_id, '', timeMs);
          }
          setClickTimer(null);
        }
      }, 1000);

      setTimerInterval(interval);

      return () => {
        clearInterval(interval);
        setTimerInterval(null);
      };
    } else {
      // タイマーをクリア
      setClickTimer(null);
    }
  }, [clickLimitSeconds, step, selectedMode, selectedSkill, quizState?.currentIndex, quizState?.showResult, submitAnswer]);

  // Reading: passage_group からセット番号・総セット数を算出
  const getReadingSetInfo = (questions: LexiconQuestion[], index: number): { setIndex: number; setTotal: number; setSize: number } | null => {
    if (questions.length === 0 || index < 0 || index >= questions.length) return null;
    const pg = (questions[index].meta as { passage_group?: string } | undefined)?.passage_group;
    let start = index;
    while (start > 0) {
      const prev = (questions[start - 1].meta as { passage_group?: string } | undefined)?.passage_group;
      if (prev !== pg) break;
      start--;
    }
    let end = index;
    while (end < questions.length - 1) {
      const next = (questions[end + 1].meta as { passage_group?: string } | undefined)?.passage_group;
      if (next !== pg) break;
      end++;
    }
    const setSize = end - start + 1;
    let setIndex = 1;
    let i = 0;
    while (i < start) {
      const g = (questions[i].meta as { passage_group?: string } | undefined)?.passage_group;
      i++;
      while (i < questions.length && (questions[i].meta as { passage_group?: string } | undefined)?.passage_group === g) i++;
      setIndex++;
    }
    let setTotal = setIndex;
    let j = end + 1;
    while (j < questions.length) {
      const g = (questions[j].meta as { passage_group?: string } | undefined)?.passage_group;
      j++;
      while (j < questions.length && (questions[j].meta as { passage_group?: string } | undefined)?.passage_group === g) j++;
      setTotal++;
    }
    return { setIndex, setTotal, setSize };
  };

  // category名を表示用ラベルに変換
  const getCategoryLabel = (category: string): string => {
    const readingLabels: Record<string, string> = {
      vocab_reading_paraphrase_drill: 'Paraphrase Drill',
      vocab_reading_matching_headings: 'Matching Headings',
      vocab_reading_tfng: 'True / False / Not Given',
      vocab_reading_summary_completion: 'Summary Completion',
      vocab_reading_matching_information: 'Matching Information',
      vocab_reading_sentence_completion: 'Sentence Completion',
    };
    if (readingLabels[category]) return readingLabels[category];
    const listeningLabels: Record<string, string> = {
      vocab_listening_form_note: 'Form / note completion',
      vocab_listening_campus_daily: 'Campus / daily life',
      vocab_listening_lecture: 'Lecture vocabulary',
      vocab_listening_numbers_dates_spelling: 'Numbers / dates / spelling',
      vocab_listening_spoken_distractors: 'Spoken distractors',
      vocab_listening_paraphrase_conversation: 'Paraphrase in conversation',
    };
    if (listeningLabels[category]) return listeningLabels[category];
    const parts = category.split('_');
    if (parts[0] === 'vocab') {
      if (parts[1] === 'task1') return `Writing / Task1 / 単語`;
      if (parts[1] === 'task2') return `Writing / Task2 / 単語`;
      if (parts[1] === 'speaking') return `Speaking / 単語`;
      if (parts[1] === 'general') return `General / 単語`;
      return `単語 / ${parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ')}`;
    }
    return category;
  };

  // 正答率計算
  const getScore = () => {
    if (!quizState) return { correct: 0, total: 0 };
    const correct = quizState.answers.filter(a => a.is_correct).length;
    return { correct, total: quizState.answers.length };
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className={cn('text-2xl font-bold mb-2', cardTitle)}>単語練習</h1>
          <p className={cn('text-sm', cardDesc)}>4技能の必須単語を覚えましょう</p>
        </div>

        {error && (
          <div className={cn('mb-4 p-4 rounded-lg', cardBase, 'bg-danger/10 border-danger')}>
            <p className="text-danger">{error}</p>
          </div>
        )}

        {/* Step A: skill選択 */}
        {step === 'skill' && (
          <div className="space-y-4">
            <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>スキルを選択</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
              <button
                onClick={() => handleSkillSelect('reading')}
                disabled={loading}
                className={cn(
                  'p-6 rounded-lg border-2 border-border bg-surface-2',
                  'hover:border-accent-violet hover:bg-accent-violet/10',
                  'transition-all duration-200 text-left',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className={cn('font-semibold text-xl mb-2', cardTitle)}>Reading</div>
                <div className={cn('text-sm', cardDesc)}>Academic Reading v1</div>
              </button>
              <button
                onClick={() => handleSkillSelect('listening')}
                disabled={loading}
                className={cn(
                  'p-6 rounded-lg border-2 border-border bg-surface-2',
                  'hover:border-accent-violet hover:bg-accent-violet/10',
                  'transition-all duration-200 text-left',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className={cn('font-semibold text-xl mb-2', cardTitle)}>Listening</div>
                <div className={cn('text-sm', cardDesc)}>Listening Vocab v1（聞き取り・会話表現）</div>
              </button>
              <button
                onClick={() => handleSkillSelect('speaking')}
                disabled={loading}
                className={cn(
                  'p-6 rounded-lg border-2 border-border bg-surface-2',
                  'hover:border-accent-violet hover:bg-accent-violet/10',
                  'transition-all duration-200 text-left',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className={cn('font-semibold text-xl mb-2', cardTitle)}>Speaking</div>
                <div className={cn('text-sm', cardDesc)}>スピーキングで使う単語</div>
              </button>
              <button
                onClick={() => handleSkillSelect('writing')}
                disabled={loading}
                className={cn(
                  'p-6 rounded-lg border-2 border-border bg-surface-2',
                  'hover:border-accent-indigo hover:bg-accent-indigo/10',
                  'transition-all duration-200 text-left',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className={cn('font-semibold text-xl mb-2', cardTitle)}>Writing</div>
                <div className={cn('text-sm', cardDesc)}>ライティングで使う単語</div>
              </button>
            </div>
          </div>
        )}

        {/* Step B: category + mode選択 */}
        {step === 'category' && sets && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => {
                  setStep('skill');
                  setSelectedSkill(null);
                  setSets(null);
                  setReadingTotalDue(null);
                  setReadingFiltersMeta(null);
                  setListeningTotalDue(null);
                  setReadingFilterTopic(null);
                  setReadingFilterDifficulty(null);
                }}
                className={cn('text-sm', buttonSecondary)}
              >
                ← 戻る
              </button>
              <h2 className={cn('text-lg font-semibold', cardTitle)}>
                {selectedSkill === 'reading' ? 'Reading' : selectedSkill === 'listening' ? 'Listening' : selectedSkill === 'writing' ? 'Writing' : 'Speaking'} - カテゴリとモードを選択
              </h2>
            </div>

            {selectedSkill === 'listening' && (
              <>
                <div className={cn('rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm', cardDesc)}>
                  {listeningTotalDue != null && listeningTotalDue > 0 ? (
                    <>
                      <span className="font-medium text-primary">復習Due: {listeningTotalDue}問</span>
                      <span className="ml-1">— Due がある問題から優先して出題されます。</span>
                    </>
                  ) : (
                    '復習Dueはありません。カテゴリを選んで練習を始めましょう。'
                  )}
                </div>
              </>
            )}

            {selectedSkill === 'reading' && (
              <>
                <div className={cn('rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm', cardDesc)}>
                  {readingTotalDue != null && readingTotalDue > 0 ? (
                    <>
                      <span className="font-medium text-primary">復習Due: {readingTotalDue}問</span>
                      <span className="ml-1">— Due がある問題から優先して出題されます。</span>
                    </>
                  ) : (
                    '復習Dueはありません。カテゴリを選んで練習を始めましょう。'
                  )}
                </div>
                {readingFiltersMeta && (readingFiltersMeta.topics.length > 0 || readingFiltersMeta.difficulties.length > 0) && (
                  <div className={cn('flex flex-wrap items-center gap-3 text-sm')}>
                    {readingFiltersMeta.topics.length > 0 && (
                      <label className={cn('flex items-center gap-2', cardDesc)}>
                        <span className="font-medium text-text">Topic:</span>
                        <select
                          value={readingFilterTopic ?? ''}
                          onChange={(e) => setReadingFilterTopic(e.target.value || null)}
                          className={cn('rounded border border-border bg-surface-2 px-2 py-1 text-text')}
                        >
                          <option value="">All</option>
                          {readingFiltersMeta.topics.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </label>
                    )}
                    {readingFiltersMeta.difficulties.length > 0 && (
                      <label className={cn('flex items-center gap-2', cardDesc)}>
                        <span className="font-medium text-text">Difficulty:</span>
                        <select
                          value={readingFilterDifficulty ?? ''}
                          onChange={(e) => setReadingFilterDifficulty(e.target.value || null)}
                          className={cn('rounded border border-border bg-surface-2 px-2 py-1 text-text')}
                        >
                          <option value="">All</option>
                          {readingFiltersMeta.difficulties.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Category選択 */}
            <div>
              <h3 className={cn('text-md font-semibold mb-3', cardTitle)}>カテゴリ</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(sets).map(([category, stats]) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left',
                      selectedCategory === category
                        ? 'border-primary bg-accent-indigo/10'
                        : 'border-border bg-surface-2 hover:border-primary/50',
                      'transition-all duration-200',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring'
                    )}
                  >
                    <div className={cn('font-semibold mb-1', cardTitle)}>
                      {getCategoryLabel(category)}
                    </div>
                    <div className={cn('text-xs', cardDesc)}>
                      {selectedSkill === 'reading' ? '出題数' : '問題数'}: Click {stats.questions_click} / Typing {stats.questions_typing}
                    </div>
                    {(stats.due_click > 0 || stats.due_typing > 0) && (
                      <div className={cn('text-xs mt-1', 'text-primary')}>
                        {selectedSkill === 'reading' ? '復習Due' : 'Due'}: Click {stats.due_click} / Typing {stats.due_typing}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode選択 */}
            {selectedCategory && (
              <div>
                <h3 className={cn('text-md font-semibold mb-3', cardTitle)}>モード</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedMode('click')}
                    disabled={sets[selectedCategory].questions_click === 0}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left',
                      selectedMode === 'click'
                        ? 'border-primary bg-accent-indigo/10'
                        : 'border-border bg-surface-2 hover:border-primary/50',
                      'transition-all duration-200',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                      sets[selectedCategory].questions_click === 0 && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className={cn('font-semibold mb-1', cardTitle)}>Click（選択式）</div>
                    <div className={cn('text-xs', cardDesc)}>
                      {sets[selectedCategory].questions_click}問 / {selectedSkill === 'reading' ? '30' : '20'}秒制限
                    </div>
                    {sets[selectedCategory].due_click > 0 && (
                      <div className={cn('text-xs mt-1', 'text-primary')}>
                        Due: {sets[selectedCategory].due_click}問
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedMode('typing')}
                    disabled={sets[selectedCategory].questions_typing === 0}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left',
                      selectedMode === 'typing'
                        ? 'border-primary bg-accent-indigo/10'
                        : 'border-border bg-surface-2 hover:border-primary/50',
                      'transition-all duration-200',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                      sets[selectedCategory].questions_typing === 0 && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className={cn('font-semibold mb-1', cardTitle)}>Typing（入力式）</div>
                    <div className={cn('text-xs', cardDesc)}>
                      {sets[selectedCategory].questions_typing}問 / 無制限
                    </div>
                    {sets[selectedCategory].due_typing > 0 && (
                      <div className={cn('text-xs mt-1', 'text-primary')}>
                        Due: {sets[selectedCategory].due_typing}問
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Startボタン */}
            {selectedCategory && selectedMode && (
              <div className="flex flex-col items-center gap-3">
                {(selectedSkill === 'reading' || selectedSkill === 'listening') && (sets[selectedCategory].due_click > 0 || sets[selectedCategory].due_typing > 0) && (
                  <p className={cn('text-xs', cardDesc)}>
                    復習Dueがある問題から優先して出題されます
                  </p>
                )}
                {selectedSkill === 'reading' && readingStatsBySkill.length > 0 && (() => {
                  const weak = readingStatsBySkill.filter((s) => s.accuracy_percent < 80 && s.total >= 1);
                  if (weak.length === 0) return null;
                  return (
                    <div className={cn('w-full rounded-lg border border-border bg-surface-2 p-3 text-left')}>
                      <p className={cn('text-xs font-medium mb-2', cardTitle)}>苦手スキルを優先して復習</p>
                      <div className="flex flex-wrap gap-2">
                        {weak.map((s) => (
                          <button
                            key={s.skill_key}
                            onClick={() => handleStartQuiz(true, false, s.skill_key)}
                            disabled={loading}
                            className={cn('px-3 py-1.5 rounded-lg border border-primary/50 bg-primary/10 text-primary text-sm font-medium', 'hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring', loading && 'opacity-50 cursor-not-allowed')}
                          >
                            {s.skill} ({s.accuracy_percent}%) で復習
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                <div className="flex flex-wrap justify-center gap-3">
                  {(selectedSkill === 'reading' || selectedSkill === 'listening') && (() => {
                    const dueForMode = selectedMode === 'click' ? sets[selectedCategory].due_click : sets[selectedCategory].due_typing;
                    return dueForMode > 0 ? (
                      <button
                        onClick={() => handleStartQuiz(true, false)}
                        disabled={loading}
                        className={cn('px-4 py-2 rounded-lg border-2 border-primary bg-primary/10 text-primary font-medium', 'hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring', loading && 'opacity-50 cursor-not-allowed')}
                      >
                        {loading ? '読み込み中...' : `Review only（${dueForMode}問）`}
                      </button>
                    ) : null;
                  })()}
                  {(selectedSkill === 'reading' || selectedSkill === 'listening') && (
                    <button
                      onClick={() => handleStartQuiz(false, true)}
                      disabled={loading}
                      className={cn('px-4 py-2 rounded-lg border-2 border-border bg-surface-2 font-medium', 'hover:bg-surface-2 hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring', loading && 'opacity-50 cursor-not-allowed')}
                    >
                      {loading ? '...' : 'New only'}
                    </button>
                  )}
                  <button
                    onClick={() => handleStartQuiz()}
                    disabled={loading}
                    className={cn('px-6 py-3', buttonPrimary, loading && 'opacity-50 cursor-not-allowed')}
                  >
                    {loading ? (selectedSkill === 'reading' ? 'Reading を読み込み中...' : selectedSkill === 'listening' ? 'Listening を読み込み中...' : '読み込み中...') : (selectedSkill === 'reading' || selectedSkill === 'listening') && (sets[selectedCategory].due_click > 0 || sets[selectedCategory].due_typing > 0) ? '復習＋新規で開始' : '開始'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step C: quizセッション */}
        {step === 'quiz' && quizState && (
          <div className="space-y-6">
            {(selectedSkill === 'reading' || selectedSkill === 'listening') && readingSessionMode && (
              <div className={cn('rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm', cardDesc)}>
                今回: {readingSessionMode === 'review_only' ? '復習のみ' : readingSessionMode === 'new_only' ? '新規のみ' : '復習＋新規'}
              </div>
            )}
            {/* 進捗表示 */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className={cn('text-sm', cardDesc)}>
                {selectedSkill === 'reading' && (() => {
                  const setInfo = getReadingSetInfo(quizState.questions, quizState.currentIndex);
                  if (setInfo && setInfo.setTotal > 1) {
                    return <>Set {setInfo.setIndex}/{setInfo.setTotal} · 問題 {quizState.currentIndex + 1}/{quizState.questions.length}</>;
                  }
                  return <>問題 {quizState.currentIndex + 1} / {quizState.questions.length}</>;
                })()}
                {selectedSkill !== 'reading' && <>問題 {quizState.currentIndex + 1} / {quizState.questions.length}</>}
              </div>
              {selectedMode === 'click' && clickTimer !== null && (
                <div className={cn('text-lg font-semibold', clickTimer <= 3 ? 'text-danger' : 'text-text')}>
                  残り: {clickTimer}秒
                </div>
              )}
            </div>

            {/* 全問終了時のサマリー */}
            {quizState.currentIndex >= quizState.questions.length ? (
              <div className={cn('p-6', cardBase)}>
                <h2 className={cn('text-xl font-semibold mb-4', cardTitle)}>完了！</h2>
                <div className="mb-4 space-y-1">
                  <p className={cn('text-lg', cardDesc)}>
                    解いた問題: {getScore().total}問 / Correct: {getScore().correct} / Incorrect: {getScore().total - getScore().correct}
                  </p>
                  <p className={cn('text-sm', cardDesc)}>
                    正答率: {getScore().total > 0 ? Math.round((getScore().correct / getScore().total) * 100) : 0}%
                  </p>
                  {(selectedSkill === 'reading' || selectedSkill === 'listening') && getScore().total - getScore().correct > 0 && (
                    <p className={cn('text-xs mt-2', cardDesc)}>
                      不正解だった問題は復習リストに残り、後日再度出題されます。
                    </p>
                  )}
                  {selectedSkill === 'reading' && quizState.questions.length > 0 && (() => {
                    const typeLabels: Record<string, string> = {
                      paraphrase_drill: 'Paraphrase',
                      matching_headings: 'Matching',
                      tfng: 'TFNG',
                      summary_completion: 'Summary',
                      matching_information: 'Matching Info',
                      sentence_completion: 'Sentence',
                    };
                    const byType: Record<string, { correct: number; total: number }> = {};
                    quizState.answers.forEach((a, i) => {
                      const q = quizState.questions[i];
                      const t = (q as LexiconQuestion & { question_type?: string }).question_type ?? 'other';
                      if (!byType[t]) byType[t] = { correct: 0, total: 0 };
                      byType[t].total++;
                      if (a.is_correct) byType[t].correct++;
                    });
                    const entries = Object.entries(byType).filter(([, v]) => v.total > 0);
                    if (entries.length === 0) return null;
                    return (
                      <div className={cn('mt-3 pt-3 border-t border-border text-xs', cardDesc)}>
                        <span className="font-medium text-text">問題タイプ別: </span>
                        {entries.map(([t, v]) => (
                          <span key={t} className="mr-2">{typeLabels[t] ?? t} {v.correct}/{v.total}</span>
                        ))}
                      </div>
                    );
                  })()}
                  {selectedSkill === 'reading' && quizState.questions.length > 0 && (() => {
                    const skillLabels: Record<string, string> = {
                      paraphrase: 'Paraphrase',
                      skimming: 'Skimming',
                      scanning: 'Scanning',
                      detail: 'Detail',
                      inference: 'Inference',
                      not_given_confusion: 'Not Given',
                    };
                    const bySkill: Record<string, { correct: number; total: number }> = {};
                    quizState.answers.forEach((a, i) => {
                      const q = quizState.questions[i];
                      const meta = q?.meta as { reading_skill?: string } | undefined;
                      const sk = meta?.reading_skill ?? 'other';
                      if (!bySkill[sk]) bySkill[sk] = { correct: 0, total: 0 };
                      bySkill[sk].total++;
                      if (a.is_correct) bySkill[sk].correct++;
                    });
                    const skillEntries = Object.entries(bySkill).filter(([, v]) => v.total > 0);
                    const weakSkills = skillEntries.filter(([, v]) => v.total >= 1 && (v.correct / v.total) < 0.8);
                    if (weakSkills.length === 0) return null;
                    return (
                      <div className={cn('mt-3 pt-3 border-t border-border text-xs', cardDesc)}>
                        <span className="font-medium text-text">今回弱かったスキル: </span>
                        {weakSkills.map(([sk, v]) => (
                          <span key={sk} className="mr-2">
                            {skillLabels[sk] ?? sk} {v.correct}/{v.total} ({Math.round((v.correct / v.total) * 100)}%)
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleStartQuiz(undefined, undefined)}
                    className={cn('px-4 py-2', buttonPrimary)}
                  >
                    もう一度
                  </button>
                  <button
                    onClick={() => {
                      setStep('category');
                      setQuizState(null);
                      setReadingSessionMode(null);
                    }}
                    className={cn('px-4 py-2', buttonSecondary)}
                  >
                    戻る
                  </button>
                </div>
              </div>
            ) : showSetSummary && setSummaryData ? (
              <div className={cn('p-6', cardBase)}>
                <h3 className={cn('text-lg font-semibold mb-2', cardTitle)}>
                  {setSummaryData.setIndex != null && setSummaryData.setTotal != null && setSummaryData.setTotal > 1
                    ? `セット ${setSummaryData.setIndex}/${setSummaryData.setTotal} の結果`
                    : 'このセットの結果'}
                </h3>
                <p className={cn('text-sm', cardDesc)}>
                  {setSummaryData.correct} / {setSummaryData.total} 問正解
                </p>
                <button
                  onClick={() => {
                    setShowSetSummary(false);
                    setSetSummaryData(null);
                    advanceToNextQuestion();
                  }}
                  className={cn('mt-4 px-4 py-2', buttonPrimary)}
                >
                  次のセットへ
                </button>
              </div>
            ) : (
              <>
                {/* 問題表示 */}
                {(() => {
                  const idx = quizState.currentIndex;
                  const questions = quizState.questions;
                  if (questions.length === 0 || idx < 0 || idx >= questions.length) return null;
                  const currentQuestion = questions[idx];
                  return !quizState.showResult ? (
                  <div className={cn('p-6', cardBase)}>
                    {/* Reading: passage first */}
                    {currentQuestion.passage_excerpt && (
                      <div className={cn('mb-4 p-4 rounded-lg bg-surface-2 border border-border max-h-40 sm:max-h-48 overflow-y-auto overscroll-contain', 'text-sm text-text-muted leading-relaxed')}>
                        {currentQuestion.passage_excerpt}
                      </div>
                    )}
                    {currentQuestion.strategy && (
                      <div className={cn('mb-3 text-xs text-text-muted italic')}>
                        Strategy: {currentQuestion.strategy}
                      </div>
                    )}
                    <div className={cn('text-lg font-semibold mb-4', cardTitle)}>
                      {currentQuestion.prompt}
                    </div>

                    {/* Clickモード */}
                    {selectedMode === 'click' && currentQuestion.choices && (
                      <div className="space-y-3">
                        {currentQuestion.choices.map((choice, choiceIdx) => (
                          <button
                            key={choiceIdx}
                            onClick={() => handleClickAnswer(choice)}
                            disabled={loading}
                            className={cn(
                              'w-full p-4 rounded-lg border-2 border-border bg-surface-2',
                              'hover:border-primary hover:bg-accent-indigo/10',
                              'transition-all duration-200 text-left',
                              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                              loading && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            {choice}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Typingモード */}
                    {selectedMode === 'typing' && (
                      <TypingInput
                        question={currentQuestion}
                        onSubmit={handleTypingSubmit}
                        loading={loading}
                      />
                    )}
                  </div>
                ) : (
                  /* 結果表示 */
                  <div className={cn('p-6', cardBase)}>
                    <div className="mb-4">
                      {quizState.currentAnswer?.is_correct ? (
                        <div className={cn('text-lg font-semibold text-success mb-2')}>✓ 正解！</div>
                      ) : (
                        <div className={cn('text-lg font-semibold text-danger mb-2')}>✗ 不正解</div>
                      )}
                      <div className={cn('text-sm font-medium text-text mb-1')}>Correct answer</div>
                      <div className={cn('text-sm', cardDesc)}>{quizState.currentAnswer?.correct_expression}</div>
                      {quizState.answers[quizState.answers.length - 1]?.user_answer && !quizState.currentAnswer?.is_correct && (
                        <>
                          <div className={cn('text-sm font-medium text-text mt-2 mb-1')}>Your answer</div>
                          <div className={cn('text-sm', cardDesc)}>{quizState.answers[quizState.answers.length - 1].user_answer}</div>
                        </>
                      )}
                      {(() => {
                        const meta = currentQuestion.meta as { explanation?: string; distractor_note?: string; paraphrase_tip?: string } | undefined;
                        const showMeta = selectedSkill === 'reading' || selectedSkill === 'listening';
                        if (!meta && !showMeta) return null;
                        const hasAny = meta && (meta.explanation || meta.distractor_note || meta.paraphrase_tip);
                        if (!hasAny) return null;
                        return (
                          <div className={cn('mt-4 p-3 rounded-lg bg-surface-2 border border-border space-y-2', showMeta ? 'text-sm' : 'text-xs')}>
                            {meta!.explanation && (
                              <>
                                <div className={cn('font-medium text-text')}>Why this is correct</div>
                                <div className={cardDesc}>{meta!.explanation}</div>
                              </>
                            )}
                            {meta!.distractor_note && (
                              <>
                                <div className={cn('font-medium text-text mt-2')}>Why the distractor is wrong</div>
                                <div className={cardDesc}>{meta!.distractor_note}</div>
                              </>
                            )}
                            {meta!.paraphrase_tip && (
                              <>
                                <div className={cn('font-medium text-text mt-2')}>Key paraphrase</div>
                                <div className={cardDesc}>{meta!.paraphrase_tip}</div>
                              </>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    <button
                      onClick={handleNext}
                      className={cn('px-4 py-2', buttonPrimary)}
                    >
                      次へ
                    </button>
                  </div>
                );
                })()}
              </>
            )}
          </div>
        )}

        {loading && step !== 'quiz' && (
          <div className="text-center text-text-muted">
            {selectedSkill === 'reading' ? 'Reading を読み込み中...' : selectedSkill === 'listening' ? 'Listening を読み込み中...' : '読み込み中...'}
          </div>
        )}
      </div>
    </>
  );
}

export { VocabPageContent };

// Typing入力コンポーネント
function TypingInput({
  question,
  onSubmit,
  loading,
}: {
  question: LexiconQuestion;
  onSubmit: (answer: string) => Promise<boolean>;
  loading: boolean;
}) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = async () => {
    if (!answer.trim() || loading) return;

    const normalizedAnswer = answer.trim();
    const submitted = await onSubmit(normalizedAnswer);
    if (submitted) {
      setAnswer('');
    }
  };

  return (
    <div className="space-y-4">
      {question.hint_first_char && question.hint_length && (
        <div className={cn('text-sm', cardDesc)}>
          Hint: {question.hint_first_char}, {question.hint_length} letters
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              void handleSubmit();
            }
          }}
          disabled={loading}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg border border-border bg-surface-2 text-text',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:opacity-50',
            'transition-all duration-200'
          )}
          placeholder="英語で入力してください"
          autoFocus
        />
        <button
          onClick={() => {
            void handleSubmit();
          }}
          disabled={loading || !answer.trim()}
          className={cn('px-4 py-2', buttonPrimary, (loading || !answer.trim()) && 'opacity-50 cursor-not-allowed')}
        >
          送信
        </button>
      </div>
    </div>
  );
}
