# Production Smoke Tests — MotoFin

## Overview

These 9 smoke tests verify that MotoFin is operational after a production deployment. Run all tests immediately after deployment and before declaring go-live.

**Production URLs:**
- Frontend: `https://motofin.in`
- Backend API: `https://api.motofin.in`

---

## Test 1: Landing Page Loads

### Request

```bash
curl -s -o /dev/null -w "%{http_code}" https://motofin.in
```

### Expected Response

- HTTP Status: `200`
- Page HTML contains: `"Reduce Your Car EMI"`

### Full Verification (with content check)

```bash
curl -s https://motofin.in | grep -q "Reduce Your Car EMI" && echo "PASS" || echo "FAIL"
```

### Pass Criteria

- [x] HTTP 200 returned
- [x] Page body contains the headline text "Reduce Your Car EMI"
- [x] Page loads in < 3 seconds

### Troubleshooting if Fails

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| HTTP 404 | Domain not connected | Verify Vercel domain settings and DNS propagation |
| HTTP 500 | Build error | Check Vercel deployment logs for build failures |
| Content missing | Component render error | Check browser console for JavaScript errors; verify env vars |
| Timeout | DNS not propagated | Wait 10–30 minutes; verify A record points to `76.76.21.21` |

---

## Test 2: Calculator API — Savings Calculation

### Request

```bash
curl -X POST https://api.motofin.in/api/v1/calculator/savings \
  -H "Content-Type: application/json" \
  -d '{
    "currentEMI": 25000,
    "outstandingLoan": 800000,
    "remainingTenure": 36,
    "currentInterestRate": 12.5
  }'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "monthlySaving": 3250,
    "newEMI": 21750,
    "totalSavings": 117000,
    "newInterestRate": 9.5
  }
}
```

### Pass Criteria

- [x] HTTP 200 returned
- [x] Response contains `monthlySaving` field with a positive numeric value
- [x] Response contains `success: true`
- [x] Response time < 500ms

### Troubleshooting if Fails

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| HTTP 404 | Route not registered | Verify NestJS controller path matches `/api/v1/calculator/savings` |
| HTTP 500 | Unhandled exception | Check Railway logs for stack trace |
| CORS error | Origin not allowed | Add frontend URL to `CORS_ORIGINS` env var on Railway |
| Connection refused | Service not running | Check Railway deployment status; verify PORT env var |

---

## Test 3: Pre-Approval API

### Request

```bash
curl -X POST https://api.motofin.in/api/v1/calculator/pre-approval \
  -H "Content-Type: application/json" \
  -d '{
    "monthlyIncome": 75000,
    "currentEMI": 25000,
    "creditScore": 750,
    "employmentType": "salaried",
    "companyCategory": "A"
  }'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "approvalProbability": "high",
    "maxLoanAmount": 1200000,
    "suggestedInterestRate": 9.25,
    "factors": [...]
  }
}
```

### Pass Criteria

- [x] HTTP 200 returned
- [x] Response contains `approvalProbability` field (value: `"high"`, `"medium"`, or `"low"`)
- [x] Response contains `success: true`
- [x] Response time < 500ms

### Troubleshooting if Fails

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| HTTP 400 | Invalid payload | Verify request body matches DTO schema |
| HTTP 500 | Calculation error | Check Railway logs for NaN or null reference errors |
| Missing fields | DTO mismatch | Verify the response DTO includes `approvalProbability` |

---

## Test 4: Lead Capture API

### Request

```bash
curl -X POST https://api.motofin.in/api/v1/calculator/capture-lead \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Smoke Test User",
    "phone": "9876543210",
    "email": "smoketest@motofin.in",
    "currentEMI": 25000,
    "outstandingLoan": 800000,
    "remainingTenure": 36,
    "currentInterestRate": 12.5,
    "monthlySaving": 3250,
    "city": "Hyderabad",
    "consent": true
  }'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "leadId": "uuid-string-here",
    "message": "Lead captured successfully"
  }
}
```

### Pass Criteria

- [x] HTTP 200 or 201 returned
- [x] Response contains `leadId` (valid UUID format)
- [x] Response contains `success: true`
- [x] Response time < 1000ms

### Troubleshooting if Fails

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| HTTP 500 | Database connection failed | Verify `DATABASE_URL` env var on Railway; check Supabase is running |
| HTTP 400 | Validation error | Check that all required fields are in the request body |
| HTTP 429 | Rate limited | Wait 60 seconds and retry; check rate limit env vars |
| Timeout | DB connection pool exhausted | Restart Railway service; verify connection string uses port 6543 (pooled) |

---

## Test 5: Lead Saved in Database

### Steps

1. Open [Supabase Dashboard](https://app.supabase.com) → Select MotoFin project
2. Navigate to **Table Editor** → `leads` table
3. Look for the most recent row

### Expected Result

| Column | Expected Value |
|--------|---------------|
| `full_name` | `Smoke Test User` |
| `phone` | `9876543210` |
| `email` | `smoketest@motofin.in` |
| `created_at` | Within the last few minutes |
| `status` | `new` or `pending` |

### Pass Criteria

- [x] Lead row exists in the `leads` table
- [x] All fields match the data submitted in Test 4
- [x] `created_at` timestamp is current
- [x] No data corruption or truncation

### Alternative: SQL Query

```sql
SELECT * FROM leads
WHERE email = 'smoketest@motofin.in'
ORDER BY created_at DESC
LIMIT 1;
```

### Troubleshooting if Fails

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| No row found | Insert failed silently | Check Railway logs for database errors |
| Wrong data | Mapping error | Verify Prisma schema matches database columns |
| Connection error | Wrong DB URL | Verify `DATABASE_URL` uses correct project ref and password |

---

## Test 6: Notification Triggered

### Steps

1. Open [Railway Dashboard](https://railway.app) → Select MotoFin API service
2. Navigate to **Logs** (or click "View Logs")
3. Look for notification log entry after the lead capture from Test 4

### Expected Log Entry

```
[NotificationService] Lead notification sent: {leadId: "uuid", channel: "console"}
```

or

```
[INFO] New lead notification triggered for: Smoke Test User (smoketest@motofin.in)
```

### Pass Criteria

- [x] Log entry exists for the lead captured in Test 4
- [x] Notification type/channel is logged
- [x] No error messages associated with the notification

### Troubleshooting if Fails

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| No log entry | Notification module not initialized | Verify `NotificationModule` is imported in `AppModule` |
| Error in logs | Provider configuration issue | Check notification provider config; verify credentials |
| Delayed entry | Async processing | Wait 30 seconds and check again |

---

## Test 7: Health Endpoint

### Request

```bash
curl -s https://api.motofin.in/api/health | jq .
```

### Expected Response

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

### Pass Criteria

- [x] HTTP 200 returned
- [x] Response contains `"status": "ok"`
- [x] Response time < 200ms
- [x] Timestamp is current

### Troubleshooting if Fails

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Connection refused | Service not running | Check Railway deployment status |
| HTTP 503 | Service unhealthy (DB down) | Check Supabase status; verify `DATABASE_URL` |
| Timeout | Network issue | Verify Railway service is publicly accessible |

---

## Test 8: Swagger Docs Accessible

### Request

```bash
curl -s -o /dev/null -w "%{http_code}" https://api.motofin.in/api/docs
```

### Expected Response

- HTTP Status: `200`
- Content-Type: `text/html`
- Page renders Swagger UI with API documentation

### Full Verification

```bash
curl -s https://api.motofin.in/api/docs | grep -q "swagger" && echo "PASS" || echo "FAIL"
```

### Pass Criteria

- [x] HTTP 200 returned
- [x] HTML page loads with Swagger UI
- [x] All API endpoints are listed (savings, pre-approval, lead-capture, health)
- [x] "Try it out" functionality works

### Troubleshooting if Fails

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| HTTP 404 | Swagger not configured | Verify `SwaggerModule.setup()` in `main.ts` |
| Blank page | Static assets not served | Check NestJS static file serving configuration |
| Missing endpoints | Controllers not registered | Verify all modules are imported in `AppModule` |

---

## Test 9: Full End-to-End Flow

### Steps (Manual Browser Test)

1. **Open** `https://motofin.in` in Chrome/Firefox
2. **Verify** the calculator form is visible on the landing page
3. **Enter test data:**
   - Current EMI: ₹25,000
   - Outstanding Loan: ₹8,00,000
   - Remaining Tenure: 36 months
   - Current Interest Rate: 12.5%
4. **Click** "Calculate Savings" button
5. **Verify** results screen shows:
   - Monthly saving amount (positive number)
   - New EMI amount
   - Total savings over loan tenure
6. **Enter lead details:**
   - Name: E2E Test User
   - Phone: 9876543211
   - Email: e2e-test@motofin.in
   - City: Hyderabad
   - Consent checkbox: checked
7. **Click** "Submit" / "Get Pre-Approval"
8. **Verify** success screen appears with confirmation message

### Pass Criteria

- [x] All pages load without JavaScript errors (check DevTools Console)
- [x] Calculator returns valid results with positive savings
- [x] Lead form submits successfully
- [x] Success/confirmation screen is displayed
- [x] Network tab shows all API calls returning 200
- [x] No CORS errors in console
- [x] Google Analytics events fire (check Network tab for `google-analytics.com`)
- [x] Meta Pixel fires on page load and form submission

### Troubleshooting if Fails

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Form doesn't submit | Frontend JS error | Check browser console; verify API URL env var |
| Results show NaN/undefined | API response format mismatch | Compare frontend expected fields with API response |
| Success screen doesn't show | Lead capture API error | Check Network tab for the POST request status |
| Analytics not firing | Pixel/GA IDs not set | Verify `NEXT_PUBLIC_GA4_MEASUREMENT_ID` and `NEXT_PUBLIC_META_PIXEL_ID` are set |

---

## Summary Table

| # | Test | Method | Expected | Status |
|---|------|--------|----------|--------|
| 1 | Landing Page Loads | `curl` / Browser | HTTP 200 + content | ☐ |
| 2 | Calculator API | `curl POST` | 200 + `monthlySaving` | ☐ |
| 3 | Pre-Approval API | `curl POST` | 200 + `approvalProbability` | ☐ |
| 4 | Lead Capture API | `curl POST` | 200 + `leadId` | ☐ |
| 5 | Lead in Database | Supabase UI / SQL | Row exists | ☐ |
| 6 | Notification Triggered | Railway Logs | Log entry present | ☐ |
| 7 | Health Endpoint | `curl` | 200 + `status: "ok"` | ☐ |
| 8 | Swagger Docs | `curl` / Browser | HTML page loads | ☐ |
| 9 | Full E2E Flow | Browser manual | All steps complete | ☐ |

---

## Execution Notes

- Run tests **in order** (Test 4 depends on Test 2's API being up; Test 5 depends on Test 4)
- Delete smoke test leads after verification: `DELETE FROM leads WHERE email LIKE '%smoketest%' OR email LIKE '%e2e-test%'`
- Total estimated time: 10–15 minutes for all 9 tests
- If any test fails, fix the issue and re-run from that test forward
