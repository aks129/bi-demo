# Non-Goals

**Last Updated:** 2025-10-19

---

## Purpose

This document explicitly defines **what we will NOT do** in the ACME Pharmacy Analytics demo—both for MVP and in future versions. Clear non-goals prevent scope creep, align stakeholder expectations, and focus resources on high-impact work.

Non-goals fall into three categories:
1. **Never** — Features we will never build
2. **Not Now** — Features deferred indefinitely (may revisit in 12+ months)
3. **Not MVP** — Features deferred to v2.0+ (see [scope.md](scope.md))

---

## 1. Never (Explicit Exclusions)

### 1.1 Real Patient Data
- ❌ **No real PHI/PII** — Demo uses **100% synthetic data** (Faker-generated names, DOBs, addresses, member IDs)
- ❌ **No anonymized production data** — Even de-identified client data introduces compliance risk and is unnecessary for demo purposes
- ❌ **No real payer integrations** — No live claims feeds, eligibility checks, or formulary lookups

**Rationale:** HIPAA compliance, legal risk, and speed. Synthetic data lets us iterate freely without BAAs, IRB reviews, or legal sign-offs.

---

### 1.2 Write Operations in AI Agent
- ❌ **No AI-generated data mutations** — AI agent is **read-only**; it cannot:
  - Write SQL `UPDATE`, `DELETE`, or `INSERT` statements
  - Modify metric definitions
  - Create or edit dashboards
  - Change user permissions or RLS rules
  - Execute destructive operations

**Rationale:** Safety and governance. AI hallucinations could corrupt data or violate entitlements. Humans own all write operations.

---

### 1.3 Clinical Decision Support / Treatment Recommendations
- ❌ **No drug-drug interaction checks** — We are not a clinical tool
- ❌ **No medication recommendations** — We do not suggest "switch from Drug A to Drug B"
- ❌ **No diagnosis support** — We do not interpret lab values or clinical notes
- ❌ **No prior authorization automation** — We track metrics; we do not submit PA requests

**Rationale:** Regulatory risk. Clinical decision support requires FDA oversight, EHR integration, and clinical validation. This is a **business intelligence demo**, not a clinical application.

---

### 1.4 Financial Transactions
- ❌ **No payment processing** — We do not bill clients, adjudicate claims, or process refunds
- ❌ **No formulary pricing** — We may show demo-safe "average paid amount" trends, but no real pricing
- ❌ **No rebate calculations** — We do not model manufacturer rebates or PBM spreads

**Rationale:** Out of scope for analytics demo. Financial systems require auditing, reconciliation, and regulatory compliance beyond BI.

---

### 1.5 Member-Facing Features
- ❌ **No member portal** — Members do not log in to this system
- ❌ **No member outreach campaigns** — We do not send texts, emails, or calls to members
- ❌ **No appointment scheduling** — We track CMR completion; we do not book appointments

**Rationale:** This is a **B2B analytics platform** for ACME Pharmacy staff and Outcomes internal teams, not a B2C member engagement app.

---

### 1.6 Real-Time Prescription Monitoring
- ❌ **No e-prescribing integration** — We do not connect to Surescripts or send Rx to pharmacies
- ❌ **No POS (point-of-sale) adjudication** — We do not process claims at the pharmacy counter
- ❌ **No controlled substance monitoring (PDMP)** — We are not a state prescription drug monitoring program

**Rationale:** These are operational pharmacy systems, not analytics.

---

## 2. Not Now (Deferred Indefinitely)

### 2.1 Predictive Clinical Outcomes Models
- ⏸️ **No hospitalization risk scores** — (e.g., "Member X has 80% chance of ER visit in 30 days")
- ⏸️ **No disease progression models** — (e.g., "HbA1c will reach 9.0 in 6 months")
- ⏸️ **No medication persistence forecasting** — (e.g., "50% will discontinue statin in 90 days")

**Rationale:** Requires extensive clinical validation, ML ops infrastructure, and regulatory review. Current scope is **descriptive + diagnostic analytics** (what happened, why it happened), not **predictive analytics** (what will happen).

**Revisit If:** Product strategy pivots to ML-first differentiation; data science team is resourced; clinical advisory board validates models.

---

### 2.2 Social Determinants of Health (SDOH) Integration
- ⏸️ **No SDOH data ingestion** — (e.g., food insecurity, housing instability, transportation barriers)
- ⏸️ **No SDOH-stratified analytics** — (e.g., adherence by ZIP code median income)

**Rationale:** SDOH data is sparse, inconsistent, and requires partnerships (e.g., with community orgs). Not feasible for demo scale.

**Revisit If:** CMS mandates SDOH reporting for Star Ratings; industry-standard SDOH datasets emerge.

---

### 2.3 Natural Language Generation (NLG) for Automated Reporting
- ⏸️ **No auto-written monthly reports** — (e.g., AI drafts 10-page executive summary)
- ⏸️ **No narrative generation from dashboards** — (e.g., "Adherence improved due to increased CMR outreach")

**Rationale:** NLG requires training on domain-specific writing styles and validation for accuracy. Current AI agent focuses on Q&A, not content generation.

**Revisit If:** Stakeholders demand automated reporting; LLMs improve factual accuracy; governance process for AI-written content is established.

---

### 2.4 Multi-Language Support
- ⏸️ **English only** for MVP and v2.0
- ⏸️ **No Spanish, Mandarin, or other language localization**

**Rationale:** Adds translation overhead (UI, metric definitions, playbooks). ACME Pharmacy is US-based; English suffices for demo.

**Revisit If:** International expansion or multilingual client requirements emerge.

---

### 2.5 Mobile-First UX
- ⏸️ **No native mobile app** (iOS/Android)
- ⏸️ **No mobile-optimized dashboards** — Responsive web is acceptable; not optimized for phone screens

**Rationale:** Primary users (analysts, execs, ops) work on desktops. Mobile adds design and testing complexity.

**Revisit If:** Field-based users (e.g., pharmacy techs) require mobile access.

---

## 3. Not MVP (Deferred to v2.0+)

See [scope.md](scope.md) for full list. Key highlights:

### 3.1 User-Configurable Alerts
- 🔜 **v2.0:** No-code rule builder for custom thresholds, cohorts, and notification logic
- **MVP:** 5–7 pre-configured rules only

---

### 3.2 Slack/Email Alert Delivery
- 🔜 **v2.0:** Push notifications to Slack channels or email inboxes
- **MVP:** In-app notification inbox only

---

### 3.3 A/B Testing Framework
- 🔜 **v2.0:** Test feature variants (e.g., "Does chart type X improve engagement?")
- **MVP:** Single UX variant; no experimentation

---

### 3.4 Peer Benchmarking
- 🔜 **v2.0:** Compare ACME Pharmacy metrics to "industry average" or "top quartile"
- **MVP:** ACME-only metrics (no external benchmarks)

---

### 3.5 Auto-Remediation for Pipeline Issues
- 🔜 **v2.0:** Automatic retry logic, backfill triggers, schema drift auto-correction
- **MVP:** Alerts only; manual remediation

---

### 3.6 Multi-Turn AI Conversations
- 🔜 **v2.0:** AI agent remembers context across questions ("What about last quarter?" after asking "What was adherence this quarter?")
- **MVP:** Stateless, single-turn Q&A

---

## 4. Boundaries by Persona

### Client Data Analyst
- ✅ **Can:** Run queries, drill into cohorts, export CSVs, bookmark dashboards
- ❌ **Cannot:** Modify metric definitions, create new dashboards, change RLS rules, write SQL directly

### Client Executive
- ✅ **Can:** View high-level KPIs, read exec digests, drill into trends
- ❌ **Cannot:** Access raw data, see other clients' data, configure alerts, export PHI

### Internal Ops Lead
- ✅ **Can:** Monitor pipeline health, triage incidents, view audit logs
- ❌ **Cannot:** Access client-specific adherence data (RLS-restricted), modify ETL jobs from BI tool

### Product Manager
- ✅ **Can:** Track feature adoption, measure retention, correlate usage to outcomes
- ❌ **Cannot:** See client-specific PII, write queries that modify product telemetry data

### Compliance Analyst
- ✅ **Can:** Audit metric definitions, verify lineage, check RLS entitlements, export audit trail
- ❌ **Cannot:** Modify production data, grant permissions outside policy, disable audit logging

---

## 5. Anti-Patterns We Avoid

### 5.1 "Boil the Ocean" Analytics
- ❌ Dashboards with 50+ metrics and no narrative
- ❌ "Let users slice by any dimension" without guidance
- ✅ **Instead:** Curate 4–6 KPIs per dashboard; provide "So what / now what" for each

### 5.2 "Build It and They Will Come"
- ❌ Launch dashboards with no training, playbooks, or adoption plan
- ✅ **Instead:** Pair every dashboard with demo script, acceptance tests, and user onboarding checklist

### 5.3 "Just SQL It"
- ❌ Expect users to write raw SQL for every question
- ✅ **Instead:** Pre-built metrics, semantic layer, AI-assisted Q&A

### 5.4 "Shadow BI" Escape Hatches
- ❌ Users export to Excel, create ungoverned pivot tables, email around
- ✅ **Instead:** Make BI tool so good (fast, accurate, governed) that Excel exports are rare

### 5.5 "Alert Spam"
- ❌ Fire 100 alerts/day with no deduplication, prioritization, or ownership
- ✅ **Instead:** 5–7 high-signal rules, deduped, with SLAs and playbooks

---

## 6. Technology Non-Goals

### 6.1 Custom-Built BI Engine
- ❌ **No building our own charting library, query engine, or visualization framework**
- ✅ **Use Sigma, Looker, Tableau, or equivalent** — Leverage best-in-class BI tools

**Rationale:** Building BI from scratch is a multi-year, multi-million-dollar effort. This is a demo, not a product pivot.

---

### 6.2 On-Premise Deployment
- ❌ **No on-prem data centers** — Cloud-native only (AWS, GCP, Azure)

**Rationale:** Demo requires rapid iteration and scalability. On-prem adds infrastructure overhead.

---

### 6.3 Multi-Cloud Portability
- ❌ **No "runs on AWS, GCP, and Azure with zero code changes"**
- ✅ **Pick one cloud** for MVP (recommend: Snowflake on AWS or GCP)

**Rationale:** Multi-cloud adds abstraction complexity. Optimize for one platform.

---

### 6.4 Real-Time Sub-Second Latency
- ❌ **No streaming dashboards with <1s refresh** (e.g., live claims feed)
- ✅ **Near-real-time is acceptable:** 5–15 minute refresh for most dashboards; hourly for exec summaries

**Rationale:** Real-time requires Kafka, Flink, or equivalent streaming stack. Overkill for pharmacy metrics (claims batch daily).

---

## 7. Governance & Compliance Non-Goals

### 7.1 SOC 2 Type II Certification (for Demo)
- ❌ **No formal SOC 2 audit for demo environment**
- ✅ **Document security posture** in [security_privacy.md](security_privacy.md); follow SOC 2 principles informally

**Rationale:** SOC 2 is for production SaaS offerings, not internal demos. If demo transitions to production, then pursue certification.

---

### 7.2 HITRUST Certification
- ❌ **No HITRUST CSF certification for demo**
- ✅ **HIPAA-conscious design** (synthetic data, RLS, audit trail)

**Rationale:** HITRUST is expensive and time-intensive. Overkill for synthetic-data demo.

---

### 7.3 EU GDPR Compliance
- ❌ **No GDPR features** (right to erasure, data portability, consent management)
- ✅ **US-focused demo** (Medicare Advantage, CMS Star Ratings)

**Rationale:** ACME Pharmacy is US-based; EU not in scope.

---

## 8. Support & Operations Non-Goals

### 8.1 24/7 On-Call Support
- ❌ **No round-the-clock incident response for demo**
- ✅ **Business hours support** (9 AM – 5 PM ET, M–F)

**Rationale:** Demo is for internal showcasing, not production SLA commitments.

---

### 8.2 Multi-Tenant Production SaaS
- ❌ **No "every client gets their own isolated instance" architecture**
- ✅ **Single demo tenant (ACME Pharmacy)** with RLS simulation for multi-org scenarios

**Rationale:** Multi-tenancy adds database partitioning, billing, provisioning complexity. MVP is single-tenant demo.

---

### 8.3 Disaster Recovery (DR) / High Availability (HA)
- ❌ **No cross-region failover, backup data centers, or 99.99% uptime SLA**
- ✅ **Standard cloud backups** (daily snapshots); acceptable downtime for demo

**Rationale:** Demo environment; HA/DR is production concern.

---

## 9. Sales & Marketing Non-Goals

### 9.1 White-Label / Rebrand for Prospects
- ❌ **No "swap ACME logo for Prospect X logo" in real-time during demo**
- ✅ **ACME Pharmacy branding is fixed** — Use narrative to map ACME's challenges to prospect's challenges

**Rationale:** White-labeling adds configuration overhead. Strong demo narrative is more persuasive than cosmetic rebranding.

---

### 9.2 Self-Service Prospect Trials
- ❌ **No "sign up and explore on your own" free trial**
- ✅ **Guided demos only** — Sales or CSM walks prospects through

**Rationale:** Unguided exploration risks confusion or misinterpretation. Demos are storytelling, not self-serve browsing.

---

## 10. Decision Rationale Summary

| Non-Goal                                  | Why Not?                                                                 | Could Change If...                          |
|-------------------------------------------|--------------------------------------------------------------------------|---------------------------------------------|
| Real patient data                         | HIPAA risk, compliance overhead, unnecessary for demo                    | (Never)                                     |
| AI write operations                       | Safety, governance, hallucination risk                                   | (Never for demo; maybe v3.0+ with guardrails) |
| Clinical decision support                 | FDA/regulatory scope, liability, not a BI use case                       | Product pivots to clinical tools            |
| Predictive ML models                      | Requires validation, ML ops, out of MVP scope                            | Data science team resourced; strategy shift |
| Multi-language support                    | Translation overhead, US-focused demo                                    | International clients require it            |
| Mobile-first UX                           | Desktop is primary use case; mobile adds complexity                      | Field users need mobile access              |
| Custom BI engine                          | Multi-year effort; leverage best-in-class tools                          | (Never — use Sigma/Looker/Tableau)          |
| SOC 2 / HITRUST for demo                  | Expensive, time-intensive, overkill for synthetic-data demo              | Demo → production transition                |
| White-label rebranding                    | Config overhead; strong narrative > cosmetic changes                     | Prospects demand it contractually           |

---

## 11. How to Use This Document

### For Product Managers
- Reference when scoping new features: "Is this a non-goal? If yes, why are we considering it?"
- Use in stakeholder conversations: "We explicitly decided not to do X because..."

### For Engineers
- Avoid over-engineering: "We don't need HA/DR for demo; standard backups suffice"
- Push back on scope creep: "Real-time sub-second latency is a non-goal per spec"

### For Sales & CSM
- Set prospect expectations: "This demo uses synthetic data; we do not expose real PHI"
- Clarify boundaries: "Our analytics platform tracks adherence; we do not prescribe medications"

### For Compliance
- Document risk acceptance: "We chose not to pursue SOC 2 for demo because..."
- Revisit decisions if demo transitions to production

---

## 12. Annual Review Process

**When:** Annually (Q4) or when major strategy shifts occur
**Who:** Product leadership, engineering leads, compliance, sales
**Questions:**
1. Are any non-goals now strategic priorities? (e.g., predictive ML, multi-language)
2. Are any "never" items becoming "not now" or "v2.0"?
3. Do new regulations (e.g., CMS mandates) change our stance? (e.g., SDOH reporting)

**Output:** Updated non_goals.md with decision rationale and version history

---

**Related:**
- [Scope](scope.md) — What IS in scope
- [Vision](vision.md) — Why we're building this
- [Risks & Mitigations](risks_and_mitigations.md) — What could go wrong
