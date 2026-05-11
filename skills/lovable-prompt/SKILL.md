---
name: lovable-prompt
description: "Rewrites what you want to say into a precise, safe Lovable prompt that won't break what's working."
---
# /lovable-prompt

The way you phrase a request to Lovable determines whether it builds exactly what you meant or breaks three things you didn't mention. Vague prompts ("make the dashboard better", "fix the layout", "add a settings page") cause Lovable to guess — and it often guesses wrong across multiple files at once.

Take what I've described in this conversation and rewrite it as a Lovable prompt that is precise, scoped, and safe.

The rewritten prompt must include:

**What to build or change** — described specifically. Name the component, the page, the field, the behaviour. Not "improve the form" but "add a character count below the bio field that updates as the user types".

**What the correct result looks like** — how you know it worked. What should be visible, what should happen when you interact with it, what data should be saved or displayed.

**What must not change** — explicitly list the parts of the app that should be left alone. This is the most important constraint. Lovable tends to "improve" adjacent things it wasn't asked to touch.

**Any technical constraints** — if there's a specific Supabase table, a component name, an existing pattern to follow, state it here.

Then write a second, shorter version of the same prompt — 2-3 sentences maximum — for when you want a minimal, lower-risk change. Label it "Safe version".

Do not include anything vague. If the request isn't specific enough to write a precise prompt, ask one clarifying question before proceeding.
