# MotoFin Founder Dashboard Specification

## Overview

A lightweight, zero-cost founder dashboard using Google Sheets + GA4 to track the 10 most critical metrics during validation. No paid tools, no engineering time for dashboards — just a spreadsheet that tells you if the business is working.

---

## 10 Key Metrics

| # | Metric | Formula | Data Source | Refresh Rate | Owner | Day 1 Target | Week 1 Target | Month 1 Target |
|---|--------|---------|-------------|--------------|-------|-------------|--------------|----------------|
| 1 | Visitors | GA4 pageviews on `/` | GA4 Real-time | Real-time | Marketing | 30 | 200 | 3,000 |
| 2 | Calculator Starts | `calculator_started` events | GA4 Events | Real-time | Marketing | 20 | 150 | 2,000 |
| 3 | Calculator Completions | `calculator_completed` events | GA4 / DB count | 5 min | Marketing | 8 | 60 | 800 |
| 4 | Lead Captures | `leads` table count (status=NEW+) | Database query | 5 min | Sales | 3 | 25 | 300 |
| 5 | Connected Calls | Leads where status >= CONTACTED | CRM / Manual | Daily | Sales | 1 | 15 | 200 |
| 6 | Documents Received | Leads where status = DOCS_RECEIVED | CRM / Manual | Daily | Operations | 0 | 5 | 50 |
| 7 | Bank Submissions | Leads where status = BANK_SUBMITTED | CRM / Manual | Daily | Operations | 0 | 2 | 20 |
| 8 | Approvals | Leads where status = APPROVED | CRM / Manual | Daily | Operations | 0 | 1 | 8 |
| 9 | Disbursals | Leads where status = DISBURSED | CRM / Manual | Daily | Finance | 0 | 0 | 3 |
| 10 | Revenue | SUM(commission) from disbursals | Manual / Bank MIS | Weekly | Founder | ₹0 | ₹0 | ₹24,000 |

---

## Funnel Conversion Rates (Derived Metrics)

| Stage | Formula | Healthy Target | Action If Below |
|-------|---------|---------------|-----------------|
| Visit → Calculator Start | Calc Starts / Visitors | > 60% | Fix landing page CTA |
| Calculator Start → Complete | Completions / Starts | > 40% | Simplify calculator UX |
| Complete → Lead Capture | Leads / Completions | > 25% | Improve value proposition |
| Lead → Connected Call | Connected / Leads | > 70% | Faster response time |
| Connected → Docs Received | Docs / Connected | > 40% | Better qualification |
| Docs → Bank Submitted | Submitted / Docs | > 80% | Ops efficiency |
| Submitted → Approved | Approved / Submitted | > 50% | Better bank matching |
| Approved → Disbursed | Disbursed / Approved | > 70% | Customer follow-through |

---

## Google Sheets Dashboard Template

### Sheet 1: Daily Tracker

| Column | Header | Formula/Input |
|--------|--------|---------------|
| A | Date | Manual (YYYY-MM-DD) |
| B | Ad Spend (₹) | Manual from Meta Ads Manager |
| C | Visitors | Manual from GA4 |
| D | Calculator Starts | Manual from GA4 |
| E | Calculator Completions | Manual from GA4 |
| F | Leads | Manual from DB / Supabase |
| G | Connected Calls | Manual (sales team) |
| H | Docs Received | Manual (ops team) |
| I | Bank Submitted | Manual (ops team) |
| J | Approvals | Manual (ops team) |
| K | Disbursals | Manual (ops team) |
| L | Revenue (₹) | Manual (from bank) |
| M | CPL (₹) | `=B2/F2` |
| N | Visit→Lead % | `=F2/C2*100` |
| O | Lead→Connected % | `=G2/F2*100` |
| P | Notes | Free text |

### Sheet 2: Weekly Summary

```
=== FORMULAS ===

Weekly Visitors:        =SUMPRODUCT((WEEKNUM(A:A)=WEEKNUM(TODAY()))*(C:C))
Weekly Leads:           =SUMPRODUCT((WEEKNUM(A:A)=WEEKNUM(TODAY()))*(F:F))
Weekly Spend:           =SUMPRODUCT((WEEKNUM(A:A)=WEEKNUM(TODAY()))*(B:B))
Weekly CPL:             =Weekly_Spend/Weekly_Leads
Week-over-Week Growth:  =(This_Week_Leads - Last_Week_Leads) / Last_Week_Leads * 100

Cumulative Leads:       =SUM(F:F)
Cumulative Revenue:     =SUM(L:L)
Cumulative Spend:       =SUM(B:B)
ROI:                    =(Cumulative_Revenue - Cumulative_Spend) / Cumulative_Spend * 100
```

### Sheet 3: Funnel Visualization

```
| Stage               | Count | Conv Rate | Target | Status  |
|---------------------|-------|-----------|--------|---------|
| Visitors            | =SUM  | —         | 3000   | =IF()   |
| Calculator Starts   | =SUM  | =D/C*100  | 2000   | =IF()   |
| Completions         | =SUM  | =E/D*100  | 800    | =IF()   |
| Leads               | =SUM  | =F/E*100  | 300    | =IF()   |
| Connected Calls     | =SUM  | =G/F*100  | 200    | =IF()   |
| Docs Received       | =SUM  | =H/G*100  | 50     | =IF()   |
| Bank Submitted      | =SUM  | =I/H*100  | 20     | =IF()   |
| Approved            | =SUM  | =J/I*100  | 8      | =IF()   |
| Disbursed           | =SUM  | =K/J*100  | 3      | =IF()   |

Status formula: =IF(actual >= target, "✅ ON TRACK", "⚠️ BELOW TARGET")
```

### Sheet 4: City Performance

| City | Spend | Leads | CPL | Conv Rate | Status |
|------|-------|-------|-----|-----------|--------|
| Hyderabad | Manual | Manual | =Spend/Leads | =Leads/Visitors | Auto |
| Bangalore | Manual | Manual | =Spend/Leads | =Leads/Visitors | Auto |
| Mumbai | Manual | Manual | =Spend/Leads | =Leads/Visitors | Auto |
| Chennai | Manual | Manual | =Spend/Leads | =Leads/Visitors | Auto |
| Pune | Manual | Manual | =Spend/Leads | =Leads/Visitors | Auto |

---

## Daily Check Routine (10 Minutes Every Morning)

### Morning Check (9:00 AM)

```
DAILY DASHBOARD ROUTINE
═══════════════════════

□ Step 1: Open GA4 Real-time (2 min)
  - Check yesterday's total visitors
  - Check calculator_start events
  - Check calculator_complete events
  - Note any anomalies (zero traffic? spike?)

□ Step 2: Check Supabase (2 min)
  - Open Table Editor → leads table
  - Count new leads since yesterday
  - Check lead status distribution

□ Step 3: Check Meta Ads Manager (3 min)
  - Yesterday's spend
  - Impressions, clicks, CTR
  - Cost per result (Lead events)
  - Compare to budget (₹700/day target)

□ Step 4: Update Google Sheet (2 min)
  - Fill in yesterday's row
  - Check CPL and conversion rates
  - Flag anything below target

□ Step 5: One Decision (1 min)
  - Is anything broken? → Fix immediately
  - Is CPL too high? → Pause worst ad set
  - Is conversion low? → Check calculator flow
  - All good? → Continue as-is
```

### What to Look For Each Morning

| Signal | Meaning | Action |
|--------|---------|--------|
| Zero visitors | Ads paused or site down | Check UptimeRobot + Meta Ads |
| Visitors but no calc starts | Landing page not convincing | A/B test headline |
| Calc starts but no completions | Calculator UX broken | Test calculator flow |
| Completions but no leads | Lead form friction | Simplify form fields |
| Leads but no connects | Slow call response | Check team SLA |
| CPL > ₹200 | Ads underperforming | Pause, test new creative |
| CPL < ₹80 | Outperforming | Scale budget +50% |

---

## Weekly Review Format (30 Minutes, Every Monday)

### Agenda

```
WEEKLY REVIEW - Week [X]
════════════════════════

1. NUMBERS (5 min)
   □ Total visitors this week: ___
   □ Total leads this week: ___
   □ Total spend this week: ₹___
   □ Average CPL: ₹___
   □ Funnel conversion rate: ___%
   □ Connected calls: ___
   □ Documents collected: ___
   □ Bank submissions: ___

2. WINS (5 min)
   □ What worked well?
   □ Best performing city:
   □ Best performing creative:
   □ Lowest CPL achieved:

3. PROBLEMS (10 min)
   □ What didn't work?
   □ Biggest drop-off point:
   □ Wasted spend on:
   □ Operational bottleneck:

4. DECISIONS (10 min)
   □ Continue: (what to keep doing)
   □ Stop: (what to kill)
   □ Start: (what to try next week)
   □ Scale: (what to invest more in)
   □ Budget adjustment for next week: ₹___
```

### Weekly Report Template (to share with team/investors)

```
Week [X] Summary
─────────────────
Spend: ₹___  |  Leads: ___  |  CPL: ₹___
Connected: ___  |  Docs: ___  |  Submitted: ___

Key Metric: [Most important number and what it means]
Key Win: [Best thing that happened]
Key Risk: [Biggest concern]
Next Week Focus: [One sentence]
```

---

## Decision Triggers

### When to SCALE (Increase Budget)

| Trigger | Action | New Budget |
|---------|--------|------------|
| CPL < ₹100 for 3 consecutive days | Increase budget 50% | ₹1,050/day |
| Conversion rate > 30% consistently | Add new city | +₹200/day |
| Connected call rate > 70% | Scale winning ad set 2x | Double top performer |
| First disbursal completed | Validate economics, plan 2x scale | ₹1,500/day |

### When to PAUSE (Stop Spending)

| Trigger | Action | Duration |
|---------|--------|----------|
| CPL > ₹300 for 2 days | Pause all ads | Until new creative ready |
| Zero leads in 24 hours | Check technical issues | Until fixed |
| No connected calls in 3 days | Fix sales process | Until SLA met |
| Calculator completion rate < 15% | Fix UX | Until completion rate > 30% |

### When to PIVOT (Major Change)

| Trigger | Meaning | Options |
|---------|---------|---------|
| CPL > ₹250 after 2 weeks optimization | Channel not working | Try Google Ads, organic content |
| Lead → Connected < 30% | Wrong audience | Refine targeting |
| Connected → Docs < 15% | Value prop not compelling | Rethink offering |
| Zero disbursals after 50 leads | Banks not approving | Check eligibility criteria |

### Validation SUCCESS Criteria

```
DECLARE SUCCESS WHEN:
✅ 100 leads generated
✅ CPL < ₹150 sustained
✅ Calculator → Lead conversion > 25%
✅ Lead → Connected Call > 60%
✅ At least 3 disbursals completed
✅ Unit economics positive (revenue > acquisition cost per customer)

DECLARE FAILURE WHEN (after 30 days):
❌ Unable to get CPL below ₹250
❌ Calculator conversion consistently < 15%
❌ Zero bank approvals from 30+ submissions
❌ Total spend > ₹30,000 with < 50 leads
```

---

## Tools & Access Required

| Tool | Cost | Purpose | Access |
|------|------|---------|--------|
| Google Sheets | Free | Dashboard | Founder + Team |
| GA4 | Free | Web analytics | Marketing |
| Meta Ads Manager | Free (tool) | Ad management | Marketing |
| Supabase Dashboard | Free | Database inspection | Engineering |
| UptimeRobot | Free | Uptime monitoring | Engineering |
| Meta Events Manager | Free | Event verification | Marketing |

**Total cost for dashboard & analytics tools: ₹0**

---

## Setting Up GA4 Connection (No-Code)

### Option A: Manual Daily Update (Recommended for Validation)
- Open GA4 → Reports → Events → Copy numbers daily
- Takes 2 minutes/day
- Most reliable, no setup needed

### Option B: GA4 → Google Sheets (Automated)
1. Install Google Analytics add-on for Sheets
2. Create report configuration:
   - Metrics: `eventCount`
   - Dimensions: `eventName`, `date`
   - Date range: Last 7 days
3. Schedule auto-refresh daily at 8 AM
4. Formulas pull from auto-updated data

### Option C: Supabase → Google Sheets (For Lead Data)
1. Use Supabase REST API
2. Google Apps Script to fetch daily:
```javascript
function fetchLeadCount() {
  const url = 'https://[PROJECT].supabase.co/rest/v1/leads?select=count';
  const options = {
    headers: {
      'apikey': '[ANON_KEY]',
      'Authorization': 'Bearer [ANON_KEY]'
    }
  };
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  // Write to specific cell
  SpreadsheetApp.getActive().getSheetByName('Daily').getRange('F2').setValue(data[0].count);
}
```
3. Set trigger: Daily at 8:30 AM

---

## Dashboard Access & Sharing

| Role | Access Level | What They See |
|------|-------------|---------------|
| Founder | Full edit | All sheets, all data |
| Marketing | Edit (Sheet 1, 4) | Daily numbers, city performance |
| Sales | Edit (Sheet 1, col G-H) | Connected calls, docs received |
| Operations | Edit (Sheet 1, col I-K) | Bank submissions, approvals |
| Investor | View only | Weekly summary sheet |

---

## Sample Day 7 Dashboard

```
╔══════════════════════════════════════════════════╗
║           MOTOFIN - DAY 7 DASHBOARD             ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  VISITORS:      187 / 200 target     ✅ 94%     ║
║  CALC STARTS:   142 / 150 target     ✅ 95%     ║
║  COMPLETIONS:    52 / 60 target      ⚠️ 87%     ║
║  LEADS:          22 / 25 target      ⚠️ 88%     ║
║  CONNECTED:      14 / 15 target      ✅ 93%     ║
║  DOCS RECEIVED:   4 / 5 target       ⚠️ 80%     ║
║  BANK SUBMITTED:  1 / 2 target       ⚠️ 50%     ║
║  APPROVED:        0 / 1 target       ❌ 0%      ║
║  DISBURSED:       0 / 0 target       ✅ N/A     ║
║  REVENUE:        ₹0 / ₹0 target     ✅ N/A     ║
║                                                  ║
║  SPEND THIS WEEK: ₹4,900                        ║
║  AVERAGE CPL: ₹223                              ║
║  TOP CITY: Hyderabad (9 leads, ₹156 CPL)       ║
║                                                  ║
║  ACTION: CPL slightly high. Pause Mumbai ad set  ║
║          (₹340 CPL). Scale Hyderabad +50%.       ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

---

*Last Updated: January 2025*
*Owner: Founder*
*Review Frequency: Daily (quick check) + Weekly (full review)*
