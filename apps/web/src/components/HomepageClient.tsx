'use client';

import { useScrollDepth } from '@/hooks/useScrollDepth';
import { useExitIntent } from '@/hooks/useExitIntent';

export function HomepageClient() {
  useScrollDepth();
  useExitIntent();
  return null;
}
