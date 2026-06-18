# MotoFin UI Component Library

## Conversion-First Component Specifications

**Version:** 2.0  
**Framework:** React 19 + Next.js 15  
**Styling:** Tailwind CSS with Design System tokens  
**Icons:** Lucide React  
**Forms:** react-hook-form + zod  

---

## Component Architecture

```
src/
├── components/
│   ├── ui/                    # Primitive UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Skeleton.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── ApprovalGauge.tsx
│   │   └── TrustBadge.tsx
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Container.tsx
│   │   └── Section.tsx
│   ├── calculator/            # Calculator flow components
│   │   ├── CalculatorForm.tsx
│   │   ├── SavingsResult.tsx
│   │   ├── PreApprovalCard.tsx
│   │   ├── BankComparisonList.tsx
│   │   └── StepIndicator.tsx
│   ├── lead-capture/          # Lead capture components
│   │   ├── LeadCaptureForm.tsx
│   │   └── SuccessScreen.tsx
│   ├── trust/                 # Trust signal components
│   │   ├── BankLogoBar.tsx
│   │   ├── SecurityBadges.tsx
│   │   └── SocialProof.tsx
│   └── seo/                   # SEO components
│       ├── StructuredData.tsx
│       ├── BreadcrumbSchema.tsx
│       └── FAQSchema.tsx
```

---


## 1. Button Component

### Variants

| Variant | Usage | Background | Text |
|---------|-------|------------|------|
| `primary` | Main CTA — "Check My Savings", "Get Free Callback" | Green-500 → Green-600 | White, Bold |
| `secondary` | Alternate actions — "See Sample Result" | Blue-500 → Blue-600 | White, Bold |
| `outline` | Tertiary — "Back to results" | Transparent | Slate-700, border |
| `ghost` | Minimal — "Calculate Again" | Transparent | Blue-600 |
| `disabled` | Loading/disabled state | Slate-200 | Slate-400 |

### Sizes

| Size | Height | Padding | Font Size | Min-Width |
|------|--------|---------|-----------|-----------|
| `sm` | 36px | 12px 16px | 14px / 500 | 80px |
| `md` | 44px | 12px 20px | 16px / 600 | 120px |
| `lg` | 52px | 16px 24px | 18px / 700 | 160px |
| `xl` | 56px | 16px 32px | 18px / 700 | Full-width |

### Specifications

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### Styling

```tsx
// Primary CTA Button
<button className="
  w-full h-[52px] px-6
  bg-green-500 hover:bg-green-600 active:bg-green-700
  text-white font-bold text-lg
  rounded-xl
  shadow-cta hover:shadow-cta-hover
  transition-all duration-200 ease-default
  disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed
  focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500
  flex items-center justify-center gap-2
">
  {loading ? <Spinner /> : children}
</button>
```

### States

| State | Visual Change |
|-------|--------------|
| Default | Base colors, card shadow |
| Hover | Darker shade, elevated shadow |
| Active/Pressed | Darkest shade, scale(0.98) |
| Focus | Blue ring, 2px offset |
| Loading | Spinner icon, opacity 0.8, disabled pointer |
| Disabled | Slate-200 bg, no shadow, not-allowed cursor |

---

## 2. Input Component

### Variants

| Variant | Usage |
|---------|-------|
| `default` | Standard text/number inputs |
| `currency` | With ₹ prefix adornment |
| `percentage` | With % suffix adornment |
| `phone` | With +91 prefix, 10-digit mask |
| `select` | Dropdown select (city, bank) |

### Specifications

```tsx
interface InputProps {
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'tel' | 'email';
  prefix?: string;          // "₹" for currency
  suffix?: string;          // "%" for rates
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<any>;
  name: string;
}
```

### Styling

```tsx
// Input field with label and error
<div className="space-y-1.5">
  <label className="block text-sm font-medium text-slate-700">
    {label}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
  <div className="relative">
    {prefix && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
        {prefix}
      </span>
    )}
    <input className="
      w-full h-12 px-4 py-3
      bg-white
      border border-slate-200
      rounded-lg
      text-slate-800 text-base placeholder:text-slate-400
      transition-all duration-fast
      hover:border-slate-300
      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:outline-none
      aria-invalid:border-red-400 aria-invalid:ring-red-500/15
      disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
    " />
    {suffix && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
        {suffix}
      </span>
    )}
  </div>
  {error && (
    <p role="alert" className="text-sm text-red-600 flex items-center gap-1">
      <AlertCircle size={14} /> {error}
    </p>
  )}
  {hint && !error && (
    <p className="text-xs text-slate-400">{hint}</p>
  )}
</div>
```

### Dimensions

| Property | Mobile | Desktop |
|----------|--------|---------|
| Height | 48px | 48px |
| Font Size | 16px (prevents iOS zoom) | 16px |
| Padding X | 16px | 16px |
| Border Radius | 8px | 8px |
| Label Size | 14px / 500 | 14px / 500 |
| Error Size | 13px / 400 | 14px / 400 |

---


## 3. Card Component

### Variants

| Variant | Usage | Visual |
|---------|-------|--------|
| `default` | Standard content card | White, shadow-card, rounded-xl |
| `elevated` | Calculator card, results | White, shadow-card-xl, rounded-2xl |
| `metric` | Savings/top-up value | Colored bg (green-50, blue-50), rounded-lg |
| `bank` | Bank comparison row | Subtle bg, border-left accent |
| `success` | Success confirmation | Green border, green-50 bg |
| `premium` | Pre-approval card | Gradient border (green), elevated |

### Specifications

```tsx
interface CardProps {
  variant: 'default' | 'elevated' | 'metric' | 'bank' | 'success' | 'premium';
  padding?: 'sm' | 'md' | 'lg';
  animate?: boolean;          // Fade-in-up on mount
  children: React.ReactNode;
  className?: string;
}
```

### Styling

```tsx
// Elevated Calculator Card
<div className="
  bg-white
  rounded-2xl
  shadow-card-xl
  p-6 md:p-8
  animate-fade-in-up
  border border-slate-100
">
  {children}
</div>

// Metric Card (Savings)
<div className="
  bg-green-50
  rounded-xl
  p-5
  border border-green-100
  text-center
">
  <p className="text-sm font-medium text-green-600 mb-1">{label}</p>
  <p className="text-number-lg text-green-700 font-bold tabular-nums">
    ₹{value.toLocaleString('en-IN')}
  </p>
</div>

// Premium Pre-Approval Card
<div className="
  relative
  bg-white
  rounded-2xl
  shadow-card-xl
  p-6 md:p-8
  border-2 border-green-200
  overflow-hidden
  before:absolute before:top-0 before:left-0 before:right-0 before:h-1
  before:bg-gradient-to-r before:from-green-400 before:to-emerald-500
">
  {children}
</div>
```

---

## 4. Step Indicator / Progress Bar

### Design

```
Step 1          Step 2          Step 3          Step 4
[●]─────────────[●]─────────────[○]─────────────[○]
Loan Details    Savings         Pre-Approval    Callback
```

### Specifications

```tsx
interface StepIndicatorProps {
  steps: { id: string; label: string }[];
  currentStep: number;    // 0-indexed
  completedSteps: number[];
}
```

### Styling

```tsx
<div className="flex items-center justify-between mb-8" role="progressbar" 
     aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={4}>
  {steps.map((step, index) => (
    <div key={step.id} className="flex items-center flex-1">
      {/* Step Circle */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
        transition-all duration-300
        ${index <= currentStep 
          ? 'bg-green-500 text-white shadow-sm' 
          : 'bg-slate-100 text-slate-400 border border-slate-200'}
      `}>
        {index < currentStep ? <Check size={16} /> : index + 1}
      </div>
      {/* Connector Line */}
      {index < steps.length - 1 && (
        <div className="flex-1 h-0.5 mx-2">
          <div className={`h-full rounded-full transition-all duration-500 ${
            index < currentStep ? 'bg-green-500' : 'bg-slate-200'
          }`} />
        </div>
      )}
    </div>
  ))}
</div>
```

### Mobile Adaptation

On mobile (< 412px), use compact version:
- Show only current step label
- Use thin progress bar instead of circles
- Display "Step X of 4" text below

```tsx
// Mobile Progress Bar
<div className="md:hidden mb-6">
  <div className="flex justify-between items-center mb-2">
    <span className="text-sm font-medium text-slate-600">
      Step {currentStep + 1} of {totalSteps}
    </span>
    <span className="text-sm text-slate-400">{currentStepLabel}</span>
  </div>
  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
    <div 
      className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
    />
  </div>
</div>
```

---


## 5. Animated Counter Component

### Purpose

Displays financial numbers with a smooth count-up animation from 0 to target value. Creates a premium "reveal" moment for savings results.

### Specifications

```tsx
interface AnimatedCounterProps {
  value: number;
  prefix?: string;           // "₹"
  suffix?: string;           // "/mo"
  duration?: number;         // ms, default 1200
  format?: 'currency' | 'percentage' | 'number';
  locale?: string;           // default 'en-IN'
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'purple' | 'slate';
  startOnView?: boolean;     // Trigger when in viewport
}
```

### Implementation Pattern

```tsx
function AnimatedCounter({ value, prefix = '₹', duration = 1200, format = 'currency' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="font-bold tabular-nums tracking-tight">
      {prefix}{displayValue.toLocaleString('en-IN')}
    </span>
  );
}
```

### Size Variants

| Size | Class | Example Usage |
|------|-------|---------------|
| `sm` | `text-lg font-semibold` | Bank row savings |
| `md` | `text-2xl font-bold` | Metric card values |
| `lg` | `text-4xl font-bold` | Hero savings number |

---

## 6. Approval Gauge Component

### Purpose

Circular gauge displaying approval probability (0-100%). Core conversion element that dominates the pre-approval screen.

### Specifications

```tsx
interface ApprovalGaugeProps {
  probability: number;       // 0-100
  confidenceLevel: 'HIGH' | 'MODERATE' | 'SUBJECT_TO_VERIFICATION';
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

### Visual Design

```
        ╭─────────╮
      ╱   ╭─────╮   ╲
     │   │ 87%  │   │
     │   │      │   │
      ╲   ╰─────╯   ╱
        ╰─────────╯
     High Approval Chance
```

### Implementation

```tsx
function ApprovalGauge({ probability, confidenceLevel, size = 'lg' }) {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (probability / 100) * circumference;
  
  const colorMap = {
    HIGH: { stroke: '#22C55E', bg: '#F0FDF4', text: '#15803D' },
    MODERATE: { stroke: '#F59E0B', bg: '#FFFBEB', text: '#92400E' },
    SUBJECT_TO_VERIFICATION: { stroke: '#F97316', bg: '#FFF7ED', text: '#9A3412' },
  };
  
  const colors = colorMap[confidenceLevel];
  const sizeMap = { sm: 80, md: 120, lg: 160 };
  const dimension = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg className="transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" 
                  stroke="#E2E8F0" strokeWidth="8" />
          {/* Progress circle */}
          <circle cx="50" cy="50" r="45" fill="none"
                  stroke={colors.stroke} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out" />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums" style={{ color: colors.text }}>
            {probability}%
          </span>
        </div>
      </div>
      {/* Confidence badge */}
      <span className={`px-3 py-1 rounded-full text-sm font-medium`}
            style={{ backgroundColor: colors.bg, color: colors.text }}>
        {confidenceLevel === 'HIGH' && '✓ High Chance'}
        {confidenceLevel === 'MODERATE' && '◐ Moderate Chance'}
        {confidenceLevel === 'SUBJECT_TO_VERIFICATION' && '○ Subject to Verification'}
      </span>
    </div>
  );
}
```

### Interaction

- On mount: Animate from 0% to target value over 1.2s
- Pulse animation on HIGH confidence level
- Hover: Subtle scale(1.02)

---

## 7. Bank Comparison Card

### Purpose

Displays individual bank offer in a ranked list. First item gets "Best Rate" badge.

### Specifications

```tsx
interface BankComparisonCardProps {
  bank: {
    bankName: string;
    offeredRate: number;
    estimatedEmi: number;
    monthlySaving: number;
    totalSaving: number;
  };
  rank: number;            // 1-based
  isBest: boolean;
}
```

### Styling

```tsx
// Bank comparison row
<div className={`
  relative flex items-center justify-between 
  p-4 rounded-xl
  transition-all duration-200
  ${isBest 
    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm' 
    : 'bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-sm'}
`}>
  {isBest && (
    <span className="absolute -top-2.5 left-4 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
      Best Rate
    </span>
  )}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
      <Building2 size={20} className="text-slate-600" />
    </div>
    <div>
      <p className="font-semibold text-slate-800">{bank.bankName}</p>
      <p className="text-sm text-slate-500">
        {bank.offeredRate}% p.a. · EMI ₹{bank.estimatedEmi.toLocaleString('en-IN')}
      </p>
    </div>
  </div>
  <div className="text-right">
    <p className="text-green-600 font-bold text-lg tabular-nums">
      ₹{bank.monthlySaving.toLocaleString('en-IN')}
    </p>
    <p className="text-xs text-slate-400">saved/month</p>
  </div>
</div>
```

---


## 8. Skeleton Loader Component

### Purpose

Shows placeholder UI while data is loading. Creates perceived performance and prevents layout shift.

### Specifications

```tsx
interface SkeletonProps {
  variant: 'text' | 'number' | 'card' | 'circle' | 'button' | 'input';
  width?: string;
  height?: string;
  lines?: number;         // For text variant
}
```

### Styling

```tsx
function Skeleton({ variant, width, height, lines = 1 }) {
  const baseClass = "bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]";
  
  const variants = {
    text: `${baseClass} h-4 rounded`,
    number: `${baseClass} h-9 w-32 rounded-lg`,
    card: `${baseClass} h-40 w-full rounded-xl`,
    circle: `${baseClass} rounded-full`,
    button: `${baseClass} h-13 w-full rounded-xl`,
    input: `${baseClass} h-12 w-full rounded-lg`,
  };

  return <div className={variants[variant]} style={{ width, height }} />;
}
```

### Usage Pattern — Results Loading

```tsx
// Skeleton for savings result
<div className="space-y-4 animate-pulse">
  <Skeleton variant="text" width="60%" />
  <div className="grid grid-cols-2 gap-4">
    <Skeleton variant="card" height="100px" />
    <Skeleton variant="card" height="100px" />
  </div>
  <Skeleton variant="text" width="40%" />
  <Skeleton variant="card" height="72px" />
  <Skeleton variant="card" height="72px" />
  <Skeleton variant="card" height="72px" />
  <Skeleton variant="button" />
</div>
```

---

## 9. Trust Badge Components

### Bank Logo Bar

```tsx
interface BankLogoBarProps {
  variant: 'compact' | 'full';    // compact = single row, full = grid
  animate?: boolean;               // Subtle fade-in on scroll
}

// Implementation
function BankLogoBar({ variant = 'compact' }) {
  const banks = ['HDFC', 'ICICI', 'Axis', 'Kotak', 'IndusInd', 'AU'];
  
  return (
    <div className="py-6 border-y border-slate-100">
      <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
        Compare rates from trusted partners
      </p>
      <div className="flex items-center justify-center gap-6 md:gap-8 overflow-x-auto px-4">
        {banks.map((bank) => (
          <div key={bank} className="
            flex-shrink-0 h-8 px-3
            flex items-center justify-center
            opacity-50 hover:opacity-100
            grayscale hover:grayscale-0
            transition-all duration-300
          ">
            <span className="text-sm font-semibold text-slate-600">{bank}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Security Badges

```tsx
function SecurityBadges() {
  const badges = [
    { icon: Lock, label: 'SSL Secured' },
    { icon: ShieldCheck, label: 'Data Privacy' },
    { icon: KeyRound, label: '256-bit Encrypted' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-1.5 text-slate-400">
          <Icon size={14} />
          <span className="text-xs font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
```

### Social Proof Counter

```tsx
function SocialProof() {
  return (
    <div className="flex items-center justify-center gap-6 py-4 text-center">
      <div>
        <p className="text-lg font-bold text-slate-800 tabular-nums">50,000+</p>
        <p className="text-xs text-slate-500">Customers</p>
      </div>
      <div className="w-px h-8 bg-slate-200" />
      <div>
        <p className="text-lg font-bold text-slate-800 tabular-nums">9+</p>
        <p className="text-xs text-slate-500">Partner Banks</p>
      </div>
      <div className="w-px h-8 bg-slate-200" />
      <div>
        <p className="text-lg font-bold text-green-600 tabular-nums">₹3,200</p>
        <p className="text-xs text-slate-500">Avg. Saved/mo</p>
      </div>
    </div>
  );
}
```

---

## 10. Hero Section Component

### Specifications

```tsx
interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCTA: { label: string; onClick: () => void };
  secondaryCTA?: { label: string; onClick: () => void };
}
```

### Styling

```tsx
function Hero({ headline, subheadline, primaryCTA, secondaryCTA }) {
  return (
    <section className="
      relative overflow-hidden
      bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
      text-white
      pt-16 pb-24 md:pt-20 md:pb-32
      px-4
    ">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="relative max-w-2xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-slate-200">Free · Instant · No credit check</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-display-md md:text-display-lg text-white mb-4">
          {headline}
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg mx-auto">
          {subheadline}
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={primaryCTA.onClick} className="
            w-full sm:w-auto
            bg-green-500 hover:bg-green-600 active:bg-green-700
            text-white font-bold text-lg
            px-8 py-4 rounded-xl
            shadow-cta hover:shadow-cta-hover
            transition-all duration-200
            flex items-center justify-center gap-2
          ">
            {primaryCTA.label}
            <ArrowRight size={20} />
          </button>
          
          {secondaryCTA && (
            <button onClick={secondaryCTA.onClick} className="
              w-full sm:w-auto
              bg-white/10 hover:bg-white/20
              text-white font-medium
              px-6 py-4 rounded-xl
              border border-white/20
              transition-all duration-200
            ">
              {secondaryCTA.label}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
```

---


## 11. Calculator Form Component

### Specifications

```tsx
interface CalculatorFormProps {
  onSubmit: (data: CalculatorFormData) => Promise<void>;
  isLoading: boolean;
}
```

### Form Layout

```
┌─────────────────────────────────────────────┐
│  Step 1 of 4 · Loan Details                 │
│  ═══════════════════░░░░░░░░░░░░░░░░░░░░░░  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  ₹  Current Monthly EMI             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  ₹  Outstanding Loan Amount         │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │     Current Interest Rate         % │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌────────────────┐ ┌────────────────┐      │
│  │ Remaining (mo) │ │ Original (mo)  │      │
│  └────────────────┘ └────────────────┘      │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │      Check My Savings →             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  🔒 Your data is encrypted and never shared │
└─────────────────────────────────────────────┘
```

### Progressive Disclosure

Show fields one at a time on mobile for reduced cognitive load:
- Start with EMI (most people know this)
- Reveal Outstanding Amount after EMI is entered
- Then rate, then tenure

### Validation UX

- Validate on blur (not on change)
- Show inline errors below the field
- Green checkmark when field passes validation
- Shake animation on submit with errors

---

## 12. Savings Result Component

### Layout

```
┌─────────────────────────────────────────────┐
│  Your Estimated Savings                     │
│                                             │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │  Monthly Saving  │ │  Total Saved     │  │
│  │  ₹ 3,247 ↑      │ │  ₹ 1,16,892     │  │
│  └──────────────────┘ └──────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  ✓ Top-Up Eligible: ₹2,50,000       │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Best Bank Offers                           │
│  ┌──────────────────────────────────────┐   │
│  │ 🏆 HDFC · 8.75% · Save ₹3,247/mo   │   │
│  ├──────────────────────────────────────┤   │
│  │    ICICI · 9.0% · Save ₹2,891/mo    │   │
│  ├──────────────────────────────────────┤   │
│  │    Axis · 9.25% · Save ₹2,534/mo    │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │      Get Free Callback →             │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Key Behaviors

- Numbers animate in with count-up effect (1.2s)
- Top-up card slides in 300ms after main results
- Bank list staggered fade (100ms between each)
- CTA button pulses gently after 2s delay

---

## 13. Lead Capture Form Component

### Specifications

```tsx
interface LeadCaptureFormProps {
  onSubmit: (data: LeadCaptureFormData) => Promise<void>;
  isLoading: boolean;
  savingsAmount?: number;    // Show personalized savings reminder
  onBack: () => void;
}
```

### Layout

```
┌─────────────────────────────────────────────┐
│  ← Back                                     │
│                                             │
│  Get Your Free Savings Report               │
│  A specialist will call within 30 minutes   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  You could save ₹3,247/month        │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Full Name                          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  +91  Mobile Number                 │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  City                               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Current Bank (Optional)            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │       Get Free Callback →            │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  🔒 We'll never spam or share your number   │
│                                             │
│  By submitting, you agree to our            │
│  Privacy Policy and Terms of Service        │
└─────────────────────────────────────────────┘
```

### Design Decisions

- Show savings reminder at top to maintain motivation
- Minimal fields (4 total, only 3 required)
- Mobile field has +91 prefix for clarity
- Privacy reassurance directly below CTA
- No CAPTCHA (handled server-side with rate limiting)

---

## 14. Success Screen Component

### Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│              ✓ (animated checkmark)         │
│                                             │
│       Your Request Has Been Received        │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  ✓ Savings Calculated                │   │
│  │  ✓ Pre-Approval Generated            │   │
│  │  ✓ Callback Scheduled                │   │
│  └──────────────────────────────────────┘   │
│                                             │
│        Expected callback:                   │
│        Within 30 Minutes                    │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │        Calculate Again               │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Share with friends who pay high EMI        │
│  [WhatsApp] [Copy Link]                     │
│                                             │
└─────────────────────────────────────────────┘
```

### Animations

- Large SVG checkmark with draw animation (0.8s)
- Confetti particle burst (subtle, 5-8 particles)
- Steps reveal with staggered fade-in (200ms each)
- "Within 30 Minutes" pulses once

---


## 15. Header / Navigation Component

### Specifications

```tsx
interface HeaderProps {
  sticky?: boolean;
  transparent?: boolean;     // Transparent over hero, solid on scroll
}
```

### Styling

```tsx
function Header({ sticky = true, transparent = true }) {
  const [scrolled, setScrolled] = useState(false);

  return (
    <header className={`
      ${sticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}
      transition-all duration-300
      ${scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' 
        : transparent ? 'bg-transparent' : 'bg-white'}
    `}>
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className={`font-bold text-lg ${scrolled ? 'text-slate-800' : 'text-white'}`}>
            MotoFin
          </span>
        </div>
        
        {/* CTA (visible on scroll) */}
        {scrolled && (
          <button className="
            bg-green-500 hover:bg-green-600
            text-white text-sm font-semibold
            px-4 py-2 rounded-lg
            transition-all duration-200
            animate-fade-in-up
          ">
            Check Savings
          </button>
        )}
        
        {/* Phone/Support */}
        <a href="tel:+918000000000" className={`
          flex items-center gap-1.5 text-sm font-medium
          ${scrolled ? 'text-slate-600' : 'text-white/80'}
        `}>
          <Phone size={16} />
          <span className="hidden sm:inline">Support</span>
        </a>
      </div>
    </header>
  );
}
```

---

## 16. Footer Component

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  MotoFin Technologies                                        │
│  Vehicle finance comparison platform                         │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Product          Company           Legal                    │
│  EMI Calculator   About Us          Privacy Policy           │
│  Pre-Approval     Contact           Terms of Service         │
│  Balance Transfer FAQ               Disclaimer               │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  🔒 SSL Secured  ·  🛡️ Data Privacy  ·  🔐 Encrypted       │
│                                                              │
│  © 2024 MotoFin Technologies. All rights reserved.           │
│  Disclaimer: Rates are indicative. Final rates subject to    │
│  bank approval and document verification.                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 17. Error State Component

### Variants

| Variant | Usage | Color |
|---------|-------|-------|
| `inline` | Below form field | Red text, 13px |
| `banner` | Top of section | Red-50 bg, red border |
| `toast` | Non-blocking notification | Slide-in from top |
| `fullscreen` | API failure, network error | Centered, retry button |

### Banner Error

```tsx
function ErrorBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="
      bg-red-50 border border-red-200 rounded-xl p-4
      flex items-start gap-3
      animate-fade-in-up
    " role="alert">
      <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
      <div className="flex-1">
        <p className="text-red-700 text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
```

---

## 18. Loading Button State

### Implementation

```tsx
function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Usage in CTA
<button disabled={isLoading} className="...">
  {isLoading ? (
    <span className="flex items-center gap-2">
      <LoadingSpinner size={20} />
      Calculating...
    </span>
  ) : (
    'Check My Savings →'
  )}
</button>
```

---

## 19. Tooltip / Info Popover

### Purpose

Explains financial terms without leaving the flow.

```tsx
function InfoTooltip({ content }: { content: string }) {
  return (
    <span className="relative group inline-flex">
      <Info size={14} className="text-slate-400 cursor-help" />
      <span className="
        invisible group-hover:visible opacity-0 group-hover:opacity-100
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        bg-slate-800 text-white text-xs rounded-lg
        px-3 py-2 max-w-[200px] text-center
        transition-all duration-200
        pointer-events-none
        after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
        after:border-4 after:border-transparent after:border-t-slate-800
      ">
        {content}
      </span>
    </span>
  );
}

// Usage
<label>
  Outstanding Amount
  <InfoTooltip content="The remaining loan balance as shown in your latest bank statement" />
</label>
```

---

## 20. Component Interaction States Summary

| Component | Default | Hover | Active | Focus | Loading | Disabled | Error |
|-----------|---------|-------|--------|-------|---------|----------|-------|
| Button (Primary) | Green-500, shadow | Green-600, elevated shadow | Green-700, scale(0.98) | Ring-2 green | Spinner, opacity-80 | Slate-200, no cursor | — |
| Button (Secondary) | Blue-500 | Blue-600 | Blue-700 | Ring-2 blue | Spinner | Slate-200 | — |
| Input | Border-slate-200 | Border-slate-300 | — | Border-blue-500, ring | — | Bg-slate-50 | Border-red-400, ring-red |
| Card | Shadow-card | Shadow-card-hover, translateY(-2px) | — | — | Skeleton shimmer | Opacity-50 | Border-red-200 |
| Bank Row | Bg-slate-50 | Shadow-sm, border | Bg-slate-100 | Ring-2 | — | — | — |
| Link | Blue-500 | Blue-600, underline | Blue-700 | Ring-2 | — | Slate-400 | — |

---

## 21. Responsive Breakpoint Behaviors

| Component | Mobile (< 768px) | Tablet (768-1024px) | Desktop (> 1024px) |
|-----------|-------------------|---------------------|---------------------|
| Hero headline | 36px, 3 lines max | 42px, 2 lines | 48px, single line |
| CTA Button | Full-width, stacked | Full-width | Auto-width, inline |
| Metric cards | 2-col grid | 2-col grid | 2-col grid |
| Bank list | Full-width cards | Full-width cards | Full-width cards |
| Inputs | Full-width, stacked | Full-width, stacked | Full-width, stacked |
| Tenure inputs | 2-col grid | 2-col grid | 2-col grid |
| Footer links | Stacked | 3-col grid | 3-col grid |
| Header CTA | Hidden | Visible on scroll | Visible on scroll |

---

## 22. Implementation Priority

### Phase 1 — Critical Path (Calculator → Conversion)
1. Button (primary, loading states)
2. Input (all variants)
3. Card (elevated, metric)
4. Hero Section
5. Calculator Form
6. Savings Result
7. Animated Counter
8. Lead Capture Form
9. Success Screen
10. Step Indicator

### Phase 2 — Trust & Polish
11. Approval Gauge
12. Bank Comparison Card
13. Bank Logo Bar
14. Security Badges
15. Social Proof
16. Skeleton Loaders
17. Error States
18. Tooltip/Info Popover

### Phase 3 — Layout & Navigation
19. Header (sticky, transparent)
20. Footer
21. Container/Section wrappers
22. SEO Components (StructuredData, FAQ)
