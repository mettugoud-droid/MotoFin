# MotoFin Design System

## Conversion-First Premium Fintech Design System

**Version:** 2.0  
**Last Updated:** June 2026  
**Company:** MotoFin Technologies  
**Theme:** Premium Fintech — Not corporate. Not template-based. Not generic SaaS.

---

## 1. Design Philosophy

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Mobile-First** | Design for 360px → 390px → 412px before desktop |
| **Conversion-First** | Every element earns its place by driving calculator completions and lead captures |
| **Premium Fintech** | Inspired by CRED, Jupiter, Groww — sophisticated, trustworthy, modern |
| **Speed** | LCP < 2s, CLS < 0.05, INP < 200ms — performance is a design decision |
| **Clarity** | Users understand Current EMI, Monthly Savings, Top-Up, Approval Probability within 3 seconds |

### Anti-Patterns (What We Are NOT)

- Generic SaaS landing pages with stock photos
- Corporate banking with navy blue headers and serif fonts
- Template-based designs with generic card grids
- Cluttered dashboards with too many numbers
- Over-animated interfaces that slow perception

---

## 2. Brand Identity

### Brand Attributes

| Attribute | Expression |
|-----------|------------|
| Premium | Dark backgrounds, generous whitespace, restrained palette |
| Trustworthy | Bank logos, security badges, real numbers, disclaimers |
| Fast | Instant feedback, animated counters, skeleton loaders |
| Modern | Clean typography, subtle gradients, micro-interactions |
| Financial | Tabular numerals, precise formatting, currency symbols |
| Mobile-First | Touch-optimized, thumb-zone CTA placement, swipeable cards |

---


## 3. Color System

### Primary Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `--color-primary` | `#0F172A` | 222 47% 11% | Primary text, dark backgrounds, headers |
| `--color-secondary` | `#1E293B` | 217 33% 17% | Secondary backgrounds, card headers |
| `--color-accent` | `#22C55E` | 142 71% 45% | Success states, savings numbers, CTAs |
| `--color-highlight` | `#3B82F6` | 217 91% 60% | Links, interactive elements, progress |
| `--color-success` | `#10B981` | 160 84% 39% | Confirmations, approval indicators |
| `--color-warning` | `#F59E0B` | 38 92% 50% | Caution states, moderate confidence |
| `--color-background` | `#F8FAFC` | 210 40% 98% | Page background |
| `--color-surface` | `#FFFFFF` | 0 0% 100% | Card surfaces |

### Extended Palette

```
Slate Scale (Neutrals):
  50:  #F8FAFC    — Page background
  100: #F1F5F9    — Section backgrounds
  200: #E2E8F0    — Borders, dividers
  300: #CBD5E1    — Disabled states
  400: #94A3B8    — Placeholder text
  500: #64748B    — Secondary text
  600: #475569    — Body text
  700: #334155    — Strong text
  800: #1E293B    — Headers
  900: #0F172A    — Primary text

Green Scale (Success/Savings):
  50:  #F0FDF4    — Savings card background
  100: #DCFCE7    — Success badge background
  200: #BBF7D0    — Subtle success borders
  400: #4ADE80    — Savings accent
  500: #22C55E    — Primary CTA, savings numbers
  600: #16A34A    — CTA hover
  700: #15803D    — Strong success text

Blue Scale (Trust/Info):
  50:  #EFF6FF    — Info card background
  100: #DBEAFE    — Badge backgrounds
  400: #60A5FA    — Progress indicators
  500: #3B82F6    — Links, highlights
  600: #2563EB    — Link hover, active states
  700: #1D4ED8    — Strong blue text

Purple Scale (Top-Up/Premium):
  50:  #FAF5FF    — Top-up card background
  100: #F3E8FF    — Premium badge background
  500: #A855F7    — Top-up amount accent
  600: #9333EA    — Premium feature highlight
```

### Semantic Color Tokens

```css
:root {
  /* Surfaces */
  --surface-page: #F8FAFC;
  --surface-card: #FFFFFF;
  --surface-elevated: #FFFFFF;
  --surface-overlay: rgba(15, 23, 42, 0.6);

  /* Text */
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-tertiary: #64748B;
  --text-disabled: #94A3B8;
  --text-inverse: #FFFFFF;
  --text-link: #3B82F6;
  --text-success: #15803D;
  --text-warning: #92400E;
  --text-error: #B91C1C;

  /* Borders */
  --border-default: #E2E8F0;
  --border-hover: #CBD5E1;
  --border-focus: #3B82F6;
  --border-success: #BBF7D0;
  --border-error: #FECACA;

  /* Interactive */
  --interactive-primary: #22C55E;
  --interactive-primary-hover: #16A34A;
  --interactive-secondary: #3B82F6;
  --interactive-secondary-hover: #2563EB;
  --interactive-disabled: #E2E8F0;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
  --shadow-xl: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06);
  --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-card-hover: 0 10px 25px rgba(15, 23, 42, 0.08), 0 4px 10px rgba(15, 23, 42, 0.04);
}
```

---


## 4. Typography

### Font Stack

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display-lg` | 48px / 3rem | 700 | 1.1 | -0.02em | Hero headline (desktop) |
| `display-md` | 36px / 2.25rem | 700 | 1.15 | -0.02em | Hero headline (mobile) |
| `display-sm` | 30px / 1.875rem | 700 | 1.2 | -0.01em | Section headlines |
| `heading-lg` | 24px / 1.5rem | 600 | 1.3 | -0.01em | Card titles |
| `heading-md` | 20px / 1.25rem | 600 | 1.4 | 0 | Sub-section titles |
| `heading-sm` | 18px / 1.125rem | 600 | 1.4 | 0 | Small headings |
| `body-lg` | 18px / 1.125rem | 400 | 1.6 | 0 | Lead paragraphs |
| `body-md` | 16px / 1rem | 400 | 1.6 | 0 | Body text |
| `body-sm` | 14px / 0.875rem | 400 | 1.5 | 0 | Secondary text, captions |
| `caption` | 12px / 0.75rem | 400 | 1.4 | 0.01em | Labels, disclaimers |
| `number-lg` | 36px / 2.25rem | 700 | 1.1 | -0.02em | Large financial numbers |
| `number-md` | 24px / 1.5rem | 700 | 1.2 | -0.01em | Medium financial numbers |
| `number-sm` | 18px / 1.125rem | 600 | 1.3 | 0 | Small financial numbers |

### Financial Number Formatting

```css
.financial-number {
  font-family: 'Inter', sans-serif;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1, 'ss01' 1;
  letter-spacing: -0.02em;
}
```

### Font Loading Strategy

```html
<!-- Preload critical font weights -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font-display: swap for performance -->
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

---


## 5. Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0px | Reset |
| `space-1` | 4px | Tight spacing (icon gaps) |
| `space-2` | 8px | Element internal padding |
| `space-3` | 12px | Compact component gaps |
| `space-4` | 16px | Standard component padding |
| `space-5` | 20px | Form field spacing |
| `space-6` | 24px | Card internal padding (mobile) |
| `space-8` | 32px | Card internal padding (desktop) |
| `space-10` | 40px | Section spacing (mobile) |
| `space-12` | 48px | Section spacing |
| `space-16` | 64px | Major section gaps |
| `space-20` | 80px | Hero padding (desktop) |
| `space-24` | 96px | Page-level spacing |

### Layout Spacing

```css
/* Container widths */
--container-sm: 640px;    /* Calculator card max */
--container-md: 768px;    /* Content max width */
--container-lg: 1024px;   /* Wide content */
--container-xl: 1280px;   /* Full layout */

/* Page margins */
--page-margin-mobile: 16px;
--page-margin-tablet: 24px;
--page-margin-desktop: 32px;

/* Card padding */
--card-padding-mobile: 20px;
--card-padding-tablet: 28px;
--card-padding-desktop: 32px;
```

---

## 6. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Badges, small elements |
| `radius-md` | 8px | Input fields, small cards |
| `radius-lg` | 12px | Cards, modal panels |
| `radius-xl` | 16px | Large cards, hero sections |
| `radius-2xl` | 20px | Feature cards |
| `radius-full` | 9999px | Pills, circular elements |

---

## 7. Elevation & Shadows

| Level | Shadow | Usage |
|-------|--------|-------|
| `elevation-0` | none | Flat elements |
| `elevation-1` | `0 1px 3px rgba(15,23,42,0.06)` | Default cards |
| `elevation-2` | `0 4px 12px rgba(15,23,42,0.08)` | Hovered cards, floating elements |
| `elevation-3` | `0 12px 24px rgba(15,23,42,0.1)` | Modals, popovers |
| `elevation-4` | `0 20px 40px rgba(15,23,42,0.12)` | Hero card, primary CTA shadow |

### Card Shadow States

```css
.card {
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
```

---


## 8. Motion & Animation

### Timing Functions

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);
```

### Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `duration-fast` | 100ms | Hover states, focus rings |
| `duration-normal` | 200ms | Transitions, fades |
| `duration-slow` | 300ms | Slide transitions, card reveals |
| `duration-slower` | 500ms | Page transitions, counter animations |
| `duration-counter` | 1200ms | Animated number counters |

### Animation Patterns

```css
/* Fade in and slide up — for card reveals */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Counter animation — for financial numbers */
@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse — for approval probability circle */
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

/* Skeleton shimmer — for loading states */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Progress bar fill */
@keyframes progressFill {
  from { width: 0%; }
  to { width: var(--progress-width); }
}

/* Success checkmark */
@keyframes checkDraw {
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Iconography

### Icon System

- **Library:** Lucide React (consistent, lightweight)
- **Size Scale:** 16px, 20px, 24px, 32px
- **Stroke Width:** 1.5px (default), 2px (emphasis)
- **Color:** Inherits from parent text color

### Key Icons

| Context | Icon | Size |
|---------|------|------|
| Navigation Back | `ChevronLeft` | 20px |
| Calculator | `Calculator` | 24px |
| Savings/Money | `TrendingDown` | 24px |
| Approval | `ShieldCheck` | 24px |
| Phone/Callback | `Phone` | 20px |
| Success | `CheckCircle` | 32px |
| Bank | `Building2` | 20px |
| Lock/Security | `Lock` | 16px |
| Info | `Info` | 16px |
| Warning | `AlertTriangle` | 16px |
| Top-Up | `Plus` | 20px |
| Rate | `Percent` | 20px |

---


## 10. Grid & Layout

### Breakpoints

| Token | Width | Target |
|-------|-------|--------|
| `mobile-sm` | 360px | Small Android phones |
| `mobile-md` | 390px | iPhone 14/15, standard Android |
| `mobile-lg` | 412px | Large Android phones |
| `tablet` | 768px | iPad, tablets |
| `desktop` | 1024px | Small laptops |
| `desktop-lg` | 1280px | Standard desktops |

### Grid System

```css
/* Mobile: Single column */
.grid-mobile {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 0 16px;
}

/* Tablet: 2-column for metric cards */
.grid-tablet {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* Desktop: Centered content with max-width */
.grid-desktop {
  display: grid;
  grid-template-columns: 1fr min(640px, 100%) 1fr;
  gap: 0;
}
```

### Content Layout Pattern

```
┌──────────────────────────────────────────────┐
│              Navigation (sticky)              │
├──────────────────────────────────────────────┤
│                                              │
│              Hero Section                    │
│              (full-width bg)                 │
│                                              │
├──────────────────────────────────────────────┤
│     ┌────────────────────────────────┐       │
│     │                                │       │
│     │        Calculator Card         │       │
│     │        (max-w: 640px)          │       │
│     │                                │       │
│     └────────────────────────────────┘       │
├──────────────────────────────────────────────┤
│              Trust Bar                       │
├──────────────────────────────────────────────┤
│              Footer                          │
└──────────────────────────────────────────────┘
```

---

## 11. Trust Signals System

### Bank Partner Logos

Display logos from authorized banking partners:

| Bank | Logo Style | Priority |
|------|-----------|----------|
| HDFC Bank | Monochrome on white | 1 |
| ICICI Bank | Monochrome on white | 2 |
| Axis Bank | Monochrome on white | 3 |
| Kotak Mahindra | Monochrome on white | 4 |
| IndusInd Bank | Monochrome on white | 5 |
| AU Small Finance | Monochrome on white | 6 |

### Logo Display Rules

- Use monochrome (grayscale) versions for subtle, premium feel
- On hover/focus: transition to full-color variant
- Size: 40px height, maintain aspect ratio
- Spacing: 24px between logos
- Container: Horizontal scroll on mobile, grid on desktop

### Security Badges

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 🔒 SSL      │  │ 🛡️ Data     │  │ 🔐 256-bit  │
│ Secured     │  │ Privacy     │  │ Encrypted   │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Trust Copy Patterns

- "9+ Partner Banks"
- "50,000+ Happy Customers"
- "Average ₹3,200/month Saved"
- "256-bit Bank-Grade Encryption"
- "Your data is never shared without consent"
- "RBI registered NBFC partners"

---


## 12. Component Design Tokens (Tailwind Config)

### Updated Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0F172A',
          secondary: '#1E293B',
          accent: '#22C55E',
          highlight: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
        },
        surface: {
          page: '#F8FAFC',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'number-lg': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'number-md': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
        'input': '8px',
        'badge': '6px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px rgba(15, 23, 42, 0.08), 0 4px 10px rgba(15, 23, 42, 0.04)',
        'card-xl': '0 20px 40px rgba(15, 23, 42, 0.1), 0 8px 16px rgba(15, 23, 42, 0.06)',
        'cta': '0 4px 14px rgba(34, 197, 94, 0.3)',
        'cta-hover': '0 6px 20px rgba(34, 197, 94, 0.4)',
        'input-focus': '0 0 0 3px rgba(59, 130, 246, 0.15)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'count-up': 'countUp 0.3s ease-out',
        'pulse-ring': 'pulse-ring 2s infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'progress-fill': 'progressFill 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 13. Accessibility Standards

### WCAG AA Compliance

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Color Contrast | 4.5:1 (text), 3:1 (large text) | All text/background combinations verified |
| Focus Indicators | Visible, 2px minimum | Blue ring with offset: `ring-2 ring-offset-2 ring-blue-500` |
| Touch Targets | 44x44px minimum | All buttons, links, form controls |
| Keyboard Navigation | Full tab order | Sequential, logical, no keyboard traps |
| Screen Reader | ARIA labels | All interactive elements, live regions for updates |
| Reduced Motion | `prefers-reduced-motion` | Animations disabled, transitions minimized |

### Focus Management

```css
/* Visible focus ring for keyboard users */
:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
  border-radius: var(--radius-md);
}

/* Remove focus ring for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### ARIA Patterns

```html
<!-- Progress indicator -->
<div role="progressbar" aria-valuenow="2" aria-valuemin="1" aria-valuemax="4" aria-label="Step 2 of 4: Savings Result">

<!-- Live region for calculation results -->
<div aria-live="polite" aria-atomic="true">
  Your estimated monthly saving is ₹3,200
</div>

<!-- Form errors -->
<input aria-invalid="true" aria-describedby="emi-error">
<p id="emi-error" role="alert">EMI must be at least ₹1</p>
```

---

## 14. Dark Mode (Future Phase)

Reserved tokens for dark mode expansion:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --surface-page: #0F172A;
    --surface-card: #1E293B;
    --text-primary: #F8FAFC;
    --text-secondary: #94A3B8;
    --border-default: #334155;
  }
}
```

---

## 15. Implementation Checklist

- [ ] Configure Inter font with variable weight support
- [ ] Update Tailwind config with new design tokens
- [ ] Implement CSS custom properties for semantic tokens
- [ ] Create base component styles (buttons, inputs, cards)
- [ ] Configure animation keyframes
- [ ] Add accessibility utilities (focus-visible, reduced-motion)
- [ ] Set up color palette in globals.css
- [ ] Configure font-variant-numeric for financial numbers
- [ ] Add skeleton loader utility classes
- [ ] Test all color combinations for WCAG AA contrast
- [ ] Validate touch targets on mobile devices
- [ ] Performance audit: ensure no layout shift from font loading
