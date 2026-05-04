---
name: prioritise
description: "Ranks tasks or ideas by impact and effort, with a clear recommended order."
---
# /prioritise

Help me prioritise the items in this conversation.

Work through them like this:
1. Score each item on **impact** (high/medium/low — what does completing this unlock or improve?)
2. Score each item on **effort** (high/medium/low — roughly how much time or complexity is involved?)
3. Identify the quadrant: quick wins (high impact, low effort), major projects (high impact, high effort), fill-ins (low impact, low effort), time sinks (low impact, high effort)
4. Recommend a clear order, with reasoning

Output format:
**Priority order:**
1. [item] — [impact/effort] — [why this comes first]
2. ...

**What to deprioritise or drop** — items that aren't worth the time given everything else

Rules:
- Quick wins come first
- Time sinks go to the bottom or get cut
- If two items are in tension (doing one delays the other), flag it
- If dependencies mean order is constrained regardless of priority, note that
- Ask if you need context on what "high impact" means in this situation
