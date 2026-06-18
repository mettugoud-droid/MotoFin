# Vercel Deployment Guide — MotoFin Frontend

## Overview

This guide covers deploying the MotoFin Next.js frontend application to Vercel. The frontend is located in the `apps/web` directory of the monorepo.

---

## 1. Import Project from GitHub

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New…" → "Project"**
3. Select **"Import Git Repository"**
4. Connect GitHub account if not already connected
5. Search for and select: **`mettugoud-droid/MotoFin`**
6. Click **"Import"**

---

## 2. Configure Project Settings

### Root Directory

Set the **Root Directory** to:

```
apps/web
```

> Vercel will only build and deploy from this subdirectory.

### Framework Preset

- **Framework:** Next.js (auto-detected by Vercel)
- No manual framework selection needed

### Build & Output Settings

| Setting | Value |
|---------|-------|
| Install Command | `cd ../.. && npm install` |
| Build Command | `cd ../.. && npm run build --filter=web` |
| Output Directory | `.next` |

> **Note:** The install command navigates to the monorepo root to ensure all workspace dependencies are resolved correctly.

---

## 3. Environment Variables

Configure the following environment variables in Vercel Project Settings → Environment Variables:

| Variable | Value | Environment | Sensitivity |
|----------|-------|-------------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api.motofin.in` (production) | Production | Safe to expose |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Production | Safe to expose |
| `NEXT_PUBLIC_META_PIXEL_ID` | `XXXXXXXXXXXXXXX` | Production | Safe to expose |

> All `NEXT_PUBLIC_` prefixed variables are embedded into the client-side bundle at build time. These are intentionally public and safe to expose.

**Preview Environment Overrides:**

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api-staging.motofin.in` | Preview |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | _(leave empty or use test property)_ | Preview |
| `NEXT_PUBLIC_META_PIXEL_ID` | _(leave empty)_ | Preview |

---

## 4. Custom Domain Configuration

### Domain: `motofin.in`

1. Go to **Project Settings → Domains**
2. Add `motofin.in`
3. Add `www.motofin.in`

### DNS Records

Configure at your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `76.76.21.21` | 300 |
| CNAME | `www` | `cname.vercel-dns.com` | 300 |

> Vercel IP `76.76.21.21` is the standard Vercel edge network address. Verify the current IP in your Vercel dashboard as it may change.

### SSL Certificate

- **Provider:** Let's Encrypt (automatic)
- **Provisioning:** Automatic after DNS propagation (typically 5–30 minutes)
- **Renewal:** Automatic (no manual intervention needed)
- **Coverage:** Both `motofin.in` and `www.motofin.in`

---

## 5. Deployment Triggers

### Production Deployments

- **Trigger:** Push to `main` branch
- **URL:** `https://motofin.in`
- **Automatic:** Yes — every merge to `main` triggers a production build

### Preview Deployments

- **Trigger:** Opening or updating a Pull Request
- **URL:** Auto-generated unique URL (e.g., `https://motofin-git-feature-xyz.vercel.app`)
- **Automatic:** Yes — every PR gets its own preview deployment
- **Comments:** Vercel bot posts the preview URL directly in the PR

---

## 6. Post-Deployment Verification

After each production deployment, verify the following:

### Page Load Check

```bash
curl -s -o /dev/null -w "%{http_code}" https://motofin.in
# Expected: 200
```

### Calculator Form Renders

1. Open `https://motofin.in` in a browser
2. Verify the EMI savings calculator form is visible
3. Verify all input fields are interactive (loan amount, tenure, interest rates)

### API Calls Succeed

Open browser DevTools → Network tab:

1. Fill in calculator form and submit
2. Verify POST request to `NEXT_PUBLIC_API_URL/api/v1/calculator/savings` returns 200
3. Verify response contains `monthlySaving` field with a numeric value

### Analytics Verification

1. Open browser DevTools → Network tab
2. Verify Google Analytics beacon fires (`google-analytics.com/g/collect`)
3. Verify Meta Pixel fires (`facebook.com/tr`)

---

## 7. Rollback Procedure

Vercel keeps all previous deployments as immutable snapshots. Rollback is instant.

### Steps to Rollback

1. Go to **Vercel Dashboard → Project → Deployments**
2. Find the last known-good deployment (green checkmark)
3. Click the **three-dot menu (⋯)** on that deployment
4. Select **"Promote to Production"**
5. Confirm the action

> **Rollback time:** Instant (< 5 seconds). No rebuild required.

### When to Rollback

- Page returns 500 errors
- Calculator form doesn't render
- API calls fail due to frontend-side bugs
- Broken layout or critical UI issues

---

## 8. Troubleshooting

### Build Failures — Monorepo Dependencies

**Symptom:** `Module not found` errors during build

**Fix:**
1. Ensure the install command navigates to monorepo root: `cd ../.. && npm install`
2. Verify `package.json` workspaces are configured correctly
3. Check that shared packages are listed in `apps/web/package.json` dependencies
4. Clear Vercel build cache: Project Settings → General → "Clear Build Cache & Redeploy"

### Environment Variables Not Available

**Symptom:** API calls fail, analytics not firing, blank values in client code

**Fix:**
1. Verify variables are set in Vercel dashboard for the correct environment (Production vs Preview)
2. Remember: `NEXT_PUBLIC_` vars are embedded at **build time**, not runtime
3. After changing env vars, trigger a new deployment (changes don't apply retroactively)
4. Check for typos in variable names

### CORS Issues

**Symptom:** Browser console shows `Access-Control-Allow-Origin` errors

**Fix:**
1. Verify the backend `CORS_ORIGINS` env var includes `https://motofin.in`
2. Ensure the API URL in `NEXT_PUBLIC_API_URL` matches the backend's allowed origins exactly (no trailing slash)
3. Check that preview deployment URLs are also allowed in staging backend CORS config
4. Verify the backend returns proper CORS headers:
   ```bash
   curl -I -X OPTIONS https://api.motofin.in/api/v1/calculator/savings \
     -H "Origin: https://motofin.in" \
     -H "Access-Control-Request-Method: POST"
   ```

### Deployment Stuck or Queued

**Symptom:** Deployment shows "Queued" for extended time

**Fix:**
1. Check [Vercel Status Page](https://www.vercel-status.com/)
2. Cancel the deployment and re-trigger by pushing an empty commit:
   ```bash
   git commit --allow-empty -m "chore: trigger redeploy" && git push
   ```

---

## 9. Useful Links

| Resource | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Vercel Docs — Monorepos | https://vercel.com/docs/monorepos |
| Vercel Docs — Custom Domains | https://vercel.com/docs/custom-domains |
| Vercel Status | https://www.vercel-status.com/ |
| Let's Encrypt | https://letsencrypt.org/ |
