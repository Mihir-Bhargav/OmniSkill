---
name: gh-security-hardening
description: "Goes beyond finding bugs — produces a hardening plan that raises the baseline security posture of a system."
---
# /gh-security-hardening

Security audits find the holes that already exist. Hardening closes the holes that haven't been found yet. The difference is posture: an audit is reactive, hardening is structural. A hardened system is harder to compromise even when a vulnerability exists because the blast radius is limited, the detection is fast, and the recovery is practised.

Produce a security hardening plan for the system described in this conversation.

**Attack surface reduction**
What does this system expose that doesn't need to be exposed? Every endpoint, port, permission, and credential that exists is a potential entry point.
- Endpoints or functionality that could be removed or restricted
- Services running with more permissions than they need (principle of least privilege)
- Internal services unnecessarily exposed to the internet
- Admin interfaces accessible without IP restriction or VPN

**Authentication and authorisation hardening**
- Is MFA enforced for privileged access?
- Are service-to-service calls authenticated with short-lived tokens or certificates, not long-lived secrets?
- Are permissions scoped to the minimum required, and reviewed on a schedule?
- Are there any shared credentials that should be individualised for auditability?

**Secrets management**
- Where do secrets live? Are any hardcoded, in environment variables on shared systems, or in config files committed to git?
- Are secrets rotated? How would you detect a leaked secret?
- Is access to secrets logged and auditable?

**Detection and response**
- What would an attacker be able to do before being detected?
- Are there alerts on: failed authentication spikes, unusual data access patterns, privilege escalation attempts?
- Is there a runbook for "we think we've been compromised"?

**Hardening actions — prioritised**
For each finding:
- **Action**: specific change to make
- **Effort**: hours / days / sprint
- **Impact**: what attack does this prevent or limit?

Rules:
- Hardening is about raising the baseline, not achieving perfection — prioritise by effort-to-impact ratio
- Detection matters as much as prevention — flag gaps in observability as seriously as access control gaps
- Don't recommend security theatre — controls that feel secure but don't actually limit attacker capability
