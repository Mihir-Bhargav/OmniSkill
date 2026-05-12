---
name: security-risk
description: "Translate technical vulnerabilities into a business-impact risk assessment that gets resources approved — not filed and forgotten."
---
# /security-risk

"We found 10,000 vulnerabilities" gets zero budget. Security teams that communicate in CVE numbers, CVSS scores, and patch counts are speaking a language executives don't use to make decisions. Executives make resource decisions based on business impact: what could go wrong, what would it cost, what does prevention cost, and is the ratio favorable? A security assessment written in business language — "a successful attack on this system would expose 400,000 customer records, trigger $3-8M in regulatory fines, and halt revenue operations for 3-5 days" — gets a very different response than a vulnerability scan report. This skill translates technical findings into business-impact framing that gets the meeting, the budget, and the remediation plan.

**Assets That Matter Most**
- Name the assets — systems, data, operations — that the business cannot afford to lose, expose, or have unavailable. Not every asset in the inventory; the ones where compromise has measurable business consequences.
- For each asset, name the business impact of compromise in three modes: confidentiality breach (what data, affecting whom, regulatory category), integrity failure (what decisions or operations depend on this data being accurate), availability loss (what revenue or operations stop if this system is down, for how long?).
- Translate availability loss to dollars: "Revenue processing system down for 24 hours = $140K in delayed transactions, $20K in SLA penalties, and $50K in incident response cost."
- Prioritize the asset list by business impact, not by technical criticality. These often differ.

**Threat Actors and Their Motivations**
- Name the realistic threat actors for your organization. Not "nation-state APTs" unless your organization is genuinely a target — "financially motivated ransomware groups targeting healthcare organizations with revenue above $50M."
- For each threat actor: what do they want (data to sell, ransom payment, operational disruption, competitive intelligence), how sophisticated are they, and what is their likely attack path into your environment?
- Matching threat actors to assets: which threat actors care about which assets, and why? This mapping determines which vulnerabilities are actually exploitable by actors who are actually motivated.

**Likelihood × Impact for Each Vulnerability**
- Don't present every vulnerability — present the ones where likelihood × impact exceeds a threshold worth executive attention.
- For each significant finding: likelihood (probability of exploitation given current threat actor capability and access opportunity — not CVSS score), impact (business impact in dollars or operational terms, from the asset analysis above), and current control effectiveness (what's currently reducing the risk, and how much?).
- Risk = likelihood × impact, net of current controls. A high-CVSS vulnerability on an internal system with no internet exposure and strong access controls has a different business risk than a medium-CVSS vulnerability on a customer-facing system with known exploit code in the wild.
- Present no more than 10 findings. If you have 200 vulnerabilities, group them by risk level and present the top tier.

**Risk Reduction Per Dollar for Proposed Controls**
- For each proposed control, calculate the risk reduction: "Implementing MFA on all privileged accounts reduces likelihood of credential-based attack from 40% to 8%, reducing expected annual loss from $2.4M to $480K — a $1.92M reduction in expected annual loss."
- Cost of control: not just license fee — implementation cost, operational overhead, productivity impact.
- Risk reduction per dollar = annual expected loss reduction / annualized cost of control. Present this ratio explicitly. It converts security investment from a cost center argument to an ROI argument.
- Prioritize controls by this ratio. The control that reduces the most risk per dollar spent comes first.

**Residual Risk If Nothing Is Approved**
- Name the expected annual loss if no new controls are implemented: sum of (probability of each significant event × business impact).
- "If we take no action on the top 5 findings, our expected annual loss from security incidents is $3.2M, based on incident probability and impact estimates above."
- This is not fear-mongering — it's the baseline against which investment is evaluated. Without a baseline, the executive has no reference point for whether $400K in security spending is a good deal.

**The Ask in Business Language**
- State the ask as a business investment: "We're requesting $380K in budget and 2 FTE-months of engineering time to implement these 4 controls, which reduces expected annual loss by $2.1M — a 5.5× return in the first year."
- Separate asks by urgency: "Immediate (30 days): [critical, cheapest-to-fix items]." "Short-term (90 days): [highest ROI items requiring planning]." "Medium-term (6-12 months): [architectural changes requiring roadmap inclusion]."
- Every ask has an owner and a timeline. "The security team will implement X" is not sufficient — name which team member, with what other team's help, by what date.

**Rules**
1. Business impact is in dollars, not severity ratings. "Critical" means nothing; "$2.4M expected annual loss" means something.
2. Threat actors are realistic for your organization, not the scariest possible scenario.
3. Likelihood estimates are based on your actual environment and threat landscape — not copied from CVSS scores.
4. Present no more than 10 findings. Group the rest. Executive attention is finite.
5. Every proposed control has a calculated risk reduction per dollar.
6. Residual risk is presented explicitly. The cost of inaction must be visible.

The output is a risk assessment document that an executive can read in 15 minutes, understand without a security background, use to make a resource allocation decision, and use to justify that decision to the board.
