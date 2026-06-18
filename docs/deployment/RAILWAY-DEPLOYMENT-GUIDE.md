# Railway Deployment Guide

## MotoFin Vehicle Finance Platform — Railway.app Production Deployment

---

## 1. Prerequisites

Before starting Railway deployment, ensure:

- [ ] Supabase project `motofin-prod` is created and running (see `SUPABASE-PRODUCTION-SETUP.md`)
- [ ] Database migrations have been applied (see `PRISMA-PRODUCTION-RUNBOOK.md`)
- [ ] GitHub repository `mettugoud-droid/MotoFin` is accessible
- [ ] Railway account created at [https://railway.app](https://railway.app)
- [ ] Custom domain `api.motofin.in` DNS is manageable

---

## 2. Create Railway Project

### Steps

1. Go to [https://railway.app/dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub Repo"**
4. Authorize Railway to access your GitHub account (if not already done)
5. Search for and select: **`mettugoud-droid/MotoFin`**
6. Railway will create a new project and attempt auto-deployment

---

## 3. Configure Service Settings

### 3.1 Root Directory

Navigate to **Service → Settings → Source**:

| Setting | Value |
|---------|-------|
| **Root Directory** | `apps/api` |
| **Branch** | `main` |
| **Auto-Deploy** | Enabled (deploys on push to main) |

> **Alternative:** If using a `railway.json` in the repo root, Railway will read configuration from there. The `apps/api` root directory approach is simpler for monorepo setups.

### 3.2 Build Configuration

Navigate to **Service → Settings → Build**:

| Setting | Value |
|---------|-------|
| **Builder** | Nixpacks (auto-detect) or Dockerfile |
| **Build Command** | `npm run build` (auto-detected from package.json) |
| **Install Command** | `npm install` (auto-detected) |

**If using Nixpacks (recommended):**
- Railway auto-detects Node.js from `package.json`
- Prisma Client is generated during `postinstall` or build step
- Ensure `prisma generate` runs as part of the build

**If using Dockerfile:**
- Place a `Dockerfile` in `apps/api/` directory
- Railway will use it automatically when detected

### 3.3 Start Command

Navigate to **Service → Settings → Deploy**:

| Setting | Value |
|---------|-------|
| **Start Command** | `node dist/main.js` |
| **Restart Policy** | Always |

---

## 4. Environment Variables

Navigate to **Service → Variables** and add ALL of the following:

### 4.1 Application Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Enables production optimizations |
| `PORT` | `${{RAILWAY_PORT}}` | Railway injects this automatically (usually 3000) |
| `API_PORT` | `${{RAILWAY_PORT}}` | App reads this for listen port |
| `API_BASE_URL` | `https://api.motofin.in` | Public-facing URL |
| `WEB_URL` | `https://motofin.in` | Frontend URL |
| `CORS_ORIGINS` | `https://motofin.in,https://www.motofin.in,https://app.motofin.in` | Comma-separated allowed origins |

### 4.2 Database Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10` | Pooled connection for runtime |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` | Direct connection for migrations |

### 4.3 Supabase Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `SUPABASE_URL` | `https://[PROJECT-REF].supabase.co` | From Supabase dashboard |
| `SUPABASE_ANON_KEY` | `eyJ...` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Secret — server-side only |
| `SUPABASE_JWT_SECRET` | `your-jwt-secret` | For token verification |

### 4.4 Rate Limiting & Operational Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `RATE_LIMIT_CALCULATOR` | `5000` | Max calculator requests per window |
| `RATE_LIMIT_AUTHENTICATED` | `100` | Max authenticated API requests per window |
| `LOG_LEVEL` | `info` | Production log level (not debug) |

### 4.5 Redis (if applicable)

| Variable | Value | Notes |
|----------|-------|-------|
| `REDIS_HOST` | `(Railway Redis internal URL)` | Add Railway Redis plugin if needed |
| `REDIS_PORT` | `6379` | Default Redis port |

> **Tip:** Use Railway's **"Raw Editor"** to paste all variables at once in `.env` format.

---

## 5. Health Check Configuration

Navigate to **Service → Settings → Networking → Health Check**:

| Setting | Value |
|---------|-------|
| **Health Check Path** | `/api/health` |
| **Health Check Timeout** | `30` seconds |
| **Health Check Interval** | `30` seconds |

The health endpoint returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "0.1.0",
  "environment": "production"
}
```

> Railway will only route traffic to the service after the health check passes. If the health check fails for 3 consecutive attempts, Railway will restart the container.

---

## 6. Custom Domain Setup

### 6.1 Add Domain in Railway

1. Navigate to **Service → Settings → Networking → Public Networking**
2. Click **"Generate Domain"** first to verify the service is publicly accessible
3. Click **"Add Custom Domain"**
4. Enter: `api.motofin.in`
5. Railway will provide DNS records to configure

### 6.2 Configure DNS

Add the following DNS records at your domain registrar (for `motofin.in`):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `api` | `[your-service].up.railway.app` | 300 |

> **Note:** Railway may also request a verification TXT record. Add it as instructed.

### 6.3 Verify Domain

1. Wait 5-15 minutes for DNS propagation
2. Railway dashboard should show domain status as **"Active"** with SSL certificate provisioned
3. Test: `curl https://api.motofin.in/api/health`

### 6.4 SSL Certificate

- Railway automatically provisions and renews Let's Encrypt SSL certificates
- No manual SSL configuration required
- HTTPS is enforced by default (HTTP redirects to HTTPS)

---

## 7. Deployment Verification

### 7.1 Health Check

```bash
curl -s https://api.motofin.in/api/health | jq .
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "0.1.0",
  "environment": "production"
}
```

### 7.2 Savings Calculator Endpoint

```bash
curl -s -X POST https://api.motofin.in/api/v1/savings-calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "currentEmi": 15000,
    "outstandingAmount": 450000,
    "currentRate": 14.5,
    "remainingTenure": 36
  }' | jq .
```

**Expected:** 200/201 response with savings calculation result including `monthlySaving`, `bankComparisons`, etc.

### 7.3 Foreclosure Calculator Endpoint

```bash
curl -s -X POST https://api.motofin.in/api/v1/foreclosure-calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "currentBank": "HDFC Bank",
    "currentEmi": 15000,
    "loanStartDate": "2022-01-15",
    "outstandingAmount": 450000,
    "currentRate": 14.5
  }' | jq .
```

**Expected:** 200/201 response with foreclosure calculation result.

### 7.4 CORS Verification

```bash
curl -s -I -X OPTIONS https://api.motofin.in/api/health \
  -H "Origin: https://motofin.in" \
  -H "Access-Control-Request-Method: GET"
```

**Expected:** `Access-Control-Allow-Origin: https://motofin.in` header present.

### 7.5 Rate Limiting Verification

```bash
# Send multiple rapid requests to verify rate limiting is active
for i in {1..10}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://api.motofin.in/api/health
done
```

**Expected:** All 200s (health endpoint should not be rate-limited, but calculator endpoints will be).

---

## 8. Rollback Procedure

### 8.1 Redeploy Previous Version (Dashboard)

1. Navigate to **Service → Deployments**
2. Find the last known-good deployment (marked with green checkmark)
3. Click the three-dot menu on that deployment
4. Select **"Redeploy"**
5. Wait for health check to pass
6. Verify with: `curl https://api.motofin.in/api/health`

### 8.2 Rollback via Git

```bash
# Identify the last good commit
git log --oneline -10

# Revert the problematic commit
git revert [BAD-COMMIT-SHA]
git push origin main

# Railway auto-deploys from main branch
```

### 8.3 Emergency: Disable Service

If immediate takedown is needed:

1. Navigate to **Service → Settings**
2. Click **"Remove Service"** → This stops all traffic
3. Or: Remove the custom domain to stop routing while keeping the service

---

## 9. Monitoring & Logs

### 9.1 View Logs

- Navigate to **Service → Deployments → (latest) → View Logs**
- Or use Railway CLI: `railway logs`

### 9.2 Key Metrics to Monitor

- **Memory Usage:** Should stay under 512MB for the API service
- **CPU Usage:** Spikes during calculation-heavy requests are normal
- **Response Time:** Health check should respond in < 200ms
- **Deploy Duration:** Typical build + deploy takes 2-4 minutes

### 9.3 Alerts

Configure alerts in Railway for:
- Deployment failures
- Health check failures
- Memory exceeding 80% of limit

---

## 10. Troubleshooting

### Issue: Deployment Fails During Build

**Symptoms:** Build step fails with dependency errors

**Fixes:**
1. Check Railway build logs for the specific error
2. Ensure `apps/api/package.json` has all dependencies listed (not in root only)
3. Verify `prisma generate` runs during build:
   - Add to `package.json` scripts: `"postinstall": "prisma generate"`
4. Check Node.js version compatibility — add to `package.json`:
   ```json
   "engines": { "node": ">=18.0.0" }
   ```

### Issue: Health Check Fails After Deploy

**Symptoms:** Deployment shows "unhealthy" status

**Fixes:**
1. Check that `PORT` environment variable matches what the app listens on
2. Verify `API_PORT` is set to `${{RAILWAY_PORT}}` or that the app reads `PORT`
3. Check database connectivity — `DATABASE_URL` may be malformed
4. Review startup logs for unhandled exceptions
5. Ensure the health endpoint path is exactly `/api/health` (not `/health`)

### Issue: Database Connection Refused

**Symptoms:** App starts but API calls return 500 with database errors

**Fixes:**
1. Verify `DATABASE_URL` uses port `6543` (pooler) not `5432`
2. Check that `?pgbouncer=true` is in the connection string
3. Confirm Supabase project is in "Active" state
4. Test connection from Railway shell: **Service → Shell → `npx prisma db execute --stdin <<< "SELECT 1;"`**

### Issue: CORS Errors in Browser

**Symptoms:** Frontend gets "CORS policy" errors

**Fixes:**
1. Verify `CORS_ORIGINS` includes the exact frontend URL (with `https://`, no trailing slash)
2. Check there are no spaces in the comma-separated list
3. Ensure the NestJS CORS middleware reads from `CORS_ORIGINS` env var
4. Redeploy after changing environment variables

### Issue: Prisma Client Version Mismatch

**Symptoms:** Error about Prisma engine version mismatch

**Fixes:**
1. Add `"postinstall": "prisma generate"` to `apps/api/package.json` scripts
2. Ensure `prisma` and `@prisma/client` are the same version in `package.json`
3. Clear Railway build cache: **Settings → Build → Clear Build Cache** → Redeploy

### Issue: Memory Limit Exceeded

**Symptoms:** Service restarts frequently, OOM errors in logs

**Fixes:**
1. Upgrade Railway plan or increase memory allocation
2. Check for memory leaks in calculator modules (large input processing)
3. Reduce `connection_limit` in `DATABASE_URL` (try `5` instead of `10`)
4. Add `--max-old-space-size=512` to start command: `node --max-old-space-size=512 dist/main.js`

### Issue: Slow Cold Starts

**Symptoms:** First request after idle period takes 5+ seconds

**Fixes:**
1. Railway free tier sleeps after inactivity — upgrade to Pro for always-on
2. Use an external uptime monitor to ping `/api/health` every 5 minutes
3. Optimize NestJS module initialization (lazy-load non-critical modules)

---

## 11. Railway CLI Quick Reference

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Open shell in running container
railway shell

# Set environment variable
railway variables set KEY=value

# Trigger manual deploy
railway up
```

---

## Deployment Checklist

- [ ] Railway project created and linked to `mettugoud-droid/MotoFin`
- [ ] Root directory set to `apps/api`
- [ ] All environment variables configured
- [ ] Start command set to `node dist/main.js`
- [ ] Health check configured: `/api/health` with 30s timeout
- [ ] Custom domain `api.motofin.in` added and DNS configured
- [ ] SSL certificate provisioned (automatic)
- [ ] Health check verified via curl
- [ ] Calculator endpoints verified via curl
- [ ] CORS verified from production frontend domain
- [ ] Rollback procedure tested (know where to find previous deployments)
