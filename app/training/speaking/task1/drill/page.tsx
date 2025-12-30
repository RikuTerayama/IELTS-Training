'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { getPhrasesByTopicAndLevel, getRandomPhrases, type SpeakingPhrase } from '@/lib/data/speaking_phrases';

const TOTAL_QUESTIONS = 10;

export default function SpeakingTask1DrillPage() {
  const router = useRouter();
  const [phrases, setPhrases] = useState<SpeakingPhrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponse, setUserResponse] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  // 音声認識の初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Web Speech APIの確認
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = 'en-US';
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserResponse(transcript);
          setIsRecording(false);
          checkAnswer(transcript);
          // 音声認識後に自動的に次の問題に進む（3秒後に）
          setTimeout(() => {
            handleNextAuto();
          }, 3000);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          alert('音声認識でエラーが発生しました。もう一度お試しください。');
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
        recognitionRef.current = recognitionInstance;
      } else {
        // Web Speech APIが利用できない場合、テキスト入力モードに切り替え
        console.warn('Web Speech API is not available. Falling back to text input.');
        setInputMode('text');
      }
    }
  }, []);

  // フレーズの読み込み
  useEffect(() => {
    // Task 1用のフレーズを取得（work_study, introduction, hometown などから）
    const task1Phrases = getRandomPhrases(TOTAL_QUESTIONS);
    setPhrases(task1Phrases);
  }, []);

  // 音声認識開始
  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true);
      setUserResponse('');
      setIsCorrect(null);
      setShowAnswer(false);
      recognitionRef.current.start();
    }
  };

  // 音声認識停止
  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // 次の問題へ（自動 - 音声認識後）
  const handleNextAuto = () => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserResponse('');
      setIsCorrect(null);
      setShowAnswer(false);
    } else {
      // 全問終了
      router.push('/home');
    }
  };

  // 正答判定（音声認識の場合のみ）
  const checkAnswer = (response: string) => {
    if (inputMode !== 'voice') return; // テキスト入力の場合は評価しない

    const currentPhrase = phrases[currentIndex];
    if (!currentPhrase) return;

    // シンプルな正答判定（大文字小文字、句読点を無視）
    const normalizedResponse = response.toLowerCase().trim().replace(/[.,!?]/g, '');
    const normalizedAnswer = currentPhrase.english.toLowerCase().trim().replace(/[.,!?]/g, '');

    // 完全一致または主要部分が一致するかをチェック
    const isExactMatch = normalizedResponse === normalizedAnswer;
    const includesMainParts = currentPhrase.english_variations?.some(variation => {
      const normalizedVariation = variation.toLowerCase().trim().replace(/[.,!?]/g, '');
      return normalizedResponse.includes(normalizedVariation.split(' ')[0]) || 
             normalizedVariation.includes(normalizedResponse.split(' ')[0]);
    });

    setIsCorrect(isExactMatch || includesMainParts || false);
    setShowAnswer(true);
  };

  // テキスト入力時の処理（評価しない）
  const handleTextSubmit = () => {
    if (inputMode === 'text' && userResponse.trim()) {
      setShowAnswer(true);
      // テキスト入力の場合は正答判定をしない
      setIsCorrect(null);
    }
  };

  // 次の問題へ（手動）
  const handleNext = () => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserResponse('');
      setIsCorrect(null);
      setShowAnswer(false);
    } else {
      // 全問終了
      router.push('/home');
    }
  };

  const currentPhrase = phrases[currentIndex];
  const progress = phrases.length > 0 ? ((currentIndex + 1) / phrases.length) * 100 : 0;

  if (phrases.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">瞬間英作文 - Task 1</h1>

        {/* 進捗バー */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>問題 {currentIndex + 1} / {phrases.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 入力モード切り替え */}
        <div className="mb-4 flex gap-4 justify-center">
          <button
            onClick={() => {
              setInputMode('voice');
              setUserResponse('');
              setIsCorrect(null);
              setShowAnswer(false);
            }}
            className={`px-4 py-2 rounded ${
              inputMode === 'voice'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            音声入力
          </button>
          <button
            onClick={() => {
              setInputMode('text');
              setUserResponse('');
              setIsCorrect(null);
              setShowAnswer(false);
            }}
            className={`px-4 py-2 rounded ${
              inputMode === 'text'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            テキスト入力
          </button>
        </div>

        {currentPhrase && (
          <div className="space-y-6">
            {/* 日本語フレーズ表示 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-600">日本語:</h2>
              <p className="text-xl text-gray-800">{currentPhrase.japanese}</p>
            </div>

            {/* 回答エリア */}
            {!showAnswer && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">あなたの回答:</h2>

                {inputMode === 'voice' ? (
                  <div className="space-y-4">
                    {userResponse && (
                      <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-lg">{userResponse}</p>
                      </div>
                    )}
                    <div className="flex justify-center">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="px-8 py-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 flex items-center gap-2"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                              clipRule="evenodd"
                            />
                          </svg>
                          音声入力開始
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="px-8 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center gap-2 animate-pulse"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm4 0a1 1 0 112 0v4a1 1 0 11-2 0V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          録音中... (タップして停止)
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      音声入力の場合のみ、正答判定が行われます
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="英語で入力してください（テキスト入力の場合は評価されません）"
                      className="w-full p-4 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      rows={4}
                    />
                    <button
                      onClick={handleTextSubmit}
                      disabled={!userResponse.trim()}
                      className="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                    >
                      解答を確認
                    </button>
                    <p className="text-sm text-gray-500 text-center">
                      テキスト入力の場合は評価されません。模範解答を確認できます。
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 結果表示 */}
            {showAnswer && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">結果:</h2>

                {/* 音声入力の場合のみ正答判定を表示 */}
                {inputMode === 'voice' && isCorrect !== null && (
                  <div className={`mb-4 p-4 rounded ${
                    isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`text-lg font-semibold ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect ? '✓ 正解です！' : '✗ もう一度練習しましょう'}
                    </p>
                  </div>
                )}

                {/* あなたの回答 */}
                {userResponse && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">あなたの回答:</h3>
                    <p className="text-gray-700">{userResponse}</p>
                  </div>
                )}

                {/* 模範解答 */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">模範解答:</h3>
                  <p className="text-gray-700 text-lg">{currentPhrase.english}</p>
                </div>

                {/* 別の言い回し */}
                {currentPhrase.english_variations && currentPhrase.english_variations.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">別の言い回し:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {currentPhrase.english_variations.map((variation, i) => (
                        <li key={i} className="text-gray-700">{variation}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 次の問題ボタン */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    {currentIndex < phrases.length - 1 ? '次の問題' : '完了'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
