'use client';

import { useState, useEffect } from 'react';
import { getTask1ImagePath, getTask1ImagePathFromMetadata, detectTask1Genre } from '@/lib/utils/task1Image';
import { cn, cardBase } from '@/lib/ui/theme';

interface Task1ImageProps {
  question?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  batch?: number;
  questionNumber?: number;
  imagePath?: string; // 新規生成タスクの場合に直接指定
  alt?: string;
  className?: string;
}

export function Task1Image({
  question,
  level,
  batch,
  questionNumber,
  imagePath: imagePathProp,
  alt = 'Task 1 Chart',
  className = '',
}: Task1ImageProps) {
  const [imageError, setImageError] = useState(false);
  
  let imagePath: string | null = null;

  // 優先順位1: 直接指定されたimagePath（新規生成タスク）
  if (imagePathProp) {
    imagePath = imagePathProp;
  } else if (batch !== undefined && questionNumber !== undefined) {
    // 優先順位2: メタデータから（既存方式）
    imagePath = getTask1ImagePathFromMetadata(batch, questionNumber);
  } else if (question && level) {
    // 優先順位3: 質問文から検出（旧方式、後方互換用）
    imagePath = getTask1ImagePath(question, level);
    // デバッグ用（開発環境のみ）
    if (!imagePath && typeof window !== 'undefined') {
      const detectedGenre = detectTask1Genre(question);
      console.log('[Task1Image] 画像パスが見つかりません（旧方式）:', {
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
    <div className={cn('mx-auto w-full max-w-3xl', className)}>
      <div className={cn('relative w-full rounded-xl border border-border bg-surface p-4', 'max-h-[60vh] overflow-auto')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagePath}
          alt={alt}
          className="mx-auto w-full h-auto max-h-[60vh] object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
}

