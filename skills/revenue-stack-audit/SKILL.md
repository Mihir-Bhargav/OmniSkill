---
name: revenue-stack-audit
description: "Audit and unify data definitions across your sales and CS stack so leadership stops making decisions on fiction."
---
# /revenue-stack-audit

Your CRM says pipeline is $4.2M. Your BI tool says $3.1M. Finance says $2.8M. Everyone is right — and that's the problem. When Salesforce, HubSpot, Gainsight, and your data warehouse each own a piece of revenue truth, and each team has drifted the definitions, no single number means anything. This skill maps every system to what it actually owns, finds every definition that has diverged, and produces a unified data model — plus a migration sequence that doesn't blow up reporting mid-quarter.

**System Inventory — for each tool in your stack:**

- System name and primary owner (team + DRI)
- What data it is the system of record for
- What data it holds but is NOT the system of record for (these are the conflict zones)
- How frequently it syncs with other systems and in which direction
- Who has write access vs read-only access

**Definition Divergence Audit — find where these definitions differ across systems:**

- "Deal stage" — does Stage 4 in Salesforce mean the same thing as "Commit" in the forecast sheet?
- "Closed won date" — contract signature, invoice sent, cash received, or go-live?
- "Churn" — non-renewal, downgrade, or any contraction? Does partial churn count?
- "Expansion revenue" — upsell, cross-sell, both? Is a new SKU to an existing account new business or expansion?
- "Active customer" — paying, deployed, or engaged? Does a paused subscription count?
- "Pipeline coverage" — which stages are included? Is it weighted or unweighted?
- "CAC" — sales + marketing only, or including customer success for expansion?

**Conflict Impact Assessment**

For each definition conflict: who depends on this number, what decisions it drives, and what the dollar difference is between the two conflicting definitions. A conflict that doesn't touch a decision doesn't need to be resolved first.

**Unified Data Model**

- Canonical definition for each term — written as if you're publishing it to all teams
- Which system is the system of record for each definition
- What transformations are required to reconcile historical data
- What existing reports break when you adopt the canonical definition, and who owns fixing them

**Implementation Sequence**

- Which definition conflicts to resolve first (highest impact to reporting, lowest migration complexity)
- What must be frozen (no schema changes) during the migration window
- How to run dual-reporting during transition — so leadership has both old and new numbers until the cut-over is validated
- The exact cut-over gate: what does "validated" mean before you decommission the old definition?

**Governance Going Forward**

- Who owns the data dictionary — one person, not a committee
- The process for proposing a new definition or changing an existing one
- How often definitions are reviewed

## Rules

1. Every definition must have a single system of record. "It lives in both" means it lives in neither.
2. Historical data reconciliation is not optional — if you change a definition without reconciling history, you break YoY comparisons.
3. Resolve conflicts by impact to decisions, not by which team is loudest.
4. Dual-reporting during transition is non-negotiable. Cold cut-overs destroy board credibility.
5. Governance without a named owner is decoration. Committees don't maintain data dictionaries.

The output of this skill is a data dictionary and migration brief — what each term means, where it lives, and the sequence to get from current state to single source of truth without a reporting fire.
