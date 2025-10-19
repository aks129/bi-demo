# Glossary

**Last Updated:** 2025-10-19

---

## Purpose

This glossary defines **healthcare, pharmacy, and analytics terms** used throughout the ACME Pharmacy Analytics spec. Organized by category for quick reference.

---

## Pharmacy & Medication Adherence

### Adherence
The extent to which a patient takes medications as prescribed. Measured via **PDC** or **MPR**.

### PDC (Proportion of Days Covered)
**Definition:** The percentage of days in a measurement period that a patient has medication on hand.
**Formula:** `(Total days with medication available) / (Total days in period) × 100`
**Example:** If a patient has diabetes medication for 270 out of 300 days → PDC = 90%
**Clinical Threshold:** ≥80% is considered "adherent" (CMS Star Ratings standard)
**Use Case:** Preferred over MPR for multi-drug regimens; accounts for overlapping fills.

### PDC_90
PDC calculated over a **90-day** measurement window (e.g., last quarter).

### PDC_180
PDC calculated over a **180-day** measurement window (e.g., last 6 months).

### MPR (Medication Possession Ratio)
**Definition:** The sum of days' supply for all fills in a period divided by the number of days in the period.
**Formula:** `(Sum of days supply) / (Days in period) × 100`
**Difference from PDC:** MPR can exceed 100% if early refills occur; PDC caps at 100%.
**Use Case:** Simpler calculation; used when tracking single medication.

### MPR_90
MPR calculated over a **90-day** period.

### Days Supply
The number of days a prescription is intended to last (e.g., "30-day supply," "90-day supply").

### Fill-to-Fill Interval
The time elapsed between consecutive prescription fills for the same medication.

### Early Refill
A prescription refill obtained before the previous supply is exhausted (can inflate MPR).

### Late Refill
A prescription refill obtained after the previous supply is exhausted (creates gap in therapy).

### Abandonment (Prescription Abandonment)
When a prescription is submitted to a pharmacy but the patient never picks it up.
**Metric:** `(Abandoned scripts) / (Total scripts submitted) × 100`

### Therapeutic Class / Drug Class
A grouping of medications by therapeutic use (e.g., "Diabetes," "Hypertension," "Statins").

### Brand vs. Generic
- **Brand:** Original patented medication (e.g., Lipitor)
- **Generic:** Bioequivalent, lower-cost alternative (e.g., atorvastatin)
**Metric:** **Generic Substitution Rate** = `(Generic fills) / (Total fills) × 100`

---

## Medicare & Star Ratings

### CMS (Centers for Medicare & Medicaid Services)
The federal agency that administers Medicare, Medicaid, and the Health Insurance Marketplace.

### Medicare Advantage (MA)
Medicare health plans offered by private insurers (alternative to Original Medicare). Also called "Medicare Part C."

### Star Ratings
CMS's quality rating system for Medicare Advantage and Part D plans (1–5 stars).
**Impact:** 4+ star plans receive **bonus payments** (~5% of premium revenue).
**Key Measures:** Adherence (PDC ≥80%), health outcomes, customer service, member complaints.

### Part D
Medicare prescription drug coverage (standalone or bundled with Medicare Advantage).

### Star Measures (Pharmacy-Specific)
- **Adherence for Diabetes Medications** (PDC ≥80%)
- **Adherence for Hypertension (RAS antagonists)** (PDC ≥80%)
- **Adherence for Statins** (PDC ≥80%)
- **Medication Therapy Management (MTM) program completion**
- **Statin Use in Persons with Diabetes (SUPD)**

### HEDIS (Healthcare Effectiveness Data and Information Set)
A set of standardized performance measures used by health plans (managed by NCQA).
**Overlap with Stars:** Many HEDIS measures align with CMS Star measures.

### PMPM (Per Member Per Month)
Average cost or utilization metric per member per month.
**Example:** "Rx PMPM = $250" means avg member costs $250/month in prescriptions.

---

## Medication Therapy Management (MTM)

### CMR (Comprehensive Medication Review)
An annual one-on-one review of a patient's medications by a pharmacist.
**Goal:** Identify gaps, duplications, interactions, and adherence barriers.
**Star Impact:** CMR completion rate is a CMS Star measure.

### TMR (Targeted Medication Review)
A focused review of specific medications or therapeutic issues (subset of MTM).

### MTM Eligibility
Criteria for MTM enrollment (typically: multiple chronic conditions, multiple medications, high drug costs).

### Personal Medication List (PML)
A document provided to patients during CMR, listing all current medications.

### Medication Action Plan (MAP)
A patient-friendly action plan created during CMR (e.g., "Take lisinopril at bedtime to improve adherence").

---

## Care Gaps & Quality Measures

### Care Gap
A quality measure or preventive service a patient is due for but has not completed.
**Examples:**
- Diabetes patient overdue for HbA1c test
- Patient not adherent to statin (PDC <80%)
- Missing annual flu vaccine

### Gap Closure
The process of resolving a care gap (e.g., patient completes HbA1c test, refills statin).

### Gap Closure Cycle Time
**Definition:** Time from gap detection → gap closed (resolution).
**Metric:** `Median days from gap_detected_at to gap_closed_at`

### Open Gap
A care gap that has been identified but not yet resolved.

### Closed Gap
A care gap that has been resolved (e.g., patient refilled medication, completed screening).

### Risk Stratification
Categorizing members by health risk (e.g., low/medium/high) to prioritize interventions.

---

## Data & Analytics

### Dimension (dim)
A table containing descriptive attributes (e.g., `dim_member`, `dim_drug`, `dim_client`).

### Fact (fact)
A table containing measurable events or metrics (e.g., `fact_claims`, `fact_adherence`).

### Grain
The level of detail in a data table (e.g., "one row per claim" vs. "one row per member per month").

### Surrogate Key
An artificial unique identifier (e.g., `member_id`, `claim_id`) not tied to real-world meaning.

### Slowly Changing Dimension (SCD)
A dimension that changes over time (e.g., member address, plan enrollment). Common patterns:
- **Type 1:** Overwrite old value
- **Type 2:** Insert new row with effective date range

### Star Schema
A data model with **fact tables** at the center and **dimension tables** radiating outward.

### Snowflake Schema
A normalized variant of star schema (dimensions reference other dimensions).

### Data Lineage
The flow of data from source → transformations → final destination.
**Use Case:** "Where does `adherence.pdc_90` come from?" → Trace back to `claims` and `member_roster`.

### Metric Catalog
A centralized repository of metric definitions (name, business logic, SQL, owner, SLA).

### Semantic Layer
An abstraction layer that maps business terms (e.g., "Adherence") to underlying SQL logic.

### RLS (Row-Level Security)
Security rules that filter data rows based on user identity or role.
**Example:** Client X users see only `WHERE client_id = 'X'` data.

---

## Data Quality & Operations

### SLA (Service Level Agreement)
A commitment to meet a specific performance standard.
**Example:** "Claims feed latency <24 hours 99% of the time."

### Feed Latency
The delay between when data is generated (e.g., claim adjudication) and when it's available in the warehouse.
**Metric:** `Timestamp of ingestion - Timestamp of source event`

### Schema Drift
Unexpected changes to table structure (e.g., new column, type change, renamed field).

### Row Count Validation
Comparing expected vs. actual row counts for a data load.
**Example:** Expected 50,000 claims/day; received 48,500 → investigate.

### Data Quality Incident
Any event that violates data quality rules (e.g., nulls in required fields, duplicate keys, outlier values).

### Backfill
Reloading historical data to correct errors or add missing records.

### ETL (Extract, Transform, Load)
The process of extracting data from sources, transforming it (cleaning, aggregating), and loading into a warehouse.

### ELT (Extract, Load, Transform)
A variant where raw data is loaded first, then transformed in the warehouse (common with modern cloud warehouses like Snowflake).

---

## Product & Usage Metrics

### DAU (Daily Active Users)
Number of unique users who performed at least one action on a given day.

### WAU (Weekly Active Users)
Number of unique users active in a 7-day window.

### MAU (Monthly Active Users)
Number of unique users active in a 30-day window.

### Stickiness
**Definition:** Ratio of DAU to MAU (or WAU to MAU).
**Formula:** `DAU / MAU × 100`
**Interpretation:** Higher stickiness = users return more frequently.

### Feature Adoption
**Definition:** % of users who have used a specific feature at least once.
**Formula:** `(Users who used feature) / (Total users) × 100`

### Time-to-First-Value (TTFV)
**Definition:** Time from user signup/login → first meaningful action (e.g., loading first dashboard).

### Retention Curve
A graph showing % of users who return over time (e.g., Day 1, Day 7, Day 30).

### Churn
The percentage of users who stop using the product over a time period.

### Cohort
A group of users who share a common characteristic (e.g., "all users who signed up in January 2025").

### p50 / p95 / p99 (Percentile)
Statistical measures of distribution.
- **p50 (median):** 50% of values are below this
- **p95:** 95% of values are below this (often used for latency SLAs)
- **p99:** 99% of values are below this (tail latency)

---

## Notifications & Alerts

### Rule (Notification Rule)
A logical condition that, when met, triggers an alert.
**Example:** `IF PDC_90 < 75% AND trend = 'declining' THEN alert 'Adherence Risk'`

### Severity
Priority level of an alert (e.g., **Critical, High, Medium, Low**).

### Owner
The person or role responsible for triaging and resolving an alert.

### SLA (for Alerts)
Time window for alert triage or resolution.
**Example:** "Critical alerts must be triaged within 4 hours."

### Deduplication
Preventing duplicate alerts for the same entity within a time window.
**Example:** Don't fire "Feed Latency" alert every 5 minutes; once per day max.

### Cooldown / Snooze
A grace period after an alert fires before it can fire again for the same entity.

### Playbook
A documented action plan for responding to an alert ("so what / now what").

### Escalation
Routing an unresolved alert to a higher authority after a timeout.
**Example:** "If unresolved for 2 days → escalate to manager."

---

## Security & Compliance

### PII (Personally Identifiable Information)
Data that can identify an individual (e.g., name, SSN, email, address).

### PHI (Protected Health Information)
Health data tied to an individual (covered by HIPAA).
**Examples:** Diagnosis codes, prescription records, lab results.

### HIPAA (Health Insurance Portability and Accountability Act)
US federal law mandating privacy and security of health information.

### BAA (Business Associate Agreement)
A contract required under HIPAA when a vendor handles PHI on behalf of a covered entity.

### De-Identification
Removing or obscuring PII/PHI to prevent re-identification.
**Methods:** Masking, hashing, aggregation.

### Synthetic Data
Artificially generated data that mimics real data patterns but contains no real PII/PHI.

### RBAC (Role-Based Access Control)
Security model where permissions are granted based on user roles (e.g., ADMIN, ANALYST, VIEWER).

### RLS (Row-Level Security)
See "Data & Analytics" section above.

### Audit Trail / Audit Log
A record of all data access, queries, and changes (who, what, when).

### Least Privilege
Security principle: users should have only the minimum access needed to perform their job.

---

## AI & Machine Learning

### LLM (Large Language Model)
AI models trained on text (e.g., GPT-4, Claude) used for natural language understanding and generation.

### Grounding
Providing an LLM with specific context (e.g., metric definitions, lineage) to improve factual accuracy.

### Hallucination
When an AI generates plausible-sounding but incorrect information.

### Provenance
The source or origin of information (e.g., "This metric comes from `fact_claims` table").

### Guardrails
Rules or constraints to prevent AI from generating harmful, incorrect, or out-of-scope responses.

### Prompt Engineering
Crafting input prompts to guide AI behavior and output quality.

### Few-Shot Learning
Providing an AI with a few examples to guide its responses.

### Zero-Shot
AI responding to a query without prior examples (relying on pre-training).

---

## Business & Pharmacy Operations

### Payer
An organization that pays for healthcare services (e.g., insurance company, Medicare, Medicaid).

### PBM (Pharmacy Benefit Manager)
A third-party administrator of prescription drug programs (e.g., CVS Caremark, Express Scripts).

### Formulary
A list of covered medications and their cost tiers (generic/preferred/non-preferred/specialty).

### Prior Authorization (PA)
A requirement that a payer approve a medication before it's dispensed.

### Step Therapy
A payer policy requiring patients to try lower-cost medications before approving higher-cost options.

### Network Pharmacy
A pharmacy contracted with a payer or PBM to provide services at negotiated rates.

### Specialty Pharmacy
A pharmacy that handles high-cost, complex medications (e.g., biologics, oncology drugs).

### 340B Program
A federal program allowing eligible healthcare organizations to purchase drugs at discounted prices.

---

## Statistical & Analytical Concepts

### Cohort Analysis
Grouping users/members by shared attributes and comparing outcomes over time.

### Time Series
Data points indexed by time (e.g., daily adherence trend over 90 days).

### Moving Average
A calculated average over a rolling time window (e.g., 7-day moving average).

### Outlier
A data point significantly different from others (e.g., plan with 40% PDC when others are 80%+).

### Distribution
The spread of values in a dataset (normal, skewed, bimodal, etc.).

### Correlation
A statistical measure of the relationship between two variables (does not imply causation).

### Causation
A relationship where one variable directly influences another.

### Leading Indicator
A metric that predicts future outcomes (e.g., "CMR completion rate" predicts "adherence improvement").

### Lagging Indicator
A metric that reflects past outcomes (e.g., "last quarter's Star Ratings").

---

## Acronyms Quick Reference

| Acronym | Full Name                                      | Category         |
|---------|------------------------------------------------|------------------|
| **BAA** | Business Associate Agreement                   | Compliance       |
| **CMS** | Centers for Medicare & Medicaid Services       | Regulatory       |
| **CMR** | Comprehensive Medication Review                | MTM              |
| **DAU** | Daily Active Users                             | Product Metrics  |
| **ELT** | Extract, Load, Transform                       | Data Engineering |
| **ETL** | Extract, Transform, Load                       | Data Engineering |
| **HEDIS** | Healthcare Effectiveness Data and Information Set | Quality Measures |
| **HIPAA** | Health Insurance Portability and Accountability Act | Compliance     |
| **LLM** | Large Language Model                           | AI               |
| **MA**  | Medicare Advantage                             | Payer            |
| **MAP** | Medication Action Plan                         | MTM              |
| **MAU** | Monthly Active Users                           | Product Metrics  |
| **MPR** | Medication Possession Ratio                    | Adherence        |
| **MTM** | Medication Therapy Management                  | Pharmacy         |
| **PA**  | Prior Authorization                            | Pharmacy Ops     |
| **PBM** | Pharmacy Benefit Manager                       | Payer            |
| **PDC** | Proportion of Days Covered                     | Adherence        |
| **PHI** | Protected Health Information                   | Compliance       |
| **PII** | Personally Identifiable Information            | Compliance       |
| **PML** | Personal Medication List                       | MTM              |
| **PMPM** | Per Member Per Month                          | Finance          |
| **RBAC** | Role-Based Access Control                     | Security         |
| **RLS** | Row-Level Security                             | Security         |
| **SLA** | Service Level Agreement                        | Operations       |
| **SUPD** | Statin Use in Persons with Diabetes           | Star Measure     |
| **TMR** | Targeted Medication Review                     | MTM              |
| **TTFV** | Time-to-First-Value                           | Product Metrics  |
| **WAU** | Weekly Active Users                            | Product Metrics  |

---

## How to Use This Glossary

### For New Team Members
Start with **Pharmacy & Medication Adherence** and **Medicare & Star Ratings** to build domain knowledge.

### For Engineers
Focus on **Data & Analytics** and **Data Quality & Operations** for technical context.

### For Product Managers
Review **Pharmacy & Medication Adherence**, **Care Gaps**, and **Product & Usage Metrics**.

### For Compliance
Study **Security & Compliance** and **Medicare & Star Ratings** (regulatory context).

### For Sales/CSM
Master **Pharmacy & Medication Adherence**, **Medicare & Star Ratings**, and **Business & Pharmacy Operations** to speak client language.

---

## Glossary Maintenance

**Owner:** Product Team
**Review Cadence:** Quarterly
**Update Process:**
1. Propose new term or definition update via PR
2. Product + domain SME review
3. Merge and announce in team channels

**Version History:**

| Version | Date       | Changes                          |
|---------|------------|----------------------------------|
| 1.0     | 2025-10-19 | Initial glossary release         |

---

**Related:**
- [Vision](vision.md) — Understand why these terms matter
- [Data Contracts / Metrics Catalog](data_contracts/metrics_catalog.md) — See terms in action
- [Personas](personas/) — Understand who uses this vocabulary
