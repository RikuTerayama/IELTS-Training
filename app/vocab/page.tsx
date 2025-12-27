'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { VocabQuestion } from '@/lib/domain/types';

type Skill = 'reading' | 'listening' | 'writing' | 'speaking';
type Level = 'beginner' | 'intermediate' | 'advanced';

function VocabPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(
    (searchParams.get('skill') as Skill) || null
  );
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(
    (searchParams.get('level') as Level) || null
  );
  const [questions, setQuestions] = useState<VocabQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    total: number;
    incorrectQuestions: VocabQuestion[];
  } | null>(null);

  const handleStartTest = async () => {
    if (!selectedSkill || !selectedLevel) {
      alert('技能と難易度を選択してください');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/vocab/questions?skill=${selectedSkill}&level=${selectedLevel}`
      );
      const data = await response.json();

      if (data.ok) {
        setQuestions(data.data);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setShowResults(false);
      } else {
        alert(data.error?.message || '問題の取得に失敗しました');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;

    const unansweredCount = questions.filter(q => !answers[q.id]).length;
    if (unansweredCount > 0) {
      if (!confirm(`${unansweredCount}問が未回答です。このまま送信しますか？`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/vocab/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: selectedSkill,
          level: selectedLevel,
          questions: questions.map(q => ({
            vocab_id: q.vocab_id,
            question_id: q.id,
          })),
          answers: Object.entries(answers).map(([questionId, answerId]) => ({
            question_id: questionId,
            user_answer: answerId,
          })),
          correct_answers: questions.map(q => ({
            question_id: q.id,
            correct_answer: q.correct_answer,
          })),
        }),
      });

      const data = await response.json();

      if (data.ok) {
        const score = questions.filter(
          q => answers[q.id] === q.correct_answer
        ).length;
        const incorrectQuestions = questions.filter(
          q => answers[q.id] !== q.correct_answer
        );

        setResults({
          score,
          total: questions.length,
          incorrectQuestions,
        });
        setShowResults(true);
      } else {
        alert(data.error?.message || '回答の送信に失敗しました');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('エラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setSelectedSkill(null);
    setSelectedLevel(null);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setResults(null);
  };

  // 技能と難易度の選択画面
  if (!selectedSkill || !selectedLevel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">単語練習</h2>
              <p className="mb-6 text-gray-600">
                4技能別・難易度別のIELTS重要単語をテストできます
              </p>

              {/* 技能選択 */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-900">技能を選択</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {(['reading', 'listening', 'writing', 'speaking'] as Skill[]).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkill(skill)}
                      className={`rounded-md border p-4 text-center transition-colors ${
                        selectedSkill === skill
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {skill === 'reading' && '📖'}
                        {skill === 'listening' && '🎧'}
                        {skill === 'writing' && '✍️'}
                        {skill === 'speaking' && '🎤'}
                      </div>
                      <div className="font-medium capitalize">{skill}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 難易度選択 */}
              {selectedSkill && (
                <div className="mb-6">
                  <h3 className="mb-3 font-medium text-gray-900">難易度を選択</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(['beginner', 'intermediate', 'advanced'] as Level[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`rounded-md border p-4 text-center transition-colors ${
                          selectedLevel === level
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium capitalize">
                          {level === 'beginner' && '初級'}
                          {level === 'intermediate' && '中級'}
                          {level === 'advanced' && '上級'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">100単語</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 開始ボタン */}
              {selectedSkill && selectedLevel && (
                <div className="flex justify-end">
                  <button
                    onClick={handleStartTest}
                    disabled={loading}
                    className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? '読み込み中...' : 'テストを開始'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 結果表示画面
  if (showResults && results) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">テスト結果</h2>
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {results.score} / {results.total}
                </div>
                <div className="text-gray-600">
                  正答率: {Math.round((results.score / results.total) * 100)}%
                </div>
              </div>

              {results.incorrectQuestions.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-medium text-gray-900">間違えた単語</h3>
                  <div className="space-y-2">
                    {results.incorrectQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="rounded-md border border-red-200 bg-red-50 p-3"
                      >
                        <div className="font-medium text-gray-900">{q.question}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          正解: {q.options.find(o => o.id === q.correct_answer)?.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  新しいテストを開始
                </button>
                <button
                  onClick={() => router.push('/home')}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  ホームに戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 問題表示画面
  if (questions.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">問題を読み込み中...</div>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                単語練習 - {selectedSkill} ({selectedLevel})
              </h2>
              <div className="text-sm text-gray-600">
                問題 {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 問題表示 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                {currentQuestion.question_type === 'en_to_ja' && '英→日'}
                {currentQuestion.question_type === 'ja_to_en' && '日→英'}
                {currentQuestion.question_type === 'context' && '文脈'}
                {currentQuestion.question_type === 'collocation' && 'コロケーション'}
              </span>
            </div>
            <div className="mb-6 text-lg text-gray-700">{currentQuestion.question}</div>

            {/* 選択肢 */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-3 rounded border p-4 transition-colors ${
                    answers[currentQuestion.id] === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">{option.id})</span>
                  <span className="text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ナビゲーションボタン */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              前へ
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                次へ
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                {submitting ? '送信中...' : '回答を送信'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function VocabPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </Layout>
    }>
      <VocabPageContent />
    </Suspense>
  );
}

