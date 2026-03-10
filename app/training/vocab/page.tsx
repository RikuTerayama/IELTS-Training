'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
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
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [clickTimer, setClickTimer] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL ?skill=speaking|writing|reading のとき fetch して category へ
  const validSkillQuery = urlSkill === 'speaking' || urlSkill === 'writing' || urlSkill === 'reading';
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
          setError(`${urlSkill === 'reading' ? 'Reading' : 'このスキル'}のデータがありません。シードを実行してください。`);
        } else {
          setSets(setsData);
          if (urlSkill === 'reading') {
            setReadingTotalDue(response.data!.total_due ?? 0);
            setReadingFiltersMeta(response.data!.filters_meta ?? null);
          } else {
            setReadingTotalDue(null);
            setReadingFiltersMeta(null);
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

  // Step A: skill選択
  const handleSkillSelect = async (skill: 'speaking' | 'writing' | 'reading') => {
    setSelectedSkill(skill);
    setLoading(true);
    setError(null);

    try {
      const response = await fetchLexiconSets(skill, 'vocab');
      if (response.ok && response.data) {
        const setsData = response.data.sets;
        if (Object.keys(setsData).length === 0) {
          setError(`${skill === 'reading' ? 'Reading' : 'このスキル'}のデータがありません。シードを実行してください。`);
        } else {
          setSets(setsData);
          if (skill === 'reading') {
            setReadingTotalDue(response.data.total_due ?? 0);
            setReadingFiltersMeta(response.data.filters_meta ?? null);
          } else {
            setReadingTotalDue(null);
            setReadingFiltersMeta(null);
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
  const handleStartQuiz = async (reviewOnly?: boolean, newOnly?: boolean) => {
    if (!selectedCategory || !selectedMode || !selectedSkill) return;
    if (selectedSkill === 'listening') return; // listening は Coming soon

    setLoading(true);
    setError(null);

    const readingParams =
      selectedSkill === 'reading'
        ? {
            review_only: reviewOnly,
            new_only: newOnly,
            topic: readingFilterTopic || undefined,
            difficulty: readingFilterDifficulty || undefined,
          }
        : undefined;

    try {
      const response = await fetchLexiconQuestions(
        selectedSkill as 'speaking' | 'writing' | 'reading',
        selectedCategory,
        selectedMode,
        10,
        'vocab',
        readingParams
      );
        if (response.ok && response.data) {
        if (!response.data.questions || response.data.questions.length === 0) {
          const isReading = selectedSkill === 'reading';
          const cat = sets?.[selectedCategory];
          const hasDue = cat && (cat.due_click > 0 || cat.due_typing > 0);
          setError(
            isReading && reviewOnly
              ? 'このカテゴリ・モードに復習Dueはありません。別のカテゴリやモードを選ぶか、「開始」で新規＋復習を試してください。'
              : isReading && newOnly
                ? 'この条件に該当する新規問題はありません。フィルタを変えるか、「復習＋新規で開始」を試してください。'
                : isReading && hasDue
                  ? 'このカテゴリ・モードには復習Dueがありません。別のモードかカテゴリをお試しください。'
                  : isReading
                    ? 'このカテゴリに復習Dueも新規問題もありません。'
                    : 'この条件では問題がありません。別のカテゴリやモードをお試しください。'
          );
          return;
        }

        setQuizState({
          questions: response.data.questions,
          currentIndex: 0,
          answers: [],
          showResult: false,
        });
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
  const handleClickAnswer = async (choice: string) => {
    if (!quizState || !selectedMode) return;

    const currentQuestion = quizState.questions[quizState.currentIndex];
    const timeMs = clickTimer !== null ? (10 - clickTimer) * 1000 : 0;

    // タイマー停止
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setClickTimer(null);

    setLoading(true);
    try {
      const response = await submitLexiconAnswer(currentQuestion.question_id, choice, timeMs);
      if (response.ok && response.data) {
        setQuizState({
          ...quizState,
          answers: [
            ...quizState.answers,
            {
              question_id: currentQuestion.question_id,
              is_correct: response.data.is_correct,
              user_answer: choice,
              time_ms: timeMs,
            },
          ],
          currentAnswer: response.data,
          showResult: true,
        });
      } else {
        setError(response.error?.message || 'Failed to submit answer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Typing回答
  const handleTypingSubmit = async (answer: string) => {
    if (!quizState || !selectedMode || !typingStartTime) return;

    const currentQuestion = quizState.questions[quizState.currentIndex];
    const timeMs = Date.now() - typingStartTime;

    setLoading(true);
    try {
      const response = await submitLexiconAnswer(currentQuestion.question_id, answer, timeMs);
      if (response.ok && response.data) {
        setQuizState({
          ...quizState,
          answers: [
            ...quizState.answers,
            {
              question_id: currentQuestion.question_id,
              is_correct: response.data.is_correct,
              user_answer: answer,
              time_ms: timeMs,
            },
          ],
          currentAnswer: response.data,
          showResult: true,
        });
        setTypingStartTime(null);
      } else {
        setError(response.error?.message || 'Failed to submit answer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // 次の問題へ
  const handleNext = () => {
    if (!quizState) return;

    const nextIndex = quizState.currentIndex + 1;
    if (nextIndex >= quizState.questions.length) {
      // 全問終了
      return;
    }

    setQuizState({
      ...quizState,
      currentIndex: nextIndex,
      showResult: false,
      currentAnswer: undefined,
    });

    // typingモードの場合は開始時刻を記録
    if (selectedMode === 'typing') {
      setTypingStartTime(Date.now());
    }

    // clickモードの場合はタイマーをリセット（useEffectで再起動される）
    if (selectedMode === 'click') {
      setClickTimer(null);
    }
  };

  // Clickタイマー処理
  useEffect(() => {
    // 既存のタイマーをクリア
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    if (step === 'quiz' && selectedMode === 'click' && quizState && !quizState.showResult) {
      let timer = 10;
      setClickTimer(timer);

      const interval = setInterval(() => {
        timer--;
        setClickTimer(timer);

        if (timer <= 0) {
          clearInterval(interval);
          setTimerInterval(null);
          // 自動submit（不正解）
          const currentQuestion = quizState.questions[quizState.currentIndex];
          submitLexiconAnswer(currentQuestion.question_id, '', 10000).then((response) => {
            if (response.ok && response.data) {
              setQuizState((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  answers: [
                    ...prev.answers,
                    {
                      question_id: currentQuestion.question_id,
                      is_correct: false,
                      user_answer: '',
                      time_ms: 10000,
                    },
                  ],
                  currentAnswer: response.data,
                  showResult: true,
                };
              });
            }
          });
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
  }, [step, selectedMode, quizState?.currentIndex, quizState?.showResult]);

  // category名を表示用ラベルに変換
  const getCategoryLabel = (category: string): string => {
    const readingLabels: Record<string, string> = {
      vocab_reading_paraphrase_drill: 'Paraphrase Drill',
      vocab_reading_matching_headings: 'Matching Headings',
      vocab_reading_tfng: 'True / False / Not Given',
      vocab_reading_summary_completion: 'Summary Completion',
    };
    if (readingLabels[category]) return readingLabels[category];
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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className={cn('text-2xl font-bold mb-2', cardTitle)}>単語練習</h1>
          <p className={cn('text-sm', cardDesc)}>Writing/Speakingで使う必須単語を覚えましょう</p>
        </div>

        {/* listening: Coming soon。reading は有効 */}
        {urlSkill === 'listening' ? (
          <ComingSoonSkillsView basePath="/training/vocab" />
        ) : (
          <>
        {error && (
          <div className={cn('mb-4 p-4 rounded-lg', cardBase, 'bg-danger/10 border-danger')}>
            <p className="text-danger">{error}</p>
          </div>
        )}

        {/* Step A: skill選択（4技能、Reading/Listening は Coming soon） */}
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
              <span
                className={cn(
                  'p-6 rounded-lg border-2 border-border bg-surface-2',
                  'opacity-70 cursor-not-allowed text-left'
                )}
              >
                <div className={cn('font-semibold text-xl mb-2', cardTitle)}>Listening</div>
                <div className={cn('text-sm', cardDesc)}>Coming soon</div>
              </span>
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
                  setReadingFilterTopic(null);
                  setReadingFilterDifficulty(null);
                }}
                className={cn('text-sm', buttonSecondary)}
              >
                ← 戻る
              </button>
              <h2 className={cn('text-lg font-semibold', cardTitle)}>
                {selectedSkill === 'reading' ? 'Reading' : selectedSkill === 'writing' ? 'Writing' : 'Speaking'} - カテゴリとモードを選択
              </h2>
            </div>

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
                      {sets[selectedCategory].questions_click}問 / 10秒制限
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
                {selectedSkill === 'reading' && (sets[selectedCategory].due_click > 0 || sets[selectedCategory].due_typing > 0) && (
                  <p className={cn('text-xs', cardDesc)}>
                    復習Dueがある問題から優先して出題されます
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedSkill === 'reading' && (() => {
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
                  {selectedSkill === 'reading' && (
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
                    {loading ? (selectedSkill === 'reading' ? 'Reading を読み込み中...' : '読み込み中...') : selectedSkill === 'reading' && (sets[selectedCategory].due_click > 0 || sets[selectedCategory].due_typing > 0) ? '復習＋新規で開始' : '開始'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step C: quizセッション */}
        {step === 'quiz' && quizState && (
          <div className="space-y-6">
            {/* 進捗表示 */}
            <div className="flex items-center justify-between">
              <div className={cn('text-sm', cardDesc)}>
                問題 {quizState.currentIndex + 1} / {quizState.questions.length}
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
                <div className="mb-4">
                  <p className={cn('text-lg', cardDesc)}>
                    正答数: {getScore().correct} / {getScore().total}
                  </p>
                  <p className={cn('text-sm', cardDesc)}>
                    正答率: {Math.round((getScore().correct / getScore().total) * 100)}%
                  </p>
                </div>
                <div className="flex gap-4">
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
                    }}
                    className={cn('px-4 py-2', buttonSecondary)}
                  >
                    戻る
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 問題表示 */}
                {!quizState.showResult ? (
                  <div className={cn('p-6', cardBase)}>
                    {/* Reading: passage first */}
                    {quizState.questions[quizState.currentIndex].passage_excerpt && (
                      <div className={cn('mb-4 p-4 rounded-lg bg-surface-2 border border-border max-h-40 sm:max-h-48 overflow-y-auto overscroll-contain', 'text-sm text-text-muted leading-relaxed')}>
                        {quizState.questions[quizState.currentIndex].passage_excerpt}
                      </div>
                    )}
                    {quizState.questions[quizState.currentIndex].strategy && (
                      <div className={cn('mb-3 text-xs text-text-muted italic')}>
                        Strategy: {quizState.questions[quizState.currentIndex].strategy}
                      </div>
                    )}
                    <div className={cn('text-lg font-semibold mb-4', cardTitle)}>
                      {quizState.questions[quizState.currentIndex].prompt}
                    </div>

                    {/* Clickモード */}
                    {selectedMode === 'click' && quizState.questions[quizState.currentIndex].choices && (
                      <div className="space-y-3">
                        {quizState.questions[quizState.currentIndex].choices!.map((choice, idx) => (
                          <button
                            key={idx}
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
                        question={quizState.questions[quizState.currentIndex]}
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
                      <div className={cn('text-sm', cardDesc)}>
                        正答: {quizState.currentAnswer?.correct_expression}
                      </div>
                      {quizState.answers[quizState.answers.length - 1]?.user_answer && (
                        <div className={cn('text-sm', cardDesc)}>
                          あなたの回答: {quizState.answers[quizState.answers.length - 1].user_answer}
                        </div>
                      )}
                      {(() => {
                        const meta = quizState.questions[quizState.currentIndex].meta as { explanation?: string; distractor_note?: string; paraphrase_tip?: string } | undefined;
                        if (!meta) return null;
                        return (
                          <div className={cn('mt-3 space-y-2 text-xs border-t border-border pt-3')}>
                            {meta.explanation && (
                              <div><span className="font-medium text-text">根拠:</span> <span className={cardDesc}>{meta.explanation}</span></div>
                            )}
                            {meta.distractor_note && (
                              <div><span className="font-medium text-text">ひっかけ:</span> <span className={cardDesc}>{meta.distractor_note}</span></div>
                            )}
                            {meta.paraphrase_tip && (
                              <div><span className="font-medium text-text">言い換え:</span> <span className={cardDesc}>{meta.paraphrase_tip}</span></div>
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
                )}
              </>
            )}
          </div>
        )}

        {loading && step !== 'quiz' && (
          <div className="text-center text-text-muted">
            {selectedSkill === 'reading' ? 'Reading を読み込み中...' : '読み込み中...'}
          </div>
        )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default function VocabPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className={cn('text-2xl font-bold mb-2', cardTitle)}>単語練習</h1>
            <p className={cn('text-sm', cardDesc)}>Writing/Speakingで使う必須単語を覚えましょう</p>
          </div>
          <div className="text-center text-text-muted py-12">読み込み中...</div>
        </div>
      </Layout>
    }>
      <VocabPageContent />
    </Suspense>
  );
}

// Typing入力コンポーネント
function TypingInput({
  question,
  onSubmit,
  loading,
}: {
  question: LexiconQuestion;
  onSubmit: (answer: string) => void;
  loading: boolean;
}) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
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
              handleSubmit();
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
          onClick={handleSubmit}
          disabled={loading || !answer.trim()}
          className={cn('px-4 py-2', buttonPrimary, (loading || !answer.trim()) && 'opacity-50 cursor-not-allowed')}
        >
          送信
        </button>
      </div>
    </div>
  );
}
