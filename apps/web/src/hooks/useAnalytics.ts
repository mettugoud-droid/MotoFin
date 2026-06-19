'use client';

import { useCallback } from 'react';
import { pushEvent } from '@/lib/analytics';
import type { AnalyticsEvent } from '@/types/analytics';

export function useAnalytics() {
  const trackEvent = useCallback((eventData: AnalyticsEvent) => {
    const { event, ...rest } = eventData;
    pushEvent(event, rest as Record<string, unknown>);
  }, []);

  return { trackEvent };
}
