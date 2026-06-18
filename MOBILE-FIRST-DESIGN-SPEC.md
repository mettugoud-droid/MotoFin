# MotoFin Mobile-First Design Specification

## Responsive Design System for Premium Fintech Conversion

**Version:** 2.0  
**Approach:** Mobile-First (design for 360px, scale up)  
**Primary Devices:** Android (72% Indian mobile market), iPhone  
**Target:** 95%+ mobile traffic from paid campaigns  

---

## 1. Device Landscape & Breakpoint Strategy

### Target Devices (Priority Order)

| Device | Viewport | Market Share (India) | Priority |
|--------|----------|---------------------|----------|
| Samsung Galaxy A series | 360 x 800 | ~18% | P0 |
| Redmi / Xiaomi | 393 x 873 | ~15% | P0 |
| iPhone 14/15 | 390 x 844 | ~12% | P0 |
| Samsung Galaxy S series | 412 x 915 | ~10% | P0 |
| iPhone 14/15 Pro Max | 430 x 932 | ~5% | P1 |
| iPad | 768 x 1024 | ~3% | P1 |
| Desktop | 1280 x 800 | ~15% | P1 |
| Desktop (wide) | 1440 x 900 | ~8% | P2 |

### Breakpoint System

```css
/* Mobile-First: Base styles = mobile (360px) */

/* Small mobile override (320px — older devices) */
@media (max-width: 359px) { /* Squeeze adjustments */ }

/* Standard mobile — default (360px - 767px) */
/* No media query needed — these ARE the base styles */

/* Tablet (768px+) */
@media (min-width: 768px) { /* md: */ }

/* Desktop (1024px+) */
@media (min-width: 1024px) { /* lg: */ }

/* Wide desktop (1280px+) */
@media (min-width: 1280px) { /* xl: */ }
```

### Tailwind Breakpoint Config

```typescript
// tailwind.config.ts
theme: {
  screens: {
    'xs': '360px',    // Explicit small mobile
    'sm': '412px',    // Large mobile
    'md': '768px',    // Tablet
    'lg': '1024px',   // Desktop
    'xl': '1280px',   // Wide desktop
    '2xl': '1440px',  // Ultra-wide
  },
}
```

---


## 2. Touch Interaction Design

### Touch Target Specifications

| Element | Minimum Size | Recommended | Spacing |
|---------|-------------|-------------|---------|
| Buttons (CTA) | 44 x 44px | 48 x 52px | 8px between |
| Input fields | 44px height | 48px height | 16px between |
| Links (inline) | 44 x 44px touch area | — | 8px padding |
| Icons (tappable) | 44 x 44px | 48 x 48px | 12px padding |
| Accordion headers | 48px height | 56px height | 0 (border separated) |
| Radio/Checkbox | 44 x 44px | 48 x 48px | 12px between |
| Close buttons | 44 x 44px | 48 x 48px | 16px from edge |

### Thumb Zone Optimization

```
┌─────────────────────────────────┐
│                                 │
│     HARD TO REACH               │  ← Navigation, brand
│     (secondary elements)        │
│                                 │
├─────────────────────────────────┤
│                                 │
│     COMFORTABLE                 │  ← Content, results
│     (content viewing)           │
│                                 │
├─────────────────────────────────┤
│                                 │
│     EASY TO REACH               │  ← Primary CTA,
│     (primary actions)           │     form inputs,
│                                 │     navigation
│                                 │
└─────────────────────────────────┘
      ↑ Bottom of screen
```

### Design Rules for Thumb Zone

1. **Primary CTA always in bottom 40%** of viewport
2. **Sticky CTA bar** on results page (always visible)
3. **Back button** placed in easy-reach zone (top-left is acceptable for navigation)
4. **Form fields** stack vertically in natural thumb flow
5. **No floating action buttons** — use inline CTAs instead
6. **Pull-to-refresh disabled** — prevent accidental reloads during form fill

### Gesture Support

| Gesture | Action | Context |
|---------|--------|---------|
| Tap | Primary interaction | Buttons, links, inputs |
| Swipe left/right | — (not used) | Avoided to prevent accidental navigation |
| Scroll (vertical) | Content navigation | All pages |
| Long press | — (not used) | Avoided for simplicity |
| Pinch zoom | Disabled on form | `maximum-scale=5` allows zoom on content |

---

## 3. Mobile Layout Specifications

### Page Container

```css
/* Base mobile container */
.container {
  width: 100%;
  max-width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  margin: 0 auto;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding-left: 24px;
    padding-right: 24px;
    max-width: 720px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding-left: 32px;
    padding-right: 32px;
    max-width: 960px;
  }
}

/* Wide */
@media (min-width: 1280px) {
  .container {
    max-width: 1140px;
  }
}
```

### Calculator Card Layout

```css
/* Mobile (360px) */
.calculator-card {
  margin: -48px 16px 0;     /* Overlaps hero */
  padding: 20px;
  border-radius: 16px;
  width: calc(100% - 32px);
}

/* Large mobile (412px) */
@media (min-width: 412px) {
  .calculator-card {
    padding: 24px;
  }
}

/* Tablet (768px) */
@media (min-width: 768px) {
  .calculator-card {
    margin: -64px auto 0;
    padding: 32px;
    max-width: 560px;
    border-radius: 20px;
  }
}

/* Desktop (1024px) */
@media (min-width: 1024px) {
  .calculator-card {
    max-width: 600px;
    padding: 40px;
  }
}
```

### Metric Cards Grid

```css
/* Mobile — 2 columns */
.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* When 3+ metrics, allow wrapping */
.metrics-grid--flexible {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* Tablet+ — same 2-col but larger gaps */
@media (min-width: 768px) {
  .metrics-grid {
    gap: 16px;
  }
}
```

---


## 4. Typography Responsive Scale

### Mobile-First Type Scale

| Token | Mobile (360px) | Large Mobile (412px) | Tablet (768px) | Desktop (1024px) |
|-------|----------------|---------------------|----------------|-------------------|
| Hero Headline | 32px / 700 | 34px / 700 | 40px / 700 | 48px / 700 |
| Section Heading | 24px / 700 | 24px / 700 | 28px / 700 | 30px / 700 |
| Card Title | 20px / 600 | 20px / 600 | 22px / 600 | 24px / 600 |
| Body | 15px / 400 | 16px / 400 | 16px / 400 | 16px / 400 |
| Body Small | 13px / 400 | 14px / 400 | 14px / 400 | 14px / 400 |
| Caption | 11px / 400 | 12px / 400 | 12px / 400 | 12px / 400 |
| Label | 13px / 500 | 14px / 500 | 14px / 500 | 14px / 500 |
| Number Large | 28px / 700 | 32px / 700 | 34px / 700 | 36px / 700 |
| Number Medium | 20px / 700 | 22px / 700 | 24px / 700 | 24px / 700 |
| CTA Text | 16px / 700 | 16px / 700 | 18px / 700 | 18px / 700 |

### Implementation (Tailwind + Clamp)

```css
/* Fluid typography using clamp() */
.text-hero {
  font-size: clamp(2rem, 5vw + 1rem, 3rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 700;
}

.text-section-heading {
  font-size: clamp(1.5rem, 3vw + 0.5rem, 1.875rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-weight: 700;
}

.text-number-lg {
  font-size: clamp(1.75rem, 4vw + 0.5rem, 2.25rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
```

### Input Font Size (Critical for iOS)

```css
/* IMPORTANT: iOS auto-zooms inputs with font-size < 16px */
input, select, textarea {
  font-size: 16px; /* Minimum to prevent iOS zoom */
}

/* Only reduce on desktop where zoom isn't an issue */
@media (min-width: 1024px) {
  input, select, textarea {
    font-size: 15px;
  }
}
```

---

## 5. Mobile Form UX Specifications

### Input Field Behavior

| Specification | Value | Reason |
|---------------|-------|--------|
| Font size | 16px | Prevents iOS auto-zoom |
| Height | 48px | Touch-friendly |
| Border radius | 8px | Modern, approachable |
| Padding | 12px 16px | Comfortable text spacing |
| Label position | Above field | Clearer on mobile |
| Error position | Below field | Immediate feedback |
| Keyboard type | Contextual | Reduces input effort |

### Keyboard Optimization

```html
<!-- EMI input — numeric keyboard -->
<input type="number" inputMode="decimal" pattern="[0-9]*" />

<!-- Interest rate — decimal keyboard -->
<input type="number" inputMode="decimal" step="0.01" />

<!-- Phone number — phone pad -->
<input type="tel" inputMode="tel" pattern="[6-9][0-9]{9}" maxLength={10} />

<!-- Name — default keyboard with autocapitalize -->
<input type="text" autoCapitalize="words" autoComplete="name" />

<!-- City — default keyboard -->
<input type="text" autoCapitalize="words" autoComplete="address-level2" />
```

### Form Scroll Behavior

```typescript
// Scroll input into view when keyboard opens
function handleInputFocus(e: FocusEvent) {
  setTimeout(() => {
    (e.target as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, 300); // Delay for keyboard animation
}
```

### Form Validation Display

```
┌─ Field: Valid ─────────────────────────┐
│                                        │
│  Outstanding Amount             ✓     │
│  ┌──────────────────────────────────┐  │
│  │ ₹  8,00,000                     │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘

┌─ Field: Error ─────────────────────────┐
│                                        │
│  Current Interest Rate                 │
│  ┌──────────────────────────────────┐  │
│  │     35              [RED BORDER] │  │
│  └──────────────────────────────────┘  │
│  ⚠ Rate must not exceed 30%           │
│                                        │
└────────────────────────────────────────┘
```

### Progressive Form Disclosure (Mobile)

On mobile (< 768px), consider showing fields progressively:

```
State 1: Only EMI field visible
  → User fills EMI
State 2: Outstanding Amount appears (animated)
  → User fills amount
State 3: Interest Rate appears
  → User fills rate
State 4: Tenure fields appear (2-col)
  → User fills tenure
State 5: CTA appears with micro-animation
```

**Benefit:** Reduces cognitive load, increases completion rate on mobile.

---


## 6. Mobile Navigation & Header

### Mobile Header (56px)

```
┌─────────────────────────────────────┐
│  16px │[M] MotoFin│      │☎│  16px │
│       │           │      │  │       │
└─────────────────────────────────────┘
   ↕ 56px height
   Logo: 32x32 icon + "MotoFin" text
   Support: 44x44 tap target (icon only on mobile)
```

### Scroll-Triggered Sticky CTA

When user scrolls past the hero CTA on mobile, show a sticky mini-CTA in the header:

```
┌─────────────────────────────────────┐
│  [M] MotoFin    [Check Savings ▸]   │  ← Appears on scroll > 400px
└─────────────────────────────────────┘
```

**Animation:** Slide down from top (200ms ease-out)  
**Dismiss:** Auto-hides when calculator section is in viewport

### Bottom Navigation (Not Used)

We deliberately avoid bottom navigation tabs because:
- Single-page flow doesn't need tab navigation
- CTA placement in bottom zone is more effective
- Reduces complexity and distraction

### Back Button Behavior

```
Step 2+ shows back arrow:
┌─────────────────────────────────────┐
│  ← Back    Step 2 of 4              │
└─────────────────────────────────────┘

Tap "Back":
- Smooth transition to previous step
- Form data preserved
- No confirmation needed (data is saved in state)
```

---

## 7. Responsive Component Specifications

### Hero Section

```css
/* Mobile (360px) — base */
.hero {
  padding: 56px 16px 80px;  /* Account for fixed header */
  text-align: center;
}

.hero__headline {
  font-size: 32px;
  line-height: 1.15;
  margin-bottom: 12px;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}

.hero__subheadline {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 24px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.hero__cta-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Large mobile (412px) */
@media (min-width: 412px) {
  .hero__headline { font-size: 34px; max-width: 320px; }
  .hero__subheadline { font-size: 16px; }
}

/* Tablet (768px) */
@media (min-width: 768px) {
  .hero {
    padding: 80px 24px 120px;
  }
  .hero__headline { font-size: 40px; max-width: 500px; }
  .hero__subheadline { font-size: 18px; max-width: 450px; }
  .hero__cta-group {
    flex-direction: row;
    justify-content: center;
  }
}

/* Desktop (1024px) */
@media (min-width: 1024px) {
  .hero {
    padding: 100px 32px 140px;
  }
  .hero__headline { font-size: 48px; max-width: 600px; }
  .hero__subheadline { font-size: 20px; max-width: 520px; }
}
```

### Bank Logo Bar

```css
/* Mobile — horizontal scroll */
.bank-logos {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 20px;
  padding: 0 16px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.bank-logos::-webkit-scrollbar { display: none; }
.bank-logos__item {
  flex-shrink: 0;
  scroll-snap-align: center;
  height: 32px;
}

/* Tablet+ — centered flex, no scroll */
@media (min-width: 768px) {
  .bank-logos {
    overflow: visible;
    justify-content: center;
    gap: 32px;
    padding: 0;
  }
  .bank-logos__item {
    height: 40px;
  }
}
```

### Benefits Cards

```css
/* Mobile — stacked single column */
.benefits-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px;
}

/* Tablet — 2x2 grid */
@media (min-width: 768px) {
  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    max-width: 640px;
    margin: 0 auto;
  }
}

/* Desktop — 3+1 grid (3 top, 1 centered bottom) */
@media (min-width: 1024px) {
  .benefits-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 900px;
  }
  .benefits-grid__item:last-child {
    grid-column: 2;
  }
}
```

### FAQ Accordion

```css
/* Mobile — full width, generous touch targets */
.faq-item {
  border-bottom: 1px solid #E2E8F0;
}
.faq-item__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
  min-height: 56px;
  text-align: left;
  font-size: 15px;
  font-weight: 500;
}
.faq-item__content {
  padding: 0 0 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
}

/* Tablet+ */
@media (min-width: 768px) {
  .faq-item__trigger {
    font-size: 16px;
    padding: 20px 0;
  }
  .faq-item__content {
    font-size: 15px;
    max-width: 90%;
  }
}
```

---


## 8. Mobile Performance Optimization

### Critical Rendering Path

```
┌─────────────────────────────────────────────────┐
│ 1. HTML (SSR) — Includes above-fold content     │  < 50KB
│ 2. Critical CSS (inline) — Hero + form styles   │  < 10KB
│ 3. Inter font (preload, swap)                   │  < 40KB
│ 4. Hero + form render (LCP element)             │  ← TARGET: < 2.0s
│ 5. Main JS bundle (hydration)                   │  < 80KB gzip
│ 6. Below-fold CSS + JS (lazy)                   │  Deferred
└─────────────────────────────────────────────────┘
```

### Mobile Network Conditions

| Network | Speed | Strategy |
|---------|-------|----------|
| 4G (good) | 10+ Mbps | Full experience |
| 4G (poor) | 2-5 Mbps | Reduce animations, defer non-critical |
| 3G | 0.5-2 Mbps | Skeleton loaders, minimal JS |
| 2G | < 0.5 Mbps | Server-rendered HTML, no JS needed for viewing |

### Image Strategy (Mobile)

```typescript
// No hero images — use CSS gradients and patterns
// Bank logos: SVG (inline) or optimized PNG sprite

// If images are needed in future:
import Image from 'next/image';

<Image
  src="/bank-logos/hdfc.svg"
  width={80}
  height={32}
  alt="HDFC Bank"
  loading="lazy"                    // Below fold
  sizes="80px"                      // Exact size known
  placeholder="blur"               // For raster images
  blurDataURL="data:image/..."     // 10x10 pixel blur
/>
```

### Bundle Size Budget (Mobile)

| Chunk | Max Size (gzip) | Contents |
|-------|----------------|----------|
| Initial JS | 80KB | React, Next.js runtime, page shell |
| Calculator chunk | 30KB | Form logic, validation, API client |
| Results chunk | 25KB | Animated counter, gauge, bank list |
| Lead capture chunk | 15KB | Lead form, success screen |
| Below-fold chunk | 20KB | Benefits, FAQ, How it works |
| Analytics | 10KB | GTM, event tracking |
| **Total** | **180KB** | Full page experience |

### Lazy Loading Strategy

```typescript
import dynamic from 'next/dynamic';

// Load results components only when needed
const SavingsResult = dynamic(() => import('@/components/calculator/SavingsResult'), {
  loading: () => <ResultsSkeleton />,
});

const PreApprovalCard = dynamic(() => import('@/components/calculator/PreApprovalCard'), {
  loading: () => <PreApprovalSkeleton />,
});

// Below-fold sections — load on intersection
const BenefitsSection = dynamic(() => import('@/components/sections/Benefits'), {
  ssr: true,  // Still SSR for SEO
});

const FAQSection = dynamic(() => import('@/components/sections/FAQ'), {
  ssr: true,
});
```

---

## 9. Mobile-Specific UX Patterns

### Scroll Position Management

```typescript
// Save scroll position when navigating between steps
const scrollPositions = useRef<Record<string, number>>({});

function onStepChange(newStep: Step) {
  // Save current scroll
  scrollPositions.current[currentStep] = window.scrollY;
  
  // Navigate
  setStep(newStep);
  
  // Scroll to top of calculator card
  calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
```

### Safe Area Handling (Notch Devices)

```css
/* Support iPhone notch and Android cutouts */
:root {
  --safe-area-top: env(safe-area-inset-top);
  --safe-area-bottom: env(safe-area-inset-bottom);
  --safe-area-left: env(safe-area-inset-left);
  --safe-area-right: env(safe-area-inset-right);
}

.header {
  padding-top: max(12px, var(--safe-area-top));
}

.sticky-cta {
  padding-bottom: max(16px, var(--safe-area-bottom));
}

/* Full-bleed sections */
.hero {
  padding-left: max(16px, var(--safe-area-left));
  padding-right: max(16px, var(--safe-area-right));
}
```

### Viewport Height Handling

```css
/* Use dvh for true viewport height (accounts for mobile browser chrome) */
.hero {
  min-height: 100dvh;
  min-height: calc(100vh - 56px); /* Fallback */
}

/* Prevent overscroll bounce on iOS */
html {
  overscroll-behavior: none;
}

/* Prevent pull-to-refresh during form interaction */
body.form-active {
  overscroll-behavior-y: contain;
}
```

### Orientation Handling

```css
/* Landscape phones — reduce hero height, adjust layout */
@media (orientation: landscape) and (max-height: 500px) {
  .hero {
    min-height: auto;
    padding: 32px 16px 48px;
  }
  .hero__headline {
    font-size: 28px;
  }
  .hero__cta-group {
    flex-direction: row;
  }
}
```

---

## 10. Mobile Animation Performance

### GPU-Accelerated Properties Only

```css
/* ONLY animate these properties (GPU-composited): */
.animate-safe {
  transition-property: transform, opacity;
  will-change: transform, opacity;
}

/* NEVER animate these on mobile: */
/* ✗ width, height, top, left, right, bottom */
/* ✗ padding, margin */
/* ✗ border-radius (during animation) */
/* ✗ box-shadow (during animation) */
```

### Mobile Animation Adjustments

```css
/* Reduce animation duration on mobile for snappier feel */
@media (max-width: 767px) {
  :root {
    --duration-fast: 80ms;
    --duration-normal: 150ms;
    --duration-slow: 250ms;
    --duration-counter: 800ms;   /* Shorter on mobile */
  }
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Intersection Observer for Scroll Animations

```typescript
// Animate elements only when they enter viewport
function useScrollAnimation() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animate once only
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Usage
function BenefitCard({ title, description }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      ...
    </div>
  );
}
```

---


## 11. Mobile Loading States

### Skeleton Screen (Calculator Results)

```
┌────────────────────────────────────┐
│                                    │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (title)          │
│                                    │
│  ┌──────────┐  ┌──────────┐       │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │       │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │       │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │       │
│  └──────────┘  └──────────┘       │
│                                    │
│  ░░░░░░░░░░░░░░░░░░░░ (top-up)   │
│                                    │
│  ▓▓▓▓▓▓▓▓ (subtitle)              │
│  ┌────────────────────────────┐    │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│  └────────────────────────────┘    │
│  ┌────────────────────────────┐    │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│  └────────────────────────────┘    │
│                                    │
└────────────────────────────────────┘
    ░ = Shimmer animation (light pulse)
    ▓ = Static gray placeholder
```

### Loading Duration Thresholds

| Duration | UX Pattern |
|----------|------------|
| < 300ms | No loading indicator (feels instant) |
| 300ms - 1s | Subtle inline spinner on CTA button |
| 1s - 3s | Skeleton screen replaces content area |
| 3s - 10s | Skeleton + "Calculating..." message |
| > 10s | Error state with retry button |

### Button Loading State

```
Default:       [ Check My Savings → ]
Loading:       [ ⟳ Calculating...   ]  (spinner + text change)
Success:       [ ✓ Done!            ]  (brief flash, then transition)
Error:         [ ✗ Try Again        ]  (red accent, shake)
```

---

## 12. Responsive Spacing Scale

### Adaptive Spacing

| Token | Mobile (360px) | Large Mobile (412px) | Tablet (768px) | Desktop (1024px) |
|-------|----------------|---------------------|----------------|-------------------|
| Section gap | 48px | 56px | 64px | 80px |
| Card padding | 20px | 24px | 28px | 32px |
| Form field gap | 16px | 18px | 20px | 20px |
| Hero → content | -48px (overlap) | -48px | -64px | -80px |
| Page margins | 16px | 16px | 24px | 32px |
| Between cards | 16px | 16px | 20px | 24px |

### Tailwind Implementation

```typescript
// Responsive spacing utilities
className="
  p-5 sm:p-6 md:p-7 lg:p-8          // Card padding
  space-y-4 sm:space-y-5 md:space-y-5 // Form gaps
  py-12 sm:py-14 md:py-16 lg:py-20    // Section padding
  px-4 md:px-6 lg:px-8                // Page margins
  gap-3 sm:gap-4 md:gap-5             // Grid gaps
  -mt-12 md:-mt-16 lg:-mt-20          // Hero overlap
"
```

---

## 13. Mobile Testing Checklist

### Device Testing Matrix

| Test | Samsung A14 (360px) | iPhone 14 (390px) | Pixel 7 (412px) | iPad (768px) |
|------|--------------------|--------------------|------------------|--------------|
| Hero CTA visible without scroll | ☐ | ☐ | ☐ | ☐ |
| Form fields don't cause zoom | ☐ | ☐ | ☐ | ☐ |
| Touch targets ≥ 44px | ☐ | ☐ | ☐ | ☐ |
| No horizontal overflow | ☐ | ☐ | ☐ | ☐ |
| Keyboard doesn't obscure fields | ☐ | ☐ | ☐ | ☐ |
| Results readable without zoom | ☐ | ☐ | ☐ | ☐ |
| CTA in thumb zone | ☐ | ☐ | ☐ | ☐ |
| Animations smooth (60fps) | ☐ | ☐ | ☐ | ☐ |
| Loading states visible | ☐ | ☐ | ☐ | ☐ |
| Error messages visible | ☐ | ☐ | ☐ | ☐ |
| Safe area respected (notch) | — | ☐ | — | — |
| Landscape usable | ☐ | ☐ | ☐ | ☐ |

### Performance Testing

| Metric | Target | Tool |
|--------|--------|------|
| LCP (mobile 4G) | < 2.0s | Lighthouse, WebPageTest |
| FID/INP (mobile) | < 200ms | Chrome UX Report |
| CLS (mobile) | < 0.05 | Lighthouse |
| Total page weight | < 300KB | DevTools Network |
| Time to Interactive | < 3.0s | Lighthouse |
| JS execution time | < 2.0s | DevTools Performance |

### Accessibility Testing (Mobile)

| Test | Method |
|------|--------|
| VoiceOver (iOS) navigation | Manual with iPhone |
| TalkBack (Android) navigation | Manual with Android |
| Keyboard-only navigation | External keyboard on tablet |
| Zoom to 200% | Pinch zoom + verify no overlap |
| High contrast mode | System settings |
| Large text mode | System font scale 1.5x |
| Reduced motion | System preference |

---

## 14. Mobile-Specific Edge Cases

### Handling Keyboard Open State

```typescript
// Detect virtual keyboard on mobile
function useKeyboardOpen() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const threshold = 150;
    let prevHeight = window.innerHeight;

    const observer = new ResizeObserver(() => {
      const diff = prevHeight - window.visualViewport!.height;
      setIsOpen(diff > threshold);
    });

    if (window.visualViewport) {
      observer.observe(document.documentElement);
    }

    return () => observer.disconnect();
  }, []);

  return isOpen;
}

// Usage: Hide sticky elements when keyboard is open
const keyboardOpen = useKeyboardOpen();
// {!keyboardOpen && <StickyCtaBar />}
```

### Network Error Handling (Mobile)

```typescript
// Detect offline state
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Show offline banner
{!isOnline && (
  <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 text-sm z-[100]">
    You're offline. Results will load when connected.
  </div>
)}
```

### Small Screen Adjustments (320px)

```css
/* Ultra-small screens (older devices, SE) */
@media (max-width: 359px) {
  .hero__headline {
    font-size: 28px;
  }
  .metrics-grid {
    grid-template-columns: 1fr;  /* Stack vertically */
  }
  .calculator-card {
    padding: 16px;
    margin: -40px 12px 0;
  }
  .bank-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
```

---

## 15. Implementation Priority

### Phase 1 — Mobile Core
- [ ] Set up mobile-first breakpoints in Tailwind config
- [ ] Implement safe area handling (CSS env())
- [ ] Configure viewport meta tag correctly
- [ ] Set input font-size to 16px (prevent iOS zoom)
- [ ] Implement touch targets ≥ 44px for all interactive elements
- [ ] Set up container with responsive padding
- [ ] Test hero CTA visibility on 360px without scroll

### Phase 2 — Mobile UX
- [ ] Implement keyboard-aware scroll behavior
- [ ] Add proper inputMode attributes to all form fields
- [ ] Create skeleton loading states
- [ ] Implement scroll-triggered header CTA
- [ ] Add online/offline detection
- [ ] Configure reduced-motion media query
- [ ] Test on physical devices (Samsung A14, iPhone 14)

### Phase 3 — Performance
- [ ] Set up code splitting (dynamic imports per step)
- [ ] Configure font loading (swap, preload)
- [ ] Implement intersection observer for below-fold content
- [ ] Set up performance budget in CI
- [ ] Achieve < 2s LCP on 4G mobile
- [ ] Achieve < 0.05 CLS
- [ ] Verify 60fps animations on mid-range Android

### Phase 4 — Polish
- [ ] Add progressive form disclosure (mobile)
- [ ] Implement exit intent handling (mobile back button)
- [ ] Add share functionality (Web Share API)
- [ ] Test landscape orientation
- [ ] Test with system font scaling (1.5x, 2x)
- [ ] Full accessibility audit with VoiceOver/TalkBack
