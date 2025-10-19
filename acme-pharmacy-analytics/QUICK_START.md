# Quick Start Guide

**Get the ACME Pharmacy Analytics demo running in 15 minutes**

---

## Prerequisites

- Node.js 18+ and npm 9+
- Git
- Code editor (VS Code recommended)

---

## Step-by-Step Setup

### 1. Clone or Verify Repository

```bash
cd c:\Users\default.LAPTOP-BOBEDDVK\OneDrive\Documents\GitHub\bi-demo
ls acme-pharmacy-analytics  # Should see package.json and IMPLEMENTATION_BLUEPRINT.md
```

### 2. Initialize Workspaces

Based on the Implementation Blueprint, you need to create the monorepo structure. Here's a streamlined approach:

```bash
cd acme-pharmacy-analytics

# Create directory structure
mkdir -p apps/web packages/lib packages/ui docs tests/e2e

# Initialize workspace root (already done - package.json exists)
npm install
```

### 3. Create Next.js App

```bash
cd apps/web

# Option A: Create fresh Next.js app
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint

# Option B: Or manually create apps/web/package.json with these contents:
```

**Create `apps/web/package.json`:**

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.5.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^6.3.0",
    "next-auth": "^5.0.0-beta.25",
    "@auth/prisma-adapter": "^2.7.4",
    "bcryptjs": "^2.4.3",
    "zod": "^3.24.1",
    "@tanstack/react-query": "^5.62.11",
    "recharts": "^2.15.0",
    "date-fns": "^4.1.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.7",
    "@types/react-dom": "^19.0.4",
    "@types/bcryptjs": "^2.4.6",
    "prisma": "^6.3.0",
    "tsx": "^4.20.0",
    "@faker-js/faker": "^9.4.0",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.18.0",
    "eslint-config-next": "^15.5.6",
    "@playwright/test": "^1.49.1"
  }
}
```

### 4. Install Dependencies

```bash
# In apps/web
npm install

# Or from root
cd ../..
npm install
```

### 5. Initialize shadcn/ui

```bash
cd apps/web
npx shadcn@latest init

# When prompted:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Add essential components
npx shadcn@latest add button card badge table dialog select input label textarea
npx shadcn@latest add dropdown-menu separator tabs toast alert
```

### 6. Set Up Prisma

```bash
# Create prisma directory
mkdir -p prisma

# Copy schema from IMPLEMENTATION_BLUEPRINT.md to prisma/schema.prisma
# Copy seed script from IMPLEMENTATION_BLUEPRINT.md to prisma/seed.ts

# Push schema to database
npm run db:push
```

### 7. Create Environment Variables

Create `apps/web/.env.local`:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="supersecretkey-change-in-production-123456"
```

### 8. Seed Database

```bash
npm run db:seed
```

Expected output:
```
🌱 Seeding database...
Creating 5000 members...
Creating claims...
Creating adherence facts...
Creating gaps...
Creating ops telemetry...
Creating product telemetry...
Creating notifications...
✅ Seeding complete!
Created:
  - 1 organization (Outcomes)
  - 1 client (ACME Pharmacy)
  - 6 demo users
  - 3 payers
  - 6 plans
  - 6 drugs
  - 5,000 members
  - ~40,000 claims
  - ~15,000 adherence facts
  - 500 gaps
  - ~270 ops records
  - 10,000 product telemetry events
  - 3 notifications
```

### 9. Create Minimal Auth Setup

Create these files (see IMPLEMENTATION_BLUEPRINT.md for full content):

- `apps/web/lib/auth.ts` — NextAuth configuration
- `apps/web/lib/prisma.ts` — Prisma client singleton
- `apps/web/lib/rbac.ts` — RBAC utilities
- `apps/web/app/api/auth/[...nextauth]/route.ts` — Auth API route

### 10. Create Basic Landing Page

Create `apps/web/app/page.tsx`:

```typescript
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">ACME Pharmacy Analytics</h1>
      <p className="text-xl text-muted-foreground mb-8">Sigma-class analytics demo</p>
      <a
        href="/api/auth/signin"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Sign In
      </a>
    </div>
  )
}
```

### 11. Start Development Server

```bash
npm run dev
```

Open browser: `http://localhost:3000`

### 12. Login with Demo Credentials

Use any of these credentials:

- **Executive View:** exec@acme.com / demo123
- **Analyst View:** analyst@acme.com / demo123
- **Ops View:** ops@outcomes.com / demo123

---

## Next Steps (Incremental Build)

### Phase 1: Build One Complete Dashboard

Start with **Client Analytics** dashboard:

1. Create `apps/web/app/dashboard/layout.tsx` — authenticated shell with nav
2. Create `apps/web/app/dashboard/client-analytics/page.tsx`
3. Create API route: `apps/web/app/api/kpis/client/route.ts`
4. Create KPI components: `components/kpis/kpi-card.tsx`, `kpi-ribbon.tsx`
5. Create chart component: `components/charts/adherence-trend-chart.tsx`

### Phase 2: Replicate for Other Dashboards

Once Client Analytics works end-to-end:
- Copy pattern to Exec Overview
- Copy pattern to Internal Ops
- Copy pattern to Product Metrics
- Add Insights & Alerts
- Add Admin/Governance
- Add AI Chat

### Phase 3: Polish & Test

- Add Playwright tests
- Refine UI/UX
- Add loading states, error boundaries
- Optimize queries
- Add more charts

---

## Troubleshooting

### "prisma: command not found"

```bash
npm install -D prisma
npx prisma db push
```

### "Module not found: Can't resolve '@/lib/prisma'"

Create `apps/web/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### "Seed script fails"

Make sure to:
1. Install `@faker-js/faker` and `bcryptjs`
2. Install `tsx` for TypeScript execution
3. Add `"type": "module"` to package.json OR use `tsx` instead of `ts-node`

### Database locked

```bash
# Stop dev server
# Delete dev.db
rm prisma/dev.db

# Re-push and re-seed
npm run db:push
npm run db:seed
```

---

## Estimated Timeline

- **Setup (Steps 1-8):** 30-45 minutes
- **Build first dashboard (Client Analytics):** 3-4 hours
- **Build remaining 6 dashboards:** 12-16 hours
- **Polish & testing:** 6-8 hours

**Total for MVP:** ~20-28 hours

---

## Helpful Commands

```bash
# View database in browser
npm run db:studio

# Check TypeScript errors
npm run typecheck

# Run linter
npm run lint

# Clean node_modules
npm run clean
npm install
```

---

## Architecture Reminder

```
apps/web/
├── app/
│   ├── page.tsx (login/landing)
│   ├── dashboard/
│   │   ├── layout.tsx (nav, auth check)
│   │   ├── client-analytics/page.tsx
│   │   └── ...
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── kpis/client/route.ts
│       └── ...
├── components/
│   ├── ui/ (shadcn components)
│   ├── charts/
│   ├── kpis/
│   └── ...
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── rbac.ts
│   └── utils.ts
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

---

## Demo Credentials Reminder

| Email | Password | Role | What You'll See |
|-------|----------|------|-----------------|
| analyst@acme.com | demo123 | CLIENT_VIEWER | ACME Pharmacy analytics (read-only) |
| admin@acme.com | demo123 | CLIENT_ADMIN | ACME Pharmacy full access + alerts |
| exec@acme.com | demo123 | EXEC | ACME executive dashboard (Star Ratings, trends) |
| ops@outcomes.com | demo123 | INTERNAL_OPS | Outcomes ops monitoring (feeds, pipelines) |
| pm@outcomes.com | demo123 | PRODUCT | Outcomes product metrics (usage, adoption) |
| compliance@outcomes.com | demo123 | COMPLIANCE | Full audit access (all clients) |

---

**You're ready to start building! Begin with Phase 1 and build incrementally.**

For complete architecture details, see [IMPLEMENTATION_BLUEPRINT.md](IMPLEMENTATION_BLUEPRINT.md)
