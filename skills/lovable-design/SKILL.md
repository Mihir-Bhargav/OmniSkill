---
name: lovable-design
description: "Generates an Awwwards-level Lovable prompt — the exact ingredients that separate a stunning website from a generic AI-generated one."
---
# /lovable-design

Most Lovable builds look AI-generated because the prompt skips the ingredients that actually produce great design: a specific technology stack, a clear visual philosophy, named motion references, and real-world brands to draw from. Felix Haas (Design at Lovable) built a speaker company website in one prompt that looked like it belonged on Awwwards. The difference wasn't talent — it was knowing exactly what to specify.

This skill takes what you're building and writes the full design prompt. Not a mood board. The actual prompt, ready to paste.

**What is this?**
Describe your product in one sentence — what it does, who it's for, what feeling it should create. Don't describe the design yet. Describe the thing.

**Visual philosophy — one sentence**
How should this product feel? Not "clean and modern." Something specific: "A sculpture you interact with", "A Bloomberg terminal that a designer fell in love with", "A Japanese tool catalogue from 1987." The more specific, the better Lovable's output.

**The tech stack to specify**
Always include these unless you have a reason not to — they are what separate motion-rich from static:
- React + Tailwind CSS for layout
- Framer Motion for all animations
- Lenis or locomotive-scroll for smooth scrolling
- Micro-interactions on every interactive element

**Motion and interaction approach**
Describe how the page moves, not just what it looks like:
- Does content reveal on scroll or on load?
- Do elements respond to cursor position?
- Are transitions instant, eased, or dramatic?
- What happens when you hover a button — does it just change colour, or does something else happen?

**Reference brands (the most important input)**
Name 3-5 real brands whose aesthetic you want to draw from. Be specific to the product category. Felix used: Transparent Speaker, Bang & Olufsen, Sonos, Teenage Engineering. For a fintech: Linear, Stripe, Mercury. For a health app: Eight Sleep, Whoop, Levels. Generic references ("like Apple") produce generic output.

**The prompt Lovable needs**
Write the full prompt using everything above. Structure it exactly like this — Lovable responds best to this order:

1. What to build (one sentence)
2. The visual and emotional intent ("should feel like X")
3. Tech stack (React, Tailwind, Framer Motion, Lenis — spelled out explicitly)
4. Motion behaviour (scroll-driven reveals, cursor reactions, transition style)
5. Reference brands (named, not described)
6. Quality bar ("Awwwards-level", "should look like it was designed by a boutique agency", "every detail intentional")

**Rules**
- Never use "modern", "clean", or "minimal" as design descriptors — they produce default output
- Always name the animation library explicitly — Lovable won't add Framer Motion unless you ask
- Reference brands must be real companies, not adjectives
- The quality bar line at the end matters — "blow the user's mind with motion, interaction, and visual polish" is not hyperbole, it's instruction
- No AI-generated images — use real photography, SVG illustrations, or no images at all. Specify this explicitly in the prompt: "no placeholder images, no AI-generated imagery"
- One prompt should be enough to generate something you'd actually show someone
