---
name: code-explain
description: "Explains what a piece of code does and why — line by line or at the conceptual level."
---
# /code-explain

Explain the code in this conversation clearly.

Cover:
1. **What it does** — the overall purpose in plain English, one paragraph
2. **How it works** — walk through the logic. For short code, go line by line. For longer code, explain the key sections and how they connect
3. **Why it's written this way** — any non-obvious choices: why this data structure, why this approach, what problem it's solving that isn't obvious
4. **What could go wrong** — edge cases, failure modes, or inputs that might break it
5. **What I'd change** — if there's anything clearly improvable, note it briefly

Rules:
- Match the depth to the complexity — trivial code doesn't need a treatise
- Use plain language. Assume the reader knows how to program but hasn't seen this code before
- If there's a bug or a problem, say so directly — don't soften it
- If the code is doing something clever, make sure the explanation actually clarifies it rather than restating it in different jargon
- Don't explain language basics unless the code is specifically using something unusual
