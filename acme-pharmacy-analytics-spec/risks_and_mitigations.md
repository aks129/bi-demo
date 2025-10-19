# Risks & Mitigations

**Last Updated:** 2025-10-19

---

## Purpose

This document identifies **risks** that could derail the ACME Pharmacy Analytics demo and defines **mitigations** to prevent or minimize impact. Risks are categorized by:
- **Data Quality & Integrity**
- **Security & Privacy (PHI/PII)**
- **Performance & Reliability**
- **User Adoption & Experience**
- **AI/LLM-Specific Risks**
- **Operational & Process Risks**

Each risk includes:
- **Description** — What could go wrong?
- **Impact** — Consequence if it occurs (High/Medium/Low)
- **Likelihood** — Probability of occurrence (High/Medium/Low)
- **Mitigation** — Preventive measures
- **Contingency** — Response if mitigation fails

---

## Risk Matrix Overview

| Risk ID | Risk                                      | Impact | Likelihood | Mitigation Priority |
|---------|-------------------------------------------|--------|------------|---------------------|
| DQ-01   | Synthetic data unrealistic                | High   | Medium     | 🔴 Critical          |
| DQ-02   | Data refresh failures                     | High   | Medium     | 🔴 Critical          |
| DQ-03   | Schema drift undetected                   | Medium | Medium     | 🟡 High              |
| DQ-04   | Metric definitions inconsistent           | High   | Low        | 🟡 High              |
| SP-01   | Real PHI/PII accidentally included        | High   | Low        | 🔴 Critical          |
| SP-02   | RLS misconfiguration exposes data         | High   | Medium     | 🔴 Critical          |
| SP-03   | Audit trail gaps                          | Medium | Low        | 🟡 High              |
| PR-01   | Dashboard query latency >5s               | Medium | Medium     | 🟡 High              |
| PR-02   | Demo environment downtime during showcase | High   | Low        | 🔴 Critical          |
| UA-01   | Personas misaligned with real users       | High   | Medium     | 🟡 High              |
| UA-02   | Alert fatigue (too many notifications)    | Medium | High       | 🟡 High              |
| UA-03   | Dashboards too complex (cognitive overload)| Medium | Medium     | 🟡 High              |
| AI-01   | AI hallucinations (incorrect responses)   | High   | Medium     | 🔴 Critical          |
| AI-02   | AI exposes sensitive query patterns       | Medium | Low        | 🟡 High              |
| AI-03   | Users over-rely on AI without validation  | Medium | Medium     | 🟡 High              |
| OP-01   | Scope creep delays MVP                    | High   | High       | 🔴 Critical          |
| OP-02   | Stakeholder misalignment                  | High   | Medium     | 🔴 Critical          |
| OP-03   | Key personnel turnover                    | Medium | Low        | 🟢 Medium            |

---

## 1. Data Quality & Integrity Risks

### DQ-01: Synthetic Data Unrealistic

**Description:**
Generated synthetic data (members, claims, adherence) does not reflect realistic patterns (e.g., all members have perfect 100% adherence, no seasonal variation, no outliers).

**Impact:** 🔴 High
- Demos feel fake or "toy example"
- Prospects question credibility
- Insights (e.g., alerts) don't fire because no anomalies exist

**Likelihood:** 🟡 Medium
- Faker libraries generate plausible PII but not realistic clinical patterns

**Mitigation:**
1. **Use domain-informed data generation:**
   - Model realistic adherence distributions (normal ~80% PDC, with 10–15% variance)
   - Introduce seasonal patterns (e.g., December adherence dip due to holidays)
   - Create controlled outliers (1–2 plans with sudden PDC drops for demo scenarios)
2. **Validate against real-world benchmarks:**
   - Compare synthetic data distributions to published CMS Star Ratings data
   - Review with pharmacy SMEs (e.g., "Does this cohort behavior make sense?")
3. **Document data generation logic:**
   - Include rationale in [sample_datasets.md](data_contracts/sample_datasets.md)

**Contingency:**
- If feedback reveals unrealistic patterns, regenerate datasets before external demos
- Maintain versioned seed scripts for quick iteration

**Owner:** Data Engineering + Product

---

### DQ-02: Data Refresh Failures

**Description:**
Scheduled ETL/ELT jobs fail overnight, leaving dashboards with stale data during a live demo.

**Impact:** 🔴 High
- Dashboards show yesterday's (or older) data, breaking demo narrative
- "What changed this week" digest is empty or incorrect
- Erodes trust in platform reliability

**Likelihood:** 🟡 Medium
- Cloud warehouse hiccups, schema changes, or job dependency failures

**Mitigation:**
1. **Implement robust orchestration:**
   - Use Airflow, dbt Cloud, or Prefect with retry logic
   - Set up dependency checks (upstream job success → downstream triggers)
2. **Real-time monitoring:**
   - Slack/email alerts when jobs fail
   - Ops dashboard tracks SLA compliance (see [Internal Ops dashboard](ux/wireframes.md))
3. **Pre-demo data validation:**
   - Automated checks: "Latest data timestamp < 24 hours old?"
   - Manual pre-flight check 2 hours before demo
4. **Keep demo environment stable:**
   - Avoid schema changes or new deployments 48 hours before external demos

**Contingency:**
- If data is stale during demo, pivot to "historical scenario" narrative ("Let's look at Q3 trends...")
- Maintain a known-good data snapshot for emergency rollback

**Owner:** Data Engineering + Internal Ops

---

### DQ-03: Schema Drift Undetected

**Description:**
Upstream source tables change schema (new columns, renamed fields, type changes) without notification, breaking downstream transformations.

**Impact:** 🟡 Medium
- Metrics fail to calculate (e.g., `adherence.pdc_90` returns null)
- Dashboards show errors or empty charts
- Incident discovery during demo (worst case)

**Likelihood:** 🟡 Medium
- Common in early-stage data pipelines; less likely with mature contracts

**Mitigation:**
1. **Schema validation in ETL:**
   - dbt tests: `not_null`, `accepted_values`, `relationships`
   - Great Expectations for schema enforcement
2. **Schema drift detection:**
   - Log expected vs. actual columns on each load
   - Alert when schema changes detected
3. **Data contracts:**
   - Formalize contracts with "upstream teams" (even if synthetic, document expected structure)
   - Version schemas in [schemas.md](data_contracts/schemas.md)

**Contingency:**
- Ops team triages schema drift alerts within 4 hours
- Rollback to last known-good schema if breaking change

**Owner:** Data Engineering

---

### DQ-04: Metric Definitions Inconsistent

**Description:**
The same metric (e.g., "PDC_90") is calculated differently across dashboards or by different teams, leading to conflicting numbers.

**Impact:** 🔴 High
- Users lose trust: "Why does Client Analytics show 78% PDC but Exec Overview shows 81%?"
- Sales demos derailed by questions about data accuracy

**Likelihood:** 🟢 Low (if metric catalog is enforced)

**Mitigation:**
1. **Single source of truth:**
   - All metrics defined in dbt metrics or semantic layer
   - Dashboards query from shared `fact_` tables, not raw data
2. **Metric catalog:**
   - Document business logic + SQL in [metrics_catalog.md](data_contracts/metrics_catalog.md)
   - Version control metric definitions
3. **Automated consistency tests:**
   - dbt tests: "Sum of cohort PDCs = overall PDC (weighted avg)"
   - Monthly audits: compare metric values across dashboards

**Contingency:**
- If inconsistency discovered, immediately flag in spec and dashboards
- Hotfix metric calculation and re-validate

**Owner:** Product + Data Engineering

---

## 2. Security & Privacy (PHI/PII) Risks

### SP-01: Real PHI/PII Accidentally Included

**Description:**
Despite using synthetic data, a developer accidentally seeds real patient names, DOBs, or SSNs (e.g., copy-paste from production for "testing").

**Impact:** 🔴 High
- HIPAA violation (even in demo environment)
- Legal, reputational, and compliance risk
- Demo must be shut down immediately

**Likelihood:** 🟢 Low (if process enforced)

**Mitigation:**
1. **Strict "no real data" policy:**
   - All data generation via Faker or synthetic scripts
   - Zero production data access for demo team
2. **Automated PII/PHI scanning:**
   - Run regex scans for SSN patterns, real email domains, known names
   - Pre-commit hooks block commits with suspicious patterns
3. **Code review:**
   - All data seed scripts reviewed by ≥2 people
   - Compliance sign-off on data generation approach
4. **Environment isolation:**
   - Demo environment has no network access to production databases

**Contingency:**
- If real PHI detected: immediately purge data, regenerate, notify compliance
- Post-incident review and process update

**Owner:** Compliance + Data Engineering

---

### SP-02: RLS Misconfiguration Exposes Data

**Description:**
Row-level security rules fail, allowing users to see data outside their entitlements (e.g., Client X analyst sees Client Y data).

**Impact:** 🔴 High
- Data breach (even if synthetic)
- Loss of client trust
- Demo credibility destroyed

**Likelihood:** 🟡 Medium
- RLS logic errors, role misassignments, or BI tool bugs

**Mitigation:**
1. **Explicit RLS strategy:**
   - Document rules in [rbac.md](requirements/rbac.md)
   - Test matrix: each role × each dashboard × expected data scope
2. **Automated RLS testing:**
   - Test user accounts for each role
   - Assert: "CLIENT_VIEWER for ACME sees only `client_id = 'ACME'` rows"
3. **Audit trail:**
   - Log all queries with user, role, filters applied
   - Monthly audits: "Did any user query outside their entitlements?"
4. **Least privilege:**
   - Users get minimum required access; no blanket "ADMIN" roles

**Contingency:**
- If misconfiguration found: immediately revoke access, audit exposure, fix RLS rules
- Post-incident: re-test all roles before resuming demos

**Owner:** Security + Data Engineering

---

### SP-03: Audit Trail Gaps

**Description:**
Audit logging is incomplete (e.g., some queries not logged, user actions missing).

**Impact:** 🟡 Medium
- Cannot prove compliance if audited
- Incident investigations incomplete

**Likelihood:** 🟢 Low (if warehouse has built-in query history)

**Mitigation:**
1. **Leverage warehouse audit features:**
   - Snowflake Query History, BigQuery Audit Logs, Databricks Audit Logs
2. **Supplement with custom logging:**
   - Log AI agent queries, alert triages, dashboard views
3. **Audit log retention:**
   - Retain logs for ≥90 days (configurable to 1 year for compliance)
4. **Monthly audit log reviews:**
   - Compliance team samples logs to verify completeness

**Contingency:**
- If gaps found, implement additional logging before external demos

**Owner:** Compliance + Data Engineering

---

## 3. Performance & Reliability Risks

### PR-01: Dashboard Query Latency >5s

**Description:**
Dashboards take >5 seconds to load, frustrating users and derailing demos.

**Impact:** 🟡 Medium
- Poor user experience
- Demo pacing disrupted ("Let's wait for this to load...")
- Users abandon platform

**Likelihood:** 🟡 Medium
- Unoptimized queries, large aggregations, or warehouse under-provisioned

**Mitigation:**
1. **Query optimization:**
   - Pre-aggregate common metrics (e.g., daily PDC rollups)
   - Use materialized views or dbt incremental models
2. **Warehouse sizing:**
   - Right-size compute for demo load (e.g., Snowflake Medium warehouse)
   - Auto-suspend when idle to save costs
3. **Caching:**
   - BI tool caching for repeated queries
   - TTL: 15 minutes for most dashboards, 1 hour for exec summaries
4. **Load testing:**
   - Simulate 50 concurrent users; measure p95 latency
   - Target: p95 <3 seconds

**Contingency:**
- If slow during demo, preload dashboards in browser tabs before presenting
- Fallback: use static screenshots if live queries fail

**Owner:** Data Engineering + Product

---

### PR-02: Demo Environment Downtime During Showcase

**Description:**
Demo environment crashes or becomes unavailable during a live prospect demo.

**Impact:** 🔴 High
- Demo failure; prospect loses confidence
- Sales opportunity lost

**Likelihood:** 🟢 Low (if stable environment)

**Mitigation:**
1. **Pre-demo health checks:**
   - 2 hours before demo: validate all dashboards load, AI agent responds, no errors
2. **Monitoring:**
   - Uptime alerts (PagerDuty, Datadog, or CloudWatch)
   - Ops team on-call during external demos
3. **Avoid changes near demos:**
   - No deployments 48 hours before external showcases
   - Code freeze for demo environment
4. **Backup plan:**
   - Record a full demo video as fallback
   - Maintain static PDF exports of key dashboards

**Contingency:**
- If downtime occurs mid-demo: switch to recorded video or PDF deck
- Reschedule demo and offer extended Q&A session

**Owner:** Engineering + Sales

---

## 4. User Adoption & Experience Risks

### UA-01: Personas Misaligned with Real Users

**Description:**
Defined personas (Client Data Analyst, Exec, etc.) don't match actual user needs or workflows.

**Impact:** 🔴 High
- Dashboards built for wrong use cases
- Low adoption; users revert to Excel
- Wasted engineering effort

**Likelihood:** 🟡 Medium
- Personas based on assumptions, not validated with real users

**Mitigation:**
1. **User research:**
   - Interview 3–5 real users per persona before finalizing spec
   - Validate pain points, goals, workflows
2. **Stakeholder review:**
   - Client success team reviews personas: "Do these reflect our clients?"
3. **Iterative validation:**
   - After wireframes, conduct usability walkthroughs with persona proxies
4. **Feedback loops:**
   - Post-demo surveys ask: "Did this meet your needs?"

**Contingency:**
- If misalignment discovered, revise personas and re-prioritize dashboards

**Owner:** Product + Client Success

---

### UA-02: Alert Fatigue (Too Many Notifications)

**Description:**
Notification rules fire too frequently, overwhelming users with low-signal alerts.

**Impact:** 🟡 Medium
- Users ignore all alerts (including critical ones)
- Platform perceived as "noisy"

**Likelihood:** 🔴 High
- Common issue with first-gen alerting systems

**Mitigation:**
1. **Curated rules:**
   - Start with 5–7 high-signal rules only (see [rules_engine.md](insights/rules_engine.md))
   - Avoid "alert on every 1% change" rules
2. **Deduplication & cooldown:**
   - Max 1 alert per entity per 48 hours
   - Group related alerts (e.g., "3 plans with adherence drop" → 1 summary alert)
3. **Severity tiers:**
   - Critical (immediate action), High (same-day triage), Medium (weekly review)
   - Users can filter by severity
4. **User feedback:**
   - "Mark as noise" button; track % of alerts dismissed
   - If >10% dismissed, re-tune rule thresholds

**Contingency:**
- If alert fatigue detected, pause low-priority rules and re-calibrate

**Owner:** Product + Internal Ops

---

### UA-03: Dashboards Too Complex (Cognitive Overload)

**Description:**
Dashboards cram 20+ metrics onto one screen, overwhelming users.

**Impact:** 🟡 Medium
- Users can't find key insights
- Decision paralysis
- Low engagement

**Likelihood:** 🟡 Medium
- "More charts = better" anti-pattern

**Mitigation:**
1. **Curated KPI ribbons:**
   - 4–6 top metrics per dashboard
   - Progressive disclosure: summary → drill-down
2. **"So what / now what" guidance:**
   - Narrative text blocks guide users through insights
3. **Persona-specific views:**
   - Exec dashboard ≠ Analyst dashboard
   - Tailor complexity to user needs
4. **Usability testing:**
   - Observe users navigating dashboards; identify confusion points

**Contingency:**
- If complexity feedback received, simplify dashboards and add tooltips

**Owner:** Product + UX

---

## 5. AI/LLM-Specific Risks

### AI-01: AI Hallucinations (Incorrect Responses)

**Description:**
AI agent generates plausible but factually incorrect answers (e.g., wrong PDC calculation, invented metric definitions).

**Impact:** 🔴 High
- Users make decisions based on false information
- Loss of trust in platform
- Potential compliance issues

**Likelihood:** 🟡 Medium
- LLMs prone to hallucination without strict grounding

**Mitigation:**
1. **Grounding in source documents:**
   - AI retrieves metric definitions from [metrics_catalog.md](data_contracts/metrics_catalog.md)
   - Responses cite sources (e.g., "According to the metrics catalog, PDC_90 is...")
2. **Guardrails:**
   - Reject queries outside scope (e.g., "Write SQL to update data")
   - Respond with "I don't know" instead of guessing
3. **Human review:**
   - Critical queries (e.g., exec-facing) reviewed by analyst before sharing
4. **User feedback loop:**
   - "Was this answer helpful?" thumbs up/down
   - Track incorrect responses; retrain prompts

**Contingency:**
- If hallucination detected, flag response and notify user
- Add disclaimer: "AI responses should be validated with metric catalog"

**Owner:** Product + AI/ML Team

---

### AI-02: AI Exposes Sensitive Query Patterns

**Description:**
AI logs or responses reveal sensitive query patterns (e.g., "User X frequently queries Plan Y adherence" leaks strategic info).

**Impact:** 🟡 Medium
- Privacy concern
- Competitive intelligence leakage

**Likelihood:** 🟢 Low

**Mitigation:**
1. **Query log redaction:**
   - Anonymize user IDs in AI logs
   - Aggregate patterns, don't expose individual queries
2. **RLS enforcement:**
   - AI respects same RLS rules as BI dashboards
3. **Audit:**
   - Monthly review of AI logs for sensitive exposure

**Contingency:**
- If exposure found, purge logs and tighten redaction rules

**Owner:** Security + AI/ML Team

---

### AI-03: Users Over-Rely on AI Without Validation

**Description:**
Users treat AI responses as gospel, skipping validation against source data or metric definitions.

**Impact:** 🟡 Medium
- Decisions based on unverified AI output
- Risk of compounding errors

**Likelihood:** 🟡 Medium

**Mitigation:**
1. **Explicit disclaimers:**
   - "AI responses are suggestive; validate critical decisions with source data"
2. **Provenance citations:**
   - Every response links to metric catalog, lineage doc, or SQL query
3. **Training:**
   - Onboarding materials emphasize "AI-assisted, not AI-automated" decision-making

**Contingency:**
- If over-reliance detected, add friction (e.g., "Click to confirm you've validated this response")

**Owner:** Product + Compliance

---

## 6. Operational & Process Risks

### OP-01: Scope Creep Delays MVP

**Description:**
Stakeholders request "just one more feature," repeatedly expanding scope beyond MVP.

**Impact:** 🔴 High
- MVP delayed; demo never launches
- Team burnout
- Missed sales opportunities

**Likelihood:** 🔴 High
- Common in high-visibility projects

**Mitigation:**
1. **Strict MVP scope:**
   - [scope.md](scope.md) defines MVP vs. v2.0
   - Product owner enforces scope boundaries
2. **Feature backlog:**
   - Log all requests in "Future" backlog
   - Commit to post-MVP review, not immediate build
3. **Stakeholder alignment:**
   - Weekly syncs with clear "in/out of scope" decisions
4. **Time-boxing:**
   - Hard deadline: "MVP spec complete by 2025-10-19"

**Contingency:**
- If scope creep detected, escalate to leadership for priority call

**Owner:** Product Leadership

---

### OP-02: Stakeholder Misalignment

**Description:**
Product, Engineering, Sales, and Compliance have conflicting priorities or expectations.

**Impact:** 🔴 High
- Rework cycles, delays
- Demos fail to meet sales needs or compliance bar

**Likelihood:** 🟡 Medium

**Mitigation:**
1. **Spec review gates:**
   - All 5 stakeholder groups approve spec before build (see [success_criteria.md](success_criteria.md))
2. **Weekly stakeholder syncs:**
   - Surface conflicts early; resolve via product owner
3. **Written decision log:**
   - Document key decisions (e.g., "Defer predictive ML to v2") in [scope.md](scope.md)

**Contingency:**
- If misalignment blocks progress, escalate to exec sponsor for decision

**Owner:** Product Leadership

---

### OP-03: Key Personnel Turnover

**Description:**
Product owner, lead engineer, or domain SME leaves mid-project.

**Impact:** 🟡 Medium
- Knowledge loss, delays
- Quality risk if replacement lacks context

**Likelihood:** 🟢 Low

**Mitigation:**
1. **Documentation:**
   - This spec kit captures all knowledge (not in people's heads)
2. **Cross-training:**
   - ≥2 people know each domain (data model, BI tool, AI agent)
3. **Onboarding plan:**
   - New team members can ramp via spec docs + recorded demos

**Contingency:**
- If turnover occurs, prioritize knowledge transfer sessions before departure

**Owner:** Engineering Leadership

---

## 7. Risk Monitoring & Review

### Ongoing Risk Management

| Activity                          | Frequency     | Owner              |
|-----------------------------------|---------------|--------------------|
| **Risk register review**          | Monthly       | Product + Eng      |
| **Incident log analysis**         | Weekly        | Internal Ops       |
| **Pre-demo health checks**        | Per demo      | Eng + Sales        |
| **Post-demo retrospectives**      | Per demo      | Product + Sales    |
| **Quarterly risk re-assessment**  | Quarterly     | All stakeholders   |

### Escalation Path

**Level 1 (Team):** Product owner + Eng lead
**Level 2 (Management):** VP Product + VP Eng
**Level 3 (Executive):** CTO + Chief Product Officer

---

**Related:**
- [Success Criteria](success_criteria.md) — How we measure risk mitigation effectiveness
- [Security & Privacy](security_privacy.md) — Deep dive on SP-* risks
- [Governance](governance.md) — Mitigations for data quality risks
