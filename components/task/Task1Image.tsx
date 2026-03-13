'use client';

import { useState, useEffect } from 'react';
import { getTask1ImagePath, getTask1ImagePathFromMetadata, detectTask1Genre } from '@/lib/utils/task1Image';

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
    // デバッグ用（開発環境のみ）
    if (!imagePath && typeof window !== 'undefined') {
      const detectedGenre = detectTask1Genre(question);
      console.log('[Task1Image] 画像パスが見つかりません:', {
        questionPreview: question.substring(0, 150),
        level,
        detectedGenre,
        fullQuestion: question,
      });
    }
  }

  if (!imagePath || imageError) {
    return (
      <div className={`rounded-lg border border-border bg-surface-2 flex items-center justify-center ${className}`} style={{ minHeight: '300px' }}>
        <div className="text-center p-4">
          <p className="text-text-muted">
            {imagePath ? '画像を読み込めませんでした' : '画像が見つかりません'}
          </p>
          {process.env.NODE_ENV === 'development' && imagePath && (
            <p className="text-xs text-text-subtle mt-2">パス: {imagePath}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-border bg-surface overflow-hidden ${className}`}>
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

