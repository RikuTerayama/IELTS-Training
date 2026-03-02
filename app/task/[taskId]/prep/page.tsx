'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Task1Image } from '@/components/task/Task1Image';
import { getTask1GenreName, getTask1GenreNameEnglish } from '@/lib/utils/task1Helpers';
import { cn, cardBase, cardTitle, cardDesc, textareaBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';
import type { Task } from '@/lib/domain/types';
import { WRITING_RECOMMENDED_FALLBACK } from '@/lib/data/writing_recommended_fallback';

/** W2-FR-3: Task2 実施時の40分タイマー（Start/Pause/Reset） */
function Task2TimerBlock() {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);
  const display = `${String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:${String(elapsedSec % 60).padStart(2, '0')}`;
  return (
    <div className={cn('mb-6 p-4 rounded-xl', cardBase, 'flex flex-wrap items-center gap-4')}>
      <span className="text-2xl font-mono font-bold text-slate-900">{display}</span>
      <span className="text-sm text-slate-500">（目安 40分）</span>
      <div className="flex gap-2">
        <button type="button" onClick={() => setRunning((r) => !r)} className={cn('px-3 py-1.5 rounded-lg text-sm', buttonSecondary)}>{running ? 'Pause' : 'Start'}</button>
        <button type="button" onClick={() => { setRunning(false); setElapsedSec(0); }} className={cn('px-3 py-1.5 rounded-lg text-sm', buttonSecondary)}>Reset</button>
      </div>
    </div>
  );
}

type PrepStep = 'point' | 'reason' | 'example' | 'point_again' | 'japanese_evaluation' | 'english_generation' | 'ielts_feedback';

interface PrepAnswers {
  point: string;
  reason: string;
  example: string;
  point_again: string;
}

interface JapaneseEvaluation {
  is_valid_prep: boolean;
  score_estimate: string;
  missing_points: string[];
  feedback: string;
}

interface EnglishEssay {
  essay: string;
  word_count: number;
}

export default function PrepTaskPage() {
  const params = useParams();
  const taskId = params.taskId as string;
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentStep, setCurrentStep] = useState<PrepStep>('point');
  const [answers, setAnswers] = useState<PrepAnswers>({
    point: '',
    reason: '',
    example: '',
    point_again: '',
  });
  const [japaneseEvaluation, setJapaneseEvaluation] = useState<JapaneseEvaluation | null>(null);
  const [englishEssay, setEnglishEssay] = useState<EnglishEssay | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiredItems, setRequiredItems] = useState<Array<{ module: string; expression: string; ja_hint?: string }>>([]);

  useEffect(() => {
    if (taskId === 'new') {
      setLevel('beginner');
      setTask({
        id: 'new',
        level: 'beginner',
        question: 'Some people think that working from home has more advantages than working in an office. Do you agree or disagree?',
        question_type: 'Task 2',
        required_vocab: [
          { word: 'commute', meaning: '通勤する', skill_tags: ['writing', 'speaking'] },
          { word: 'flexible', meaning: '柔軟な', skill_tags: ['writing'] },
        ],
        prep_guide: {
          point: 'Your opinion should be clear',
          reason: 'Provide 2-3 reasons',
          example: 'Include one concrete example',
          point_again: 'Restate your opinion in conclusion',
          structure: ['Introduction', 'Body 1', 'Body 2', 'Conclusion'],
        },
        created_at: new Date().toISOString(),
      });
      setRequiredItems(WRITING_RECOMMENDED_FALLBACK.map((f) => ({ module: f.module, expression: f.expression, ja_hint: f.ja_hint })));
      setLoading(false);
      return;
    }

    fetch(`/api/tasks/${taskId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          if (data.data.question_type === 'Task 1') {
            const urlParams = new URLSearchParams(window.location.search);
            const modeParam = urlParams.get('mode');
            const modeQuery = modeParam === 'exam' ? '?mode=exam' : '';
            router.replace(`/task/${taskId}${modeQuery}`);
            return;
          }
          setTask(data.data);
          setLevel(data.data.level);
          // AC-X1: Task2 で推奨表現を取得
          fetch('/api/input/items?skill=writing&modules=vocab,idiom,lexicon&limit=8')
            .then((r) => r.json())
            .then((d) => {
              if (d.ok && d.data?.items?.length) setRequiredItems(d.data.items.map((i: { module?: string; expression: string; ja_hint?: string }) => ({ module: i.module || 'vocab', expression: i.expression, ja_hint: i.ja_hint })));
              else setRequiredItems(WRITING_RECOMMENDED_FALLBACK.map((f) => ({ module: f.module, expression: f.expression, ja_hint: f.ja_hint })));
            })
            .catch(() => setRequiredItems(WRITING_RECOMMENDED_FALLBACK.map((f) => ({ module: f.module, expression: f.expression, ja_hint: f.ja_hint }))));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [taskId, router]);

  const handleAnswerChange = (step: PrepStep, value: string) => {
    if (step === 'point') setAnswers({ ...answers, point: value });
    else if (step === 'reason') setAnswers({ ...answers, reason: value });
    else if (step === 'example') setAnswers({ ...answers, example: value });
    else if (step === 'point_again') setAnswers({ ...answers, point_again: value });
  };

  const handleNext = () => {
    if (currentStep === 'point' && answers.point.trim()) {
      setCurrentStep('reason');
    } else if (currentStep === 'reason' && answers.reason.trim()) {
      setCurrentStep('example');
    } else if (currentStep === 'example' && answers.example.trim()) {
      setCurrentStep('point_again');
    } else if (currentStep === 'point_again' && answers.point_again.trim()) {
      handleJapaneseEvaluation();
    } else if (currentStep === 'japanese_evaluation' && japaneseEvaluation) {
      handleEnglishGeneration();
    } else if (currentStep === 'english_generation' && englishEssay) {
      handleIeltsFeedback();
    }
  };

  const handleJapaneseEvaluation = async () => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/llm/prep-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_question: task?.question,
          task_type: task?.question_type,
          prep_answers: answers,
          level,
        }),
      });

      if (!response.ok) {
        throw new Error('評価の生成に失敗しました');
      }

      const data = await response.json();
      if (data.ok) {
        setJapaneseEvaluation(data.data);
        setCurrentStep('japanese_evaluation');
      } else {
        throw new Error(data.error?.message || '評価の生成に失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setProcessing(false);
    }
  };

  const handleEnglishGeneration = async () => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/llm/prep-to-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_question: task?.question,
          task_type: task?.question_type,
          prep_answers: answers,
          japanese_evaluation: japaneseEvaluation,
          level,
          required_vocab: task?.required_vocab || [],
        }),
      });

      if (!response.ok) {
        throw new Error('英語エッセイの生成に失敗しました');
      }

      const data = await response.json();
      if (data.ok) {
        setEnglishEssay(data.data);
        setCurrentStep('english_generation');
      } else {
        throw new Error(data.error?.message || '英語エッセイの生成に失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setProcessing(false);
    }
  };

  const handleIeltsFeedback = async () => {
    if (!task || !englishEssay) return;

    setProcessing(true);
    setError(null);

    try {
      // まずタスクを生成または取得
      let actualTaskId = task.id;
      if (taskId === 'new' || task.id === 'new') {
        const generateResponse = await fetch('/api/tasks/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level }),
        });

        if (!generateResponse.ok) {
          throw new Error('タスクの生成に失敗しました');
        }

        const generateData = await generateResponse.json();
        if (!generateData.ok || !generateData.data?.id) {
          throw new Error('タスクの生成に失敗しました');
        }

        actualTaskId = generateData.data.id;
      }

      // 回答を送信
      const submitResponse = await fetch(`/api/tasks/${actualTaskId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          draft_content: {
            japanese: `${answers.point}\n${answers.reason}\n${answers.example}\n${answers.point_again}`,
            final: englishEssay.essay,
            prep_answers: answers,
            japanese_evaluation: japaneseEvaluation,
            english_essay: englishEssay,
          },
        }),
      });

      if (!submitResponse.ok) {
        throw new Error('回答の送信に失敗しました');
      }

      const submitData = await submitResponse.json();
      if (submitData.ok) {
        // フィードバックページにリダイレクト
        router.push(`/feedback/${submitData.data.attempt_id}`);
      } else {
        throw new Error(submitData.error?.message || '回答の送信に失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setProcessing(false);
    }
  };

  const getCurrentQuestion = () => {
    const isTask1 = task?.question_type === 'Task 1';
    const genreName = task ? getTask1GenreName(task.question) : '';
    const genreNameEnglish = task ? getTask1GenreNameEnglish(task.question) : '';
    
    if (isTask1) {
      // Task1用の質問
      switch (currentStep) {
        case 'point':
          return {
            title: 'P (ポイント) は何？',
            description: `${genreNameEnglish}における主な特徴を述べることが大切です。グラフや表から読み取れる主な傾向や変化を日本語で書いてください。`,
            placeholder: `例：訪問者数は2010年から2020年にかけて一直線で増加傾向にある。`,
          };
        case 'example':
          return {
            title: 'E (具体例) は何？',
            description: '具体的な数値やデータを挙げて、特徴を具体的に説明します。具体的な数値や年、比較などを日本語で書いてください。',
            placeholder: '例：2010年は15,000人だったのに、2020年には35,000人に増加している。また、2014年に28,000人でピークを迎えた後、一時的に減少したが、その後再び増加に転じた。',
          };
        default:
          return { title: '', description: '', placeholder: '' };
      }
    } else {
      // Task2用の質問
      switch (currentStep) {
        case 'point':
          return {
            title: 'P (Point) は何？',
            description: task?.prep_guide?.point || 'あなたの意見（Point）を日本語で書いてください。',
            placeholder: '例：私は学校の始業時間を遅くすべきだと思います。',
          };
        case 'reason':
          return {
            title: 'R (Reason) は何？',
            description: task?.prep_guide?.reason || '2-3の理由を挙げて、自分の意見が裏付けられるようにします。あなたの理由を日本語で書いてください。',
            placeholder: '例：\n1. 睡眠不足の解消\n2. 学習効率の向上\n3. 健康への配慮',
          };
        case 'example':
          return {
            title: 'E (Example) は何？',
            description: task?.prep_guide?.example || 'ある具体的な例を挙げて、自分の意見を具体的に説明します。具体的な例を日本語で書いてください。',
            placeholder: '例：例えば、アメリカの一部の学校では、始業時間を遅らせた結果、生徒の成績が向上したという研究結果があります。',
          };
        case 'point_again':
          return {
            title: 'P (Point again) は？',
            description: task?.prep_guide?.point_again || '結論で自分の意見を再び述べます。結論を日本語で書いてください。',
            placeholder: '例：したがって、学校の始業時間を遅くすることは、生徒の健康と学習効果の両面で有益であると考えます。',
          };
        default:
          return { title: '', description: '', placeholder: '' };
      }
    }
  };

  const getCurrentAnswer = () => {
    switch (currentStep) {
      case 'point':
        return answers.point;
      case 'reason':
        return answers.reason;
      case 'example':
        return answers.example;
      case 'point_again':
        return answers.point_again;
      default:
        return '';
    }
  };

  const canProceed = () => {
    const isTask1 = task?.question_type === 'Task 1';
    
    if (currentStep === 'point') return answers.point.trim().length > 0;
    if (currentStep === 'reason' && !isTask1) return answers.reason.trim().length > 0;
    if (currentStep === 'example') return answers.example.trim().length > 0;
    if (currentStep === 'point_again' && !isTask1) return answers.point_again.trim().length > 0;
    if (currentStep === 'japanese_evaluation') return !!japaneseEvaluation;
    if (currentStep === 'english_generation') return !!englishEssay;
    return false;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">タスクが見つかりません</div>
        </div>
      </Layout>
    );
  }

  const question = getCurrentQuestion();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* W2-FR-3: Task2 の40分タイマー */}
        {task.question_type === 'Task 2' && <Task2TimerBlock />}

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={cn('text-sm font-medium', cardDesc)}>
              {(() => {
                const isTask1 = task?.question_type === 'Task 1';
                const totalSteps = isTask1 ? 5 : 7;
                const stepNumbers: Record<string, number> = isTask1
                  ? { point: 1, example: 2, japanese_evaluation: 3, english_generation: 4, ielts_feedback: 5 }
                  : { point: 1, reason: 2, example: 3, point_again: 4, japanese_evaluation: 5, english_generation: 6, ielts_feedback: 7 };
                return `ステップ ${stepNumbers[currentStep] || 0}/${totalSteps}`;
              })()}
            </span>
          </div>
          <div className={cn('w-full rounded-full h-2', 'bg-surface-2')}>
            <div
              className={cn('h-2 rounded-full transition-all duration-300', 'bg-primary')}
              style={{
                width: (() => {
                  const isTask1 = task?.question_type === 'Task 1';
                  if (isTask1) {
                    switch (currentStep) {
                      case 'point': return '20%';
                      case 'example': return '40%';
                      case 'japanese_evaluation': return '60%';
                      case 'english_generation': return '80%';
                      case 'ielts_feedback': return '100%';
                      default: return '0%';
                    }
                  } else {
                    switch (currentStep) {
                      case 'point': return '14%';
                      case 'reason': return '28%';
                      case 'example': return '42%';
                      case 'point_again': return '57%';
                      case 'japanese_evaluation': return '71%';
                      case 'english_generation': return '85%';
                      case 'ielts_feedback': return '100%';
                      default: return '0%';
                    }
                  }
                })(),
              }}
            ></div>
          </div>
        </div>

        {/* お題表示 */}
        <div className={cn('p-6 mb-6', cardBase)}>
          <h2 className={cn('mb-2 text-lg font-semibold', cardTitle)}>お題</h2>
          
          {/* Task1の場合は画像を表示 */}
          {task.question_type === 'Task 1' && (
            <div className="mb-4">
              <Task1Image
                question={task.question}
                level={level}
                imagePath={(task as any).image_path}
                alt="Task 1 Chart or Diagram"
                className="w-full"
              />
            </div>
          )}
          
          <p className={cardDesc}>{task.question}</p>
          <div className="mt-4 space-y-2">
            <p className={cardDesc}>
              目標: Band <span className={cn('font-medium', 'text-text')}>6.0-6.5</span>
            </p>
            <p className={cardDesc}>
              必須語彙:{' '}
              {task.required_vocab.map((v) => (
                <span key={v.word} className={cn('mr-2 rounded border border-primary/20 bg-accent-indigo/10 px-2 py-1 text-sm', 'text-text')}>
                  {v.word}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* AC-X1: 使う表現を常時表示。PREP回答・エッセイとの文字列一致で Used 表示 */}
        {task?.question_type === 'Task 2' && (() => {
          const displayItems = requiredItems.length > 0 ? requiredItems : WRITING_RECOMMENDED_FALLBACK.map((f) => ({ module: f.module, expression: f.expression, ja_hint: f.ja_hint }));
          const combinedText = (answers.point + ' ' + answers.reason + ' ' + answers.example + ' ' + answers.point_again + ' ' + (englishEssay?.essay || '')).toLowerCase();
          return (
            <div className={cn('p-6 mb-6', cardBase, 'bg-indigo-50/50 border-indigo-200')}>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">使う表現（{displayItems.length}個）</h3>
              <div className="flex flex-wrap gap-2">
                {displayItems.map((item, idx) => {
                  const used = combinedText.includes(item.expression.toLowerCase());
                  return (
                    <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-sm shadow-sm">
                      <span className="font-semibold text-indigo-900">{item.expression}</span>
                      {item.ja_hint && <span className="text-xs text-slate-500">（{item.ja_hint}）</span>}
                      <span className="text-xs text-indigo-600 font-medium">[{item.module}]</span>
                      {used && <span className="text-xs font-semibold text-emerald-600 ml-1">Used</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ステップ別コンテンツ */}
        {currentStep === 'japanese_evaluation' && japaneseEvaluation ? (
          <div className={cn('p-6 mb-6', cardBase)}>
            <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>日本語PREP評価</h2>
            <div className="space-y-4">
              <div>
                <div className={cn('text-sm font-medium mb-1', cardDesc)}>PREPとして成り立っているか</div>
                <div className={cn('text-lg font-semibold', japaneseEvaluation.is_valid_prep ? 'text-success' : 'text-danger')}>
                  {japaneseEvaluation.is_valid_prep ? '✓ 成り立っています' : '✗ 改善が必要です'}
                </div>
              </div>
              <div>
                <div className={cn('text-sm font-medium mb-1', cardDesc)}>スコア予測</div>
                <div className={cn('text-lg font-semibold', 'text-primary')}>{japaneseEvaluation.score_estimate}</div>
              </div>
              {japaneseEvaluation.missing_points.length > 0 && (
                <div>
                  <div className={cn('text-sm font-medium mb-1', cardDesc)}>足りない点</div>
                  <ul className="list-disc list-inside space-y-1">
                    {japaneseEvaluation.missing_points.map((point, idx) => (
                      <li key={idx} className="text-text">{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <div className={cn('text-sm font-medium mb-1', cardDesc)}>フィードバック</div>
                <div className={cn('whitespace-pre-wrap', 'text-text')}>{japaneseEvaluation.feedback}</div>
              </div>
            </div>
          </div>
        ) : currentStep === 'english_generation' && englishEssay ? (
          <div className={cn('p-6 mb-6', cardBase)}>
            <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>英語エッセイ</h2>
            <div className="space-y-4">
              <div>
                <div className={cn('text-sm font-medium mb-1', cardDesc)}>語数</div>
                <div className={cn('text-lg font-semibold', 'text-primary')}>{englishEssay.word_count} words</div>
              </div>
              <div>
                <div className={cn('text-sm font-medium mb-2', cardDesc)}>エッセイ</div>
                <div className={cn('rounded border border-border bg-surface-2 p-4 whitespace-pre-wrap', 'text-text')}>
                  {englishEssay.essay}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={cn('p-6 mb-6', cardBase)}>
            <h2 className={cn('mb-2 text-xl font-semibold', cardTitle)}>{question.title}</h2>
            <p className={cn('mb-4', cardDesc)}>{question.description}</p>
            <textarea
              value={getCurrentAnswer()}
              onChange={(e) => handleAnswerChange(currentStep, e.target.value)}
              rows={8}
              className={cn(textareaBase, 'px-3 py-2')}
              placeholder={question.placeholder}
            />
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className={cn('rounded-lg border border-danger bg-danger/10 p-4 mb-6', 'text-danger')}>
            {error}
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              const isTask1 = task?.question_type === 'Task 1';
              if (isTask1) {
                if (currentStep === 'example') setCurrentStep('point');
                else if (currentStep === 'japanese_evaluation') setCurrentStep('example');
                else if (currentStep === 'english_generation') setCurrentStep('japanese_evaluation');
                else if (currentStep === 'ielts_feedback') setCurrentStep('english_generation');
              } else {
                if (currentStep === 'reason') setCurrentStep('point');
                else if (currentStep === 'example') setCurrentStep('reason');
                else if (currentStep === 'point_again') setCurrentStep('example');
                else if (currentStep === 'japanese_evaluation') setCurrentStep('point_again');
                else if (currentStep === 'english_generation') setCurrentStep('japanese_evaluation');
                else if (currentStep === 'ielts_feedback') setCurrentStep('english_generation');
              }
            }}
            disabled={currentStep === 'point' || processing}
            className={cn('px-6 py-2', buttonSecondary)}
          >
            戻る
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed() || processing}
            className={cn('px-6 py-2', buttonPrimary)}
          >
            {processing
              ? '処理中...'
              : currentStep === 'point_again'
              ? '評価する'
              : currentStep === 'japanese_evaluation'
              ? '英語エッセイを作成'
              : currentStep === 'english_generation'
              ? 'IELTS評価を受ける'
              : '次へ'}
          </button>
        </div>
      </div>
    </Layout>
  );
}

