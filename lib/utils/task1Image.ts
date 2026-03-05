/**
 * Task1逕ｻ蜒上ヱ繧ｹ邂｡逅・Θ繝ｼ繝・ぅ繝ｪ繝・ぅ
 * batch1縺ｯ1,2,3縲｜atch2縺ｯ2-1,2-2,2-3縺ｮ繧医≧縺ｪ蜻ｽ蜷崎ｦ丞援
 */

export interface Task1ImageInfo {
  batch: number;
  questionNumber: number;
  imagePath: string;
}

/**
 * 雉ｪ蝠乗枚縺九ｉ繧ｸ繝｣繝ｳ繝ｫ繧呈耳貂ｬ
 */
export function detectTask1Genre(question: string): string | null {
  const lowerQuestion = question.toLowerCase();
  
  // 隍・焚縺ｮ蝗ｳ陦ｨ繧貞・縺ｫ繝√ぉ繝・け・・irst/second/two縺ｪ縺ｩ縺ｮ繧ｭ繝ｼ繝ｯ繝ｼ繝峨〒蛻､螳夲ｼ・
  if (lowerQuestion.includes('first chart') || lowerQuestion.includes('second chart') || 
      (lowerQuestion.includes('chart') && (lowerQuestion.includes('first') || lowerQuestion.includes('second') || lowerQuestion.includes('two')))) {
    return 'multiple_charts';
  }
  
  // line graph/chart縺ｮ讀懷・
  if (lowerQuestion.includes('line graph') || lowerQuestion.includes('line chart')) {
    return 'line_chart';
  }
  
  // "The graph" 繧・"graph illustrates" 縺ｪ縺ｩ縺ｮ繝代ち繝ｼ繝ｳ繧Ｍine_chart縺ｮ蜿ｯ閭ｽ諤ｧ縺碁ｫ倥＞
  // 縺溘□縺励・bar chart"繧・pie chart"繧貞性縺ｾ縺ｪ縺・ｴ蜷医・縺ｿ
  if ((lowerQuestion.includes('the graph') || lowerQuestion.includes('graph illustrates') || lowerQuestion.includes('graph shows')) 
      && !lowerQuestion.includes('bar chart') && !lowerQuestion.includes('pie chart')) {
    return 'line_chart';
  }
  
  // bar chart縺ｮ讀懷・
  if (lowerQuestion.includes('bar chart')) {
    return 'bar_chart';
  }
  
  // pie chart縺ｮ讀懷・
  if (lowerQuestion.includes('pie chart')) {
    return 'pie_chart';
  }
  
  // diagram縺ｮ讀懷・・・hart繧貞性縺ｾ縺ｪ縺・ｴ蜷茨ｼ・
  if (lowerQuestion.includes('diagram') && !lowerQuestion.includes('chart')) {
    return 'diagram';
  }
  
  // map縺ｮ讀懷・
  if (lowerQuestion.includes('map') || lowerQuestion.includes('maps')) {
    return 'map';
  }
  
  // table縺ｮ讀懷・・・hart繧貞性縺ｾ縺ｪ縺・ｴ蜷茨ｼ・
  if (lowerQuestion.includes('table') && !lowerQuestion.includes('chart')) {
    return 'table';
  }
  
  return null;
}

/**
 * 繧ｿ繧ｹ繧ｯID縺ｾ縺溘・蝠城｡悟・螳ｹ縺九ｉ逕ｻ蜒上ヱ繧ｹ繧貞叙蠕・
 * 
 * @param question - 雉ｪ蝠乗枚
 * @param level - 繝ｬ繝吶Ν・・eginner, intermediate, advanced・・
 * @returns 逕ｻ蜒上ヱ繧ｹ縺ｾ縺溘・null
 */
export function getTask1ImagePath(
  question: string,
  level: 'beginner' | 'intermediate' | 'advanced'
): string | null {
  // 繝舌ャ繝∫分蜿ｷ縺ｨ蝠城｡檎分蜿ｷ縺ｮ繝槭ャ繝斐Φ繧ｰ
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

  const levelToNumber: Partial<Record<'beginner' | 'intermediate' | 'advanced', number>> = {
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

  // batch1縺ｮ蝣ｴ蜷医・1,2,3縲√◎繧御ｻ･螟悶・batch-questionNumber
  if (batch === 1) {
    return `/images/task1/batch1/${questionNumber}.png`;
  } else {
    return `/images/task1/batch${batch}/${batch}-${questionNumber}.png`;
  }
}

/**
 * 蝠城｡後・繝｡繧ｿ繝・・繧ｿ縺九ｉ逕ｻ蜒上ヱ繧ｹ繧貞叙蠕・
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



