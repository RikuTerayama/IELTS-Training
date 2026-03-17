'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import {
  buttonPrimary,
  cardBase,
  cn,
  pageTitle,
  sectionTitle,
  helperText,
  bodyText,
  buttonSecondary,
} from '@/lib/ui/theme';
import type { ApiResponse } from '@/lib/api/response';
import {
  getUserFacingSubmissionError,
  isUnauthorizedApiResponse,
  redirectToLoginWithNext,
} from '@/lib/api/clientError';

type TaskType = 'Task 1' | 'Task 2';
type Level = 'beginner' | 'intermediate' | 'advanced';

type Task1Genre =
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'table'
  | 'multiple_charts'
  | 'diagram'
  | 'map';

type Task2Genre =
  | 'discussion'
  | 'opinion'
  | 'cause_solution'
  | 'direct_question'
  | 'advantage_disadvantage';

type GenerateTaskResponse = { id: string };

const task1Genres: { value: Task1Genre; label: string; description: string }[] = [
  { value: 'line_chart', label: 'ラインチャート', description: '変化の推移を比較するときに使う典型パターンです。' },
  { value: 'bar_chart', label: '棒グラフ', description: '項目ごとの差を整理して書く練習に向いています。' },
  { value: 'pie_chart', label: '円グラフ', description: '割合や内訳を説明するときの定番形式です。' },
  { value: 'table', label: '表', description: '数値の比較を表形式で整理するタイプです。' },
  { value: 'multiple_charts', label: '複数チャート', description: '複数の図表をまとめて比較する形式です。' },
  { value: 'diagram', label: 'プロセス図', description: '工程や流れを順番に説明するタイプです。' },
  { value: 'map', label: '地図', description: '場所の変化や配置を説明するタイプです。' },
];

const task2Genres: { value: Task2Genre; label: string; description: string }[] = [
  {
    value: 'discussion',
    label: '両論比較',
    description: '両方の立場を比較し、自分の意見をまとめるタイプです。',
  },
  {
    value: 'opinion',
    label: '意見',
    description: '賛成・反対や程度を明確に出すタイプです。',
  },
  {
    value: 'cause_solution',
    label: '原因と解決策',
    description: '原因と解決策を整理して書くタイプです。',
  },
  {
    value: 'direct_question',
    label: '直接質問',
    description: '設問に直接答えながら論点を整理するタイプです。',
  },
  {
    value: 'advantage_disadvantage',
    label: '利点と欠点',
    description: 'メリットとデメリットを比較するタイプです。',
  },
];

const levels: { value: Level; label: string; description: string }[] = [
  { value: 'beginner', label: '初級', description: 'PREP ありで構成を整えながら進めます。' },
  { value: 'intermediate', label: '中級', description: 'PREP ありで論点整理をしながら進めます。' },
  { value: 'advanced', label: '上級', description: '本番寄りの流れでそのまま書き始めます。' },
];

function getSelectedGenreLabel(
  taskType: TaskType | null,
  selectedGenre: Task1Genre | Task2Genre | 'random' | null
): string {
  if (!selectedGenre) return '';
  if (selectedGenre === 'random') return 'ランダム';

  const source = taskType === 'Task 1' ? task1Genres : task2Genres;
  return source.find((item) => item.value === selectedGenre)?.label ?? selectedGenre;
}

function TaskSelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [taskType, setTaskType] = useState<TaskType | null>(null);
  const [level, setLevel] = useState<Level>('beginner');
  const [task1Genre, setTask1Genre] = useState<Task1Genre | 'random' | null>(null);
  const [task2Genre, setTask2Genre] = useState<Task2Genre | 'random' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const taskTypeParam = searchParams.get('task_type');
    if (taskTypeParam === 'Task 1' || taskTypeParam === 'Task 2') {
      setTaskType(taskTypeParam as TaskType);
    }
  }, [searchParams]);

  const handleStart = async () => {
    if (!taskType) return;

    const genre = taskType === 'Task 1' ? task1Genre : task2Genre;
    if (!genre) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          task_type: taskType,
          genre: genre === 'random' ? null : genre,
        }),
      });

      const data = (await response.json()) as ApiResponse<GenerateTaskResponse>;

      if (isUnauthorizedApiResponse(response, data)) {
        redirectToLoginWithNext(`${window.location.pathname}${window.location.search}`);
        return;
      }

      if (!response.ok || !data.ok || !data.data?.id) {
        throw new Error(
          getUserFacingSubmissionError(
            response,
            data,
            'タスクの開始に失敗しました。条件を確認して、もう一度お試しください。'
          )
        );
      }

      if (level === 'beginner' || level === 'intermediate') {
        router.push(`/task/${data.data.id}/prep`);
      } else {
        router.push(`/task/${data.data.id}`);
      }
    } catch (caught) {
      console.error('Task generation error:', caught);
      setError(caught instanceof Error ? caught.message : 'タスクの開始に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const selectedGenre = taskType === 'Task 1' ? task1Genre : task2Genre;
  const selectedGenreLabel = getSelectedGenreLabel(taskType, selectedGenre);

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <section className="mb-10 space-y-4">
          <h1 className={pageTitle}>タスクを選ぶ</h1>
          <p className={cn(bodyText, 'max-w-3xl')}>
            Task の種類、レベル、出題タイプを選んで Writing を開始します。Task 2 は Practice と Exam Mode の両方へつながります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className={sectionTitle}>Task タイプ</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                value: 'Task 1' as const,
                title: 'Task 1',
                description: 'グラフ・表・地図・プロセス図などを説明するタスクです。',
              },
              {
                value: 'Task 2' as const,
                title: 'Task 2',
                description: '意見・比較・原因と解決策などを論理的に書くタスクです。',
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setTaskType(item.value);
                  setError(null);
                  if (item.value === 'Task 1') setTask1Genre(null);
                  if (item.value === 'Task 2') setTask2Genre(null);
                }}
                className={cn(
                  cardBase,
                  'p-6 text-left transition-all',
                  taskType === item.value
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:border-primary/40 hover:shadow-md'
                )}
              >
                <div className="text-lg font-semibold text-text">{item.title}</div>
                <p className={cn(helperText, 'mt-2')}>{item.description}</p>
              </button>
            ))}
          </div>
        </section>

        {taskType ? (
          <section className="mb-8">
            <h2 className={sectionTitle}>レベル</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {levels.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setLevel(item.value)}
                  className={cn(
                    cardBase,
                    'p-5 text-left transition-all',
                    level === item.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'hover:border-primary/40 hover:shadow-md'
                  )}
                >
                  <div className="font-semibold text-text">{item.label}</div>
                  <p className={cn(helperText, 'mt-2')}>{item.description}</p>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {taskType === 'Task 1' ? (
          <section className="mb-8">
            <h2 className={sectionTitle}>出題タイプ</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {task1Genres.map((genre) => (
                <button
                  key={genre.value}
                  type="button"
                  onClick={() => setTask1Genre(genre.value)}
                  className={cn(
                    cardBase,
                    'p-5 text-left transition-all',
                    task1Genre === genre.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'hover:border-primary/40 hover:shadow-md'
                  )}
                >
                  <div className="font-semibold text-text">{genre.label}</div>
                  <p className={cn(helperText, 'mt-2')}>{genre.description}</p>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTask1Genre('random')}
                className={cn(
                  cardBase,
                  'p-5 text-left transition-all',
                  task1Genre === 'random'
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:border-primary/40 hover:shadow-md'
                )}
              >
                <div className="font-semibold text-text">ランダム</div>
                <p className={cn(helperText, 'mt-2')}>Task 1 の形式をランダムで出題します。</p>
              </button>
            </div>
          </section>
        ) : null}

        {taskType === 'Task 2' ? (
          <section className="mb-8">
            <h2 className={sectionTitle}>出題タイプ</h2>
            <div className="mt-4 space-y-3">
              {task2Genres.map((genre) => (
                <button
                  key={genre.value}
                  type="button"
                  onClick={() => setTask2Genre(genre.value)}
                  className={cn(
                    cardBase,
                    'w-full p-5 text-left transition-all',
                    task2Genre === genre.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'hover:border-primary/40 hover:shadow-md'
                  )}
                >
                  <div className="font-semibold text-text">{genre.label}</div>
                  <p className={cn(helperText, 'mt-2')}>{genre.description}</p>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTask2Genre('random')}
                className={cn(
                  cardBase,
                  'w-full p-5 text-left transition-all',
                  task2Genre === 'random'
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:border-primary/40 hover:shadow-md'
                )}
              >
                <div className="font-semibold text-text">ランダム</div>
                <p className={cn(helperText, 'mt-2')}>Task 2 の出題タイプをランダムで選びます。</p>
              </button>
            </div>
          </section>
        ) : null}

        {taskType && selectedGenre ? (
          <section className={cn(cardBase, 'space-y-4 p-6')}>
            <div className="space-y-2">
              <h2 className={sectionTitle}>開始する</h2>
              <p className={helperText}>
                {taskType} / {level === 'beginner' ? '初級' : level === 'intermediate' ? '中級' : '上級'} /{' '}
                {selectedGenreLabel}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleStart}
                disabled={loading}
                className={cn(buttonPrimary, 'inline-flex', loading && 'cursor-not-allowed opacity-50')}
              >
                {loading ? 'タスクを準備中...' : 'この条件で始める'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTaskType(null);
                  setTask1Genre(null);
                  setTask2Genre(null);
                  setError(null);
                }}
                className={cn(buttonSecondary, 'inline-flex')}
              >
                選び直す
              </button>
            </div>
            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          </section>
        ) : null}
      </div>
    </Layout>
  );
}

export default function TaskSelectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted">読み込み中...</div>}>
      <TaskSelectContent />
    </Suspense>
  );
}
