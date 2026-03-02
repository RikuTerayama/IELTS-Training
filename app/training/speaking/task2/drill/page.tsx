'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { normalizeSpeakingCategory } from '@/lib/data/speaking_categories';
import { RECOMMENDED_EXPRESSIONS_FALLBACK } from '@/lib/data/speaking_recommended_fallback';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

/** SPK-FR-4: 音声・テキスト入力なし。Cue card + Prep 1分 / Speak 2分 タイマーのみ */
const PREP_SEC = 60;
const SPEAK_SEC = 120;

interface RecommendedItem {
  expression: string;
  ja_hint?: string;
}

function getCueCardPrompt(category: string): { title: string; bullets: string[] } {
  const prompts: Record<string, { title: string; bullets: string[] }> = {
    work_study: {
      title: 'Describe a job you would like to have in the future.',
      bullets: ['What the job is', 'Why you are interested', 'What skills it needs', 'How you will prepare'],
    },
    hometown: {
      title: 'Describe your hometown or a place you have lived.',
      bullets: ['Where it is', 'What it is famous for', 'What you like/dislike', 'Would you live there in the future?'],
    },
    hobbies: {
      title: 'Describe a hobby or activity you enjoy.',
      bullets: ['What it is', 'When you started', 'Why you enjoy it', 'How often you do it'],
    },
    technology: {
      title: 'Describe a piece of technology you use every day.',
      bullets: ['What it is', 'How you use it', 'Why it is important to you', 'What you would do without it'],
    },
    environment: {
      title: 'Describe an environmental problem that concerns you.',
      bullets: ['What the problem is', 'What causes it', 'What can be done', 'Your personal action'],
    },
    place: {
      title: 'Describe a place you would like to visit.',
      bullets: ['Where it is', 'What you know about it', 'Why you want to go', 'What you would do there'],
    },
    person: {
      title: 'Describe a person who has influenced you.',
      bullets: ['Who they are', 'How you know them', 'What they did', 'Why they influenced you'],
    },
    event: {
      title: 'Describe a memorable event in your life.',
      bullets: ['What happened', 'When and where', 'Who was there', 'Why it was memorable'],
    },
  };
  return prompts[category] || {
    title: 'Describe something related to this topic.',
    bullets: ['What it is', 'Why it matters', 'Your experience', 'Your opinion'],
  };
}

function Task2DrillContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = normalizeSpeakingCategory(searchParams.get('category'));

  const [recommended, setRecommended] = useState<RecommendedItem[]>([]);
  const [showExpressions, setShowExpressions] = useState(true);
  const [timerMode, setTimerMode] = useState<'prep' | 'speak' | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cueCard = getCueCardPrompt(category);

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
    if (!running || secondsLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, secondsLeft]);

  const startPrep = () => {
    setTimerMode('prep');
    setSecondsLeft(PREP_SEC);
    setRunning(true);
  };
  const startSpeak = () => {
    setTimerMode('speak');
    setSecondsLeft(SPEAK_SEC);
    setRunning(true);
  };
  const resetTimer = () => {
    setRunning(false);
    setTimerMode(null);
    setSecondsLeft(0);
  };

  const displayTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-text">Speaking Task 2（Cue card）</h1>
          <Link href="/training/speaking" className={cn('text-sm', buttonSecondary)}>
            お題を変える
          </Link>
        </div>

        {/* Prep 1分 / Speak 2分 タイマー（ワンタップ切替） */}
        <div className={cn('mb-6 p-4 rounded-xl', cardBase)}>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={startPrep}
              disabled={running}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium', timerMode === 'prep' ? 'bg-amber-100 text-amber-800' : buttonSecondary)}
            >
              Prep 1分
            </button>
            <button
              onClick={startSpeak}
              disabled={running}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium', timerMode === 'speak' ? 'bg-indigo-100 text-indigo-800' : buttonSecondary)}
            >
              Speak 2分
            </button>
            {running && (
              <>
                <span className="font-mono text-2xl font-bold text-text">{displayTime}</span>
                <button onClick={resetTimer} className={cn('text-sm', buttonSecondary)}>Reset</button>
              </>
            )}
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

        {/* Cue card */}
        <div className="rounded-xl border-2 border-border bg-surface-2 p-6 mb-4">
          <h2 className="font-semibold text-text mb-3">Topic</h2>
          <p className="text-lg text-text mb-4">{cueCard.title}</p>
          <p className="text-sm text-text-muted mb-2">You should say:</p>
          <ul className="list-disc list-inside space-y-1 text-text-muted">
            {cueCard.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-text-muted">声に出して話してみましょう（録音・入力はありません）</p>
      </div>
    </Layout>
  );
}

export default function SpeakingTask2DrillPage() {
  return (
    <Suspense fallback={<Layout><div className="container mx-auto px-4 py-8 text-center text-text-muted">読み込み中...</div></Layout>}>
      <Task2DrillContent />
    </Suspense>
  );
}
