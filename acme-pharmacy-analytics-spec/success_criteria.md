# Success Criteria

**Last Updated:** 2025-10-19

---

## Purpose

This document defines **how we measure success** for the ACME Pharmacy Analytics demo. Success criteria span:
1. **Demo-Specific Leading Indicators** — Can we successfully demonstrate value?
2. **Qualitative Stakeholder Validation** — Do key personas find it useful?
3. **Quantitative Usage & Impact Metrics** — Does it drive adoption and outcomes?
4. **Technical Quality Metrics** — Is it performant, reliable, and secure?

---

## 1. Demo-Specific Success Criteria (MVP Gate)

**Context:** These criteria determine whether the demo is "ready to show" to prospects, clients, and internal stakeholders.

### 1.1 Completeness

| Criterion                                              | Target                           | Status |
|--------------------------------------------------------|----------------------------------|--------|
| All 7 dashboards wireframed and spec'd                | 100% complete                    | ✅      |
| Metrics catalog with business logic + SQL             | ≥25 metrics documented           | ✅      |
| Notification rules defined with playbooks              | ≥5 rules with playbooks          | ✅      |
| Demo script written and validated                      | 15–20 min talk track completed   | ✅      |
| RLS strategy documented                                | Complete strategy doc            | ✅      |
| Acceptance tests written                               | ≥30 GIVEN/WHEN/THEN scenarios    | ✅      |
| Synthetic data specification complete                  | 150K members, 1.2M claims spec'd | ✅      |

### 1.2 Stakeholder Approval

| Stakeholder Group    | Approval Criterion                                                                                     | Gate         |
|----------------------|--------------------------------------------------------------------------------------------------------|--------------|
| **Product**          | "This aligns with our 2025 roadmap and solves real client pain points"                                | ✅ Approved   |
| **Sales/CSM**        | "I can confidently demo this to close deals and renew clients"                                         | ✅ Approved   |
| **Engineering**      | "This is architecturally sound and maintainable"                                                       | ✅ Approved   |
| **Compliance**       | "This meets our governance and security bar for a demo"                                                | ✅ Approved   |
| **Client Success**   | "This solves ACME's (and similar clients') real problems"                                              | ✅ Approved   |

**MVP Gate:** All five groups must approve before proceeding to build.

### 1.3 Demo Execution Quality

**Measured during internal dry-runs and stakeholder showcases:**

| Metric                                         | Target                  | Measurement Method                          |
|------------------------------------------------|-------------------------|---------------------------------------------|
| **Demo duration**                              | 15–20 minutes           | Timed run-throughs                          |
| **Narrative clarity**                          | ≥4.5/5 avg rating       | Post-demo survey (1–5 scale)                |
| **"Aha moments" per demo**                     | ≥3 clear insights       | Facilitator notes                           |
| **Questions answered confidently**             | ≥90% of Q&A             | Presenter self-assessment                   |
| **Technical issues during demo**               | 0 critical failures     | Incident log                                |
| **Stakeholder engagement** (attention, notes)  | "High" subjective rating | Observer notes                              |

---

## 2. Qualitative Success Criteria (Post-Demo Feedback)

**Context:** After showcasing to prospects, clients, or internal teams, we collect qualitative feedback.

### 2.1 Prospect/Client Feedback (Sales & CSM Showcases)

**Survey Questions (1–5 scale):**

| Question                                                                                     | Target Avg |
|----------------------------------------------------------------------------------------------|------------|
| "This demo clearly showed how analytics can improve pharmacy outcomes"                      | ≥4.5       |
| "The dashboards are intuitive and easy to understand"                                        | ≥4.0       |
| "The insights (e.g., adherence risk alerts) are actionable"                                  | ≥4.5       |
| "This platform addresses my organization's pain points"                                      | ≥4.0       |
| "I would be interested in learning more / seeing this in production"                         | ≥4.0       |

**Open-Ended Feedback:**
- "What resonated most?"
- "What was unclear or confusing?"
- "What would you want to see added?"

**Success Indicator:** ≥80% of prospects rate ≥4/5 on all questions.

### 2.2 Internal Stakeholder Feedback (Product, Eng, Ops Teams)

**Survey Questions (Yes/No/Partially):**

| Question                                                                                     | Target       |
|----------------------------------------------------------------------------------------------|--------------|
| "This demo is production-quality (not 'just a prototype')"                                   | ≥80% Yes     |
| "The spec is detailed enough to build from"                                                  | ≥90% Yes     |
| "The personas reflect real user needs"                                                       | ≥85% Yes     |
| "The metrics are clinically and operationally relevant"                                      | ≥90% Yes     |
| "The governance approach (RLS, audit, lineage) is sound"                                     | ≥85% Yes     |
| "I would be proud to show this to a prospect"                                                | ≥90% Yes     |

**Success Indicator:** All questions meet or exceed target thresholds.

---

## 3. Quantitative Usage & Impact Metrics (If Built & Deployed)

**Context:** If the demo transitions to a pilot or limited production, we track actual usage and impact.

### 3.1 Adoption Metrics (30 Days Post-Launch)

| Metric                             | Target          | Data Source                  |
|------------------------------------|-----------------|------------------------------|
| **Active users** (pilot cohort)    | ≥80% of invites | Product telemetry            |
| **WAU/MAU ratio** (stickiness)     | ≥40%            | Product telemetry            |
| **Dashboards viewed per user/week**| ≥3              | BI tool analytics            |
| **AI chat queries per user/week**  | ≥2              | AI agent logs                |
| **Alert triage rate**              | ≥70% within SLA | Notification inbox analytics |

### 3.2 Engagement & Retention

| Metric                                  | Target   | Measurement Window |
|-----------------------------------------|----------|--------------------|
| **7-day retention** (users return)      | ≥60%     | Week 1 → Week 2    |
| **30-day retention**                    | ≥40%     | Week 1 → Week 4    |
| **Feature adoption:** drill-to-member   | ≥50%     | 30 days            |
| **Feature adoption:** cohort filters    | ≥60%     | 30 days            |
| **Feature adoption:** export CSV        | ≥30%     | 30 days            |

### 3.3 Impact Metrics (Client Outcomes)

**If ACME Pharmacy (or pilot client) uses the platform:**

| Metric                                      | Baseline (Pre-Demo) | Target (90 Days Post) | Measurement Method       |
|---------------------------------------------|---------------------|-----------------------|--------------------------|
| **Adherence (PDC_90 avg, Diabetes cohort)** | 78%                 | ≥82% (+4pp lift)      | `fact_adherence` table   |
| **Gap closure cycle time (median days)**    | 18 days             | ≤12 days              | `fact_gaps` analysis     |
| **CMR completion rate (quarterly)**         | 52%                 | ≥65%                  | MTM program data         |
| **Feed latency SLA compliance**             | 85%                 | ≥95%                  | Ops dashboard            |
| **Alert resolution time (median hours)**    | 48 hours            | ≤24 hours             | Notification inbox logs  |

**Success Indicator:** ≥3 of 5 impact metrics meet or exceed targets within 90 days.

---

## 4. Technical Quality Metrics

**Context:** Ensure the demo is performant, reliable, and secure.

### 4.1 Performance

| Metric                                   | Target       | Measurement Method         |
|------------------------------------------|--------------|----------------------------|
| **Dashboard load time (p95)**           | <3 seconds   | BI tool query logs         |
| **AI chat response time (p95)**         | <5 seconds   | AI agent telemetry         |
| **Data refresh SLA** (overnight batch)  | <2 hours     | ETL orchestration logs     |
| **Query concurrency support**           | ≥50 users    | Load testing               |

### 4.2 Reliability

| Metric                                   | Target       | Measurement Method         |
|------------------------------------------|--------------|----------------------------|
| **Uptime** (demo environment)           | ≥99.5%       | Infrastructure monitoring  |
| **Data quality incidents**              | <2 per month | Incident log               |
| **Failed dashboard queries**            | <1% of total | BI tool error logs         |

### 4.3 Security & Compliance

| Metric                                   | Target       | Measurement Method         |
|------------------------------------------|--------------|----------------------------|
| **RLS enforcement**                     | 100%         | Manual audit + query logs  |
| **Audit trail completeness**            | 100%         | Audit log review           |
| **Synthetic data verification**         | 0 real PHI   | Data validation scripts    |
| **Unauthorized access attempts**        | 0 successful | Security logs              |

---

## 5. Sales & Business Impact Metrics

**Context:** Does this demo help close deals and retain clients?

### 5.1 Sales Metrics (6 Months Post-Launch)

| Metric                                        | Target            | Data Source          |
|-----------------------------------------------|-------------------|----------------------|
| **Demos delivered to prospects**              | ≥20               | Sales team tracking  |
| **Prospect → qualified lead conversion**      | ≥60%              | CRM                  |
| **Deals influenced by demo** (sales attribution) | ≥5 closed deals | CRM + sales feedback |
| **Average deal size (demo vs. no-demo)**      | +15% uplift       | Sales analytics      |
| **Sales cycle length (demo vs. no-demo)**     | -10% reduction    | Sales analytics      |

### 5.2 Client Success Metrics

| Metric                                        | Target            | Data Source          |
|-----------------------------------------------|-------------------|----------------------|
| **Client renewals citing analytics value**    | ≥3 renewals       | CSM feedback         |
| **NPS lift (clients who use demo-based tools)**| +10 points       | NPS surveys          |
| **Client case studies published**             | ≥2                | Marketing team       |

---

## 6. Learning & Iteration Metrics

**Context:** How well do we learn and improve?

### 6.1 Feedback Loop

| Metric                                        | Target            | Measurement Method   |
|-----------------------------------------------|-------------------|----------------------|
| **Post-demo feedback surveys completed**      | ≥80% response     | Survey tool          |
| **Actionable feedback items logged**          | ≥10 per quarter   | Product backlog      |
| **Feedback → feature update cycle time**      | ≤30 days (critical) | Product roadmap    |

### 6.2 Knowledge Sharing

| Metric                                        | Target            | Measurement Method   |
|-----------------------------------------------|-------------------|----------------------|
| **Internal demo dry-runs conducted**          | ≥3 before launch  | Team calendar        |
| **Documented "lessons learned" sessions**     | ≥1 per quarter    | Retro notes          |
| **Sales/CSM training sessions on demo**       | ≥2 sessions       | Training schedule    |

---

## 7. Risk & Mitigation Success Criteria

**Context:** Did we proactively manage risks? (See [risks_and_mitigations.md](risks_and_mitigations.md))

| Risk                                  | Success Criterion (Mitigation Effectiveness)                          |
|---------------------------------------|-----------------------------------------------------------------------|
| **Data quality issues**               | <2 incidents impacting demos per quarter                              |
| **PHI/PII exposure**                  | 0 incidents (100% synthetic data verified)                            |
| **RLS misconfiguration**              | 0 unauthorized data access incidents                                  |
| **Alert fatigue**                     | <10% of alerts marked "noise" by users                                |
| **AI hallucinations**                 | <5% of AI responses flagged as incorrect by users                     |
| **Demo environment downtime**         | <2 hours unplanned downtime per quarter                               |

**Success Indicator:** All risk mitigations meet criteria; no critical incidents.

---

## 8. Overall Success Definition

**The ACME Pharmacy Analytics demo is SUCCESSFUL if:**

### ✅ **Tier 1: MVP Completion** (Gate to Build)
- [ ] All 7 dashboards wireframed and spec'd
- [ ] Metrics catalog with ≥25 metrics
- [ ] ≥5 notification rules with playbooks
- [ ] Demo script written (15–20 min)
- [ ] All 5 stakeholder groups approve spec

### ✅ **Tier 2: Demo Execution Quality** (Gate to Show Externally)
- [ ] ≥3 successful internal dry-runs with no critical issues
- [ ] Post-dry-run feedback ≥4.5/5 on clarity and impact
- [ ] Sales/CSM team trained and confident

### ✅ **Tier 3: External Validation** (Prospect/Client Feedback)
- [ ] ≥80% of prospects rate demo ≥4/5 on relevance and actionability
- [ ] ≥5 demos delivered to prospects within first 3 months
- [ ] ≥60% of prospects convert to qualified leads

### ✅ **Tier 4: Business Impact** (6–12 Months)
- [ ] ≥3 closed deals influenced by demo
- [ ] ≥2 client renewals citing analytics value
- [ ] ≥2 client case studies published

### ✅ **Tier 5: Product Evolution** (Ongoing)
- [ ] Demo transitions to production-ready product (or informs roadmap)
- [ ] ≥10 feedback items incorporated into product backlog
- [ ] Lessons learned applied to next demo or product iteration

---

## 9. Leading vs. Lagging Indicators

### Leading Indicators (Predict Future Success)
- **Internal dry-run quality scores** → Predict external demo success
- **Stakeholder approval ratings** → Predict spec completeness
- **Metrics catalog depth** → Predict client relevance
- **Sales team confidence** → Predict demo conversion rates

### Lagging Indicators (Measure Past Outcomes)
- **Deals closed** (6+ months post-launch)
- **Client renewals** (12+ months)
- **Adherence lift** (90+ days post-adoption)
- **NPS improvement** (quarterly surveys)

**Strategy:** Optimize leading indicators early; track lagging indicators for long-term validation.

---

## 10. Success Review Cadence

| Timeframe              | Review Focus                                    | Participants                          |
|------------------------|-------------------------------------------------|---------------------------------------|
| **Weekly (build phase)**  | Spec completeness, blocker resolution          | Product, Eng                          |
| **Post-dry-run**       | Demo execution quality, feedback incorporation  | Product, Sales, CSM                   |
| **Monthly (post-launch)** | Adoption metrics, usage trends, feedback       | Product, Eng, Sales, CSM              |
| **Quarterly**          | Business impact (deals, renewals), roadmap alignment | Leadership, Product, Sales          |
| **Annually**           | ROI assessment, lessons learned, strategic pivots | All stakeholders                     |

---

## 11. Success Celebration Milestones

**Recognize and celebrate progress:**

| Milestone                                      | Celebration                          |
|------------------------------------------------|--------------------------------------|
| ✅ Spec approved by all 5 stakeholder groups   | Team lunch, Slack announcement       |
| ✅ First successful internal dry-run           | Demo recording shared company-wide   |
| ✅ First prospect demo delivered               | Shout-out in all-hands meeting       |
| ✅ First deal closed (influenced by demo)      | Team offsite, case study kickoff     |
| ✅ Client adherence lift demonstrated          | Blog post, customer success story    |

---

## 12. Failure Criteria (When to Pivot or Stop)

**If the following occur, reassess or discontinue:**

| Failure Criterion                                  | Action                                          |
|----------------------------------------------------|-------------------------------------------------|
| <60% of prospects rate demo ≥3/5 (poor reception)  | Major redesign or pivot                         |
| 0 deals closed within 6 months                     | Re-evaluate sales fit and messaging             |
| >5 data quality incidents in first quarter         | Pause demos, fix data pipeline                  |
| Stakeholder approval <80% (during spec review)     | Revise spec, realign with strategy              |
| Technical issues disrupt >25% of demos             | Fix reliability before resuming external demos  |

---

**Related:**
- [Vision](vision.md) — Why success matters
- [Scope](scope.md) — What's included in success measures
- [Risks & Mitigations](risks_and_mitigations.md) — How we prevent failure
- [Demo Script](demo_script.md) — Execution playbook

---

**Owned by:** Product & Engineering Leadership
**Reviewed:** Quarterly
**Updated:** As needed based on learnings
