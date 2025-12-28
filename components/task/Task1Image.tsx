'use client';

import Image from 'next/image';
import { getTask1ImagePath, getTask1ImagePathFromMetadata } from '@/lib/utils/task1Image';

interface Task1ImageProps {
  taskId?: string;
  questionType?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  batch?: number;
  questionNumber?: number;
  alt?: string;
  className?: string;
}

export function Task1Image({
  taskId,
  questionType,
  level,
  batch,
  questionNumber,
  alt = 'Task 1 Chart',
  className = '',
}: Task1ImageProps) {
  let imagePath: string | null = null;

  if (batch !== undefined && questionNumber !== undefined) {
    imagePath = getTask1ImagePathFromMetadata(batch, questionNumber);
  } else if (taskId && questionType && level) {
    imagePath = getTask1ImagePath(taskId, questionType, level);
  }

  if (!imagePath) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center ${className}`} style={{ minHeight: '300px' }}>
        <p className="text-gray-500">画像が見つかりません</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-gray-200 bg-white overflow-hidden ${className}`}>
      <Image
        src={imagePath}
        alt={alt}
        width={800}
        height={600}
        className="w-full h-auto"
        onError={(e) => {
          // 画像読み込みエラー時のフォールバック
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="flex items-center justify-center p-8 text-gray-500" style="min-height: 300px;">
                <p>画像を読み込めませんでした</p>
              </div>
            `;
          }
        }}
      />
    </div>
  );
}

