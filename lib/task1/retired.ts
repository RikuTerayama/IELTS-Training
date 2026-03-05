import type { Task } from '@/lib/domain/types';

type TaskLike = Pick<Task, 'question_type' | 'level' | 'asset_id' | 'image_path'>;

const RETIRED_BEGINNER_ASSET_IDS = new Set([
  'line_chart_1',
  'bar_chart_1',
  'pie_chart_1',
  'table_1',
]);

const RETIRED_BEGINNER_IMAGE_PATHS = new Set([
  '/images/task1/batch1/1.png',
  '/images/task1/batch2/2-1.png',
  '/images/task1/batch3/3-1.png',
  '/images/task1/batch4/4-1.png',
]);

export function isRetiredTask1Beginner(task: TaskLike | null | undefined): boolean {
  if (!task || task.question_type !== 'Task 1') return false;
  if (task.level === 'beginner') return true;
  if (task.asset_id && RETIRED_BEGINNER_ASSET_IDS.has(task.asset_id)) return true;
  if (task.image_path && RETIRED_BEGINNER_IMAGE_PATHS.has(task.image_path)) return true;
  return false;
}
