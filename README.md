
<div align="center">
  <img src="extension/chrome-extension/public/banner.png" alt="OmniSkill — Run local /skills across platforms" width="100%">
</div>

<p align="center">
Type <code>/skill</code> in any AI chat. Get expert-level structured prompts, instantly.
</p>

---

## What Is OmniSkill?

OmniSkill is a Chrome extension that puts structured AI skills directly inside your chat input on Gemini, ChatGPT, GitHub Copilot, Lovable, and more.

Type `/`, pick a skill, add your context, press Enter. No copy-pasting. No switching tabs. No setup.

71 skills are bundled into the extension. They work immediately with no server, no Python, no terminal.

---

## Install (2 steps)

**1. Load the extension**

1. Clone or download this repo
2. Open Chrome and go to `chrome://extensions/`
3. Turn on **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `extension/dist` folder

**2. Use it**

Open Gemini, ChatGPT, Lovable, or GitHub. Click the chat input. Type `/`.

That's it.

---

## Skills

OmniSkill ships with 71 skills across three groups:

### Lovable (lovable.dev only)

Skills designed around how Lovable actually works. Only visible on lovable.dev.

| Skill | What it does |
|---|---|
| `/lovable-plan` | Turns your app idea into a structured build plan with the first 3 Lovable prompts written out |
| `/lovable-design` | Generates an Awwwards-level design prompt using the Felix Haas framework — Framer Motion, Lenis, reference brands, quality bar |
| `/lovable-prompt` | Rewrites a vague prompt into one Lovable can execute without going off-track |
| `/lovable-security` | Audits for the vulnerabilities vibe-coded apps always ship with — RLS, exposed keys, unprotected routes |
| `/lovable-ship` | Pre-launch checklist covering mobile layout, auth flows, empty states, error handling |
| `/lovable-checkpoint` | Mid-build health check — what's working, what's silently broken, whether it's safe to keep building |
| `/lovable-cleanup` | Refactors the codebase before it gets too messy for Lovable to reason about |
| `/lovable-unstuck` | Breaks the doom loop when Lovable keeps failing to fix the same bug |

### GitHub Copilot (github.com only)

16 skills for code review, architecture, and engineering workflows. Only visible on github.com.

`/gh-pr-description`, `/gh-code-review`, `/gh-breaking-changes`, `/gh-refactor-plan`, `/gh-test-coverage`, `/gh-incident-postmortem`, `/gh-tech-debt`, `/gh-api-design`, `/gh-db-migration`, `/gh-performance-audit`, `/gh-release-notes`, `/gh-onboarding-doc`, `/gh-dependency-audit`, `/gh-feature-flag`, `/gh-adr`, `/gh-security-hardening`

### General (Gemini, ChatGPT, and everywhere else)

47 skills across professional roles — sales, product, engineering, research, law, finance, and more. Visible on all platforms except Lovable and GitHub.

Examples: `/cold-sequence`, `/roadmap-tradeoffs`, `/investment-memo`, `/contract-risk`, `/validation-interview`, `/stakeholder-map`, `/metric-diagnosis`, `/feedback-diagnosis`

---

## Custom Skills (optional)

If you want to add your own skills or use skills from another source (like your Claude commands folder), run the local server:

**Install Python dependencies (one time)**

```bash
python -m pip install -e .
```

**Start the server**

```bash
python -m omniskill tray --skills-dir ./skills --port 3006
```

The extension detects the server automatically and merges your custom skills on top of the bundled ones. Server skills take precedence over bundled skills with the same name.

To use your Claude slash commands as skills, point the server at your Claude commands folder:

```bash
python -m omniskill tray --skills-dir ~/.claude/commands --port 3006
```

**Add a custom skill**

Create a folder under `skills/` with a `SKILL.md` file:

```
skills/
└── my-skill/
    └── SKILL.md
```

Minimal `SKILL.md` format:

```
---
name: my-skill
description: "One sentence describing what this skill does."
---

The prompt content goes here. This is what gets injected into the chat input.
```

Run `/omniskill__reload_skills` in any chat to reload skills without restarting the server.

---

## Supported Platforms

| Platform | URL | Skills shown |
|---|---|---|
| Lovable | lovable.dev | `lovable-*` only |
| GitHub Copilot | github.com | `gh-*` only |
| Google Gemini | gemini.google.com | General skills |
| ChatGPT | chatgpt.com | General skills |
| Google AI Studio | aistudio.google.com | General skills |
| DeepSeek | chat.deepseek.com | General skills |
| Grok | grok.com | General skills |
| Perplexity | perplexity.ai | General skills |

---

## Development

To rebuild the extension from source:

```bash
cd extension
pnpm install
pnpm base-build
```

Then reload `extension/dist` in `chrome://extensions/`.

---

## License

MIT — see `LICENSE`.
