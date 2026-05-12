---
name: lovable-plan
description: "Turns your app idea into a structured plan before you write your first Lovable prompt."
---
# /lovable-plan

Before you open Lovable and start typing, you need a plan. Most Lovable sessions go wrong because the first prompt is vague, the scope grows with every message, and by prompt 20 the app is a mess that Lovable can't reason about anymore.

Look at what I've described so far in this conversation and produce the following:

**What this app actually does — one sentence**
Not what it could do. What the first version does. Make it specific enough that someone could tell you if you've built it or not.

**The core user flow — step by step**
Walk through exactly what a user does from opening the app to completing the main action. Name each screen. Describe each interaction. This is the only flow that matters for the first build.

**The data model — tables and fields only**
What needs to be stored. Keep it to the minimum required for the core flow. No "nice to have" fields.

**What's out of scope for now**
List 4-5 things that sound important but can wait. Naming them explicitly prevents scope creep.

**The first 3 Lovable prompts — in order**
Write them out verbatim, ready to paste. Prompt 1 sets up the data model. Prompt 2 builds the core UI. Prompt 3 connects them. Each prompt should be self-contained and testable before moving to the next.

Do not include anything that isn't needed for the core flow to work. The goal is a plan that can be built in one Lovable session.
