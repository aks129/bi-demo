# Governance

**Last Updated:** 2025-10-19

---

## Data Governance Framework

### Metric Definitions

**Single Source of Truth:**
- All metrics defined in dbt metrics catalog (or equivalent semantic layer)
- Metric definitions version-controlled in Git
- Changes require pull request approval (Product + Data Eng review)

**Ownership:**
- Each metric has designated owner:
  - **Clinical metrics** (PDC, CMR): Clinical SME
  - **Operational metrics** (feed latency, row counts): Data Engineering
  - **Product metrics** (DAU, adoption): Product Team
  - **Business metrics** (Star proxy, PMPM): Product + Finance

**Change Management:**
- **Breaking changes** (formula modification, aggregation change): 2-week notice + impact assessment
- **Additions** (new metrics): Standard PR approval
- **Deprecations:** 30-day notice; metrics marked deprecated, then removed from dashboards

---

### Data Lineage

**Automated Lineage:**
- dbt docs generate end-to-end lineage diagrams (source → staging → intermediate → mart)
- Lineage accessible via:
  - dbt docs site
  - Admin/Governance dashboard in BI tool
  - AI chat agent queries ("Where does PDC_90 come from?")

**Documentation:**
- Comprehensive lineage docs in [data_contracts/lineage.md](data_contracts/lineage.md)
- Diagram format: Mermaid or dbt DAG screenshots

**Traceability:**
- Every metric definition cites:
  - Source tables
  - Transformation logic (dbt model)
  - Business logic (written description)
  - SQL pattern

---

### Data Quality SLAs

| Feed | Latency SLA | Completeness SLA | Quality Incidents (Monthly Target) |
|------|-------------|------------------|-------------------------------------|
| **Claims** | <24 hours | ≥99% expected rows | ≤2 incidents |
| **Member Roster** | <48 hours | 100% | ≤1 incident |
| **Gaps** | <24 hours | ≥98% | ≤2 incidents |
| **Product Telemetry** | <1 hour | ≥95% | ≤3 incidents |

**Incident Definition:**
- Latency breach (exceeds SLA)
- Row count anomaly (>5% deviation from expected)
- Schema drift (unexpected columns or type changes)
- Data quality rule failure (nulls in required fields, invalid values)

**Escalation:**
- **P0 (Critical):** Client-facing dashboard impact → 4-hour triage SLA
- **P1 (High):** Internal dashboards only → 24-hour triage SLA
- **P2 (Medium):** No dashboard impact → 3-day triage SLA

---

### Access Control & Entitlements

**Role-Based Access Control (RBAC):**
- 6 defined roles (see [requirements/rbac.md](requirements/rbac.md)):
  - CLIENT_VIEWER
  - CLIENT_ADMIN
  - INTERNAL_OPS
  - PRODUCT
  - COMPLIANCE
  - EXEC

**Row-Level Security (RLS):**
- Enforced via:
  - `client_id` filter (CLIENT_* roles see only their client data)
  - `org_id` filter (INTERNAL roles see only Outcomes org data)
  - `payer_id` filter (if multi-payer scoping needed)
- Implementation: BI tool native (Sigma User Attributes, Looker access_grants, Tableau entitlements)

**Principle of Least Privilege:**
- Users granted minimum required access
- No blanket "ADMIN" roles; permissions scoped per function

**Quarterly Access Reviews:**
- Compliance team audits:
  - Active users and roles
  - RLS policy adherence
  - Orphaned accounts (removed employees)

---

### Audit & Compliance

**Audit Trail:**
- **What we log:**
  - All BI queries (user, SQL, timestamp, filters applied)
  - AI chat queries and responses
  - Alert triages and resolutions
  - User login/logout events
  - RLS policy changes
  - Metric definition changes

**Retention:**
- **Demo environment:** 90 days
- **Production:** 1 year minimum (configurable to 7 years for regulatory compliance)

**Access to Audit Logs:**
- COMPLIANCE role: Read-only access
- No user can delete audit logs (append-only table)

**Compliance Reporting:**
- Monthly reports:
  - Data access patterns by user and role
  - RLS enforcement validation
  - Schema drift incidents
  - SLA compliance summary

---

### Metric Catalog Governance

**Approval Workflow:**

1. **Proposal:** Analyst proposes new metric → opens PR with:
   - Business logic (written description)
   - SQL pattern (dbt model or formula)
   - Source tables
   - Owner
   - Expected use cases

2. **Domain SME Review:** "Is this clinically/operationally valid? Aligned with industry standards?"

3. **Data Engineering Review:** "Is SQL correct, performant, and testable?"

4. **Product Approval:** "Does this align with roadmap? Is there user demand?"

5. **Merge:** Metric added to catalog, available in dashboards and AI agent

**Deprecation Policy:**
- 30-day notice before removing metrics (email to users + in-app banner)
- Deprecated metrics marked in catalog with "Deprecated" tag
- Metrics removed from dashboards but queryable in warehouse for 90 days (transition period)

---

## Data Stewardship Model

### Roles & Responsibilities

| Role | Responsibilities | Owner |
|------|------------------|-------|
| **Data Owner** | Business accountability for data domain (e.g., "Adherence metrics") | Clinical SME, Product |
| **Data Steward** | Day-to-day data quality monitoring, issue triage | Data Analyst, Ops |
| **Data Engineer** | Build pipelines, enforce quality tests, maintain lineage | Data Engineering |
| **Metrics Owner** | Define and maintain specific metrics (e.g., PDC_90) | Domain SME |

### Governance Board (Quarterly Reviews)

**Members:**
- Product leadership (chair)
- Data engineering lead
- Clinical SME
- Compliance representative
- Client success representative

**Agenda:**
- Review metric catalog health (usage, deprecations, new requests)
- Data quality SLA performance
- RLS and audit compliance
- Roadmap alignment (new metrics, features)

---

## Data Contracts

**Definition:** Formal agreements between data producers and consumers specifying:
- Schema (columns, types, constraints)
- Refresh frequency and SLA
- Quality standards (completeness, accuracy)
- Contact for issues

**Example Contract: Claims Feed**

```yaml
feed_name: claims_feed
owner: Data Engineering
producer: Synthetic Data Scripts (demo) / Payer APIs (production)
consumer: Adherence dashboards, Gap closure analytics
schema:
  - claim_id (STRING, UNIQUE, NOT NULL)
  - member_id (STRING, NOT NULL)
  - drug_id (STRING, NOT NULL)
  - claim_date (DATE, NOT NULL)
  - days_supply (INTEGER, RANGE 1-90)
  - paid_amount (DECIMAL, ≥0)
refresh_sla: Daily by 2 AM ET
latency_sla: <24 hours from source event
completeness_sla: ≥99% of expected rows
contact: data-eng@outcomes.com
```

**Contract Violations:**
- Logged in ops dashboard
- Alert sent to owner
- Escalation if SLA breached >2x in 30 days

---

## Definitions of Done

### For New Metrics

A metric is "done" when:
- [ ] Business logic documented in plain language
- [ ] SQL implemented and tested (dbt model with tests)
- [ ] Lineage documented (source tables → transformations)
- [ ] Owner assigned
- [ ] Added to metrics catalog (version-controlled)
- [ ] Used in ≥1 dashboard or AI agent grounding DB
- [ ] Stakeholder approval (domain SME + product)

### For New Dashboards

A dashboard is "done" when:
- [ ] Wireframe approved by UX and product
- [ ] All metrics defined in catalog (no ad-hoc calculations)
- [ ] RLS tested (all roles verified)
- [ ] "So what / now what" annotations added
- [ ] Acceptance tests written and passed
- [ ] Demo script section added
- [ ] Training materials created (if user-facing)

### For Data Quality Incidents

An incident is "resolved" when:
- [ ] Root cause identified
- [ ] Fix implemented (pipeline correction, backfill, etc.)
- [ ] Data validated (quality tests pass)
- [ ] Incident documented in log with resolution notes
- [ ] Preventive measures added (new tests, monitoring, alerts)

---

## Governance Metrics (Meta-Analytics)

**We measure governance health via:**

| Metric | Target | Frequency |
|--------|--------|-----------|
| **Metrics catalog coverage** (% dashboards using catalog metrics vs. ad-hoc) | ≥95% | Monthly |
| **Lineage completeness** (% metrics with documented lineage) | 100% | Quarterly |
| **SLA compliance** (% feeds meeting latency + completeness SLAs) | ≥95% | Weekly |
| **RLS enforcement** (% queries with correct filters applied) | 100% | Monthly audit |
| **Audit log completeness** (% queries logged) | 100% | Monthly |
| **Data quality incidents** (P0/P1 incidents per month) | ≤5 total | Monthly |
| **Metric usage** (% metrics used in last 90 days) | ≥80% | Quarterly (prune unused) |

---

## Communication Plan

### For Metric Changes

**Breaking Change (e.g., PDC_90 calculation updated):**
- 2 weeks advance notice via:
  - Email to all users
  - In-app banner on affected dashboards
  - Slack #analytics-updates channel
- Detailed changelog:
  - What changed
  - Why (business justification)
  - Impact (which dashboards affected)
  - Migration guide (if users have custom queries)

**New Metric Added:**
- Announcement in weekly product update
- Added to metrics catalog with "New" tag for 30 days

**Metric Deprecated:**
- 30-day notice
- "Deprecated" tag in catalog
- Suggested replacement metric (if applicable)

---

## Related Documents

- [Data Contracts](data_contracts/) — Schemas, metrics, lineage
- [RBAC](requirements/rbac.md) — Role definitions and access control
- [Auditability](requirements/auditability.md) — Audit trail requirements
- [Security & Privacy](security_privacy.md) — PHI/PII handling, RLS strategy
- [Risks & Mitigations](risks_and_mitigations.md) — DQ-* risks

---

**Owned by:** Product Leadership + Data Engineering
**Reviewed:** Quarterly (Governance Board)
**Version:** 1.0
