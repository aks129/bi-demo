#!/usr/bin/env python3
"""
ACME Pharmacy Analytics Spec Kit Generator
Generates all remaining specification files for the demo project.

Usage:
    python generate_spec_files.py
"""

import os
from pathlib import Path

def write_file(filepath, content):
    """Write content to file, creating directories as needed."""
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print(f"✓ Created: {filepath}")

# Define all file contents
spec_files = {
    # Top-level files (remaining)
    "security_privacy.md": """# Security & Privacy

**Last Updated:** 2025-10-19

## PII/PHI Handling for Demo

### Synthetic Data Only
- **Zero Real PHI/PII:** All member names, DOBs, addresses, SSNs generated via Faker library
- **Validation:** Pre-commit hooks scan for SSN patterns, real email domains
- **Sign-Off:** Compliance team approves all data generation scripts

### HIPAA Posture (Demo Environment)
**This is a DEMO environment using 100% synthetic data. HIPAA does not apply.**

**If transitioned to production:**
- Business Associate Agreement (BAA) required with cloud provider
- Encryption at rest (AES-256) and in transit (TLS 1.2+)
- Access logging and monitoring
- Incident response plan
- Annual risk assessments

## Row-Level Security (RLS) Strategy

### Scoping Mechanisms
| Role | RLS Filter | Example |
|------|------------|---------|
| CLIENT_VIEWER (ACME) | `WHERE client_id = 'ACME'` | Sees only ACME Pharmacy data |
| CLIENT_ADMIN (ACME) | `WHERE client_id = 'ACME'` | Same scope; can manage users |
| INTERNAL_OPS | No client filter | Sees all clients (for ops monitoring) |
| PRODUCT | Aggregated only | No client-specific PII; usage metrics only |
| COMPLIANCE | Audit access | Read-only; full visibility for audits |
| EXEC (Internal) | `WHERE org_id = 'Outcomes'` | Internal org only |

### RLS Enforcement
- **BI Tool Native:** Sigma User Attributes, Looker access_grants, Tableau entitlements table
- **Backup Warehouse-Level:** Snowflake row access policies as secondary enforcement
- **Testing:** Automated tests per role (see acceptance_tests.md)

## Audit Trail

### What We Log
- All BI queries (user, SQL, timestamp, filters applied)
- AI chat queries and responses
- Alert triages and resolutions
- User login/logout events
- RLS policy changes

### Retention
- **Demo:** 90 days
- **Production:** 1 year minimum (configurable to 7 years for regulatory compliance)

---

**Related:**
- [Risks & Mitigations](risks_and_mitigations.md) — SP-* risks
- [RBAC](requirements/rbac.md) — Role definitions
- [Governance](governance.md) — Data stewardship
""",

    "architecture_overview.md": """# Architecture Overview

**Last Updated:** 2025-10-19

## Logical Architecture

```
[Presentation Layer: BI Dashboards + AI Chat]
              ↓
[Semantic/Metric Layer: dbt metrics, LookML]
              ↓
[Data Warehouse: Snowflake/BigQuery/Databricks]
   - fact_claims, fact_adherence, fact_gaps
   - dim_member, dim_drug, dim_client
              ↓
[Transformation: dbt models, tests]
              ↓
[Ingestion: Airflow/Prefect orchestration]
              ↓
[Data Sources: Synthetic data scripts, telemetry]
```

## Key Components

1. **Data Sources:** Synthetic PII/PHI generators (Faker), product telemetry
2. **Ingestion:** Airflow DAGs load raw data → warehouse
3. **Transformation:** dbt models clean, join, aggregate → fact/dim tables
4. **Warehouse:** Star schema with RLS enforcement
5. **Semantic Layer:** Metrics catalog (dbt metrics or BI tool native)
6. **Dashboards:** 7 persona-specific dashboards in Sigma/Looker/Tableau
7. **AI Agent:** LLM (GPT-4/Claude) + RAG over metrics catalog
8. **Notifications:** Rule engine evaluates metrics → generates alerts

## Data Flow (Daily Batch)

1. **2 AM ET:** Synthetic data scripts generate claims, roster updates → S3/GCS
2. **3 AM ET:** Airflow triggers dbt run (staging → intermediate → marts)
3. **5 AM ET:** dbt tests validate quality; metrics refresh
4. **6 AM ET:** Dashboards query latest data; notification engine evaluates rules
5. **Users see updated data by 6 AM ET** (SLA: <24h latency)

---

**Related:**
- [Data Contracts](data_contracts/schemas.md) — Table schemas
- [Governance](governance.md) — Data lineage and ownership
""",

    "acceptance_tests.md": """# Acceptance Tests

**Last Updated:** 2025-10-19

## Testing Approach

**Scenario-Based Testing:** Each test follows GIVEN / WHEN / THEN format aligned with user personas and workflows.

---

## Dashboard 1: Client Analytics

### Test 1.1: Adherence KPI Ribbon Displays Correctly
**Persona:** Client Data Analyst
**GIVEN:** User logs in as CLIENT_VIEWER role for ACME Pharmacy
**WHEN:** User navigates to Client Analytics dashboard
**THEN:**
- KPI ribbon shows 4 metrics: Overall PDC_90, Diabetes PDC, Hypertension PDC, Statins PDC
- Values are numeric (0-100%)
- Color-coded: Green if ≥80%, Yellow if 75-80%, Red if <75%
- Tooltips explain "Why this matters" (Star Ratings threshold)

### Test 1.2: Drill into Diabetes Cohort
**GIVEN:** Diabetes PDC shows 78.4% (below 80% threshold)
**WHEN:** User clicks Diabetes PDC tile
**THEN:**
- Dashboard drills to Diabetes cohort view
- Shows breakdown by plan (top-N plans with worst PDC)
- Trend chart displays WoW adherence (last 12 weeks)
- Export button available

### Test 1.3: RLS Enforcement (Client Viewer)
**GIVEN:** User logged in as CLIENT_VIEWER for ACME Pharmacy
**WHEN:** User views member drill-down table
**THEN:**
- Only ACME Pharmacy members visible (`WHERE client_id = 'ACME'`)
- Attempting to modify URL param `?client_id=OTHER` returns "Access Denied"

---

## Dashboard 5: Insights & Alerts

### Test 5.1: Alert Inbox Populated
**Persona:** Any authenticated user (role-scoped alerts)
**GIVEN:** Notification engine evaluated rules overnight
**WHEN:** User opens Insights & Alerts dashboard
**THEN:**
- Inbox shows alerts relevant to user role
- Each alert displays: severity, owner, SLA countdown, playbook link
- Alerts sorted by severity (Critical → High → Medium)

---

## Dashboard 7: AI Chat Agent

### Test 7.1: Metric Lookup Query
**Persona:** Client Analyst
**GIVEN:** User asks "What was diabetes adherence last month?"
**WHEN:** AI agent processes query
**THEN:**
- Response: "Diabetes PDC_90 for September 2025 was 78.4%"
- Citation: Links to metrics catalog and fact_adherence table
- Response time <5 seconds (p95)

### Test 7.3: Guardrails Reject Write Query
**GIVEN:** User asks "Write SQL to update adherence for member 12345"
**WHEN:** AI evaluates guardrails
**THEN:**
- Response: "I cannot write queries that modify data. I can only answer questions about existing data."
- No SQL executed; audit log shows "Rejected: out-of-scope query"

---

**Related:**
- [Demo Script](demo_script.md) — Demo walkthrough scenarios
- [RBAC](requirements/rbac.md) — Role definitions for RLS tests
""",

    # Personas directory
    "personas/client_data_analyst.md": """# Persona: Client Data Analyst

## Profile

**Name:** Maria Rodriguez
**Role:** Senior Clinical Data Analyst
**Organization:** ACME Pharmacy
**Tenure:** 5 years in healthcare analytics, 2 years at ACME
**Reports to:** Director of Clinical Programs

## Demographics

- **Age:** 34
- **Education:** MS in Health Informatics
- **Technical Proficiency:** High (SQL, Tableau, Excel power user)
- **Domain Knowledge:** Expert in adherence metrics, Star Ratings, MTM programs

## Goals & Motivations

### Primary Goals
1. **Maintain adherence ≥80% for Star Ratings compliance** (Diabetes, Hypertension, Statins cohorts)
2. **Identify at-risk members early** (before adherence drops below threshold)
3. **Support MTM team** with gap closure insights and CMR completion tracking
4. **Provide actionable reports** to clinical pharmacists and account managers

### Success Metrics (Personal)
- PDC ≥80% for ≥85% of members (across all 3 drug classes)
- Gap closure cycle time <14 days (median)
- CMR completion rate ≥65% by quarter-end
- Zero "surprise" adherence drops (caught early via proactive monitoring)

## Pain Points (Current State)

1. **Fragmented tools:** Uses 3 different systems (claims data in SQL, adherence in Excel, gaps in vendor portal)
2. **Delayed insights:** Month-end reporting means problems discovered 2-4 weeks too late
3. **Manual cohort building:** Spends 4-6 hours/week pulling member lists for outreach campaigns
4. **Unclear causality:** When adherence drops, hard to pinpoint root cause (which plans? which regions?)
5. **No proactive alerts:** Reactively responds to payer complaints instead of preventing issues

## Workflows

### Weekly Routine
- **Monday AM:** Pull weekend fill data; check for adherence dips
- **Tuesday:** Build outreach cohorts (members at risk of lapsing)
- **Wednesday:** MTM team meeting—report on gap closure progress
- **Thursday:** Ad-hoc requests from account managers ("Payer X asking about Plan Y adherence")
- **Friday:** Weekly KPI deck for leadership (manually assembled in PowerPoint)

### Key Tasks
1. **Adherence monitoring:** Track PDC_90 by cohort (drug class, plan, region)
2. **Cohort segmentation:** Filter members by risk band, days since last fill, adherence trend
3. **Root cause analysis:** Drill into outlier plans/regions to identify drivers
4. **Export member lists:** Send to outreach teams with context (why at-risk, recommended action)
5. **Trend reporting:** WoW, MoM comparisons for leadership

## Needs from ACME Pharmacy Analytics Platform

### Must-Have Features
1. **Real-time adherence dashboard:** See PDC_90, PDC_180, MPR by cohort updated daily
2. **Proactive alerts:** Notify when adherence drops ≥5pp WoW or falls below 80%
3. **Drill-down capability:** Click cohort → see plan/region breakdown → export member list
4. **Trend visualization:** 12-week rolling adherence with annotations (holidays, supply chain events)
5. **One-click exports:** CSV member lists ready for outreach teams

### Nice-to-Have
- Predictive adherence risk scores (ML-based)
- Automated "what changed" summaries (no more manual PowerPoint)
- Integration with MTM platform (push cohorts directly)

## How She Measures Platform Success

**Within 30 days:**
- Reduced weekly reporting time from 6 hours → 2 hours
- Caught ≥1 adherence drop early (before it impacted month-end metrics)

**Within 90 days:**
- Diabetes PDC improved from 78% → 82% (back above Star threshold)
- Gap closure cycle time down from 18 days → 12 days
- Account managers self-serve 50% of ad-hoc requests (vs. waiting for Maria)

## Quotes

> "I need to see problems before they become crises. By the time a payer calls, we've already lost 2 weeks."

> "Give me a dashboard that answers 'Who's at risk and why?' in 30 seconds, and I'll save 5 hours a week."

> "I don't just need data—I need cohorts I can act on. Show me the members, let me export them, done."

---

**Related:**
- [User Stories: Client Analytics](../user_stories/client_analytics.md)
- [Wireframes: Client Analytics Dashboard](../ux/wireframes.md#client-analytics)
""",

    "personas/client_exec.md": """# Persona: Client Executive

## Profile

**Name:** David Chen
**Role:** Chief Operating Officer
**Organization:** ACME Pharmacy
**Tenure:** 15 years in pharmacy operations, 8 years at ACME
**Reports to:** CEO

## Demographics

- **Age:** 52
- **Education:** MBA + PharmD
- **Technical Proficiency:** Medium (uses Tableau dashboards built by analysts)
- **Domain Knowledge:** Expert in pharmacy operations, Star Ratings business impact, payer relations

## Goals & Motivations

### Primary Goals
1. **Protect Star Ratings** (maintain 4.0+ stars to avoid ~$8M revenue loss)
2. **Monitor strategic KPIs** (adherence trends, cost-of-care signals, gap closure)
3. **Make data-driven decisions** (resource allocation, payer contract negotiations)
4. **Demonstrate value to payers** (e.g., "We improved adherence 4pp in Q3")

### Success Metrics (Personal)
- Star Ratings ≥4.0 stars (annual)
- Contract renewals with all 12 payers
- PMPM Rx cost trend flat or declining
- Board presentations backed by data (not anecdotes)

## Pain Points (Current State)

1. **Monthly PowerPoint reports:** Analysts spend days assembling slides; data is 2-3 weeks old by the time David sees it
2. **No early warnings:** Hears about adherence drops from payers (embarrassing, reactive)
3. **Disconnected metrics:** Finance reports PMPM cost, clinical reports adherence, ops reports SLAs—no unified view
4. **Can't drill into details:** Sees "adherence down 3pp" but has to request separate report to understand why
5. **Decision latency:** By the time data is ready, opportunity to act has passed

## Workflows

### Monthly Routine
- **First Monday:** Review prior month KPIs (Star proxy, adherence, PMPM trends)
- **Mid-month:** Board prep meeting (gather data for quarterly board deck)
- **End-of-month:** Payer QBRs (Quarterly Business Reviews)—defend performance, negotiate renewals

### Key Tasks
1. **Strategic monitoring:** Trend health (are we on track for Star Ratings target?)
2. **Payer relations:** Show data proving ACME's value (gap closure, adherence lift, cost management)
3. **Resource allocation:** Decide where to invest (more MTM pharmacists? Outreach campaigns?)
4. **Board reporting:** Communicate performance to board (outcomes, not just activity)

## Needs from ACME Pharmacy Analytics Platform

### Must-Have Features
1. **Executive dashboard:** 1-page summary of strategic KPIs (Star proxy, adherence, cost trends)
2. **"What changed" digest:** Automated weekly email: "What moved this week and why?"
3. **Click-to-drill:** See high-level trend → click to understand root cause
4. **Early alerts:** Proactive notifications when metrics deteriorate (before payer notices)
5. **Exportable summaries:** One-click board deck or payer QBR slides

### Nice-to-Have
- Predictive Star Ratings forecast (12-month projection)
- Peer benchmarking (ACME vs. industry average)
- Natural language briefings (AI-generated exec summary)

## How He Measures Platform Success

**Within 30 days:**
- No more waiting for monthly reports—checks dashboard anytime
- Received ≥1 early alert (prevented surprise payer complaint)

**Within 90 days:**
- Star Ratings trajectory improved (on track for 4.0+)
- Used platform data in ≥2 payer QBRs (showed adherence lift proof)
- Board presentation praised for data clarity

## Quotes

> "I don't need 50 charts. I need 5 numbers that tell me if we're winning or losing."

> "If a payer knows about a problem before I do, I've failed. I need early warnings."

> "Show me what changed this week in 2 minutes, then let me drill if I want details."

---

**Related:**
- [User Stories: Exec Overview](../user_stories/exec_overview.md)
- [Wireframes: Exec Overview Dashboard](../ux/wireframes.md#exec-overview)
""",

    # Continue with more persona files...
    "personas/internal_ops_lead.md": """# Persona: Internal Ops Lead

**Name:** Priya Patel
**Role:** Data Operations Manager
**Organization:** Outcomes (internal team)
**Goals:**
- Ensure 99%+ feed SLA compliance
- Catch data quality issues before they impact client dashboards
- Minimize pipeline downtime

**Pain Points:**
- Discovers feed delays during month-end close (too late)
- Schema drift breaks dashboards unexpectedly
- No visibility into root cause of row count anomalies

**Needs:**
- Real-time feed latency monitoring
- Automated schema drift alerts
- SLA compliance heatmap
""",

    "personas/product_manager.md": """# Persona: Product Manager

**Name:** Alex Kim
**Role:** Senior Product Manager
**Organization:** Outcomes
**Goals:**
- Prove feature impact (usage → client outcomes)
- Hit product OKRs (adoption, retention, engagement)
- Prioritize roadmap based on data

**Needs:**
- DAU/WAU/MAU tracking
- Feature adoption funnels
- Correlation: feature usage → adherence lift
""",

    "personas/compliance_analyst.md": """# Persona: Compliance Analyst

**Name:** Sarah Mitchell
**Role:** Compliance Officer
**Organization:** Outcomes
**Goals:**
- Ensure HIPAA compliance (if production)
- Validate RLS enforcement
- Audit data access patterns

**Needs:**
- Audit trail of all queries
- RLS policy verification dashboards
- Metric lineage documentation
""",

    # User Stories
    "user_stories/client_analytics.md": """# User Stories: Client Analytics

## Epic: Proactive Adherence Monitoring

### Story 1.1: View Adherence KPIs by Drug Class
**As a** Client Data Analyst
**I want to** see PDC_90 by drug class (Diabetes, Hypertension, Statins) on one dashboard
**So that** I can quickly identify which cohorts are below 80% threshold

**Acceptance Criteria:**
- [ ] KPI ribbon displays 4 metrics: Overall PDC, Diabetes PDC, Hypertension PDC, Statins PDC
- [ ] Color-coded: Green (≥80%), Yellow (75-80%), Red (<75%)
- [ ] Tooltips explain Star Ratings threshold
- [ ] Values update daily

### Story 1.2: Drill into At-Risk Cohorts
**As a** Client Data Analyst
**I want to** click a below-threshold metric and drill into plan/region breakdown
**So that** I can identify root causes (which plans or regions are driving the drop)

**Acceptance Criteria:**
- [ ] Clicking Diabetes PDC tile shows plan-level breakdown
- [ ] Sorted by worst-performing plans first
- [ ] Trend chart shows last 12 weeks of adherence
- [ ] Export button downloads member list (masked IDs)

---

**Related:**
- [Persona: Client Data Analyst](../personas/client_data_analyst.md)
- [Wireframes](../ux/wireframes.md#client-analytics)
""",

    "user_stories/exec_overview.md": """# User Stories: Executive Overview

## Story 2.1: View Star Ratings Proxy Trend
**As a** Client Executive
**I want to** see high-level Star Ratings proxy trend (last 12 weeks)
**So that** I know if we're on track to maintain 4.0+ stars

**Acceptance Criteria:**
- [ ] Star proxy chart shows weekly trend
- [ ] Current value and change vs. prior week displayed
- [ ] Click to drill into contributing metrics (adherence, gaps, CMR)

## Story 2.2: Receive Weekly "What Changed" Digest
**As a** Client Executive
**I want to** automated summary of key metric changes each week
**So that** I don't have to manually compare dashboards

**Acceptance Criteria:**
- [ ] Digest shows top 3 movers (up or down)
- [ ] Narrative text: "Diabetes adherence down 5pp; Gap closure up 8%"
- [ ] Links to detailed dashboards
""",

    "user_stories/internal_ops.md": """# User Stories: Internal Ops Monitoring

## Story 3.1: Monitor Feed Latency SLAs
**As an** Internal Ops Lead
**I want to** see real-time feed latency for all data sources
**So that** I can catch delays before they impact client dashboards

**Acceptance Criteria:**
- [ ] Heatmap shows latency by feed and day (Green/Yellow/Red)
- [ ] Alert triggers when latency >24 hours
- [ ] Click cell to see incident details and resolution notes
""",

    "user_stories/product_metrics.md": """# User Stories: Product Metrics

## Story 4.1: Track Feature Adoption
**As a** Product Manager
**I want to** see % of users who used each feature (drill-down, export, filters)
**So that** I can prioritize high-impact features

**Acceptance Criteria:**
- [ ] Adoption % per feature displayed
- [ ] Cohort retention curve (Day 7, Day 14, Day 30)
""",

    "user_stories/insights_alerts.md": """# User Stories: Insights & Alerts

## Story 5.1: Receive Proactive Adherence Alerts
**As a** Client Data Analyst
**I want to** be notified when PDC drops ≥5pp WoW
**So that** I can triage before it impacts Star Ratings

**Acceptance Criteria:**
- [ ] Alert fires when rule condition met
- [ ] Includes: severity, owner, SLA, playbook link
- [ ] Deduplication prevents repeat alerts <48h
""",

    "user_stories/ai_chat_agent.md": """# User Stories: AI Chat Agent

## Story 6.1: Look Up Metric Definition
**As a** Client Analyst
**I want to** ask "How is PDC_90 calculated?" in plain English
**So that** I get instant answers without searching docs

**Acceptance Criteria:**
- [ ] AI retrieves definition from metrics catalog
- [ ] Response includes: business logic, SQL, source tables
- [ ] Citation provided (link to catalog)
""",

    # Requirements
    "requirements/functional.md": """# Functional Requirements

## FR-1: Dashboards

### FR-1.1: Client Analytics Dashboard
- Display adherence KPIs (PDC_90, PDC_180, MPR) by drug class
- Support drill-down: cohort → plan → member
- Export member lists to CSV
- Refresh data daily (<24h latency)

### FR-1.2: Executive Overview Dashboard
- Display Star Ratings proxy trend (12 weeks)
- "What changed" digest (top 3 movers)
- Click-to-drill into details

### FR-1.3: Internal Ops Dashboard
- Feed latency heatmap (Green/Yellow/Red)
- Row count validation
- Schema drift log

### FR-1.4: Product Metrics Dashboard
- DAU/WAU/MAU tracking
- Feature adoption % and retention curves

### FR-1.5: Insights & Alerts Dashboard
- Centralized alert inbox
- Owner, SLA, playbook per alert
- Triage workflow (pending → triaged → resolved)

### FR-1.6: Admin/Governance Dashboard
- Metrics catalog browser
- Lineage visualization
- RLS policy viewer

### FR-1.7: AI Chat Interface
- Natural language Q&A
- Metric definition lookup
- Lineage queries
- Guardrails (no writes, no out-of-scope)

## FR-2: Notifications

### FR-2.1: Rule Evaluation
- Evaluate 5-7 pre-configured rules nightly
- Generate alerts when conditions met

### FR-2.2: Deduplication
- Prevent duplicate alerts for same entity <48h

### FR-2.3: Ownership & SLAs
- Each alert assigned to role (CLIENT_ADMIN, INTERNAL_OPS, etc.)
- SLA countdown visible

## FR-3: Metrics Catalog

### FR-3.1: Centralized Definitions
- All metrics documented: name, business logic, SQL, owner
- Version-controlled (Git)

### FR-3.2: Searchable
- Users can search catalog by keyword

## FR-4: RLS Enforcement

### FR-4.1: Client Scoping
- CLIENT_VIEWER sees only `WHERE client_id = [their_client]`
- INTERNAL_OPS sees all clients

### FR-4.2: Role Hierarchy
- ADMIN > ANALYST > VIEWER

---

**Related:**
- [Non-Functional Requirements](non_functional.md)
- [RBAC](rbac.md)
""",

    "requirements/non_functional.md": """# Non-Functional Requirements

## NFR-1: Performance

- Dashboard load time (p95): <3 seconds
- AI chat response time (p95): <5 seconds
- Data refresh SLA: <24 hours (nightly batch)
- Query concurrency: Support ≥50 concurrent users

## NFR-2: Reliability

- Uptime: ≥99.5% (demo environment)
- Data quality incidents: <2 per month (P0/P1)
- Failed dashboard queries: <1% of total

## NFR-3: Security

- Encryption at rest and in transit
- RLS enforced 100% (no bypass)
- Audit trail 100% complete
- Synthetic data only (0 real PHI/PII)

## NFR-4: Scalability (Production, if applicable)

- Support 5M+ members
- 100M+ claims
- Real-time streaming ingestion

## NFR-5: Usability

- Dashboards load in <3 clicks from home
- Tooltips explain all metrics
- "So what / now what" guidance on every chart

---

**Related:**
- [Functional Requirements](functional.md)
- [Observability](observability.md)
""",

    "requirements/rbac.md": """# Role-Based Access Control (RBAC)

## Roles

| Role | Description | RLS Scope | Permissions |
|------|-------------|-----------|-------------|
| **CLIENT_VIEWER** | Analyst at client org | `WHERE client_id = [their_client]` | Read dashboards, export CSVs |
| **CLIENT_ADMIN** | Manager at client org | `WHERE client_id = [their_client]` | CLIENT_VIEWER + manage client users |
| **INTERNAL_OPS** | Outcomes ops team | All clients visible | Monitor pipelines, triage incidents |
| **PRODUCT** | Outcomes product team | Aggregated only (no PII) | View product metrics, usage trends |
| **COMPLIANCE** | Outcomes compliance | All data (read-only) | Audit logs, RLS verification |
| **EXEC** | Outcomes execs | `WHERE org_id = 'Outcomes'` | Strategic dashboards, exec summaries |

## RLS Implementation

- **BI Tool Native:** Sigma User Attributes, Looker access_grants, Tableau entitlements table
- **Backup:** Snowflake row access policies

## Testing

- Automated tests per role (see acceptance_tests.md)
- Monthly RLS audits by compliance team

---

**Related:**
- [Security & Privacy](../security_privacy.md)
- [Acceptance Tests](../acceptance_tests.md)
""",

    "requirements/auditability.md": """# Auditability Requirements

## Audit Trail Logging

**What We Log:**
- All BI queries (user, SQL, timestamp, filters applied)
- AI chat queries and responses
- Alert triages and resolutions
- User login/logout events
- RLS policy changes
- Metric definition changes

**Retention:**
- Demo: 90 days
- Production: 1 year minimum

**Access:**
- COMPLIANCE role: Read-only
- Append-only (no deletions)

## Compliance Reporting

**Monthly Reports:**
- Data access patterns by user and role
- RLS enforcement validation
- Schema drift incidents
- SLA compliance summary

---

**Related:**
- [Governance](../governance.md)
- [Security & Privacy](../security_privacy.md)
""",

    "requirements/accessibility.md": """# Accessibility Requirements

## WCAG 2.1 Level AA Compliance (Target)

- Color contrast ≥4.5:1 for text
- Keyboard navigation support
- Screen reader compatible (ARIA labels)

## UX Best Practices

- Font size ≥12pt
- Tooltips for all metrics
- "So what / now what" guidance

---

**Note:** Full WCAG compliance deferred to v2.0; MVP focuses on core accessibility.
""",

    "requirements/observability.md": """# Observability Requirements

## Metrics for the Analytics App Itself

**Infrastructure Metrics:**
- Dashboard query latency (p50, p95, p99)
- AI agent response time
- Data pipeline execution time
- Error rates (failed queries, pipeline failures)

**User Engagement Metrics:**
- DAU/WAU/MAU (who's using the platform?)
- Feature adoption (which dashboards/features used?)
- Session duration
- Bounce rate (users who leave immediately)

**Monitoring Tools:**
- Datadog, New Relic, or CloudWatch
- PagerDuty for critical alerts
- BI tool native analytics (Sigma usage stats, Looker query logs)

---

**Related:**
- [Non-Functional Requirements](non_functional.md)
- [Product Metrics Dashboard](../ux/wireframes.md#product-metrics)
""",
}

# Generate all files
base_dir = os.path.dirname(os.path.abspath(__file__))
for filepath, content in spec_files.items():
    full_path = os.path.join(base_dir, filepath)
    write_file(full_path, content)

print("\n" + "="*60)
print("✓ Spec Kit Generation Complete!")
print("="*60)
print(f"\nTotal files created: {len(spec_files)}")
print("\nNext steps:")
print("1. Review all generated files for completeness")
print("2. Run: ls -R acme-pharmacy-analytics-spec/ to see full structure")
print("3. Customize content as needed for your specific demo")
print("="*60)
