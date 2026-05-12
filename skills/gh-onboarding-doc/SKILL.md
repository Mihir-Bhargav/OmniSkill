---
name: gh-onboarding-doc
description: "Writes the onboarding documentation a new engineer actually needs to be productive — not a list of tools to install."
---
# /gh-onboarding-doc

Most onboarding docs are a list of tools to install and a link to the wiki. A new engineer follows the steps, gets everything running, and then has no idea how anything works or what to do first. The documentation that actually helps is the stuff in senior engineers' heads that never gets written down.

Write onboarding documentation for the codebase or system described in this conversation.

**What this system does — for real**
Not the marketing description. What problem does it solve? What are the key workflows a user actually performs? A new engineer should be able to explain the product after reading this.

**How the code is organised**
Where does a feature start and end? What are the main modules or services and what does each own? When you need to change X, where do you look? Walk through the structure as if you're explaining it to someone reading it for the first time.

**The mental model**
What are the 2-3 concepts that, once understood, make everything else make sense? What's non-obvious about how this system works that trips people up? What do senior engineers know that isn't written anywhere?

**Local development setup**
The exact commands, in order, to go from a fresh machine to a running dev environment. Every step. Every prerequisite. Every "oh you also need to..." that's currently in someone's head. Include what the expected output looks like so people know if it worked.

**The first week**
What should a new engineer do to get familiar with the codebase? What's a good first issue to work on? Who should they talk to and about what?

**Common tasks**
The operations every engineer does regularly but has to ask about the first time: how to run tests, how to deploy, how to roll back, how to debug a failing build.

Rules:
- Write for someone who is smart but has zero context on this codebase
- Every "just" and "simply" hides assumed knowledge — remove them and explain the assumption
- If setup requires tribal knowledge, write it down — that's the most valuable part of this document
- Keep it honest: if something is painful or broken, say so and what to watch out for
