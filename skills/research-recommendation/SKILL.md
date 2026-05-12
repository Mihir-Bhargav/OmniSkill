---
name: research-recommendation
description: "Convert qualitative research findings into a single actionable design recommendation — so findings ship instead of sitting in a Confluence page nobody reads."
---
# /research-recommendation

Ten findings with equal weight is a way to say nothing. Research teams produce reports; design teams need a single prioritized recommendation backed by evidence and tied to a business metric. The gap between the two is why most UX research collects dust. The problem isn't research quality — it's that the synthesis step gets skipped. Researchers list what they heard; nobody takes the step of saying "this one, not the others, because of this evidence, and here's how we know it worked." This skill forces that step.

**The Pattern — Separate Signal from Outlier**
- What problem came up across the majority of sessions — unprompted, in similar language, with similar consequences?
- How many participants mentioned it? (3 out of 5 is a pattern; 1 out of 5 is a note)
- What was the exact language they used? (Verbatim — their words will be more precise than your paraphrase)
- What behavior did they exhibit that corroborates what they said? (Clicks, hesitations, workarounds, abandonment)
- What did you observe that participants didn't mention but is clearly a problem? (Silent behavior is often more honest than stated feedback)

**The Business Impact of Fixing It**
- Which product metric does this problem affect? Be specific: trial-to-paid conversion, 7-day retention, feature adoption rate, support ticket volume for a specific issue, NPS for a specific user segment
- What's the current metric level? What would a 10-15% improvement look like in revenue or cost terms?
- Is there an existing benchmark — A/B test, competitive data, industry average — that gives you a range for what improvement is plausible?
- What's the cost of not fixing it? (Users churning to a competitor? Support team absorbing friction? Enterprise deals stalling on a specific flow?)

**The Specific Design Change**
- Describe the change in one sentence. Not "improve the onboarding flow" — "add a progress indicator to the 4-step setup wizard so users understand they're 75% done at Step 3 where 60% currently abandon"
- What specifically changes for the user? Before state, after state.
- What is explicitly NOT changing in this recommendation? (Scope boundary prevents the change from expanding into a 3-month redesign)
- Is this change implementable in one sprint, or does it require a longer arc? If longer, what's the Phase 1?

**Why This One and Not the Others**
- What were the other findings from this round of research?
- Why is this recommendation the priority? (Frequency? Severity of consequence? Ease of fix relative to impact? Strategic alignment?)
- What's the second-priority finding, and what would need to be true for it to move up?

**How to Measure It Worked**
- What metric will you track, and at what time horizon? (Some usability changes show up in 2 weeks; some retention changes take 60 days)
- What's the minimum improvement that justifies the engineering cost?
- What does failure look like — and what would you do if the metric doesn't move?

**Rules**
1. One recommendation, not a list — if you have multiple, this skill produces one output and queues the rest
2. The design change must be specific enough for an engineer to estimate — "improve clarity" is not a design change
3. Business metric must be named — a recommendation without a success metric cannot be prioritized against other work
4. The "why this one" section is mandatory — skipping it means leadership will reorder based on opinion
5. Verbatim participant language must appear in the output — it's the most persuasive evidence in a design review

This output is a one-page recommendation you can take to a design critique, a sprint planning session, or a leadership review — with evidence, a specific change, and a measurement plan attached.
