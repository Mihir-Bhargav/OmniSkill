---
name: gh-test-coverage
description: "Identifies the test cases that are missing and would actually catch real bugs — not just increase coverage numbers."
---
# /gh-test-coverage

100% coverage can coexist with zero useful tests. Coverage measures lines executed, not behaviour verified. The goal is tests that would fail if the implementation were wrong — tests that catch real bugs, not tests that just run the code.

Analyse the code in this conversation and identify the missing test cases that matter.

**What's already tested**
Summarise what the existing tests cover. Be specific about which behaviours are verified, not just which functions are called.

**The cases that aren't tested but should be**

For each missing test case:
- **What behaviour it tests** — described as: given [input/state], when [action], then [expected outcome]
- **Why it matters** — what real bug would this catch?
- **Priority** — high (likely to fail in production) / medium (edge case worth covering) / low (defensive)

Look specifically for:
- The unhappy paths — every error condition, every validation failure, every null input
- Boundary conditions — zero, one, max, overflow
- Concurrent or async behaviour — race conditions, timeout handling, out-of-order responses
- Side effects — what gets written to the database, what events get emitted, what external calls get made
- Integration points — behaviour when a dependency returns an error or unexpected shape
- Idempotency — does running this twice produce the same result?

**The tests you'd write first**
Given limited time, which 3-5 test cases give the most coverage of real failure modes? Write the test descriptions (not the implementation) for those specifically.

Rules:
- Don't suggest tests that would pass even with a broken implementation
- Don't suggest tests that just assert the function ran without error
- If the code is untestable as written, say why and what needs to change first
- Test behaviour, not implementation — tests that break on every refactor aren't useful
