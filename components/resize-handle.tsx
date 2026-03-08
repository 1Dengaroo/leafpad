'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  onResize: (fraction: number) => void;
  containerRef: React.RefObject<HTMLElement | null>;
}

export function ResizeHandle({ onResize, containerRef }: ResizeHandleProps) {
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const fraction = (e.clientX - rect.left) / rect.width;
      onResize(Math.min(0.8, Math.max(0.2, fraction)));
    },
    [dragging, containerRef, onResize]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={cn(
        'group relative z-10 hidden w-2 flex-shrink-0 cursor-col-resize items-center justify-center select-none md:flex',
        dragging && 'bg-primary/10'
      )}
    >
      <div
        className={cn(
          'bg-border group-hover:bg-primary/50 h-8 w-1 rounded-full transition-colors',
          dragging && 'bg-primary/50'
        )}
      />
    </div>
  );
}
