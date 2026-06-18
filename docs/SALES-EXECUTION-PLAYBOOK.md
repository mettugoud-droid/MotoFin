# MotoFin Sales Execution Playbook

## Overview

Complete sales execution guide for converting MotoFin calculator leads into refinance disbursals. Covers the entire journey from lead notification to bank disbursal, with scripts, cadences, and escalation procedures.

---

## Lead Response SLA

| Priority | Trigger | Response Time | Channel |
|----------|---------|---------------|---------|
| Immediate | New lead submitted | Within 5 minutes | Phone call |
| Fallback | No answer on first call | Within 10 minutes | WhatsApp message |
| Follow-up 1 | No response to WhatsApp | Within 24 hours | Second call |
| Follow-up 2 | Still no contact | Within 48 hours | WhatsApp + SMS |
| Final | No response after 7 days | Day 7 | Close as cold |

### Why 5-Minute Response Matters
- Lead conversion drops 80% after 5 minutes
- The person just used the calculator — they're thinking about their loan RIGHT NOW
- Competitors (banks, other DSAs) may also be reaching them
- First to connect = highest conversion probability

---

## Lead Status Lifecycle

```
NEW → CONTACTED → QUALIFIED → DOCS_REQUESTED → DOCS_RECEIVED → BANK_SUBMITTED → APPROVED → DISBURSED
                                                                                          ↓
                                                                               REJECTED → ALTERNATE_BANK
                                                                                          ↓
                                                                               CLOSED (with reason)
```

### Status Definitions

| Status | Definition | Next Action |
|--------|-----------|-------------|
| NEW | Lead just submitted, not yet called | Call within 5 min |
| CONTACTED | Spoke with lead, initial conversation done | Qualify interest |
| QUALIFIED | Confirmed interested, meets basic criteria | Request documents |
| DOCS_REQUESTED | Documents list shared with customer | Follow up in 2 days |
| DOCS_RECEIVED | All documents collected | Submit to bank |
| BANK_SUBMITTED | Application submitted to partner bank | Wait for bank response |
| APPROVED | Bank approved the refinance | Coordinate disbursal |
| DISBURSED | Loan disbursed, commission earned | Close as won |
| REJECTED | Bank rejected application | Offer alternate bank |
| NOT_INTERESTED | Lead not interested in refinancing | Close with reason |
| INVALID | Wrong number, fake details | Remove from pipeline |

---

## Call Script: First Contact

### Opening (30 seconds)

```
"Hi [Name], this is [Executive Name] from MotoFin.

You recently checked your car loan savings on our calculator.
I can see you could save approximately ₹[monthly_saving] per month on your EMI.

Can I take 2 minutes to explain how this works?"
```

### If YES (proceed to qualification):

```
"Great! So here's how refinancing works in simple terms:

Your current car loan is at [current_rate]% interest.
Banks like HDFC, ICICI, and Kotak are now offering [new_rate]% for refinance.

This means your EMI drops from ₹[current_emi] to approximately ₹[new_emi].
That's ₹[monthly_saving] saved every single month, with zero penalty in most cases.

I just need to ask you a few quick questions to check if you qualify.
This will take about 2 minutes."
```

### If NOT NOW / BUSY:

```
"I completely understand. When would be a good time for me to call back?
I'll schedule it and call you exactly at that time.

Just so you know — there's no fee for checking your eligibility,
and it doesn't affect your CIBIL score.

What time works for you — morning or evening?"
```

### If NOT INTERESTED:

```
"No problem at all. May I know what's holding you back?
Is it that you're happy with your current rate, or something else?

[Listen to objection, handle if possible, otherwise close gracefully]

If you change your mind in the future, feel free to use our calculator again.
Your savings are likely to increase as rates drop further.

Have a great day!"
```

---

## Qualification Questions

Ask these 5 questions during the first call (or WhatsApp if they prefer text):

### Question Set

| # | Question | Why We Ask | Ideal Answer |
|---|----------|-----------|--------------|
| 1 | Which bank is your current car loan with? | Know existing lender | Any bank (some offer better switch rates) |
| 2 | What is your current monthly EMI? | Verify calculator input | ₹10,000-₹50,000 |
| 3 | How many months are remaining on your loan? | Calculate outstanding | 12-48 months (sweet spot: 18-36) |
| 4 | Are you salaried or self-employed? | Bank eligibility criteria | Salaried (easier approval) |
| 5 | Which city do you reside in? | Bank branch availability | Metro cities preferred |

### Bonus Questions (if they're engaged)

| # | Question | Purpose |
|---|----------|---------|
| 6 | What was your car's purchase price? | Estimate current value |
| 7 | What year is your car? | Newer = easier refinance |
| 8 | Any missed EMI payments in last 12 months? | CIBIL impact check |
| 9 | Do you have a CIBIL score above 700? | Quick eligibility filter |

### Qualification Criteria (Move to QUALIFIED if all YES)

- [ ] Outstanding amount > ₹2,00,000
- [ ] Remaining tenure > 12 months
- [ ] Current rate > 10% (meaningful savings possible)
- [ ] No missed payments in last 6 months
- [ ] Salaried OR self-employed with ITR
- [ ] Lives in a city with partner bank branch

---

## WhatsApp Message Templates

### Template 1: First Contact (After Missed Call)

```
Hi [Name] 👋

This is [Executive] from MotoFin.

I just tried calling you regarding the car loan savings calculator you used.

Based on your inputs, you could save approximately ₹[saving]/month on your car loan EMI.

Would you like me to explain how this works? It takes just 2 minutes and there's no cost or obligation.

Reply "YES" and I'll call you at a convenient time, or feel free to ask any questions here!
```

### Template 2: Savings Summary (After Qualification)

```
Hi [Name] 👋

Thanks for speaking with me! Here's your refinance summary:

📊 *Your Savings Estimate*
━━━━━━━━━━━━━━━━━━
Current EMI: ₹[current_emi]
New EMI: ₹[new_emi]
Monthly Saving: ₹[saving]
Total Saving: ₹[total_saving]
Best Rate Available: [rate]%
Recommended Bank: [bank]

*Next Step:* Share the following documents and I'll get your application processed within 48 hours.

📋 Documents needed:
1. PAN Card
2. Aadhaar Card
3. Last 3 months bank statement
4. Last 3 salary slips
5. RC Book (vehicle registration)
6. Current loan statement
7. Insurance copy

You can share photos/PDFs right here on WhatsApp.

Any questions? I'm here to help! 🙂
```

### Template 3: Document Reminder (Day 2)

```
Hi [Name] 👋

Just following up on the documents for your car loan refinance.

You stand to save ₹[saving]/month — that's ₹[annual_saving]/year that stays in your pocket!

Have you been able to gather the documents? I can help if you're stuck on any of them.

Reply here or I can call you — whichever is easier. 🙂
```

### Template 4: Limited Time Urgency (Day 5)

```
Hi [Name],

Quick update — the [bank] rate of [rate]% that I quoted for your refinance is based on current offers.

Bank rates can change without notice, and I'd hate for you to miss out on ₹[total_saving] in savings.

If you can share the documents this week, I can lock in the current rate for you.

Need help with anything? Just reply here. 🙂
```

### Template 5: Final Attempt (Day 7)

```
Hi [Name],

This is my last follow-up regarding your car loan refinance.

Just a reminder — you could save ₹[saving] every month with zero penalty.

If you decide to explore this later, you can always use our calculator again at motofin.in.

Wishing you all the best! 🙂
```

---

## Document Checklist

### Required Documents (All Applicants)

| # | Document | Format | Notes |
|---|----------|--------|-------|
| 1 | PAN Card | Photo/PDF | Both sides |
| 2 | Aadhaar Card | Photo/PDF | Both sides, can be masked Aadhaar |
| 3 | Last 3 months bank statement | PDF (preferred) | Account where EMI is debited |
| 4 | RC Book | Photo/PDF | Vehicle Registration Certificate |
| 5 | Current loan statement | PDF/Photo | Showing outstanding, rate, tenure |
| 6 | Vehicle insurance | PDF/Photo | Valid, not expired |

### Additional Documents (Salaried)

| # | Document | Format | Notes |
|---|----------|--------|-------|
| 7 | Last 3 salary slips | PDF/Photo | Must show net salary |
| 8 | Employment ID | Photo | Optional but helps |

### Additional Documents (Self-Employed)

| # | Document | Format | Notes |
|---|----------|--------|-------|
| 7 | Last 2 years ITR | PDF | With computation sheet |
| 8 | GST registration | PDF | If applicable |
| 9 | Business proof | Photo/PDF | Shop license, Udyam, etc. |

### Document Collection Best Practices
- Accept WhatsApp photos (fastest for customer)
- Verify readability before confirming receipt
- Check PAN name matches bank statement name
- Verify loan outstanding matches what customer stated
- Flag any discrepancies immediately (don't submit to bank with issues)

---

## Disposition Codes & Actions

| Code | Meaning | Immediate Action | Follow-up Action |
|------|---------|-----------------|------------------|
| INTERESTED | Wants to proceed | Move to QUALIFIED, send doc list | Follow up in 2 days for docs |
| NOT_INTERESTED | Doesn't want to refinance | Ask reason, log it | None (close lead) |
| CALLBACK | Wants to be called later | Schedule specific date/time | Call at exact scheduled time |
| NOT_REACHABLE | Phone rings, no answer | Send WhatsApp template 1 | Try next day, different time |
| WRONG_NUMBER | Number doesn't belong to lead | Mark INVALID | None |
| ALREADY_REFINANCED | Already refinanced recently | Ask when, log details | None (close lead) |
| DOCUMENTS_PENDING | Interested but docs not ready | Set 2-day reminder | WhatsApp reminder on Day 2 |
| LOW_SAVING | Saving < ₹500/month | Explain total saving over tenure | Close if not interested |
| BANK_ISSUE | Bad CIBIL / past defaults | Explain what's needed | Suggest CIBIL improvement steps |
| THINKING | Needs time to decide | Respect timeline | Follow up as per cadence |

### Disposition Analysis (Weekly)
Track disposition distribution to identify patterns:
- If > 30% NOT_REACHABLE → Problem with lead quality or response time
- If > 20% NOT_INTERESTED → Problem with calculator expectations vs. reality
- If > 15% WRONG_NUMBER → Problem with data quality or spam leads
- If > 40% DOCUMENTS_PENDING → Simplify document process

---

## Follow-Up Cadence

### Standard Follow-Up Schedule

| Day | Time | Channel | Action | Message |
|-----|------|---------|--------|---------|
| Day 0 | Within 5 min | Phone | First call | Opening script |
| Day 0 | Within 10 min | WhatsApp | If no answer | Template 1 (intro) |
| Day 1 | Different time | Phone | Second call | "Following up on yesterday" |
| Day 1 | After call | WhatsApp | If no answer | "Tried calling again..." |
| Day 2 | — | WhatsApp | Savings summary | Template 2 (detailed savings) |
| Day 3 | — | Phone | Third call | Last phone attempt |
| Day 5 | — | WhatsApp | Urgency message | Template 4 (limited time) |
| Day 7 | — | WhatsApp | Final attempt | Template 5 (closing) |

### After Day 7 (No Response)
- Mark as COLD
- Move to drip list (monthly savings reminder email)
- Do not call again unless they re-engage

### Document Collection Follow-Up

| Day After Request | Channel | Message |
|------------------|---------|---------|
| Day 2 | WhatsApp | Template 3 (gentle reminder) |
| Day 4 | Phone call | "Need any help with documents?" |
| Day 6 | WhatsApp | "Can I help you get specific documents?" |
| Day 8 | WhatsApp | Final reminder + offer to collect physically |
| Day 10 | — | Escalate to manager |

---

## Objection Handling

### "I'll think about it"
```
"Of course, take your time. Just so you have the full picture —
the savings of ₹[saving]/month starts from the very first month after refinance.
Every month you wait is ₹[saving] you're paying extra in interest.

No pressure though — shall I call you this [day]? That gives you [X] days to think."
```

### "Will it affect my CIBIL score?"
```
"Great question. The refinance itself actually shows as a responsible financial decision.
There might be a small 5-10 point temporary dip from the bank inquiry,
but this recovers within 1-2 months.

The savings of ₹[total_saving] over the loan tenure is worth far more than a temporary dip.
Many of our customers actually see their score improve after 3 months."
```

### "My current bank might reduce the rate if I ask"
```
"That's a good thought! You can definitely try that.
However, in our experience, banks rarely match refinance rates proactively.
They might offer 0.25-0.50% reduction, while refinance can get you 2-3% lower.

Here's what I suggest — let me check your eligibility (no commitment),
and you'll have the new bank offer in hand.
Then you can ask your current bank to match it. Either way, you win."
```

### "I don't trust online services"
```
"I completely understand your concern.
MotoFin is a registered loan comparison platform.
We work with RBI-registered banks like HDFC, ICICI, and Kotak.

We don't handle any money — the loan is directly between you and the bank.
We just help you find a better rate and manage the paperwork.

Would you like me to share some details about our bank partnerships?"
```

### "The process seems complicated"
```
"I hear you, and that's exactly why we exist.
Here's the truth — we handle 90% of the work.

All you need to do is:
1. Share 7 documents (most people have them on their phone already)
2. Visit the bank branch once for verification (30 minutes)
3. Sign the new loan agreement

That's it. We handle the bank comparison, application, follow-up, and coordination.
The whole process takes 7-10 working days from document submission."
```

### "What's the catch? / What's your fee?"
```
"There's no fee from you at all. Zero.

We earn a commission from the bank when the refinance is successfully completed.
So our incentive is exactly aligned with yours — we only make money
when you actually save money.

If we can't find you a better rate, we'll tell you honestly. No point in wasting your time or ours."
```

---

## Escalation Procedures

### Escalation Matrix

| Situation | Escalate To | Timeline | Action |
|-----------|-------------|----------|--------|
| No contact after 3 attempts | Team Lead | Day 3 | Reassign to different executive |
| Document pending > 5 days | Manager | Day 5 | Manager calls customer directly |
| Bank rejection | Product Head | Within 24h | Offer alternate bank option |
| Customer complaint | Founder | Immediately | Personal callback within 1 hour |
| High-value lead (saving > ₹5K/mo) | Senior Executive | Immediately | Priority handling |
| Repeated callback requests (3+) | Team Lead | After 3rd request | Review if lead is genuine |

### Bank Rejection Handling

```
"Hi [Name], I have an update on your refinance application.

Unfortunately, [Bank A] was unable to approve at this time because [reason].
But don't worry — I've already started the process with [Bank B],
which has different eligibility criteria.

[Bank B] typically takes 3-5 working days to respond.
I'll keep you updated. Is there anything else I can help with in the meantime?"
```

### Common Rejection Reasons & Alternate Actions

| Rejection Reason | Alternate Action |
|-----------------|------------------|
| Low CIBIL score (< 650) | Try NBFC options (Tata Capital, Bajaj) |
| Loan too old (> 5 years) | Check if top-up loan makes more sense |
| Vehicle too old (> 8 years) | Limited options — be honest with customer |
| Income insufficient | Try joint application or lower amount |
| Previous defaults | Suggest CIBIL repair, follow up in 6 months |

---

## Daily Targets Per Executive

### Activity Targets

| Metric | Daily Target | Minimum Acceptable |
|--------|-------------|-------------------|
| Total calls made | 30+ | 25 |
| New lead first contacts | 10 | 8 |
| Follow-up calls | 5 | 3 |
| WhatsApp messages sent | 15 | 10 |
| Document collections | 2 | 1 |
| Connected conversations | 12 | 8 |

### Quality Targets

| Metric | Daily Target | Measured By |
|--------|-------------|-------------|
| Average response time | < 5 minutes | System timestamp |
| Qualification rate | > 50% of connected | Dispositions |
| Document conversion | > 30% of qualified | Status changes |
| Customer satisfaction | No complaints | Feedback/escalations |

### Weekly Executive Scorecard

```
EXECUTIVE SCORECARD - WEEK [X]
═══════════════════════════════

Name: [Executive Name]
Leads Assigned: ___
Calls Made: ___
Connected: ___ (___%)
Qualified: ___ (___%)
Docs Collected: ___
Bank Submitted: ___
Approved: ___

Response Time (avg): ___ minutes
Customer Complaints: ___
Pipeline Value: ₹___ (potential commission)

Rating: ⭐⭐⭐⭐⭐ / ⭐⭐⭐⭐⭐
```

---

## Tools & Systems

### Required for Sales Team

| Tool | Purpose | Cost | Setup |
|------|---------|------|-------|
| WhatsApp Business | Customer communication | Free | Install + verify number |
| Google Sheets | Lead tracking (validation phase) | Free | Share with team |
| Phone (SIM) | Calling | ₹200/month unlimited | Company SIM preferred |
| Supabase Dashboard | View lead details | Free | Read-only access |

### Lead Sheet Structure (Google Sheets)

| Column | Data |
|--------|------|
| Lead ID | Auto-generated |
| Name | From form |
| Phone | From form |
| City | From form |
| Monthly Saving | Calculator output |
| Current Bank | From qualification |
| Status | Dropdown (lifecycle stages) |
| Assigned To | Executive name |
| Last Contact | Date |
| Next Follow-up | Date |
| Documents (Y/N) | Checklist |
| Bank Submitted To | Bank name |
| Notes | Free text |

---

## Quality Standards

### Call Quality Checklist

- [ ] Introduced yourself and company
- [ ] Referenced the calculator usage (personalization)
- [ ] Mentioned specific savings amount
- [ ] Asked permission before proceeding
- [ ] Asked all 5 qualification questions
- [ ] Handled objections professionally
- [ ] Set clear next step before hanging up
- [ ] Updated lead status immediately after call
- [ ] Sent WhatsApp summary within 10 minutes of call

### Do's and Don'ts

| DO ✅ | DON'T ❌ |
|-------|---------|
| Be consultative, not pushy | Don't guarantee approval |
| Reference their specific savings | Don't make up numbers |
| Respect "no" gracefully | Don't call more than 3x if asked to stop |
| Explain the process clearly | Don't hide fees or terms |
| Follow up on schedule | Don't spam with messages |
| Be honest about timelines | Don't promise same-day approval |
| Escalate difficult cases | Don't argue with customers |

---

*Last Updated: January 2025*
*Owner: Sales Lead*
*Review Frequency: Weekly (cadence review) + Monthly (script updates)*
