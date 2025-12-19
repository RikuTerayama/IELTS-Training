'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { Attempt, FillInQuestion } from '@/lib/domain/types';

export default function FillInPage() {
  const params = useParams();
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questions, setQuestions] = useState<FillInQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // attemptIdを取得（複数の方法を試す）
  const getAttemptId = (): string | null => {
    // 方法1: useParams()から取得
    if (params?.attemptId && typeof params.attemptId === 'string') {
      console.log('[FillInPage] attemptId from useParams:', params.attemptId);
      return params.attemptId;
    }

    // 方法2: URLから直接取得（フォールバック）
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const fillinIndex = pathParts.indexOf('fillin');
      if (fillinIndex >= 0 && pathParts[fillinIndex + 1]) {
        const idFromUrl = pathParts[fillinIndex + 1];
        console.log('[FillInPage] attemptId from URL:', idFromUrl);
        return idFromUrl;
      }
    }

    console.error('[FillInPage] Could not extract attemptId from params or URL');
    console.error('[FillInPage] params:', params);
    console.error('[FillInPage] window.location.pathname:', typeof window !== 'undefined' ? window.location.pathname : 'N/A');
    return null;
  };

  useEffect(() => {
    const attemptId = getAttemptId();
    
    // attemptIdが存在する場合のみfetchを実行
    if (!attemptId || attemptId === 'undefined') {
      console.error('[FillInPage] attemptId is missing:', attemptId);
      setLoading(false);
      return;
    }

    console.log('[FillInPage] Fetching attempt:', attemptId);
    
    // Attempt取得
    fetch(`/api/attempts/${attemptId}`)
      .then((res) => {
        if (!res.ok) {
          console.error('[FillInPage] API error:', res.status, res.statusText);
          return res.json().then(data => {
            throw new Error(data.error?.message || `Failed to fetch attempt: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('[FillInPage] Attempt data received:', data);
        if (data.ok) {
          setAttempt(data.data);
          // TODO: 穴埋め問題生成APIを呼び出す
          // 現在は簡易版として空の配列を設定
          setQuestions([]);
        } else {
          console.error('[FillInPage] API returned error:', data.error);
        }
      })
      .catch((error) => {
        console.error('[FillInPage] Fetch error:', error);
      })
      .finally(() => setLoading(false));
  }, [params]);

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const attemptId = getAttemptId();
      if (!attemptId && attempt?.id) {
        // TODO: 穴埋め回答を送信するAPIを呼び出す
        // 現在は簡易版として直接feedbackに遷移
        router.push(`/feedback/${attempt.id}`);
      } else if (attemptId) {
        router.push(`/feedback/${attemptId}`);
      } else {
        console.error('[FillInPage] Cannot submit: attemptId not found');
        alert('エラー: 回答IDが見つかりません');
      }
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    // スキップして直接feedbackに遷移
    const attemptId = getAttemptId();
    if (attemptId) {
      router.push(`/feedback/${attemptId}`);
    } else if (attempt?.id) {
      router.push(`/feedback/${attempt.id}`);
    } else {
      console.error('[FillInPage] Cannot skip: attemptId not found');
      alert('エラー: 回答IDが見つかりません');
    }
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

  if (!attempt) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4 text-center">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <h2 className="mb-2 text-lg font-semibold text-red-800">回答が見つかりません</h2>
              <p className="text-sm text-red-600">
                Attempt ID: {getAttemptId() || 'undefined'}
              </p>
              <p className="mt-2 text-sm text-red-600">
                データベースに回答が保存されていない可能性があります。
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/home')}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                ホームに戻る
              </button>
              <button
                onClick={() => router.push('/task/new?level=beginner')}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                新しいタスクを開始
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">穴埋め問題</h2>
            <p className="text-sm text-gray-600">
              あなたの回答を基に、弱点を補強するための問題です（最大3問）
            </p>
          </div>

          {/* 問題表示（MVP簡易版） */}
          {questions.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-center text-gray-600">
                穴埋め問題は現在準備中です。
                <br />
                スキップしてフィードバックに進むことができます。
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                      {question.question_type}
                    </span>
                    {question.question_type === 'CC' && (
                      <span className="text-xs text-gray-600">（接続詞/指示語）</span>
                    )}
                    {question.question_type === 'LR' && (
                      <span className="text-xs text-gray-600">（言い換え）</span>
                    )}
                    {question.question_type === 'GRA' && (
                      <span className="text-xs text-gray-600">（文結合）</span>
                    )}
                  </div>
                  <p className="mb-4 text-gray-700">{question.question_text}</p>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={answers[question.id] === option.id}
                          onChange={() => handleAnswerChange(question.id, option.id)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="font-medium">{option.id})</span>
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-4">
            {questions.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < questions.length}
                className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submitting ? '送信中...' : '回答を確認'}
              </button>
            )}
            <button
              onClick={handleSkip}
              className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              {questions.length > 0 ? 'スキップ' : 'フィードバックへ進む'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

