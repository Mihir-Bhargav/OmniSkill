---
name: gh-performance-audit
description: "Finds the performance problems in code that will only appear at scale — before they appear in production."
---
# /gh-performance-audit

Performance problems are invisible in development. Your local database has 100 rows; production has 10 million. Your test makes one API call; production makes a thousand concurrent ones. The problems that will page you at 2am are almost always detectable in the code before they happen — they just require someone to look for them.

Audit the code described in this conversation for performance problems.

**Database**
- N+1 queries — any loop that triggers a query per iteration instead of one query for all
- Missing indexes — queries filtering or joining on unindexed columns; name the columns
- Full table scans — queries with no WHERE clause or with a WHERE that can't use an index (LIKE '%term', function on column)
- Unbounded queries — no LIMIT on queries that could return arbitrary row counts
- Unnecessary data fetching — SELECT * when only 2 columns are needed; loading related records that aren't used

**Computation**
- Work done inside loops that could be done once outside
- Repeated expensive operations (regex compilation, JSON parsing, crypto operations) that could be cached
- Synchronous blocking operations on the main thread or event loop
- Unnecessary serialisation/deserialisation cycles

**Memory**
- Loading large datasets entirely into memory instead of streaming
- Accumulating data in arrays inside loops without bound
- Large objects kept in scope longer than needed

**Network and I/O**
- Sequential async operations that could run in parallel
- Missing caching on expensive or repeated external calls
- Large payloads being transferred when only a subset is needed

For each issue:
- **Where it is** — specific function or line
- **What it costs** — slow at N rows/requests/users
- **The fix** — concrete change, not "optimise this"
- **Priority** — will cause incidents / noticeable at scale / minor

Rules:
- Only flag real performance risks, not theoretical ones — if this code path handles 10 requests/day, an N+1 query doesn't matter
- Premature optimisation is real — don't suggest complexity for code that isn't on a hot path
- Measure before optimising wherever possible — flag what to measure if unsure
