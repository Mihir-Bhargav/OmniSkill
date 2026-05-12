---
name: gh-breaking-changes
description: "Audits a diff or change for everything that could break callers, dependents, consumers, or existing data."
---
# /gh-breaking-changes

Breaking changes are the ones you didn't know were breaking. You renamed a function, changed a response shape, dropped a database column, or altered default behaviour — and something downstream broke in a way you didn't anticipate. This audit catches them before merge, not after an incident.

Analyse the changes described in this conversation for breaking changes across each layer:

**API contracts**
Any change to a public-facing API endpoint: URL, method, request shape, response shape, status codes, error formats, or authentication requirements. Partial changes count — adding a required field breaks existing callers just as much as removing one.

**Internal interfaces**
Function signatures, class constructors, exported types, or module interfaces that other parts of the codebase depend on. Renamed parameters, changed return types, added required arguments — all potentially breaking.

**Database schema**
Column renames, type changes, dropped columns, new NOT NULL constraints without defaults, index removals, changed foreign key constraints. Any migration that can't be rolled back without data loss.

**Behavioural changes**
The same input now produces different output. Default values changed. Error conditions that previously succeeded now fail. Timing or ordering of operations changed.

**Configuration and environment**
New required environment variables. Changed config file formats. Renamed or removed feature flags.

**Clients and consumers**
Who calls this code? List the known callers and for each: does this change break them? What do they need to update?

For each breaking change found:
- **What breaks** — specific and concrete
- **Who is affected** — known callers or consumers
- **Migration path** — what needs to change on the consumer side
- **Can it be made backwards-compatible?** — flag if a deprecation period is possible

Rules:
- A change is breaking if any existing code that works today would fail after this change without modification
- Internal-only changes are still breaking if they affect other teams or services
- Flag anything that requires a coordinated deployment — changes that can't be rolled out independently
