# Go-Live Sign-Off — MotoFin

## Overview

This document serves as the formal go-live decision record for MotoFin production launch. All checklist items must pass before Meta Ads campaigns are activated and the product is publicly available.

**Target Launch URL:** https://motofin.in
**Date:** _______________

---

## Pre-Launch Checklist

All 10 items must pass for a GO decision.

### Infrastructure

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | **Supabase Ready** — Database provisioned, tables created, RLS policies active, connection pooling enabled (port 6543) | ☐ Pass / ☐ Fail | |
| 2 | **Railway Ready** — API service deployed, health endpoint responding, environment variables set, custom domain configured | ☐ Pass / ☐ Fail | |
| 3 | **Vercel Ready** — Frontend deployed from `main` branch, build succeeding, correct root directory (`apps/web`) | ☐ Pass / ☐ Fail | |
| 4 | **SSL Active** — HTTPS certificates provisioned for `motofin.in` and `www.motofin.in`, no mixed content warnings | ☐ Pass / ☐ Fail | |

### Data & APIs

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5 | **Database Seeded** — Required lookup tables populated, Prisma migrations applied, no pending schema changes | ☐ Pass / ☐ Fail | |
| 6 | **APIs Working** — Savings calculator, pre-approval, and lead capture endpoints return correct responses | ☐ Pass / ☐ Fail | |
| 7 | **Smoke Tests Passing** — All 9 production smoke tests pass (see PRODUCTION-SMOKE-TESTS.md) | ☐ Pass / ☐ Fail | |
| 8 | **Test Lead Created** — End-to-end lead submission works, lead appears in Supabase `leads` table | ☐ Pass / ☐ Fail | |

### Analytics & Marketing

| # | Item | Status | Notes |
|---|------|--------|-------|
| 9 | **Analytics Installed** — Google Analytics 4 firing on page load, events tracked for calculator interactions | ☐ Pass / ☐ Fail | |
| 10 | **Meta Pixel Installed** — Facebook Pixel fires on page load, PageView event confirmed in Meta Events Manager | ☐ Pass / ☐ Fail | |

---

## Decision Criteria

### GO Decision

**ALL 10 items must show "Pass"** for a GO decision.

When all items pass:

> **DECISION: GO**
>
> MotoFin is cleared for production launch and Meta Ads can begin.
>
> The application has been verified across infrastructure, APIs, data persistence, and analytics tracking. All smoke tests pass and the end-to-end user flow is functional.

### NO-GO Decision

**ANY item showing "Fail"** results in a NO-GO decision.

When one or more items fail:

> **DECISION: NO-GO**
>
> The following items must be resolved before launch:
>
> 1. _______________________________________________
> 2. _______________________________________________
> 3. _______________________________________________
>
> **Assigned To:** _______________
> **Target Resolution Date:** _______________
> **Re-evaluation Scheduled:** _______________

---

## Sign-Off Table

| Role | Name | Date | Status |
|------|------|------|--------|
| CTO | | | ☐ Approved / ☐ Rejected |
| Engineering Lead | | | ☐ Approved / ☐ Rejected |
| Marketing Lead | | | ☐ Approved / ☐ Rejected |

> All three roles must approve for GO. Any rejection triggers a NO-GO with documented reasons.

---

## Post-Launch Monitoring — First 24 Hours

After the GO decision is confirmed and Meta Ads are activated, the engineering team must monitor production for the first 24 hours.

### Monitoring Cadence

**Check every 2 hours** for the first 24 hours:

| Time | Uptime | Error Rate | Leads Received | Action Required |
|------|--------|------------|----------------|-----------------|
| +0h (launch) | ☐ OK | ☐ OK | ☐ First lead | |
| +2h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +4h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +6h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +8h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +10h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +12h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +14h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +16h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +18h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +20h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +22h | ☐ OK | ☐ OK | ☐ Count: ___ | |
| +24h | ☐ OK | ☐ OK | ☐ Count: ___ | |

### What to Check

1. **Uptime** — Health endpoint (`GET /api/health`) returns `200` with `status: "ok"`
2. **Error Rate** — Railway logs show no 5xx errors; Vercel logs show no build failures
3. **First Leads** — Confirm leads are appearing in Supabase `leads` table within first 1–2 hours of ad spend
4. **Analytics** — GA4 Real-time report shows active users; Meta Events Manager shows Pixel activity
5. **Performance** — Pages load in < 3 seconds; API responses in < 500ms

### Escalation Triggers

Immediately escalate if:

- [ ] Health endpoint returns non-200 for more than 5 minutes
- [ ] Error rate exceeds 5% of requests
- [ ] Zero leads received after 4 hours of active ad spend
- [ ] Database connection errors appear in logs
- [ ] SSL certificate warning appears on the site

### Escalation Contacts

| Priority | Contact | Channel |
|----------|---------|---------|
| P1 — Site Down | Engineering Lead | Phone + Slack |
| P2 — Errors Increasing | Engineering Lead | Slack |
| P3 — No Leads | CTO + Marketing | Slack |

---

## Post-Launch Success Criteria (24-Hour Mark)

At the 24-hour mark, confirm:

- [ ] Site has been continuously available (> 99.5% uptime)
- [ ] Total error rate < 1%
- [ ] At least 1 lead has been captured per hour of ad spend
- [ ] No data loss or corruption detected
- [ ] Analytics data flowing correctly to GA4 and Meta

If all criteria are met, MotoFin launch is confirmed successful. Transition to standard monitoring cadence.

---

## Document History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | | | Initial go-live sign-off document |
