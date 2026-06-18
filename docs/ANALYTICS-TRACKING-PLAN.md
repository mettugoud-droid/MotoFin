# MotoFin Analytics Tracking Plan

## Overview

Complete tracking implementation for MotoFin to measure user behavior, ad performance, and conversion funnel effectiveness. Dual-tracking via GA4 (behavior analytics) and Meta (ad attribution + optimization).

---

## Event Taxonomy

| # | Event Name | GA4 Event | Meta Pixel (Browser) | Meta CAPI (Server) | Priority | Expected Volume |
|---|-----------|-----------|---------------------|-------------------|----------|-----------------|
| 1 | calculator_started | `calculator_start` | `ViewContent` | `ViewContent` | P1 | 100/day |
| 2 | calculator_completed | `calculator_complete` | `Lead` (custom) | `Lead` | P0 | 30/day |
| 3 | preapproval_viewed | `preapproval_view` | `ViewContent` | `ViewContent` | P1 | 25/day |
| 4 | lead_submitted | `generate_lead` | `Lead` | `Lead` | P0 | 10/day |
| 5 | notification_triggered | `notification_sent` | — | — | P2 | 10/day |

---

## Event Properties (Detailed)

### 1. calculator_started
```json
{
  "event": "calculator_start",
  "properties": {
    "page_url": "/calculator",
    "referrer": "meta_ad | organic | direct",
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "MotoFin_Refinance_LeadGen",
    "device_type": "mobile | desktop",
    "city_detected": "Hyderabad"
  }
}
```

### 2. calculator_completed
```json
{
  "event": "calculator_complete",
  "properties": {
    "monthly_saving": 2150,
    "total_saving": 84000,
    "recommended_bank": "HDFC Bank",
    "outstanding_amount": 450000,
    "current_rate": 12.5,
    "new_rate": 9.25,
    "remaining_tenure_months": 36,
    "calculator_type": "refinance",
    "time_to_complete_seconds": 45
  }
}
```

### 3. preapproval_viewed
```json
{
  "event": "preapproval_view",
  "properties": {
    "approval_probability": "HIGH",
    "confidence_level": 0.85,
    "score": 78,
    "recommended_banks": ["HDFC", "ICICI", "Kotak"],
    "estimated_saving": 2150
  }
}
```

### 4. lead_submitted
```json
{
  "event": "generate_lead",
  "properties": {
    "city": "Hyderabad",
    "calculator_type": "refinance",
    "score": 78,
    "monthly_saving": 2150,
    "phone_provided": true,
    "email_provided": false,
    "consent_given": true
  }
}
```

### 5. notification_triggered
```json
{
  "event": "notification_sent",
  "properties": {
    "provider": "whatsapp | sms | email",
    "template_name": "lead_welcome | savings_reminder | document_request",
    "recipient_type": "lead | internal",
    "delivery_status": "sent | failed"
  }
}
```

---

## GA4 Implementation

### Base Tag Installation (Next.js `_app.tsx` or `layout.tsx`)

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    cookie_domain: 'motofin.in',
    cookie_flags: 'SameSite=None;Secure'
  });
</script>
```

### Next.js Implementation (`components/Analytics.tsx`)

```typescript
'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
```

### GA4 Event Tracking Helper (`lib/analytics.ts`)

```typescript
// Track custom events to GA4
export function trackEvent(eventName: string, properties: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
}

// Specific event functions
export function trackCalculatorStart(pageUrl: string) {
  trackEvent('calculator_start', { page_url: pageUrl });
}

export function trackCalculatorComplete(data: {
  monthlySaving: number;
  recommendedBank: string;
  outstandingAmount: number;
  currentRate: number;
  newRate: number;
}) {
  trackEvent('calculator_complete', {
    monthly_saving: data.monthlySaving,
    recommended_bank: data.recommendedBank,
    outstanding_amount: data.outstandingAmount,
    current_rate: data.currentRate,
    new_rate: data.newRate,
    value: data.monthlySaving * 12, // Annual saving as "value"
    currency: 'INR'
  });
}

export function trackPreapprovalView(data: {
  approvalProbability: string;
  confidenceLevel: number;
  score: number;
}) {
  trackEvent('preapproval_view', {
    approval_probability: data.approvalProbability,
    confidence_level: data.confidenceLevel,
    score: data.score
  });
}

export function trackLeadSubmitted(data: {
  city: string;
  calculatorType: string;
  score: number;
}) {
  trackEvent('generate_lead', {
    city: data.city,
    calculator_type: data.calculatorType,
    score: data.score
  });
}
```

---

## Meta Pixel Implementation (Browser-Side)

### Base Pixel Installation

```html
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'XXXXXXXXXXXXXXXX');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=XXXXXXXXXXXXXXXX&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->
```

### Next.js Meta Pixel Component (`components/MetaPixel.tsx`)

```typescript
'use client';

import Script from 'next/script';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
```

### Meta Pixel Event Tracking (`lib/meta-pixel.ts`)

```typescript
// Meta Pixel event helpers
export function metaTrackViewContent(data: { content_name: string; content_category: string }) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', data);
  }
}

export function metaTrackLead(data: {
  content_name: string;
  value?: number;
  currency?: string;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: data.content_name,
      value: data.value || 0,
      currency: data.currency || 'INR'
    });
  }
}

// Event mapping
export function metaCalculatorStarted() {
  metaTrackViewContent({
    content_name: 'refinance_calculator',
    content_category: 'calculator'
  });
}

export function metaCalculatorCompleted(monthlySaving: number) {
  metaTrackLead({
    content_name: 'calculator_completed',
    value: monthlySaving * 12,
    currency: 'INR'
  });
}

export function metaPreapprovalViewed() {
  metaTrackViewContent({
    content_name: 'preapproval_result',
    content_category: 'preapproval'
  });
}

export function metaLeadSubmitted(value: number) {
  metaTrackLead({
    content_name: 'lead_form_submitted',
    value: value,
    currency: 'INR'
  });
}
```

---

## Meta Conversions API (Server-Side from NestJS)

### Why Server-Side Tracking
- Browser-side pixels blocked by ad blockers (30-40% of users)
- iOS 14.5+ App Tracking Transparency reduces pixel accuracy
- Server-side events are 100% reliable
- Better attribution = better ad optimization = lower CPL

### NestJS Implementation (`modules/analytics/meta-capi.service.ts`)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

interface MetaEvent {
  eventName: string;
  eventTime: number;
  userData: {
    phone?: string;
    email?: string;
    city?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbc?: string; // Facebook click ID
    fbp?: string; // Facebook browser ID
  };
  customData?: Record<string, any>;
  eventSourceUrl: string;
  actionSource: 'website';
}

@Injectable()
export class MetaCapiService {
  private readonly logger = new Logger(MetaCapiService.name);
  private readonly pixelId: string;
  private readonly accessToken: string;
  private readonly testEventCode: string;

  constructor(private config: ConfigService) {
    this.pixelId = this.config.get('META_PIXEL_ID');
    this.accessToken = this.config.get('META_ACCESS_TOKEN');
    this.testEventCode = this.config.get('META_TEST_EVENT_CODE');
  }

  private hashData(value: string): string {
    return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
  }

  async sendEvent(event: MetaEvent): Promise<void> {
    const url = `https://graph.facebook.com/v18.0/${this.pixelId}/events`;

    const payload = {
      data: [{
        event_name: event.eventName,
        event_time: event.eventTime,
        event_source_url: event.eventSourceUrl,
        action_source: 'website',
        user_data: {
          ph: event.userData.phone ? [this.hashData(event.userData.phone)] : undefined,
          em: event.userData.email ? [this.hashData(event.userData.email)] : undefined,
          ct: event.userData.city ? [this.hashData(event.userData.city)] : undefined,
          client_ip_address: event.userData.clientIpAddress,
          client_user_agent: event.userData.clientUserAgent,
          fbc: event.userData.fbc,
          fbp: event.userData.fbp,
        },
        custom_data: event.customData,
      }],
      ...(this.testEventCode && { test_event_code: this.testEventCode }),
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          access_token: this.accessToken,
        }),
      });

      const result = await response.json();
      this.logger.log(`Meta CAPI event sent: ${event.eventName}`, result);
    } catch (error) {
      this.logger.error(`Meta CAPI event failed: ${event.eventName}`, error);
    }
  }

  // Convenience methods
  async trackCalculatorCompleted(data: {
    phone?: string;
    monthlySaving: number;
    recommendedBank: string;
    outstandingAmount: number;
    ip: string;
    userAgent: string;
    fbc?: string;
    fbp?: string;
    sourceUrl: string;
  }) {
    await this.sendEvent({
      eventName: 'Lead',
      eventTime: Math.floor(Date.now() / 1000),
      userData: {
        phone: data.phone,
        clientIpAddress: data.ip,
        clientUserAgent: data.userAgent,
        fbc: data.fbc,
        fbp: data.fbp,
      },
      customData: {
        content_name: 'calculator_completed',
        value: data.monthlySaving * 12,
        currency: 'INR',
        monthly_saving: data.monthlySaving,
        recommended_bank: data.recommendedBank,
        outstanding_amount: data.outstandingAmount,
      },
      eventSourceUrl: data.sourceUrl,
      actionSource: 'website',
    });
  }

  async trackLeadSubmitted(data: {
    phone: string;
    email?: string;
    city: string;
    score: number;
    ip: string;
    userAgent: string;
    fbc?: string;
    fbp?: string;
    sourceUrl: string;
  }) {
    await this.sendEvent({
      eventName: 'Lead',
      eventTime: Math.floor(Date.now() / 1000),
      userData: {
        phone: data.phone,
        email: data.email,
        city: data.city,
        clientIpAddress: data.ip,
        clientUserAgent: data.userAgent,
        fbc: data.fbc,
        fbp: data.fbp,
      },
      customData: {
        content_name: 'lead_form_submitted',
        value: data.score,
        currency: 'INR',
        city: data.city,
        score: data.score,
      },
      eventSourceUrl: data.sourceUrl,
      actionSource: 'website',
    });
  }

  async trackViewContent(data: {
    contentName: string;
    ip: string;
    userAgent: string;
    fbc?: string;
    fbp?: string;
    sourceUrl: string;
  }) {
    await this.sendEvent({
      eventName: 'ViewContent',
      eventTime: Math.floor(Date.now() / 1000),
      userData: {
        clientIpAddress: data.ip,
        clientUserAgent: data.userAgent,
        fbc: data.fbc,
        fbp: data.fbp,
      },
      customData: {
        content_name: data.contentName,
      },
      eventSourceUrl: data.sourceUrl,
      actionSource: 'website',
    });
  }
}
```

### Extracting Facebook Click ID (fbc) and Browser ID (fbp)

```typescript
// Frontend: Pass these cookies to backend with each API call
export function getFacebookIds() {
  const fbc = getCookie('_fbc'); // Facebook Click ID (from URL parameter fbclid)
  const fbp = getCookie('_fbp'); // Facebook Browser ID (auto-generated)
  return { fbc, fbp };
}

// Include in API requests
const response = await fetch('/api/v1/calculator/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...calculatorData,
    _fbc: getFacebookIds().fbc,
    _fbp: getFacebookIds().fbp,
  }),
});
```

---

## Data Layer Structure

### Standard Data Layer (`window.dataLayer`)

```typescript
// Page-level data layer (set on every page)
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  page_type: 'calculator | result | lead_form | thank_you',
  user_type: 'new | returning',
  utm_source: getUtmParam('utm_source'),
  utm_medium: getUtmParam('utm_medium'),
  utm_campaign: getUtmParam('utm_campaign'),
  utm_content: getUtmParam('utm_content'),
  utm_term: getUtmParam('utm_term'),
});

// Event data layer push
function pushEvent(eventName: string, data: Record<string, any>) {
  window.dataLayer.push({
    event: eventName,
    ...data,
    timestamp: new Date().toISOString(),
  });
}
```

### Unified Tracking Function

```typescript
// lib/tracking.ts - Single function for all tracking
import { trackEvent } from './analytics';
import { metaTrackViewContent, metaTrackLead } from './meta-pixel';

export function track(eventName: string, properties: Record<string, any>) {
  // 1. GA4
  trackEvent(eventName, properties);

  // 2. Meta Pixel (browser)
  switch (eventName) {
    case 'calculator_start':
    case 'preapproval_view':
      metaTrackViewContent({
        content_name: eventName,
        content_category: 'calculator'
      });
      break;
    case 'calculator_complete':
    case 'generate_lead':
      metaTrackLead({
        content_name: eventName,
        value: properties.monthly_saving * 12 || 0,
        currency: 'INR'
      });
      break;
  }

  // 3. Data layer (for GTM if added later)
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...properties });
  }

  // 4. Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[TRACK] ${eventName}`, properties);
  }
}
```

---

## Testing & Debugging

### GA4 Debugging

1. **GA4 DebugView** (Real-time)
   - Go to GA4 → Admin → DebugView
   - Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/) Chrome extension
   - All events show in real-time with parameters

2. **Browser Console Verification**
   ```javascript
   // Check if gtag is loaded
   console.log(typeof window.gtag); // should be "function"
   
   // Check dataLayer events
   console.log(window.dataLayer);
   ```

3. **GA4 Real-time Report**
   - GA4 → Reports → Real-time
   - Shows events within last 30 minutes
   - Verify event names and parameters

### Meta Pixel Debugging

1. **Meta Pixel Helper** (Chrome Extension)
   - Install from Chrome Web Store
   - Shows all pixel events firing on page
   - Verifies event parameters

2. **Events Manager Test Events**
   - Meta Events Manager → Test Events tab
   - Use Test Event Code in CAPI calls
   - Enter your URL, open page, verify events appear

3. **Server-Side Event Testing**
   ```bash
   # Test CAPI event manually
   curl -X POST \
     "https://graph.facebook.com/v18.0/PIXEL_ID/events?access_token=ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "data": [{
         "event_name": "Lead",
         "event_time": 1704067200,
         "action_source": "website",
         "event_source_url": "https://motofin.in/calculator",
         "user_data": {
           "client_ip_address": "1.2.3.4",
           "client_user_agent": "Mozilla/5.0"
         },
         "custom_data": {
           "value": 25800,
           "currency": "INR"
         }
       }],
       "test_event_code": "TEST12345"
     }'
   ```

4. **Deduplication**
   - Use same `event_id` for browser pixel and CAPI events
   - Meta auto-deduplicates within 48-hour window
   - Implementation:
   ```typescript
   const eventId = crypto.randomUUID();
   // Browser: fbq('track', 'Lead', data, { eventID: eventId });
   // Server: include event_id: eventId in CAPI payload
   ```

### Verification Checklist

| Check | Tool | Expected Result |
|-------|------|-----------------|
| GA4 page view fires | GA4 DebugView | PageView event on every page |
| calculator_start fires | GA4 Real-time | Event when user opens calculator |
| calculator_complete fires | GA4 Real-time | Event with saving amount |
| Meta PageView fires | Pixel Helper | Green checkmark on every page |
| Meta Lead fires | Pixel Helper | Lead event on calculator complete |
| CAPI events received | Events Manager | Server events in Test Events tab |
| No duplicate events | Events Manager | Dedup percentage shown |
| UTM parameters captured | GA4 → Acquisition | Source/Medium populated |

---

## Attribution Window Settings

### GA4 Attribution
- **Lookback window**: 30 days (default)
- **Attribution model**: Data-driven (default for new properties)
- **Cross-device**: Enabled (uses Google signals)
- Configure: GA4 → Admin → Attribution Settings

### Meta Attribution
- **Click-through window**: 7 days (recommended for lead gen)
- **View-through window**: 1 day
- **Attribution setting**: 7-day click, 1-day view
- Configure: Ad Set level → Attribution Setting

### Recommended Settings for MotoFin

| Platform | Click Window | View Window | Model |
|----------|-------------|-------------|-------|
| GA4 | 30 days | N/A | Data-driven |
| Meta Ads | 7 days | 1 day | Last-touch |

### Why These Settings
- Car loan refinance is a considered purchase (research period: 1-7 days)
- 7-day click window captures most conversion journeys
- 1-day view window prevents over-attribution
- Data-driven model in GA4 accounts for multi-touch paths

---

## Event Priority & Implementation Order

### P0 (Must have for launch)
1. ✅ GA4 base tag + page views
2. ✅ Meta Pixel base code + PageView
3. ✅ `calculator_completed` → GA4 + Meta Pixel + Meta CAPI
4. ✅ `lead_submitted` → GA4 + Meta Pixel + Meta CAPI

### P1 (Add within first week)
5. `calculator_started` → GA4 + Meta Pixel
6. `preapproval_viewed` → GA4 + Meta Pixel
7. UTM parameter capture and storage

### P2 (Add when bandwidth allows)
8. `notification_triggered` → GA4 only
9. Scroll depth tracking
10. Time on calculator tracking

---

## Data Flow Diagram

```
User Action (Browser)
    │
    ├──→ GA4 (gtag.js) ──→ Google Analytics
    │
    ├──→ Meta Pixel (fbq) ──→ Meta Events Manager
    │
    └──→ API Request ──→ NestJS Backend
                              │
                              ├──→ Database (store event)
                              │
                              └──→ Meta CAPI ──→ Meta Events Manager
                                                     │
                                                     └──→ Deduplication with browser pixel
```

---

## Monthly Reporting Metrics (from Analytics)

| Metric | Source | Formula |
|--------|--------|---------|
| Total Visitors | GA4 | Unique users on site |
| Calculator Starts | GA4 | Count of calculator_start events |
| Calculator Completions | GA4 | Count of calculator_complete events |
| Leads Generated | GA4 + DB | Count of generate_lead events |
| Calculator → Lead Rate | Calculated | Leads / Calculator Completions × 100 |
| Cost Per Lead (CPL) | Meta + Manual | Ad Spend / Leads |
| Top Performing City | GA4 | City with highest lead count |
| Top Performing Creative | Meta Ads | Ad with lowest CPL |
| Average Saving Shown | DB | AVG(monthly_saving) from calculator results |

---

*Last Updated: January 2025*
*Owner: Marketing + Engineering*
*Review Frequency: Weekly during validation*
