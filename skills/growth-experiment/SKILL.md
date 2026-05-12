---
name: growth-experiment
description: "Identify the true conversion bottleneck and design an experiment that addresses root cause — the difference between a 2% button-color lift and a 10x funnel fix."
---
# /growth-experiment

Growth teams that run button color tests are not running growth experiments — they're running UI experiments. The bottleneck is almost never the button. It's the moment 60% of your activated users hit a friction point and quietly leave, or the acquisition channel flooding your funnel with users who never had purchase intent. This skill forces a structured bottleneck diagnosis before any experiment is designed — so the experiment addresses the real drop-off, not the loudest hypothesis in the room.

**The Leaky Bucket — Find the Worst Stage**
Map your funnel with actual numbers at each stage:
- Acquisition → Activation → Habit → Retention → Revenue → Referral
- Where is the largest absolute drop? (Not the largest percentage drop — the stage where the most people fall off in raw numbers)
- Where has drop-off worsened in the last 90 days?
- Which stage, if fixed, would most move your north-star metric?
- This is your bottleneck stage. Everything below is downstream; everything above is upstream. Work here first.

**Which Cohort Is Worst**
- Segment the bottleneck stage by acquisition channel: which source produces users who convert at half the average rate?
- Segment by product version, plan tier, or user persona if applicable
- Segment by time: is drop-off worse for users acquired in the last 30 days, or is it consistent across cohorts?
- Find the cohort that is 2x worse than your best-performing cohort — that gap is your experiment opportunity

**The Behavior Signal**
- What do users in the worst cohort actually do before they drop off? (Session replay, click maps, event logs)
- What do users who convert do differently? (Even one behavioral difference is a hypothesis)
- What's the last thing users in the drop-off cohort interact with before they leave?
- Have you surveyed the drop-offs? (Exit surveys with a single question often surface root cause faster than analytics)

**Root Cause Hypothesis — Pick One**
- State it as a falsifiable claim: "Users drop at the [step] because [mechanism], which we know because [evidence]"
- Example: "Users drop at the team-invite step because the value of the product is only visible after 3+ colleagues join, and solo users hit a dead end — evidenced by 72% of 7-day churners having zero connected teammates"
- What's the alternative hypothesis you're not pursuing? Why?
- Is this a motivation problem (users don't understand why to do it), a friction problem (they want to but can't easily), or a fit problem (wrong user in the funnel)?

**Experiment Design**
- What's the minimum change that tests the hypothesis? (Not a redesign — one targeted intervention)
- What is the control group experiencing today?
- What exactly changes for the treatment group?
- What's the primary metric — conversion through the bottleneck stage, not a vanity metric
- What's the minimum detectable effect at your current traffic volume? (Use your actual weekly users — don't run an underpowered test)
- How many weeks do you need to reach statistical significance?

**Realistic Impact Estimate**
- If the hypothesis is correct and the experiment works, what does the funnel metric improve to?
- What does that improvement translate to in revenue or growth rate over 12 months?
- Is this a one-time lift or does it compound?
- What's the downside if it doesn't work — is the variant clearly worse, or just neutral?

**Rules**
1. The bottleneck stage must be identified with actual funnel data before an experiment is proposed — no skipping to ideation
2. One hypothesis per experiment — testing multiple changes simultaneously is not an experiment
3. The root cause must be classified as motivation/friction/fit — this determines the type of intervention
4. You must have enough weekly traffic to reach significance in under 6 weeks — if not, redesign the scope
5. The primary metric must be a conversion rate, not an engagement metric

This output is a single experiment brief tied to the real bottleneck — with a root cause hypothesis, a specific change, a traffic calculation, and an impact estimate that justifies running it.
