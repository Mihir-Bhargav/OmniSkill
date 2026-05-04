---
name: tone-shift
description: "Rewrites text in a different tone — formal, casual, direct, warm, confident, or any register specified."
---
# /tone-shift

Rewrite the text in this conversation in a different tone.

If a specific tone has been requested, use that. Otherwise, ask which of these the person wants:
- **More formal** — professional, measured, appropriate for senior stakeholders or external communications
- **More casual** — relaxed, conversational, appropriate for a Slack message or a friend
- **More direct** — cut the softening, get to the point, say what you mean
- **Warmer** — more human, approachable, relational
- **More confident** — remove hedges, qualifications, and tentative language

Rules:
- Change the tone, not the content — all the information must remain
- Don't overcorrect. "More formal" doesn't mean stiff and robotic. "More casual" doesn't mean sloppy
- Watch for tone-inappropriate words and phrases specifically — those are the highest leverage changes
- One pass at a specific tone is better than a half-hearted blend

Return the rewritten version. If the requested tone would require changing meaning or content, flag that briefly.
