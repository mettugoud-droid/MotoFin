# MotoFin First 100 Leads Plan

## Overview

A week-by-week execution plan to generate the first 100 qualified leads for MotoFin's vehicle refinance platform. This plan validates the core hypothesis: **Indian car owners will use a free calculator and share their phone number to explore refinancing.**

---

## Key Assumptions

| Parameter | Assumption | Basis |
|-----------|-----------|-------|
| Daily ad spend | ₹700/day average | Budget allocation |
| Cost per lead (CPL) | ₹100-₹150 | Indian fintech Meta ads benchmark |
| Calculator → Lead conversion | 25-30% | Strong value prop + instant gratification |
| Visitors needed for 100 leads | ~1,200-1,600 | At 25-30% visit→calc, 25-30% calc→lead |
| Calculator completions needed | ~350-400 | At 25-30% completion→lead rate |
| Timeline | 28 days | 4 weeks of active campaigns |
| Total budget | ₹10,000-₹15,000 | At ₹100-₹150 CPL for 100 leads |

---

## Week 1 (Days 1-7): LAUNCH

### Objective
Get the machine running. Verify ads → calculator → lead pipeline works end-to-end.

### Day-by-Day Plan

| Day | Activity | Owner | Success Criteria |
|-----|----------|-------|-----------------|
| Day 1 | Deploy to production, verify all endpoints | Engineering | Health check passing, calculator returns results |
| Day 1 | End-to-end test: Ad click → Calculator → Lead capture → Notification | Engineering + Marketing | Full flow works on mobile |
| Day 2 | Install Meta Pixel + GA4, verify events firing | Engineering | Events visible in GA4 DebugView + Meta Pixel Helper |
| Day 2 | Set up Meta Conversions API, test with test event code | Engineering | Server events appearing in Events Manager |
| Day 3 | Launch 3 ad sets (Hyderabad, Bangalore, Mumbai) at ₹150/day each | Marketing | Ads approved and delivering |
| Day 3 | Set up UptimeRobot + daily dashboard sheet | Engineering | Monitoring active |
| Day 4 | First day of live ads — monitor hourly | Marketing | Impressions flowing, clicks happening |
| Day 4 | First leads expected — test call response within 5 min | Sales | At least 1 lead contacted |
| Day 5 | Review Day 1 ad performance, note CPL per city | Marketing | Data for initial optimization |
| Day 6 | Optimize: Pause any creative with CTR < 0.8% | Marketing | Remove waste spend |
| Day 7 | Week 1 review: Calculate CPL, conversion rate, lead quality | Founder | Baseline metrics established |

### Week 1 Targets

| Metric | Target | Stretch |
|--------|--------|---------|
| Total Visitors | 200 | 300 |
| Calculator Starts | 120 | 200 |
| Calculator Completions | 50 | 80 |
| Leads Captured | 15 | 25 |
| Connected Calls | 10 | 18 |
| Ad Spend | ₹3,150 | ₹3,150 |
| CPL | ₹150-₹200 | < ₹150 |

### Week 1 Go/No-Go Criteria

| Signal | GO (proceed to Week 2) | NO-GO (pause and fix) |
|--------|------------------------|----------------------|
| Ads delivering | ✅ Impressions > 5,000/day | ❌ Ad rejection or low delivery |
| Clicks happening | ✅ CTR > 1% | ❌ CTR < 0.5% |
| Calculator loads | ✅ Completion rate > 30% | ❌ Completion rate < 15% |
| Leads converting | ✅ At least 5 leads in first 3 days | ❌ Zero leads after 3 days |
| Calls connecting | ✅ > 50% answer rate | ❌ < 30% answer rate |

### If NO-GO: Diagnostic Actions

| Problem | Diagnostic | Fix |
|---------|-----------|-----|
| Low CTR (< 0.5%) | Creative not resonating | Test 3 new ad copies |
| High bounce (> 70%) | Landing page issue | Check mobile load time, CTA visibility |
| Low completion (< 15%) | Calculator UX broken | Simplify fields, reduce steps |
| Zero leads from completions | Lead form not compelling | Add trust signals, reduce fields |
| Leads not answering | Wrong phone numbers or timing | Verify data quality, try different times |

---

## Week 2 (Days 8-14): OPTIMIZE

### Objective
Reduce CPL by 20-30%. Find winning creative and city. Scale what works, kill what doesn't.

### Day-by-Day Plan

| Day | Activity | Owner | Success Criteria |
|-----|----------|-------|-----------------|
| Day 8 | Analyze Week 1 data: Best city, best creative, best time of day | Marketing | Clear winner identified |
| Day 8 | Pause underperforming ad sets (CPL > ₹200) | Marketing | Budget reallocated to winners |
| Day 9 | Scale winning ad set +50% budget | Marketing | More leads from best source |
| Day 10 | Launch 2 new cities (Chennai, Pune) at ₹100/day each | Marketing | 5 cities active |
| Day 11 | Test 2 new creative angles (video, carousel) | Marketing | Fresh creative in rotation |
| Day 12 | Review document collection pipeline | Sales/Ops | Identify bottlenecks |
| Day 13 | Mid-campaign optimization based on 10-day data | Marketing | CPL trending down |
| Day 14 | Week 2 review: Updated CPL, conversion funnel, lead quality | Founder | Optimization impact measured |

### Week 2 Targets

| Metric | Target | Stretch |
|--------|--------|---------|
| Total Visitors (week) | 400 | 600 |
| Calculator Completions (week) | 100 | 150 |
| New Leads (week) | 35 | 50 |
| **Cumulative Leads** | **50** | **75** |
| Connected Calls (week) | 25 | 35 |
| Documents Received (week) | 5 | 10 |
| Ad Spend (week) | ₹5,250 | ₹5,250 |
| CPL (week) | ₹120-₹150 | < ₹120 |

### Week 2 Optimization Actions

| If This Happens | Do This |
|-----------------|---------|
| City A has CPL ₹80, City B has CPL ₹250 | Pause City B, give budget to City A |
| Creative angle 1 has 3x more leads than angle 2 | Make 3 variations of angle 1 |
| Mobile has 2x conversion vs desktop | Disable desktop placement |
| Evening hours have lower CPL | Shift budget to 6-10 PM delivery |
| Calculator completion rate low | A/B test calculator headline |

### Week 2 Go/No-Go for Week 3

| Signal | GO | PAUSE & REASSESS |
|--------|-----|-------------------|
| Cumulative leads | ≥ 40 | < 25 |
| CPL trending | Downward or stable | Increasing above ₹200 |
| Lead quality | > 50% answering calls | < 30% answering |
| At least 1 document collection | Yes | No |

---

## Week 3 (Days 15-21): SCALE

### Objective
Push toward 85 cumulative leads. Scale winning formula aggressively. Start lookalike audiences.

### Day-by-Day Plan

| Day | Activity | Owner | Success Criteria |
|-----|----------|-------|-----------------|
| Day 15 | Create Custom Audience from 50+ leads (phone list upload) | Marketing | Audience created |
| Day 15 | Launch 1% Lookalike audience at ₹200/day | Marketing | New audience delivering |
| Day 16 | Top-performing creative → increase to ₹500/day | Marketing | Scaled without CPL spike |
| Day 17 | A/B test landing page: Headline A vs Headline B | Marketing | Test live with 50/50 split |
| Day 18 | Review bank submission pipeline (first submissions expected) | Ops | At least 1 submission made |
| Day 19 | Analyze lookalike performance vs interest targeting | Marketing | Compare CPL |
| Day 20 | Refresh creative (new images/copy to prevent fatigue) | Marketing | Fresh ads live |
| Day 21 | Week 3 review: Projections for 100-lead milestone | Founder | Path to 100 clear |

### Week 3 Targets

| Metric | Target | Stretch |
|--------|--------|---------|
| Total Visitors (week) | 600 | 800 |
| Calculator Completions (week) | 150 | 200 |
| New Leads (week) | 35 | 50 |
| **Cumulative Leads** | **85** | **125** |
| Connected Calls (week) | 25 | 35 |
| Documents Received (cumulative) | 12 | 20 |
| Bank Submissions (cumulative) | 3 | 5 |
| Ad Spend (week) | ₹6,300 | ₹6,300 |
| CPL (week) | ₹100-₹130 | < ₹100 |

### Scaling Decision Framework

```
IF CPL < ₹100:
  → Aggressive scale: +50% budget, add new cities
  → Launch broad targeting (let Meta algorithm find converters)

IF CPL ₹100-₹150:
  → Moderate scale: +20% budget on winners
  → Test 1 new audience expansion

IF CPL ₹150-₹200:
  → Hold: Don't scale, focus on optimization
  → Test 2-3 new creatives
  → Check landing page conversion

IF CPL > ₹200:
  → Reduce: Cut budget on worst performers
  → Pause and rebuild creative
  → Consider channel diversification (Google, organic)
```

---

## Week 4 (Days 22-28): HIT 100

### Objective
Reach 100 leads milestone. Focus equally on lead generation AND conversion (calls, docs, bank submissions). First disbursals expected.

### Day-by-Day Plan

| Day | Activity | Owner | Success Criteria |
|-----|----------|-------|-----------------|
| Day 22 | Final push: Increase daily budget to ₹1,000/day | Marketing | Accelerate lead flow |
| Day 23 | All-hands focus on document collection from existing pipeline | Sales + Ops | Clear backlog |
| Day 24 | Follow up on all bank submissions (check status) | Ops | Bank responses received |
| Day 25 | Hit 100 leads milestone (target) | All | 🎉 |
| Day 26 | Begin analysis: CPL, funnel, unit economics | Founder | Data compiled |
| Day 27 | First approval/disbursal expected | Ops + Finance | Revenue event! |
| Day 28 | Full month review + Sprint 2 planning | Founder | Decision: scale, pivot, or iterate |

### Week 4 Targets

| Metric | Target | Stretch |
|--------|--------|---------|
| New Leads (week) | 20 | 30 |
| **Cumulative Leads** | **100+** | **130+** |
| Connected Calls (cumulative) | 70 | 90 |
| Documents Received (cumulative) | 20 | 30 |
| Bank Submissions (cumulative) | 8 | 12 |
| Approvals (cumulative) | 2 | 4 |
| Disbursals (cumulative) | 1 | 2 |
| **Total Ad Spend (month)** | **₹19,600** | **₹21,000** |

---

## Success Metrics at 100 Leads

### Fill-in-the-Blank Scorecard

```
╔══════════════════════════════════════════════════════╗
║        MOTOFIN 100-LEAD VALIDATION SCORECARD        ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  CPL Achieved:              ₹___                     ║
║  Calculator Conversion:     ___% (visitors → lead)   ║
║  Connected Call Rate:       ___% (leads → connected) ║
║  Document Collection Rate:  ___% (connected → docs)  ║
║  Bank Submission Rate:      ___% (docs → submitted)  ║
║  Approval Rate:             ___% (submitted → approved)║
║  Disbursal Rate:            ___% (approved → disbursed)║
║                                                      ║
║  Total Spend:               ₹___                     ║
║  Total Revenue:             ₹___                     ║
║  Revenue per Lead:          ₹___                     ║
║  Customer Acquisition Cost: ₹___                     ║
║  Lifetime Value (projected):₹___                     ║
║                                                      ║
║  Top Performing City:       ___                       ║
║  Top Performing Creative:   ___                       ║
║  Avg Savings Shown:         ₹___/month               ║
║  Most Common Current Bank:  ___                       ║
║  Most Common Car Age:       ___ years                 ║
║                                                      ║
║  Key Insight for Sprint 2:  ___________________      ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

---

## Daily Tracking Spreadsheet Template

### Columns

| Col | Field | Source | Type |
|-----|-------|--------|------|
| A | Date | — | Date |
| B | Day # | =A2-start_date | Formula |
| C | Ad Spend (₹) | Meta Ads Manager | Manual |
| D | Impressions | Meta Ads Manager | Manual |
| E | Clicks | Meta Ads Manager | Manual |
| F | CTR (%) | =E/D*100 | Formula |
| G | CPC (₹) | =C/E | Formula |
| H | Visitors | GA4 | Manual |
| I | Calculator Starts | GA4 | Manual |
| J | Calculator Completions | GA4 / DB | Manual |
| K | Leads | DB / Sheet | Manual |
| L | CPL (₹) | =C/K | Formula |
| M | Visitor→Lead % | =K/H*100 | Formula |
| N | Cumulative Leads | =SUM($K$2:K2) | Formula |
| O | Connected Calls | Sales team | Manual |
| P | Docs Received | Sales team | Manual |
| Q | Bank Submitted | Ops team | Manual |
| R | Notes/Actions | — | Manual |

### Conditional Formatting Rules
- CPL (L) → Green if < ₹120, Yellow if ₹120-₹180, Red if > ₹180
- CTR (F) → Green if > 2%, Yellow if 1-2%, Red if < 1%
- Conversion (M) → Green if > 8%, Yellow if 4-8%, Red if < 4%
- Cumulative Leads (N) → Green if on track for weekly target

### Daily Formula Dashboard (Row 1 - Summary)

```
Today's Spend:        =INDEX(C:C, MATCH(TODAY(), A:A, 0))
Today's Leads:        =INDEX(K:K, MATCH(TODAY(), A:A, 0))
Running Avg CPL:      =SUM(C:C)/SUM(K:K)
Days to 100 Leads:    =(100-SUM(K:K))/(SUM(K:K)/COUNT(K:K))
Budget Remaining:     =20000-SUM(C:C)
Projected Total Leads:=SUM(K:K)/COUNT(K:K)*28
```

---

## Contingency Plans

### If CPL > ₹200 (After Week 1)

**Diagnosis:**
1. Check CTR — if < 1%, creative is the problem
2. Check landing page conversion — if < 15%, UX is the problem
3. Check audience size — if < 50K, targeting is too narrow

**Actions:**
1. Pause all ads for 24 hours
2. Create 3 completely new creatives (different angle, not just copy change)
3. Expand audience (remove interest narrowing, go broader)
4. Test different ad format (video if using static, static if using video)
5. Check mobile experience (most traffic is mobile)
6. Re-launch with ₹100/day per new ad set
7. If still > ₹200 after 5 more days → try Google Search Ads as alternative

### If Conversion < 20% (Calculator → Lead)

**Diagnosis:**
1. Where are users dropping? (check scroll depth, button clicks)
2. Is the savings number compelling? (if avg < ₹1,000/mo, might not motivate)
3. Is the form too long? (should be name + phone only)

**Actions:**
1. Reduce form to absolute minimum (phone number only)
2. Add urgency: "Rate available for limited time"
3. Add social proof: "X people checked today"
4. Make the savings number more prominent
5. Test auto-reveal: Show partial results, require phone for full report
6. Add trust signals: Bank logos, "100% free, no obligations"

### If Zero Leads After 48 Hours

**Emergency Checklist:**
- [ ] Is the website up? (Check UptimeRobot)
- [ ] Is the calculator returning results? (Test manually)
- [ ] Is the lead form submitting? (Test with own phone)
- [ ] Are notifications being received? (Check system)
- [ ] Are ads approved and delivering? (Check Meta Ads Manager)
- [ ] Is the landing page URL correct in ads? (Click your own ad)
- [ ] Is the Meta Pixel firing? (Check with Pixel Helper)
- [ ] Are there clicks but no page loads? (CDN/DNS issue)

### If Lead Quality Is Poor (< 30% Answer Rate)

**Possible Causes:**
- Fake phone numbers (spam/bot traffic)
- Audience is not actually car loan holders
- Time delay in calling (they forget they used calculator)

**Actions:**
1. Add phone OTP verification before showing full results
2. Narrow audience targeting (exclude under 25)
3. Implement response time SLA strictly (< 5 min)
4. Check for bot traffic patterns (same IP, rapid submissions)
5. Add CAPTCHA or rate limiting to form

---

## Validation Success/Failure Criteria

### DECLARE SUCCESS ✅ (Ready for Sprint 2)

All of the following must be true:
- [ ] 100 leads generated within 28 days
- [ ] Average CPL < ₹150
- [ ] Calculator → Lead conversion > 25%
- [ ] Lead → Connected Call rate > 60%
- [ ] At least 5 documents collected
- [ ] At least 2 bank submissions made
- [ ] At least 1 disbursal completed (or approval received)
- [ ] Clear best-performing city identified
- [ ] Clear best-performing creative identified
- [ ] Unit economics projectable: CAC < expected commission

### If SUCCESS → Sprint 2 Plan
- Scale budget to ₹2,000-₹3,000/day
- Hire 1 full-time sales executive
- Add 3 more cities
- Build CRM (upgrade from Google Sheets)
- Target: 500 leads in month 2

### DECLARE FAILURE ❌ (Pivot Required)

Any of the following after 28 days:
- [ ] Unable to get CPL below ₹250 despite optimization
- [ ] Calculator conversion consistently < 15%
- [ ] Zero bank approvals from 10+ submissions
- [ ] Total spend > ₹25,000 with < 50 leads
- [ ] Lead quality: < 30% answer rate after OTP added

### If FAILURE → Pivot Options
1. **Channel pivot**: Try Google Search Ads (higher intent, higher CPC but better quality)
2. **Audience pivot**: Target new car buyers instead of refinance
3. **Product pivot**: Offer loan comparison (new loans) instead of refinance
4. **Distribution pivot**: Partner with used car dealers for referrals
5. **Geography pivot**: Focus on single city with offline + online approach

---

## Budget Allocation Summary

| Week | Daily Budget | Weekly Spend | Cumulative Spend | Projected Cumulative Leads |
|------|-------------|-------------|-----------------|--------------------------|
| Week 1 | ₹450 (3 cities × ₹150) | ₹3,150 | ₹3,150 | 15-25 |
| Week 2 | ₹750 (5 cities, varied) | ₹5,250 | ₹8,400 | 50-75 |
| Week 3 | ₹900 (scaled winners) | ₹6,300 | ₹14,700 | 85-125 |
| Week 4 | ₹1,000 (final push) | ₹4,900* | ₹19,600 | 100-140 |
| **Total** | **Avg ₹700** | | **₹19,600** | **100-140** |

*Week 4 may be shorter if 100 leads achieved early.

### Budget Rules
- Never exceed ₹25,000 total without founder approval
- Daily spend cap: ₹1,200 maximum
- If CPL > ₹200 for 3 days straight: Reduce to ₹300/day while optimizing
- Keep ₹3,000 reserve for testing new channels if Meta doesn't work

---

## Team Roles During Validation

| Role | Person | Responsibility | Time Commitment |
|------|--------|---------------|-----------------|
| Marketing | Founder/Hire | Ad management, analytics, optimization | 2 hours/day |
| Sales | Founder/Hire | Lead calling, qualification, WhatsApp | 4 hours/day |
| Operations | Founder | Document collection, bank coordination | 2 hours/day |
| Engineering | Developer | Bug fixes, analytics verification, deployment | 1 hour/day (on-call) |
| Finance | Founder | Budget tracking, unit economics, commission tracking | 30 min/day |

### Minimum Viable Team
- **Solo founder**: Can run this alone for Week 1-2 (10-15 leads/week manageable)
- **With 1 hire**: Sales executive handles calling (founder focuses on marketing + ops)
- **Ideal for 100 leads**: Founder + 1 sales executive + part-time developer support

---

## Key Milestones & Celebrations

| Milestone | Expected Date | Celebration | Significance |
|-----------|---------------|-------------|--------------|
| First ad live | Day 3 | 🎯 Screenshot, share with team | The machine is running |
| First visitor from ad | Day 3-4 | ✅ | Ads → Website pipeline works |
| First calculator completion | Day 3-4 | ✅ | Product delivers value |
| First lead captured | Day 4-5 | 🎉 | Someone trusted us with their phone |
| First connected call | Day 4-5 | 📞 | Real human conversation about our product |
| 10th lead | Day 7-10 | ⭐ | Pattern emerging, not just luck |
| First document collected | Day 10-14 | 📄 | Someone committed to the process |
| First bank submission | Day 14-18 | 🏦 | Business is REAL, banks involved |
| 50th lead | Day 14-18 | 🎯 | Halfway there! |
| First approval | Day 18-25 | 🎊 | Banks validate our value prop |
| **100th lead** | **Day 25-28** | **🚀** | **Validation COMPLETE** |
| First disbursal | Day 25-30 | 💰 | **REVENUE!** |

---

## Post-100 Leads: What Happens Next

### Immediate (Day 28-30)
1. Compile all data into validation scorecard
2. Calculate true unit economics (CAC vs. projected LTV)
3. Identify top 3 learnings
4. Decide: Scale, iterate, or pivot

### If Scaling (Month 2 Plan)
- Budget: ₹2,000-₹3,000/day (₹60K-₹90K/month)
- Target: 500 leads
- Hire: 1 dedicated sales executive
- Add: 3 new cities
- Build: Basic CRM (Airtable or custom)
- Goal: 10 disbursals, ₹80,000 revenue

### The Only Question That Matters at Day 28

> "Can we acquire a customer for less than the commission we earn from them?"
>
> If YES → Scale immediately
> If NO but close → Optimize funnel, try for 30 more days
> If NO and far off → Pivot the model

---

*Last Updated: January 2025*
*Owner: Founder*
*Status: Pre-Launch*
*Review: Daily during execution*
