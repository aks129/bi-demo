# Demo Script

**Last Updated:** 2025-10-19
**Duration:** 15-20 minutes
**Audience:** Prospects, clients, internal stakeholders

---

## Pre-Demo Checklist

**2 hours before demo:**
- [ ] Validate demo environment is up (all dashboards load)
- [ ] Test AI chat agent responds correctly
- [ ] Refresh data (latest timestamp visible)
- [ ] Clear browser cache, open clean browser session
- [ ] Pre-load all dashboard tabs
- [ ] Test screen sharing quality
- [ ] Have backup plan ready (recorded video or PDF deck)

**5 minutes before demo:**
- [ ] Confirm attendee roster
- [ ] Introduce yourself and role
- [ ] Ask for attendee roles/goals (tailor narrative)
- [ ] Set expectations: "20-min demo + 10-min Q&A"

---

## Demo Flow (18 Minutes Total)

### [0:00-2:00] Opening: The ACME Pharmacy Story (Context Setting)

**Objective:** Establish relevance—prospects see themselves in ACME's challenges.

**Script:**

> "Thanks for joining. Today I'll show you how ACME Pharmacy—a mid-sized pharmacy chain managing 150,000 Medicare Advantage members—transformed their analytics from reactive reporting to proactive impact.
>
> **ACME's challenges were probably familiar to you:**
> - Adherence slipping (down 4 percentage points in Q2), putting Star Ratings at risk
> - Fragmented dashboards—clinical used Excel, finance used Tableau, execs used PowerPoint
> - No early warning system—problems surfaced weeks too late
> - Unclear ownership—when adherence dropped, who should act and by when?
>
> **What they needed was a single platform that serves multiple teams:**
> - Clinical analysts who need deep cohort analytics
> - Executives who need strategic trend visibility
> - Operations teams who need pipeline health monitoring
> - Product teams who need to prove feature impact
>
> **This demo shows that platform.** We'll walk through 5 key workflows in 15 minutes, then take your questions."

**Talking Points:**
- Emphasize **impact-first** framing: "We don't just report what happened; we guide what to do next"
- Preview the **multi-stakeholder** design: "This isn't one-size-fits-all; each role gets tailored views"

---

### [2:00-6:00] Workflow 1: Client Analytics – Proactive Adherence Monitoring

**Objective:** Show how analysts identify at-risk cohorts and drill into root causes.

**Dashboard:** Client Analytics

**Script:**

> "Let's start with Maria, a clinical data analyst at ACME. Her top priority: **maintain PDC ≥80% for Star Ratings compliance.**
>
> **[Show KPI Ribbon at top of dashboard]**
> Here's her dashboard. Notice the **impact-first KPI ribbon** at the top:
> - **Overall PDC_90:** 81.2% (above 80% threshold—good)
> - **Diabetes PDC:** 78.4% (⚠️ below threshold—this is a risk)
> - **Hypertension PDC:** 84.1% (healthy)
> - **Statins PDC:** 79.8% (just below threshold)
>
> **[Point to trend chart]**
> This trend chart shows **Diabetes adherence dropped 5 percentage points in the last 2 weeks**—exactly the type of early signal that used to go unnoticed.
>
> **[Drill into Diabetes cohort]**
> Maria clicks into the Diabetes cohort. She sees:
> - **Top outlier:** Plan XYZ has dropped to 72% PDC (was 82% last month)
> - **Likely cause:** Looking at the fill-to-fill interval, gaps increased from 32 days avg to 45 days—members are delaying refills
>
> **[Show drill-to-member table, masked IDs]**
> She drills to member level (IDs masked for privacy). She can export this cohort to her outreach team with a clear action: **'Contact these 450 members for refill reminders.'**
>
> **Impact:** Instead of discovering adherence issues at month-end, Maria catches them in real-time and acts within 48 hours."

**Key Features Highlighted:**
- KPI ribbon with thresholds
- Week-over-week trends
- Drill-downs (cohort → plan → member)
- Masked PII for privacy
- Export functionality

**Pause for Questions?** (Optional: "Any questions on the analyst workflow before we move to executives?")

---

### [6:00-9:00] Workflow 2: Executive Overview – Strategic Health at a Glance

**Objective:** Show how execs monitor Star Ratings and cost-of-care without drowning in details.

**Dashboard:** Exec Overview

**Script:**

> "Now let's look at the **Executive Overview**, designed for ACME's COO.
>
> **[Show Star Ratings Proxy trend]**
> This top chart tracks **Star Ratings proxy**—a composite of adherence, gap closure, and CMR completion. Notice:
> - **Current:** 4.1 stars (projected)
> - **Trend:** Down 0.1 in the last 3 weeks (⚠️ early warning)
>
> **[Point to 'What Changed' digest]**
> Below that, the **'What Changed This Week' digest** summarizes key drivers:
> - ⚠️ Diabetes adherence down 5pp (we just saw this)
> - ✅ Gap closure improved (+8% more gaps closed vs. last week)
> - ⚠️ CMR completion lagging (52% at week 10; target is 65% by quarter-end)
>
> **[Show cost-of-care signals]**
> On the right, **cost-of-care signals**:
> - **PMPM Rx trend:** Flat (good—no cost spike)
> - **Generic substitution rate:** 87% (up 2pp—cost savings)
>
> **[Click into Star Ratings detail]**
> The COO can click any metric to drill deeper, but **most days, this one-page summary is enough** to know: 'What needs my attention?'
>
> **Impact:** Execs get strategic visibility without requiring data analysts to prepare monthly PowerPoints. **They see problems early, while there's still time to course-correct.**"

**Key Features Highlighted:**
- High-level KPIs (Star proxy, cost trends)
- "What changed" narrative automation
- Click-to-drill for details
- No manual reporting overhead

---

### [9:00-11:00] Workflow 3: Actionable Insights & Notifications

**Objective:** Show how alerts convert "interesting trends" into "assigned actions with SLAs."

**Dashboard:** Insights & Alerts Inbox

**Script:**

> "Great analytics don't just **inform**—they **drive action**. Let's look at ACME's **Insights & Alerts** system.
>
> **[Show notification inbox]**
> This inbox aggregates alerts across the platform. Each alert includes:
> - **What happened:** 'Diabetes PDC dropped ≥5pp WoW for Plan XYZ'
> - **Why it matters (So What):** 'Risk to Star Ratings threshold (80%)'
> - **Owner:** Maria (Client Analytics team)
> - **SLA:** Triage within 2 business days
> - **Playbook:** Linked action steps—'Pull member list, send refill reminders, escalate to plan contact'
>
> **[Show deduplication logic]**
> Notice: **No duplicate alerts.** The system won't fire this alert again for Plan XYZ for 48 hours (cooldown period)—preventing alert fatigue.
>
> **[Show resolved alert]**
> Here's a resolved alert from last week: 'Feed Latency Breach.' The ops team triaged it in 3 hours (well under the 4-hour SLA), backfilled the data, and marked it resolved. **Full audit trail.**
>
> **Impact:** Teams know **who, what, when**—alerts don't get lost in email. Ownership is clear, SLAs are tracked, and playbooks guide action."

**Key Features Highlighted:**
- Centralized alert inbox
- Ownership + SLAs
- Playbooks ("now what")
- Deduplication and cooldown
- Audit trail

**Pause for Questions?**

---

### [11:00-13:00] Workflow 4: Internal Operations – Pipeline Health Monitoring

**Objective:** Show how ops teams ensure data quality and SLA compliance.

**Dashboard:** Internal Ops Monitoring

**Script:**

> "Behind every great analytics platform is **reliable data infrastructure.** Let's look at how ACME's ops team monitors pipeline health.
>
> **[Show feed latency heatmap]**
> This heatmap tracks **3 key data feeds:**
> - **Claims feed** (daily, from 3 payers)
> - **Member roster updates** (weekly)
> - **Gap closure feed** (daily)
>
> **Green = on-time (<24h latency), Yellow = delayed (24-48h), Red = breach (>48h).**
>
> **[Point to recent yellow cell]**
> Last Tuesday, Payer A's claims feed was delayed 28 hours (yellow). The system **auto-alerted the ops team,** who contacted the payer and backfilled data the same day. **Problem contained before it impacted client-facing dashboards.**
>
> **[Show row count validation]**
> Below that, **row count validation:** Expected vs. actual rows per feed. If we expect 50,000 claims/day and receive 48,000, that triggers an investigation.
>
> **[Show schema drift log]**
> And here's the **schema drift log**—any unexpected column changes or type mismatches are flagged immediately.
>
> **Impact:** ACME's ops team catches data quality issues **before they become client-facing problems.** SLA compliance went from 85% to 97% in 90 days."

**Key Features Highlighted:**
- Feed latency tracking
- SLA heatmap (visual status)
- Row count + schema validation
- Proactive alerts for ops team

---

### [13:00-15:00] Workflow 5: AI Chat Agent – Governed, Grounded Q&A

**Objective:** Show how non-technical users get answers without writing SQL.

**Dashboard:** AI Chat Interface

**Script:**

> "Finally, let's talk about **democratizing analytics** for non-technical users.
>
> **[Show AI chat interface]**
> ACME's executives and analysts can ask questions in plain English:
>
> **[Type: 'What was diabetes adherence last month?']**
> The AI responds:
> - **Answer:** 'Diabetes PDC_90 for September 2025 was 78.4%.'
> - **Source citation:** 'Calculated from fact_adherence table; metric definition: [link to metrics catalog].'
>
> **[Type: 'How is PDC_90 calculated?']**
> AI retrieves the **exact business logic** from the metrics catalog:
> - **Answer:** 'PDC_90 = (Total days with medication available) / (90 days) × 100. Medication is considered "available" if days supply from fill date overlaps with the measurement window. See SQL pattern: [link].'
>
> **[Type: 'Where does claims data come from?']**
> AI shows **data lineage**:
> - **Answer:** 'Claims data flows from: Payer adjudication systems → claims_feed (S3) → fact_claims table (Snowflake) → adherence calculations (dbt model). Refresh SLA: <24 hours.'
>
> **[Type: 'Write a SQL query to update adherence' → guardrails trigger]**
> **AI rejects:** 'I can only answer questions about data. I cannot write queries that modify data.'
>
> **Impact:** Execs get **fast, grounded answers** without waiting for analysts. Governance is preserved—AI cites sources and respects entitlements."

**Key Features Highlighted:**
- Natural language Q&A
- Grounded responses (metric catalog + lineage)
- Provenance citations
- Guardrails (no writes, no out-of-scope)
- Read-only, governed

---

### [15:00-17:00] Bringing It All Together: Impact-First Outcomes

**Objective:** Tie workflows back to business results.

**Script:**

> "So, **what's the impact for ACME Pharmacy?**
>
> **In the first 90 days using this platform:**
> - **Adherence lift:** Diabetes PDC improved from 78% → 82% (+4pp)—back above Star threshold
> - **Gap closure acceleration:** Median cycle time dropped from 18 days → 12 days
> - **Operational efficiency:** Feed SLA compliance improved from 85% → 97%
> - **Exec time savings:** No more manual monthly reports—exec digest auto-generated
>
> **And here's what makes this different from traditional BI tools:**
> 1. **Multi-stakeholder by design:** Analysts, execs, ops, and product teams all served
> 2. **Impact-first framing:** Every metric answers 'So what? Now what?'
> 3. **Governed & auditable:** RLS, lineage, audit trail baked in—not bolted on
> 4. **Actionable insights:** Alerts with ownership, SLAs, and playbooks
> 5. **AI-augmented, human-led:** AI assists; humans decide and act
>
> **This isn't just a dashboard. It's a system that drives outcomes.**"

---

### [17:00-18:00] Next Steps & Call to Action

**Objective:** Convert interest into next steps.

**Script:**

> "That's the platform. **What resonates most with your team?**
>
> **Typical next steps:**
> 1. **Pilot discussion:** Map your organization's use cases to these workflows
> 2. **Custom demo:** We can tailor a demo to your specific metrics (your cohorts, your plans)
> 3. **ROI modeling:** Estimate impact on your Star Ratings, adherence, and operational efficiency
>
> **Questions?"

---

## [18:00-28:00] Q&A (10 minutes)

### Anticipated Questions & Answers

#### Q: "Is this built on Sigma / Looker / Tableau?"
**A:** "This demo is built on [BI Tool Name]. The design principles—governed metrics, RLS, lineage—work across modern BI platforms. We can implement this on your existing stack or recommend best-fit tools."

#### Q: "How long does implementation take?"
**A:** "For a demo-scale pilot (your data, 3-5 dashboards), typically 4-6 weeks. Production-ready, multi-tenant deployment: 3-4 months depending on data complexity and integrations."

#### Q: "Can we integrate with our existing claims data?"
**A:** "Yes. This demo uses synthetic data for privacy, but the schema is modeled on standard claims formats (837, NCPDP). We'll map your feeds to our data contracts during onboarding."

#### Q: "What about HIPAA compliance?"
**A:** "The platform supports HIPAA-compliant deployments: RLS for entitlements, audit logging, encrypted at rest and in transit. This demo uses 100% synthetic data; production deployments follow your PHI handling policies and BAAs."

#### Q: "How do you prevent alert fatigue?"
**A:** "Three ways: (1) We start with 5-7 high-signal rules (not 100); (2) Deduplication and cooldown periods; (3) User feedback—if >10% of alerts are marked 'noise,' we re-tune thresholds."

#### Q: "Can users customize dashboards?"
**A:** "Depends on role. Analysts can filter, drill, export. Admins can create new views (with governance approval). End users get curated dashboards to prevent 'shadow BI.' Governance is key."

#### Q: "What if our metric definitions differ from yours?"
**A:** "The metrics catalog is fully customizable. During onboarding, we'll align on your business logic (e.g., how you calculate PDC, adherence thresholds, gap types). The catalog documents your definitions—not ours."

#### Q: "How does the AI avoid hallucinations?"
**A:** "Grounding in source documents (metrics catalog, lineage). The AI retrieves definitions, doesn't invent them. Every response cites a source. We also set guardrails (no writes, no out-of-scope queries)."

#### Q: "What's the pricing model?"
**A:** "[Defer to sales]: 'Pricing depends on data volume, user count, and features. Let's schedule a follow-up to discuss your specific needs and provide a tailored proposal.'"

#### Q: "Do you have customer references?"
**A:** "ACME Pharmacy is a fictional reference architecture for this demo. We have [X real clients] using similar approaches. We can connect you with a reference client under NDA."

#### Q: "Can we see a live demo with our data?"
**A:** "Absolutely. After this call, we'll scope a custom demo with your anonymized or synthetic data. Typical turnaround: 2-3 weeks."

---

## Demo Dos and Don'ts

### ✅ DO:
- **Pause for questions** after each major section
- **Tailor narrative** to audience (if execs in room, emphasize Exec Overview)
- **Use ACME's story** to make it relatable
- **Show, don't just tell:** Click through dashboards live
- **Emphasize impact:** Tie every feature to outcomes (adherence lift, time savings, etc.)
- **Stay on time:** 18-min demo + 10-min Q&A = 28 min total

### ❌ DON'T:
- **Rush through slides:** Let visuals breathe; pause for comprehension
- **Get lost in technical weeds:** Avoid SQL syntax details unless asked
- **Skip the "so what":** Every chart needs business context
- **Over-promise:** Stick to what's in scope; defer v2.0 features to roadmap conversation
- **Ignore the audience:** If attendees look confused, pause and clarify

---

## Post-Demo Follow-Up

**Within 24 hours:**
- [ ] Send thank-you email with:
  - Demo recording (if permitted)
  - 1-page summary PDF (key features + ACME impact)
  - Link to request custom demo
  - Post-demo survey (5 questions, <2 min)

**Within 1 week:**
- [ ] Review survey responses
- [ ] Log feedback themes in product backlog
- [ ] Schedule follow-up call if prospect requested next steps

---

**Related:**
- [Success Criteria](success_criteria.md) — How we measure demo effectiveness
- [Rollout Plan](rollout_plan.md) — Phased demo delivery strategy
- [Acceptance Tests](acceptance_tests.md) — Validation scenarios
