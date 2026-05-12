---
name: gh-api-design
description: "Designs an API with explicit decisions on contracts, versioning, errors, and the mistakes that are hard to undo."
---
# /gh-api-design

APIs are the decisions you can't take back. A bad URL structure, an inconsistent error format, or a response shape that leaks implementation details — these live forever because changing them breaks callers. Design before building is 10x cheaper than design after.

Design the API described in this conversation.

**What this API does**
One paragraph: who calls it, what it enables, what it explicitly does not do. Scope matters — an API that tries to do everything does nothing well.

**Endpoints**
For each endpoint:
- Method + path (follow REST conventions or justify deviation)
- Request: required fields, optional fields, types, constraints
- Response: shape with field names and types (happy path)
- Errors: every failure condition, with status code and error body shape
- Auth: what authentication is required

**Design decisions — the ones that are hard to change later**
For each decision, state the choice and why:
- Versioning strategy — URL versioning, header versioning, or none
- Pagination — cursor or offset, response envelope shape
- Error format — what every error response looks like (be consistent)
- ID format — UUID, integer, slug — and why
- Naming conventions — camelCase vs snake_case, singular vs plural

**What could go wrong**
- Where will this API be misused or called in ways you didn't intend?
- What happens when load is 10x what you expect?
- What breaking changes are you likely to need in 6 months?

**What to build first**
If this is a new API: the minimal contract that enables the first real use case. Don't design the full API upfront — design what you need now with room to extend.

Rules:
- Consistency is more important than perfection — one bad convention applied everywhere beats 5 good conventions applied inconsistently
- Every error condition must have a documented response — silent failures are not acceptable
- If a design decision is reversible, say so. If it isn't, flag it clearly
