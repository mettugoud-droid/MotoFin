# Prisma Production Runbook

## MotoFin Vehicle Finance Platform — Database Migration & Seed Operations

---

## 1. Prerequisites

Before running migrations or seeds in production:

- [ ] Supabase project `motofin-prod` is active and accessible (see `SUPABASE-PRODUCTION-SETUP.md`)
- [ ] You have the `DATABASE_URL` (direct connection, port 5432) — migrations require direct access, NOT the pooled connection
- [ ] Network access to Supabase from your machine (no VPN blocking outbound PostgreSQL)
- [ ] Node.js 18+ installed locally
- [ ] Repository cloned and dependencies installed in `apps/api/`
- [ ] Current working directory is `apps/api/` within the MotoFin repository

### Verify Prerequisites

```bash
# Navigate to the API directory
cd apps/api

# Verify Node.js version
node --version  # Must be >= 18.0.0

# Verify Prisma CLI is available
npx prisma --version

# Test database connectivity (replace with actual connection string)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  npx prisma db execute --stdin <<< "SELECT 1 AS connected;"
```

**Expected output:** `1 row affected`

---

## 2. Run Migrations

### 2.1 Command

```bash
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  npx prisma migrate deploy
```

> **IMPORTANT:** Use the **DIRECT** connection (port `5432`), NOT the pooled connection (port `6543`). Migrations require direct access for DDL operations and advisory locks.

### 2.2 Expected Output

```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public" at "aws-0-ap-south-1.pooler.supabase.com:5432"

10 migrations found in prisma/migrations

Applying migration `20240101000000_init`
Applying migration `20240102000000_add_enums`
...

All migrations have been successfully applied.
```

### 2.3 What Gets Created

After successful migration, the following tables exist:

| # | Table Name | Description |
|---|-----------|-------------|
| 1 | `tenants` | Multi-tenant organization records |
| 2 | `roles` | User roles with permissions |
| 3 | `users` | Platform users linked to Supabase Auth |
| 4 | `lead_sources` | Lead acquisition channels |
| 5 | `leads` | Customer leads with scoring |
| 6 | `banks` | Partner bank records |
| 7 | `bank_rules` | Bank eligibility rules for loan products |
| 8 | `savings_calculations` | Balance transfer calculator results |
| 9 | `foreclosure_calculations` | Foreclosure calculator results |
| 10 | `pre_approval_results` | Pre-approval probability results |

Plus Prisma's internal `_prisma_migrations` table for tracking applied migrations.

---

## 3. Run Seed

### 3.1 Command

```bash
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  npx prisma db seed
```

### 3.2 Expected Output

```
🌱 Seeding MotoFin database...
  ✅ Tenant: MotoFin Technologies (00000000-0000-0000-0000-000000000001)
  ✅ Role: Admin
  ✅ Role: Sales Manager
  ✅ Role: Sales Executive
  ✅ Role: Loan Processor
  ✅ Role: Management
  ✅ Bank: HDFC Bank
  ✅ Bank: ICICI Bank
  ✅ Bank: Axis Bank
  ✅ Bank: Kotak Mahindra Bank
  ✅ Bank: IndusInd Bank
  ✅ Bank: AU Small Finance Bank
  ✅ Bank: Shriram Finance
  ✅ Bank: Cholamandalam Finance
  ✅ Bank: Mahindra Finance
  ✅ BankRule: hdfc → refinance_loan (8.5%-11.5%)
  ✅ BankRule: icici → refinance_loan (8.75%-12%)
  ✅ BankRule: axis → refinance_loan (8.65%-11.75%)
  ✅ BankRule: kotak → refinance_loan (8.25%-10.5%)
  ✅ BankRule: indusind → refinance_loan (9%-12.5%)
  ✅ BankRule: au → refinance_loan (9.5%-14%)
  ✅ BankRule: shriram → refinance_loan (11%-16%)
  ✅ BankRule: chola → refinance_loan (10.5%-15%)
  ✅ BankRule: mahindra_finance → refinance_loan (10%-14.5%)
  ✅ LeadSource: Meta Lead Ads (meta_lead_ads)
  ✅ LeadSource: Google Lead Forms (google_lead_forms)
  ✅ LeadSource: Landing Page (landing_page)
  ✅ LeadSource: WhatsApp Campaign (whatsapp_campaign)
  ✅ LeadSource: Referral Partner (referral_partner)
  ✅ LeadSource: Dealer Network (dealer_network)
  ✅ LeadSource: Savings Calculator (savings_calculator)
  ✅ LeadSource: Foreclosure Calculator (foreclosure_calculator)
  ✅ LeadSource: Google Ads (google_ads)
  ✅ LeadSource: Website (website)

🎉 Seed complete!
   Tenant: 1
   Roles: 5
   Banks: 9
   Bank Rules: 9 (refinance product)
   Lead Sources: 10
```

### 3.3 Seed Data Summary

| Entity | Count | Details |
|--------|-------|---------|
| Tenants | 1 | MotoFin Technologies (`motofin` slug) |
| Roles | 5 | Admin, Sales Manager, Sales Executive, Loan Processor, Management |
| Banks | 9 | HDFC, ICICI, Axis, Kotak, IndusInd, AU, Shriram, Chola, Mahindra Finance |
| Bank Rules | 9 | One `refinance_loan` product rule per bank |
| Lead Sources | 10 | Meta, Google, Landing Page, WhatsApp, Referral, Dealer, Savings Calc, Foreclosure Calc, Google Ads, Website |

> **Note:** The seed uses `upsert` operations, so it is safe to run multiple times (idempotent). Re-running will not create duplicates.

---

## 4. Verification Queries

After migration and seed, run these queries to confirm data integrity:

```sql
-- Connect to the database
-- psql "postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

-- Verify table count
SELECT count(*) AS table_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- Expected: 11 (10 app tables + _prisma_migrations)

-- Verify tenant
SELECT count(*) AS tenants FROM tenants;
-- Expected: 1

-- Verify roles
SELECT count(*) AS roles FROM roles;
-- Expected: 5

-- Verify banks
SELECT count(*) AS banks FROM banks;
-- Expected: 9

-- Verify bank rules
SELECT count(*) AS bank_rules FROM bank_rules;
-- Expected: 9

-- Verify lead sources
SELECT count(*) AS lead_sources FROM lead_sources;
-- Expected: 10

-- Verify all banks have rules
SELECT b.name, br.loan_product_code, br.interest_rate_min, br.interest_rate_max
FROM banks b
JOIN bank_rules br ON b.id = br.bank_id
ORDER BY br.interest_rate_min;
-- Expected: 9 rows, rates ranging from 8.25% to 11.00% (min)

-- Verify no orphaned records
SELECT count(*) FROM roles WHERE tenant_id NOT IN (SELECT id FROM tenants);
-- Expected: 0

-- Verify migration history
SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at;
-- Expected: All migrations listed with timestamps
```

### One-Liner Verification Script

```bash
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  npx prisma db execute --stdin <<< "
    SELECT 'tenants' AS entity, count(*)::text AS count FROM tenants
    UNION ALL SELECT 'roles', count(*)::text FROM roles
    UNION ALL SELECT 'banks', count(*)::text FROM banks
    UNION ALL SELECT 'bank_rules', count(*)::text FROM bank_rules
    UNION ALL SELECT 'lead_sources', count(*)::text FROM lead_sources
    UNION ALL SELECT 'users', count(*)::text FROM users
    UNION ALL SELECT 'leads', count(*)::text FROM leads;
  "
```

**Expected:**

```
tenants      | 1
roles        | 5
banks        | 9
bank_rules   | 9
lead_sources | 10
users        | 0
leads        | 0
```

---

## 5. Rollback Procedure

### 5.1 Full Database Reset (DESTRUCTIVE)

> **⚠️ WARNING: This drops ALL tables and recreates them. ALL DATA WILL BE LOST. Only use this if you are certain no production data needs to be preserved.**

```bash
# BACKUP FIRST!
pg_dump "postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  --format=custom --no-owner \
  --file=motofin-backup-before-reset-$(date +%Y%m%d-%H%M%S).dump

# Reset database (drops all tables, re-applies all migrations, runs seed)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  npx prisma migrate reset --force
```

### 5.2 Rollback Specific Migration (Manual)

Prisma does not natively support rolling back individual migrations. To undo a specific migration:

1. **Create a new migration** that reverses the changes:
   ```bash
   npx prisma migrate dev --name revert_[migration_name]
   ```

2. **Or manually run SQL** to undo the DDL:
   ```bash
   DATABASE_URL="..." npx prisma db execute --stdin <<< "
     DROP TABLE IF EXISTS [table_name];
     -- Add other reversal DDL as needed
   "
   ```

3. **Then delete the migration record:**
   ```bash
   DATABASE_URL="..." npx prisma db execute --stdin <<< "
     DELETE FROM _prisma_migrations WHERE migration_name = '[migration_folder_name]';
   "
   ```

### 5.3 Restore from Backup

```bash
# Restore a pg_dump backup
pg_restore --clean --if-exists --no-owner \
  -d "postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" \
  motofin-backup-20240101-120000.dump
```

---

## 6. Common Errors and Fixes

### Error: `P1001 - Can't reach database server`

**Cause:** Network connectivity issue or incorrect connection string.

**Fix:**
1. Verify you're using port `5432` (direct), not `6543` (pooled)
2. Check your network allows outbound connections to Supabase
3. Verify the project reference and password are correct
4. Confirm the Supabase project is in "Active" state (not paused)

```bash
# Test basic connectivity
nc -zv aws-0-ap-south-1.pooler.supabase.com 5432
```

### Error: `P3009 - migrate found failed migrations`

**Cause:** A previous migration was interrupted and is marked as failed.

**Fix:**
```bash
# View failed migrations
DATABASE_URL="..." npx prisma db execute --stdin <<< "
  SELECT migration_name, started_at, finished_at, rolled_back_at
  FROM _prisma_migrations
  WHERE rolled_back_at IS NOT NULL OR finished_at IS NULL;
"

# Mark the failed migration as rolled back
DATABASE_URL="..." npx prisma db execute --stdin <<< "
  DELETE FROM _prisma_migrations
  WHERE migration_name = '[failed_migration_name]';
"

# Manually clean up any partial DDL changes, then re-run
DATABASE_URL="..." npx prisma migrate deploy
```

### Error: `P3005 - database schema is not empty`

**Cause:** Running `migrate dev` against a database that already has tables (e.g., from Supabase default schema).

**Fix:** Use `migrate deploy` for production, not `migrate dev`:
```bash
# CORRECT for production:
DATABASE_URL="..." npx prisma migrate deploy

# WRONG for production (creates new migrations interactively):
# npx prisma migrate dev
```

### Error: `P1010 - User was denied access`

**Cause:** Incorrect database password or user permissions.

**Fix:**
1. Verify password has no special characters that need URL-encoding
2. URL-encode special characters: `@` → `%40`, `#` → `%23`, etc.
3. Reset password in Supabase: **Settings → Database → Reset Database Password**
4. Update `DATABASE_URL` with new password

### Error: `P2021 - Table does not exist` (at runtime)

**Cause:** Migrations were not applied, or Prisma Client is out of sync.

**Fix:**
```bash
# Re-run migrations
DATABASE_URL="..." npx prisma migrate deploy

# Regenerate Prisma Client
npx prisma generate
```

### Error: Seed fails with `Unique constraint failed`

**Cause:** Seed data conflicts with manually-inserted data.

**Fix:** The seed uses `upsert`, so this shouldn't happen. If it does:
1. Check for manually-inserted records with conflicting unique fields
2. Either delete conflicting records or update the seed script
3. Re-run: `DATABASE_URL="..." npx prisma db seed`

### Error: `prepared statement already exists` (at runtime)

**Cause:** Using pooled connection (port 6543) without `pgbouncer=true` parameter.

**Fix:** Ensure `DATABASE_URL` includes `?pgbouncer=true`:
```
DATABASE_URL="postgresql://...@...supabase.com:6543/postgres?pgbouncer=true&connection_limit=10"
```

---

## 7. Running from Local Machine vs CI/CD

### 7.1 From Local Machine (Manual Deployment)

Best for: Initial setup, emergency fixes, one-time operations.

```bash
# 1. Clone repo and navigate to API
git clone https://github.com/mettugoud-droid/MotoFin.git
cd MotoFin/apps/api

# 2. Install dependencies
npm install

# 3. Set the connection string (use direct port 5432)
export DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# 4. Run migrations
npx prisma migrate deploy

# 5. Run seed
npx prisma db seed

# 6. Verify
npx prisma db execute --stdin <<< "SELECT count(*) FROM tenants;"

# 7. Unset the variable when done
unset DATABASE_URL
```

### 7.2 From CI/CD (GitHub Actions)

Best for: Automated deployments, repeatable processes, team workflows.

Example GitHub Actions step:

```yaml
# .github/workflows/deploy.yml (relevant migration step)
- name: Run Database Migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL_DIRECT }}
  working-directory: apps/api
  run: |
    npx prisma generate
    npx prisma migrate deploy

- name: Run Database Seed (only on initial setup)
  if: github.event.inputs.run_seed == 'true'
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL_DIRECT }}
  working-directory: apps/api
  run: npx prisma db seed
```

**GitHub Secrets to configure:**
- `DATABASE_URL_DIRECT` — Direct connection string (port 5432) for migrations

### 7.3 From Railway (Build-time Migration)

Add to `apps/api/package.json` for automatic migration on deploy:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "prebuild": "prisma generate",
    "migrate:deploy": "prisma migrate deploy"
  }
}
```

Then configure Railway's start command to include migration:

```bash
npx prisma migrate deploy && node dist/main.js
```

> **Caution:** Running migrations in the start command means every deploy attempt runs migrations. This is safe because `migrate deploy` is idempotent — it only applies pending migrations. However, if a migration fails, the service won't start.

---

## 8. Operation Sequence for First-Time Production Setup

Execute these steps in order for initial production deployment:

```
1. Create Supabase project (SUPABASE-PRODUCTION-SETUP.md)
     ↓
2. Get direct connection string (port 5432)
     ↓
3. Run: npx prisma migrate deploy (this document, Section 2)
     ↓
4. Run: npx prisma db seed (this document, Section 3)
     ↓
5. Run verification queries (this document, Section 4)
     ↓
6. Deploy to Railway (RAILWAY-DEPLOYMENT-GUIDE.md)
     ↓
7. Verify API endpoints respond correctly
```

---

## Checklist

- [ ] Direct connection string obtained (port 5432)
- [ ] Network connectivity verified to Supabase
- [ ] Migrations applied successfully (`npx prisma migrate deploy`)
- [ ] Seed executed successfully (`npx prisma db seed`)
- [ ] Verification queries confirm expected row counts:
  - Tenants: 1
  - Roles: 5
  - Banks: 9
  - Bank Rules: 9
  - Lead Sources: 10
- [ ] No failed migrations in `_prisma_migrations` table
- [ ] Railway service can connect to database at runtime (pooled connection, port 6543)
