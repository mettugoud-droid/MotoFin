# MotoFin Production Environment Variables

---

## Frontend (Vercel)

| Variable | Required | Example | Purpose |
|----------|:--------:|---------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ | `https://api.motofin.in/api` | Backend API base URL |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | ✅ | `G-XXXXXXXXXX` | Google Analytics 4 |
| `NEXT_PUBLIC_META_PIXEL_ID` | ✅ | `123456789012345` | Meta Pixel tracking |
| `NEXT_PUBLIC_APP_URL` | ❌ | `https://motofin.in` | Canonical URL |

---

## Backend (Railway)

### Application

| Variable | Required | Example | Purpose |
|----------|:--------:|---------|---------|
| `NODE_ENV` | ✅ | `production` | Runtime environment |
| `PORT` | ✅ | `3000` | Server port (Railway sets this) |
| `API_PORT` | ❌ | `3000` | Alias (fallback to PORT) |
| `CORS_ORIGINS` | ✅ | `https://motofin.in,https://www.motofin.in` | Allowed origins |

### Database

| Variable | Required | Example | Purpose |
|----------|:--------:|---------|---------|
| `DATABASE_URL` | ✅ | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase pooled connection |

### Redis

| Variable | Required | Example | Purpose |
|----------|:--------:|---------|---------|
| `REDIS_HOST` | ❌ | `[endpoint].upstash.io` | Upstash Redis host |
| `REDIS_PORT` | ❌ | `6379` | Redis port |

### Supabase

| Variable | Required | Example | Purpose |
|----------|:--------:|---------|---------|
| `SUPABASE_URL` | ❌ | `https://[REF].supabase.co` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | `eyJ...` | Service role key (server-side only) |

### Meta Conversions API

| Variable | Required | Example | Purpose |
|----------|:--------:|---------|---------|
| `META_PIXEL_ID` | ❌ | `123456789012345` | Server-side event tracking |
| `META_ACCESS_TOKEN` | ❌ | `EAA...` | Graph API token for CAPI |

### Rate Limiting

| Variable | Required | Example | Purpose |
|----------|:--------:|---------|---------|
| `RATE_LIMIT_CALCULATOR` | ❌ | `5000` | Calculator req/min limit |
| `RATE_LIMIT_AUTHENTICATED` | ❌ | `100` | Auth user req/min limit |

---

## Notes

- ✅ Required = deployment will fail without it
- ❌ Optional = has sensible defaults or not needed for validation
- Never commit `.env` files — use platform environment variable management
- Supabase Auth variables optional until Phase 4 (Authentication) is deployed
