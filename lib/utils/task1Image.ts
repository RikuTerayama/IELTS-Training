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
 * 質問文からジャンルを推測
 */
export function detectTask1Genre(question: string): string | null {
  const lowerQuestion = question.toLowerCase();
  
  // 複数の図表を先にチェック（first/second/twoなどのキーワードで判定）
  if (lowerQuestion.includes('first chart') || lowerQuestion.includes('second chart') || 
      (lowerQuestion.includes('chart') && (lowerQuestion.includes('first') || lowerQuestion.includes('second') || lowerQuestion.includes('two')))) {
    return 'multiple_charts';
  }
  
  // line graph/chartの検出
  if (lowerQuestion.includes('line graph') || lowerQuestion.includes('line chart')) {
    return 'line_chart';
  }
  
  // "The graph" や "graph illustrates" などのパターンもline_chartの可能性が高い
  // ただし、"bar chart"や"pie chart"を含まない場合のみ
  if ((lowerQuestion.includes('the graph') || lowerQuestion.includes('graph illustrates') || lowerQuestion.includes('graph shows')) 
      && !lowerQuestion.includes('bar chart') && !lowerQuestion.includes('pie chart')) {
    return 'line_chart';
  }
  
  // bar chartの検出
  if (lowerQuestion.includes('bar chart')) {
    return 'bar_chart';
  }
  
  // pie chartの検出
  if (lowerQuestion.includes('pie chart')) {
    return 'pie_chart';
  }
  
  // diagramの検出（chartを含まない場合）
  if (lowerQuestion.includes('diagram') && !lowerQuestion.includes('chart')) {
    return 'diagram';
  }
  
  // mapの検出
  if (lowerQuestion.includes('map') || lowerQuestion.includes('maps')) {
    return 'map';
  }
  
  // tableの検出（chartを含まない場合）
  if (lowerQuestion.includes('table') && !lowerQuestion.includes('chart')) {
    return 'table';
  }
  
  return null;
}

/**
 * タスクIDまたは問題内容から画像パスを取得
 * 
 * @param question - 質問文
 * @param level - レベル（beginner, intermediate, advanced）
 * @returns 画像パスまたはnull
 */
export function getTask1ImagePath(
  question: string,
  level: 'beginner' | 'intermediate' | 'advanced'
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

  const genre = detectTask1Genre(question);
  if (!genre) {
    return null;
  }

  const batch = typeToBatch[genre];
  const questionNumber = levelToNumber[level];

  if (!batch || !questionNumber) {
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

