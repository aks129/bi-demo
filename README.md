# ACME Pharmacy Analytics - Enterprise MTM Platform

**Status:** ✅ MVP Complete with Enterprise Features
**GitHub:** https://github.com/aks129/bi-demo
**Demo Password:** `GeneDemo`

---

## What This Is

A complete **enterprise-grade analytics platform** for Medication Therapy Management (MTM), featuring:

- **11 Dashboard Pages** - Executive, MTM, Adherence, ROI, Eligibility, and more
- **6 Enterprise Platform Features** - Community, Wiki, Case Studies, Benchmarking, Report Builder, Activity Feed
- **AI-Powered Chat Assistant** - Claude-powered analytics assistant
- **Password-Protected Access** - Secure demo environment
- **Full Specification Kit** - 150+ pages of documentation

---

## Quick Start

### Run Locally

```bash
# Clone repository
git clone https://github.com/aks129/bi-demo.git
cd bi-demo/acme-pharmacy-analytics/apps/web

# Install dependencies
npm install

# Set up database
npm run db:push    # Create SQLite database
npm run db:seed    # Seed with demo data

# Start development server
npm run dev
# Open http://localhost:3000
```

**Demo Password:** `GeneDemo`

---

## Features Overview

### Core Analytics Dashboards

| Dashboard | Description | Key Metrics |
|-----------|-------------|-------------|
| **Executive Overview** | High-level KPIs with trends | Completion rate, ROI, Star Rating |
| **Client Analytics** | Adherence by drug class | PDC, at-risk members, alerts |
| **Adherence Deep Dive** | Cohort analysis | Distribution, trends, benchmarks |
| **Member Analytics** | Individual member tracking | Searchable directory, history |
| **MTM Performance** | CMR/TIP completion rates | Attempt rate, refusal rate |
| **Financial ROI** | Cost avoidance analysis | AIM values, waterfall chart |
| **2025 Eligibility** | CMS rule compliance | Threshold analysis, projections |
| **Work Queue** | Pharmacist workflow | Priority sorting, interventions |
| **Insights & Alerts** | Rules engine notifications | Playbooks, SLAs, owners |

### Enterprise Platform Features

| Feature | Description |
|---------|-------------|
| **Analytics Community** | Cross-client forum for MTM professionals |
| **Wiki & Data Dictionary** | Central knowledge base with 6+ searchable terms |
| **Case Studies** | Success stories with before/after metrics |
| **Benchmarking** | National comparison with percentile rankings |
| **Report Builder** | Drag-and-drop custom report creation |
| **Activity Feed** | Real-time updates with 30-second polling |

### Security & Authentication

- Password-protected demo (`GeneDemo`)
- Secure cookie-based authentication
- 7-day session persistence
- Logout functionality

### AI Integration

- Claude-powered chat assistant
- Dashboard-aware responses
- MTM metric explanations
- Actionable insights

---

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Database:** Prisma ORM + SQLite
- **AI:** Anthropic Claude API
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## Repository Structure

```
bi-demo/
├── README.md                           # This file
├── PRD.md                              # Product Requirements Document
├── DEPLOYMENT.md                       # Deployment guide
│
├── acme-pharmacy-analytics-spec/       # 150+ page specification kit
│   ├── vision.md                       # Problem statement & solution
│   ├── scope.md                        # MVP vs v2.0 features
│   ├── personas.md                     # 9 user roles
│   └── ...                             # Data contracts, KPIs, etc.
│
└── acme-pharmacy-analytics/
    └── apps/web/                       # Main application
        ├── app/
        │   ├── page.tsx                # Landing page
        │   ├── login/                  # Password protection
        │   ├── dashboard/              # 11 dashboard pages
        │   │   ├── executive/          # Executive Overview
        │   │   ├── adherence/          # Adherence Deep Dive
        │   │   ├── members/            # Member Analytics
        │   │   ├── mtm/                # MTM Performance
        │   │   ├── roi/                # Financial ROI
        │   │   ├── eligibility/        # 2025 Eligibility
        │   │   ├── work-queue/         # Pharmacist Work Queue
        │   │   ├── insights/           # Insights & Alerts
        │   │   ├── community/          # Analytics Community
        │   │   ├── wiki/               # Wiki pages
        │   │   ├── data-dictionary/    # Searchable glossary
        │   │   ├── case-studies/       # Success stories
        │   │   ├── benchmarking/       # National comparison
        │   │   ├── report-builder/     # Custom reports
        │   │   ├── reports/            # Saved reports
        │   │   ├── feed/               # Activity feed
        │   │   └── embedded/           # Sigma/Hex embedding
        │   └── api/
        │       ├── auth/               # Login/logout
        │       ├── chat/               # Claude AI chat
        │       └── sigma/              # Sigma embed API
        ├── components/
        │   └── dashboard/              # Reusable components
        ├── lib/
        │   ├── data-service.ts         # Database queries
        │   ├── platform-mock-data.ts   # Mock data for platform features
        │   └── platform-service.ts     # Platform data services
        ├── middleware.ts               # Route protection
        └── prisma/
            ├── schema.prisma           # Database schema
            └── seed.ts                 # Seed data
```

---

## Key Metrics

### MTM Performance
- **Completion Rate:** CMRs completed / eligible members
- **Attempt Rate:** CMRs attempted / eligible members
- **Refusal Rate:** Members who declined / attempted

### Adherence (PDC)
- **PDC 90:** Proportion of days covered (90-day window)
- **At-Risk:** Members with PDC 75-79%
- **Critical:** Members with PDC < 75%

### Financial
- **AIM Value:** Actuarial Impact Model cost avoidance
- **ROI Multiple:** Total savings / program cost
- **Cost Avoidance:** Estimated healthcare savings

### Star Ratings
- **Threshold:** ≥80% PDC for 4+ stars
- **Impact:** Affects CMS bonus payments worth millions

---

## Demo Walkthrough

### 1. Login (Password: `GeneDemo`)
Access the protected demo environment

### 2. Executive Overview
See high-level KPIs, trends, and Star Rating status

### 3. MTM Performance
Review completion rates, work queue priorities

### 4. Report Builder
Create custom reports with drag-and-drop metrics:
- Select from 15+ metrics
- Choose visualization (bar, line, area, table, KPI)
- Configure filters and grouping
- Save and share reports

### 5. Analytics Community
Browse best practices, Q&A, announcements

### 6. Benchmarking
Compare performance against national averages:
- Percentile rankings
- Top decile vs bottom decile
- Trend analysis

---

## Environment Variables

```env
# Required
DATABASE_URL="file:./prisma/dev.db"

# Optional - AI Chat
ANTHROPIC_API_KEY="your-key"

# Optional - Sigma Integration
SIGMA_CLIENT_ID="your-client-id"
SIGMA_CLIENT_SECRET="your-secret"

# Optional - Custom password (default: GeneDemo)
DEMO_PASSWORD="your-custom-password"
```

---

## Development

### Install Dependencies
```bash
npm install
```

### Database Setup
```bash
npm run db:push    # Create tables
npm run db:seed    # Seed demo data
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

---

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `DATABASE_URL` (for production DB)
   - `ANTHROPIC_API_KEY` (optional, for AI chat)
   - `DEMO_PASSWORD` (optional, default: GeneDemo)
3. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## Documentation

- **PRD:** [PRD.md](PRD.md) - Full product requirements
- **Specs:** [acme-pharmacy-analytics-spec/](acme-pharmacy-analytics-spec/) - 150+ pages
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md) - Setup guide

---

## License

MIT

---

## Acknowledgments

**Built by:** Outcomes Product & Engineering
**Purpose:** Enterprise MTM Analytics Platform Demo
**Stack:** Next.js 15, TypeScript, Tailwind CSS, Prisma, Claude AI

---

**Last Updated:** January 2026
