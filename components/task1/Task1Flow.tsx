/**
 * Task 1 Step Learning Flow コンポーネント
 * Step1-6の学習フローを管理
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Task1ObservationOverlay } from './Task1ObservationOverlay';
import { KeyNumbersPanel } from './KeyNumbersPanel';
import { StepReviewPanel } from './StepReviewPanel';
import { FinalReviewPanel } from './FinalReviewPanel';
import { ChecklistPanel } from './ChecklistPanel';
import { ComparisonPhrasesPanel } from './ComparisonPhrasesPanel';
import { NumberGuard } from './NumberGuard';
import { Task1Image } from '@/components/task/Task1Image';
import { getTask1ImagePath } from '@/lib/utils/task1Image';
import type { Task, Attempt, Task1StepState, Task1ReviewState } from '@/lib/domain/types';
import { countWords, countParagraphs, evaluateChecklist, extractNumbers } from '@/lib/utils/task1Helpers';

interface Task1FlowProps {
  task: Task;
  attempt: Attempt | null;
  mode: 'training' | 'exam';
  onAttemptChange: (attempt: Attempt) => void;
}

const STEPS = [
  { index: 1, title: 'グラフは何を示しているか', description: 'グラフの主題、期間、単位を説明してください' },
  { index: 2, title: '大まかな特徴（Overview）', description: '主要な傾向や特徴を数字を使わずに説明してください' },
  { index: 3, title: '特徴1', description: '最初の主要な特徴を数字を使って詳しく説明してください' },
  { index: 4, title: '特徴2', description: '2番目の主要な特徴を数字を使って詳しく説明してください' },
  { index: 5, title: '特徴3', description: '3番目の主要な特徴を数字を使って詳しく説明してください' },
  { index: 6, title: '統合回答', description: 'Step1-5を統合して、Task 1の完全な回答を作成してください' },
];

export function Task1Flow({ task, attempt, mode, onAttemptChange }: Task1FlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepContent, setStepContent] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [reviewState, setReviewState] = useState<Task1ReviewState | null>(null);
  const [showStepReview, setShowStepReview] = useState(false);
  const [showFinalReview, setShowFinalReview] = useState(false);

  const stepState = attempt?.step_state as Task1StepState | undefined;
  const observations = stepState?.observations || [];
  const keyNumbers = stepState?.key_numbers || [];
  
  // 画像パスを取得
  const imagePath = task.question_type === 'Task 1' 
    ? getTask1ImagePath(task.question, task.level)
    : null;

  // 初期化: attemptからstepContentを復元
  useEffect(() => {
    if (stepState) {
      const content: Record<number, string> = {};
      if (stepState.step1) content[1] = stepState.step1;
      if (stepState.step2) content[2] = stepState.step2;
      if (stepState.step3) content[3] = stepState.step3;
      if (stepState.step4) content[4] = stepState.step4;
      if (stepState.step5) content[5] = stepState.step5;
      if (stepState.step6) content[6] = stepState.step6;
      setStepContent(content);

      // レビュー状態を復元
      if (attempt.review_state) {
        setReviewState(attempt.review_state as Task1ReviewState);
        if ((attempt.review_state as Task1ReviewState).step_review?.status === 'completed') {
          setShowStepReview(true);
        }
        if ((attempt.review_state as Task1ReviewState).final_review?.status === 'completed') {
          setShowFinalReview(true);
        }
      }
    }
  }, [attempt, stepState]);

  // Step保存（デバウンス付き）
  const saveStepDebounced = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout | null = null;
      return async (stepIndex: number, content: string) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(async () => {
          if (!attempt) return;
          setSaving(true);
          try {
            const response = await fetch(`/api/task1/attempts/save-step`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                attempt_id: attempt.id,
                step_index: stepIndex,
                content,
                observations,
                key_numbers: keyNumbers,
                checklist: evaluateChecklist(content),
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to save step');
            }

            const data = await response.json();
            if (data.ok && data.data.attempt) {
              onAttemptChange(data.data.attempt);
            }
          } catch (error) {
            console.error('Failed to save step:', error);
          } finally {
            setSaving(false);
          }
        }, 1000); // 1秒デバウンス
      };
    })(),
    [attempt, observations, keyNumbers, onAttemptChange]
  );

  // Step5完了時にレビューを実行
  const handleStep5Complete = async () => {
    if (!attempt) return;

    try {
      const response = await fetch('/api/task1/review/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attempt_id: attempt.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to review steps');
      }

      const data = await response.json();
      if (data.ok) {
        setReviewState(data.data.review);
        setShowStepReview(true);
        onAttemptChange(data.data.attempt);
      }
    } catch (error) {
      console.error('Failed to review steps:', error);
    }
  };

  // Step6完了時に最終レビューを実行
  const handleStep6Complete = async () => {
    if (!attempt) return;

    try {
      const response = await fetch('/api/task1/review/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attempt_id: attempt.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to review final');
      }

      const data = await response.json();
      if (data.ok) {
        setReviewState(data.data.review);
        setShowFinalReview(true);
        onAttemptChange(data.data.attempt);
      }
    } catch (error) {
      console.error('Failed to review final:', error);
    }
  };

  const currentContent = stepContent[currentStep] || '';
  const wordCount = currentStep === 6 ? countWords(currentContent) : undefined;
  const paragraphCount = currentStep === 6 ? countParagraphs(currentContent) : undefined;
  const checklist = evaluateChecklist(currentContent);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* メインコンテンツエリア */}
        <div className="md:col-span-2 space-y-6">
          {/* 画像とObservation Overlay（Trainingモードのみ） */}
          {imagePath && mode === 'training' && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <Task1ObservationOverlay
                imageUrl={imagePath}
                observations={observations}
                onObservationsChange={async (updated) => {
                  // 観察メモを保存
                  if (attempt) {
                    try {
                      await fetch(`/api/task1/attempts/save-step`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          attempt_id: attempt.id,
                          step_index: currentStep,
                          content: stepContent[currentStep] || '',
                          observations: updated,
                          key_numbers: keyNumbers,
                          checklist: evaluateChecklist(stepContent[currentStep] || ''),
                        }),
                      });
                    } catch (error) {
                      console.error('Failed to save observations:', error);
                    }
                  }
                }}
                mode={mode}
              />
            </div>
          )}

          {/* Stepper */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.index} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.index)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      currentStep === step.index
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : stepContent[step.index]
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-500'
                    }`}
                  >
                    {step.index}
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-1 w-12 ${
                        stepContent[step.index] ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step入力エリア */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">
              Step {currentStep}: {STEPS[currentStep - 1].title}
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              {STEPS[currentStep - 1].description}
            </p>

            <textarea
              value={currentContent}
              onChange={(e) => {
                const newContent = { ...stepContent, [currentStep]: e.target.value };
                setStepContent(newContent);
                // デバウンス付きで保存
                saveStepDebounced(currentStep, e.target.value);
              }}
              rows={currentStep === 6 ? 15 : 8}
              className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder={`Step ${currentStep}の回答を入力してください...`}
              disabled={mode === 'exam' && currentStep <= 5 && !stepContent[currentStep]}
            />

            {/* Step5完了ボタン */}
            {currentStep === 5 && stepContent[5] && (
              <button
                onClick={handleStep5Complete}
                className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                レビューを実行
              </button>
            )}

            {/* Step6完了ボタン */}
            {currentStep === 6 && stepContent[6] && (
              <button
                onClick={handleStep6Complete}
                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                最終レビューを実行
              </button>
            )}

            {/* 保存状態 */}
            {saving && (
              <p className="mt-2 text-sm text-gray-500">保存中...</p>
            )}

            {/* 数字ガード（Step6のみ） */}
            {currentStep === 6 && keyNumbers.length > 0 && (
              <NumberGuard
                text={currentContent}
                keyNumbers={keyNumbers}
                onOverride={() => {
                  // 警告を無視する処理（必要に応じて実装）
                }}
              />
            )}
          </div>

          {/* Step Review Panel */}
          {showStepReview && reviewState?.step_review?.feedback_payload && (
            <StepReviewPanel
              feedback={reviewState.step_review.feedback_payload}
              onApply={(fixedSteps) => {
                // 修正を適用
                const updatedContent = { ...stepContent };
                Object.entries(fixedSteps).forEach(([step, content]) => {
                  updatedContent[parseInt(step)] = content as string;
                });
                setStepContent(updatedContent);
                // データベースに保存
                // TODO: API呼び出し
              }}
            />
          )}

          {/* Final Review Panel */}
          {showFinalReview && reviewState?.final_review?.feedback_payload && (
            <FinalReviewPanel
              feedback={reviewState.final_review.feedback_payload}
              finalResponse={stepContent[6] || ''}
            />
          )}
        </div>

        {/* 右サイドバー */}
        <div className="space-y-4">
          {/* チェックリスト */}
          <ChecklistPanel checklist={checklist} wordCount={wordCount} paragraphCount={paragraphCount} />

          {/* 比較フレーズ集 */}
          {mode === 'training' && <ComparisonPhrasesPanel />}

          {/* 数字パネル */}
          <KeyNumbersPanel
            keyNumbers={keyNumbers}
            onNumbersChange={async (numbers) => {
              // 数字を保存
              if (attempt) {
                try {
                  await fetch(`/api/task1/attempts/save-step`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      attempt_id: attempt.id,
                      step_index: currentStep,
                      content: stepContent[currentStep] || '',
                      observations,
                      key_numbers: numbers,
                      checklist: evaluateChecklist(stepContent[currentStep] || ''),
                    }),
                  });
                } catch (error) {
                  console.error('Failed to save numbers:', error);
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

