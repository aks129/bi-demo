# Metrics Catalog

## Adherence Metrics

### PDC_90 (Proportion of Days Covered, 90-day window)
**Business Definition:** Percentage of days a member has medication available over a 90-day period
**Formula:** 
**Threshold:** ≥80% is considered adherent (CMS Star Ratings standard)
**SQL Pattern:**

**Source Tables:** fact_claims → intermediate: adherence_daily → fact_adherence
**Owner:** Clinical SME
**Update Frequency:** Daily

### MPR_90 (Medication Possession Ratio, 90-day)
**Business Definition:** Sum of days supply divided by 90 days
**Formula:** 
**Difference from PDC:** MPR can exceed 100% if early refills occur
**SQL Pattern:**


## Gap Closure Metrics

### Gap Closure Cycle Time
**Business Definition:** Median days from gap detection to gap resolved
**Formula:** 
**Target:** ≤14 days
**SQL:**


## Star Ratings Metrics

### Star Ratings Proxy
**Business Definition:** Composite score approximating CMS Star Ratings
**Components:** Adherence (PDC ≥80%), CMR completion rate, Gap closure rate
**Formula:** Weighted average of component scores
**Target:** ≥4.0 stars

---

**Related:**
- [Schemas](schemas.md)
- [Governance](../governance.md)
