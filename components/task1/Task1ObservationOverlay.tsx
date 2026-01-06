/**
 * Task 1 Observation Overlay
 * 図表上に付箋を配置できるコンポーネント
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/ui/theme';
import type { Task1Observation } from '@/lib/domain/types';

interface Task1ObservationOverlayProps {
  imageUrl: string;
  observations: Task1Observation[];
  onObservationsChange: (observations: Task1Observation[]) => void;
  mode: 'training' | 'exam';
}

export function Task1ObservationOverlay({
  imageUrl,
  observations,
  onObservationsChange,
  mode,
}: Task1ObservationOverlayProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Examモードでは非表示
  if (mode === 'exam') {
    return null;
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newObservation: Task1Observation = {
      id: `obs-${Date.now()}`,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      text: '',
    };

    onObservationsChange([...observations, newObservation]);
  };

  const handleDelete = (id: string) => {
    onObservationsChange(observations.filter((obs) => obs.id !== id));
  };

  const handleTextChange = (id: string, text: string) => {
    onObservationsChange(
      observations.map((obs) => (obs.id === id ? { ...obs, text } : obs))
    );
  };

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    setDraggingId(id);
    const obs = observations.find((o) => o.id === id);
    if (obs) {
      setDragOffset({
        x: e.clientX - (obs.x / 100) * (e.currentTarget.parentElement?.clientWidth || 0),
        y: e.clientY - (obs.y / 100) * (e.currentTarget.parentElement?.clientHeight || 0),
      });
    }
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - dragOffset.y) / rect.height) * 100;

    onObservationsChange(
      observations.map((obs) =>
        obs.id === draggingId
          ? { ...obs, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
          : obs
      )
    );
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div
      className="relative"
      onClick={handleImageClick}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <img src={imageUrl} alt="Task 1 Chart" className="w-full" />
      
      {/* 付箋オーバーレイ */}
      {observations.map((obs) => (
        <div
          key={obs.id}
          className="absolute cursor-move"
          style={{
            left: `${obs.x}%`,
            top: `${obs.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseDown={(e) => handleDragStart(obs.id, e)}
        >
          <div className="rounded border border-yellow-400 bg-yellow-50 p-2 shadow-md">
            <textarea
              value={obs.text}
              onChange={(e) => handleTextChange(obs.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className={cn('w-32 resize-none rounded border border-yellow-300 bg-surface p-1 text-xs', 'text-text placeholder:text-placeholder')}
              placeholder="メモ..."
              rows={2}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(obs.id);
              }}
              className="mt-1 text-xs text-red-600 hover:text-red-800"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

