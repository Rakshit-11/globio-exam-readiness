# Ready, Schritt für Schritt

A short, original Goethe A1 practice check for learners who want a clearer next step before booking an exam.

**Live app:** https://rakshit-11.github.io/globio-exam-readiness/  
**Repository:** https://github.com/Rakshit-11/globio-exam-readiness

## What this MVP does

Learners answer 12 original multiple-choice questions: four vocabulary, four grammar and four reading questions based on a short message. Results show the number correct, a breakdown by skill and up to three practice steps connected to missed topics. The check runs entirely in the browser and does not collect or transmit answers.

### How the score works

Each question is worth one point. The overall practice score is correct answers divided by 12; each skill score is correct answers out of four. The interpretation is deliberately provisional: 75% or higher, with at least 50% in every skill, is described as “Promising signals on the topics checked”; 55–74% is “A good base to keep building”; below 55% is “More practice will help.” Missed concepts are ranked in question order and the first three distinct practice topics are recommended. When there is only one missed topic, the app adds a practice idea from the learner's lowest-scoring skill. A perfect score prompts practice in listening, writing and speaking areas this check does not assess rather than inventing a weakness.

These cutoffs are product hypotheses, not validated readiness thresholds. The score is not a probability of passing, an official Goethe assessment, or a recommendation to book. The Goethe A1 exam also includes listening, writing and speaking; this MVP checks none of those skills and its short vocabulary, grammar and reading sample cannot represent the complete exam.

## Why Goethe A1

We chose Goethe A1 to make one small, clearly bounded MVP around a single named exam. A focused reference keeps the questions, wording and learner feedback interpretable while we test whether this kind of check is useful. This is a scope decision—not a claim that Goethe is better than ÖSD. We would revisit the choice with learner demand and evidence before expanding or switching exam coverage.

## How to know whether the score is right

First, ask A1 teachers and exam-preparation specialists to review every item for level, ambiguity, answer-key accuracy and coverage. Then pilot the check with learners who are already preparing for Goethe A1. Compare their skill-level results with blinded teacher ratings and, with explicit consent, later official section outcomes. Check whether higher practice scores reliably correspond to stronger outcomes, whether the proposed cutoffs separate learners who need more support from those who are likely prepared, and whether results are consistent across alternate question sets. Inspect errors and uncertainty by skill and learner background; revise questions or thresholds when they systematically mislead. Recruit a second cohort to confirm any revised cutoffs before using “ready” language. Five learners can reveal confusing questions and interview themes, but are far too few to validate a predictive score. Until this work is done, show a transparent practice snapshot only, never a pass guarantee or booking recommendation.

### Five learner interviews before version 2

1. What made you decide you might be ready—or not ready—to book, and what did you do to check?
2. Which parts of the Goethe A1 exam feel hardest to judge in your preparation, and why?
3. As you take this check, is any question confusing, unnatural or unlike the German you are learning? What makes it feel that way?
4. Do the skill breakdown and practice suggestions match what you would work on next? What is missing or misleading?
5. What evidence would you trust before using a tool like this to help decide when to book?

## Run locally

No build step or dependencies are required. Open `index.html` in a browser, or serve this folder with any static file server.

## Deploy

GitHub Pages is deployed from the `rakshit-11-goethe-a1-readiness` branch using the workflow in `.github/workflows/pages.yml`.
