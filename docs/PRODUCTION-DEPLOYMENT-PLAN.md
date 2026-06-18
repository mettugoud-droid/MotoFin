# MotoFin Production Deployment Plan

## Overview

Deploy the MotoFin vehicle refinance platform to production for market validation. Target: fully operational in **1 day** at **₹0-₹3,000/month**.

---

## Infrastructure Stack

| Layer | Service | Plan | Cost/Month |
|-------|---------|------|------------|
| Frontend | Vercel | Hobby (Free) | ₹0 |
| Backend | Railway.app | Starter ($5 credit free) | ₹0-₹500 |
| Database | Supabase PostgreSQL | Free tier (500MB) | ₹0 |
| Auth | Supabase Auth | Free tier (50K MAU) | ₹0 |
| Redis/Cache | Upstash | Free tier (10K commands/day) | ₹0 |
| SSL | Automatic (Vercel + Railway) | Included | ₹0 |
| Domain | motofin.in | GoDaddy/Namecheap | ₹800/year |
| Monitoring | UptimeRobot | Free (50 monitors) | ₹0 |
| Email | Resend | Free (100 emails/day) | ₹0 |
| **Total** | | | **₹0-₹3,000** |

---

## 1. Frontend Deployment (Vercel)

### Why Vercel
- Native Next.js optimization (ISR, Edge Functions, Image Optimization)
- Automatic HTTPS/SSL
- Global CDN (edge network)
- Preview deployments for every PR
- Free tier handles 100K requests/month easily

### Setup Steps

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
cd apps/web
vercel link

# 3. Deploy to production
vercel --prod
```

### Vercel Configuration (`vercel.json`)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "regions": ["bom1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ]
}
```

### Custom Domain Setup
1. Add `motofin.in` in Vercel Dashboard → Settings → Domains
2. Update DNS records:
   - `A` record: `76.76.21.21`
   - `CNAME` for `www`: `cname.vercel-dns.com`
3. SSL auto-provisions in ~5 minutes

---

## 2. Backend Deployment (Railway.app)

### Why Railway
- Auto-deploy from GitHub (push to main = deploy)
- Built-in metrics and logging
- Easy environment variable management
- $5 free credit covers validation phase
- Supports NestJS natively

### Setup Steps

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Create project
railway init

# 4. Link to GitHub repo
railway link

# 5. Deploy
railway up
```

### Railway Configuration

**Dockerfile** (already exists in project):
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci
COPY . .
RUN npm run build --workspace=apps/api

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Railway Settings
- **Start Command**: `node dist/main.js`
- **Health Check**: `GET /api/v1/health`
- **Region**: `us-west` (closest available; India traffic still fast via CDN)
- **Auto-deploy**: Enabled on `main` branch

### Alternative: Render.com
If Railway credit exhausts:
- Free tier: 750 hours/month (spins down after 15 min inactivity)
- Restart time: ~30 seconds (acceptable for validation)
- Same Docker deployment, just connect GitHub repo

---

## 3. Database (Supabase PostgreSQL)

### Why Supabase
- Free PostgreSQL with 500MB storage
- Built-in Auth (saves development time)
- Auto daily backups
- Real-time subscriptions (useful later)
- Dashboard for manual data inspection

### Setup Steps

1. Create project at [supabase.com](https://supabase.com)
2. Region: **Mumbai (ap-south-1)**
3. Copy connection string
4. Run Prisma migrations:

```bash
# Set DATABASE_URL in environment
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Run migrations
npx prisma migrate deploy

# Seed initial data (bank rates, etc.)
npx prisma db seed
```

### Connection Pooling
- Use Supabase connection pooler for production (port 6543)
- Direct connection (port 5432) for migrations only
- Connection string format:
  ```
  postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

---

## 4. Redis Cache (Upstash)

### Why Upstash
- Serverless Redis (pay per request)
- Free tier: 10,000 commands/day
- Global replication
- REST API (no persistent connections needed)

### Setup Steps

1. Create database at [upstash.com](https://upstash.com)
2. Region: **AP-South-1 (Mumbai)**
3. Copy Redis URL and token

### Configuration
```
REDIS_URL=rediss://default:[TOKEN]@[ENDPOINT].upstash.io:6379
```

### Usage in Validation Phase
- Rate limiting (calculator abuse prevention)
- Session caching
- OTP storage (5-minute TTL)
- 10K free commands/day is more than sufficient for validation traffic

---

## 5. Environment Variables (Complete List)

### Frontend (Vercel Environment Variables)

```env
# API
NEXT_PUBLIC_API_URL=https://api.motofin.in
NEXT_PUBLIC_APP_URL=https://motofin.in

# Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXX

# Supabase (client-side)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Feature Flags
NEXT_PUBLIC_ENABLE_PREAPPROVAL=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### Backend (Railway Environment Variables)

```env
# Server
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

# Database
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres

# Redis
REDIS_URL=rediss://default:[TOKEN]@[ENDPOINT].upstash.io:6379

# Supabase
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT
JWT_SECRET=[GENERATE_32_CHAR_RANDOM_STRING]
JWT_EXPIRATION=7d

# Notifications
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Meta CAPI (Server-side)
META_PIXEL_ID=XXXXXXXXXXXXXXXX
META_ACCESS_TOKEN=EAA...
META_TEST_EVENT_CODE=TEST12345

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=20

# CORS
CORS_ORIGINS=https://motofin.in,https://www.motofin.in

# Logging
LOG_LEVEL=info
```

---

## 6. SSL & Domain Configuration

### SSL
- **Frontend**: Auto-provisioned by Vercel (Let's Encrypt)
- **Backend**: Auto-provisioned by Railway
- **No manual certificate management required**

### DNS Configuration (motofin.in)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 (Vercel) | 300 |
| CNAME | www | cname.vercel-dns.com | 300 |
| CNAME | api | [railway-app-url].railway.app | 300 |

### Subdomain Strategy for Validation
If `motofin.in` is not available:
- Use `app.motofin.in` for frontend
- Use `api.motofin.in` for backend
- Or use Vercel/Railway default URLs initially

---

## 7. Backup & Recovery

### Automatic Backups (Supabase)
- Daily backups included in free tier
- 7-day retention
- Point-in-time recovery (Pro plan, upgrade if needed)

### Manual Backup Script
```bash
#!/bin/bash
# Run weekly as extra safety
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Rollback Procedure
1. **Code rollback**: `git revert [commit]` → push to main → auto-redeploy
2. **Database rollback**: `npx prisma migrate rollback` or restore from Supabase backup
3. **Emergency**: Revert to previous Vercel deployment (instant, from dashboard)

### Vercel Instant Rollback
- Every deployment is immutable
- Click "Redeploy" on any previous deployment
- Zero downtime, instant switch

---

## 8. Monitoring & Alerting

### UptimeRobot (Free)
- Monitor: `https://motofin.in` (2-minute interval)
- Monitor: `https://api.motofin.in/api/v1/health` (2-minute interval)
- Alert via: Email + Telegram
- Expected uptime: 99.5%+

### Vercel Analytics (Free)
- Real-time page views
- Web Vitals (LCP, FID, CLS)
- Geographic distribution
- No setup needed (auto-enabled)

### Railway Metrics (Included)
- CPU usage
- Memory usage
- Network I/O
- Request count
- Response times

### Error Tracking
- Console errors via Vercel Logs
- Backend errors via Railway Logs
- **No Sentry needed for validation** (add at scale)

### Health Check Endpoint
```
GET /api/v1/health
Response: {
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected",
  "redis": "connected",
  "version": "1.0.0"
}
```

---

## 9. Go-Live Checklist (15 Items)

### Pre-Deploy (Items 1-5)
- [ ] 1. All environment variables set in Vercel and Railway
- [ ] 2. Database migrations run successfully on production Supabase
- [ ] 3. Seed data loaded (bank rates, city list, loan parameters)
- [ ] 4. CORS configured correctly (production domains only)
- [ ] 5. Rate limiting enabled and tested

### Deploy (Items 6-10)
- [ ] 6. Frontend deployed to Vercel, custom domain verified
- [ ] 7. Backend deployed to Railway, health check passing
- [ ] 8. SSL certificates active on all domains
- [ ] 9. Calculator flow tested end-to-end (input → result → lead capture)
- [ ] 10. Notification system tested (WhatsApp/SMS delivery confirmed)

### Post-Deploy (Items 11-15)
- [ ] 11. GA4 events firing correctly (verify in GA4 DebugView)
- [ ] 12. Meta Pixel events verified (use Meta Pixel Helper extension)
- [ ] 13. UptimeRobot monitors created and active
- [ ] 14. Backup verified (can see in Supabase dashboard)
- [ ] 15. Team access configured (founder + 1 developer minimum)

---

## 10. Deployment Timeline (1 Day)

| Time | Task | Duration |
|------|------|----------|
| 9:00 AM | Create Supabase project, run migrations | 30 min |
| 9:30 AM | Create Upstash Redis instance | 15 min |
| 9:45 AM | Deploy backend to Railway, set env vars | 30 min |
| 10:15 AM | Deploy frontend to Vercel, set env vars | 30 min |
| 10:45 AM | Configure custom domain + DNS | 15 min |
| 11:00 AM | End-to-end testing (calculator → lead → notification) | 45 min |
| 11:45 AM | Install GA4 + Meta Pixel, verify events | 30 min |
| 12:15 PM | Set up UptimeRobot monitors | 15 min |
| 12:30 PM | **LUNCH BREAK** | 30 min |
| 1:00 PM | Final testing, go-live checklist completion | 30 min |
| 1:30 PM | **🚀 GO LIVE** | — |

**Total active time: ~4.5 hours**

---

## 11. Cost Breakdown (Validation Phase)

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Vercel (Hobby) | ₹0 | 100K requests, sufficient |
| Railway (Starter) | ₹0-₹400 | $5 free credit covers ~1 month |
| Supabase (Free) | ₹0 | 500MB DB, 50K auth users |
| Upstash (Free) | ₹0 | 10K commands/day |
| UptimeRobot (Free) | ₹0 | 50 monitors |
| Domain (motofin.in) | ₹65 | ₹800/year |
| Twilio (WhatsApp) | ₹500-₹2,000 | Pay per message |
| **Total** | **₹565-₹2,465** | Well under ₹3,000 |

---

## 12. Scaling Plan (Post-Validation)

When validation succeeds (100+ leads, positive unit economics):

| Trigger | Action | New Cost |
|---------|--------|----------|
| >1,000 visitors/day | Vercel Pro ($20/mo) | ₹1,700/mo |
| >50 leads/day | Railway Pro ($20/mo) | ₹1,700/mo |
| >500MB database | Supabase Pro ($25/mo) | ₹2,100/mo |
| Need Sentry | Sentry Team ($26/mo) | ₹2,200/mo |
| **Scaled total** | | **~₹8,000/mo** |

This scaling only happens AFTER validation proves unit economics work.

---

## Quick Commands Reference

```bash
# Deploy frontend
cd apps/web && vercel --prod

# Deploy backend
cd apps/api && railway up

# Run migrations
DATABASE_URL=$PROD_DB_URL npx prisma migrate deploy

# View backend logs
railway logs

# Check health
curl https://api.motofin.in/api/v1/health

# Rollback frontend (use Vercel dashboard - instant)
# Rollback backend
git revert HEAD && git push origin main
```

---

## Emergency Contacts & Runbook

| Scenario | Action | Time to Resolve |
|----------|--------|-----------------|
| Site down | Check UptimeRobot → Railway logs → Redeploy | 5-15 min |
| Database unreachable | Check Supabase status → Connection pooler | 5 min |
| High error rate | Check Railway logs → Rollback if needed | 10 min |
| Domain not resolving | Check DNS propagation → TTL wait | Up to 1 hour |
| SSL expired | Auto-renews; if not, re-add domain in Vercel | 5 min |

---

*Last Updated: January 2025*
*Owner: Engineering Lead*
*Review Frequency: Before each deployment*
