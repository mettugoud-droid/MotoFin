# MotoFin Landing Page Wireframes

## Conversion-First Page Architecture

**Version:** 2.0  
**Design Approach:** Mobile-First, Single-Page Multi-Step Flow  
**Primary Goal:** Calculator Completion → Lead Capture  
**Target:** LCP < 2s, CLS < 0.05, INP < 200ms  

---

## Page Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        LANDING PAGE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [1] Header (sticky, transparent → solid on scroll)         │
│  [2] Hero Section (dark, conversion-focused)                │
│  [3] Trust Bar (bank logos + social proof)                   │
│  [4] Calculator Card (multi-step form)                      │
│      → Step 1: Loan Details Form                            │
│      → Step 2: Savings Result + Pre-Approval                │
│      → Step 3: Lead Capture Form                            │
│      → Step 4: Success Confirmation                         │
│  [5] Benefits Section (why refinance)                       │
│  [6] How It Works (3-step process)                          │
│  [7] FAQ Section (SEO + trust)                              │
│  [8] Final CTA Section                                      │
│  [9] Footer                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 1: Header / Navigation

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│  [M] MotoFin          ☎ Support          │
│                                          │
└──────────────────────────────────────────┘
         ↕ Height: 56px
```

### Desktop Wireframe (1024px+)

```
┌───────────────────────────────────────────────────────────────────┐
│  [M] MotoFin       EMI Calculator  |  About  |  FAQ    [Support] │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
         ↕ Height: 64px
```

### Behavior

- **Default:** Transparent background over hero gradient
- **On Scroll (> 80px):** White background, subtle shadow, "Check Savings" mini-CTA appears
- **Z-index:** 50 (always above content)
- **Transition:** 300ms ease background/shadow change

---


## Section 2: Hero Section

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ● Free · Instant · No credit check│  │
│  └────────────────────────────────────┘  │
│                                          │
│      Reduce Your Car EMI                 │
│       in 30 Seconds                      │
│                                          │
│   Check Savings, Top-Up Eligibility      │
│   and Approval Chances Instantly.        │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │        Check My Savings →          │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │       See Sample Result            │  │
│  └────────────────────────────────────┘  │
│                                          │
│   50,000+ customers · ₹3,200 avg saved  │
│                                          │
└──────────────────────────────────────────┘
         ↕ Padding: 64px top, 96px bottom
         Background: Gradient slate-900 → slate-800
```

### Desktop Wireframe (1024px+)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    ┌────────────────────────────────────┐                    │
│                    │ ● Free · Instant · No credit check │                    │
│                    └────────────────────────────────────┘                    │
│                                                                             │
│                  Reduce Your Car EMI in 30 Seconds                           │
│                                                                             │
│          Check Savings, Top-Up Eligibility and Approval                      │
│                      Chances Instantly.                                      │
│                                                                             │
│             ┌───────────────────┐  ┌────────────────────┐                   │
│             │  Check My Savings │  │ See Sample Result   │                   │
│             └───────────────────┘  └────────────────────┘                   │
│                                                                             │
│               50,000+ customers  ·  9+ banks  ·  ₹3,200 avg saved          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
         ↕ Padding: 80px top, 128px bottom
```

### Specifications

| Element | Mobile | Desktop |
|---------|--------|---------|
| Badge | 14px, white/10 bg, pill shape | 14px, white/10 bg |
| Headline | 36px/700, 3 lines max | 48px/700, 2 lines max |
| Subheadline | 16px/400, slate-300 | 20px/400, slate-300 |
| Primary CTA | Full-width, 52px height, green-500 | Auto-width, 52px height |
| Secondary CTA | Full-width, 48px, white/10 bg | Auto-width, 48px |
| Social proof | 14px, slate-400 | 16px, slate-300 |
| Background | Gradient: slate-900 → slate-800, dot pattern overlay (opacity-5) |

### Scroll Behavior

- Primary CTA scrolls to calculator section smoothly
- "See Sample Result" opens a modal with sample savings data
- Hero text has subtle parallax on desktop (translateY on scroll)

---

## Section 3: Trust Bar

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                          │
│  Compare rates from trusted partners     │
│                                          │
│  [HDFC] [ICICI] [Axis] [Kotak] →scroll  │
│                                          │
│  🔒 SSL  ·  🛡️ Privacy  ·  🔐 Encrypted │
│                                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
└──────────────────────────────────────────┘
         ↕ Padding: 24px vertical
         Background: White
```

### Desktop Wireframe (1024px+)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              Compare rates from trusted partners                            │
│                                                                             │
│    [HDFC]    [ICICI]    [Axis]    [Kotak]    [IndusInd]    [AU]            │
│                                                                             │
│         🔒 SSL Secured  ·  🛡️ Data Privacy  ·  🔐 256-bit Encrypted        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Specifications

| Element | Style |
|---------|-------|
| Container | White bg, border-y border-slate-100 |
| Label | 12px uppercase, tracking-wider, slate-400 |
| Logos | 40px height, grayscale → color on hover, horizontal scroll mobile |
| Security badges | 12px, slate-400, icon + text |
| Spacing | 24px between logos, 16px between badge row and logos |

---


## Section 4: Calculator Card — Step 1 (Loan Details)

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Step 1 of 4 · Loan Details       │  │
│  │  ══════════░░░░░░░░░░░░░░░░░░░░░  │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │ ₹  Current Monthly EMI     │    │  │
│  │  │    e.g. 25,000             │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │ ₹  Outstanding Amount      │    │  │
│  │  │    e.g. 8,00,000          │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │    Current Interest Rate  %│    │  │
│  │  │    e.g. 12.5              │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  ┌────────────┐ ┌────────────┐    │  │
│  │  │Remaining   │ │Original    │    │  │
│  │  │  36 months │ │  60 months │    │  │
│  │  └────────────┘ └────────────┘    │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │     Check My Savings →     │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  🔒 Your data is encrypted         │  │
│  │     and never shared               │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
         Card: White, shadow-card-xl, rounded-2xl
         Negative margin: -48px (overlaps hero)
         Padding: 24px (mobile), 32px (desktop)
```

### Desktop Wireframe (1024px+)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              ┌─────────────────────────────────────────────────┐            │
│              │                                                 │            │
│              │   EMI Savings Calculator                        │            │
│              │   Step 1 of 4 · Loan Details                   │            │
│              │   ════════════════░░░░░░░░░░░░░░░░░░░░░░░░░░   │            │
│              │                                                 │            │
│              │   ┌─────────────────────────────────────────┐   │            │
│              │   │  ₹   Current Monthly EMI                │   │            │
│              │   └─────────────────────────────────────────┘   │            │
│              │                                                 │            │
│              │   ┌─────────────────────────────────────────┐   │            │
│              │   │  ₹   Outstanding Loan Amount            │   │            │
│              │   └─────────────────────────────────────────┘   │            │
│              │                                                 │            │
│              │   ┌─────────────────────────────────────────┐   │            │
│              │   │      Current Interest Rate            %  │   │            │
│              │   └─────────────────────────────────────────┘   │            │
│              │                                                 │            │
│              │   ┌──────────────────┐ ┌────────────────────┐   │            │
│              │   │  Remaining (mo)  │ │  Original (mo)     │   │            │
│              │   └──────────────────┘ └────────────────────┘   │            │
│              │                                                 │            │
│              │   ┌─────────────────────────────────────────┐   │            │
│              │   │          Check My Savings →              │   │            │
│              │   └─────────────────────────────────────────┘   │            │
│              │                                                 │            │
│              │   🔒 Your data is encrypted and never shared    │            │
│              │                                                 │            │
│              └─────────────────────────────────────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
         Max-width: 560px (card), centered
```

### Form Field Specifications

| Field | Type | Prefix/Suffix | Placeholder | Validation |
|-------|------|---------------|-------------|------------|
| Current EMI | number | ₹ prefix | 25,000 | 1 – 1,00,00,000 |
| Outstanding Amount | number | ₹ prefix | 8,00,000 | 1 – 10,00,00,000 |
| Interest Rate | number (step 0.01) | % suffix | 12.5 | 1 – 30 |
| Remaining Tenure | number | — | 36 | 1 – 120 months |
| Original Tenure | number | — | 60 | 1 – 120, ≥ remaining |

### Micro-Interactions

- Input focus: Border transitions to blue, subtle ring appears
- Valid field: Green checkmark appears inline (right side)
- Error: Red border + shake animation (200ms)
- CTA: Green with subtle shadow, hover elevates shadow
- Privacy text: Lock icon + 12px text below CTA

---


## Section 4: Calculator Card — Step 2 (Savings Result)

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Step 2 of 4 · Your Savings       │  │
│  │  ══════════════════════░░░░░░░░░░  │  │
│  │                                    │  │
│  │  Your Estimated Savings            │  │
│  │                                    │  │
│  │  ┌──────────┐  ┌──────────┐       │  │
│  │  │ Monthly  │  │ Total    │       │  │
│  │  │ Saving   │  │ Interest │       │  │
│  │  │          │  │ Saved    │       │  │
│  │  │ ₹3,247↑  │  │₹1,16,892│       │  │
│  │  │          │  │          │       │  │
│  │  └──────────┘  └──────────┘       │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │ ✓ Top-Up Eligible         │    │  │
│  │  │   ₹2,50,000               │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  Best Bank Offers                  │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │ ★ Best Rate               │    │  │
│  │  │ HDFC Bank                  │    │  │
│  │  │ 8.75% · EMI ₹21,753      │    │  │
│  │  │          Save ₹3,247/mo ↗ │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │ ICICI Bank                 │    │  │
│  │  │ 9.0% · EMI ₹22,109       │    │  │
│  │  │          Save ₹2,891/mo   │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │ Axis Bank                  │    │  │
│  │  │ 9.25% · EMI ₹22,466      │    │  │
│  │  │          Save ₹2,534/mo   │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │  Pre-Approval Indication           │  │
│  │                                    │  │
│  │       ╭─────────╮                 │  │
│  │      ╱  ╭─────╮  ╲               │  │
│  │     │  │ 87%  │  │               │  │
│  │      ╲  ╰─────╯  ╱               │  │
│  │       ╰─────────╯                 │  │
│  │    ✓ High Approval Chance          │  │
│  │                                    │  │
│  │  "Strong repayment profile with    │  │
│  │   significant savings potential"    │  │
│  │                                    │  │
│  │  ✓ Top-Up: ₹2,50,000             │  │
│  │                                    │  │
│  │  Recommended Banks:                │  │
│  │  [HDFC 8.75%] [ICICI 9.0%]       │  │
│  │                                    │  │
│  │  ⓘ Disclaimer text in gray 11px   │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │       Get Free Callback →          │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### Animation Sequence (on step transition)

```
T+0ms     Card fades in (opacity 0→1, translateY 16→0)
T+200ms   Metric cards appear (staggered, left then right)
T+400ms   Counter animations begin (0 → target value, 1200ms)
T+600ms   Top-Up card slides in (if eligible)
T+800ms   Bank list items stagger in (100ms between each)
T+1200ms  Pre-Approval card fades in from below
T+1400ms  Gauge animation begins (0% → target)
T+2500ms  CTA button appears with subtle pulse
```

### Competitive Rate Scenario

When user's rate is already competitive:

```
┌────────────────────────────────────────┐
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ ✓ Your Rate is Competitive!     │  │
│  │                                  │  │
│  │ Your current rate of 8.5% is    │  │
│  │ already among the best in the   │  │
│  │ market. No refinancing needed.  │  │
│  │                                  │  │
│  │ However, you may still be       │  │
│  │ eligible for a top-up loan.     │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │    Check Top-Up Eligibility →    │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

---


## Section 4: Calculator Card — Step 3 (Lead Capture)

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  ← Back                           │  │
│  │                                    │  │
│  │  Step 3 of 4 · Get Callback       │  │
│  │  ══════════════════════════░░░░░░  │  │
│  │                                    │  │
│  │  Get Your Free Savings Report      │  │
│  │  A specialist will call within     │  │
│  │  30 minutes                        │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │ 💰 You could save          │    │  │
│  │  │    ₹3,247/month            │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  Full Name *                       │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │  Enter your name           │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  Mobile Number *                   │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │ +91  9876543210            │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  City *                            │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │  e.g. Hyderabad            │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  Current Bank (Optional)           │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │  e.g. HDFC, ICICI          │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │     Get Free Callback →    │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  🔒 We'll never spam or share     │  │
│  │     your number                    │  │
│  │                                    │  │
│  │  By submitting, you agree to our   │  │
│  │  Privacy Policy & Terms            │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| Savings reminder at top | Maintains motivation, shows clear value |
| Only 3 required fields | Reduces friction, increases completion |
| +91 prefix on mobile | Provides format clarity for Indian users |
| "Optional" label for bank | Reduces perceived form length |
| Privacy text below CTA | Addresses objection at decision point |
| Back button visible | Reduces anxiety, user feels in control |

---

## Section 4: Calculator Card — Step 4 (Success)

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Step 4 of 4 · Confirmed          │  │
│  │  ══════════════════════════════════ │  │
│  │                                    │  │
│  │           ╭─────╮                  │  │
│  │          │  ✓  │                  │  │
│  │           ╰─────╯                  │  │
│  │      (animated checkmark)          │  │
│  │                                    │  │
│  │   Your Request Has Been Received   │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │ ✓ Savings Calculated       │    │  │
│  │  │ ✓ Pre-Approval Generated   │    │  │
│  │  │ ✓ Callback Scheduled       │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │      Expected callback:            │  │
│  │      Within 30 Minutes             │  │
│  │      (pulsing text)                │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │      Calculate Again       │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │  Share with friends:               │  │
│  │  [WhatsApp] [Copy Link] [Twitter]  │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### Success Animation Sequence

```
T+0ms     Background confetti burst (5-8 subtle particles)
T+0ms     Checkmark circle draws in (SVG stroke animation, 800ms)
T+800ms   Title fades in
T+1000ms  Checklist items stagger (200ms between each)
T+1600ms  "Within 30 Minutes" appears with single pulse
T+2000ms  CTA and share buttons fade in
```

---


## Section 5: Benefits Section

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│        Why Refinance Your Car Loan?      │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  💰                                │  │
│  │  Save ₹2,000 – ₹5,000/month      │  │
│  │  Lower interest rates from 8.5%   │  │
│  │  across 9+ partner banks          │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  📈                                │  │
│  │  Get Top-Up on Existing Loan      │  │
│  │  Access additional funds of up to │  │
│  │  ₹5 Lakh on your existing loan   │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  ⚡                                │  │
│  │  Quick 30-Second Check            │  │
│  │  No documents needed upfront.     │  │
│  │  Instant savings estimation.      │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  🛡️                                │  │
│  │  100% Safe & Confidential         │  │
│  │  Bank-grade encryption. No spam.  │  │
│  │  Your data stays private.         │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
         Background: Slate-50
         Cards: White, shadow-sm, rounded-xl
```

### Desktop Wireframe (1024px+)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                     Why Refinance Your Car Loan?                             │
│                                                                             │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│   │  💰               │  │  📈               │  │  ⚡               │         │
│   │  Save ₹2K-₹5K/mo │  │  Get Top-Up      │  │  30-Second Check │         │
│   │  Lower rates from │  │  Access up to    │  │  No documents    │         │
│   │  8.5% across 9+  │  │  ₹5L additional  │  │  needed upfront  │         │
│   │  partner banks    │  │  funds           │  │                  │         │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                             │
│                  ┌──────────────────┐                                        │
│                  │  🛡️ 100% Safe    │                                        │
│                  │  & Confidential  │                                        │
│                  └──────────────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
         Desktop: 3-column grid + centered 4th card
```

---

## Section 6: How It Works

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│        How It Works                      │
│        3 simple steps                    │
│                                          │
│        ┌────┐                            │
│        │ 1  │                            │
│        └──┬─┘                            │
│           │                              │
│     Enter Your Loan Details              │
│     Current EMI, outstanding amount,     │
│     and interest rate                    │
│           │                              │
│        ┌──┴─┐                            │
│        │ 2  │                            │
│        └──┬─┘                            │
│           │                              │
│     See Instant Savings                  │
│     Compare rates across 9+ banks        │
│     and see your approval chances        │
│           │                              │
│        ┌──┴─┐                            │
│        │ 3  │                            │
│        └────┘                            │
│                                          │
│     Get Expert Callback                  │
│     A loan specialist connects you       │
│     to the best refinance option         │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │      Start Calculating →           │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
         Background: White
         Number circles: Green-500, 32px
         Connector: Dashed green line
```

---

## Section 7: FAQ Section

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│   Frequently Asked Questions             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ▼ What is car loan refinancing?    │  │
│  ├────────────────────────────────────┤  │
│  │   Car loan refinancing means       │  │
│  │   transferring your existing car   │  │
│  │   loan to a new bank offering a    │  │
│  │   lower interest rate...           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ▶ How much can I save?             │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ▶ Is my data safe?                 │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ▶ Which banks are supported?       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ▶ Do I need documents to check?    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ▶ What is a top-up loan?           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ▶ How long does the process take?  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ▶ Will refinancing affect my       │  │
│  │   credit score?                    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
         Accordion style: Single-open
         Animation: Smooth height transition (300ms)
         Border: Subtle slate-100 between items
```

### FAQ Content (SEO Optimized)

| Question | Target Keyword |
|----------|---------------|
| What is car loan refinancing? | car loan refinance |
| How much can I save by refinancing? | reduce car EMI |
| Is my data safe on MotoFin? | (trust) |
| Which banks are supported? | vehicle loan balance transfer |
| Do I need documents to check savings? | (friction reducer) |
| What is a top-up loan? | car loan top-up |
| How long does the refinancing process take? | (conversion) |
| Will refinancing affect my credit score? | (objection handler) |

---


## Section 8: Final CTA Section

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │   Ready to Reduce Your EMI?        │  │
│  │                                    │  │
│  │   Join 50,000+ customers who      │  │
│  │   have saved on their car loans   │  │
│  │                                    │  │
│  │   ┌────────────────────────────┐   │  │
│  │   │    Check My Savings →      │   │  │
│  │   └────────────────────────────┘   │  │
│  │                                    │  │
│  │   ⏱ Takes less than 30 seconds    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
         Background: Gradient slate-900 → slate-800
         Card: Semi-transparent white/5
         CTA: Green-500, full-width
```

---

## Section 9: Footer

### Mobile Wireframe (360-412px)

```
┌──────────────────────────────────────────┐
│                                          │
│  [M] MotoFin Technologies               │
│  Vehicle finance comparison platform.    │
│  We help you find the best refinance     │
│  rates from 9+ partner banks.            │
│                                          │
│  ────────────────────────────────────    │
│                                          │
│  Product                                 │
│  • EMI Savings Calculator                │
│  • Pre-Approval Check                    │
│  • Balance Transfer                      │
│                                          │
│  Company                                 │
│  • About Us                              │
│  • Contact Us                            │
│  • Careers                               │
│                                          │
│  Legal                                   │
│  • Privacy Policy                        │
│  • Terms of Service                      │
│  • Disclaimer                            │
│                                          │
│  ────────────────────────────────────    │
│                                          │
│  🔒 SSL  ·  🛡️ Privacy  ·  🔐 Encrypted │
│                                          │
│  © 2024 MotoFin Technologies Pvt. Ltd.   │
│  All rights reserved.                    │
│                                          │
│  Disclaimer: All rates displayed are     │
│  indicative. Final rates are subject     │
│  to bank approval and document           │
│  verification.                           │
│                                          │
└──────────────────────────────────────────┘
         Background: Slate-900
         Text: Slate-400
         Links: Slate-300, hover: white
         Dividers: Slate-700
```

### Desktop Wireframe (1024px+)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  [M] MotoFin Technologies          Product        Company       Legal       │
│  Vehicle finance comparison         Calculator     About         Privacy    │
│  platform helping customers         Pre-Approval   Contact       Terms      │
│  save on car loans.                 Transfer       Careers       Disclaimer │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────    │
│                                                                             │
│  🔒 SSL  ·  🛡️ Privacy  ·  🔐 Encrypted        © 2024 MotoFin Technologies │
│                                                                             │
│  Disclaimer: All rates displayed are indicative. Final rates subject to     │
│  bank approval and document verification.                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
         Desktop: 4-column grid (brand + 3 link columns)
```

---

## Complete Page Scroll Map

### Mobile View (Total Scroll)

```
┌────────────────────────────────┐
│ Header (fixed, 56px)           │ ─── Always visible
├────────────────────────────────┤
│                                │
│ Hero Section                   │ ─── ~400px viewport height
│ (dark gradient, CTAs)          │
│                                │
├────────────────────────────────┤
│ Trust Bar (logos + badges)     │ ─── ~120px
├────────────────────────────────┤
│                                │
│ Calculator Card                │ ─── ~600-800px per step
│ (multi-step, -48px overlap)    │
│                                │
├────────────────────────────────┤
│                                │
│ Benefits Section               │ ─── ~500px
│ (4 feature cards)              │
│                                │
├────────────────────────────────┤
│                                │
│ How It Works                   │ ─── ~400px
│ (3-step vertical flow)         │
│                                │
├────────────────────────────────┤
│                                │
│ FAQ Section                    │ ─── ~600px (collapsed)
│ (8 accordion items)            │
│                                │
├────────────────────────────────┤
│ Final CTA                      │ ─── ~200px
├────────────────────────────────┤
│                                │
│ Footer                         │ ─── ~400px
│                                │
└────────────────────────────────┘

Total estimated scroll: ~3,200px - 3,800px
```

---

## Viewport Priority (Above the Fold)

### What Users See First (No Scroll)

**Mobile (360x640 viewport):**
1. Header (logo + support link)
2. Badge ("Free · Instant · No credit check")
3. Headline ("Reduce Your Car EMI in 30 Seconds")
4. Subheadline
5. Primary CTA ("Check My Savings →")

**Key Metrics:**
- Hero CTA must be visible without scrolling on all mobile devices
- Time to first interaction: < 3 seconds
- User understands value proposition within first viewport

---

## Interaction Flow Diagram

```
User Lands on Page
       │
       ▼
┌─────────────────┐
│   Hero Section  │
│   "Check My     │──── Click Primary CTA
│    Savings"     │
└─────────────────┘
       │
       ▼ (smooth scroll to calculator)
┌─────────────────┐
│  Calculator     │
│  Step 1: Form   │──── Fill 5 fields → Submit
└─────────────────┘
       │
       ▼ (API call, skeleton loading)
┌─────────────────┐
│  Step 2:        │
│  Results +      │──── View savings, pre-approval
│  Pre-Approval   │
└─────────────────┘
       │
       ▼ (Click "Get Free Callback")
┌─────────────────┐
│  Step 3:        │
│  Lead Capture   │──── Fill 3-4 fields → Submit
└─────────────────┘
       │
       ▼ (API call)
┌─────────────────┐
│  Step 4:        │
│  Success        │──── Conversion Complete ✓
└─────────────────┘
```

---

## Exit Intent Handling

When user shows exit intent (mouse leaves viewport on desktop, or back button on mobile):

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                          [✕]       │  │
│  │                                    │  │
│  │  Wait! You could be saving         │  │
│  │  ₹3,000+ every month              │  │
│  │                                    │  │
│  │  Complete your savings check       │  │
│  │  in just 30 seconds.              │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │   Continue Checking →      │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  │       No thanks, I'll pay more     │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
         Overlay: Black/60
         Modal: White, rounded-2xl, shadow-xl
         Only shown once per session
         Not shown if user has completed Step 2+
```

---

## Sample Result Modal

Triggered by "See Sample Result" secondary CTA:

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Sample Savings Report    [✕]      │  │
│  │                                    │  │
│  │  For a loan of ₹8,00,000          │  │
│  │  at 12.5% with 36 months left:    │  │
│  │                                    │  │
│  │  ┌──────────┐  ┌──────────┐       │  │
│  │  │ Monthly  │  │ Total    │       │  │
│  │  │ ₹3,247  │  │₹1,16,892│       │  │
│  │  └──────────┘  └──────────┘       │  │
│  │                                    │  │
│  │  Best rate: HDFC @ 8.75%          │  │
│  │  Top-up eligible: ₹2,50,000      │  │
│  │  Approval chance: 87%             │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐    │  │
│  │  │  Check Your Real Savings → │    │  │
│  │  └────────────────────────────┘    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

---

## Performance Considerations

| Technique | Section | Impact |
|-----------|---------|--------|
| Critical CSS inline | Hero + above fold | LCP < 2s |
| Lazy load images | Bank logos, below fold | Reduced initial payload |
| Intersection Observer | Benefits, FAQ, How it works | Only render when visible |
| Skeleton loading | Calculator results | Zero layout shift |
| Font preload | Inter (variable weight) | No FOIT |
| Deferred scripts | Analytics, exit intent | No blocking |
| Image optimization | next/image with AVIF/WebP | 60% smaller |
| Bundle splitting | Per-step code splitting | Smaller initial JS |
