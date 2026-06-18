# Production Secrets Checklist — MotoFin

## Overview

This document lists all environment variables and secrets required for MotoFin production deployment, grouped by service. Each variable is classified by sensitivity, requirement level, and deployment target.

---

## Legend

| Label | Meaning |
|-------|---------|
| **Required** | Must be set for the service to function |
| **Optional** | Enhances functionality but not critical for startup |
| **SECRET** | Must never be exposed publicly; treat as credential |
| **Safe** | Can be exposed in client bundles or public logs |

---

## 1. Frontend (Vercel)

| Variable | Required | Sensitivity | Where to Set | Notes |
|----------|----------|-------------|--------------|-------|
| `NEXT_PUBLIC_API_URL` | Required | Safe | Vercel | Backend API base URL (e.g., `https://api.motofin.in`) |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Required | Safe | Vercel | Google Analytics 4 measurement ID (e.g., `G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Required | Safe | Vercel | Meta/Facebook Pixel ID for conversion tracking |

> All `NEXT_PUBLIC_` variables are embedded into the client-side JavaScript bundle at build time. They are intentionally public.

---

## 2. Backend (Railway)

| Variable | Required | Sensitivity | Where to Set | Notes |
|----------|----------|-------------|--------------|-------|
| `NODE_ENV` | Required | Safe | Railway | Set to `production` |
| `PORT` | Required | Safe | Railway | Port for the NestJS server (e.g., `3001`) |
| `CORS_ORIGINS` | Required | Safe | Railway | Comma-separated allowed origins (e.g., `https://motofin.in,https://www.motofin.in`) |
| `DATABASE_URL` | Required | **SECRET** | Railway | PostgreSQL connection string (pooled, port 6543) |
| `SUPABASE_URL` | Required | Safe | Railway | Supabase project URL (e.g., `https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Required | **SECRET** | Railway | Full access key — bypasses RLS. Never expose. |
| `RATE_LIMIT_TTL` | Optional | Safe | Railway | Rate limit window in seconds (default: 60) |
| `RATE_LIMIT_MAX` | Optional | Safe | Railway | Max requests per window (default: 100) |

---

## 3. Database (Supabase PostgreSQL)

| Variable | Required | Sensitivity | Where to Set | Notes |
|----------|----------|-------------|--------------|-------|
| `DATABASE_URL` | Required | **SECRET** | Railway | Pooled connection via PgBouncer (port **6543**) — use for application queries |
| `DIRECT_URL` | Required | **SECRET** | Railway | Direct connection (port **5432**) — use for migrations only |

**Connection String Format:**
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

> **Important:** Use port `6543` (pooled) for the application `DATABASE_URL` and port `5432` (direct) for `DIRECT_URL` used by Prisma migrations.

---

## 4. Supabase

| Variable | Required | Sensitivity | Where to Set | Notes |
|----------|----------|-------------|--------------|-------|
| `SUPABASE_URL` | Required | Safe | Railway | Project URL (public, used in API calls) |
| `SUPABASE_ANON_KEY` | Optional | Safe | Vercel (if client-side) | Public anonymous key — respects Row Level Security |
| `SUPABASE_SERVICE_ROLE_KEY` | Required | **SECRET** | Railway | Bypasses RLS — full database access. **Never expose to client.** |
| `JWT_SECRET` | Required | **SECRET** | Railway | Used to verify/sign JWTs. Found in Supabase Dashboard → Settings → API |

---

## 5. Redis (Optional — Rate Limiting/Caching)

| Variable | Required | Sensitivity | Where to Set | Notes |
|----------|----------|-------------|--------------|-------|
| `REDIS_HOST` | Optional | Safe | Railway | Redis server hostname |
| `REDIS_PORT` | Optional | Safe | Railway | Redis server port (default: 6379) |

> Redis is optional for Phase 1. In-memory rate limiting is used as a fallback.

---

## 6. Analytics & Marketing

| Variable | Required | Sensitivity | Where to Set | Notes |
|----------|----------|-------------|--------------|-------|
| `GA4_MEASUREMENT_ID` | Required | Safe | Vercel | Same as `NEXT_PUBLIC_GA4_MEASUREMENT_ID` |
| `META_PIXEL_ID` | Required | Safe | Vercel | Same as `NEXT_PUBLIC_META_PIXEL_ID` |
| `META_ACCESS_TOKEN` | Optional | **SECRET** | Railway | Conversions API (CAPI) server-side token. Never expose to client. |

> The Meta Access Token is only needed if implementing server-side Conversions API for better attribution accuracy.

---

## Security Rules

### Never Commit Secrets

- [ ] `.env` files are listed in `.gitignore`
- [ ] No secrets exist in git history (use `git log --all -p | grep -i "secret\|password\|key"` to verify)
- [ ] `.env.example` files contain only placeholder values

### Use Platform Environment Management

- [ ] All production secrets are set via Vercel/Railway dashboards
- [ ] No secrets are hardcoded in application code
- [ ] No secrets are passed via CI/CD pipeline logs

### Rotation Policy

- [ ] Rotate all secrets immediately when a team member leaves
- [ ] Rotate `SUPABASE_SERVICE_ROLE_KEY` if any backend breach is suspected
- [ ] Rotate `META_ACCESS_TOKEN` quarterly
- [ ] Rotate `DATABASE_URL` password if credentials are accidentally exposed
- [ ] Document rotation date and reason in team changelog

### Access Control

- [ ] Only CTO and lead engineer have access to production secrets
- [ ] Vercel project settings are restricted to Admin role
- [ ] Railway project access is limited to deployment team
- [ ] Supabase dashboard access uses 2FA

---

## Quick Reference: Where Each Secret Lives

| Platform | Secrets Managed |
|----------|-----------------|
| **Vercel** | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID` |
| **Railway** | `NODE_ENV`, `PORT`, `CORS_ORIGINS`, `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `RATE_LIMIT_TTL`, `RATE_LIMIT_MAX`, `META_ACCESS_TOKEN`, `REDIS_HOST`, `REDIS_PORT` |
| **Supabase Dashboard** | Master passwords, project API keys (reference only — copy to Railway/Vercel) |

---

## Verification Checklist

Before going live, confirm:

- [ ] All "Required" variables are set in their respective platforms
- [ ] All "SECRET" variables are not visible in client-side code or browser DevTools
- [ ] `DATABASE_URL` uses pooled connection (port 6543)
- [ ] `CORS_ORIGINS` includes the production frontend URL
- [ ] Backend can connect to database on startup (check Railway logs)
- [ ] Frontend can reach the backend API (no CORS or network errors)
