---
name: metric-diagnosis
description: "Diagnose why a metric shifted and build a narrative that makes stakeholders act — turns 'retention dropped 2%' into a specific cause with a specific fix."
---
# /metric-diagnosis

"Retention dropped 2%" gets filed away. "Retention dropped 2% in mobile users acquired via paid in the last 45 days, tied to a UX change in the activation flow, and here's what to change by Friday" gets acted on. The difference isn't the data — it's the diagnosis and the narrative. Most analysts stop at the first chart. The business consequence of stopping there is that stakeholders nod, file the number, and do nothing. This skill forces the full diagnostic loop: what changed, who's affected, why it happened, what it costs, and what to do.

**What Changed and When**
- Name the metric, the current level, the prior baseline, and the change in absolute and percentage terms
- When exactly did it start moving? (Date, not "recently") — is the change a step function or a gradual drift?
- Is this metric tracked daily, weekly, or monthly? At what granularity was the shift first visible?
- Is the shift within normal variance or outside it? What's the historical standard deviation? (A 2% drop in a metric that swings 5% weekly is noise; a 2% drop in a metric that's been flat for 6 months is signal)

**Which Cohort Is Affected**
- Segment by acquisition channel: does the drop exist in organic, paid, and referral equally, or is it concentrated?
- Segment by product version or platform: mobile vs. desktop, old UI vs. new UI, free vs. paid tier
- Segment by cohort date: is this a new-user problem (cohorts from the last 30 days) or an existing-user problem (cohorts from 6+ months ago)?
- Segment by geography or customer segment if relevant
- The goal: find the 20% of the user base that accounts for 80% of the drop — that's where the diagnosis becomes actionable

**The Likely Cause — Pick One Hypothesis**
- What changed in the product, go-to-market, or competitive environment in the 2-4 weeks before the metric shifted?
- What's the most plausible mechanism? (Feature change altered a key flow; paid acquisition started driving lower-intent users; a competitor shipped a specific feature; seasonal pattern this cohort didn't show last year)
- What data confirms this hypothesis? What data would rule it out?
- What's the alternative hypothesis you're not picking, and why?

**Business Impact — Quantify It**
- What's the annualized revenue impact of the current metric level vs. baseline? (Even a rough calculation: X users * $Y ACV * Z% delta = $W at risk)
- Which stakeholder's target does this metric affect — sales, growth, product, or finance?
- Is this a lagging indicator (the business damage is already done) or a leading indicator (you're seeing the early signal of a larger problem)?
- At what point does this become a board-level conversation?

**What to Do About It**
- Given the cohort affected and the likely cause, what's the specific intervention?
- Who owns it? What's the timeline to implement and see impact?
- What's the 48-hour action — what can be done this week while the full fix is designed?

**Confidence Level**
- How confident are you in the root cause hypothesis? (High: confirmed by multiple data cuts. Medium: one data cut supports it. Low: directionally plausible but more investigation needed)
- What additional analysis would move your confidence from medium to high?
- What would change your conclusion entirely?

**Rules**
1. The metric must be baselined before any cohort analysis — percentage drops with no baseline are meaningless
2. The cohort analysis must segment on at least 2 dimensions before a hypothesis is formed
3. One hypothesis only — multiple hypotheses produce paralysis, not action
4. Business impact must be quantified in dollars or at least directionally estimated
5. The output must include a named owner and a specific next action — not a recommendation to "investigate further"

This diagnosis produces a stakeholder-ready narrative with a root cause, a business impact number, and a specific action — the difference between a metric that gets watched and one that gets fixed.
