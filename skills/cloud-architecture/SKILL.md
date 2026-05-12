---
name: cloud-architecture
description: "Design a cloud architecture for a specific workload with explicit cost, operational burden, and tradeoff analysis — so you ship the right system, not the fashionable one."
---
# /cloud-architecture

The blank architecture whiteboard produces two failure modes: gold-plated microservices for a 100-user app, or a band-aid monolith that shatters at 10x load. Both happen because architects start with patterns instead of constraints. This skill forces you to state your workload's actual requirements before touching a diagram — then generates 2-3 concrete options with explicit cost estimates, operational burden, and the hidden assumptions baked into each.

**Workload Requirements**

- Peak throughput (requests/sec or events/sec) and average throughput — what is the ratio?
- Latency budget: p50 / p99 targets at peak load
- Uptime requirement: 99.9% vs 99.99% is not the same architecture or cost
- Data residency or compliance constraints (HIPAA, SOC 2, GDPR, FedRAMP)?
- What does a failure look like to the end user — degraded, or catastrophic?

**Workload Characteristics**

- Traffic pattern: steady-state (e.g., internal tooling) or spiky (e.g., ticket sales, batch jobs)?
- Read/write ratio. Is this I/O-bound or compute-bound?
- Stateful or stateless? What data must persist and at what durability?
- Expected data volume in Year 1 and Year 3
- Any external dependencies with their own SLA limits?

**Team Constraints**

- Current stack: what does your team already operate confidently?
- Operational maturity: do you have on-call rotation, runbooks, observability tooling?
- Budget ceiling (monthly cloud spend you can defend to finance)
- Is the team growing? What does a new hire need to be productive in week 1?

**Architecture Options — for each of 2-3 options, state:**

- Core services used and why
- Monthly cost estimate at current load and at 10x load
- Operational burden: what breaks at 2am and who fixes it?
- Scale ceiling: what breaks first and how hard is it to fix?
- Hidden assumption: what must be true about the team, workload, or vendor for this to work?

**Recommendation**

- Which option and the single most important reason
- The one decision you'll regret most if you get it wrong
- What to prototype first to validate the key assumption

## Rules

1. No option can appear without a cost estimate — "it depends" is not an answer.
2. State every assumption explicitly. An assumption that goes unstated will become a production incident.
3. Operational burden must be assessed for the actual team, not an idealized SRE org.
4. Compliance constraints override cost optimization — flag conflicts immediately.
5. The recommendation must name the exact scenario where you'd choose a different option.
6. Serverless is not automatically cheaper at scale. Monolith is not automatically a mistake. Both claims require numbers.

The output of this skill is a decision memo — not a diagram. It names the option chosen, the tradeoffs accepted, and the assumptions that, if wrong, require revisiting the architecture.
