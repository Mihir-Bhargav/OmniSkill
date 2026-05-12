---
name: ml-problem-definition
description: "Validate whether ML is the right solution before building the model — so you don't spend months on a prediction nobody uses."
---
# /ml-problem-definition

The most expensive ML mistake isn't a model that doesn't work — it's a model that works perfectly and changes nothing. Months of engineering, a clean validation set, 92% accuracy, and then: nobody integrates it into the workflow, the business outcome doesn't move, or the problem that actually existed was a data quality issue that a JOIN would have solved in a week. This skill runs the validation that most teams skip: is this actually an ML problem, is the data real, does the accuracy threshold matter to the business, and will anyone change behavior based on the output? You run this before writing a line of model code.

**The Business Outcome Being Pursued**
- State the business outcome in measurable terms: not "improve churn prediction" but "reduce monthly churn rate from 4.2% to 3.0%, saving approximately $180K/month in lost ARR."
- Who owns this outcome? Name the person whose OKR or bonus depends on moving this metric. If nobody owns it, there's no demand for the solution.
- What is the current process for addressing this problem — manual, rule-based, ignored? Describe what actually happens today, step by step. If the current process is "nobody does anything," the problem may be organizational, not technical.

**Current State and Gap**
- Quantify the current state: baseline performance, error rate, delay, cost, or whatever dimension the problem lives in.
- Quantify the gap: what would "solved" look like, and how much better is that than current state?
- Ask: is this gap real, or is it a perceived gap that nobody has actually measured? If the gap hasn't been measured, measure it before building anything.

**Whether ML Can Realistically Close It**
- Is this actually an ML problem? Apply the three-question test:
  1. Is there a pattern in historical data that predicts the outcome? (If the outcome is random or driven by factors you can't observe, ML won't help.)
  2. Is the pattern stable? (If the relationship between inputs and outputs changes frequently — new products, regulatory changes, market shifts — a static model degrades fast.)
  3. Can the prediction be acted upon? (If the model fires and nobody changes behavior, the prediction has no value.)
- If any answer is "no" or "unclear," name the cheaper solution first: a rule-based system, a data dashboard, a process change, a simple regression, or a better reporting tool. ML is the right choice when these cheaper solutions have been ruled out, not as the starting assumption.

**What Data Is Actually Available vs Needed**
- List the input features the model would use. For each: does it exist in a queryable system today, what's its completeness (% of records with this field populated), and what's the latency (how fresh is it at prediction time)?
- List the labels required for training. How are they generated? Are they ground truth, or are they a proxy? "Churned customer" is cleaner than "customer who didn't renew" which is cleaner than "customer flagged as at-risk by the CSM team" — but they're not the same label.
- Identify the data gap: what does the model need that you don't currently have? What would it take to generate or acquire it?
- Red flag: if the labels don't exist and would take 6 months of new data collection to produce, say so now.

**What Accuracy Threshold Moves the Needle**
- What precision and recall tradeoff does the business actually need? This is a business decision, not a data science decision.
- Example: "For churn intervention, false positives (targeting non-churners) cost $40 in CSM time per contact. False negatives (missing actual churners) cost $1,400 in lost ARR per customer. This means we accept lower precision to maximize recall — we'd rather call 100 people unnecessarily than miss one churner worth $1,400."
- What accuracy would the model need to be better than the current approach? Calculate this explicitly. If the current approach is a human with 65% accuracy and the model achieves 70%, is the delta worth the infrastructure cost?
- What accuracy would make the model worse than the status quo? Define the kill threshold before you train.

**Implementation and Maintenance Burden**
- Where does the model's output go? Name the specific system, API, or workflow. "The data team will build a dashboard" is not an integration plan — it's a hope that someone will look at the dashboard.
- Who retrains the model when it degrades? How often? Who monitors for drift? Name the owner.
- What engineering infrastructure is required: feature store, serving layer, monitoring pipeline, retraining trigger? Estimate the build and ongoing maintenance cost.
- If the model requires infrastructure that doesn't exist, the ML project is actually two projects: infrastructure build + model build. Scope both.

**Go/No-Go Criteria Before a Line of Code Is Written**
- State the explicit conditions that must be true to proceed:
  1. Business outcome owner has confirmed they will act on model predictions.
  2. Required data exists with sufficient completeness and coverage.
  3. Labels are ground truth or a defensible proxy.
  4. An accuracy threshold exists that is both achievable and meaningful to the business.
  5. Integration path is specified and owned.
  6. Maintenance ownership is assigned.
- If any condition is unmet: name what must happen first. An ML project that starts before these conditions are met is a research project — valuable for learning, not for business outcomes.

**Rules**
1. The business outcome is measured and owned before any scoping begins. No owner = no demand.
2. Cheaper solutions are explicitly ruled out before ML is scoped. Rule-based beats ML when the rules are stable.
3. Data availability is verified against actual query results, not assumed from schema documentation.
4. Accuracy threshold is derived from business economics — precision/recall tradeoff in dollar terms.
5. Integration path is named before the model is built. "We'll figure out deployment later" has killed more ML projects than bad models.
6. Go/no-go criteria are checkboxes, not guidelines. All six must be checked before the sprint starts.

The output is a problem definition document that either gives a team the green light with clear success criteria — or saves them three months by showing why the problem isn't ready for ML yet.
