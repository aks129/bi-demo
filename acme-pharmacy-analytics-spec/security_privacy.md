# Security & Privacy

**Last Updated:** 2025-10-19

## PII/PHI Handling for Demo

### Synthetic Data Only
- **Zero Real PHI/PII:** All member names, DOBs, addresses, SSNs generated via Faker library
- **Validation:** Pre-commit hooks scan for SSN patterns, real email domains
- **Sign-Off:** Compliance team approves all data generation scripts

### HIPAA Posture (Demo Environment)
**This is a DEMO environment using 100% synthetic data. HIPAA does not apply.**

**If transitioned to production:**
- Business Associate Agreement (BAA) required with cloud provider
- Encryption at rest (AES-256) and in transit (TLS 1.2+)
- Access logging and monitoring
- Incident response plan
- Annual risk assessments

## Row-Level Security (RLS) Strategy

### Scoping Mechanisms
| Role | RLS Filter | Example |
|------|------------|---------|
| CLIENT_VIEWER (ACME) | `WHERE client_id = 'ACME'` | Sees only ACME Pharmacy data |
| CLIENT_ADMIN (ACME) | `WHERE client_id = 'ACME'` | Same scope; can manage users |
| INTERNAL_OPS | No client filter | Sees all clients (for ops monitoring) |
| PRODUCT | Aggregated only | No client-specific PII; usage metrics only |
| COMPLIANCE | Audit access | Read-only; full visibility for audits |
| EXEC (Internal) | `WHERE org_id = 'Outcomes'` | Internal org only |

### RLS Enforcement
- **BI Tool Native:** Sigma User Attributes, Looker access_grants, Tableau entitlements table
- **Backup Warehouse-Level:** Snowflake row access policies as secondary enforcement
- **Testing:** Automated tests per role (see acceptance_tests.md)

## Audit Trail

### What We Log
- All BI queries (user, SQL, timestamp, filters applied)
- AI chat queries and responses
- Alert triages and resolutions
- User login/logout events
- RLS policy changes

### Retention
- **Demo:** 90 days
- **Production:** 1 year minimum (configurable to 7 years for regulatory compliance)

---

**Related:**
- [Risks & Mitigations](risks_and_mitigations.md) — SP-* risks
- [RBAC](requirements/rbac.md) — Role definitions
- [Governance](governance.md) — Data stewardship
