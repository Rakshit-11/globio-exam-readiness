# Ready, Schritt für Schritt

A short, original Goethe A1 practice check for learners who want a clearer next step before booking an exam.

**Live app:** https://rakshit-11.github.io/globio-exam-readiness/  
**Repository:** https://github.com/Rakshit-11/globio-exam-readiness

## What this MVP does

Learners answer 12 original multiple-choice questions: four vocabulary, four grammar and four reading questions based on a short message. Results show the number correct, a breakdown by skill and up to three practice steps connected to missed topics. The check runs entirely in the browser and does not collect or transmit answers.

### Experimental scoring model

The learner can optionally mark an answer “I'm guessing / unsure.” An invisible per-question timer records active time until the selected option is chosen, pauses when the tab is hidden, and accumulates across back-navigation if the learner changes their answer. There is no countdown. Points per answer are:

| Response | Points |
| --- | ---: |
| Correct, not marked unsure, under 40 seconds | +10 |
| Correct but marked unsure, or 40 seconds or more | +5 |
| Wrong, not marked unsure, under 15 seconds | −2 |
| Every other wrong answer | 0 |

Unless the learner marks “I'm guessing / unsure,” the model treats the answer as confident. The 40–45 second interval is deliberately included in the +5 “fragile” category; a correct response at exactly 40 seconds is +5. The only penalty is for a fast, confident wrong answer. It is shown as a possible distractor trap to revisit—not proof of a knowledge gap. Timing can reflect reading pace, device, comfort or access needs; it is an experimental cue, not an objective measure of ability. A slow correct answer earns fewer points, but there is no extra penalty for a slow or unsure wrong answer.

Raw points are normalized against 120 maximum overall and 40 per skill; displayed percentages are clamped at 0. The promising-signal band requires at least 75% overall and at least 55% in each included skill. A high total cannot offset a skill below that floor. These are prototype thresholds, not Goethe pass criteria, a “safe to book” rule or a validated prediction. We reviewed Goethe's [official examination regulations (PDF)](https://www.goethe.de/pro/relaunch/prf/en/Pruefungsordnung.pdf) and linked the [Goethe A1 exam page](https://www.goethe.de/en/spr/kup/prf/prf/gzsd1.html); the accessible general regulations do not state the exam-specific numeric pass threshold, so this MVP intentionally makes no claim about an official passing percentage. Confirm current A1 requirements with Goethe-Institut materials or your exam centre.

Each question has a diagnostic tag. The app ranks tags by missed answers first and the experimental points within each tag second, then recommends two or three concrete 20-minute drills. If a learner has fewer than two tags with misses, it adds the next-lowest included tag as a practice/maintenance prompt; a perfect strong signal points to listening and writing/speaking because those abilities are not assessed here.

This 12-item check is unofficial and incomplete: it covers only vocabulary, grammar and reading, not listening, writing or speaking. It is not a probability of passing or booking advice and cannot guarantee exam success. The thresholds and calibration heuristics remain unvalidated hypotheses.

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
