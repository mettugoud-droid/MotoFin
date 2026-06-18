# MotoFin Analytics Verification Report

## Pre-Launch Event Tracking Verification

**Date:** June 2026  
**Status:** Implementation Specification Complete  
**Platform:** Google Analytics 4 + Meta Pixel  

---

## 1. Conversion Funnel Events

### Event: `hero_cta_clicked`

| Property | Value |
|----------|-------|
| **Trigger** | User clicks "Check My Savings" or "See Sample Result" in Hero section |
| **Component** | `src/components/sections/Hero.tsx` |
| **Payload** | `{ cta_text: string, position: 'hero_primary' \| 'hero_secondary' }` |
| **GA4 Mapping** | Event: `hero_cta_clicked`, Parameters: `cta_text`, `position` |
| **Meta Pixel** | `fbq('trackCustom', 'HeroCtaClicked', { cta_text })` |
| **Verification** | Button `onClick` handler fires scroll + should fire analytics event |
| **Status** | ⚠️ Event handler exists (scrollToCalculator) — analytics call needs injection |

---

### Event: `calculator_started`

| Property | Value |
|----------|-------|
| **Trigger** | User focuses on the first form field (Current Monthly EMI) |
| **Component** | `src/components/calculator/CalculatorSection.tsx` |
| **Payload** | `{ first_field: 'currentEmi', timestamp: ISO_string }` |
| **GA4 Mapping** | Event: `calculator_started`, Parameters: `first_field` |
| **Meta Pixel** | `fbq('trackCustom', 'CalculatorStarted')` |
| **Verification** | Should fire once per session on first input focus |
| **Status** | ⚠️ Form exists with react-hook-form — needs onFocus event hook |

---

### Event: `calculator_completed`

| Property | Value |
|----------|-------|
| **Trigger** | User successfully submits calculator form and receives results |
| **Component** | `src/components/calculator/CalculatorSection.tsx` → `handleCalculate()` |
| **Payload** | `{ monthly_savings: number, total_savings: number, top_up_eligible: boolean, time_to_complete_ms: number }` |
| **GA4 Mapping** | Event: `calculator_completed`, Parameters: `monthly_savings`, `total_savings`, `top_up_eligible` |
| **Meta Pixel** | `fbq('track', 'ViewContent', { content_name: 'savings_result', value: monthly_savings, currency: 'INR' })` |
| **Verification** | Fires after successful API response in `handleCalculate`, before `setStep('results')` |
| **Status** | ⚠️ API call succeeds and sets state — analytics call needs injection at success path |

---

### Event: `preapproval_viewed`

| Property | Value |
|----------|-------|
| **Trigger** | Pre-approval gauge renders in the results view |
| **Component** | `src/components/calculator/CalculatorSection.tsx` (results step) |
| **Payload** | `{ approval_probability: number, confidence_level: 'HIGH' \| 'MODERATE' \| 'SUBJECT_TO_VERIFICATION', recommended_banks: string[] }` |
| **GA4 Mapping** | Event: `preapproval_viewed`, Parameters: `approval_probability`, `confidence_level` |
| **Meta Pixel** | `fbq('trackCustom', 'PreApprovalViewed', { probability: number })` |
| **Verification** | Fires when `preApproval` state is non-null and results step renders |
| **Status** | ⚠️ Pre-approval section renders conditionally — needs useEffect trigger |

---

### Event: `lead_form_opened`

| Property | Value |
|----------|-------|
| **Trigger** | User clicks "Get Free Callback" button on results screen |
| **Component** | `src/components/calculator/CalculatorSection.tsx` |
| **Payload** | `{ savings_amount: number, from_step: 'results' }` |
| **GA4 Mapping** | Event: `lead_form_opened`, Parameters: `savings_amount` |
| **Meta Pixel** | `fbq('track', 'InitiateCheckout', { value: savings_amount, currency: 'INR' })` |
| **Verification** | Fires when `setStep('lead-capture')` is called from results |
| **Status** | ⚠️ Step transition exists — analytics call needs injection |

---

### Event: `lead_submitted`

| Property | Value |
|----------|-------|
| **Trigger** | User successfully submits lead capture form |
| **Component** | `src/components/calculator/CalculatorSection.tsx` → `handleLeadSubmit()` |
| **Payload** | `{ city: string, has_current_bank: boolean, savings_amount: number }` |
| **GA4 Mapping** | Event: `lead_submitted` (PRIMARY CONVERSION), Parameters: `city`, `has_current_bank` |
| **Meta Pixel** | `fbq('track', 'Lead', { content_name: 'callback_request', value: savings_amount, currency: 'INR' })` |
| **Google Ads** | `gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/YYYYYYY', value: savings_amount, currency: 'INR' })` |
| **Verification** | Fires after successful API response in `handleLeadSubmit`, before `setStep('success')` |
| **Status** | ⚠️ API call succeeds and transitions — analytics call needs injection |

---

### Event: `success_page_viewed`

| Property | Value |
|----------|-------|
| **Trigger** | Success confirmation screen renders after lead submission |
| **Component** | `src/components/calculator/CalculatorSection.tsx` (success step) |
| **Payload** | `{ lead_submitted: true, session_id: string }` |
| **GA4 Mapping** | Event: `success_page_viewed`, Parameters: `session_id` |
| **Meta Pixel** | `fbq('track', 'CompleteRegistration', { content_name: 'lead_success' })` |
| **Verification** | Fires once when success step renders |
| **Status** | ⚠️ Success UI renders — needs useEffect trigger on step === 'success' |

---

## 2. Recommended Implementation

### Analytics Utility (`src/lib/analytics.ts`)

```typescript
// Recommended implementation file
export function trackEvent(event: string, params?: Record<string, unknown>) {
  // GA4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, params);
  }
  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', event, params);
  }
  // Console in dev
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, params);
  }
}

export const analytics = {
  heroCtaClicked: (ctaText: string) =>
    trackEvent('hero_cta_clicked', { cta_text: ctaText, position: 'hero' }),

  calculatorStarted: () =>
    trackEvent('calculator_started', { first_field: 'currentEmi', timestamp: new Date().toISOString() }),

  calculatorCompleted: (monthlySavings: number, totalSavings: number, topUpEligible: boolean) =>
    trackEvent('calculator_completed', { monthly_savings: monthlySavings, total_savings: totalSavings, top_up_eligible: topUpEligible }),

  preapprovalViewed: (probability: number, confidence: string) =>
    trackEvent('preapproval_viewed', { approval_probability: probability, confidence_level: confidence }),

  leadFormOpened: (savingsAmount: number) =>
    trackEvent('lead_form_opened', { savings_amount: savingsAmount }),

  leadSubmitted: (city: string, hasBank: boolean, savingsAmount: number) =>
    trackEvent('lead_submitted', { city, has_current_bank: hasBank, savings_amount: savingsAmount }),

  successPageViewed: (sessionId: string) =>
    trackEvent('success_page_viewed', { session_id: sessionId }),
};
```

### Integration Points

| Event | File | Location |
|-------|------|----------|
| `hero_cta_clicked` | `Hero.tsx` | Inside `scrollToCalculator()` |
| `calculator_started` | `CalculatorSection.tsx` | First field `onFocus` (fire once via ref) |
| `calculator_completed` | `CalculatorSection.tsx` | `handleCalculate()` success path, after `setSavings()` |
| `preapproval_viewed` | `CalculatorSection.tsx` | `useEffect` watching `preApproval` state |
| `lead_form_opened` | `CalculatorSection.tsx` | `onClick` of "Get Free Callback" button |
| `lead_submitted` | `CalculatorSection.tsx` | `handleLeadSubmit()` success path, before `setStep('success')` |
| `success_page_viewed` | `CalculatorSection.tsx` | `useEffect` watching `step === 'success'` |

---

## 3. GTM Data Layer Configuration

### Required Data Layer Pushes

```javascript
// On page load
window.dataLayer = window.dataLayer || [];

// Example push structure
window.dataLayer.push({
  event: 'calculator_completed',
  monthly_savings: 2350,
  total_savings: 84600,
  top_up_eligible: true,
});
```

### GA4 Event Parameters Mapping

| GA4 Event | Parameters | Conversion? |
|-----------|------------|-------------|
| `hero_cta_clicked` | `cta_text` | No |
| `calculator_started` | `first_field` | No (micro-conversion) |
| `calculator_completed` | `monthly_savings`, `total_savings`, `top_up_eligible` | Yes (micro) |
| `preapproval_viewed` | `approval_probability`, `confidence_level` | No |
| `lead_form_opened` | `savings_amount` | No |
| `lead_submitted` | `city`, `has_current_bank`, `savings_amount` | **Yes (PRIMARY)** |
| `success_page_viewed` | `session_id` | No |

### Meta Pixel Standard Events Mapping

| Funnel Stage | Meta Standard Event | Custom Parameters |
|-------------|--------------------|--------------------|
| Calculator viewed | `ViewContent` | `content_name: 'calculator'` |
| Calculator completed | `ViewContent` | `content_name: 'savings_result', value: monthly_savings` |
| Lead form opened | `InitiateCheckout` | `value: savings_amount, currency: 'INR'` |
| Lead submitted | `Lead` | `content_name: 'callback_request', value: savings_amount` |
| Success | `CompleteRegistration` | `content_name: 'lead_success'` |

---

## 4. Verification Checklist

| # | Event | Trigger Works | Payload Correct | GA4 Received | Meta Pixel Received |
|---|-------|:---:|:---:|:---:|:---:|
| 1 | `hero_cta_clicked` | ⚠️ Needs hook | ⚠️ | ☐ Pending GTM | ☐ Pending Pixel |
| 2 | `calculator_started` | ⚠️ Needs hook | ⚠️ | ☐ Pending GTM | ☐ Pending Pixel |
| 3 | `calculator_completed` | ⚠️ Needs hook | ⚠️ | ☐ Pending GTM | ☐ Pending Pixel |
| 4 | `preapproval_viewed` | ⚠️ Needs hook | ⚠️ | ☐ Pending GTM | ☐ Pending Pixel |
| 5 | `lead_form_opened` | ⚠️ Needs hook | ⚠️ | ☐ Pending GTM | ☐ Pending Pixel |
| 6 | `lead_submitted` | ⚠️ Needs hook | ⚠️ | ☐ Pending GTM | ☐ Pending Pixel |
| 7 | `success_page_viewed` | ⚠️ Needs hook | ⚠️ | ☐ Pending GTM | ☐ Pending Pixel |

**Legend:** ✅ Verified | ⚠️ Implementation ready, needs GTM/Pixel setup | ☐ Not yet testable

---

## 5. Pre-Launch Analytics Setup Steps

1. **Create GTM Container** → Add container ID to `<Script>` in `layout.tsx`
2. **Create GA4 Property** → Link to GTM, configure data streams
3. **Install Meta Pixel** → Add base pixel code via GTM or `<Script>`
4. **Configure Custom Events** → Set up all 7 events in GTM triggers
5. **Mark `lead_submitted` as GA4 Conversion** → In GA4 Admin > Events > Mark as conversion
6. **Create Meta Custom Conversions** → Map `Lead` event as conversion for campaign optimization
7. **Test with GA4 DebugView** → Enable debug mode, walk through funnel
8. **Test with Meta Events Manager** → Use Test Events tool
9. **Set up Google Ads Conversion** → Import GA4 conversion or add gtag directly
10. **Configure Conversion Value** → Set `savings_amount` as dynamic value for ROAS optimization

---

## 6. Post-Launch Monitoring

| Metric | Tool | Frequency | Alert Threshold |
|--------|------|-----------|-----------------|
| Event firing rate | GA4 Realtime | Continuous | < 50% expected events |
| Conversion rate | GA4 Reports | Daily | < 10% (first week baseline) |
| Pixel health | Meta Events Manager | Daily | Any "inactive" status |
| Funnel drop-off | GA4 Funnel Explorer | Weekly | > 50% drop at any stage |
| Data freshness | GA4 Realtime | Continuous | No events for > 30 min during traffic |
