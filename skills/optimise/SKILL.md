---
name: optimise
description: "Improves the performance, efficiency, or resource usage of code or a process."
---
# /optimise

Optimise the code or process described in this conversation.

Work through it:
1. **Identify the bottleneck** — where is the time, memory, or effort actually being spent? Don't optimise the wrong thing
2. **Measure first** — what's the current performance? Optimisation without measurement is guessing
3. **The highest-leverage change** — what single change would make the biggest difference?
4. **Other improvements** — additional optimisations in descending order of impact
5. **Tradeoffs** — what does each optimisation cost? (readability, complexity, memory vs. speed, etc.)

Rules:
- Premature optimisation is the root of a lot of bad code. Make sure there's a real problem to solve
- State the algorithmic complexity (O notation) where relevant — that's often where the real gains are
- If the code has an O(n²) loop that could be O(n), fix that before anything else
- Don't optimise at the cost of correctness
- If profiling data or specific performance targets are available, ask for them — they change what to prioritise
