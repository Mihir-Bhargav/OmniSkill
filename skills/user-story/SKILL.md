---
name: user-story
description: "Converts messy stakeholder input or requirements into clean, well-structured user stories."
---
# /user-story

Turn the requirements, notes, or stakeholder input in this conversation into properly structured user stories.

For each story use this format:

**[Story title]**
As a [type of user], I want to [do something] so that [I get this benefit].

**Acceptance criteria:**
- Given [context], when [action], then [expected outcome]
- [add as many as needed to define done]

**Notes:** [anything ambiguous, out of scope, or that needs a decision]

Rules:
- One story per distinct user need — don't bundle multiple things into one story
- Write from the user's perspective, not the technical implementation's perspective
- Acceptance criteria should be testable — if you can't write a test for it, it's not a good criterion
- If something is unclear or missing, flag it as a question in the Notes rather than guessing
- If the input contains obvious technical tasks with no user value attached, flag them separately rather than forcing them into user story format
- Keep stories small enough to be completed in one sprint — split if they're too large
