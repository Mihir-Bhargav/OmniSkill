---
name: gh-feature-flag
description: "Designs a feature flag rollout plan — targeting, graduation criteria, and the cleanup you'll actually do."
---
# /gh-feature-flag

Feature flags done badly are worse than no feature flags. You ship behind a flag, forget to clean it up, and six months later the codebase has 40 flags — half of them always-on, none of them documented. The discipline is in the plan: who gets it first, what tells you it's safe to expand, and when the flag dies.

Design a feature flag rollout for the feature described in this conversation.

**What the flag controls**
Be precise: what code path is gated? What does the user experience differ between flag on and flag off? Is this a kill switch (turns off a live feature) or a rollout gate (graduates a new feature)?

**Rollout stages**
Design the graduation path from 0% to 100%. For each stage:
- Who gets it: internal only / specific users / percentage / segment (geography, plan, cohort)
- How long to hold before graduating
- What you're watching during this stage

**Go / no-go criteria**
For each stage transition: what metrics confirm it's safe to proceed?
- Error rate threshold
- Performance benchmarks
- Business metrics (conversion, engagement, support tickets)

Don't write "monitor for issues" — write the specific numbers that trigger a go or a rollback.

**Rollback plan**
If something goes wrong at any stage: how quickly can the flag be turned off? Is there a database migration or data transformation that makes rollback complicated? What's the state of users who interacted with the feature before rollback?

**Cleanup**
- Target date to reach 100% and remove the flag
- What code gets deleted when the flag is removed
- Who owns the cleanup — flag cleanup that "someone will do" never happens

Rules:
- Name the flag owner — a flag without an owner doesn't get cleaned up
- Set a hard expiry date at creation — flags should have TTLs
- If the flag can't be safely rolled back after stage 2, that's a risk to name explicitly
- Flag cleanup is a feature — schedule it in the same sprint as the 100% rollout
