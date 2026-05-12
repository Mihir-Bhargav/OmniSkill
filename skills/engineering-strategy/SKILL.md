---
name: engineering-strategy
description: "Build a technical strategy and multi-quarter roadmap that translates tech debt into product velocity cost — so it actually gets funded."
---
# /engineering-strategy

"We need to pay down tech debt" gets no resources because it's a cost without a return. "Here is the specific debt that is adding 3 weeks to every feature in our payments module, at a cost of $420K/yr in engineering time — here's what a 2-sprint investment looks like and what it unblocks" gets a sprint. This skill forces you to connect technical state to product impact in language that a CEO or board can fund, then produces a multi-quarter roadmap that sequences debt paydown alongside feature investment without stalling either.

**Current Technical Footprint**

- Architecture overview: what are the major components, and what are the boundaries between them?
- Where does the on-call rotation spend most of its time? (This is the first indicator of where debt lives)
- What are the top 3 complaints from engineers about velocity? (Be specific: "the auth service requires a full redeployment for any config change" not "legacy code")
- Where has the team shipped slowest over the last 2 quarters — and is the slowness due to technical complexity or product complexity?
- What are the top 3 scaling bottlenecks — the components that will fail first at 5x current load?

**What the Product Roadmap Requires**

- Top 3-5 product initiatives for the next 2 quarters — and what technical capabilities each requires
- For each initiative: does the current architecture support it cleanly, require workarounds, or block it entirely?
- What new infrastructure will be required (new data store, streaming layer, third-party integration)?
- Which product initiative is most at risk from current technical state?

**Debt Hotspot Analysis — 3-4 highest-leverage items:**

For each debt item:
- Where it lives (service, component, module)
- How it currently impacts velocity (time added per feature, incidents per month, engineer frustration score)
- The product initiative it's blocking or slowing
- Effort to fix: engineer-weeks, risk of the migration itself
- Impact if fixed: what becomes possible, how much velocity is recovered?
- Cost of delay: if you don't fix this in the next quarter, what does that cost in engineering time over 12 months?

**Sequencing That Unblocks Product Velocity**

- What must be done before the product roadmap's highest-priority initiative can move?
- Which debt items can be addressed in parallel with feature work (low migration risk)?
- Which debt items require a dedicated sprint or a "freeze + fix" window?
- The sequencing that produces the most product velocity in the shortest time — not the most elegant architecture

**Org and Hiring Implications**

- What skills does the current team not have that the technical roadmap requires?
- Which initiatives require a specialist hire (security, data engineering, ML infra)?
- What does the team structure need to look like in 12 months vs today?
- Which current ownership boundaries create the most friction — and should teams be reorganized?

**The Technical Health Score**

- 3-5 metrics that proxy for technical health: deployment frequency, mean time to restore (MTTR), change failure rate, test coverage on critical paths, p99 latency trends
- Current state vs target state for each
- What changes these metrics — and are those changes planned?

## Rules

1. Debt items must be connected to product velocity impact. Cost without a product outcome won't get funded.
2. Every debt item needs an effort estimate and a "cost of delay." If you don't know the cost of delay, estimate it — don't omit it.
3. Scaling bottlenecks must be assessed for the actual expected load, not 100x theoretical load.
4. Architecture purity is not a goal. The goal is product velocity at acceptable operational cost.
5. Hiring plans must be tied to specific roadmap gaps — not "we should have more engineers."
6. The roadmap must be readable by a non-technical CEO. If the framing requires a glossary, rewrite it.

The output of this skill is a technical strategy brief: the 3 debt hotspots with quantified cost, the sequencing that unblocks the product roadmap, the hiring gaps, and the 3 technical health metrics you'll report quarterly — ready for the board engineering review.
