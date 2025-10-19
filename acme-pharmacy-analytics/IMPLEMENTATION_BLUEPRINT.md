# ACME Pharmacy Analytics - Implementation Blueprint

**Generated:** 2025-10-19
**Target:** Production-quality Sigma-class analytics demo
**Tech Stack:** Next.js 15, TypeScript, Prisma, SQLite, shadcn/ui, Recharts

---

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npm run db:push
npm run db:seed

# 3. Start dev server
npm run dev

# 4. Open browser
http://localhost:3000

# 5. Login with demo credentials (see below)
```

---

## Demo Credentials

| Email | Password | Role | Access |
|-------|----------|------|--------|
| exec@acme.com | demo123 | EXEC | ACME Pharmacy executive dashboards |
| analyst@acme.com | demo123 | CLIENT_VIEWER | ACME Pharmacy analytics (read-only) |
| admin@acme.com | demo123 | CLIENT_ADMIN | ACME Pharmacy admin (full access) |
| ops@outcomes.com | demo123 | INTERNAL_OPS | Outcomes internal ops monitoring |
| pm@outcomes.com | demo123 | PRODUCT | Outcomes product metrics |
| compliance@outcomes.com | demo123 | COMPLIANCE | Full audit access |

---

## Monorepo Structure

```
acme-pharmacy-analytics/
├── package.json (workspace root)
├── tsconfig.json
├── .gitignore
├── README.md
├── IMPLEMENTATION_BLUEPRINT.md (this file)
│
├── apps/
│   └── web/
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       ├── .env.local
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── seed.ts
│       │   └── migrations/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx (landing/login)
│       │   ├── dashboard/
│       │   │   ├── layout.tsx (authenticated shell)
│       │   │   ├── client-analytics/page.tsx
│       │   │   ├── exec-overview/page.tsx
│       │   │   ├── internal-ops/page.tsx
│       │   │   ├── product-metrics/page.tsx
│       │   │   ├── insights/page.tsx
│       │   │   ├── admin/page.tsx
│       │   │   └── ai-chat/page.tsx
│       │   ├── api/
│       │   │   ├── auth/[...nextauth]/route.ts
│       │   │   ├── kpis/
│       │   │   │   ├── client/route.ts
│       │   │   │   └── exec/route.ts
│       │   │   ├── ops/health/route.ts
│       │   │   ├── product/metrics/route.ts
│       │   │   ├── insights/
│       │   │   │   ├── list/route.ts
│       │   │   │   ├── ack/route.ts
│       │   │   │   └── snooze/route.ts
│       │   │   ├── definitions/metric/route.ts
│       │   │   ├── search/members/route.ts
│       │   │   └── ai/query/route.ts
│       │   └── globals.css
│       ├── components/
│       │   ├── ui/ (shadcn/ui components)
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── table.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── select.tsx
│       │   │   └── ...
│       │   ├── charts/
│       │   │   ├── adherence-trend-chart.tsx
│       │   │   ├── star-proxy-chart.tsx
│       │   │   ├── latency-heatmap.tsx
│       │   │   └── usage-funnel.tsx
│       │   ├── kpis/
│       │   │   ├── kpi-card.tsx
│       │   │   ├── kpi-ribbon.tsx
│       │   │   └── impact-badge.tsx
│       │   ├── nav/
│       │   │   ├── main-nav.tsx
│       │   │   ├── user-menu.tsx
│       │   │   └── breadcrumbs.tsx
│       │   ├── filters/
│       │   │   ├── cohort-builder.tsx
│       │   │   ├── time-grain-selector.tsx
│       │   │   └── plan-region-filter.tsx
│       │   └── insights/
│       │       ├── alert-inbox.tsx
│       │       ├── alert-card.tsx
│       │       └── playbook-link.tsx
│       ├── lib/
│       │   ├── auth.ts (NextAuth config)
│       │   ├── prisma.ts (Prisma client singleton)
│       │   ├── rbac.ts (role checking utilities)
│       │   └── utils.ts (cn, formatters)
│       ├── middleware.ts (RBAC enforcement)
│       └── types/
│           ├── api.ts
│           ├── auth.ts
│           └── metrics.ts
│
├── packages/
│   ├── ui/ (shared UI components - optional for monorepo)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts
│   └── lib/ (shared business logic)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── metrics/
│           │   ├── adherence.ts (PDC, MPR calculators)
│           │   ├── gaps.ts (cycle time, closure rate)
│           │   ├── star-ratings.ts (proxy calculator)
│           │   └── product.ts (DAU/WAU/MAU)
│           ├── rules/
│           │   ├── engine.ts (rule evaluator)
│           │   ├── deduplication.ts
│           │   └── escalation.ts
│           ├── sql/
│           │   ├── builders.ts (SQL query builders)
│           │   ├── filters.ts (RLS filter helpers)
│           │   └── aggregations.ts
│           └── ai/
│               ├── intent-parser.ts (NL → SQL intent)
│               ├── grounding.ts (metric definition lookup)
│               └── guardrails.ts (safety checks)
│
├── docs/
│   ├── DEMO.md (2-minute demo script)
│   ├── IMPACT_FIRST.md (impact-first messaging guide)
│   ├── ARCHITECTURE.md (system design)
│   ├── API.md (API route documentation)
│   └── DEPLOYMENT.md (Vercel deployment guide)
│
└── tests/
    └── e2e/
        ├── client-analytics.spec.ts
        ├── rbac.spec.ts
        └── insights.spec.ts
```

---

## Phase 1: Foundation (Estimated: 4-6 hours)

### 1.1 Initialize Monorepo

```bash
# From project root
npm init -y
# Edit package.json to add workspaces
mkdir -p apps/web packages/lib packages/ui docs tests/e2e
```

### 1.2 Create Next.js App

```bash
cd apps/web
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint
```

### 1.3 Install Dependencies

```bash
# In apps/web
npm install @prisma/client @auth/core next-auth@beta
npm install zod react-query @tanstack/react-query
npm install recharts date-fns
npm install -D prisma ts-node @types/node

# shadcn/ui (run init and add components)
npx shadcn@latest init
npx shadcn@latest add button card badge table dialog select input label textarea
npx shadcn@latest add dropdown-menu separator tabs toast
```

### 1.4 Prisma Schema

Create `apps/web/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed
  name      String
  role      String   // EXEC, CLIENT_VIEWER, CLIENT_ADMIN, INTERNAL_OPS, PRODUCT, COMPLIANCE
  orgId     String?
  clientId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  org    DimOrg?    @relation(fields: [orgId], references: [id])
  client DimClient? @relation(fields: [clientId], references: [id])
}

model DimClient {
  id        String   @id @default(cuid())
  name      String   // "ACME Pharmacy"
  segment   String   // "Mid-Market"
  region    String   // "Northeast"
  createdAt DateTime @default(now())

  members      DimMember[]
  claims       FactClaim[]
  adherence    FactAdherence[]
  gaps         FactGap[]
  notifications FactNotification[]
  users        User[]
}

model DimOrg {
  id        String   @id @default(cuid())
  name      String   // "Outcomes"
  type      String   // "Internal"
  createdAt DateTime @default(now())

  users        User[]
  telemetry    FactProductTelemetry[]
  ops          FactOps[]
}

model DimMember {
  id         String   @id @default(cuid())
  clientId   String
  dob        DateTime
  gender     String   // M, F, Other
  riskBand   String   // Low, Medium, High
  planId     String
  createdAt  DateTime @default(now())

  client     DimClient      @relation(fields: [clientId], references: [id])
  plan       DimPlan        @relation(fields: [planId], references: [id])
  claims     FactClaim[]
  adherence  FactAdherence[]
  gaps       FactGap[]

  @@index([clientId])
  @@index([planId])
}

model DimPlan {
  id         String   @id @default(cuid())
  payerId    String
  name       String
  type       String   // Medicare Advantage, Part D
  region     String
  createdAt  DateTime @default(now())

  payer      DimPayer   @relation(fields: [payerId], references: [id])
  members    DimMember[]
  claims     FactClaim[]

  @@index([payerId])
}

model DimPayer {
  id         String   @id @default(cuid())
  name       String   // "Payer A", "Payer B"
  region     String
  createdAt  DateTime @default(now())

  plans      DimPlan[]
}

model DimDrug {
  id            String   @id @default(cuid())
  name          String
  drugClass     String   // Diabetes, Hypertension, Statins
  brandGeneric  String   // Brand, Generic
  createdAt     DateTime @default(now())

  claims        FactClaim[]
}

model FactClaim {
  id          String   @id @default(cuid())
  clientId    String
  memberId    String
  drugId      String
  planId      String
  claimDate   DateTime
  daysSupply  Int
  paidAmount  Float
  status      String   // paid, denied, pending
  createdAt   DateTime @default(now())

  client      DimClient @relation(fields: [clientId], references: [id])
  member      DimMember @relation(fields: [memberId], references: [id])
  drug        DimDrug   @relation(fields: [drugId], references: [id])
  plan        DimPlan   @relation(fields: [planId], references: [id])

  @@index([clientId])
  @@index([memberId])
  @@index([claimDate])
}

model FactAdherence {
  id          String   @id @default(cuid())
  clientId    String
  memberId    String
  drugClass   String   // Diabetes, Hypertension, Statins
  pdc90       Float    // 0-100
  pdc180      Float
  mpr90       Float
  asOfDate    DateTime
  createdAt   DateTime @default(now())

  client      DimClient @relation(fields: [clientId], references: [id])
  member      DimMember @relation(fields: [memberId], references: [id])

  @@index([clientId])
  @@index([memberId])
  @@index([asOfDate])
}

model FactGap {
  id          String    @id @default(cuid())
  clientId    String
  memberId    String
  gapType     String    // Adherence, Screening, Preventive
  detectedAt  DateTime
  closedAt    DateTime?
  status      String    // open, closed
  severity    String    // Low, Medium, High
  createdAt   DateTime  @default(now())

  client      DimClient @relation(fields: [clientId], references: [id])
  member      DimMember @relation(fields: [memberId], references: [id])

  @@index([clientId])
  @@index([status])
}

model FactOps {
  id            String   @id @default(cuid())
  orgId         String
  feedName      String   // claims_feed, member_roster, gaps_feed
  ingestedAt    DateTime
  expectedRows  Int
  actualRows    Int
  latencyHours  Float
  status        String   // success, failure, delayed
  createdAt     DateTime @default(now())

  org           DimOrg   @relation(fields: [orgId], references: [id])

  @@index([orgId])
  @@index([ingestedAt])
}

model FactProductTelemetry {
  id          String   @id @default(cuid())
  orgId       String
  userId      String
  feature     String   // dashboard_view, export_csv, drill_down
  action      String   // view, click, export
  ts          DateTime
  durationMs  Int?
  createdAt   DateTime @default(now())

  org         DimOrg   @relation(fields: [orgId], references: [id])

  @@index([orgId])
  @@index([ts])
}

model FactNotification {
  id          String    @id @default(cuid())
  clientId    String?
  ruleKey     String    // adherence_risk_spike, feed_latency_breach
  entityRef   String    // Plan XYZ, Feed claims_feed
  severity    String    // Critical, High, Medium, Low
  owner       String    // CLIENT_ADMIN, INTERNAL_OPS
  slaHours    Int
  playbookUrl String?
  status      String    // open, triaged, resolved, snoozed
  createdAt   DateTime  @default(now())
  acknowledgedAt DateTime?
  resolvedAt  DateTime?

  client      DimClient? @relation(fields: [clientId], references: [id])

  @@index([clientId])
  @@index([status])
  @@index([createdAt])
}
```

### 1.5 Environment Variables

Create `apps/web/.env.local`:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"
```

---

## Phase 2: Authentication & RBAC (Estimated: 3-4 hours)

### 2.1 NextAuth Configuration

Create `apps/web/lib/auth.ts`:

```typescript
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { client: true, org: true }
        })

        if (!user) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          clientId: user.clientId,
          orgId: user.orgId
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.clientId = user.clientId
        token.orgId = user.orgId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.clientId = token.clientId as string | null
        session.user.orgId = token.orgId as string | null
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  }
}
```

### 2.2 RBAC Middleware

Create `apps/web/lib/rbac.ts`:

```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export type Role = "EXEC" | "CLIENT_VIEWER" | "CLIENT_ADMIN" | "INTERNAL_OPS" | "PRODUCT" | "COMPLIANCE"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role as Role)) {
    throw new Error("Forbidden: Insufficient permissions")
  }
  return session
}

export function buildRLSFilter(session: any) {
  const { role, clientId, orgId } = session.user

  // RLS rules by role
  switch (role) {
    case "CLIENT_VIEWER":
    case "CLIENT_ADMIN":
    case "EXEC":
      // Only see their client's data
      return { clientId }

    case "INTERNAL_OPS":
    case "PRODUCT":
      // Only see their org's data
      return { orgId }

    case "COMPLIANCE":
      // See all data (audit access)
      return {}

    default:
      throw new Error("Unknown role")
  }
}
```

---

## Phase 3: Seed Data (Estimated: 3-4 hours)

### 3.1 Seed Script

Create `apps/web/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'
import { addDays, subDays } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.$transaction([
    prisma.factNotification.deleteMany(),
    prisma.factProductTelemetry.deleteMany(),
    prisma.factOps.deleteMany(),
    prisma.factGap.deleteMany(),
    prisma.factAdherence.deleteMany(),
    prisma.factClaim.deleteMany(),
    prisma.dimMember.deleteMany(),
    prisma.dimPlan.deleteMany(),
    prisma.dimPayer.deleteMany(),
    prisma.dimDrug.deleteMany(),
    prisma.user.deleteMany(),
    prisma.dimClient.deleteMany(),
    prisma.dimOrg.deleteMany(),
  ])

  // Create Outcomes org
  const outcomesOrg = await prisma.dimOrg.create({
    data: {
      name: 'Outcomes',
      type: 'Internal'
    }
  })

  // Create ACME Pharmacy client
  const acmeClient = await prisma.dimClient.create({
    data: {
      name: 'ACME Pharmacy',
      segment: 'Mid-Market',
      region: 'Northeast'
    }
  })

  // Create demo users
  const passwordHash = await bcrypt.hash('demo123', 10)

  await prisma.user.createMany({
    data: [
      {
        email: 'exec@acme.com',
        password: passwordHash,
        name: 'David Chen',
        role: 'EXEC',
        clientId: acmeClient.id
      },
      {
        email: 'analyst@acme.com',
        password: passwordHash,
        name: 'Maria Rodriguez',
        role: 'CLIENT_VIEWER',
        clientId: acmeClient.id
      },
      {
        email: 'admin@acme.com',
        password: passwordHash,
        name: 'ACME Admin',
        role: 'CLIENT_ADMIN',
        clientId: acmeClient.id
      },
      {
        email: 'ops@outcomes.com',
        password: passwordHash,
        name: 'Priya Patel',
        role: 'INTERNAL_OPS',
        orgId: outcomesOrg.id
      },
      {
        email: 'pm@outcomes.com',
        password: passwordHash,
        name: 'Alex Kim',
        role: 'PRODUCT',
        orgId: outcomesOrg.id
      },
      {
        email: 'compliance@outcomes.com',
        password: passwordHash,
        name: 'Sarah Mitchell',
        role: 'COMPLIANCE',
        orgId: outcomesOrg.id
      }
    ]
  })

  // Create payers
  const payers = await Promise.all([
    prisma.dimPayer.create({ data: { name: 'Payer A', region: 'Northeast' } }),
    prisma.dimPayer.create({ data: { name: 'Payer B', region: 'Southeast' } }),
    prisma.dimPayer.create({ data: { name: 'Payer C', region: 'Midwest' } })
  ])

  // Create plans
  const plans = await Promise.all(
    payers.flatMap(payer =>
      ['Medicare Advantage', 'Part D'].map(type =>
        prisma.dimPlan.create({
          data: {
            payerId: payer.id,
            name: `${payer.name} ${type}`,
            type,
            region: payer.region
          }
        })
      )
    )
  )

  // Create drugs
  const drugClasses = ['Diabetes', 'Hypertension', 'Statins']
  const drugs = await Promise.all(
    drugClasses.flatMap(drugClass =>
      ['Brand', 'Generic'].map(brandGeneric =>
        prisma.dimDrug.create({
          data: {
            name: `${drugClass} ${brandGeneric} Drug`,
            drugClass,
            brandGeneric
          }
        })
      )
    )
  )

  // Create 5000 members
  console.log('Creating 5000 members...')
  const members = []
  for (let i = 0; i < 5000; i++) {
    const plan = plans[Math.floor(Math.random() * plans.length)]
    members.push({
      clientId: acmeClient.id,
      dob: faker.date.birthdate({ min: 65, max: 85, mode: 'age' }),
      gender: faker.helpers.arrayElement(['M', 'F', 'Other']),
      riskBand: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
      planId: plan.id
    })
  }
  await prisma.dimMember.createMany({ data: members })
  const createdMembers = await prisma.dimMember.findMany()

  // Create claims (8 claims/member avg = 40K claims)
  console.log('Creating claims...')
  const claims = []
  for (const member of createdMembers) {
    const numClaims = faker.number.int({ min: 4, max: 12 })
    for (let i = 0; i < numClaims; i++) {
      const drug = drugs[Math.floor(Math.random() * drugs.length)]
      const plan = plans.find(p => p.id === member.planId)!
      claims.push({
        clientId: acmeClient.id,
        memberId: member.id,
        drugId: drug.id,
        planId: plan.id,
        claimDate: faker.date.recent({ days: 90 }),
        daysSupply: faker.helpers.arrayElement([30, 60, 90]),
        paidAmount: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
        status: faker.helpers.weightedArrayElement([
          { value: 'paid', weight: 85 },
          { value: 'denied', weight: 10 },
          { value: 'pending', weight: 5 }
        ])
      })
    }
  }
  await prisma.factClaim.createMany({ data: claims })

  // Create adherence facts
  console.log('Creating adherence facts...')
  const adherenceFacts = []
  for (const member of createdMembers) {
    for (const drugClass of drugClasses) {
      // Base PDC with realistic distribution
      const basePDC = faker.number.float({ min: 60, max: 95 })
      adherenceFacts.push({
        clientId: acmeClient.id,
        memberId: member.id,
        drugClass,
        pdc90: basePDC,
        pdc180: basePDC + faker.number.float({ min: -5, max: 5 }),
        mpr90: basePDC + faker.number.float({ min: -3, max: 8 }),
        asOfDate: new Date()
      })
    }
  }
  await prisma.factAdherence.createMany({ data: adherenceFacts })

  // Create gaps
  console.log('Creating gaps...')
  const gaps = []
  for (let i = 0; i < 500; i++) {
    const member = createdMembers[Math.floor(Math.random() * createdMembers.length)]
    const detectedAt = faker.date.recent({ days: 60 })
    const isOpen = faker.datatype.boolean(0.3) // 30% open
    gaps.push({
      clientId: acmeClient.id,
      memberId: member.id,
      gapType: faker.helpers.arrayElement(['Adherence', 'Screening', 'Preventive']),
      detectedAt,
      closedAt: isOpen ? null : addDays(detectedAt, faker.number.int({ min: 1, max: 30 })),
      status: isOpen ? 'open' : 'closed',
      severity: faker.helpers.arrayElement(['Low', 'Medium', 'High'])
    })
  }
  await prisma.factGap.createMany({ data: gaps })

  // Create ops telemetry
  console.log('Creating ops telemetry...')
  const feedNames = ['claims_feed', 'member_roster', 'gaps_feed']
  const opsFacts = []
  for (let day = 0; day < 90; day++) {
    for (const feedName of feedNames) {
      const ingestedAt = subDays(new Date(), day)
      opsFacts.push({
        orgId: outcomesOrg.id,
        feedName,
        ingestedAt,
        expectedRows: feedName === 'claims_feed' ? 50000 : 5000,
        actualRows: Math.floor((feedName === 'claims_feed' ? 50000 : 5000) * faker.number.float({ min: 0.95, max: 1.02 })),
        latencyHours: faker.number.float({ min: 2, max: 30 }),
        status: faker.helpers.weightedArrayElement([
          { value: 'success', weight: 90 },
          { value: 'delayed', weight: 8 },
          { value: 'failure', weight: 2 }
        ])
      })
    }
  }
  await prisma.factOps.createMany({ data: opsFacts })

  // Create product telemetry
  console.log('Creating product telemetry...')
  const features = ['dashboard_view', 'export_csv', 'drill_down', 'cohort_filter', 'ai_chat']
  const telemetry = []
  for (let i = 0; i < 10000; i++) {
    telemetry.push({
      orgId: outcomesOrg.id,
      userId: faker.string.uuid(),
      feature: faker.helpers.arrayElement(features),
      action: faker.helpers.arrayElement(['view', 'click', 'export']),
      ts: faker.date.recent({ days: 30 }),
      durationMs: faker.number.int({ min: 100, max: 5000 })
    })
  }
  await prisma.factProductTelemetry.createMany({ data: telemetry })

  // Create notifications
  console.log('Creating notifications...')
  const notifications = [
    {
      clientId: acmeClient.id,
      ruleKey: 'adherence_risk_spike',
      entityRef: 'Diabetes cohort - Payer A',
      severity: 'High',
      owner: 'CLIENT_ADMIN',
      slaHours: 48,
      playbookUrl: '/playbooks/adherence-recovery',
      status: 'open',
      createdAt: subDays(new Date(), 2)
    },
    {
      clientId: null,
      ruleKey: 'feed_latency_breach',
      entityRef: 'claims_feed',
      severity: 'Critical',
      owner: 'INTERNAL_OPS',
      slaHours: 4,
      playbookUrl: '/playbooks/feed-delay-response',
      status: 'triaged',
      createdAt: subDays(new Date(), 1),
      acknowledgedAt: subDays(new Date(), 1)
    },
    {
      clientId: acmeClient.id,
      ruleKey: 'gap_closure_backlog',
      entityRef: 'Open gaps >30 days',
      severity: 'Medium',
      owner: 'CLIENT_ADMIN',
      slaHours: 120,
      playbookUrl: '/playbooks/gap-closure-acceleration',
      status: 'resolved',
      createdAt: subDays(new Date(), 10),
      acknowledgedAt: subDays(new Date(), 9),
      resolvedAt: subDays(new Date(), 5)
    }
  ]
  await prisma.factNotification.createMany({ data: notifications })

  console.log('✅ Seeding complete!')
  console.log(`Created:
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
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## Phase 4: API Routes (Estimated: 6-8 hours)

This would involve creating all API routes in `apps/web/app/api/`. Due to space constraints, I'll provide templates for the key routes.

### Example: Client KPIs Route

`apps/web/app/api/kpis/client/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { requireAuth, buildRLSFilter } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  clientId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

export async function GET(request: Request) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)

    const params = querySchema.parse({
      clientId: searchParams.get('clientId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate')
    })

    // Apply RLS
    const rlsFilter = buildRLSFilter(session)
    const clientId = rlsFilter.clientId || params.clientId
    if (!clientId) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 })
    }

    // Calculate adherence KPIs
    const adherenceStats = await prisma.factAdherence.groupBy({
      by: ['drugClass'],
      where: { clientId },
      _avg: { pdc90: true, mpr90: true }
    })

    // Calculate gap closure
    const gapStats = await prisma.factGap.aggregate({
      where: {
        clientId,
        status: 'closed',
        closedAt: { not: null }
      },
      _avg: {
        // Would need raw SQL for date diff
      }
    })

    const kpis = {
      adherence: adherenceStats.map(stat => ({
        drugClass: stat.drugClass,
        pdc90: stat._avg.pdc90,
        mpr90: stat._avg.mpr90,
        threshold: 80,
        status: (stat._avg.pdc90 || 0) >= 80 ? 'healthy' : 'at-risk'
      })),
      gapClosureCycleDays: 12, // Mock for now
      cmrCompletionRate: 65.3,
      abandonmentRate: 4.2
    }

    return NextResponse.json(kpis)
  } catch (error) {
    console.error('Client KPIs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## Phase 5: UI Components & Pages (Estimated: 12-16 hours)

This is the largest phase. You would create:

1. **Layout & Navigation** (`app/dashboard/layout.tsx`)
2. **7 Dashboard Pages** (client-analytics, exec-overview, etc.)
3. **Chart Components** (Recharts wrappers)
4. **KPI Components** (cards, ribbons, badges)
5. **Filter Components** (cohort builder, time selector)
6. **Insights Components** (alert inbox, cards)

### Example: Client Analytics Page Structure

`apps/web/app/dashboard/client-analytics/page.tsx`:

```typescript
import { KPIRibbon } from '@/components/kpis/kpi-ribbon'
import { AdherenceTrendChart } from '@/components/charts/adherence-trend-chart'
import { CohortBuilder } from '@/components/filters/cohort-builder'
import { TopOutliersTable } from '@/components/tables/top-outliers'

export default async function ClientAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Analytics</h1>
          <p className="text-muted-foreground">
            Monitor adherence, gaps, and outcomes — so what? Improve Star Ratings. Now what? Act on at-risk cohorts.
          </p>
        </div>
      </div>

      <KPIRibbon />

      <CohortBuilder />

      <div className="grid gap-6 md:grid-cols-2">
        <AdherenceTrendChart />
        <TopOutliersTable />
      </div>
    </div>
  )
}
```

---

## Phase 6: Rules Engine & Insights (Estimated: 4-6 hours)

Create `packages/lib/src/rules/engine.ts`:

```typescript
export type Rule = {
  key: string
  name: string
  condition: (data: any) => boolean
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  owner: string
  slaHours: number
  playbookUrl: string
}

export const rules: Rule[] = [
  {
    key: 'adherence_risk_spike',
    name: 'Adherence Risk Spike',
    condition: (data) => {
      return data.pdc90 < 75 && (data.pdc90Current - data.pdc90PriorWeek) <= -5
    },
    severity: 'High',
    owner: 'CLIENT_ADMIN',
    slaHours: 48,
    playbookUrl: '/playbooks/adherence-recovery'
  },
  {
    key: 'feed_latency_breach',
    name: 'Feed Latency Breach',
    condition: (data) => {
      return data.latencyHours > 24
    },
    severity: 'Critical',
    owner: 'INTERNAL_OPS',
    slaHours: 4,
    playbookUrl: '/playbooks/feed-delay-response'
  }
  // Add 3-5 more rules
]

export function evaluateRules(data: any): Notification[] {
  const notifications: Notification[] = []

  for (const rule of rules) {
    if (rule.condition(data)) {
      notifications.push({
        ruleKey: rule.key,
        severity: rule.severity,
        owner: rule.owner,
        slaHours: rule.slaHours,
        playbookUrl: rule.playbookUrl,
        status: 'open',
        createdAt: new Date()
      })
    }
  }

  return deduplicateNotifications(notifications)
}

function deduplicateNotifications(notifications: Notification[]): Notification[] {
  // Implement cooldown logic (48-hour window)
  return notifications // Simplified
}
```

---

## Phase 7: AI Chat Stub (Estimated: 4-6 hours)

Create `apps/web/app/api/ai/query/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/rbac'
import { parseIntent } from '@/lib/ai/intent-parser'
import { getMetricDefinition } from '@/lib/ai/grounding'
import { buildQueryFromIntent } from '@/lib/ai/query-builder'
import { applyGuardrails } from '@/lib/ai/guardrails'

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const { query } = await request.json()

    // 1. Parse intent
    const intent = parseIntent(query)

    // 2. Apply guardrails
    const guardrailCheck = applyGuardrails(intent, session)
    if (!guardrailCheck.allowed) {
      return NextResponse.json({
        response: guardrailCheck.message,
        confidence: 'high',
        citations: [],
        nextQuestions: []
      })
    }

    // 3. Build SQL query
    const sql = buildQueryFromIntent(intent, session)

    // 4. Execute (with RLS filters)
    const result = await prisma.$queryRawUnsafe(sql)

    // 5. Format response
    const metricDef = getMetricDefinition(intent.metricKey)

    return NextResponse.json({
      response: formatNaturalLanguageResponse(intent, result, metricDef),
      confidence: 'high',
      citations: [metricDef],
      sql: sql.slice(0, 500), // Preview first 500 chars
      nextQuestions: generateNextQuestions(intent)
    })
  } catch (error) {
    return NextResponse.json({
      response: "I encountered an error processing your question. Please try rephrasing.",
      confidence: 'low',
      citations: [],
      nextQuestions: []
    })
  }
}
```

---

## Quick Start Script

Create `apps/web/package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "test:e2e": "playwright test"
  }
}
```

---

## 2-Minute Demo Script

See `docs/DEMO.md` for full script. Quick outline:

```
[0:00-0:30] Login as analyst@acme.com
            Show Client Analytics dashboard
            Point out: "PDC_90 ribbon — 78.4% Diabetes (below 80% threshold)"

[0:30-1:00] Drill into Diabetes cohort
            Show trend chart (5pp drop WoW)
            Export member list
            "Now what? Send these 450 members refill reminders."

[1:00-1:20] Switch to Exec Overview
            Show Star proxy trend (down 0.1)
            "What changed" digest

[1:20-1:40] Switch to Insights & Alerts
            Show open alert: "Adherence Risk Spike"
            Click playbook link
            Acknowledge alert

[1:40-2:00] AI Chat
            Type: "What was diabetes adherence last month?"
            Show response with metric definition citation
            Show SQL preview
```

---

## Deployment to Vercel

1. Push repo to GitHub
2. Connect to Vercel
3. Add environment variables (NEXTAUTH_SECRET, DATABASE_URL with Turso/PlanetScale)
4. Deploy

---

## Estimated Total Implementation Time

- **Foundation (Phase 1-3):** 10-14 hours
- **API Routes (Phase 4):** 6-8 hours
- **UI Components & Pages (Phase 5):** 12-16 hours
- **Rules Engine (Phase 6):** 4-6 hours
- **AI Chat (Phase 7):** 4-6 hours
- **Testing & Polish:** 6-8 hours

**Total:** 42-58 hours for full implementation

---

## Next Steps

1. Start with Phase 1 (Foundation)
2. Get database seeded and running
3. Build one complete dashboard (Client Analytics) end-to-end
4. Replicate pattern for other 6 dashboards
5. Add polish, testing, documentation

This blueprint provides the complete architecture. Start building incrementally!
