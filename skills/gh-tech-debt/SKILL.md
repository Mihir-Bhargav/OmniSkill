---
name: gh-tech-debt
description: "Audits a codebase area for tech debt, prioritises it by real cost, and produces a paydown plan."
---
# /gh-tech-debt

Not all tech debt is equal. Some debt costs you 30 minutes every sprint. Some has been there for 3 years and costs nothing. The mistake is treating all debt the same — either ignoring everything or trying to fix everything at once. The goal is knowing which debt is actively making you slower and addressing that first.

Audit the code or system described in this conversation for tech debt.

**Inventory the debt**
For each item found:
- **What it is** — specific, not "code is messy"
- **Where it lives** — file, module, or system
- **Type** — design debt (wrong abstraction) / code debt (quality) / test debt (missing coverage) / dependency debt (outdated libraries) / documentation debt

**The real cost of each item**
For every debt item, estimate: how often does this slow people down, and by how much? Debt that affects a hot path every day is high-cost. Debt in a module no one touches is not urgent.
- **Frequency** — every sprint / monthly / rarely
- **Slowdown** — 30 min / half day / full day
- **Risk** — is this a bug waiting to happen?

**Prioritised paydown plan**
Ranked by cost-to-fix vs. ongoing cost. High ongoing cost + low fix cost = do it now.

For the top 3 items:
- What specifically needs to change
- How long it would realistically take
- Whether it can be done incrementally or requires a big-bang change
- What tests are needed to make the change safely

**What to leave alone**
Debt items that are low-cost to carry and high-cost to fix. Explicitly deciding not to fix something is better than it staying on a list forever.

Rules:
- Don't flag every imperfection — only debt that has a measurable cost
- Prioritise by impact on development velocity, not aesthetic preference
- If fixing debt requires changing behaviour, that's a feature, not a refactor — flag it
