---
name: lovable-security
description: "Audits your Lovable app for the security vulnerabilities that vibe-coded apps almost always ship with."
---
# /lovable-security

Vibe-coded apps ship with security holes that their builders don't know about. Not because they're careless — because Lovable builds what you ask for, and you didn't ask for security. The result is apps live on the internet with exposed data, unprotected routes, and vulnerabilities that take minutes to exploit.

Run a security audit on what's been described in this conversation. Cover each of these four areas:

**1. Secrets and API keys**
Are there any API keys, tokens, or credentials referenced in the frontend code or in prompts? These must be in environment variables and called from backend functions only — never exposed to the browser. List any that are at risk and write the Lovable prompt to move them server-side.

**2. Supabase Row Level Security**
This is the most commonly skipped step in Lovable builds. Every Supabase table that stores user data must have RLS policies enabled, otherwise any authenticated user can read or write any other user's data. For each table described, state whether RLS is likely enabled, what policies are needed, and write the prompt to implement them.

**3. Unprotected routes**
Are there pages or actions in the app that should require authentication but might be accessible without it? List each protected route, confirm whether auth is enforced, and write the prompt to add route guards where missing.

**4. User input**
Is any user-submitted text rendered as HTML or passed directly into database queries without sanitisation? Identify the risk points and write the prompt to add input validation and safe handling.

For each vulnerability found, rate the severity (critical / high / medium) and write the exact Lovable prompt to fix it.

End with a prioritised fix list — critical issues first. Do not ship until the critical ones are resolved.
