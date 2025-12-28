'use client';

import { useState } from 'react';
import { getTask1ImagePath, getTask1ImagePathFromMetadata } from '@/lib/utils/task1Image';

interface Task1ImageProps {
  question?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  batch?: number;
  questionNumber?: number;
  alt?: string;
  className?: string;
}

export function Task1Image({
  question,
  level,
  batch,
  questionNumber,
  alt = 'Task 1 Chart',
  className = '',
}: Task1ImageProps) {
  const [imageError, setImageError] = useState(false);
  
  let imagePath: string | null = null;

  if (batch !== undefined && questionNumber !== undefined) {
    imagePath = getTask1ImagePathFromMetadata(batch, questionNumber);
  } else if (question && level) {
    imagePath = getTask1ImagePath(question, level);
  }

  if (!imagePath || imageError) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center ${className}`} style={{ minHeight: '300px' }}>
        <p className="text-gray-500">
          {imagePath ? '画像を読み込めませんでした' : '画像が見つかりません'}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-gray-200 bg-white overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagePath}
        alt={alt}
        className="w-full h-auto"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

