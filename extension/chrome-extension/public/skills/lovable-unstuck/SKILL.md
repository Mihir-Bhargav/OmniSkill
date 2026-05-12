---
name: lovable-unstuck
description: "Breaks the doom loop — diagnoses why Lovable keeps failing to fix the same bug and tells you what to do next."
---
# /lovable-unstuck

You've told Lovable to fix something. It said it fixed it. It didn't. You've tried again. Same result. You're in the doom loop — and every attempt burns credits and risks making the codebase worse.

Stop prompting. Diagnose first.

Look at what's been described in this conversation and work through the following:

**What is actually broken**
Describe the failure precisely — what the user does, what happens, what should happen instead. Strip out all the attempts to fix it and focus only on the observable problem.

**What type of failure this is**
Identify which layer the bug lives in:
- UI only (something displays wrong but data is fine)
- Logic (the right action triggers the wrong behaviour)
- Data (something isn't being saved, loaded, or scoped correctly)
- Auth (permissions, session state, or access control)
- Integration (an external API or Supabase connection is failing)

**Why Lovable's fixes keep failing**
Based on the failure type, explain what Lovable is likely doing wrong. Common patterns: fixing symptoms not causes, changing the wrong component, not understanding that the bug is in the data layer not the UI.

**The prompt that will actually fix it**
Write a specific Lovable prompt that targets the root cause — not the symptom. Include what information Lovable needs, what file or component to look at, and what the fix should achieve.

**When to stop and revert instead**
If the bug has been attempted more than 3 times, or if Lovable has changed multiple unrelated files, state whether it's safer to revert to the last working version and approach differently. Credit preservation matters.
