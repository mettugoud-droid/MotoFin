'use client';

import { useEffect, useRef } from 'react';
import { pushEvent } from '@/lib/analytics';

export function useExitIntent() {
  const hasFired = useRef(false);

  useEffect(() => {
    // Only activate on desktop (no touch devices)
    if ('ontouchstart' in window) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasFired.current) {
        hasFired.current = true;
        pushEvent('exit_intent');
      }
    };

    document.addEventListener('mouseout', handleMouseLeave);
    return () => document.removeEventListener('mouseout', handleMouseLeave);
  }, []);
}
