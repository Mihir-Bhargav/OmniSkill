---
name: fact-check
description: "Reviews claims in the text and flags anything that is unverified, uncertain, or likely wrong."
---
# /fact-check

Review the text in this conversation and fact-check the claims it makes.

For each significant claim, categorise it as:
- **Likely accurate** — consistent with well-established knowledge
- **Needs verification** — plausible but you can't confirm it; flag what specifically needs checking
- **Questionable** — inconsistent with what you know; explain why
- **Cannot assess** — outside your knowledge or requires real-time data

Be specific. Don't just say "this needs verification" — say what the claim is and why it's uncertain.

Important:
- Your knowledge has a cutoff date. Flag anything that could have changed since then
- Statistics, named studies, and specific attribution claims are the highest-risk items — flag these first
- Do not rewrite the text. Just produce the fact-check report
- If everything checks out, say so clearly

Format: list each flagged claim as a bullet with its category and your reasoning.
