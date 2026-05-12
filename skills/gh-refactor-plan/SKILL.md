---
name: gh-refactor-plan
description: "Produces a structured plan for refactoring a file, module, or system before touching a line of code."
---
# /gh-refactor-plan

Refactors done without a plan create more mess than they clean up. You start extracting a function, realise it needs a new abstraction, add a layer, and end up with a 1000-line PR that's impossible to review. A plan takes 10 minutes. An unplanned refactor takes days and introduces bugs.

Produce a structured refactor plan for the code described in this conversation.

**What's wrong with the current code**
Name the specific problems — not "it's messy" but: this function does 4 things, this logic is duplicated in 3 places, this module is 800 lines because it owns too many responsibilities. Be precise about what makes it hard to work with.

**What the refactored state looks like**
Describe the target state: what will the structure be, what are the new boundaries, what does each piece own? Don't write code — describe the shape.

**The sequence of changes**
Break the refactor into ordered steps where each step leaves the code working. Refactors that can't be done incrementally are risky — flag them. For each step:
- What changes
- What stays the same (behaviour must be preserved)
- How to verify it still works after this step

**What must not change**
The external behaviour: inputs, outputs, side effects, error conditions. List the invariants that the refactor must preserve. These become your test criteria.

**Tests to write first**
Before moving code, list the tests that will catch regressions. If good tests already exist, name them. If they don't, write them before refactoring — not after.

**Risk assessment**
What's the highest-risk step? What could go wrong? Are there callers or consumers that will need updating?

Rules:
- Each step must be independently committable and reviewable
- If the refactor requires changing behaviour to work, that's a separate PR — not part of this refactor
- If you can't describe the target state clearly, the refactor isn't ready to start
- Prefer many small PRs over one large one — each step should be mergeable independently
