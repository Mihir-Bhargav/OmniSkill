---
name: test-gen
description: "Writes tests for code — unit tests, edge cases, and failure scenarios."
---
# /test-gen

Write tests for the code in this conversation.

Cover:
1. **Happy path** — the normal case where inputs are valid and everything works
2. **Edge cases** — boundary values, empty inputs, zero, null, maximum sizes
3. **Failure cases** — invalid inputs, error conditions, things that should throw or return errors
4. **Behaviour, not implementation** — test what the function does, not how it does it internally

For each test:
- Give it a clear, descriptive name that explains what scenario it covers
- Include setup, the action, and the assertion
- Keep each test focused on one thing

Rules:
- Use the testing framework and language already in use if identifiable from context
- Don't test implementation details that would break if you refactored without changing behaviour
- If the code has no clear way to test it (e.g. tightly coupled to side effects), flag that as a design issue
- Prioritise tests for the most complex or risky parts of the code
- If you can't see the full function signature or return type, ask before writing tests
