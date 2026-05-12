---
name: gh-pr-description
description: "Writes a PR description that actually tells reviewers what changed, why, and what to watch out for."
---
# /gh-pr-description

Most PR descriptions are useless. "Fixed the bug" or "Updated component" forces reviewers to read every line of diff to understand context they should have been given. A good PR description makes the review faster, reduces back-and-forth, and creates a permanent record of why this change exists.

Write a PR description for the changes described in this conversation. Cover:

**What changed — and what didn't**
One paragraph. What does this PR do? Be specific about scope — name the components, endpoints, or modules touched. Also state explicitly what is NOT in scope, so reviewers don't ask about it.

**Why this change exists**
One paragraph. What problem does this solve, or what behaviour does it enable? Link to the ticket or issue if one exists. If this is a refactor, explain what was wrong with the previous approach.

**How it works**
For non-trivial changes: a brief explanation of the approach taken. If there were alternative approaches considered and rejected, say so and why. Reviewers should understand not just what you did but why you did it this way.

**How to test it**
Step-by-step instructions a reviewer can follow to verify the change works. Include: any setup required, the exact action to take, and what the expected result is. Don't write "test manually" — write the actual test steps.

**Things to pay attention to**
Flag any areas of the code that are higher-risk, any edge cases the reviewer should specifically check, or any decisions you're uncertain about and want feedback on.

**Checklist**
- [ ] Tests added or updated
- [ ] No new warnings in CI
- [ ] Docs updated if behaviour changed
- [ ] Feature flag or migration needed

Rules:
- Write in plain language — this will be read by humans under time pressure
- Don't summarise the diff — explain the intent
- If this PR is too large to describe clearly, say so and suggest how to split it
- Flag any breaking changes explicitly at the top
