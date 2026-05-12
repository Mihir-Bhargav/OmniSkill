---
name: supply-strategy
description: "Design a supply chain strategy that maps vulnerabilities explicitly and treats resilience as a deliberate cost-benefit decision, not an afterthought."
---
# /supply-strategy

Cost-optimized supply chains break under stress — and the stress always comes. Single-source suppliers in geopolitically unstable regions, lead times that assume zero disruption, working capital tied up in ocean freight assumptions that haven't been true since 2020. The companies that survived the last five years of supply shocks had one thing in common: they had already mapped their vulnerabilities and made explicit decisions about which ones to hedge and which to accept. This skill builds that map and forces the tradeoffs into the open before the disruption hits — not in the middle of a customer escalation.

**Critical Sourcing Nodes: Single Points of Failure**
- Map every tier of your supply chain that you depend on and cannot quickly replace. Tier 1 suppliers are visible — Tier 2 and Tier 3 are where the surprises happen.
- For each node ask: what's our fallback if this supplier stops shipping tomorrow? If the answer is "we don't have one," it's a single point of failure.
- Name every SPOF explicitly: supplier name, category, revenue at risk if this node fails, lead time to qualify an alternative.
- Categorize each SPOF by severity: catastrophic (shuts down production), major (impacts >30% of revenue), manageable (impacts a specific SKU or market).
- The goal of this exercise is not to eliminate all SPOFs — some are too costly to hedge. The goal is to make the choice explicit: "We accept the risk of [SPOF X] because the hedging cost ($400K/year in dual sourcing) exceeds the expected cost of disruption."

**Lead Time Constraints by Category**
- For each product category, document: standard lead time (current), minimum achievable lead time (if expedited, what does it cost), and maximum tolerable delay (at what point does a stockout cause a customer or revenue impact?).
- Identify categories where lead time is a competitive differentiator vs categories where it's just an operational constraint.
- Flag: where does your lead time assumption depend on transport modes that are currently stressed? Ocean freight in peak season, air freight capacity constraints, cross-border trucking that depends on regulatory stability?

**Working Capital Trade-offs**
- Inventory is working capital parked in a warehouse. Safety stock is insurance — it has a premium.
- For each category: what's the current safety stock level, what disruption event would it cover, and what does it cost to hold?
- Calculate the carrying cost explicitly: (holding cost % × average inventory value). Typical holding cost including capital, storage, and risk of obsolescence: 20-30% per year.
- The decision: for each category, is the insurance worth the premium? High holding cost + low disruption probability + fast recovery = hold less. Low holding cost + high disruption probability + slow recovery = hold more.

**Nearshore vs Offshore Decision by Product Category**
- Run the true landed cost comparison for each category: offshore unit cost + freight + duties + inventory carrying cost (higher with longer lead times) + disruption hedge cost.
- The offshore arbitrage often disappears when you include the full cost. For which categories?
- For each category, evaluate: what is the speed premium of nearshore? What's the cost differential? What risk reduction does nearshore provide?
- Decision matrix: offshore wins when unit cost differential exceeds (freight + holding cost + risk hedge). Nearshore wins when speed, flexibility, or risk reduction has measurable business value.

**Early Warning Signals of Disruption**
- Name 5-7 signals you can monitor that precede a supply disruption by 4-8 weeks. Examples: freight index movements (Freightos Baltic Index), supplier financial health indicators, geopolitical news in source regions, port congestion data, raw material spot price spikes.
- For each signal: what threshold triggers an escalation? Who is responsible for monitoring it? What is the response protocol?
- The difference between a supply chain that reacts to disruption and one that anticipates it is entirely a function of whether someone is watching these signals with authority to act.

**Contingency for Top 3 Failure Modes**
- Name the three most likely disruptions to your supply chain in the next 18 months. Not the catastrophic-but-unlikely scenarios — the ones that keep your ops team up at night.
- For each: write the contingency plan in operational detail. "Find alternative suppliers" is not a plan. "We have pre-qualified supplier Y in Mexico with a 6-week onboarding window and a capacity of 40% of our volume; activation requires [these 3 steps]" is a plan.
- Assign an owner to each contingency and schedule a test or review date.

**Rules**
1. Every SPOF is named and categorized. "We have some concentration risk" is not a supply chain strategy.
2. The nearshore vs offshore decision uses fully loaded landed cost, not factory gate price.
3. Working capital decisions are made explicitly against carrying cost — not held at historical levels by default.
4. Early warning signals have thresholds and owners. Monitoring without authority to act is theater.
5. Contingency plans have operational specificity. A plan that says "escalate to leadership" is not operational.
6. Resilience investments are evaluated against expected disruption cost. Some risks are cheaper to accept than to hedge.

The output is a supply strategy document that your COO can use to allocate hedging investment, your procurement team can use to prioritize supplier development, and your board can read to understand exactly what risks you're carrying and why.
