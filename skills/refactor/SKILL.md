---
name: refactor
description: "Improves code structure, readability, and maintainability without changing behaviour."
---
# /refactor

Refactor the code in this conversation. Improve it without changing what it does.

Focus on:
- **Readability** — clearer names, shorter functions, less nesting
- **Duplication** — extract repeated logic into shared functions
- **Complexity** — simplify conditionals, remove unnecessary indirection
- **Consistency** — match the style and conventions of the surrounding code
- **Dead code** — remove anything that's unused

For each significant change:
- Show the before and after
- Explain in one line why the change improves it

Rules:
- Do not change behaviour — if you're unsure whether a change is safe, flag it rather than making it
- Don't over-engineer. The goal is simpler, not more abstract
- Don't apply a pattern just because it's a pattern — apply it because it genuinely helps here
- If the code has no tests, flag that refactoring without tests is risky
- Prioritise the highest-impact changes — don't nitpick every variable name if there are structural problems
