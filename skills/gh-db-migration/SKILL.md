---
name: gh-db-migration
description: "Reviews a database migration for safety — data loss risk, lock contention, rollback path, and deployment order."
---
# /gh-db-migration

Database migrations are the most dangerous deployments you do. A bad migration can lock a table for minutes under production load, silently drop data, or leave the schema in a state where the old code fails and the new code isn't deployed yet. Most migration problems are foreseeable — they just require someone to think through them before running.

Review the migration described in this conversation.

**What this migration does**
State plainly: what will the schema look like after this runs? What data changes, if any?

**Data loss risk**
- Does this drop any columns, tables, or constraints?
- Does this change a column type in a way that could truncate or corrupt existing values?
- Does this add a NOT NULL constraint to a column that has existing rows? If so, what happens to those rows?
- Is there any data that exists now that won't exist or won't be accessible after this migration?

**Lock contention**
On a table with millions of rows, the following operations take locks that block reads and writes:
- Adding a column with a default value (pre-Postgres 11)
- Adding a NOT NULL constraint without a default
- Rebuilding an index synchronously
- Altering a column type

For each operation: will this lock the table? How long? Can it be rewritten to avoid the lock (e.g. `CREATE INDEX CONCURRENTLY`)?

**Deployment order**
Does the application code need to change before or after this migration runs? The safest order is: deploy code that works with both old and new schema → run migration → clean up old compatibility code.

**Rollback path**
If this migration causes a problem and needs to be reversed: can it be? Is there a down migration? If data was transformed, can it be untransformed?

**Verdict**
Safe to run as-is / safe with modifications (list them) / needs redesign (explain why).

Rules:
- Never assume a migration is safe on a large table without checking lock behaviour
- "We'll just roll forward" is not a rollback plan
- Test the migration on a production-sized dataset before running in production
