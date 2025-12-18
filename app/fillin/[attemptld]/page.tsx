'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { Attempt, FillInQuestion } from '@/lib/domain/types';

export default function FillInPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questions, setQuestions] = useState<FillInQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Attempt取得
    fetch(`/api/attempts/${attemptId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setAttempt(data.data);
          // TODO: 穴埋め問題生成APIを呼び出す
          // 現在は簡易版として空の配列を設定
          setQuestions([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [attemptId]);

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // TODO: 穴埋め回答を送信するAPIを呼び出す
      // 現在は簡易版として直接feedbackに遷移
      router.push(`/feedback/${attemptId}`);
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    // スキップして直接feedbackに遷移
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

  if (!attempt) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">回答が見つかりません</div>
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

