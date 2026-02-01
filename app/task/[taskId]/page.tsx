'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Task1Image } from '@/components/task/Task1Image';
import { Task1Flow } from '@/components/task1/Task1Flow';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary } from '@/lib/ui/theme';
import type { Task, DraftContent, Attempt } from '@/lib/domain/types';

function TaskPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const taskId = params.taskId as string;
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [draftContent, setDraftContent] = useState<DraftContent>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [mode, setMode] = useState<'training' | 'exam'>('training');
  const [requiredItems, setRequiredItems] = useState<Array<{
    module: 'lexicon' | 'idiom' | 'vocab';
    item_id: string;
    skill: 'writing' | 'speaking';
    category: string;
    expression: string;
    ja_hint?: string;
  }>>([]);
  const [outputCheckResult, setOutputCheckResult] = useState<{
    used: Array<{ module: string; item_id: string; expression: string }>;
    missing: Array<{ module: string; item_id: string; expression: string }>;
    usage_rate: number;
  } | null>(null);

  useEffect(() => {
    if (taskId === 'new') {
      // 新規タスク生成（簡易版では固定タスクを使用）
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
      .then(async (data) => {
        if (data.ok) {
          setTask(data.data);
          setLevel(data.data.level);

          // Task 1の場合はattemptを作成または再開
          if (data.data.question_type === 'Task 1') {
            try {
              // URLクエリパラメータからmodeを取得
              const modeParam = searchParams.get('mode');
              const resolvedMode = modeParam === 'exam' ? 'exam' : 'training';
              
              const attemptRes = await fetch('/api/task1/attempts/create-or-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  task_id: taskId,
                  level: data.data.level,
                  mode: resolvedMode,
                }),
              });

              if (attemptRes.ok) {
                const attemptData = await attemptRes.json();
                if (attemptData.ok) {
                  setAttempt(attemptData.data);
                  setMode(attemptData.data.mode || resolvedMode);
                }
              }
            } catch (error) {
              console.error('Failed to create/resume attempt:', error);
            }
          }

          // Required Itemsを取得（Writingの場合）
          if (data.data.question_type === 'Task 1' || data.data.question_type === 'Task 2') {
            try {
              const itemsRes = await fetch(
                `/api/input/items?skill=writing&modules=vocab,idiom,lexicon&limit=5`
              );
              if (itemsRes.ok) {
                const itemsData = await itemsRes.json();
                if (itemsData.ok && itemsData.data) {
                  setRequiredItems(itemsData.data.items);
                }
              }
            } catch (error) {
              console.error('Failed to fetch required items:', error);
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [taskId]);

  const handleSubmit = async () => {
    if (!task) return;

    setSubmitting(true);

    try {
      let actualTaskId = task.id;

      // taskIdが'new'の場合は、まずタスクを生成する
      if (taskId === 'new' || task.id === 'new') {
        console.log('[TaskPage] Generating new task for level:', level);
        
        const generateResponse = await fetch('/api/tasks/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level }),
        });

        if (!generateResponse.ok) {
          let errorMessage = `タスクの生成に失敗しました (HTTP ${generateResponse.status})`;
          try {
            const errorData = await generateResponse.json();
            console.error('[TaskPage] Generate API error response:', errorData);
            errorMessage = errorData.error?.message || errorData.message || errorMessage;
          } catch (parseError) {
            const errorText = await generateResponse.text().catch(() => '');
            console.error('[TaskPage] Generate API error (non-JSON):', errorText);
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const generateData = await generateResponse.json();
        console.log('[TaskPage] Task generation response:', generateData);

        if (!generateData.ok) {
          const errorMessage = generateData.error?.message || generateData.error?.code || 'タスクの生成に失敗しました';
          console.error('[TaskPage] Generate API returned error:', generateData.error);
          throw new Error(errorMessage);
        }

        if (!generateData.data?.id) {
          throw new Error('生成されたタスクにIDがありません');
        }

        actualTaskId = generateData.data.id;
        console.log('[TaskPage] Generated task ID:', actualTaskId);
      }

      if (!actualTaskId || actualTaskId === 'new') {
        throw new Error('有効なタスクIDが取得できませんでした');
      }

      console.log('[TaskPage] Submitting to:', `/api/tasks/${actualTaskId}/submit`);
      
      const response = await fetch(`/api/tasks/${actualTaskId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          draft_content: {
            ...draftContent,
            final: draftContent.final || draftContent.fill_in || draftContent.skeleton || '',
          },
        }),
      });

      if (!response.ok) {
        let errorMessage = `送信に失敗しました (HTTP ${response.status})`;
        try {
          const errorData = await response.json();
          console.error('[TaskPage] Submit API error response:', JSON.stringify(errorData, null, 2));
          if (errorData.error) {
            errorMessage = errorData.error.message || errorData.error.code || errorMessage;
            if (errorData.error.details) {
              console.error('[TaskPage] Error details:', errorData.error.details);
            }
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (parseError) {
          const errorText = await response.text().catch(() => '');
          console.error('[TaskPage] Submit API error (non-JSON):', errorText);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[TaskPage] Submit response:', data);

      if (data.ok) {
        // Required Itemsの使用チェック（submit成功後）
        if (requiredItems.length > 0) {
          try {
            const finalContent = draftContent.final || draftContent.fill_in || draftContent.skeleton || '';
            const outputType = task.question_type === 'Task 1' ? 'writing_task1' : 'writing_task2';
            
            const checkRes = await fetch('/api/output/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                output_type: outputType,
                content: finalContent,
                required_items: requiredItems.map(item => ({
                  module: item.module,
                  item_id: item.item_id,
                  expression: item.expression,
                })),
                meta: {
                  task_id: actualTaskId,
                },
              }),
            });

            if (checkRes.ok) {
              const checkData = await checkRes.json();
              if (checkData.ok && checkData.data) {
                setOutputCheckResult(checkData.data);
                // 使用チェック結果がある場合は表示してから遷移
                if (checkData.data.missing.length > 0) {
                  const missingList = checkData.data.missing.map((m: { expression: string }) => m.expression).join(', ');
                  const confirmMessage = `以下の表現が使用されていません: ${missingList}\n\nフィードバック画面に進みますか？`;
                  if (!confirm(confirmMessage)) {
                    setSubmitting(false);
                    return;
                  }
                }
              }
            }
          } catch (error) {
            console.error('Failed to check required items usage:', error);
          }
        }
        
        if (data.data.next_step === 'fill_in') {
          router.push(`/fillin/${data.data.attempt_id}`);
        } else {
          router.push(`/feedback/${data.data.attempt_id}`);
        }
      } else {
        const errorMessage = data.error?.message || data.error?.code || '送信に失敗しました';
        console.error('[TaskPage] Submit API returned error:', data.error);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('[TaskPage] Submit error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
        ? error 
        : 'エラーが発生しました';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-slate-500">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-slate-500">タスクが見つかりません</div>
        </div>
      </Layout>
    );
  }

  // Task 1の場合はStep Learning Flowを表示
  if (task.question_type === 'Task 1' && attempt) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          {/* Required Items表示 - Paper Interface Style */}
          {requiredItems.length > 0 && (
            <div className={cn('mb-6 p-6 rounded-2xl', cardBase, 'bg-indigo-50/50 border-indigo-200')}>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">必須使用表現（{requiredItems.length}個）</h3>
              <div className="flex flex-wrap gap-2">
                {requiredItems.map((item, idx) => (
                  <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-sm shadow-sm">
                    <span className="font-semibold text-indigo-900">{item.expression}</span>
                    {item.ja_hint && <span className="text-xs text-slate-500">（{item.ja_hint}）</span>}
                    <span className="text-xs text-indigo-600 font-medium">[{item.module}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={cn('mb-6 p-8 rounded-2xl', cardBase)}>
            <div className="mb-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">お題</h2>
                <p className="text-base text-slate-700 leading-relaxed mb-4">{task.question}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-500">目標:</span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-semibold text-sm">Band 6.0-6.5</span>
                  </div>
                  {task.required_vocab.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-500">必須語彙:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {task.required_vocab.map((v) => (
                          <span key={v.word} className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                            {v.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode(mode === 'training' ? 'exam' : 'training')}
                  className={cn('rounded px-3 py-1 text-sm', 
                    mode === 'training'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-surface-2 text-text'
                  )}
                >
                  {mode === 'training' ? 'Training' : 'Exam'}
                </button>
              </div>
            </div>
            <Task1Image
              question={task.question}
              level={level}
              imagePath={task.image_path}
              alt="Task 1 Chart or Diagram"
              className="w-full"
            />
          </div>
          <Task1Flow
            task={task}
            attempt={attempt}
            mode={mode}
            onAttemptChange={(updatedAttempt) => setAttempt(updatedAttempt)}
          />
        </div>
      </Layout>
    );
  }

  // Task 2の場合は既存のUI
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Required Items表示 - Paper Interface Style */}
          {requiredItems.length > 0 && (
            <div className={cn('p-6 rounded-2xl', cardBase, 'bg-indigo-50/50 border-indigo-200')}>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">必須使用表現（{requiredItems.length}個）</h3>
              <div className="flex flex-wrap gap-2">
                {requiredItems.map((item, idx) => (
                  <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-sm shadow-sm">
                    <span className="font-semibold text-indigo-900">{item.expression}</span>
                    {item.ja_hint && <span className="text-xs text-slate-500">（{item.ja_hint}）</span>}
                    <span className="text-xs text-indigo-600 font-medium">[{item.module}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 使用チェック結果表示 - Paper Interface Style */}
          {outputCheckResult && outputCheckResult.missing.length > 0 && (
            <div className={cn('p-6 rounded-2xl', cardBase, 'bg-amber-50 border-amber-200')}>
              <h3 className="text-sm font-semibold text-amber-900 mb-3 uppercase tracking-wider">
                使用できなかった表現（{outputCheckResult.missing.length}個）
              </h3>
              <div className="space-y-2">
                {outputCheckResult.missing.map((item, idx) => {
                  const requiredItem = requiredItems.find(ri => ri.item_id === item.item_id);
                  return (
                    <div key={idx} className="text-sm text-amber-900">
                      <span className="font-semibold">{item.expression}</span>
                      {requiredItem?.ja_hint && <span className="ml-2 text-slate-600">（{requiredItem.ja_hint}）</span>}
                      <span className="ml-2 text-xs text-amber-700">[{item.module}]</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* お題 - Paper Interface Style */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">お題</h2>
            
            {/* Task1の場合は画像を表示 */}
            {task.question_type === 'Task 1' && (
              <div className="mb-6">
                <Task1Image
                  question={task.question}
                  level={level}
                  imagePath={task.image_path}
                  alt="Task 1 Chart or Diagram"
                  className="w-full rounded-xl"
                />
              </div>
            )}
            
            <p className="text-base text-slate-700 leading-relaxed mb-6">{task.question}</p>
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">目標:</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-semibold text-sm">Band 6.0-6.5</span>
              </div>
              {task.required_vocab.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-500">必須語彙:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {task.required_vocab.map((v) => (
                      <span key={v.word} className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                        {v.word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PREPガイド（初級/中級のみ） - Paper Interface Style */}
          {task.prep_guide && (level === 'beginner' || level === 'intermediate') && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-6">PREPガイド</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">P (Point)</div>
                  <p className="text-sm text-slate-700">{task.prep_guide.point}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">R (Reason)</div>
                  <p className="text-sm text-slate-700">{task.prep_guide.reason}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">E (Example)</div>
                  <p className="text-sm text-slate-700">{task.prep_guide.example}</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">P (Point again)</div>
                  <p className="text-sm text-slate-700">{task.prep_guide.point_again}</p>
                </div>
              </div>
            </div>
          )}

          {/* PREPヒアリングモードへの切り替えボタン（初級/中級のみ） - Paper Interface Style */}
          {(level === 'beginner' || level === 'intermediate') && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">PREPヒアリングモード</h3>
                  <p className="text-sm text-slate-600">
                    キャラクターが質問しながら、段階的にエッセイを作成できます
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/task/${taskId}/prep`)}
                  className={cn('px-6 py-3', buttonPrimary, 'whitespace-nowrap')}
                >
                  PREPモードで開始
                </button>
              </div>
            </div>
          )}

          {/* 入力エリア - Paper Interface Style */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-6">回答</h2>
            {level === 'beginner' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    日本語で回答
                  </label>
                  <textarea
                    value={draftContent.japanese || ''}
                    onChange={(e) =>
                      setDraftContent({ ...draftContent, japanese: e.target.value })
                    }
                    rows={5}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 leading-relaxed"
                    placeholder="日本語で回答を書いてください"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    英語で回答（自由記述）
                  </label>
                  <textarea
                    value={draftContent.final || ''}
                    onChange={(e) =>
                      setDraftContent({ ...draftContent, final: e.target.value })
                    }
                    rows={12}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 leading-relaxed"
                    placeholder="英語で回答を書いてください"
                  />
                </div>
              </div>
            ) : level === 'intermediate' ? (
              <textarea
                value={draftContent.final || ''}
                onChange={(e) => setDraftContent({ ...draftContent, final: e.target.value })}
                rows={18}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 leading-relaxed"
                placeholder="英語でPREP形式で回答を書いてください"
              />
            ) : (
              <textarea
                value={draftContent.final || ''}
                onChange={(e) => setDraftContent({ ...draftContent, final: e.target.value })}
                rows={18}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 leading-relaxed"
                placeholder="英語で自由に回答を書いてください"
              />
            )}
          </div>

          {/* 送信ボタン - Paper Interface Style */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || !draftContent.final}
              className={cn('px-8 py-3', buttonPrimary, 'disabled:opacity-50 disabled:cursor-not-allowed')}
            >
              {submitting ? '送信中...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function TaskPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-text-muted">読み込み中...</div>
        </div>
      </Layout>
    }>
      <TaskPageContent />
    </Suspense>
  );
}

