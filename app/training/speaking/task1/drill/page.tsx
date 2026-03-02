'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { getPhrasesByTopicAndLevel, type SpeakingPhrase } from '@/lib/data/speaking_phrases';
import { normalizeSpeakingCategory } from '@/lib/data/speaking_categories';
import { RECOMMENDED_EXPRESSIONS_FALLBACK } from '@/lib/data/speaking_recommended_fallback';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

/** SPK-FR-4: 音声入力・テキスト入力なし。タイマー・次へ・お題を変える・推奨表現表示のみ */
interface RecommendedItem {
  module: string;
  expression: string;
  ja_hint?: string;
}

const TASK1_QUESTION_COUNT = 8;
const TIMER_PRESET_SEC = 30; // 1問あたりの目安時間（任意表示用）

function Task1DrillContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = normalizeSpeakingCategory(searchParams.get('category'));

  const [phrases, setPhrases] = useState<SpeakingPhrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommended, setRecommended] = useState<RecommendedItem[]>([]);
  const [showExpressions, setShowExpressions] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const list = getPhrasesByTopicAndLevel(category, 'B2', TASK1_QUESTION_COUNT);
    setPhrases(list);
  }, [category]);

  useEffect(() => {
    fetch('/api/input/items?skill=speaking&modules=vocab,idiom&limit=8')
      .then((r) => r.json())
      .then((data: { ok?: boolean; data?: { items?: RecommendedItem[] } }) => {
        if (data.ok && data.data?.items?.length) {
          setRecommended(
            data.data.items.map((i: { expression: string; ja_hint?: string; module?: string }) => ({
              module: i.module || 'vocab',
              expression: i.expression,
              ja_hint: i.ja_hint,
            }))
          );
        } else {
          setRecommended(RECOMMENDED_EXPRESSIONS_FALLBACK.map((f) => ({ module: 'vocab', expression: f.expression, ja_hint: f.ja_hint })));
        }
      })
      .catch(() => {
        setRecommended(RECOMMENDED_EXPRESSIONS_FALLBACK.map((f) => ({ module: 'vocab', expression: f.expression, ja_hint: f.ja_hint })));
      });
  }, []);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const handleNext = () => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      router.push('/training/speaking');
    }
  };

  const currentPhrase = phrases[currentIndex];
  const progress = phrases.length > 0 ? ((currentIndex + 1) / phrases.length) * 100 : 0;

  if (phrases.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8 text-text-muted">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-text">Speaking Task 1</h1>
          <Link href="/training/speaking" className={cn('text-sm', buttonSecondary)}>
            お題を変える
          </Link>
        </div>

        {/* タイマー（Start/Pause/Reset） */}
        <div className={cn('mb-6 p-4 rounded-xl', cardBase)}>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-2xl font-mono font-bold text-text">
              {String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:{String(elapsedSec % 60).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setTimerRunning((r) => !r)}
                className={cn('px-3 py-1.5 rounded-lg text-sm font-medium', buttonSecondary)}
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setElapsedSec(0);
                }}
                className={cn('px-3 py-1.5 rounded-lg text-sm font-medium', buttonSecondary)}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* 推奨表現（SPK-FR-3, SPK-AC-4: 空にしない） */}
        <div className={cn('mb-6', cardBase, 'p-4')}>
          <button
            type="button"
            onClick={() => setShowExpressions((s) => !s)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="font-semibold text-text">使う表現（vocab/idiom）</h2>
            <span className="text-sm text-text-muted">{showExpressions ? '閉じる' : '開く'}</span>
          </button>
          {showExpressions && (
            <ul className="mt-3 space-y-1.5 text-sm">
              {(recommended.length > 0 ? recommended : RECOMMENDED_EXPRESSIONS_FALLBACK.map((f) => ({ module: 'vocab', expression: f.expression, ja_hint: f.ja_hint }))).map((item, i) => (
                <li key={i} className="text-text-muted">
                  <span className="font-medium">{item.expression}</span>
                  {item.ja_hint && <span className="text-text-muted ml-2">（{item.ja_hint}）</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 進捗 */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-text-muted mb-1">
            <span>質問 {currentIndex + 1} / {phrases.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-surface-2 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* お題（質問） */}
        {currentPhrase && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <p className="text-text-muted text-sm mb-2">日本語</p>
              <p className="text-lg text-text">{currentPhrase.japanese}</p>
            </div>
            <p className="text-sm text-text-muted">声に出して答えてみましょう（録音・入力はありません）</p>

            <div className="flex gap-4">
              <button onClick={handleNext} className={cn('px-6 py-3', buttonPrimary)}>
                {currentIndex < phrases.length - 1 ? '次へ' : '完了'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function SpeakingTask1DrillPage() {
  return (
    <Suspense fallback={
      <Layout><div className="container mx-auto px-4 py-8 text-center text-text-muted">読み込み中...</div></Layout>
    }>
      <Task1DrillContent />
    </Suspense>
  );
}
