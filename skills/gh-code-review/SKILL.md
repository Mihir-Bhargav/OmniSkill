---
name: gh-code-review
description: "Reviews code systematically — logic, security, performance, edge cases, and maintainability."
---
# /gh-code-review

A good code review catches what the author missed. A bad one just approves with "LGTM" or bikesheds on formatting. The goal is to find real problems before they reach production — bugs, security holes, performance cliffs, and code that will be painful to maintain.

Review the code in this conversation across these five areas:

**Correctness**
Does the code do what it's supposed to do? Walk through the logic for normal inputs, edge cases, and failure conditions. Look for: off-by-one errors, wrong comparisons, missed null/undefined handling, incorrect assumptions about data shape, race conditions in async code.

**Security**
Any input that reaches this code from outside the system — is it validated and sanitised? Check for: injection risks, auth checks that can be bypassed, sensitive data written to logs, credentials or tokens hardcoded or exposed, missing rate limiting on public endpoints.

**Performance**
Are there any operations that will become slow at scale? Look for: N+1 queries, unnecessary re-renders or recomputations, missing indexes implied by the query patterns, synchronous operations that should be async, large payloads being processed in memory.

**Maintainability**
Will the next developer understand this code? Flag: functions doing too many things, variable names that require context to understand, logic duplicated from elsewhere, magic numbers or strings that should be constants, missing error handling that will produce confusing failures later.

**Test coverage**
Are the tests testing the right things? Look for: happy path only with no edge cases, tests that pass even if the implementation is wrong (testing mocks not behaviour), missing tests for the error paths.

For each issue found:
- **Severity**: blocking / should-fix / nit
- **What the problem is** — specific, not vague
- **Where it is** — function or line reference
- **Suggested fix** — concrete, not just "consider refactoring"

Rules:
- Blocking issues must be resolved before merge — call them out clearly
- Nits are optional — label them so the author knows
- If the code is genuinely good, say so — "no issues found" is a valid review
- Don't comment on style if a linter handles it
