---
name: gh-incident-postmortem
description: "Turns an incident into a structured postmortem that finds the real cause and prevents recurrence."
---
# /gh-incident-postmortem

Incidents that don't produce a postmortem happen again. Postmortems that only describe what happened without finding why don't prevent recurrence. The goal is a blameless, honest account of what broke, why the system allowed it, and what will be different next time.

Write a postmortem for the incident described in this conversation.

**Incident summary**
One paragraph: what broke, when, for how long, and what the user-facing impact was. State the severity. This is the executive summary — someone who reads only this should understand the incident.

**Timeline**
Chronological sequence of events: when the incident started (even if not yet detected), when it was detected, key actions taken during response, when it was resolved. Times matter — gaps in the timeline are places where detection or response failed.

**Root cause**
Not "a bug was deployed" — why did the system allow this to happen? Apply the five-whys. The root cause is usually a process gap, a missing safeguard, or an incorrect assumption — not the code change itself.

**Contributing factors**
What made this worse or harder to catch? Slow detection, missing monitoring, unclear runbooks, wrong on-call rotation, a test suite that didn't cover this path.

**What went well**
Honest credit: what parts of the response worked? Fast detection, clear communication, effective rollback. Postmortems that only focus on failures miss the signals about what to preserve.

**Action items**
For each: what specifically will change, who owns it, and by when. Action items without owners and deadlines don't get done.
- Immediate (within 48h): changes to prevent recurrence
- Short-term (within 2 weeks): monitoring, alerting, runbook improvements
- Long-term: architectural or process changes

Rules:
- Blameless — the goal is system improvement, not assigning fault
- Be specific about the root cause — "human error" is not a root cause
- Action items must be concrete and ownable — not "improve monitoring" but "add alert when error rate exceeds 1% for 5 minutes on /api/checkout"
- If you don't know something, say so — a postmortem with honest gaps is better than one with false certainty
