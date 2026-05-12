---
name: lovable-checkpoint
description: "Mid-build health check — tells you what's working, what's silently broken, and whether it's safe to keep building."
---
# /lovable-checkpoint

You've been prompting Lovable for a while. Things mostly work. But you're not sure if the foundation is solid or if you're piling features on top of problems you haven't found yet. Most Lovable sessions discover the foundation was broken 10 prompts too late — when it's expensive to fix.

Run a checkpoint now. Based on what's been described in this conversation, assess the current state of the build across these four areas:

**Core flow — does it work end to end?**
Walk through the main user journey step by step. At each step, state whether it works, is untested, or is known to be broken. Be specific about what "works" means — not "it seems fine" but "the form saves to Supabase and the saved value appears on the next page".

**Data integrity — is the right data being stored and retrieved?**
Are the Supabase tables set up correctly? Is data scoped to the right user? Are there any operations that might be writing to the wrong table, missing required fields, or fetching data without filtering by user ID?

**Debt accumulated — what has Lovable introduced that will cause problems later?**
Look for: components that have grown too large, duplicated logic, inconsistent styling, hardcoded values that should be dynamic, features that were "temporarily" hacked in.

**Decision — continue, clean, or stop?**
Based on the above:
- **Continue** — the foundation is solid, the next feature is safe to add. State what to build next.
- **Clean first** — list 1-3 specific things to fix or refactor before adding anything new, with the prompt for each.
- **Stop and revert** — the build has drifted too far. Describe what the last stable state was and how to get back to it.

Be honest about what's broken. It's cheaper to fix now than after the next 5 prompts.
