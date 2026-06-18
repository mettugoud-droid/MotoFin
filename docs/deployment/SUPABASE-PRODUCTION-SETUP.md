# Supabase Production Setup Guide

## MotoFin Vehicle Finance Platform — Supabase Configuration

---

## 1. Create Supabase Project

### Steps

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Select your organization (or create one: "MotoFin Technologies")
4. Configure project settings:

| Setting | Value |
|---------|-------|
| **Project Name** | `motofin-prod` |
| **Database Password** | Generate a strong password (32+ chars, save in password manager immediately) |
| **Region** | `South Asia (Mumbai) — ap-south-1` |
| **Pricing Plan** | Pro (recommended for production) |

5. Click **"Create new project"**
6. Wait 2-3 minutes for provisioning to complete

> **CRITICAL:** Save the database password immediately. It cannot be recovered after project creation.

---

## 2. Connection Strings

After project creation, navigate to **Settings → Database** to retrieve connection details.

### 2.1 DATABASE_URL (Connection Pooler — for application use)

```
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10"
```

- **Port:** `6543` (PgBouncer pooled connection)
- **Use for:** Application runtime connections (NestJS/Prisma queries)
- **Note:** Add `&pgbouncer=true` to prevent prepared statement conflicts

### 2.2 DIRECT_URL (Direct Connection — for migrations)

```
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

- **Port:** `5432` (Direct PostgreSQL connection)
- **Use for:** Prisma migrations (`prisma migrate deploy`), schema introspection
- **Note:** Required in `schema.prisma` as `directUrl` for migration commands

### 2.3 SUPABASE_URL

```
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
```

- Found in: **Settings → API → Project URL**
- **Use for:** Supabase client initialization, Auth API calls

### 2.4 SUPABASE_ANON_KEY

```
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

- Found in: **Settings → API → Project API Keys → anon (public)**
- **Use for:** Frontend client initialization, public API calls
- **Safe to expose:** Yes (protected by RLS policies)

### 2.5 SUPABASE_SERVICE_ROLE_KEY

```
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

- Found in: **Settings → API → Project API Keys → service_role (secret)**
- **Use for:** Server-side operations that bypass RLS
- **NEVER expose to frontend or client-side code**

### 2.6 SUPABASE_JWT_SECRET

```
SUPABASE_JWT_SECRET="your-jwt-secret-from-dashboard"
```

- Found in: **Settings → API → JWT Settings → JWT Secret**
- **Use for:** Verifying JWT tokens server-side in NestJS guards

---

## 3. Prisma Configuration

Update `apps/api/prisma/schema.prisma` datasource for production:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

> The `directUrl` ensures Prisma uses port 5432 for migrations while the app uses port 6543 (pooled) at runtime.

---

## 4. Security Checklist

### 4.1 Row Level Security (RLS)

- [ ] RLS is **enabled** on ALL tables after migration
- [ ] Default policy is **deny all** — only explicit policies allow access
- [ ] Verify RLS status: **Database → Tables → click table → RLS toggle must be ON**
- [ ] Test: Anonymous requests should return empty results from direct Supabase client

### 4.2 API Key Security

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is **NEVER** included in frontend bundles
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is only in server-side environment variables (Railway)
- [ ] `SUPABASE_ANON_KEY` is the only key used in client-side code
- [ ] JWT Secret is only stored server-side for token verification

### 4.3 Network & CORS

- [ ] CORS restricted to production domains only:
  - `https://motofin.in`
  - `https://www.motofin.in`
  - `https://app.motofin.in`
- [ ] Supabase Auth redirect URLs configured for production domain only
- [ ] No wildcard (`*`) CORS in production

### 4.4 Database Security

- [ ] Database password is 32+ characters with mixed case, numbers, and symbols
- [ ] Connection string uses SSL (enabled by default on Supabase)
- [ ] Connection limit set appropriately (`connection_limit=10` for pooled)
- [ ] No raw SQL exposed via PostgREST that isn't protected by RLS

### 4.5 Dashboard Access

- [ ] Only project owner and designated DevOps have dashboard access
- [ ] MFA enabled on all Supabase accounts with dashboard access
- [ ] Service role key rotated if any team member leaves

---

## 5. Backup Configuration

### Free Tier

| Setting | Value |
|---------|-------|
| Automatic Backups | Daily |
| Retention Period | 7 days |
| Point-in-Time Recovery | Not available |
| Manual Backup | pg_dump via direct connection |

### Pro Tier (Recommended for Production)

| Setting | Value |
|---------|-------|
| Automatic Backups | Daily |
| Retention Period | 7 days (configurable up to 30) |
| Point-in-Time Recovery | Available (up to 7 days) |
| Manual Backup | pg_dump via direct connection |

### Manual Backup Command

```bash
# Run from local machine with network access to Supabase
pg_dump "postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  --format=custom \
  --no-owner \
  --file=motofin-backup-$(date +%Y%m%d).dump
```

### Restore Command

```bash
pg_restore --clean --if-exists \
  -d "postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  motofin-backup-20240101.dump
```

---

## 6. Access Management

### Dashboard Access Matrix

| Role | Access Level | Reason |
|------|-------------|--------|
| Project Owner (CTO) | Full admin | Overall platform management |
| Lead Backend Developer | Full admin | Database schema, migrations, debugging |
| DevOps Engineer | Database + Settings | Deployment, monitoring, backup verification |
| Frontend Lead | Read-only (API keys section) | Retrieve anon key for client config |
| Sales/Business | No access | Not required |

### Access Provisioning Steps

1. Navigate to **Organization Settings → Members**
2. Click **"Invite Member"**
3. Enter email address
4. Select role: **Owner**, **Admin**, **Developer**, or **Read-only**
5. Member accepts invitation via email

### Access Revocation

1. Navigate to **Organization Settings → Members**
2. Click the three-dot menu next to the member
3. Select **"Remove member"**
4. **IMMEDIATELY** rotate `SUPABASE_SERVICE_ROLE_KEY` if the member had dashboard access:
   - **Settings → API → Regenerate Keys**
   - Update the key in Railway environment variables
   - Redeploy the API service

---

## 7. Post-Creation Verification

### 7.1 Verify Project is Running

1. Navigate to project dashboard — status should show **"Active"** (green dot)
2. Confirm region shows **"South Asia (Mumbai)"**

### 7.2 Test Database Connectivity

```bash
# Test pooled connection (application use)
psql "postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres" \
  -c "SELECT version();"

# Test direct connection (migrations)
psql "postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  -c "SELECT version();"
```

**Expected output:** PostgreSQL 15.x (or newer)

### 7.3 Verify API Keys

```bash
# Test anon key (should return empty or auth error depending on RLS)
curl -s "https://[PROJECT-REF].supabase.co/rest/v1/" \
  -H "apikey: [ANON-KEY]" \
  -H "Authorization: Bearer [ANON-KEY]"
```

**Expected:** 200 OK with empty array or table listing

### 7.4 Verify Auth Service

```bash
# Health check
curl -s "https://[PROJECT-REF].supabase.co/auth/v1/health"
```

**Expected:** `{"status":"ok"}`

### 7.5 Enable Required Extensions

Navigate to **Database → Extensions** and enable:

- [ ] `uuid-ossp` — UUID generation (usually enabled by default)
- [ ] `pg_stat_statements` — Query performance monitoring

### 7.6 Configure Auth Settings

Navigate to **Authentication → Settings**:

- [ ] Set **Site URL** to `https://motofin.in`
- [ ] Add **Redirect URLs**: `https://app.motofin.in/**`
- [ ] Disable unused auth providers (keep only Email and Phone if applicable)
- [ ] Set password minimum length to 8 characters

---

## 8. Environment Variable Summary

Copy this template and fill in values from the Supabase dashboard:

```env
# Supabase - Production (motofin-prod)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[ANON-KEY-FROM-DASHBOARD]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY-FROM-DASHBOARD]"
SUPABASE_JWT_SECRET="[JWT-SECRET-FROM-DASHBOARD]"
```

> **Replace** `[PROJECT-REF]`, `[DB-PASSWORD]`, and key placeholders with actual values from your Supabase dashboard.

---

## Checklist Before Proceeding to Railway Deployment

- [ ] Project `motofin-prod` created in Mumbai region
- [ ] Database password saved securely
- [ ] All connection strings documented (pooled + direct)
- [ ] API keys retrieved (anon, service_role, JWT secret)
- [ ] RLS verified as enabled on all tables (after migration)
- [ ] CORS and auth redirect URLs configured
- [ ] Team access provisioned appropriately
- [ ] Connectivity verified from local machine
