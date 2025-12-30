'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { InstantSpeakingPromptResponse } from '@/lib/domain/types';

export default function SpeakingTask1DrillPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<any>(null);
  const [userResponse, setUserResponse] = useState<string>('');
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // セッション開始
  useEffect(() => {
    const startSession = async () => {
      const res = await fetch('/api/speaking/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'drill',
          part: 'part1',
          topic: 'introduction', // デフォルトトピック
          level: 'B2',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSessionId(data.data.id);
        generatePrompt(data.data.id);
      }
    };
    startSession();
  }, []);

  // プロンプト生成（LLMで動的生成）
  const generatePrompt = async (sid: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/speaking/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sid,
          mode: 'drill',
          part: 'part1',
          topic: 'introduction', // トピックはランダムに変更可能
          level: 'B2',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setCurrentPrompt(data.data);
        setTimeRemaining(data.data.time_limit);
        setLoading(false);
      } else {
        console.error('Failed to generate prompt:', data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      setLoading(false);
    }
  };

  // 回答送信と評価
  const submitResponse = async () => {
    if (!sessionId || !currentPrompt || !userResponse.trim()) return;

    setLoading(true);

    // 回答保存
    const attemptRes = await fetch('/api/speaking/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        prompt_id: currentPrompt.id,
        user_response: userResponse,
        word_count: userResponse.split(/\s+/).length,
      }),
    });
    const attemptData = await attemptRes.json();

    if (!attemptData.ok) {
      setLoading(false);
      return;
    }

    // 評価生成
    const evalRes = await fetch('/api/speaking/evaluations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attempt_id: attemptData.data.id,
        user_response: userResponse,
        prompt: currentPrompt,
        metrics: {
          word_count: userResponse.split(/\s+/).length,
        },
      }),
    });
    const feedbackData = await evalRes.json();
    if (feedbackData.ok) {
      setFeedback(feedbackData.data);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Speaking Task 1 - 瞬間英作文</h1>

        {loading && !currentPrompt && (
          <div className="text-center py-8">読み込み中...</div>
        )}

        {!feedback && currentPrompt && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">日本語の意図:</h2>
              <p className="text-lg mb-4">{currentPrompt.jp_intent}</p>

              {timeRemaining !== null && timeRemaining > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">制限時間: {timeRemaining}秒</div>
                </div>
              )}

              <div className="mt-6">
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="英語で回答を入力してください"
                  className="w-full border rounded p-3 h-32"
                  rows={6}
                />
                <button
                  onClick={submitResponse}
                  disabled={loading || !userResponse.trim()}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
                >
                  {loading ? '送信中...' : '送信'}
                </button>
              </div>
            </div>
          </div>
        )}

        {feedback && currentPrompt && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">フィードバック</h2>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">スコア:</h3>
                <div className="grid grid-cols-5 gap-2 text-sm">
                  <div>Fluency: {feedback.fluency_band}</div>
                  <div>Lexical: {feedback.lexical_band}</div>
                  <div>Grammar: {feedback.grammar_band}</div>
                  <div>Pronunciation: {feedback.pronunciation_band}</div>
                  <div className="font-bold">Overall: {feedback.overall_band}</div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">模範解答:</h3>
                <p className="text-gray-700">{currentPrompt.model_answer}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">言い換え:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {currentPrompt.paraphrases?.map((p: string, i: number) => (
                    <li key={i} className="text-gray-700">{p}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">改善点:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {feedback.top_fixes?.map((fix: any, i: number) => (
                    <li key={i} className="text-gray-700">
                      <strong>{fix.issue}</strong>: {fix.suggestion}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setFeedback(null);
                    setUserResponse('');
                    generatePrompt(sessionId!);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  次の問題
                </button>
                <button
                  onClick={() => router.push('/home')}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  終了
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

