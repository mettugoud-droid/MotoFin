// MotoFin Analytics - GA4 + Meta Pixel Integration

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  // GA4 via gtag
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, params);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event, params);
  }

  // Data Layer for GTM
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  }

  // Dev logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, params);
  }
}

export const analytics = {
  heroCtaClicked: (ctaText: string) =>
    trackEvent('hero_cta_clicked', { cta_text: ctaText }),

  calculatorStarted: () =>
    trackEvent('calculator_started', { timestamp: new Date().toISOString() }),

  calculatorCompleted: (monthlySavings: number, totalSavings: number, topUpEligible: boolean) => {
    trackEvent('calculator_completed', {
      monthly_savings: monthlySavings,
      total_savings: totalSavings,
      top_up_eligible: topUpEligible,
    });
    // Meta standard event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'savings_result',
        value: monthlySavings,
        currency: 'INR',
      });
    }
  },

  preapprovalViewed: (probability: number, confidence: string) =>
    trackEvent('preapproval_viewed', {
      approval_probability: probability,
      confidence_level: confidence,
    }),

  leadFormOpened: (savingsAmount: number) => {
    trackEvent('lead_form_opened', { savings_amount: savingsAmount });
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', { value: savingsAmount, currency: 'INR' });
    }
  },

  leadSubmitted: (city: string, hasBank: boolean, savingsAmount: number) => {
    trackEvent('lead_submitted', {
      city,
      has_current_bank: hasBank,
      savings_amount: savingsAmount,
    });
    // Meta standard Lead event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'callback_request',
        value: savingsAmount,
        currency: 'INR',
      });
    }
  },

  successPageViewed: () =>
    trackEvent('success_page_viewed', { timestamp: new Date().toISOString() }),
};
