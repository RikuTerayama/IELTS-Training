'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { Task } from '@/lib/domain/types';

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
      setLoading(false);
      return;
    }

    fetch(`/api/tasks/${taskId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setTask(data.data);
          setLevel(data.data.level);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [taskId]);

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
            japanese_evaluation,
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
    switch (currentStep) {
      case 'point':
        return {
          title: 'P (Point) は何？',
          description: '学校の始める時間について、自分の意見を述べることが大切です。あなたの意見（Point）を日本語で書いてください。',
          placeholder: '例：私は学校の始業時間を遅くすべきだと思います。',
        };
      case 'reason':
        return {
          title: 'R (Reason) は何？',
          description: '2-3の理由を挙げて、自分の意見が裏付けられるようにします。あなたの理由を日本語で書いてください。',
          placeholder: '例：\n1. 睡眠不足の解消\n2. 学習効率の向上\n3. 健康への配慮',
        };
      case 'example':
        return {
          title: 'E (Example) は何？',
          description: 'ある具体的な例を挙げて、自分の意見を具体的に説明します。具体的な例を日本語で書いてください。',
          placeholder: '例：例えば、アメリカの一部の学校では、始業時間を遅らせた結果、生徒の成績が向上したという研究結果があります。',
        };
      case 'point_again':
        return {
          title: 'P (Point again) は？',
          description: '結論で自分の意見を再び述べます。結論を日本語で書いてください。',
          placeholder: '例：したがって、学校の始業時間を遅くすることは、生徒の健康と学習効果の両面で有益であると考えます。',
        };
      default:
        return { title: '', description: '', placeholder: '' };
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
    if (currentStep === 'point') return answers.point.trim().length > 0;
    if (currentStep === 'reason') return answers.reason.trim().length > 0;
    if (currentStep === 'example') return answers.example.trim().length > 0;
    if (currentStep === 'point_again') return answers.point_again.trim().length > 0;
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
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {currentStep === 'point' && 'ステップ 1/7'}
              {currentStep === 'reason' && 'ステップ 2/7'}
              {currentStep === 'example' && 'ステップ 3/7'}
              {currentStep === 'point_again' && 'ステップ 4/7'}
              {currentStep === 'japanese_evaluation' && 'ステップ 5/7'}
              {currentStep === 'english_generation' && 'ステップ 6/7'}
              {currentStep === 'ielts_feedback' && 'ステップ 7/7'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  currentStep === 'point'
                    ? '14%'
                    : currentStep === 'reason'
                    ? '28%'
                    : currentStep === 'example'
                    ? '42%'
                    : currentStep === 'point_again'
                    ? '57%'
                    : currentStep === 'japanese_evaluation'
                    ? '71%'
                    : currentStep === 'english_generation'
                    ? '85%'
                    : '100%'
                }`,
              }}
            ></div>
          </div>
        </div>

        {/* お題表示 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="mb-2 text-lg font-semibold">お題</h2>
          <p className="text-gray-700">{task.question}</p>
          <div className="mt-4 space-y-2">
            <p>
              目標: Band <span className="font-medium">6.0-6.5</span>
            </p>
            <p>
              必須語彙:{' '}
              {task.required_vocab.map((v) => (
                <span key={v.word} className="mr-2 rounded bg-blue-100 px-2 py-1 text-sm">
                  {v.word}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* ステップ別コンテンツ */}
        {currentStep === 'japanese_evaluation' && japaneseEvaluation ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <h2 className="mb-4 text-lg font-semibold">日本語PREP評価</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">PREPとして成り立っているか</div>
                <div className={`text-lg font-semibold ${japaneseEvaluation.is_valid_prep ? 'text-green-600' : 'text-red-600'}`}>
                  {japaneseEvaluation.is_valid_prep ? '✓ 成り立っています' : '✗ 改善が必要です'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">スコア予測</div>
                <div className="text-lg font-semibold text-blue-600">{japaneseEvaluation.score_estimate}</div>
              </div>
              {japaneseEvaluation.missing_points.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">足りない点</div>
                  <ul className="list-disc list-inside space-y-1">
                    {japaneseEvaluation.missing_points.map((point, idx) => (
                      <li key={idx} className="text-gray-700">{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">フィードバック</div>
                <div className="text-gray-700 whitespace-pre-wrap">{japaneseEvaluation.feedback}</div>
              </div>
            </div>
          </div>
        ) : currentStep === 'english_generation' && englishEssay ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <h2 className="mb-4 text-lg font-semibold">英語エッセイ</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">語数</div>
                <div className="text-lg font-semibold text-blue-600">{englishEssay.word_count} words</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">エッセイ</div>
                <div className="rounded border border-gray-300 bg-gray-50 p-4 whitespace-pre-wrap text-gray-700">
                  {englishEssay.essay}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <h2 className="mb-2 text-xl font-semibold">{question.title}</h2>
            <p className="mb-4 text-gray-600">{question.description}</p>
            <textarea
              value={getCurrentAnswer()}
              onChange={(e) => handleAnswerChange(currentStep, e.target.value)}
              rows={8}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder={question.placeholder}
            />
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6 text-red-800">
            {error}
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              if (currentStep === 'reason') setCurrentStep('point');
              else if (currentStep === 'example') setCurrentStep('reason');
              else if (currentStep === 'point_again') setCurrentStep('example');
              else if (currentStep === 'japanese_evaluation') setCurrentStep('point_again');
              else if (currentStep === 'english_generation') setCurrentStep('japanese_evaluation');
            }}
            disabled={currentStep === 'point' || processing}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
          >
            戻る
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed() || processing}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
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

