# ACME Pharmacy Analytics

**A Sigma-class analytics demo for pharmacy products**

Built with Next.js 15, TypeScript, Prisma, SQLite, and shadcn/ui.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up database
cd apps/web
npm run db:push
npm run db:seed

# 3. Start development server
npm run dev

# 4. Open browser
http://localhost:3000
```

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| exec@acme.com | demo123 | EXEC |
| analyst@acme.com | demo123 | CLIENT_VIEWER |
| admin@acme.com | demo123 | CLIENT_ADMIN |
| ops@outcomes.com | demo123 | INTERNAL_OPS |
| pm@outcomes.com | demo123 | PRODUCT |
| compliance@outcomes.com | demo123 | COMPLIANCE |

## Features

### 7 Pillars
1. **Client Analytics** — Adherence, gaps, CMR/TMR completion
2. **Exec Overview** — Star Ratings proxy, impact scoreboard
3. **Internal Ops** — Pipeline health, feed latency, SLA tracking
4. **Product Metrics** — DAU/WAU/MAU, adoption, retention
5. **Insights & Alerts** — Rules-based notifications with playbooks
6. **Admin/Governance** — Metrics catalog, lineage, RBAC
7. **AI Chat** — Grounded Q&A with metric definitions

### Security & Governance
- **Row-Level Security (RLS)** enforced per role
- **6 roles** with scoped access (CLIENT_VIEWER, EXEC, INTERNAL_OPS, etc.)
- **Audit trail** for all data access
- **100% synthetic data** (no real PHI/PII)

### Impact-First Design
Every metric answers:
- **So what?** — Why does this matter?
- **Now what?** — What action should I take?

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui, Recharts
- **Backend:** Next.js API routes
- **Database:** SQLite (via Prisma)
- **Auth:** NextAuth.js with credentials provider
- **Data Fetching:** TanStack Query (React Query)
- **Validation:** Zod
- **Testing:** Playwright

---

## Project Structure

```
acme-pharmacy-analytics/
├── apps/
│   └── web/          # Next.js application
├── packages/
│   ├── lib/          # Shared business logic (metrics, rules, AI)
│   └── ui/           # Shared UI components (optional)
├── docs/             # Documentation
└── tests/            # E2E tests
```

---

## Documentation

- **[Implementation Blueprint](IMPLEMENTATION_BLUEPRINT.md)** — Complete architecture guide
- **[Spec Kit](../acme-pharmacy-analytics-spec/)** — Full product specification
- **[Demo Script](docs/DEMO.md)** — 2-minute demo walkthrough (to be created)
- **[API Documentation](docs/API.md)** — API route reference (to be created)

---

## Development

```bash
# Start dev server
npm run dev

# Database commands
npm run db:push      # Apply schema changes
npm run db:seed      # Seed with demo data
npm run db:studio    # Open Prisma Studio

# Type checking
npm run typecheck

# Linting
npm run lint

# E2E tests
npm run test:e2e
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   ```
   DATABASE_URL="..."  # Use Turso or PlanetScale
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NEXTAUTH_SECRET="your-secret-key"
   ```
4. Deploy

---

## Key Metrics Implemented

### Adherence Metrics
- **PDC_90** — Proportion of Days Covered (90-day window)
- **PDC_180** — PDC for 180-day window
- **MPR_90** — Medication Possession Ratio
- **Threshold:** ≥80% for Star Ratings compliance

### Gap Closure
- **Cycle Time** — Days from detection → closure
- **Target:** ≤14 days median

### Star Ratings
- **Star Proxy** — Composite score (adherence + CMR + gaps)
- **Target:** ≥4.0 stars

### Product Metrics
- **DAU/WAU/MAU** — Active users
- **Stickiness** — DAU/MAU ratio
- **Feature Adoption** — % users who used feature
- **Retention** — Cohort retention curves

---

## Notification Rules

5 pre-configured rules with SLAs:

1. **Adherence Risk Spike** — PDC drop ≥5pp WoW (SLA: 48h)
2. **Feed Latency Breach** — Lag >24h (SLA: 4h)
3. **Gap Closure Backlog** — Open gaps >30 days (SLA: 120h)
4. **Star Proxy Decline** — 3-week downtrend (SLA: 24h)
5. **CMR Completion Lag** — <50% at week 10 (SLA: 72h)

---

## RBAC & RLS

### Roles
- **CLIENT_VIEWER** — ACME analyst (read-only, ACME data only)
- **CLIENT_ADMIN** — ACME admin (full access, ACME data only)
- **EXEC** — ACME executive (strategic dashboards, ACME data only)
- **INTERNAL_OPS** — Outcomes ops team (all clients, ops focus)
- **PRODUCT** — Outcomes product team (aggregated, no PII)
- **COMPLIANCE** — Outcomes compliance (full audit access)

### RLS Filters
```typescript
CLIENT_VIEWER/ADMIN/EXEC → WHERE client_id = 'ACME'
INTERNAL_OPS/PRODUCT → WHERE org_id = 'Outcomes'
COMPLIANCE → (no filter, full access)
```

---

## License

MIT

---

## Credits

Spec Kit based on [ACME Pharmacy Analytics Spec Kit](../acme-pharmacy-analytics-spec/)

Built by the Outcomes Product & Engineering team.
