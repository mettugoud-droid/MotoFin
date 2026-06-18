# MotoFin Go-Live Deployment Checklist

---

## Step 1: Push Code to GitHub

```bash
cd /projects/sandbox/vehicle-finance-platform
git init
git add -A
git commit -m "feat: Sprint 1 complete - Calculator, Lead Capture, Pre-Approval, Notifications"
git remote add origin https://github.com/mettugoud-droid/MotoFin.git
git branch -M main
git push -u origin main --force
```

- [ ] Code pushed successfully
- [ ] All files visible on GitHub

---

## Step 2: Verify Repository Structure

- [ ] apps/api/ contains NestJS source
- [ ] apps/web/ contains Next.js source
- [ ] packages/ contains shared configs
- [ ] prisma/schema.prisma exists
- [ ] docker-compose.yml exists

---

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect GitHub: `mettugoud-droid/MotoFin`
3. Root Directory: `apps/web`
4. Framework: Next.js
5. Set environment variables (see PRODUCTION-ENVIRONMENT-VARS.md)
6. Deploy

- [ ] Build succeeds
- [ ] Site accessible at Vercel URL
- [ ] Custom domain configured (if available)

---

## Step 4: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → New Project
2. Connect GitHub: `mettugoud-droid/MotoFin`
3. Root Directory: `apps/api`
4. Set environment variables
5. Deploy

- [ ] Build succeeds
- [ ] Health check passes: GET /api/health

---

## Step 5: Create Supabase Production Database

1. Go to [supabase.com](https://supabase.com) → New Project
2. Region: Mumbai (ap-south-1)
3. Copy connection string (pooled, port 6543)
4. Set `DATABASE_URL` in Railway

- [ ] Project created
- [ ] Connection string copied

---

## Step 6: Run Prisma Migrations

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

- [ ] All tables created
- [ ] No migration errors

---

## Step 7: Run Seed Data

```bash
DATABASE_URL="postgresql://..." npx prisma db seed
```

- [ ] 1 tenant seeded
- [ ] 5 roles seeded
- [ ] 9 banks seeded
- [ ] 9 bank rules seeded
- [ ] 10 lead sources seeded

---

## Step 8: Verify APIs

```bash
# Health
curl https://[RAILWAY_URL]/api/health

# Calculator
curl -X POST https://[RAILWAY_URL]/api/v1/calculator/savings \
  -H "Content-Type: application/json" \
  -d '{"currentEmi":25000,"outstandingAmount":800000,"currentRate":12.5,"remainingTenure":36,"originalTenure":60}'
```

- [ ] Health returns 200
- [ ] Calculator returns savings data

---

## Step 9: Verify Landing Page

- [ ] Page loads at Vercel URL
- [ ] Calculator form renders
- [ ] Form validation works
- [ ] API calls succeed (check browser console)

---

## Step 10: Verify Lead Capture

- [ ] Submit test lead (own phone number)
- [ ] Check Supabase: lead appears in `leads` table
- [ ] Notification logged in Railway logs
- [ ] Success screen displays

---

## Final Sign-Off

| Check | Status |
|-------|:------:|
| Frontend live | ☐ |
| Backend live | ☐ |
| Database seeded | ☐ |
| Calculator working | ☐ |
| Lead capture working | ☐ |
| **GO LIVE** | ☐ |
