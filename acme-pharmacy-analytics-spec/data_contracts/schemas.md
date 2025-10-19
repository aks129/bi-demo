# Data Schemas

## Fact Tables

### fact_claims
**Grain:** One row per claim
**Purpose:** Store all prescription claims

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| claim_id | STRING | Unique claim identifier | PRIMARY KEY, NOT NULL |
| member_id | STRING | FK to dim_member | NOT NULL |
| drug_id | STRING | FK to dim_drug | NOT NULL |
| claim_date | DATE | Date claim processed | NOT NULL |
| days_supply | INTEGER | Days of medication supplied | 1-90 |
| paid_amount | DECIMAL(10,2) | Amount paid | ≥0 |
| status | STRING | Claim status | paid, denied, pending |

### fact_adherence
**Grain:** One row per member per drug class per month

| Column | Type | Description |
|--------|------|-------------|
| member_id | STRING | FK to dim_member |
| drug_class | STRING | Diabetes, Hypertension, Statins |
| pdc_90 | DECIMAL(5,2) | Proportion of Days Covered (90-day window) |
| pdc_180 | DECIMAL(5,2) | PDC for 180-day window |
| mpr_90 | DECIMAL(5,2) | Medication Possession Ratio |
| as_of_date | DATE | Calculation date |

## Dimension Tables

### dim_member
**Grain:** One row per member

| Column | Type | Description |
|--------|------|-------------|
| member_id | STRING | PRIMARY KEY |
| client_id | STRING | FK to dim_client (for RLS) |
| dob | DATE | Date of birth (synthetic) |
| gender | STRING | M, F, Other |
| risk_band | STRING | Low, Medium, High |
| plan_id | STRING | FK to dim_plan |

### dim_drug
| Column | Type | Description |
|--------|------|-------------|
| drug_id | STRING | PRIMARY KEY |
| name | STRING | Drug name |
| class | STRING | Diabetes, Hypertension, Statins, etc. |
| brand_generic_flag | STRING | Brand or Generic |

---

**Related:**
- [Metrics Catalog](metrics_catalog.md)
- [Lineage](lineage.md)
