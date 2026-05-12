---
name: roadmap-tradeoffs
description: "Define a quarterly roadmap with explicit tradeoffs tied to business outcomes — turns a wishlist into a defensible bet you can communicate upward and to customers."
---
# /roadmap-tradeoffs

Every PM has a roadmap. Almost none of them have tradeoffs. What gets called a roadmap is usually a prioritized backlog dressed up in OKR language — features ranked by a scoring model that nobody believes, with no explicit statement of what's being sacrificed and why. Then leadership reshuffles it based on the loudest customer, and Q3 looks nothing like Q2's plan. This skill forces you to structure the quarter as a set of deliberate bets, each with a stated cost and a stated business hypothesis.

**The Strategic Bets — Define 2-3, No More**
For each bet:
- State it as a hypothesis: "If we ship X, then Y customer behavior changes, resulting in Z metric improvement"
- What customer outcome does it produce? (Not "improved UX" — "enterprise admins reduce onboarding time from 4 hours to 45 minutes")
- Which business metric does it move? Be specific: NRR, logo churn rate, expansion ACV, trial-to-paid conversion, support ticket volume
- What's your confidence level and why? (Prior research, customer interviews, comparable product data)
- What's the minimum shippable version that tests the hypothesis?

**The No-List — Explicit Sacrifices**
- Name 3-5 things you are NOT doing this quarter that someone wants
- For each: who wants it, why you're deprioritizing it, and what condition would change that decision
- Example: "Not building Salesforce sync — 8 customers asked, but 6 of them are below $10K ACV and this quarter's bet is on enterprise expansion. Revisit in Q4 if enterprise ACV target is hit."
- The no-list is load-bearing — without it, every stakeholder assumes their request is in scope

**Business Metric Impact**
- For each bet: what does the metric look like today? What does it look like if the bet works?
- Which metric is your primary signal that Q3 was successful? Name one.
- What's the lag between shipping and seeing the metric move? (Some retention improvements take 60 days to show up)
- What's the kill threshold — if you're 6 weeks in and a leading indicator isn't moving, what's the decision?

**Explaining Tradeoffs to Customers**
- What will an enterprise customer say when they find out you didn't build their requested feature this quarter?
- What's the honest answer that acknowledges their pain without promising a date you can't keep?
- Which customers specifically need a personal conversation before the roadmap is public?

**Explaining Tradeoffs to Leadership**
- What question will the CEO ask about the no-list?
- What question will the CFO ask about metric impact timing?
- What would make this roadmap defensible if Q3 results are mixed?

**Rules**
1. Each bet must have a falsifiable hypothesis — "improve the product" is not a bet
2. The no-list is mandatory — a roadmap without it is incomplete
3. Business metric must be named and baselined before the quarter starts
4. You cannot have more than 3 bets — constraints force real prioritization
5. Every item on the no-list must have a named requester — anonymous requests don't belong in the no-list
6. The kill threshold for each bet must be defined before the quarter starts, not after it's failing

This output is a document you can walk into an executive review or a customer call with — it explains what you're building, what you're not, and why, without apologizing for having made choices.
