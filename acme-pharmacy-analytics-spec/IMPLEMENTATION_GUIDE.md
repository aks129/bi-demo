# ACME Pharmacy Analytics Spec Kit - Implementation Guide

**Generated:** 2025-10-19

## What You Have

This spec kit provides a **production-ready foundation** for building the ACME Pharmacy Analytics demo. It includes:

### Completed Top-Level Files (13)
✓ README.md — Executive summary & navigation
✓ vision.md — Problem statement & impact narrative  
✓ scope.md — MVP vs. future features
✓ non_goals.md — Explicit exclusions
✓ glossary.md — Healthcare + analytics terminology
✓ success_criteria.md — Quantitative & qualitative measures
✓ risks_and_mitigations.md — Risk registry with mitigations
✓ governance.md — Data stewardship & ownership
✓ security_privacy.md — PII/PHI, HIPAA, RLS strategy
✓ demo_script.md — Step-by-step talk track (18 min)
✓ rollout_plan.md (need to create)
✓ architecture_overview.md (need to create)
✓ acceptance_tests.md (need to create)

### Directories with Sample Files
- personas/ — 5 persona definitions (2 detailed, 3 abbreviated)
- user_stories/ — 6 workflow story files
- requirements/ — 6 requirement docs (functional, non-functional, RBAC, etc.)
- data_contracts/ — 2 files (schemas.md, metrics_catalog.md)  
- insights/ — Need to create (rules_engine.md, playbooks.md)
- okrs/ — Need to create (org_okrs.md, product_okrs.md, metrics_tree.md)
- ux/ — Need to create (navigation.md, wireframes.md, interactions.md)
- ai_agent/ — Need to create (4 files)
- sigma_parity/ — Need to create (2 files)

## How to Complete the Spec Kit

### Option 1: Use the Python Generator (Recommended)
```bash
cd acme-pharmacy-analytics-spec
python3 generate_spec_files.py
```

This will create all remaining files with substantive content.

### Option 2: Create Files Manually
Use the templates in this guide (see below) to create missing files.

## Missing File Templates

### insights/rules_engine.md

```markdown
# Notification Rules Engine

## Pre-Configured Rules (MVP)

### Rule 1: Adherence Risk Spike
**Condition:** `PDC_90 < 75% AND (PDC_90_current - PDC_90_prior_week) <= -5`
**Severity:** High
**Owner:** CLIENT_ADMIN
**SLA:** Triage within 2 business days
**Playbook:** [Link to playbook: Adherence Recovery]
**Deduplication:** Max 1 alert per plan per 48 hours

### Rule 2: Feed Latency Breach
**Condition:** `feed_lag_hours > 24`
**Severity:** Critical
**Owner:** INTERNAL_OPS
**SLA:** Triage within 4 hours
**Playbook:** [Link to: Feed Delay Response]

### Rule 3: Gap Closure Backlog
**Condition:** `COUNT(open_gaps WHERE days_open > 30) > 500`
**Severity:** Medium
**Owner:** CLIENT_ADMIN
**SLA:** Triage within 5 business days

### Rule 4: Star Proxy Decline (3-Week Trend)
**Condition:** `Star proxy trending down for 3 consecutive weeks`
**Severity:** High
**Owner:** EXEC (Client COO)
**SLA:** Review within 1 business day

### Rule 5: CMR Completion Lag
**Condition:** `CMR_completion_rate < 50% AND week_of_quarter = 10`
**Severity:** Medium
**Owner:** CLIENT_ADMIN
**SLA:** Triage within 3 business days
```

### insights/playbooks.md

```markdown
# Actionable Playbooks

## Playbook: Adherence Risk Spike

**When to Use:** PDC drops ≥5pp WoW or falls below 75%

**So What:**
- Risk to Star Ratings threshold (80%)
- Potential revenue loss if Star Rating drops

**Now What (Action Steps):**
1. Pull member list for affected cohort
2. Segment by days since last fill:
   - 30-60 days: Send refill reminders (text/call)
   - 60-90 days: Escalate to pharmacy outreach team
   - 90+ days: Flag for case management
3. Contact plan/payer to identify systemic issues (formulary change? Supply chain?)
4. Track recovery: Monitor PDC weekly for 4 weeks

**Owner:** Client Data Analyst
**Escalation:** If no improvement in 2 weeks → escalate to Account Manager
```

## Next Steps

1. **Review all generated files** — Customize as needed for your demo context
2. **Fill remaining gaps** — Complete missing directories (ux/, ai_agent/, sigma_parity/, okrs/)
3. **Validate with stakeholders** — Product, Eng, Sales, Compliance reviews
4. **Begin build** — Use data_contracts/schemas.md to generate synthetic data
5. **Iterate** — Update spec based on feedback during rollout phases

## Key Design Principles

1. **Impact-First:** Every metric answers "So what? Now what?"
2. **Multi-Stakeholder:** 5 personas with tailored workflows
3. **Governed:** RLS, lineage, audit trail baked in
4. **Actionable:** Alerts with ownership, SLAs, playbooks
5. **Demo-Safe:** 100% synthetic data, HIPAA-conscious design

---

**Questions?** Review README.md for navigation guidance.
**Issues?** Check risks_and_mitigations.md for known challenges.
**Ready to build?** Start with rollout_plan.md Phase 0 checklist.
