# Ready, Schritt für Schritt

A short, original Goethe A1 practice check that covers all four exam sections without pretending to be a full mock exam or readiness prediction.

**Live app:** https://rakshit-11.github.io/globio-exam-readiness/  
**Repository:** https://github.com/Rakshit-11/globio-exam-readiness

## What this MVP does

The check has 12 original tasks—three per official section:

- **Hören (Listening):** short everyday announcements and conversations, played with the browser's generated German voice.
- **Lesen (Reading):** a shop notice, personal message and simple timetable.
- **Schreiben (Writing):** a short form and two practical messages.
- **Sprechen (Speaking):** self-introduction, asking and answering questions, and making a request.

Vocabulary and grammar are used inside these everyday tasks; they are not presented as separate Goethe exam sections. The check is untimed because 12 short prompts cannot meaningfully reproduce Goethe's section clocks. It does not claim to be a full timed mock.

Results show separate correctness feedback for counted Hören and Lesen items and rank up to three practice topics from mistakes. Listening items count only after the complete message is played and its transcript has not been opened. Writing and speaking are practice previews, marked **“AI scoring preview — not connected”**; they receive no score. The app does not show a combined percentage or “ready” verdict that could treat these unscored sections as passes.

All tasks and scoring run in the browser. Answers are held only in the current page session and are not sent or saved. The speaking prompts do not use a microphone, record speech or run speech-to-text. There is no AI service or API key.

### Research and scoring approaches considered

We chose Goethe A1 to keep the MVP focused on one documented exam blueprint; this is a scope choice, not a claim that Goethe is better than ÖSD. Goethe's primary [A1 exam administration rules (PDF)](https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_A1_Start_Deutsch_1.pdf) describe four sections: listening, reading, writing and speaking. The written exam lasts 65 minutes (listening about 20, reading 25, writing 20); speaking lasts 15 minutes in groups of up to four, with no preparation time. Each section is worth up to 15 raw points. Section points are multiplied by 1.66 and summed/rounded to a 100-point result (written maximum 75, oral maximum 25). Passing requires at least 60/100 and completion of all sections. These details were checked in the version dated 1 September 2025.

The [A1 test-description booklet (PDF)](https://www.goethe.de/pro/relaunch/prf/en/Pruefungsziele_Testbeschreibung_A1_SD1.pdf) describes an action-oriented exam: learners demonstrate everyday communication, not only isolated grammar and vocabulary. The app uses original, recognizable task formats, but three short prompts per section are not a representative sample of the exam, its rubrics or its official timing.

| Approach | What it offers | Main trade-off |
| --- | --- | --- |
| **1. Equal-weight correct / total** | Simple, auditable feedback on objective items. | A short sample is noisy and cannot establish readiness; open responses still need a reliable rubric. |
| **2. Confidence and latency heuristic** | Describes how sure learners felt and how long they took. | Confidence is subjective; speed reflects reading pace, access needs and device conditions. Without outcome calibration, point adjustments and cutoffs are arbitrary. |
| **3. Blueprint tasks, official rubrics and representative timing** | Better alignment with actual exam formats and weights. | Needs reviewed original items, full section coverage and productive-skill rubrics; resemblance alone does not validate predictions. |
| **4. Teacher-reviewed writing and speaking** | Human feedback on form completion, messages and interaction. | Requires trained reviewers and checks for scoring consistency; reviewer feedback is not instant or free. |
| **5. Cohort outcome validation / predictive model** | Tests whether evidence relates to later official results. | Needs a larger opt-in cohort, reliable outcomes, held-out confirmation and subgroup fairness checks; a small sample can mislead. |

**Choice for this MVP:** use approach 1 only for Hören and Lesen: each counted multiple-choice response is either correct or incorrect, and results remain separate by section. A listening item is omitted from the denominator if audio is unavailable, playback did not finish, or the transcript was opened. Missed diagnostic tags suggest practice topics; they are not exam scores. Writing and speaking stay unscored until a teacher rubric or validated service exists. No AI, speech recognition or transcript-matching heuristic is represented as AI grading.

Goethe's official 60% pass rule applies only to the actual 100-point exam when all four sections are completed under its scoring rules. This practice check has no equivalent overall score and is not an official Goethe assessment, pass prediction, or booking recommendation.

## How to know whether the feedback is useful

Before interpreting the scores, have Goethe A1 teachers review each original listening and reading item for level, answer-key accuracy, ambiguity and alignment with the official action-oriented task descriptions. Ask writing and speaking teachers to review the form, messages and role prompts, then create an explicit rubric before scoring any pilot responses. Observe five learners completing the check; ask where they hesitate, whether the generated listening voice is understandable, and whether the prompts and privacy explanation are clear. Those interviews can uncover usability and accessibility problems, but cannot validate a readiness score or the quality of a predictive model.

Next, run a consented pilot large enough to examine item difficulty, section-level consistency and differences across relevant learner groups. Have independent reviewers score anonymized writing and speaking samples with the draft rubric and compare agreement. If learners consent, later compare these limited practice signals with blinded teacher judgements and eventual official results across all four Goethe sections. Reserve a separate cohort for confirmation; report uncertainty and missing evidence instead of converting a few multiple-choice results into an overall pass likelihood. Do not introduce an overall readiness label until representative tasks, reliable productive-skill scoring and outcome validation support it.

### Five learner interviews before version 2

1. What would you want to know before deciding whether to book a Goethe A1 exam, and where do you look for that evidence now?
2. Which of the four sections feels hardest to practise or judge on your own? What makes it difficult?
3. Did the listening messages, functional texts, form, written messages and speaking prompts feel clear and believable for your A1 course? Which felt least useful?
4. Was the browser-generated listening voice understandable, and did the transcript option support you without confusing what the listening feedback meant?
5. What feedback would you trust for writing and speaking, and what privacy or human-review explanation would you need before using AI-assisted feedback?

## Run locally

No build step or dependencies are required. Open `index.html` in a browser, or serve this folder with any static file server. Run the focused checks with `node --test`.

## Deploy

GitHub Pages deploys on pushes to `main` using `.github/workflows/pages.yml`; the `github-pages` environment restricts deployment branches. Submit changes through a pull request, then confirm the main-branch workflow succeeds before treating a change as live.
