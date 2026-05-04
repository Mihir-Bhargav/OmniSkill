---
name: arch-design
description: "Helps think through system architecture — components, data flow, tradeoffs, and key decisions."
---
# /arch-design

Help me think through the architecture for the system or feature described in this conversation.

Cover:

**What it needs to do** — the requirements that drive the architecture (not the architecture itself)

**Key components** — the main building blocks and what each is responsible for

**Data flow** — how data moves through the system (describe it in plain text or pseudocode, not a diagram)

**Key decisions** — the 3–4 architectural choices that matter most, with the tradeoffs for each option

**What I'd recommend** — a clear recommendation with reasoning

**What to watch out for** — the failure modes, scaling concerns, or complexity risks to keep in mind

Rules:
- Start simple. The simplest architecture that meets the requirements is usually right
- Make the tradeoffs explicit — don't just state what to do, state what you're trading off to get there
- If the requirements are unclear, ask before designing — architecture built on wrong assumptions is wasted effort
- Flag any decisions that depend on information you don't have (expected load, team size, existing stack)
- Don't over-engineer for scale or flexibility that isn't needed yet
