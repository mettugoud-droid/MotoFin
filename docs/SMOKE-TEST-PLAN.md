# MotoFin Smoke Test Plan

## Purpose
Verify all Sprint 1 functionality works correctly in production after deployment.

---

## Test 1: Health Endpoint

**Request:**
```bash
curl https://[API_URL]/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "MotoFin API",
  "version": "1.0.0",
  "timestamp": "2026-06-18T...",
  "uptime": 123.456,
  "environment": "production"
}
```

**Pass Criteria:** HTTP 200, status = "ok"

---

## Test 2: Savings Calculator

**Request:**
```bash
curl -X POST https://[API_URL]/api/v1/calculator/savings \
  -H "Content-Type: application/json" \
  -d '{
    "currentEmi": 28000,
    "outstandingAmount": 800000,
    "currentRate": 12.5,
    "remainingTenure": 36,
    "originalTenure": 60
  }'
```

**Expected Response:**
- HTTP 200
- `success: true`
- `data.monthlySaving` > 0
- `data.bankComparisons` has 1-3 entries
- `data.recommendedBank` is present
- `meta.calculationId` is a UUID

**Pass Criteria:** Valid savings result with bank comparisons

---

## Test 3: Validation Error Handling

**Request (invalid — EMI = 0):**
```bash
curl -X POST https://[API_URL]/api/v1/calculator/savings \
  -H "Content-Type: application/json" \
  -d '{
    "currentEmi": 0,
    "outstandingAmount": 800000,
    "currentRate": 12.5,
    "remainingTenure": 36,
    "originalTenure": 60
  }'
```

**Expected Response:**
- HTTP 400
- `success: false`
- `error.code: "VALIDATION_ERROR"`
- Error mentions "currentEmi"

**Pass Criteria:** Proper validation error returned

---

## Test 4: Pre-Approval Engine

**Request:** (use `meta.calculationId` from Test 2 as sessionId)
```bash
curl -X POST https://[API_URL]/api/v1/calculator/pre-approval \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "[CALCULATION_ID_FROM_TEST_2]"}'
```

**Expected Response:**
- HTTP 200
- `data.approvalProbability` between 0-100
- `data.confidenceLevel` is HIGH/MODERATE/SUBJECT_TO_VERIFICATION
- `data.recommendedBanks` array present
- `data.disclaimer` is present

**Pass Criteria:** Valid pre-approval with probability and banks

---

## Test 5: Lead Capture

**Request:**
```bash
curl -X POST https://[API_URL]/api/v1/calculator/capture-lead \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "[CALCULATION_ID_FROM_TEST_2]",
    "calculatorType": "savings",
    "name": "Test User",
    "mobile": "9876543210",
    "city": "Hyderabad",
    "currentBank": "HDFC"
  }'
```

**Expected Response:**
- HTTP 200
- `data.leadId` is a UUID
- `data.existingLead` is false (first submission)
- `data.status` is "NEW"
- `data.opportunityCategory` is "refinance_opportunity"
- `data.score` > 0

**Pass Criteria:** Lead created with score and classification

---

## Test 6: Duplicate Mobile Detection

**Request:** (same mobile as Test 5)
```bash
curl -X POST https://[API_URL]/api/v1/calculator/capture-lead \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "[ANY_SESSION_ID]",
    "calculatorType": "savings",
    "name": "Test User 2",
    "mobile": "9876543210",
    "city": "Mumbai"
  }'
```

**Expected Response:**
- HTTP 200
- `data.existingLead` is **true**
- No duplicate lead created

**Pass Criteria:** Deduplication works correctly

---

## Test 7: Landing Page Flow (Browser)

1. Open `https://[FRONTEND_URL]/`
2. Verify hero section loads ("Reduce Your Car EMI")
3. Enter: EMI=25000, Outstanding=800000, Rate=12.5, Remaining=36, Original=60
4. Click "Calculate Savings"
5. Verify savings results display (monthly saving, bank comparison)
6. Verify pre-approval card shows (probability %)
7. Click "Get Free Callback"
8. Enter: Name, Mobile, City
9. Click submit
10. Verify success screen shows checkmarks

**Pass Criteria:** Complete flow works without errors

---

## Test 8: Database Persistence

After Tests 2-6, verify in Supabase Dashboard:
- [ ] `savings_calculations` table has at least 1 row
- [ ] `leads` table has at least 1 row
- [ ] Lead has `opportunity_score` set
- [ ] Lead has `opportunity_category` = "refinance_opportunity"
- [ ] Lead has `lead_source_id` pointing to "Savings Calculator" source

---

## Test 9: Notification Trigger

After Test 5 (lead capture), check Railway logs:
- [ ] Notification log entry visible
- [ ] Contains customer name and mobile
- [ ] Template: "lead_welcome" or "lead_savings_summary"
- [ ] Status: success

---

## Smoke Test Summary

| Test | Description | Pass/Fail |
|:----:|-------------|:---------:|
| 1 | Health endpoint | ☐ |
| 2 | Savings calculator | ☐ |
| 3 | Validation errors | ☐ |
| 4 | Pre-approval engine | ☐ |
| 5 | Lead capture (new) | ☐ |
| 6 | Duplicate detection | ☐ |
| 7 | Landing page E2E | ☐ |
| 8 | Database persistence | ☐ |
| 9 | Notification trigger | ☐ |

**All 9 tests must pass before declaring production-ready.**
