---
name: security-audit
description: "Reviews code or a system description for security vulnerabilities and suggests fixes."
---
# /security-audit

Review the code or system described in this conversation for security issues.

Check for:
- **Injection vulnerabilities** — SQL injection, command injection, XSS, template injection
- **Authentication & authorisation** — missing auth checks, broken access control, insecure tokens
- **Data exposure** — sensitive data in logs, responses, error messages, or client-side code
- **Input validation** — unvalidated or unsanitised user input
- **Dependency risks** — use of outdated or known-vulnerable libraries
- **Secrets handling** — hardcoded credentials, API keys in code or config
- **Insecure defaults** — permissive CORS, missing security headers, debug mode in production

For each issue found:
- **Severity**: critical / high / medium / low
- **What the risk is** — what an attacker could do if they exploited this
- **Where it is** — the specific line or component
- **How to fix it** — concrete, actionable change

Rules:
- Prioritise by severity — critical issues first
- Don't flag theoretical risks that require unrealistic conditions
- If the code looks clean, say so — a false sense of security from an incomplete audit is worse than no audit
