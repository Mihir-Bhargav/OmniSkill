---
name: lovable-cleanup
description: "Refactors the codebase before it gets too messy for Lovable to work with effectively."
---
# /lovable-cleanup

After many prompts, Lovable's output starts working against itself. Components grow large and get duplicated. Styling becomes inconsistent. The AI starts making worse decisions because the codebase is too complex to reason about. Future prompts become less accurate, bugs get harder to isolate, and every new feature creates more debt.

Clean up before you continue building. Based on what's been described in this conversation, identify what needs refactoring and write the prompts to do it.

**What to look for:**

Large components that do too much — any component handling data fetching, business logic, AND rendering should be split. Lovable works better with focused, single-purpose components.

Duplicated code — the same UI pattern appearing in multiple places as separate implementations instead of a shared component.

Hardcoded values — colours, strings, sizes, or IDs that appear directly in components instead of being pulled from a central config or the database.

Inconsistent patterns — some pages using one approach (e.g. inline styles), others using a different one (e.g. Tailwind classes). Pick one and consolidate.

Dead code — components, functions, or pages that were built and abandoned. They confuse Lovable and inflate the codebase.

**For each issue found:**
- Describe specifically what needs to change
- Confirm that the change doesn't alter any visible behaviour for the user
- Write the exact Lovable prompt to make the refactor

**The cleanup rule:**
Each cleanup prompt should change structure only — not functionality. If Lovable's response to a cleanup prompt changes how the app behaves, something went wrong.

Run cleanup every 15-20 prompts, or whenever you notice Lovable starting to produce lower-quality changes.
