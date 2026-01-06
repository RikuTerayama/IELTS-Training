'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { cn, selectableSelected, selectableUnselected, cardTitle, cardDesc, buttonPrimary } from '@/lib/ui/theme';

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

const task1Genres: { value: Task1Genre; label: string; description: string }[] = [
  { value: 'line_chart', label: 'ラインチャート', description: '時系列データの変化を表す線グラフ' },
  { value: 'bar_chart', label: '棒グラフ', description: 'カテゴリー間の比較を表す棒グラフ' },
  { value: 'pie_chart', label: '円グラフ', description: '割合や構成比を表す円グラフ' },
  { value: 'table', label: '表（テーブル）', description: 'データを表形式で表示' },
  { value: 'multiple_charts', label: '複数の図表', description: '複数のグラフや表の組み合わせ' },
  { value: 'diagram', label: 'ダイアグラム', description: 'プロセスや構造を表す図' },
  { value: 'map', label: '地図', description: '地理的な情報を表す地図' },
];

const task2Genres: { value: Task2Genre; label: string; description: string }[] = [
  {
    value: 'discussion',
    label: 'Discussionエッセー',
    description: 'Discuss both these views. / Discuss both these views and give your own opinion.',
  },
  {
    value: 'opinion',
    label: 'Opinionエッセー',
    description: 'What is your opinion? / Do you agree or disagree? / To what extent do you agree or disagree?',
  },
  {
    value: 'cause_solution',
    label: 'Cause & Solutionエッセー',
    description: 'Why is this the case? What can be done about this problem?',
  },
  {
    value: 'direct_question',
    label: 'Direct Questionエッセー',
    description: 'What factors contribute to...? How realistic is...?',
  },
  {
    value: 'advantage_disadvantage',
    label: 'Advantage & Disadvantageエッセー',
    description: 'What are the advantages and disadvantages? / Do the advantages outweigh the disadvantages?',
  },
];

const levels: { value: Level; label: string }[] = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' },
];

function TaskSelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [taskType, setTaskType] = useState<TaskType | null>(null);
  const [level, setLevel] = useState<Level>('beginner');
  const [task1Genre, setTask1Genre] = useState<Task1Genre | 'random' | null>(null);
  const [task2Genre, setTask2Genre] = useState<Task2Genre | 'random' | null>(null);
  const [selectedMode, setSelectedMode] = useState<'training' | 'exam'>('training');
  const [loading, setLoading] = useState(false);

  // クエリパラメータからtask_typeを読み取る
  useEffect(() => {
    const taskTypeParam = searchParams.get('task_type');
    if (taskTypeParam === 'Task 1' || taskTypeParam === 'Task 2') {
      setTaskType(taskTypeParam as TaskType);
    }
  }, [searchParams]);

  const handleStart = async () => {
    if (!taskType) return;

    setLoading(true);

    try {
      const genre = taskType === 'Task 1' ? task1Genre : task2Genre;
      if (!genre) return;

      // タスク生成APIを呼び出し
      const response = await fetch('/api/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          task_type: taskType,
          genre: genre === 'random' ? null : genre,
        }),
      });

      if (!response.ok) {
        throw new Error('タスクの生成に失敗しました');
      }

      const data = await response.json();
      if (data.ok && data.data?.id) {
        // Task1の場合は常に /task/[taskId] に遷移（Task1Flowを使用）
        // Task2の場合は初級・中級はPREPモード、上級は通常モード
        if (taskType === 'Task 1') {
          // modeクエリパラメータを追加（selectedModeがあれば）
          const modeQuery = selectedMode === 'exam' ? '?mode=exam' : '';
          router.push(`/task/${data.data.id}${modeQuery}`);
        } else {
          // Task2の場合
          if (level === 'beginner' || level === 'intermediate') {
            router.push(`/task/${data.data.id}/prep`);
          } else {
            router.push(`/task/${data.data.id}`);
          }
        }
      } else {
        throw new Error(data.error?.message || 'タスクの生成に失敗しました');
      }
    } catch (error) {
      console.error('Task generation error:', error);
      alert(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className={cn('text-2xl font-bold mb-6', cardTitle)}>タスクを選択</h1>

        {/* タスクタイプ選択 */}
        <div className="mb-8">
          <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>タスクタイプ</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setTaskType('Task 1');
                setTask1Genre(null);
              }}
              className={cn('p-6', taskType === 'Task 1' ? selectableSelected : selectableUnselected)}
            >
              <div className={cn('font-semibold text-lg mb-2', cardTitle)}>Task 1</div>
              <div className={cardDesc}>グラフ・図表・地図の説明</div>
            </button>
            <button
              onClick={() => {
                setTaskType('Task 2');
                setTask2Genre(null);
              }}
              className={cn('p-6', taskType === 'Task 2' ? selectableSelected : selectableUnselected)}
            >
              <div className={cn('font-semibold text-lg mb-2', cardTitle)}>Task 2</div>
              <div className={cardDesc}>エッセイライティング</div>
            </button>
          </div>
        </div>

        {/* レベル選択 */}
        {taskType && (
          <div className="mb-8">
            <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>レベル</h2>
            <div className="flex gap-4">
              {levels.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  className={cn('px-6 py-2', level === l.value ? selectableSelected : selectableUnselected)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode選択（Task1のみ） */}
        {taskType === 'Task 1' && (
          <div className="mb-8">
            <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>モード</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedMode('training')}
                className={cn('px-6 py-2', selectedMode === 'training' ? selectableSelected : selectableUnselected)}
              >
                Training
              </button>
              <button
                onClick={() => setSelectedMode('exam')}
                className={cn('px-6 py-2', selectedMode === 'exam' ? selectableSelected : selectableUnselected)}
              >
                Exam
              </button>
            </div>
          </div>
        )}

        {/* Task1 ジャンル選択 */}
        {taskType === 'Task 1' && (
          <div className="mb-8">
            <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>形式を選択</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {task1Genres.map((genre) => (
                <button
                  key={genre.value}
                  onClick={() => setTask1Genre(genre.value)}
                  className={cn('p-4', task1Genre === genre.value ? selectableSelected : selectableUnselected)}
                >
                  <div className={cn('font-semibold mb-1', cardTitle)}>{genre.label}</div>
                  <div className={cardDesc}>{genre.description}</div>
                </button>
              ))}
              <button
                onClick={() => setTask1Genre('random')}
                className={cn('p-4', task1Genre === 'random' ? selectableSelected : selectableUnselected)}
              >
                <div className={cn('font-semibold mb-1', cardTitle)}>🎲 ランダム</div>
                <div className={cardDesc}>ランダムな形式を選択</div>
              </button>
            </div>
          </div>
        )}

        {/* Task2 ジャンル選択 */}
        {taskType === 'Task 2' && (
          <div className="mb-8">
            <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>エッセータイプを選択</h2>
            <div className="space-y-3">
              {task2Genres.map((genre) => (
                <button
                  key={genre.value}
                  onClick={() => setTask2Genre(genre.value)}
                  className={cn('w-full p-4', task2Genre === genre.value ? selectableSelected : selectableUnselected)}
                >
                  <div className={cn('font-semibold mb-1', cardTitle)}>{genre.label}</div>
                  <div className={cardDesc}>{genre.description}</div>
                </button>
              ))}
              <button
                onClick={() => setTask2Genre('random')}
                className={cn('w-full p-4', task2Genre === 'random' ? selectableSelected : selectableUnselected)}
              >
                <div className={cn('font-semibold mb-1', cardTitle)}>🎲 ランダム</div>
                <div className={cardDesc}>ランダムなエッセータイプを選択</div>
              </button>
            </div>
          </div>
        )}

        {/* 開始ボタン */}
        {taskType && (taskType === 'Task 1' ? task1Genre : task2Genre) && (
          <div className="flex justify-end">
            <button
              onClick={handleStart}
              disabled={loading}
              className={cn('px-8 py-3', buttonPrimary)}
            >
              {loading ? '生成中...' : 'タスクを開始'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function TaskSelectPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">読み込み中...</div>
        </div>
      </Layout>
    }>
      <TaskSelectContent />
    </Suspense>
  );
}

