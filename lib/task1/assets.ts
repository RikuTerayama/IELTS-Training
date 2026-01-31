/**
 * Task1 アセット定義
 * 既存の画像ファイルとメタデータのマッピング
 */

export type Task1Level = 'beginner' | 'intermediate' | 'advanced';
export type Task1Genre = 'line_chart' | 'bar_chart' | 'pie_chart' | 'table' | 'multiple_charts' | 'diagram' | 'map';

export interface Task1Asset {
  id: string;
  level: Task1Level;
  genre: Task1Genre;
  image_path: string;
  title: string;
  time_period: string; // e.g., "2010 to 2020", "January to June 2023"
  unit: string; // e.g., "millions", "thousands", "percentage"
  categories: string[]; // e.g., ["Country A", "Country B", "Country C"]
  description: string; // グラフの内容の簡潔な説明
}

/**
 * Task1アセット一覧
 * 既存の画像ファイル (public/images/task1/batch* 配下) に対応
 */
export const TASK1_ASSETS: Task1Asset[] = [
  // batch1: line_chart
  {
    id: 'line_chart_1',
    level: 'beginner',
    genre: 'line_chart',
    image_path: '/images/task1/batch1/1.png',
    title: 'Population changes over time',
    time_period: '2010 to 2020',
    unit: 'millions',
    categories: ['Country A', 'Country B', 'Country C'],
    description: 'The line graph shows population changes in three countries from 2010 to 2020.',
  },
  {
    id: 'line_chart_2',
    level: 'intermediate',
    genre: 'line_chart',
    image_path: '/images/task1/batch1/2.png',
    title: 'Sales trends',
    time_period: '2015 to 2023',
    unit: 'thousands',
    categories: ['Product X', 'Product Y', 'Product Z'],
    description: 'The line graph illustrates sales trends for three products between 2015 and 2023.',
  },
  {
    id: 'line_chart_3',
    level: 'advanced',
    genre: 'line_chart',
    image_path: '/images/task1/batch1/3.png',
    title: 'Energy consumption patterns',
    time_period: '2000 to 2020',
    unit: 'million kWh',
    categories: ['Coal', 'Natural Gas', 'Renewable Energy', 'Nuclear'],
    description: 'The line graph displays energy consumption patterns across four energy sources from 2000 to 2020.',
  },
  
  // batch2: bar_chart
  {
    id: 'bar_chart_1',
    level: 'beginner',
    genre: 'bar_chart',
    image_path: '/images/task1/batch2/2-1.png',
    title: 'Student enrollment by department',
    time_period: '2023',
    unit: 'number of students',
    categories: ['Engineering', 'Business', 'Arts', 'Science'],
    description: 'The bar chart compares student enrollment across four departments in 2023.',
  },
  {
    id: 'bar_chart_2',
    level: 'intermediate',
    genre: 'bar_chart',
    image_path: '/images/task1/batch2/2-2.png',
    title: 'Monthly sales comparison',
    time_period: 'January to June 2023',
    unit: 'thousands of dollars',
    categories: ['Store A', 'Store B', 'Store C'],
    description: 'The bar chart shows monthly sales figures for three stores from January to June 2023.',
  },
  {
    id: 'bar_chart_3',
    level: 'advanced',
    genre: 'bar_chart',
    image_path: '/images/task1/batch2/2-3.png',
    title: 'CO2 emissions by sector',
    time_period: '2010, 2015, 2020',
    unit: 'million tonnes',
    categories: ['Transport', 'Industry', 'Energy', 'Agriculture'],
    description: 'The bar chart compares CO2 emissions across four sectors in 2010, 2015, and 2020.',
  },
  
  // batch3: pie_chart
  {
    id: 'pie_chart_1',
    level: 'beginner',
    genre: 'pie_chart',
    image_path: '/images/task1/batch3/3-1.png',
    title: 'Market share by company',
    time_period: '2023',
    unit: 'percentage',
    categories: ['Company A', 'Company B', 'Company C', 'Others'],
    description: 'The pie chart illustrates market share distribution among companies in 2023.',
  },
  {
    id: 'pie_chart_2',
    level: 'intermediate',
    genre: 'pie_chart',
    image_path: '/images/task1/batch3/3-2.png',
    title: 'Budget allocation',
    time_period: '2023',
    unit: 'percentage',
    categories: ['Education', 'Healthcare', 'Infrastructure', 'Defense', 'Others'],
    description: 'The pie chart shows budget allocation across five categories in 2023.',
  },
  {
    id: 'pie_chart_3',
    level: 'advanced',
    genre: 'pie_chart',
    image_path: '/images/task1/batch3/3-3.png',
    title: 'Energy sources distribution',
    time_period: '2022',
    unit: 'percentage',
    categories: ['Fossil Fuels', 'Renewable Energy', 'Nuclear', 'Hydroelectric', 'Others'],
    description: 'The pie chart displays the distribution of energy sources in 2022.',
  },
  
  // batch4: table
  {
    id: 'table_1',
    level: 'beginner',
    genre: 'table',
    image_path: '/images/task1/batch4/4-1.png',
    title: 'Student performance by subject',
    time_period: '2023',
    unit: 'average score',
    categories: ['Math', 'English', 'Science', 'History'],
    description: 'The table presents average student scores across four subjects in 2023.',
  },
  {
    id: 'table_2',
    level: 'intermediate',
    genre: 'table',
    image_path: '/images/task1/batch4/4-2.png',
    title: 'Tourism statistics',
    time_period: '2018 to 2022',
    unit: 'number of visitors',
    categories: ['Region A', 'Region B', 'Region C'],
    description: 'The table shows tourism statistics for three regions from 2018 to 2022.',
  },
  {
    id: 'table_3',
    level: 'advanced',
    genre: 'table',
    image_path: '/images/task1/batch4/4-3.png',
    title: 'Employment data by sector',
    time_period: '2010, 2015, 2020',
    unit: 'thousands of employees',
    categories: ['Manufacturing', 'Services', 'Agriculture', 'Technology'],
    description: 'The table compares employment figures across four sectors in 2010, 2015, and 2020.',
  },
];

/**
 * アセットをレベルとジャンルでフィルタリング
 */
export function filterAssets(
  level?: Task1Level,
  genre?: Task1Genre
): Task1Asset[] {
  return TASK1_ASSETS.filter(asset => {
    if (level && asset.level !== level) return false;
    if (genre && asset.genre !== genre) return false;
    return true;
  });
}

/**
 * ジャンル未指定時の重み付き選択
 * 分布制御: line/bar/pie/table を均等に、multiple/diagram/map はやや少なく
 */
const GENRE_WEIGHTS: Record<Task1Genre, number> = {
  line_chart: 1,
  bar_chart: 1,
  pie_chart: 1,
  table: 1,
  multiple_charts: 0.5,
  diagram: 0.5,
  map: 0.5,
};

/**
 * 重み付きでランダムにアセットを選択
 */
export function selectAssetByWeight(
  level: Task1Level,
  genre?: Task1Genre
): Task1Asset | null {
  const candidates = filterAssets(level, genre);
  
  if (candidates.length === 0) {
    return null;
  }
  
  // ジャンルが指定されている場合はそのまま選択
  if (genre) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  
  // ジャンル未指定時は重み付き選択
  const genreGroups: Record<Task1Genre, Task1Asset[]> = {
    line_chart: [],
    bar_chart: [],
    pie_chart: [],
    table: [],
    multiple_charts: [],
    diagram: [],
    map: [],
  };
  
  candidates.forEach(asset => {
    genreGroups[asset.genre].push(asset);
  });
  
  // 重み付きでジャンルを選択
  const genres = Object.keys(genreGroups) as Task1Genre[];
  const weightedGenres = genres.flatMap(g => 
    Array(Math.round(GENRE_WEIGHTS[g] * 10)).fill(g)
  );
  
  if (weightedGenres.length === 0) {
    return null;
  }
  
  const selectedGenre = weightedGenres[Math.floor(Math.random() * weightedGenres.length)] as Task1Genre;
  const genreCandidates = genreGroups[selectedGenre];
  
  if (genreCandidates.length === 0) {
    return null;
  }
  
  return genreCandidates[Math.floor(Math.random() * genreCandidates.length)];
}

/**
 * IDでアセットを取得
 */
export function getAssetById(id: string): Task1Asset | null {
  return TASK1_ASSETS.find(asset => asset.id === id) || null;
}

