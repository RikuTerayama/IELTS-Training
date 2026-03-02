'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { normalizeSpeakingCategory } from '@/lib/data/speaking_categories';
import { RECOMMENDED_EXPRESSIONS_FALLBACK } from '@/lib/data/speaking_recommended_fallback';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

/** SPK-FR-4: 音声・テキスト入力なし。Task3 Discussion（深掘り質問）＋タイマー＋推奨表現 */
interface RecommendedItem {
  expression: string;
  ja_hint?: string;
}

function getDiscussionQuestions(category: string): string[] {
  const questions: Record<string, string[]> = {
    work_study: [
      'Why do you think people choose to change careers?',
      'How might technology affect the way people work in the future?',
      'Do you think qualifications are more important than experience?',
    ],
    technology: [
      'What are the main advantages and disadvantages of technology in education?',
      'How might artificial intelligence change society in the next 20 years?',
      'Do you think people rely too much on technology today?',
    ],
    environment: [
      'What do you think is the most serious environmental problem?',
      'Should governments do more to protect the environment?',
      'How can individuals contribute to solving environmental issues?',
    ],
    education: [
      'How important is formal education compared to learning from experience?',
      'Do you think online learning will replace traditional schools?',
      'What skills should schools teach that they might not teach now?',
    ],
    society: [
      'How has society changed in the past 50 years?',
      'Do you think the gap between rich and poor will increase?',
      'What role should the government play in people\'s daily lives?',
    ],
    culture: [
      'How does globalization affect local cultures?',
      'Is it important to preserve traditional customs?',
      'Why do you think some cultures become more popular than others?',
    ],
  };
  return questions[category] || [
    'What do you think about this topic in general?',
    'How might this change in the future?',
    'What are the pros and cons?',
  ];
}

function Task3DrillContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = normalizeSpeakingCategory(searchParams.get('category'));

  const [recommended, setRecommended] = useState<RecommendedItem[]>([]);
  const [showExpressions, setShowExpressions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const questions = getDiscussionQuestions(category);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    fetch('/api/input/items?skill=speaking&modules=vocab,idiom&limit=8')
      .then((r) => r.json())
      .then((data: { ok?: boolean; data?: { items?: { expression: string; ja_hint?: string }[] } }) => {
        if (data.ok && data.data?.items?.length) {
          setRecommended(data.data.items.map((i) => ({ expression: i.expression, ja_hint: i.ja_hint })));
        } else {
          setRecommended(RECOMMENDED_EXPRESSIONS_FALLBACK);
        }
      })
      .catch(() => setRecommended(RECOMMENDED_EXPRESSIONS_FALLBACK));
  }, []);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      router.push('/training/speaking');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-text">Speaking Task 3（Discussion）</h1>
          <Link href="/training/speaking" className={cn('text-sm', buttonSecondary)}>
            お題を変える
          </Link>
        </div>

        {/* タイマー */}
        <div className={cn('mb-6 p-4 rounded-xl', cardBase)}>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-2xl font-mono font-bold text-text">
              {String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:{String(elapsedSec % 60).padStart(2, '0')}
            </span>
            <button onClick={() => setTimerRunning((r) => !r)} className={cn('px-3 py-1.5 rounded-lg text-sm', buttonSecondary)}>
              {timerRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={() => { setTimerRunning(false); setElapsedSec(0); }} className={cn('px-3 py-1.5 rounded-lg text-sm', buttonSecondary)}>Reset</button>
          </div>
        </div>

        {/* 推奨表現 */}
        <div className={cn('mb-6', cardBase, 'p-4')}>
          <button type="button" onClick={() => setShowExpressions((s) => !s)} className="flex items-center justify-between w-full text-left">
            <h2 className="font-semibold text-text">使う表現（vocab/idiom）</h2>
            <span className="text-sm text-text-muted">{showExpressions ? '閉じる' : '開く'}</span>
          </button>
          {showExpressions && (
            <ul className="mt-3 space-y-1.5 text-sm">
              {(recommended.length > 0 ? recommended : RECOMMENDED_EXPRESSIONS_FALLBACK).map((item, i) => (
                <li key={i} className="text-text-muted">
                  <span className="font-medium">{item.expression}</span>
                  {item.ja_hint && <span className="text-text-muted ml-2">（{item.ja_hint}）</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 深掘り質問 */}
        <div className="mb-4 text-sm text-text-muted">
          質問 {currentIndex + 1} / {questions.length}
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm mb-6">
          <p className="text-lg text-text">{currentQuestion}</p>
        </div>
        <p className="text-sm text-text-muted mb-4">声に出して答えてみましょう（録音・入力はありません）</p>
        <button onClick={handleNext} className={cn('px-6 py-3', buttonPrimary)}>
          {currentIndex < questions.length - 1 ? '次へ' : '完了'}
        </button>
      </div>
    </Layout>
  );
}

export default function SpeakingTask3DrillPage() {
  return (
    <Suspense fallback={<Layout><div className="container mx-auto px-4 py-8 text-center text-text-muted">読み込み中...</div></Layout>}>
      <Task3DrillContent />
    </Suspense>
  );
}
