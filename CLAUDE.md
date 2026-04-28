# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Project: OmniSkill

**What it is:** A transport-agnostic MCP middleware that bridges LLMs (Claude Code, Gemini CLI, Gemini Web, ChatGPT Web) to local "Skills" — self-contained packages defined by a `SKILL.md` and associated scripts.

### Architecture

**Hosts (Control Plane)**
- Local: Claude Code, Gemini CLI — spawn OmniSkill directly via stdio.
- Web: Gemini Web, ChatGPT Web — connect via HTTP/SSE through a secure tunnel (Cloudflare/ngrok).

**Transport Layer**
| Type | Mechanism | Use Case |
|------|-----------|----------|
| Stdio | stdin/stdout JSON-RPC | CLI hosts |
| SSE | Server-Sent Events over HTTP | Web hosts via secure tunnel |

**Protocol:** JSON-RPC 2.0 following the MCP schema. Lifecycle: Initialize → Discover (Tools + Resources) → Call Loop.

**The Universal Shim (core server logic)**
```
SKILL.md → JSON Schema (Tool definitions for the LLM)
LLM Arguments → Local script execution (Py/JS subprocess)
Stdout result → Markdown response back to LLM
```

**Local resources accessed:** Skill packages (.ZIP), Local Scripts (Py/JS), Obsidian Vault.

### Critical Constraints
- **Logging:** ALL debug output must go to `stderr`. Never write to `stdout` — it corrupts the JSON-RPC stream.
- **CORS:** Restrict to specific AI provider domains only (not wildcard).
- **Tunnel:** SSE endpoint is exposed via Cloudflare or ngrok for web hosts.

### Development Tracks
- **Track 1:** Protocol Implementation — MCP Server, JSON-RPC 2.0 handling.
- **Track 2:** Skill Resolution — ZIP extraction, SKILL.md parsing, subprocess management.
