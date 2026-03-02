'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { VocabQuestion } from '@/lib/domain/types';

interface IncorrectQuestion {
  vocab_id: string;
  question_id: string;
  question: any;
  user_answer: string;
  correct_answer: string;
  session_date: string;
  created_at: string;
  vocab: {
    id: string;
    word: string;
    meaning: string;
    skill_tags: string[];
    example_sentence?: string;
  } | null;
}

export default function VocabularyReviewPage() {
  const router = useRouter();
  const [incorrectQuestions, setIncorrectQuestions] = useState<IncorrectQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch('/api/vocab/incorrect')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setIncorrectQuestions(data.data.incorrect_questions || []);
        } else {
          alert(data.error?.message || '間違えた問題の取得に失敗しました');
        }
      })
      .catch((error) => {
        console.error('Error fetching incorrect questions:', error);
        alert('エラーが発生しました');
      })
      .finally(() => setLoading(false));
  }, []);

  const currentQuestion = incorrectQuestions[currentIndex];

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < incorrectQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowResult(false);
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

  if (incorrectQuestions.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">復習 - 間違えた問題</h1>
          <div className="rounded-lg border border-border bg-surface p-8 text-center">
            <p className="text-text-muted mb-4">間違えた問題がまだありません。</p>
            <button
              onClick={() => router.push('/training/vocab?skill=speaking')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              単語練習を開始
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // 問題をVocabQuestion形式に変換
  const questionData = currentQuestion?.question;
  const vocabQuestion: VocabQuestion | null = questionData
    ? {
        id: currentQuestion.question_id,
        vocab_id: currentQuestion.vocab_id,
        question_type: questionData.question_type || 'en_to_ja',
        question: questionData.question || '',
        options: questionData.options || [],
        correct_answer: currentQuestion.correct_answer,
      }
    : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">復習 - 間違えた問題</h1>
        <div className="mb-4 text-sm text-text-muted">
          問題 {currentIndex + 1} / {incorrectQuestions.length}
        </div>

        {vocabQuestion && (
          <div className="space-y-6">
            {/* 単語情報 */}
            {currentQuestion.vocab && (
              <div className="rounded-lg border border-border bg-surface p-6">
                <div className="mb-2">
                  <span className="text-2xl font-bold">{currentQuestion.vocab.word}</span>
                  <span className="ml-2 text-text-muted">({currentQuestion.vocab.meaning})</span>
                </div>
                {currentQuestion.vocab.example_sentence && (
                  <p className="text-sm text-text-muted italic mt-2">
                    {currentQuestion.vocab.example_sentence}
                  </p>
                )}
              </div>
            )}

            {/* 問題 */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold mb-4">{vocabQuestion.question}</h2>
              <div className="space-y-3">
                {vocabQuestion.options.map((option) => {
                  const isSelected = answers[vocabQuestion.id] === option.id;
                  const isCorrect = option.id === vocabQuestion.correct_answer;
                  const showCorrect = showResult && isCorrect;
                  const showIncorrect = showResult && isSelected && !isCorrect;

                  return (
                    <button
                      key={option.id}
                      onClick={() => !showResult && handleAnswerChange(vocabQuestion.id, option.id)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected && !showResult
                          ? 'border-blue-500 bg-blue-50'
                          : showCorrect
                          ? 'border-green-500 bg-green-50'
                          : showIncorrect
                          ? 'border-red-500 bg-red-50'
                          : 'border-border hover:border-text-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.text}</span>
                        {showCorrect && <span className="text-green-600 font-bold">✓ 正解</span>}
                        {showIncorrect && <span className="text-red-600 font-bold">✗ 不正解</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 前回の回答（表示のみ） */}
            {showResult && currentQuestion.user_answer !== currentQuestion.correct_answer && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>前回の回答:</strong> {currentQuestion.user_answer}
                </p>
              </div>
            )}

            {/* 操作ボタン */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 border border-border rounded-md hover:bg-surface-2 disabled:bg-surface-2 disabled:text-text-muted"
              >
                前へ
              </button>

              {!showResult ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!answers[vocabQuestion.id]}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  答えを確認
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentIndex === incorrectQuestions.length - 1}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentIndex === incorrectQuestions.length - 1 ? '完了' : '次へ'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

