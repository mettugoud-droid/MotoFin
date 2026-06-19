export type AnalyticsEvent =
  | { event: 'hero_cta_click' }
  | { event: 'calculator_start' }
  | { event: 'calculator_step_complete'; step: number }
  | { event: 'calculator_complete'; sessionId: string }
  | { event: 'pre_approval_view'; confidenceLevel: string }
  | { event: 'lead_submit'; sessionId: string }
  | { event: 'scroll_depth'; percentage: 25 | 50 | 75 | 100 }
  | { event: 'exit_intent' };
