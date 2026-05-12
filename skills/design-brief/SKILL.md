---
name: design-brief
description: "Convert raw user research into an actionable design brief that forces signal from noise and drives product priority decisions."
---
# /design-brief

Raw research doesn't produce decisions — it produces paralysis or cherry-picking. A spreadsheet of interview quotes is not a brief. A brief is a structured argument: here's what users actually need, here's what the data says about priority, here's what design must do about it, and here's what we're choosing not to do. Without that argument, designers guess, stakeholders override, and the product ships to nobody in particular. This skill forces you to move from observations to implications to decisions.

**Pain Points: Ranked by Frequency AND Business Impact**
- List every distinct pain point surfaced in research
- For each: how many participants mentioned it (frequency count, not "many")?
- For each: what does it cost the business when unaddressed — churn, failed activation, support tickets, lost upsell?
- Rank the combined list. Pain point #1 is the one with high frequency AND high business cost. That is where design starts.
- Flag any pain that appears high-frequency but low-business-impact — users complain loudly about things that don't drive revenue loss.

**Job Stories: What Users Are Actually Trying to Accomplish**
- Write each job story in the format: "When [situation], I want to [motivation], so I can [outcome]."
- The situation must be specific — not "when I'm on the platform" but "when I'm presenting to my manager on Monday morning."
- The outcome reveals the real motivation: not "see my data" but "prove the campaign worked before anyone asks."
- If two users share the same pain point but have different outcomes, they are different jobs. Name them separately.
- Identify which job story each design implication serves.

**Design Implications: Evidence-Tied, Not Intuition-Tied**
- For each implication, cite the specific evidence: "Users in 7 of 12 interviews stopped at the confirmation screen — they didn't know if the action had worked."
- State the implication as a constraint: "The confirmation state must be unambiguous within 300ms and require no scrolling."
- Separate implications into Must Have (research evidence + business impact) and Should Have (pattern only, no business case yet).

**Contradictions in the Data**
- Name every place where users said one thing and did another — or where two user segments want opposite things.
- Don't resolve contradictions with a design guess. Escalate them as explicit product decisions: "Power users want density; new users want guidance. This is a segmentation decision, not a design decision."

**Assumptions Made Visible**
- What did you assume that isn't in the research data? Write each assumption as a risk: "We assumed users check the dashboard daily. If they don't, the notification-led re-engagement flow collapses."
- Propose the cheapest test that validates or kills each assumption.

**The One Change**
- Single sentence: the one design change that unlocks the most user value and business impact based on all of the above.
- If you can't name it, you haven't ranked the evidence. Go back.

**Rules**
1. No implication without a citation. "Users seem frustrated" is not evidence.
2. Contradictions escalate up, not sideways. Don't resolve a product tradeoff with a design choice.
3. Frequency alone doesn't rank a pain point. Business impact must appear in the ranking.
4. Assumptions are risks. Every assumption gets a test attached to it.
5. The brief must be arguable. If a stakeholder can't disagree with a specific point and cite why, it's too vague.

The output is a brief a PM can take into sprint planning, a designer can use to reject scope creep, and a stakeholder can read in ten minutes and make a decision.
