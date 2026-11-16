# Ready, Schritt für Schritt

A short, original Goethe A1 practice check for learners who want a clearer next step before booking an exam.

**Live app:** https://rakshit-11.github.io/globio-exam-readiness/  
**Repository:** https://github.com/Rakshit-11/globio-exam-readiness

## What this MVP does

Learners answer 12 original multiple-choice questions: four vocabulary, four grammar and four reading questions based on a short message. Results show equal-weight accuracy, a breakdown by practice area and up to three tag-based 20-minute drills. A visible stopwatch tracks active time on the current item; it pauses when the browser tab is hidden and accumulates if learners navigate back. There is no countdown. Learners can optionally mark answers “I'm guessing / unsure.” The final snapshot reports elapsed time and the number of unsure answers separately. Neither affects accuracy. Timing is local to this practice interaction and is not comparable to Goethe's exam section clocks.

The app runs entirely in the browser. It does not collect, store or transmit answers, confidence choices or timings.

### Research and scoring options considered

We selected Goethe A1 for a focused MVP because one published exam blueprint gives us a bounded, interpretable reference for question writing and review. This is a scope decision, not a claim that Goethe is better than ÖSD. Goethe's primary [A1 exam administration rules (PDF)](https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_A1_Start_Deutsch_1.pdf) say the exam has listening, reading, writing and speaking sections. The written exam lasts 65 minutes (listening about 20, reading 25, writing 20); speaking lasts 15 minutes in groups of up to four, with no preparation time. Each section is worth up to 15 raw points. The section points are multiplied by 1.66 and summed/rounded to a 100-point result (written maximum 75, oral maximum 25). The exam is passed at 60/100 or higher only when all sections have been completed. These rules were checked in the version dated 1 September 2025.

Goethe's [A1 test-description booklet (PDF)](https://www.goethe.de/pro/relaunch/prf/en/Pruefungsziele_Testbeschreibung_A1_SD1.pdf) describes the exam as action-oriented: it assesses whether learners can handle everyday communicative tasks, rather than primarily testing isolated grammar or vocabulary knowledge. This check is not a representative sample of that exam blueprint: it uses 12 original multiple-choice items in three practice categories and does not assess listening, writing or speaking.

| Approach | What it offers | Main trade-off |
| --- | --- | --- |
| **1. Equal-weight correct / total** | Simple, auditable feedback on the questions actually answered; useful for a small practice set. | A short, narrow sample is noisy and cannot establish exam readiness. |
| **2. Confidence and latency heuristic** | Can expose how learners felt and how long items took. | Self-reported confidence is subjective; speed can reflect reading pace, access needs or device conditions. Without calibration against outcomes, point adjustments and cutoffs are arbitrary. |
| **3. Exam-blueprint tasks, official rubrics and representative timing** | Better content and task-format alignment; could cover the four exam sections and their official weights. | Requires original representative tasks, productive-skill rubrics, and enough development and review; closer resemblance alone does not validate a prediction. |
| **4. Teacher-reviewed productive skills** | Human rubric feedback on writing and speaking, the areas this app omits. | Requires trained reviewers, time and checks for scoring consistency; still only a partial readiness picture. |
| **5. Cohort outcome validation / predictive model** | Could test whether results relate to later official outcomes and estimate useful evidence after sufficient data. | Needs a larger, consented learner cohort, reliable outcomes, held-out confirmation and fairness checks; small samples risk misleading or overfit predictions. |

**Choice for this MVP:** use approach 1 as a practice-only measure: each of the 12 questions counts equally, with no pass threshold and no “ready” verdict. The stopwatch and uncertainty toggle remain separate descriptive signals. Missed answers and self-reported uncertainty rank the diagnostic tags for practice suggestions; neither is converted into readiness points. This is the most transparent useful choice for the evidence available now. It does not reproduce Goethe's section weights or rubrics and its percentage must not be compared with the official 60% pass threshold.

The result always says **Evidence incomplete**. It lists listening, writing and speaking as not assessed, and does not recommend whether to book. The Goethe score and pass rule apply only to the actual exam with all four sections completed under Goethe's official scoring. The practice snapshot is not an official Goethe assessment or a guarantee of passing.

## How to know whether the score is right

First, ask Goethe A1 teachers and assessment specialists to review the 12 items for level, answer-key accuracy, ambiguity and alignment with the official action-oriented blueprint. Observe five learners taking the check and use their interviews to find confusing language, inaccessible interactions and practice suggestions that do not fit. In a larger opt-in pilot, compare item and skill patterns with blinded teacher judgements, and—with explicit informed consent—later official outcomes for all four sections. Check score stability using alternate original item sets, item difficulty, subgroup differences and whether the score adds useful information beyond teacher judgement. Do not infer a booking threshold from five interviews or from a small convenience sample. If a future full-blueprint measure proposes a cutoff, pre-register it and test it on a separate cohort before considering any readiness wording. Until evidence supports more, present only a transparent practice snapshot, never a pass guarantee or booking recommendation.

### Five learner interviews before version 2

1. What made you decide you might be ready—or not ready—to book, and what did you do to check?
2. Which parts of the Goethe A1 exam feel hardest to judge in your preparation, and why?
3. As you take this check, is any question confusing, unnatural or unlike the German you are learning? What makes it feel that way?
4. Do the skill breakdown and practice suggestions match what you would work on next? What is missing or misleading?
5. What evidence would you trust before using a tool like this to help decide when to book?

## Run locally

No build step or dependencies are required. Open `index.html` in a browser, or serve this folder with any static file server. Run the focused checks with `node --test`.

## Deploy

GitHub Pages deploys on pushes to `main` using `.github/workflows/pages.yml`; the `github-pages` environment restricts deployment branches. Confirm the main-branch workflow succeeds before treating a change as live.
