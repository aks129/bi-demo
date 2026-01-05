# MTM Analytics Platform - Phased MVP Execution Plan

## Executive Summary

This document outlines a phased execution plan to evolve the existing ACME Pharmacy Analytics MVP into a full Next-Generation MTM Analytics Platform as specified in the architectural blueprint. The plan bridges the gap between current implementation and the comprehensive vision for 2025 CMS compliance, real-time intelligence, and AI-augmented workflows.

---

## Current State Assessment

### What's Already Built

| Component | Status | Notes |
|-----------|--------|-------|
| Next.js 15 App Router | ✅ Complete | Using React 19, TypeScript |
| Prisma ORM + SQLite | ✅ Complete | 5 tables, 100 members seeded |
| 6 Dashboards | ✅ Complete | Client, Executive, Adherence, Members, Insights, Embedded |
| Recharts Integration | ✅ Complete | Bar, Line, Area charts |
| Sigma Computing API | ✅ Complete | JWT-signed embed URLs |
| Component Library | ✅ Complete | 11 dashboard + 3 chart components |
| Tailwind CSS | ✅ Complete | Full responsive design |
| Vercel Deployment | ✅ Complete | Production-ready |

### Gaps to Address (From Blueprint)

| Requirement | Current State | Action Needed |
|-------------|---------------|---------------|
| MTM Data Schema | Basic adherence model | Expand to Member/Activity/Claims classes |
| 2025 CMS Eligibility Rules | Not implemented | Add eligibility engine ($1,623 threshold, 10 chronic diseases) |
| AIM ROI Engine | Not implemented | Add cost avoidance calculations (Levels 1-7) |
| HEDIS IET Logic | Not implemented | Add 14/34-day window tracking for SUD treatment |
| Waterfall Chart | Not implemented | Add financial ROI visualization |
| Drizzle ORM | Using Prisma | Option to migrate or stay with Prisma |
| Tremor Components | Using Recharts | Option to add or stay with Recharts |
| Vercel AI SDK | Not implemented | Add RAG + Tool Calling for "Chat with Data" |
| PostgreSQL + pgvector | Using SQLite | Migrate for production + vector embeddings |
| Authentication | Configured, not active | Complete NextAuth implementation |
| Real-time Processing | Static data | Add event-driven updates |

---

## Phase 1: Data Architecture Enhancement

**Objective:** Align database schema with OutcomesMTM Member/Activity/Performance data classes

### 1.1 Schema Updates

**New/Modified Tables:**

```prisma
// Member Data Class (Enhanced)
model Patient {
  id                  String   @id @default(cuid())
  patientId           String   @unique  // External MTM ID
  policyId            String?
  cmsContractNumber   String?           // H-number (H1234)
  firstName           String
  lastName            String
  dob                 DateTime
  gender              String?
  zipCode             String?
  primaryPharmacyId   String?           // NCPDP ID
  priorityScore       Int      @default(0) // 0-100, computed
  patientUrl          String?           // Deep link to profile
  optOut              Boolean  @default(false)

  // 2025 CMS Eligibility Fields
  drugCostsYTD        Decimal  @default(0)
  chronicDiseases     String[] // Array of ICD-10 codes
  activePartDMeds     Int      @default(0)
  mtmEligible         Boolean  @default(false)

  // Relationships
  clientId            String
  client              DimClient @relation(fields: [clientId], references: [id])
  claims              Claim[]
  adherenceRecords    FactAdherence[]

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([clientId])
  @@index([cmsContractNumber])
  @@index([mtmEligible])
}

// Activity Data Class (Claims/Opportunities)
model Claim {
  id                String   @id @default(cuid())
  claimId           String   @unique  // External Service ID
  patientId         String
  patient           Patient  @relation(fields: [patientId], references: [id])

  // Service Details
  serviceDate       DateTime
  serviceCode       Int               // CPT code (99605, 99606, etc.)
  opportunityType   String            // CMR, TIP

  // Outcomes Logic
  resultCode        Int               // 300=Success, 301=No DTP, 379=UTR, 380=Refused
  severityLevel     Int      @default(1) // AIM 1-7
  aimDollarValue    Decimal  @default(0) // Projected cost avoidance

  // Workflow
  status            String   @default("Pending") // Pending, Approved, Review
  adherenceBarrier  Json?    // SDoH/behavioral barriers

  // HEDIS IET Fields
  indexDate         DateTime? // SUD episode start
  initiationMet     Boolean  @default(false)
  engagementMet     Boolean  @default(false)
  ietWindowExpires  DateTime?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([patientId])
  @@index([serviceDate])
  @@index([resultCode])
  @@index([status])
}

// Reference Data: Chronic Disease Codes
model ChronicDisease {
  id          String @id @default(cuid())
  code        String @unique
  name        String
  category    String // Core 10 for 2025 CMS
  icdCodes    String[] // Associated ICD-10 codes
}
```

### 1.2 Seed Data Enhancement

Create realistic MTM-focused seed data:
- 500 members (up from 100)
- Distribution across all 10 core chronic diseases
- Claims with realistic result codes (300, 301, 379, 380)
- AIM severity levels and dollar values
- Some members with open HEDIS IET windows

### 1.3 Deliverables

- [ ] Updated Prisma schema with full MTM data classes
- [ ] Migration scripts for existing data
- [ ] Zod validation schemas for data ingestion
- [ ] Enhanced seed script with 500+ members
- [ ] Type definitions matching OutcomesMTM specs

---

## Phase 2: Logic Engine Implementation

**Objective:** Build the three core algorithmic engines for metrics, ROI, and compliance

### 2.1 MTM Metrics Engine

**File:** `lib/engines/metricsEngine.ts`

```typescript
interface ContractMetrics {
  attemptRate: number;      // (300+301+380+379) / Total
  completionRate: number;   // (300+301) / Total
  refusalRate: number;      // 380 / Total
  unreachableRate: number;  // 379 / Total
}

// Result Code Reference:
// 300 = DTP Identified (Success)
// 301 = No DTP Identified (Success)
// 379 = Unable to Reach
// 380 = Patient Refused

function calculateContractMetrics(claims: Claim[]): ContractMetrics
function calculateByContract(claims: Claim[], contractId: string): ContractMetrics
function calculateTrend(claims: Claim[], periodDays: number): MetricsTrend[]
```

### 2.2 AIM ROI Engine (Cost Avoidance)

**File:** `lib/engines/aimEngine.ts`

```typescript
// Severity Level to Dollar Mapping (configurable)
const AIM_VALUES = {
  1: 50,     // Adherence support
  2: 150,    // Minor intervention
  3: 500,    // Prevented physician visit
  4: 1500,   // Moderate intervention
  5: 5000,   // Prevented ER visit
  6: 15000,  // Prevented hospitalization
  7: 30000,  // Life-threatening prevention
};

interface AIMSummary {
  grossCostAvoidance: number;
  operationalCosts: number;
  netBenefit: number;
  roiMultiple: number;
  bySeverity: { level: number; count: number; value: number }[];
}

function calculateAIMROI(claims: Claim[]): AIMSummary
function generateWaterfallData(summary: AIMSummary): WaterfallDataPoint[]
```

### 2.3 HEDIS IET Engine (SUD Treatment Tracking)

**File:** `lib/engines/ietEngine.ts`

```typescript
interface IETStatus {
  memberId: string;
  indexDate: Date;
  initiationDeadline: Date;   // Index + 14 days
  engagementDeadline: Date;   // Index + 34 days
  daysRemainingInitiation: number;
  daysRemainingEngagement: number;
  initiationMet: boolean;
  engagementMet: boolean;
  urgencyLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  qualifyingServices: Service[];
}

function checkIETWindows(memberId: string): IETStatus
function getOpenIETCases(): IETStatus[]
function updateIETStatus(claimId: string): void
```

### 2.4 2025 CMS Eligibility Engine

**File:** `lib/engines/eligibilityEngine.ts`

```typescript
// 2025 CMS MTM Criteria
const ELIGIBILITY_2025 = {
  COST_THRESHOLD: 1623,        // $1,623 (reduced from $5,000+)
  MIN_CHRONIC_DISEASES: 3,     // Any 3 of 10 core conditions
  MIN_PART_D_MEDS: 8,
  CORE_DISEASES: [
    'ALZHEIMERS',
    'BONE_ARTHRITIS',
    'CHF',
    'DIABETES',
    'DYSLIPIDEMIA',
    'ESRD',
    'HIV_AIDS',        // NEW for 2025
    'HYPERTENSION',
    'MENTAL_HEALTH',
    'RESPIRATORY'
  ]
};

interface EligibilityResult {
  memberId: string;
  eligible: boolean;
  meetsCosCriterion: boolean;
  meetsDiseaseCriterion: boolean;
  meetsMedCountCriterion: boolean;
  chronicDiseaseCount: number;
  projectedEligibilityDate?: Date;
  nearEligibility: boolean;  // 2 diseases or 7 meds
}

function checkEligibility(member: Patient): EligibilityResult
function getNewlyEligible(): Patient[]
function getNearEligible(): Patient[]  // Cusp members
```

### 2.5 Deliverables

- [ ] MetricsEngine with attempt/completion/refusal rates
- [ ] AIMEngine with cost avoidance calculations
- [ ] IETEngine with temporal window tracking
- [ ] EligibilityEngine with 2025 CMS rules
- [ ] Unit tests for all engines
- [ ] Priority score calculator (event-driven updates)

---

## Phase 3: Dashboard Enhancement

**Objective:** Add new visualizations and upgrade existing dashboards

### 3.1 Financial Waterfall Chart (ROI)

**File:** `components/charts/WaterfallChart.tsx`

Using Recharts with stacked bars and transparent fills:
- Shows: Gross Cost Avoidance → Operational Costs → Net Benefit
- Color coding: Green (savings), Red (costs), Blue (net)
- Tooltip with breakdown details

### 3.2 New Dashboards

| Dashboard | Purpose | Key Visualizations |
|-----------|---------|-------------------|
| `/dashboard/mtm` | MTM Program Performance | Completion rates, attempt rates, CMR vs TIP split |
| `/dashboard/roi` | Financial ROI | Waterfall chart, AIM breakdown, trend lines |
| `/dashboard/eligibility` | 2025 Eligibility | Population funnel, near-eligible alerts, projections |
| `/dashboard/iet` | HEDIS IET Tracking | Open windows, countdown timers, intervention queue |
| `/dashboard/work-queue` | Pharmacist Work Queue | Priority-sorted member list, quick actions |

### 3.3 Enhanced Existing Dashboards

**Executive Overview Additions:**
- MTM completion rate trend
- Net benefit waterfall mini-chart
- CMS eligibility population growth projection

**Insights & Alerts Additions:**
- IET window expiration alerts (urgent)
- Near-eligibility notifications
- Priority score recalculation triggers

### 3.4 Deliverables

- [ ] WaterfallChart component
- [ ] MTM Performance dashboard
- [ ] Financial ROI dashboard
- [ ] 2025 Eligibility dashboard
- [ ] HEDIS IET dashboard
- [ ] Pharmacist Work Queue
- [ ] Updated Executive Overview
- [ ] Updated Insights page with IET alerts

---

## Phase 4: AI Integration (Vercel AI SDK)

**Objective:** Implement "Chat with Data" with RAG and Tool Calling

### 4.1 Dependencies

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic zod
```

### 4.2 Tool Definitions

**File:** `lib/ai/tools.ts`

```typescript
const tools = {
  getMemberProfile: tool({
    description: 'Get clinical profile for a specific member',
    parameters: z.object({
      memberId: z.string().describe('Member ID or name')
    }),
    execute: async ({ memberId }) => {
      // Fetch from database
      return { name, age, openGaps, needsCMR, adherenceStatus };
    }
  }),

  getContractMetrics: tool({
    description: 'Get MTM metrics for a contract',
    parameters: z.object({
      contractId: z.string(),
      metric: z.enum(['completion', 'attempt', 'refusal', 'roi'])
    }),
    execute: async ({ contractId, metric }) => {
      // Calculate and return
    }
  }),

  getOpenIETCases: tool({
    description: 'List members with open SUD treatment windows',
    parameters: z.object({
      urgency: z.enum(['all', 'critical', 'high']).optional()
    }),
    execute: async ({ urgency }) => {
      // Query IET engine
    }
  }),

  getEligibilityProjection: tool({
    description: 'Project MTM eligibility population',
    parameters: z.object({
      contractId: z.string(),
      months: z.number().min(1).max(12)
    }),
    execute: async ({ contractId, months }) => {
      // Calculate projection
    }
  })
};
```

### 4.3 Chat API Route

**File:** `app/api/chat/route.ts`

```typescript
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const systemPrompt = `You are a Clinical Data Assistant for MTM Analytics.
You help pharmacists identify care gaps, track HEDIS measures, and optimize interventions.
Use the provided tools to fetch real data. Never make up information.
When discussing members, always include their priority score and urgent deadlines.
Format currency as USD. Format percentages to 1 decimal place.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages,
    tools,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
```

### 4.4 Chat UI Component

**File:** `components/ai/ClinicalAssistant.tsx`

- Floating chat button on all dashboard pages
- Expandable panel with message history
- Streaming response display
- Tool call visualization (show data being fetched)
- Example prompts for common queries

### 4.5 Deliverables

- [ ] AI tools for member lookup, metrics, IET, eligibility
- [ ] Chat API route with streaming
- [ ] Clinical Assistant UI component
- [ ] Integration on all dashboard pages
- [ ] Example prompt library
- [ ] Tool call result formatting

---

## Phase 5: Authentication & Authorization

**Objective:** Complete NextAuth setup with role-based access

### 5.1 Auth Configuration

**File:** `app/api/auth/[...nextauth]/route.ts`

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // Verify against database
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.clientId = user.clientId;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.role = token.role;
      session.user.clientId = token.clientId;
      return session;
    }
  }
};
```

### 5.2 Role-Based Access

| Role | Access |
|------|--------|
| CLIENT_VIEWER | View dashboards for assigned client only |
| CLIENT_ADMIN | Edit settings, manage users for client |
| EXEC | View all clients, executive dashboards |
| SUPER_ADMIN | Full platform access |

### 5.3 Middleware Protection

**File:** `middleware.ts`

```typescript
export function middleware(request: NextRequest) {
  // Protect /dashboard/* routes
  // Verify session token
  // Check role permissions
  // Filter data by clientId
}
```

### 5.4 Deliverables

- [ ] NextAuth route handlers
- [ ] Login/logout pages
- [ ] Session management
- [ ] Role-based middleware
- [ ] Client data filtering
- [ ] User settings page

---

## Phase 6: Production Infrastructure

**Objective:** Migrate to production-grade infrastructure

### 6.1 Database Migration

**Option A: PostgreSQL + Neon (Recommended)**
- Serverless, auto-scaling
- pgvector extension for AI embeddings
- Branching for staging environments

**Option B: PostgreSQL + Supabase**
- Built-in auth (optional)
- Real-time subscriptions
- Edge functions

### 6.2 Vector Embeddings (for RAG)

```prisma
model Embedding {
  id        String   @id @default(cuid())
  content   String   // Original text
  embedding Float[]  @db.Vector(1536) // OpenAI embedding dimension
  metadata  Json
  type      String   // 'schema', 'rulebook', 'metric_summary'

  @@index([embedding], type: Hnsw(operators: VectorCosineOps))
}
```

### 6.3 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.com

# AI
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...  # For embeddings

# Analytics
SIGMA_CLIENT_ID=...
SIGMA_CLIENT_SECRET=...
```

### 6.4 Deliverables

- [ ] PostgreSQL migration
- [ ] pgvector setup for embeddings
- [ ] Environment configuration
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring (Vercel Analytics, Sentry)
- [ ] Staging environment

---

## Phase 7: Advanced Features

**Objective:** Implement remaining blueprint features

### 7.1 Rules Engine

**File:** `lib/engines/rulesEngine.ts`

```typescript
interface Rule {
  id: string;
  name: string;
  trigger: 'schedule' | 'event' | 'threshold';
  condition: (context: RuleContext) => boolean;
  action: (context: RuleContext) => void;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  slaHours: number;
}

// Example rules:
// - IET window expiring in <3 days → Critical alert
// - Member adherence dropped below 75% → High alert
// - New member became MTM eligible → Medium notification
// - Contract completion rate below target → Executive alert
```

### 7.2 Real-time Updates

Using Vercel's Edge Runtime + WebSockets or Server-Sent Events:
- Priority score recalculation on claim updates
- Dashboard auto-refresh when new alerts fire
- Work queue reordering

### 7.3 CSV/Excel Export

- Bulk member list export
- Compliance reports for CMS submission
- ROI summary for finance

### 7.4 Deliverables

- [ ] Configurable rules engine
- [ ] Real-time dashboard updates
- [ ] Export functionality
- [ ] Audit logging
- [ ] Performance optimization

---

## Implementation Timeline

| Phase | Scope | Dependencies |
|-------|-------|--------------|
| **Phase 1** | Data Architecture | None |
| **Phase 2** | Logic Engines | Phase 1 |
| **Phase 3** | Dashboard Enhancement | Phases 1, 2 |
| **Phase 4** | AI Integration | Phases 1, 2 |
| **Phase 5** | Authentication | None (parallel) |
| **Phase 6** | Production Infrastructure | All phases |
| **Phase 7** | Advanced Features | Phases 1-6 |

---

## Success Criteria

### Phase 1 Complete When:
- [ ] Schema supports full MTM Member/Activity/Claims classes
- [ ] 500+ member seed data with realistic MTM scenarios
- [ ] All Zod validators passing

### Phase 2 Complete When:
- [ ] Metrics engine calculates correct rates per Outcomes spec
- [ ] AIM engine produces accurate cost avoidance numbers
- [ ] IET engine tracks windows with correct 14/34 day logic
- [ ] Eligibility engine implements 2025 CMS rules

### Phase 3 Complete When:
- [ ] Waterfall chart displays correctly
- [ ] All 5 new dashboards functional
- [ ] Executive dashboard shows MTM + ROI data

### Phase 4 Complete When:
- [ ] Chat assistant answers member questions
- [ ] Tools return accurate database data
- [ ] Streaming UI works smoothly

### Phase 5 Complete When:
- [ ] Users can log in with credentials
- [ ] Role-based access enforced
- [ ] Data filtered by client

### Phase 6 Complete When:
- [ ] PostgreSQL migration complete
- [ ] Vector embeddings working
- [ ] Staging environment live

### Phase 7 Complete When:
- [ ] Rules engine firing alerts
- [ ] Real-time updates working
- [ ] Exports functional

---

## Appendix A: File Structure After All Phases

```
acme-pharmacy-analytics/
├── apps/web/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── chat/route.ts
│   │   │   ├── sigma/embed/route.ts
│   │   │   └── webhooks/
│   │   ├── dashboard/
│   │   │   ├── page.tsx (Client Analytics)
│   │   │   ├── executive/page.tsx
│   │   │   ├── adherence/page.tsx
│   │   │   ├── members/page.tsx
│   │   │   ├── insights/page.tsx
│   │   │   ├── embedded/page.tsx
│   │   │   ├── mtm/page.tsx          # NEW
│   │   │   ├── roi/page.tsx          # NEW
│   │   │   ├── eligibility/page.tsx  # NEW
│   │   │   ├── iet/page.tsx          # NEW
│   │   │   └── work-queue/page.tsx   # NEW
│   │   ├── login/page.tsx            # NEW
│   │   └── page.tsx (Landing)
│   ├── components/
│   │   ├── ai/
│   │   │   └── ClinicalAssistant.tsx # NEW
│   │   ├── charts/
│   │   │   ├── AreaChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   └── WaterfallChart.tsx    # NEW
│   │   └── dashboard/
│   │       ├── DashboardCard.tsx
│   │       ├── DashboardLayout.tsx
│   │       ├── KPICard.tsx
│   │       ├── Sidebar.tsx
│   │       └── SigmaEmbed.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── tools.ts              # NEW
│   │   │   └── embeddings.ts         # NEW
│   │   ├── engines/
│   │   │   ├── metricsEngine.ts      # NEW
│   │   │   ├── aimEngine.ts          # NEW
│   │   │   ├── ietEngine.ts          # NEW
│   │   │   ├── eligibilityEngine.ts  # NEW
│   │   │   └── rulesEngine.ts        # NEW
│   │   ├── prisma.ts
│   │   ├── sigma.ts
│   │   └── utils.ts
│   └── prisma/
│       ├── schema.prisma (enhanced)
│       └── seed.ts (enhanced)
└── package.json
```

---

## Appendix B: Key Formulas Reference

### MTM Metrics (Outcomes Spec)

```
Attempt Rate = (Count(300) + Count(301) + Count(380) + Count(379)) / Total Opportunities

Completion Rate = (Count(300) + Count(301)) / Total Opportunities

Refusal Rate = Count(380) / Total Opportunities

CMR Completion Rate = Completed CMRs / Eligible CMR Opportunities
```

### AIM Cost Avoidance

```
Gross Cost Avoidance = SUM(aimDollarValue) WHERE status = 'Approved'

Operational Costs = Count(interventions) × Average_Fee_Per_Intervention

Net Benefit = Gross Cost Avoidance - Operational Costs

ROI Multiple = Gross Cost Avoidance / Operational Costs
```

### 2025 CMS Eligibility

```
Eligible IF:
  (Drug_Costs_YTD + Projected_Costs >= $1,623)
  AND (Count(Core_Chronic_Diseases) >= 3)
  AND (Count(Active_Part_D_Meds) >= 8)

Core Diseases (2025): Alzheimer's, Bone/Arthritis, CHF, Diabetes,
  Dyslipidemia, ESRD, HIV/AIDS*, Hypertension, Mental Health, Respiratory

*HIV/AIDS added for 2025
```

### HEDIS IET Windows

```
Initiation Success IF:
  Qualifying_Service_Date <= (Index_Date + 14 days)

Engagement Success IF:
  Initiation_Met = TRUE
  AND Count(Qualifying_Services) >= 2
  AND All_Services_Date <= (Index_Date + 34 days)
```

---

## Appendix C: Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ORM | Prisma (keep) | Already implemented, excellent TypeScript support |
| Charts | Recharts (keep) | Working well, add Tremor later if needed |
| Database | PostgreSQL + Neon | Serverless, pgvector support |
| AI Provider | Anthropic Claude | Superior reasoning for clinical data |
| Embeddings | OpenAI | Industry standard, 1536 dimensions |
| Auth | NextAuth | Already configured, flexible providers |
| Hosting | Vercel | Already deployed, excellent DX |

---

*This plan was generated based on the "Architectural Blueprint and Implementation Strategy for Next-Generation MTM Analytics Platforms" document and analysis of the existing bi-demo codebase.*
