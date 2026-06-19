'use client';

import { useEffect, useRef } from 'react';
import { pushEvent } from '@/lib/analytics';

export function useScrollDepth() {
  const firedThresholds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      const thresholds = [25, 50, 75, 100] as const;

      for (const threshold of thresholds) {
        if (scrollPercent >= threshold && !firedThresholds.current.has(threshold)) {
          firedThresholds.current.add(threshold);
          pushEvent('scroll_depth', { percentage: threshold });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
