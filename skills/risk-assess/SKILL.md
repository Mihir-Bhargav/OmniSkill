---
name: risk-assess
description: "Identifies risks in a plan or decision — likelihood, impact, and what to do about each."
---
# /risk-assess

Identify and assess the risks in the plan, decision, or situation described in this conversation.

For each risk:
- **Risk** — what could go wrong, stated plainly
- **Likelihood** — low / medium / high, with brief reasoning
- **Impact** — low / medium / high, with brief reasoning
- **Mitigation** — what can be done to reduce likelihood or impact before it happens
- **Contingency** — what to do if it happens anyway

Present them in priority order: highest combined likelihood + impact first.

Then:
**Top risk to address now** — the one thing that most needs action before moving forward

Rules:
- Be specific. "Project delays" is not a risk — "the third-party API going down during the demo" is
- Don't list every conceivable thing that could go wrong — focus on realistic risks
- Mitigations should be actionable, not just "monitor closely"
- If you don't have enough context to assess a risk properly, say so and ask
