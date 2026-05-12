---
name: gh-dependency-audit
description: "Audits project dependencies for security vulnerabilities, abandonment, and hidden upgrade risk."
---
# /gh-dependency-audit

Dependencies are code you didn't write, can't fully control, and are responsible for anyway. Most security breaches in modern software come through dependencies, not the application code itself. Most painful upgrades are ones that were deferred too long. This audit catches both before they become incidents.

Audit the dependencies described or listed in this conversation.

**Security vulnerabilities**
For each dependency: are there known CVEs? What is the severity and what does an attacker need to exploit it? Which vulnerabilities require an upgrade to fix vs. a configuration change?

Prioritise:
- Critical/High CVEs that are exploitable in this application's context
- Vulnerabilities in direct dependencies over transitive ones (though both matter)

**Abandonment risk**
A dependency that hasn't been updated in 2 years and has open security issues is a liability.
- Last release date and last commit date
- Open issues and PRs — is the maintainer responsive?
- Download trends — is the ecosystem moving away from this package?
- Is there an actively maintained fork or replacement?

**Version lag**
- How far behind current is each dependency?
- What's in the versions between current and latest? (Features, security fixes, breaking changes)
- What's the cost of upgrading now vs. the cost of upgrading after 2 more major versions?

**Hidden upgrade risk**
- Which dependencies have breaking changes in their latest major version that would require code changes?
- Which have peer dependency conflicts with other packages in this project?

**Recommendations**
For each flagged dependency:
- **Action**: upgrade now / upgrade in next sprint / monitor / replace
- **Why**: the specific risk if left alone
- **Effort**: estimated upgrade complexity

Rules:
- Focus on production dependencies — dev dependencies have lower risk
- Don't flag every outdated package — focus on ones with security issues or real abandonment signals
- If `npm audit` or `pip-audit` output is available, use it as input — don't duplicate what automated tools already surface
