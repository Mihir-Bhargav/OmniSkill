---
name: gh-release-notes
description: "Writes release notes that tell users what changed and why they should care — not a git log summary."
---
# /gh-release-notes

Release notes written from git commits are useless. "Fixed bug in UserService", "Refactored authentication module", "Updated dependencies" — these tell users nothing. Good release notes explain what's different about the product today versus last week, in language that makes users care.

Write release notes for the changes described in this conversation.

**Format for each section — only include sections that have content:**

**New features**
What users can now do that they couldn't before. Lead with the user benefit, not the implementation. One sentence per feature, with a second sentence only if the feature needs explanation.

**Improvements**
Things that worked before but work better now. Be specific: "Search results now load 3x faster" beats "Improved search performance."

**Bug fixes**
Problems that users experienced that are now resolved. Describe the symptom that was fixed, not the code that changed. "Fixed an issue where saving a form with special characters in the title would silently fail" is useful. "Fixed null pointer exception in FormService" is not.

**Breaking changes**
Anything a user or developer needs to change on their side to keep things working. This section is mandatory if any exist — never bury breaking changes.

**Deprecations**
What's being removed in a future release and what to use instead.

Rules:
- Write for the user reading this, not the developer who made the changes
- Every item should answer "so what?" — why does this matter to me?
- If a change requires user action, make that explicit and early
- Version number and release date at the top
- Keep it scannable — users are looking for the thing that affects them, not reading every word
