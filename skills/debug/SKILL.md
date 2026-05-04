---
name: debug
description: "Finds the root cause of a bug and explains the fix."
---
# /debug

Debug the problem described in this conversation.

Work through it:
1. **Reproduce the problem** — restate what's happening vs. what should happen. If these aren't clear, ask
2. **Identify the likely cause** — where in the code or system is this most likely originating?
3. **Explain why** — what is the mechanism that produces this behaviour?
4. **The fix** — what specifically needs to change, and why does that fix it?
5. **How to verify** — what test or check confirms the fix worked?

Rules:
- Don't guess randomly — reason from the symptoms to the cause
- If the error message or stack trace is available, start there
- If multiple causes are plausible, list them in order of likelihood and explain how to distinguish them
- State what the fix does, not just what to change — understanding prevents the same bug recurring
- If you need more information (the full error, the relevant code section, the environment), ask for it specifically
