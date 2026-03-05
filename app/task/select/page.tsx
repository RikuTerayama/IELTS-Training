'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import {
  buttonPrimary,
  cardDesc,
  cardTitle,
  cn,
  selectableSelected,
  selectableUnselected,
} from '@/lib/ui/theme';

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
  { value: 'line_chart', label: 'Line Chart', description: 'Describe trends over time.' },
  { value: 'bar_chart', label: 'Bar Chart', description: 'Compare categories by amount.' },
  { value: 'pie_chart', label: 'Pie Chart', description: 'Explain percentage distributions.' },
  { value: 'table', label: 'Table', description: 'Summarize tabular data.' },
  { value: 'multiple_charts', label: 'Multiple Charts', description: 'Compare two or more visuals.' },
  { value: 'diagram', label: 'Diagram', description: 'Explain process or system flows.' },
  { value: 'map', label: 'Map', description: 'Describe location and changes.' },
];

const task2Genres: { value: Task2Genre; label: string; description: string }[] = [
  {
    value: 'discussion',
    label: 'Discussion',
    description: 'Discuss both views and provide your opinion when asked.',
  },
  {
    value: 'opinion',
    label: 'Opinion',
    description: 'Do you agree or disagree? Explain your position clearly.',
  },
  {
    value: 'cause_solution',
    label: 'Cause & Solution',
    description: 'Explain causes and suggest practical solutions.',
  },
  {
    value: 'direct_question',
    label: 'Direct Question',
    description: 'Answer each question part directly and logically.',
  },
  {
    value: 'advantage_disadvantage',
    label: 'Advantage & Disadvantage',
    description: 'Compare pros and cons with clear reasoning.',
  },
];

const levels: { value: Level; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const task1AllowedLevels: Level[] = ['intermediate', 'advanced'];

function TaskSelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [taskType, setTaskType] = useState<TaskType | null>(null);
  const [level, setLevel] = useState<Level>('beginner');
  const [task1Genre, setTask1Genre] = useState<Task1Genre | 'random' | null>(null);
  const [task2Genre, setTask2Genre] = useState<Task2Genre | 'random' | null>(null);
  const [selectedMode, setSelectedMode] = useState<'training' | 'exam'>('training');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const taskTypeParam = searchParams.get('task_type');
    if (taskTypeParam === 'Task 1' || taskTypeParam === 'Task 2') {
      setTaskType(taskTypeParam as TaskType);
      if (taskTypeParam === 'Task 1' && level === 'beginner') {
        setLevel('intermediate');
      }
    }
  }, [searchParams, level]);

  useEffect(() => {
    if (taskType === 'Task 1' && level === 'beginner') {
      setLevel('intermediate');
    }
  }, [taskType, level]);

  const handleStart = async () => {
    if (!taskType) return;

    setLoading(true);

    try {
      const genre = taskType === 'Task 1' ? task1Genre : task2Genre;
      if (!genre) return;

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
        throw new Error('Failed to generate task');
      }

      const data = await response.json();
      if (data.ok && data.data?.id) {
        if (taskType === 'Task 1') {
          const modeQuery = selectedMode === 'exam' ? '?mode=exam' : '';
          router.push(`/task/${data.data.id}${modeQuery}`);
        } else if (level === 'beginner' || level === 'intermediate') {
          router.push(`/task/${data.data.id}/prep`);
        } else {
          router.push(`/task/${data.data.id}`);
        }
      } else {
        throw new Error(data.error?.message || 'Failed to generate task');
      }
    } catch (error) {
      console.error('Task generation error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className={cn('mb-6 text-2xl font-bold', cardTitle)}>Select Task</h1>

        <div className="mb-8">
          <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>Task Type</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => {
                setTaskType('Task 1');
                setLevel('intermediate');
                setTask1Genre(null);
              }}
              className={cn('p-6', taskType === 'Task 1' ? selectableSelected : selectableUnselected)}
            >
              <div className={cn('mb-2 text-lg font-semibold', cardTitle)}>Task 1</div>
              <div className={cardDesc}>Graph / chart / diagram / map description</div>
            </button>
            <button
              onClick={() => {
                setTaskType('Task 2');
                setLevel('beginner');
                setTask2Genre(null);
              }}
              className={cn('p-6', taskType === 'Task 2' ? selectableSelected : selectableUnselected)}
            >
              <div className={cn('mb-2 text-lg font-semibold', cardTitle)}>Task 2</div>
              <div className={cardDesc}>Essay writing</div>
            </button>
          </div>
        </div>

        {taskType && (
          <div className="mb-8">
            <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>Level</h2>
            <div className="flex gap-4">
              {(taskType === 'Task 1'
                ? levels.filter((l) => task1AllowedLevels.includes(l.value))
                : levels
              ).map((l) => (
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

        {taskType === 'Task 1' && (
          <div className="mb-8">
            <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>Mode</h2>
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

        {taskType === 'Task 1' && (
          <div className="mb-8">
            <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>Genre</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {task1Genres.map((genre) => (
                <button
                  key={genre.value}
                  onClick={() => setTask1Genre(genre.value)}
                  className={cn('p-4', task1Genre === genre.value ? selectableSelected : selectableUnselected)}
                >
                  <div className={cn('mb-1 font-semibold', cardTitle)}>{genre.label}</div>
                  <div className={cardDesc}>{genre.description}</div>
                </button>
              ))}
              <button
                onClick={() => setTask1Genre('random')}
                className={cn('p-4', task1Genre === 'random' ? selectableSelected : selectableUnselected)}
              >
                <div className={cn('mb-1 font-semibold', cardTitle)}>Random</div>
                <div className={cardDesc}>Pick a random Task 1 genre</div>
              </button>
            </div>
          </div>
        )}

        {taskType === 'Task 2' && (
          <div className="mb-8">
            <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>Essay Type</h2>
            <div className="space-y-3">
              {task2Genres.map((genre) => (
                <button
                  key={genre.value}
                  onClick={() => setTask2Genre(genre.value)}
                  className={cn('w-full p-4', task2Genre === genre.value ? selectableSelected : selectableUnselected)}
                >
                  <div className={cn('mb-1 font-semibold', cardTitle)}>{genre.label}</div>
                  <div className={cardDesc}>{genre.description}</div>
                </button>
              ))}
              <button
                onClick={() => setTask2Genre('random')}
                className={cn('w-full p-4', task2Genre === 'random' ? selectableSelected : selectableUnselected)}
              >
                <div className={cn('mb-1 font-semibold', cardTitle)}>Random</div>
                <div className={cardDesc}>Pick a random Task 2 essay type</div>
              </button>
            </div>
          </div>
        )}

        {taskType && (taskType === 'Task 1' ? task1Genre : task2Genre) && (
          <div className="flex justify-end">
            <button onClick={handleStart} disabled={loading} className={cn('px-8 py-3', buttonPrimary)}>
              {loading ? 'Generating...' : 'Start Task'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function TaskSelectPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </Layout>
      }
    >
      <TaskSelectContent />
    </Suspense>
  );
}
