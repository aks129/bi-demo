# Vision

**Last Updated:** 2025-10-19

---

## The Problem

Healthcare analytics is drowning in **data, not insight**. Pharmacy stakeholders—whether client executives, clinical teams, or operations leaders—face:

1. **Fragmented dashboards** — Separate tools for adherence, Star Ratings, claims, gaps, and operations. No unified view of "health."
2. **Delayed action** — By the time teams see a trend (e.g., adherence drop), it's already impacted member outcomes and Star Ratings.
3. **Unclear ownership** — When a metric deteriorates, it's unclear *who* should act, *what* they should do, and *by when*.
4. **Disconnected product & client metrics** — Product teams track feature adoption in isolation; client success teams track adherence metrics separately. No one connects "feature usage" to "outcome improvement."
5. **Audit & compliance friction** — Governance, lineage, and entitlements are afterthoughts, leading to "shadow BI" and compliance risk.
6. **Reactive, not proactive** — Teams reactively report on last month's performance instead of proactively preventing next month's deterioration.

**The core insight:** *Analytics without action is just reporting. Analytics without governance is just risk.*

---

## Why Now?

Three forces converge to make **impact-first, governed, multi-stakeholder analytics** a market imperative:

### 1. Star Ratings Pressure
CMS Star Ratings directly impact Medicare Advantage plan revenue (~5% bonuses for 4+ stars). Adherence metrics (PDC ≥80%) are **foundational** Star measures. Clients need **real-time visibility** into adherence trends and **proactive alerts** when cohorts slip below thresholds.

### 2. Value-Based Care Acceleration
Payers and pharmacy benefit managers (PBMs) are shifting from fee-for-service to outcomes-based contracts. **Demonstrable impact**—gap closure, adherence lift, PMPM cost reduction—is now a competitive differentiator. "We closed 12,000 gaps in Q3" is a winning sales message; "We have a lot of data" is not.

### 3. AI-Ready Infrastructure
Generative AI unlocks **natural language analytics** for non-technical users. But AI without **governed data, metric definitions, and lineage** produces hallucinations. The time is *now* to build the **governed foundation** that makes AI trustworthy.

---

## Our Solution: ACME Pharmacy Analytics

A **Sigma-class, impact-first analytics platform** designed for **multi-stakeholder workflows** across pharmacy products. Built on seven pillars:

### 1. Client-Facing Pharmacy Metrics Analytics
**For whom:** Client data analysts, clinical pharmacists, account managers
**What:** Real-time adherence (PDC, MPR), CMR/TMR completion, gap closure, Star Ratings contributors
**Impact:** Proactively identify at-risk cohorts, close gaps faster, lift Star Ratings, improve member health

### 2. Executive Monitoring of Data & Outcomes
**For whom:** Client executives, account leads, CSMs
**What:** Strategic KPI trends (Star proxy, cost-of-care signals, adherence trends), "what changed" digests
**Impact:** Exec teams get high-level health checks without drowning in operational details

### 3. Internal Operations Monitoring
**For whom:** Internal ops leads, data engineers, SREs
**What:** ETL SLAs, feed latency, schema drift, row count anomalies, incident tracking
**Impact:** Catch data quality issues *before* they propagate to client-facing dashboards

### 4. Product Metrics / OKRs / KPIs & Product Usage
**For whom:** Product managers, eng leads, growth teams
**What:** WAU/MAU, feature adoption, time-to-first-value, stickiness, query latency p95
**Impact:** Tie product improvements to client outcomes; prove "feature X → adherence lift"

### 5. Actionable Insights & Notifications
**For whom:** All personas (role-scoped)
**What:** Automated, rules-driven alerts with ownership, SLAs, playbooks, and deduplication
**Impact:** Convert "interesting trends" into "assigned actions with deadlines"

### 6. Impact-First Framing Across All Content
**For whom:** All users
**What:** Every metric answers "So what?" and "Now what?"
**Impact:** Users don't waste time interpreting; they act

### 7. AI Chat Agent on Governed Data (Read-Only)
**For whom:** Analysts, executives, product managers
**What:** Natural language Q&A grounded in metric definitions, lineage, and contracts
**Impact:** Democratize analytics without sacrificing governance or accuracy

---

## Definition of Impact

We define **impact** across three dimensions:

### 1. Member Health Outcomes
- **Adherence lift:** % of members reaching PDC ≥80% (Star threshold)
- **Gap closure:** Time from gap detection → gap resolution
- **Care completion:** CMR/TMR completion rates

### 2. Business Value
- **Star Ratings improvement:** Basis-point lift in Star measures tied to adherence
- **Cost-of-care signals:** PMPM Rx trend, generic substitution rate, avoidable ER visits
- **Client retention:** NPS, CSAT, contract renewals tied to "proven impact"

### 3. Operational Efficiency
- **Time-to-insight:** From data ingestion → actionable dashboard (SLA: <24 hours)
- **Alert-to-action cycle time:** From notification → triage → resolution
- **Data quality:** % of feeds meeting SLAs, schema drift incidents

**We measure ourselves by these impact metrics, not by "number of dashboards built."**

---

## The "Why ACME" Narrative

**ACME Pharmacy** is a fictional mid-sized pharmacy chain managing ~150,000 Medicare Advantage members across 12 payers. Their challenges:

- **Adherence slippage:** Q2 2025 saw a 4pp drop in diabetes adherence (PDC_90) due to supply chain disruptions and member churn.
- **Star Ratings risk:** Projected to fall from 4.0 to 3.5 stars if trends continue, costing ~$8M in CMS bonuses.
- **Operational opacity:** Claims feeds from 3 payers arrive with variable latency (6–72 hours); gaps in data go undetected until month-end reporting.
- **Siloed tools:** Finance uses Tableau, clinical uses Excel, account managers use PowerPoint. No single source of truth.
- **Manual triage:** When a payer calls about "low adherence for Plan XYZ," it takes 2–3 days to pull a cohort report.

**What ACME needs:**
1. **Unified analytics** that serve clinical, finance, ops, and executive teams
2. **Proactive alerts** when adherence drops, gaps spike, or feeds delay
3. **Governed data** they can trust for audits and payer reporting
4. **Actionable insights** with clear ownership: "Maria, triage this diabetes cohort by Friday"
5. **AI assistance** so non-technical execs can ask "Why did adherence drop?" and get grounded answers

**This demo *is* ACME's solution.**

---

## Success Vision (6 Months Post-Launch)

### For ACME's Clinical Team
- **Before:** Manually pull adherence reports weekly; react to payer complaints
- **After:** Proactive alerts when PDC drops ≥3pp; playbook-driven outreach; adherence recovers within 2 weeks

### For ACME's Executives
- **Before:** Monthly PowerPoint decks with stale data; unclear "what changed"
- **After:** Daily exec digest with trend health; click into details when needed; confident in Star trajectory

### For ACME's Ops Team
- **Before:** Discover feed delays during month-end close; scramble to backfill
- **After:** Real-time SLA tracking; alerts when lag >12 hours; maintain <24h ingestion SLA

### For Outcomes' Product Team
- **Before:** Ship features, hope they drive adherence; no proof
- **After:** Measure feature adoption → adherence lift correlation; prioritize high-impact features

### For Compliance
- **Before:** Ad-hoc lineage documentation; manual audit trail reconstruction
- **After:** Automated lineage; audit log for all metric queries; HIPAA-ready posture

---

## Guiding Principles

1. **Impact over volume** — One actionable insight beats 100 passive charts
2. **Governance as foundation** — Metric definitions, lineage, and entitlements are non-negotiable
3. **Multi-stakeholder design** — No "one-size-fits-all" dashboard; persona-specific workflows
4. **Proactive, not reactive** — Alerts fire *before* problems cascade
5. **AI-augmented, human-led** — AI assists; humans decide and act
6. **Demo-safe rigor** — Treat this demo as production; no shortcuts on security, quality, or UX

---

## The Bet

**If we build a governed, impact-first, multi-stakeholder analytics platform...**
- **Clients** will renew and expand because we prove outcomes, not activity
- **Sales** will close faster because demos show "your problem, solved"
- **Product** will prioritize effectively because usage ties to impact
- **Compliance** will trust us because governance is baked in, not bolted on

**This is not a prototype. This is a reference architecture for how Outcomes does analytics.**

---

## Inspiration & Differentiation

**We take inspiration from:**
- **Sigma Computing:** Collaborative, governed, spreadsheet-like UX
- **Looker:** Metric layer, version-controlled definitions
- **Tableau:** Visual drill-downs and interactive exploration
- **ThoughtSpot:** AI-powered search over governed data
- **dbt:** Data contracts, lineage, tests as code

**We differentiate by:**
- **Pharmacy-specific metric library** (PDC, MPR, CMR, Star Ratings, gaps)
- **Impact-first UX** (every chart answers "so what / now what")
- **Built-in playbooks** (insights → actions, not just alerts)
- **Multi-stakeholder by design** (not "build for analysts, hope execs use it")

---

## Vision Validation

**Who validates this vision?**
- **Client success team:** Does this solve ACME's real pain points?
- **Product leadership:** Does this align with our 2025 roadmap?
- **Sales engineering:** Can we demo this to close deals?
- **Engineering:** Is this architecturally sound and maintainable?
- **Compliance:** Does this meet our governance and security bar?

**All five must say "yes" before we proceed to build.**

---

**Next:** [Scope →](scope.md)
