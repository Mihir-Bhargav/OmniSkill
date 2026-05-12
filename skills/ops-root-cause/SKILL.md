---
name: ops-root-cause
description: "Analyze an operational problem to find systemic root cause and design an intervention — stops the team from fixing symptoms while the real issue compounds."
---
# /ops-root-cause

"Sales needs better training" is almost never the root cause. Neither is "we need more headcount" or "the process is broken." These are the answers you get when you ask what's wrong — they're descriptions of the visible failure, not its source. Operational problems persist because organizations act on the symptom that's easiest to see and politically safest to address. This skill forces a structured diagnostic: metric first, upstream drivers second, systemic cause third, intervention design last.

**The Actual Metric — Not the Symptom**
- What is the specific metric that is underperforming? Name the number, the current level, and the target.
- Example: "Time-to-first-response for enterprise support tickets is 14 hours. Target is 4 hours. Been trending up for 6 weeks."
- Is this metric directly measuring the problem or is it a proxy? If proxy, what's the underlying issue it's tracking?
- What's the business consequence of this metric staying where it is? (Churn rate? Contract renewal risk? Sales cycle length? NPS?)

**Upstream Drivers — Map 4-5**
List the factors that could plausibly be causing this metric to underperform. For each:
- Is there data that confirms or rules it out?
- Who owns this driver — and does that person know it's a driver?
- Is the driver worsening, stable, or improving?
- Example drivers for slow support response: ticket volume up 40% without headcount increase; triaging step requires senior engineer approval; SLA not defined in support tool; new product area generating 60% of tickets but team not trained on it

**The Broken Driver — Pick One**
- Which driver, if fixed, would most move the metric?
- What type of failure is it? (Incentive: nobody's measured or rewarded on this. Process: the workflow breaks down at a specific step. Data: decision-makers can't see the information they need. Structure: the wrong team owns this.)
- What evidence points to this being root cause versus a contributing factor?
- Who will resist fixing this, and why? (Naming political friction is part of the diagnosis)

**Intervention Design**
- What is the minimum viable change that tests whether you've identified the right root cause?
- Who needs to be involved to make the change? Who has veto power?
- What needs to be true about the organization for this intervention to hold? (Is there a leader who will reinforce the new behavior? Is the change self-reinforcing or will it decay?)
- What is explicitly NOT part of this intervention? (Define scope boundary to avoid ballooning)

**The Pilot**
- Which team, geography, or customer segment runs the pilot?
- What's the timeline? (8 weeks minimum to see metric movement for most operational changes)
- What leading indicator will you track weekly to know if the pilot is working before the 8 weeks are up?
- What's the exit criteria — when do you call it a success and scale? When do you call it a failure and rediagnose?

**The Improvement Hypothesis**
- State it: "If we change X, the metric will move from A to B within N weeks, because Z."
- What's your confidence level? What would make you more confident?
- What's the 20% or more improvement case — is it achievable with this intervention, or would it require addressing a second driver?

**Rules**
1. The metric must be named and baselined before any driver analysis begins
2. You must list at least 4 upstream drivers before picking one — picking early produces confirmation bias
3. The root cause must be classified as incentive/process/data/structure — "it's broken" is not a classification
4. The intervention must be testable in a pilot before org-wide rollout
5. Political friction must be named — interventions that ignore it fail at implementation

This diagnostic produces a specific intervention with a testable hypothesis and a named owner — not a recommendation to "improve the process" that gets filed and forgotten.
