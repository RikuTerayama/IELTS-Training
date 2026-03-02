'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { Attempt, Feedback, RewriteTarget } from '@/lib/domain/types';

export default function RewritePage() {
  const params = useParams();
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [revisedTexts, setRevisedTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const attemptId = params.attemptId as string;

  useEffect(() => {
    if (!attemptId) {
      console.error('[RewritePage] attemptId is missing');
      setLoading(false);
      return;
    }

    console.log('[RewritePage] Fetching attempt and feedback:', attemptId);

    // Attempt取得
    fetch(`/api/attempts/${attemptId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch attempt: ${res.status}`);
        }
        return res.json();
      })
      .then(async (attemptData) => {
        if (attemptData.ok) {
          setAttempt(attemptData.data);

          // フィードバック取得
          const feedbackRes = await fetch(`/api/feedback/attempt/${attemptId}`);
          if (feedbackRes.ok) {
            const feedbackData = await feedbackRes.json();
            if (feedbackData.ok && feedbackData.data) {
              setFeedback(feedbackData.data);
              
              // 初期値として元のテキストを設定
              const initialTexts: Record<string, string> = {};
              feedbackData.data.rewrite_targets.forEach((target: RewriteTarget) => {
                initialTexts[target.target_id] = target.original_text;
              });
              setRevisedTexts(initialTexts);
            }
          }
        }
      })
      .catch((error) => {
        console.error('[RewritePage] Fetch error:', error);
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const handleRevisedTextChange = (targetId: string, text: string) => {
    setRevisedTexts({ ...revisedTexts, [targetId]: text });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      if (!attempt?.task_id) {
        alert('エラー: タスクIDが見つかりません');
        return;
      }

      // すべての書き直し対象が入力されているか確認
      if (!feedback || !feedback.rewrite_targets) {
        alert('エラー: フィードバックが見つかりません');
        return;
      }

      const missingTargets = feedback.rewrite_targets.filter(
        (target) => !revisedTexts[target.target_id] || revisedTexts[target.target_id].trim().length === 0
      );

      if (missingTargets.length > 0) {
        alert(`すべての修正対象を入力してください（未入力: ${missingTargets.length}箇所）`);
        setSubmitting(false);
        return;
      }

      // 書き直し内容を送信
      const revisedContent = feedback.rewrite_targets.map((target) => ({
        target_id: target.target_id,
        revised_text: revisedTexts[target.target_id],
      }));

      console.log('[RewritePage] Submitting rewrite:', revisedContent);

      const response = await fetch(`/api/tasks/${attempt.task_id}/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempt_id: attemptId,
          revised_content: revisedContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        console.error('[RewritePage] Submit error:', errorData);
        throw new Error(errorData.error?.message || `Failed to submit rewrite: ${response.status}`);
      }

      const data = await response.json();
      console.log('[RewritePage] Submit response:', data);

      if (data.ok) {
        // フィードバック画面に遷移
        router.push(`/feedback/${attemptId}`);
      } else {
        alert(data.error?.message || '書き直しの送信に失敗しました');
      }
    } catch (error) {
      console.error('[RewritePage] Submit error:', error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/feedback/${attemptId}`);
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

  if (!attempt || !feedback) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4 text-center">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <h2 className="mb-2 text-lg font-semibold text-red-800">データが見つかりません</h2>
              <p className="text-sm text-red-600">
                回答またはフィードバックが見つかりません。
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/home')}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const rewriteTargets = feedback.rewrite_targets || [];
  const originalText = attempt.draft_content?.final || attempt.draft_content?.fill_in || '';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">ガイド付き書き直し</h2>
            <p className="text-sm text-text-muted">
              指定された箇所のみを修正してください（最大2箇所）
            </p>
            <p className="mt-2 text-xs text-red-600">
              ⚠️ 全文書き換えは禁止されています。指定された範囲のみを編集してください。
            </p>
          </div>

          {/* 2カラム表示（デスクトップ）または上下表示（モバイル） */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 左側: 原文（読み取り専用） */}
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <h3 className="mb-3 font-semibold text-text">原文（読み取り専用）</h3>
                <div className="whitespace-pre-line rounded border border-border bg-surface p-4 text-sm text-text">
                  {originalText}
                </div>
              </div>
            </div>

            {/* 右側: 編集可能エリア */}
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-3 font-semibold text-text">編集エリア</h3>
                {rewriteTargets.length === 0 ? (
                  <p className="text-sm text-text-muted">
                    書き直し対象が指定されていません。
                  </p>
                ) : (
                  <div className="space-y-4">
                    {rewriteTargets.map((target, index) => (
                      <div
                        key={target.target_id}
                        className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                            修正対象 {index + 1}
                          </span>
                          <span className="rounded bg-surface-2 px-2 py-1 text-xs font-semibold text-text">
                            {target.dimension}
                          </span>
                          {target.priority === 'high' && (
                            <span className="rounded bg-red-200 px-2 py-1 text-xs font-semibold text-red-800">
                              優先度: 高
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-2 text-sm">
                          <p className="font-semibold text-text">問題点:</p>
                          <p className="text-text-muted">{target.issue_description}</p>
                        </div>

                        <div className="mb-2 text-sm">
                          <p className="font-semibold text-text">修正方針:</p>
                          <p className="text-text-muted">{target.rewrite_guidance}</p>
                        </div>

                        <div className="mb-2 text-sm">
                          <p className="font-semibold text-text">元のテキスト:</p>
                          <p className="rounded bg-surface-2 p-2 text-text">{target.original_text}</p>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-semibold text-text">
                            修正後のテキスト:
                          </label>
                          <textarea
                            value={revisedTexts[target.target_id] || target.original_text}
                            onChange={(e) => handleRevisedTextChange(target.target_id, e.target.value)}
                            className="w-full rounded border border-border p-2 text-sm text-text focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows={4}
                            placeholder="修正後のテキストを入力してください"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4">
            {rewriteTargets.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '再評価中...' : '再評価を実行'}
              </button>
            )}
            <button
              onClick={handleCancel}
              className="rounded-md border border-border bg-surface px-6 py-2 text-text hover:bg-surface-2"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

