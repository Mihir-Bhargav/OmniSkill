---
name: gh-adr
description: "Writes an Architecture Decision Record — captures the decision, the context, the alternatives, and the consequences."
---
# /gh-adr

Six months from now, someone will look at this code and wonder why it was done this way. They'll either change it without understanding the constraints that shaped the decision — and reintroduce the problem it solved — or they'll be too afraid to change it because they don't know if it's load-bearing. An ADR prevents both.

Write an Architecture Decision Record for the decision described in this conversation.

**Title**
ADR-[number]: [Short noun phrase describing the decision, e.g. "Use event sourcing for order state"]

**Status**
Proposed / Accepted / Deprecated / Superseded by ADR-[n]

**Context**
What situation forced this decision? What constraints exist (technical, organisational, time)? What problem were we trying to solve? This section should make a reader understand why a decision was needed at all — not just what was decided.

**Decision**
State the decision in one clear sentence. Then explain the approach in enough detail that someone can understand and implement it without asking follow-up questions.

**Alternatives considered**
For each alternative that was seriously evaluated:
- What it was
- Why it was attractive
- Why it was rejected

Don't list straw-man alternatives. Only include options that were genuinely considered.

**Consequences**
The honest tradeoffs of the decision made:
- What becomes easier because of this decision
- What becomes harder
- What new problems this decision introduces
- What this decision constrains in the future (doors it closes)

**Review date**
When should this decision be revisited? Some decisions are permanent; others should be reassessed when the team grows, when load increases, or when a specific technology matures.

Rules:
- An ADR is a record of a decision, not a justification — include the downsides honestly
- Future readers will trust an ADR that acknowledges tradeoffs more than one that only argues for the chosen option
- Keep it short — a one-page ADR that gets read beats a five-page one that doesn't
- One decision per ADR — if two decisions are coupled, write two ADRs that reference each other
