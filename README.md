# MotoFin Vehicle Finance Opportunity Engine

Vehicle Finance CRM + Lead Intelligence Platform

## Tech Stack

- **Backend:** NestJS + TypeScript + Prisma + PostgreSQL 16
- **Frontend:** Next.js 15 + TypeScript + Tailwind + shadcn/ui
- **Auth:** Supabase
- **Cache:** Redis
- **Automation:** n8n
- **Infrastructure:** Docker + AWS ECS (future)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start infrastructure
docker-compose up -d

# 3. Start development servers
npm run dev
# API: http://localhost:3001
# Web: http://localhost:3000
```

## Project Structure

```
vehicle-finance-platform/
├── apps/
│   ├── api/          # NestJS Backend (Port 3001)
│   └── web/          # Next.js Frontend (Port 3000)
├── packages/
│   ├── shared/       # Shared types and constants
│   ├── tsconfig/     # TypeScript configurations
│   └── eslint-config/ # ESLint rules
├── docker-compose.yml
└── turbo.json
```

## Development

```bash
npm run dev          # Start all apps
npm run build        # Build all apps
npm run lint         # Lint all apps
npm run test         # Test all apps
npm run format       # Format all files
```
