/**
 * Task1画像パス管理ユーティリティ
 * batch1は1,2,3、batch2は2-1,2-2,2-3のような命名規則
 */

export interface Task1ImageInfo {
  batch: number;
  questionNumber: number;
  imagePath: string;
}

/**
 * タスクIDまたは問題内容から画像パスを取得
 * 
 * @param taskId - タスクID（データベースのIDまたはバッチ番号）
 * @param questionType - 問題タイプ（line_chart, bar_chart, pie_chart, table, multiple_charts, diagram, map）
 * @param level - レベル（beginner, intermediate, advanced）
 * @returns 画像パスまたはnull
 */
export function getTask1ImagePath(
  taskId: string,
  questionType?: string,
  level?: 'beginner' | 'intermediate' | 'advanced'
): string | null {
  // バッチ番号と問題番号のマッピング
  // batch1: line_chart (beginner, intermediate, advanced) = 1, 2, 3
  // batch2: bar_chart (beginner, intermediate, advanced) = 2-1, 2-2, 2-3
  // batch3: pie_chart (beginner, intermediate, advanced) = 3-1, 3-2, 3-3
  // batch4: table (beginner, intermediate, advanced) = 4-1, 4-2, 4-3
  // batch5: multiple_charts (beginner, intermediate, advanced) = 5-1, 5-2, 5-3
  // batch6: diagram (beginner, intermediate, advanced) = 6-1, 6-2, 6-3
  // batch7: map (beginner, intermediate, advanced) = 7-1, 7-2, 7-3

  const typeToBatch: Record<string, number> = {
    line_chart: 1,
    bar_chart: 2,
    pie_chart: 3,
    table: 4,
    multiple_charts: 5,
    diagram: 6,
    map: 7,
  };

  const levelToNumber: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };

  let batch: number | null = null;
  let questionNumber: number | null = null;

  // questionTypeとlevelから決定
  if (questionType && level) {
    batch = typeToBatch[questionType] || null;
    questionNumber = levelToNumber[level] || null;
  } else {
    // taskIdから推測（UUIDの場合は別の方法が必要）
    // ここでは簡易的な実装
    return null;
  }

  if (batch === null || questionNumber === null) {
    return null;
  }

  // batch1の場合は1,2,3、それ以外はbatch-questionNumber
  if (batch === 1) {
    return `/images/task1/batch1/${questionNumber}.png`;
  } else {
    return `/images/task1/batch${batch}/${batch}-${questionNumber}.png`;
  }
}

/**
 * 問題のメタデータから画像パスを取得
 */
export function getTask1ImagePathFromMetadata(
  batch: number,
  questionNumber: number
): string {
  if (batch === 1) {
    return `/images/task1/batch1/${questionNumber}.png`;
  } else {
    return `/images/task1/batch${batch}/${batch}-${questionNumber}.png`;
  }
}

