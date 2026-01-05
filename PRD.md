# Product Requirements Document (PRD)

## ACME Pharmacy Analytics Platform

**Version:** 1.0 MVP
**Date:** January 2026
**Status:** Implemented

---

## Executive Summary

ACME Pharmacy Analytics is an enterprise-grade analytics platform for Medication Therapy Management (MTM) programs. The platform enables healthcare organizations to track medication adherence, optimize MTM interventions, demonstrate ROI, and improve Star Ratings performance.

### Business Objectives

1. **Improve Star Ratings** - Help clients achieve 4+ star ratings through adherence optimization
2. **Demonstrate ROI** - Quantify cost avoidance and program value
3. **Optimize Operations** - Streamline pharmacist workflows and prioritize interventions
4. **Enable Self-Service** - Empower users to create custom reports and analyses
5. **Build Community** - Foster knowledge sharing across the MTM professional community

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Star Rating Impact | ≥80% PDC | Adherence monitoring |
| ROI Demonstration | 3.0x+ | AIM cost avoidance |
| User Adoption | 80% DAU | Platform analytics |
| Report Creation | 5+ per user/month | Report builder usage |
| Community Engagement | 50% participation | Posts, comments, votes |

---

## User Personas

### Primary Users

#### 1. Clinical Pharmacist
- **Role:** Direct patient care, CMR completion
- **Goals:** Prioritize high-impact interventions, document outcomes
- **Key Features:** Work Queue, Member Analytics, AI Chat

#### 2. MTM Program Manager
- **Role:** Oversee program operations, track KPIs
- **Goals:** Monitor performance, identify improvement opportunities
- **Key Features:** MTM Performance, Executive Overview, Report Builder

#### 3. Quality Coordinator
- **Role:** Star Ratings compliance, quality improvement
- **Goals:** Ensure adherence thresholds, track trends
- **Key Features:** Adherence Deep Dive, Benchmarking, Insights

#### 4. Finance Analyst
- **Role:** ROI reporting, budget planning
- **Goals:** Demonstrate program value, forecast savings
- **Key Features:** Financial ROI, Report Builder, Case Studies

#### 5. Executive Leadership
- **Role:** Strategic decisions, stakeholder reporting
- **Goals:** High-level performance view, trend analysis
- **Key Features:** Executive Overview, Benchmarking

---

## Feature Requirements

### 1. Core Analytics Dashboards

#### 1.1 Executive Overview
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
High-level dashboard showing overall program performance with trend analysis.

**Requirements:**
- [ ] Display 4 primary KPIs (Completion Rate, Adherence, ROI, Star Rating)
- [ ] Show month-over-month trend charts
- [ ] Include benchmark comparisons
- [ ] Highlight alerts and action items
- [ ] Support contract filtering

**Acceptance Criteria:**
- Page loads in <2 seconds
- KPIs update based on selected filters
- Trend data shows 12-month history

#### 1.2 Client Analytics (Adherence Dashboard)
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
Detailed adherence metrics by drug class with impact-first messaging.

**Requirements:**
- [ ] PDC metrics for Diabetes, Hypertension, Cholesterol, COPD
- [ ] At-risk and critical member counts
- [ ] Star Rating threshold visualization
- [ ] "So what? Now what?" messaging
- [ ] Drug class comparison charts

**Acceptance Criteria:**
- Adherence calculated using PDC_90 formula
- Color coding: Green (≥80%), Yellow (75-79%), Red (<75%)
- Drill-down to member list available

#### 1.3 MTM Performance
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
CMR and TIP completion tracking with conversion funnel.

**Requirements:**
- [ ] Completion rate, attempt rate, refusal rate
- [ ] CMR vs TIP breakdown
- [ ] Pharmacist productivity metrics
- [ ] Result code distribution
- [ ] Trend analysis

**Acceptance Criteria:**
- Metrics match CMS MTM definitions
- Industry benchmarks displayed
- Time period filtering (MTD, QTD, YTD)

#### 1.4 Financial ROI
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
Cost avoidance analysis using AIM (Actuarial Impact Model).

**Requirements:**
- [ ] Total cost avoidance calculation
- [ ] AIM severity distribution (Levels 1-7)
- [ ] Waterfall chart visualization
- [ ] ROI multiple calculation
- [ ] Year-over-year comparison

**Acceptance Criteria:**
- AIM values align with severity level definitions
- ROI = (Cost Avoidance - Program Cost) / Program Cost
- Export to PDF/Excel available

#### 1.5 2025 Eligibility
**Priority:** P1 (Should Have)
**Status:** ✅ Implemented

**Description:**
CMS eligibility rule compliance for 2025 changes.

**Requirements:**
- [ ] New threshold analysis ($1,623)
- [ ] HIV/AIDS condition tracking
- [ ] Eligibility funnel visualization
- [ ] Projection modeling
- [ ] Chronic disease distribution

**Acceptance Criteria:**
- 2025 CMS rules accurately reflected
- Comparison to 2024 rules available
- Member-level eligibility drill-down

#### 1.6 Work Queue
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
Pharmacist workflow tool with priority-sorted interventions.

**Requirements:**
- [ ] Priority scoring algorithm
- [ ] Sortable/filterable member list
- [ ] Quick actions (call, skip, complete)
- [ ] Due date and SLA tracking
- [ ] Pharmacist assignment

**Acceptance Criteria:**
- Priority based on: severity, days until deadline, potential AIM
- Real-time updates as actions taken
- Search by member name/ID

#### 1.7 Insights & Alerts
**Priority:** P1 (Should Have)
**Status:** ✅ Implemented

**Description:**
Rules engine notifications with actionable playbooks.

**Requirements:**
- [ ] Alert severity levels (Critical, High, Medium, Low)
- [ ] Alert categories (Adherence, Operational, Quality)
- [ ] Playbook links with step-by-step actions
- [ ] Owner assignment
- [ ] SLA tracking

**Acceptance Criteria:**
- Alerts generated by configurable rules
- Playbooks include specific action steps
- Alert acknowledgment workflow

---

### 2. Enterprise Platform Features

#### 2.1 Analytics Community
**Priority:** P1 (Should Have)
**Status:** ✅ Implemented

**Description:**
Cross-client forum for MTM professionals to share knowledge.

**Requirements:**
- [ ] Post creation with categories (Question, Discussion, Best Practice, Announcement)
- [ ] Tagging system
- [ ] Upvote/downvote functionality
- [ ] Nested comments
- [ ] Search and filtering
- [ ] Pinned posts for announcements

**Acceptance Criteria:**
- Posts visible across all clients (global community)
- Author roles displayed (Pharmacist, Manager, Admin)
- Markdown support for content

#### 2.2 Wiki & Data Dictionary
**Priority:** P1 (Should Have)
**Status:** ✅ Implemented

**Description:**
Central knowledge base with searchable metric definitions.

**Requirements:**
- [ ] Wiki pages with markdown content
- [ ] Hierarchical page structure
- [ ] Data dictionary with term definitions
- [ ] Formula documentation
- [ ] Data source references
- [ ] Related terms linking
- [ ] Full-text search

**Acceptance Criteria:**
- 6+ core terms documented (PDC, CMR, DTP, etc.)
- Formulas displayed in code blocks
- Search returns relevant results in <500ms

#### 2.3 Case Studies
**Priority:** P2 (Nice to Have)
**Status:** ✅ Implemented

**Description:**
Success stories library showcasing ROI and best practices.

**Requirements:**
- [ ] Case study template (Challenge, Solution, Outcomes)
- [ ] Before/after metrics visualization
- [ ] Industry filtering (Medicare, Medicaid, Commercial)
- [ ] Featured case studies
- [ ] PDF export

**Acceptance Criteria:**
- 3+ case studies with real outcomes
- Outcomes include measurable metrics
- Filterable by industry and tags

#### 2.4 Benchmarking
**Priority:** P1 (Should Have)
**Status:** ✅ Implemented

**Description:**
National comparison with anonymized peer data.

**Requirements:**
- [ ] Percentile ranking (0-100)
- [ ] Client vs national average comparison
- [ ] Top decile and bottom decile benchmarks
- [ ] Trend comparison over time
- [ ] CMS Star Rating thresholds

**Acceptance Criteria:**
- Benchmarks from anonymized internal client data
- 6+ key metrics benchmarked
- Percentile gauges with visual indicators

#### 2.5 Report Builder
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
Self-service drag-and-drop report creation tool.

**Requirements:**
- [ ] Metric selection (15+ available)
- [ ] Filter configuration (date, contract, drug class, status)
- [ ] Group by options (time, contract, drug class, region)
- [ ] Visualization types (bar, line, area, table, KPI cards)
- [ ] Live preview
- [ ] Save and share reports
- [ ] Export functionality

**Acceptance Criteria:**
- Reports generate in <3 seconds
- Saved reports persist and load correctly
- Public/private sharing options

#### 2.6 Activity Feed
**Priority:** P2 (Nice to Have)
**Status:** ✅ Implemented

**Description:**
Real-time activity stream with platform updates.

**Requirements:**
- [ ] Activity types (completed, created, posted, updated, alert)
- [ ] Time-based grouping (Today, Yesterday, This Week)
- [ ] Auto-refresh (30-second polling)
- [ ] Activity filtering
- [ ] Click-through to source entity

**Acceptance Criteria:**
- Feed updates without page refresh
- Activities link to related pages
- Performance impact <5% CPU

---

### 3. Security & Authentication

#### 3.1 Password Protection
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
Demo environment access control.

**Requirements:**
- [ ] Login page with password entry
- [ ] Secure cookie-based sessions
- [ ] Session persistence (7 days)
- [ ] Logout functionality
- [ ] Configurable password via environment variable

**Acceptance Criteria:**
- Default password: `GeneDemo`
- Unauthenticated users redirected to login
- Session survives browser close

---

### 4. AI Integration

#### 4.1 Chat Assistant
**Priority:** P1 (Should Have)
**Status:** ✅ Implemented

**Description:**
Claude-powered analytics assistant for natural language queries.

**Requirements:**
- [ ] Floating chat widget
- [ ] Dashboard context awareness
- [ ] Pre-configured suggested questions
- [ ] Conversation history
- [ ] Clear chat functionality

**Acceptance Criteria:**
- Responses in <5 seconds
- Understands MTM terminology
- Provides actionable insights

---

## Technical Requirements

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  Next.js 15 (App Router) + React + TypeScript + Tailwind    │
├─────────────────────────────────────────────────────────────┤
│                      Middleware                              │
│            Authentication + Route Protection                 │
├─────────────────────────────────────────────────────────────┤
│                      API Layer                               │
│          Next.js API Routes + Server Components              │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                              │
│              Prisma ORM + SQLite/PostgreSQL                  │
├─────────────────────────────────────────────────────────────┤
│                    External Services                         │
│          Claude API (AI) + Sigma Computing (Embed)           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 15 | Full-stack React framework |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Charts | Recharts | Data visualization |
| Database | Prisma + SQLite | ORM and local database |
| AI | Claude API | Chat assistant |
| Icons | Lucide React | UI icons |
| Dates | date-fns | Date formatting |

### Performance Requirements

| Metric | Target |
|--------|--------|
| Page Load (LCP) | <2.5s |
| Time to Interactive | <3.5s |
| API Response | <500ms |
| Database Query | <100ms |
| Build Time | <60s |
| Bundle Size | <500KB |

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Data Model

### Core Entities

#### Member
```prisma
model DimMember {
  id              String   @id
  name            String
  age             Int
  zipCode         String
  drugCostsYTD    Float
  chronicDiseases String[]
  mtmEligible     Boolean
  optOutStatus    Boolean
}
```

#### Adherence
```prisma
model FactAdherence {
  id         String   @id
  memberId   String
  drugClass  String
  pdc90      Float
  pdc180     Float
  fillCount  Int
  gapDays    Int
  measureDate DateTime
}
```

#### Claim (MTM Activity)
```prisma
model Claim {
  id              String   @id
  memberId        String
  opportunityType String   // CMR, TIP
  resultCode      Int      // 300, 301, 379, 380
  severityLevel   Int      // 1-7
  aimDollarValue  Float
  completedAt     DateTime
}
```

### Key Metrics Formulas

| Metric | Formula |
|--------|---------|
| PDC_90 | (Days with Medication / 90) × 100 |
| Completion Rate | Completed CMRs / Eligible Members |
| Attempt Rate | Attempted CMRs / Eligible Members |
| Refusal Rate | Refused / Attempted |
| ROI Multiple | Total Cost Avoidance / Program Cost |
| AIM Value | Lookup by Severity Level |

---

## Deployment

### Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Local development |
| Production | Vercel | Live demo |

### Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
ANTHROPIC_API_KEY="sk-ant-..."
SIGMA_CLIENT_ID="..."
SIGMA_CLIENT_SECRET="..."
DEMO_PASSWORD="GeneDemo"
```

---

## Roadmap

### MVP (Current Release)
- ✅ 9 Analytics Dashboards
- ✅ 6 Enterprise Platform Features
- ✅ Password Protection
- ✅ AI Chat Assistant
- ✅ Mock Data Support

### v1.1 (Next Release)
- [ ] Full database integration
- [ ] User authentication (multiple users)
- [ ] Role-based access control
- [ ] Email notifications
- [ ] Scheduled reports

### v2.0 (Future)
- [ ] Real-time data sync
- [ ] Mobile app
- [ ] Advanced AI insights
- [ ] Custom rules engine
- [ ] API for third-party integrations

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| PDC | Proportion of Days Covered - adherence measure |
| CMR | Comprehensive Medication Review |
| TIP | Targeted Intervention Program |
| DTP | Drug Therapy Problem |
| AIM | Actuarial Impact Model |
| MTM | Medication Therapy Management |
| Star Rating | CMS quality rating (1-5 stars) |

### References

- CMS Part D MTM Requirements
- PQA Adherence Measures
- NCPDP Standards
- AIM Severity Level Definitions

---

**Document Owner:** Product Team
**Last Updated:** January 2026
**Version:** 1.0
