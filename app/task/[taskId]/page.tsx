'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Task1Image } from '@/components/task/Task1Image';
import type { Task, DraftContent } from '@/lib/domain/types';

export default function TaskPage() {
  const params = useParams();
  const taskId = params.taskId as string;
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [draftContent, setDraftContent] = useState<DraftContent>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      .then((data) => {
        if (data.ok) {
          setTask(data.data);
          setLevel(data.data.level);
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
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-text-muted">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-text-muted">タスクが見つかりません</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* お題 */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-theme">
            <h2 className="mb-4 text-lg font-semibold text-text">お題</h2>
            
            {/* Task1の場合は画像を表示 */}
            {task.question_type === 'Task 1' && (
              <div className="mb-4">
                <Task1Image
                  question={task.question}
                  level={level}
                  alt="Task 1 Chart or Diagram"
                  className="w-full"
                />
              </div>
            )}
            
            <p className="text-text-muted">{task.question}</p>
            <div className="mt-4 space-y-2">
              <p className="text-text">
                目標: Band <span className="font-medium">6.0-6.5</span>
              </p>
              <p className="text-text">
                必須語彙:{' '}
                {task.required_vocab.map((v) => (
                  <span key={v.word} className="mr-2 rounded bg-primary/10 border border-primary/20 px-2 py-1 text-sm text-primary">
                    {v.word}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* PREPガイド（初級/中級のみ） */}
          {task.prep_guide && (level === 'beginner' || level === 'intermediate') && (
            <div className="rounded-lg border border-border bg-surface p-6 shadow-theme">
              <h2 className="mb-4 text-lg font-semibold text-text">PREPガイド</h2>
              <div className="space-y-2 text-sm text-text">
                <p>
                  <strong>P (Point):</strong> {task.prep_guide.point}
                </p>
                <p>
                  <strong>R (Reason):</strong> {task.prep_guide.reason}
                </p>
                <p>
                  <strong>E (Example):</strong> {task.prep_guide.example}
                </p>
                <p>
                  <strong>P (Point again):</strong> {task.prep_guide.point_again}
                </p>
              </div>
            </div>
          )}

          {/* PREPヒアリングモードへの切り替えボタン（初級/中級のみ） */}
          {(level === 'beginner' || level === 'intermediate') && (
            <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text mb-1">PREPヒアリングモード</h3>
                  <p className="text-sm text-text-muted">
                    キャラクターが質問しながら、段階的にエッセイを作成できます
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/task/${taskId}/prep`)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  PREPモードで開始
                </button>
              </div>
            </div>
          )}

          {/* 入力エリア */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-theme">
            <h2 className="mb-4 text-lg font-semibold text-text">回答</h2>
            {level === 'beginner' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text">
                    日本語で回答
                  </label>
                  <textarea
                    value={draftContent.japanese || ''}
                    onChange={(e) =>
                      setDraftContent({ ...draftContent, japanese: e.target.value })
                    }
                    rows={5}
                    className="mt-1 block w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-text placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-theme transition-all duration-200"
                    placeholder="日本語で回答を書いてください"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">
                    英語で回答（自由記述）
                  </label>
                  <textarea
                    value={draftContent.final || ''}
                    onChange={(e) =>
                      setDraftContent({ ...draftContent, final: e.target.value })
                    }
                    rows={10}
                    className="mt-1 block w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-text placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-theme transition-all duration-200"
                    placeholder="英語で回答を書いてください"
                  />
                </div>
              </div>
            ) : level === 'intermediate' ? (
              <textarea
                value={draftContent.final || ''}
                onChange={(e) => setDraftContent({ ...draftContent, final: e.target.value })}
                rows={15}
                className="block w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-text placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-theme transition-all duration-200"
                placeholder="英語でPREP形式で回答を書いてください"
              />
            ) : (
              <textarea
                value={draftContent.final || ''}
                onChange={(e) => setDraftContent({ ...draftContent, final: e.target.value })}
                rows={15}
                className="block w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-text placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-theme transition-all duration-200"
                placeholder="英語で自由に回答を書いてください"
              />
            )}
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || !draftContent.final}
              className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary-hover disabled:bg-text-muted/50 disabled:cursor-not-allowed disabled:text-text-subtle transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              {submitting ? '送信中...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

