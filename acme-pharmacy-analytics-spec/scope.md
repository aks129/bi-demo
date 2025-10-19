# Scope

**Last Updated:** 2025-10-19

---

## Overview

This document defines **what is in scope** and **out of scope** for the ACME Pharmacy Analytics demo (v1.0). We distinguish between:

- **MVP (Minimum Viable Product)** — Must-have for initial demo
- **Future / V2** — Desirable but deferred to post-MVP
- **Explicitly Out of Scope** — Will not build, even in future versions

---

## In Scope: MVP (v1.0)

### 1. Client-Facing Pharmacy Metrics Analytics

**In Scope:**
- ✅ **Adherence metrics:** PDC_90, PDC_180, MPR_90 by drug class (Diabetes, Hypertension, Statins)
- ✅ **CMR/TMR completion rates** by plan, region, time period
- ✅ **Gap closure metrics:** detected gaps, closed gaps, cycle time (detection → closure)
- ✅ **Star Ratings contributors:** % members at PDC ≥80%, adherence trend vs. threshold
- ✅ **Cohort segmentation:** by drug class, plan, region, risk band
- ✅ **Trend charts:** WoW, MoM, QoQ comparisons
- ✅ **Top-N outliers:** worst-performing plans, regions, or cohorts
- ✅ **Drill-to-member (masked):** anonymized member lists with PDC, last fill date, days supply

**Out of MVP (Future):**
- ⏳ Real-time (sub-minute) streaming adherence updates
- ⏳ Predictive adherence risk scores (ML-based "likely to lapse")
- ⏳ Prescription sync recommendations

---

### 2. Executive Monitoring of Data & Outcomes

**In Scope:**
- ✅ **Star Ratings proxy trend:** high-level Star measure trajectory
- ✅ **Impact scoreboard:** adherence lift %, gap closure count, CMR completion trend
- ✅ **"What changed" digest:** automated week-over-week delta summary
- ✅ **Cost-of-care signals:** PMPM Rx trend, generic substitution rate (demo-safe proxies)
- ✅ **High-level KPI ribbon:** 4–6 strategic metrics on landing page

**Out of MVP (Future):**
- ⏳ Predictive Star Ratings forecast (12-month projection)
- ⏳ Peer benchmarking (ACME vs. industry avg)
- ⏳ Natural language exec briefing ("Star Ratings up 0.2 due to diabetes adherence lift")

---

### 3. Internal Operations Monitoring

**In Scope:**
- ✅ **Feed latency tracking:** claims_feed, member_roster, gaps_feed lag in hours
- ✅ **Row count validation:** expected vs. actual rows per feed
- ✅ **Schema drift detection:** unexpected columns, type changes
- ✅ **SLA compliance dashboard:** % feeds meeting <24h SLA
- ✅ **Incident log:** feed failures, backfill jobs, data quality issues
- ✅ **Pipeline health heatmap:** visual status grid (green/yellow/red) by feed and day

**Out of MVP (Future):**
- ⏳ Auto-remediation for common failures (e.g., retry logic)
- ⏳ Dependency graph visualization (upstream → downstream impact)
- ⏳ Cost attribution per pipeline (compute $ per feed)

---

### 4. Product Metrics / OKRs / KPIs & Product Usage

**In Scope:**
- ✅ **Usage metrics:** DAU, WAU, MAU by org and role
- ✅ **Stickiness:** DAU/MAU ratio, WAU/MAU ratio
- ✅ **Feature adoption:** % users who used "drill-to-member," "cohort filter," "export," etc.
- ✅ **Time-to-first-value:** median time from login → first dashboard load
- ✅ **Query performance:** p50, p95, p99 latency for key dashboards
- ✅ **Retention cohorts:** week-over-week retention curves by persona
- ✅ **Product OKR tracking:** adherence dashboard adoption target, exec digest open rate

**Out of MVP (Future):**
- ⏳ A/B test framework for feature variants
- ⏳ User journey funnel (signup → onboarding → activation → retention)
- ⏳ Correlation analysis (feature usage → client outcome improvement)

---

### 5. Actionable Insights & Notifications

**In Scope:**
- ✅ **5–7 pre-configured rules:**
  - Adherence Risk Spike (PDC drop ≥5pp WoW)
  - Feed Latency Breach (lag >24h)
  - Gap Closure Backlog (open gaps >30 days)
  - Star Proxy Decline (3-week downtrend)
  - CMR Completion Lag (<50% completion at week 10 of quarter)
- ✅ **Notification inbox:** centralized alert feed with severity, owner, status
- ✅ **Ownership assignment:** each rule has default owner role (e.g., CLIENT_ADMIN, INTERNAL_OPS)
- ✅ **SLA tracking:** time from alert creation → triage → resolution
- ✅ **Deduplication & cooldown:** prevent repeat alerts for same entity within 48 hours
- ✅ **Playbooks:** "So what / now what" guidance linked from each alert
- ✅ **Audit trail:** who viewed, triaged, or resolved each alert

**Out of MVP (Future):**
- ⏳ User-configurable rule builder (no-code threshold editor)
- ⏳ Slack/email integration for alert delivery
- ⏳ Auto-escalation (unresolved for >X days → escalate to manager)
- ⏳ ML-based anomaly detection (vs. static thresholds)

---

### 6. Impact-First Framing Across All Content

**In Scope:**
- ✅ **Metric annotations:** every chart has "Why this matters" tooltip
- ✅ **"So what / now what" embedded:** text blocks on dashboards
- ✅ **Impact scoreboard:** quantified outcomes (e.g., "12,450 gaps closed this quarter")
- ✅ **Narrative templates:** pre-written summaries for exec digest

**Out of MVP (Always):**
- ✅ All metrics tied to business or health outcomes in metric catalog

---

### 7. AI Chat Agent on Governed Data (Read-Only)

**In Scope:**
- ✅ **Natural language Q&A:** "What was diabetes adherence last month?" → grounded answer with metric definition citation
- ✅ **Metric definition lookup:** "How is PDC_90 calculated?" → return SQL + business logic from catalog
- ✅ **Lineage queries:** "Where does claims data come from?" → show lineage path
- ✅ **Guardrails:** reject queries outside scope (e.g., "Write a query to update adherence")
- ✅ **Provenance:** every AI response cites source (metric catalog, lineage doc, schema)
- ✅ **Demo-safe responses:** no PII/PHI in answers; mask member IDs

**Out of MVP (Future):**
- ⏳ Code generation (write SQL queries for user)
- ⏳ Predictive insights ("What will adherence be next month?")
- ⏳ Multi-turn conversation memory
- ⏳ User feedback loop (thumbs up/down on AI responses)

---

## Technology & Data Scope

### Data Volume (Demo Scale)

**In Scope:**
- ✅ **Members:** 150,000 synthetic member records
- ✅ **Claims:** 1.2M claim records (8 claims/member/year avg)
- ✅ **Adherence snapshots:** monthly PDC/MPR for 150K members × 12 months
- ✅ **Gaps:** 25,000 open + closed gap records
- ✅ **Ops telemetry:** 90 days of feed logs (3 feeds × daily ingestion)
- ✅ **Product telemetry:** 90 days of user activity (500 DAU avg)

**Out of MVP (Scaled Production):**
- ⏳ 5M+ members
- ⏳ 100M+ claims
- ⏳ Real-time streaming ingestion

### Synthetic Data Requirements

**In Scope:**
- ✅ Fully synthetic PII/PHI (names, DOBs, addresses via Faker)
- ✅ Realistic distributions (age, gender, risk bands, plan mix)
- ✅ Plausible adherence patterns (seasonal dips, cohort variance)
- ✅ Controlled anomalies for demo (e.g., 1 plan with sudden PDC drop)

**Out of Scope:**
- ❌ Real client data (even anonymized)
- ❌ Production integrations with live payer feeds

### Technology Stack

**In Scope (Suggested; adapt as needed):**
- ✅ **Data warehouse:** Snowflake, BigQuery, or Databricks
- ✅ **BI/Analytics layer:** Sigma Computing, Looker, or Tableau
- ✅ **Orchestration:** dbt for transformations, Airflow for scheduling
- ✅ **AI/LLM:** OpenAI GPT-4 or Anthropic Claude for chat agent
- ✅ **Metric catalog:** dbt metrics or custom YAML definitions
- ✅ **Auth/RBAC:** Okta, Auth0, or built-in BI tool RBAC
- ✅ **Audit/Logs:** Snowflake query history or dedicated audit table

**Out of MVP:**
- ⏳ Custom React SPA (use BI tool native UX for MVP)
- ⏳ Embedded analytics in client portals

---

## Persona & Role Scope

### In Scope (MVP Personas)

1. ✅ **Client Data Analyst** — operational reporting, cohort deep-dives
2. ✅ **Client Executive** — strategic KPIs, trend monitoring
3. ✅ **Internal Ops Lead** — pipeline health, SLA tracking
4. ✅ **Product Manager** — feature adoption, usage metrics
5. ✅ **Compliance Analyst** — audit trail, governance verification

### Out of MVP (Future Personas)

- ⏳ **Clinical Pharmacist** — member-level intervention workflows
- ⏳ **Finance Analyst** — revenue impact, cost attribution
- ⏳ **Sales Engineer** — prospect-facing custom views

---

## Geographic & Regulatory Scope

**In Scope:**
- ✅ **US Medicare Advantage** focus (Star Ratings, CMS measures)
- ✅ **HIPAA-conscious demo posture** (synthetic data, documented PHI handling)

**Out of Scope:**
- ❌ Medicaid, Commercial, or international markets (for MVP)
- ❌ GDPR-specific features (EU not in scope)

---

## Deliverables Scope

### In Scope (MVP Deliverables)

1. ✅ **Spec Kit** (this repo) — complete documentation
2. ✅ **Logical data model** — schemas, ERD, sample datasets
3. ✅ **Metrics catalog** — 25–30 defined metrics with SQL + business logic
4. ✅ **7 wireframed dashboards:**
   - Client Analytics
   - Exec Overview
   - Internal Ops
   - Product Metrics
   - Insights & Alerts
   - Admin/Governance
   - AI Chat
5. ✅ **5 notification rules** with playbooks
6. ✅ **Demo script** — step-by-step talk track (15–20 min)
7. ✅ **Acceptance tests** — scenario-based test cases for QA
8. ✅ **RLS strategy** — row-level security design doc
9. ✅ **AI agent prompt library** — analysis chain prompts

### Out of MVP (Future Deliverables)

- ⏳ Working prototype / PoC build
- ⏳ User onboarding videos
- ⏳ API documentation (if building custom endpoints)

---

## MVP vs. Future Feature Matrix

| Feature                                  | MVP (v1.0) | Future (v2.0+) |
|------------------------------------------|------------|----------------|
| Adherence metrics (PDC, MPR)             | ✅          |                |
| CMR/TMR completion tracking              | ✅          |                |
| Gap closure metrics                      | ✅          |                |
| Star Ratings proxy                       | ✅          |                |
| Cost-of-care signals (PMPM, generic %)   | ✅          |                |
| Feed latency & SLA tracking              | ✅          |                |
| Product usage metrics (DAU/WAU/MAU)      | ✅          |                |
| 5–7 pre-configured notification rules    | ✅          |                |
| AI chat agent (read-only Q&A)            | ✅          |                |
| Metric catalog with SQL definitions      | ✅          |                |
| RLS strategy (client_id, org_id scoping) | ✅          |                |
| Audit trail for all queries              | ✅          |                |
| Playbooks for insights                   | ✅          |                |
| Drill-to-member (masked)                 | ✅          |                |
| **Predictive adherence risk scores**     |            | ⏳              |
| **User-configurable alert builder**      |            | ⏳              |
| **Slack/email alert delivery**           |            | ⏳              |
| **Peer benchmarking (industry avg)**     |            | ⏳              |
| **A/B testing framework**                |            | ⏳              |
| **Auto-remediation for pipeline issues** |            | ⏳              |
| **Multi-turn AI conversations**          |            | ⏳              |
| **Real-time streaming ingestion**        |            | ⏳              |

---

## Constraints & Assumptions

### Constraints
- **Timeline:** MVP spec complete by 2025-10-19; prototype build TBD
- **Budget:** Demo-scale infrastructure only (no production-grade HA/DR)
- **Data:** Synthetic only; no real PHI/PII
- **Team:** Product + Eng collaboration; assume 1 PM, 2 engineers, 1 data analyst, 1 QA

### Assumptions
- **Stakeholders will validate personas & wireframes** before build starts
- **Sigma (or equivalent BI tool) licensing is available**
- **AI/LLM API access is approved** (OpenAI, Anthropic, or Azure OpenAI)
- **Data warehouse is already provisioned** (Snowflake, BigQuery, or Databricks)
- **Client success team will co-develop playbooks** for insights

---

## Decision Log

| Decision                                           | Rationale                                                                 | Date       |
|----------------------------------------------------|---------------------------------------------------------------------------|------------|
| Use synthetic data only for MVP                    | HIPAA risk mitigation; faster iteration without compliance review         | 2025-10-15 |
| Defer predictive analytics to v2.0                 | Focus MVP on descriptive + diagnostic analytics; ML adds complexity       | 2025-10-16 |
| Limit personas to 5 for MVP                        | Manageable scope; can expand to clinical pharmacist, finance in future    | 2025-10-17 |
| Pre-configure 5–7 rules instead of rule builder    | Faster to demo; builder requires complex UX and testing                   | 2025-10-18 |
| AI agent is read-only (no code gen) for MVP        | Reduces risk of incorrect queries; v2 can add write capabilities          | 2025-10-18 |

---

## Exit Criteria for MVP

**MVP is "done" when:**
1. ✅ All 7 dashboards are wireframed and spec'd
2. ✅ Metrics catalog has 25–30 defined metrics with SQL + business logic
3. ✅ 5 notification rules are defined with playbooks
4. ✅ RLS strategy is documented
5. ✅ Demo script is written and validated by sales/CSM
6. ✅ Acceptance tests cover all personas and dashboards
7. ✅ Spec Kit passes stakeholder review (product, eng, compliance, sales)

**"Ready to Build" gate:**
- All spec documents approved
- Prototype timeline & resource allocation confirmed
- Data generation scripts scoped
- BI tool and warehouse environments provisioned

---

**Next Steps:**
- Review [non_goals.md](non_goals.md) for explicit exclusions
- Dive into [personas/](personas/) to understand user archetypes
- Explore [user_stories/](user_stories/) for detailed workflows

---

**Related:**
- [Vision](vision.md)
- [Non-Goals](non_goals.md)
- [Success Criteria](success_criteria.md)
