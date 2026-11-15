import { questions, readingText } from "./questions.mjs";
import { recommendPractice, scoreAnswers, SCORING_RULES } from "./readiness.mjs";
import { createQuestionTimer } from "./question-timer.mjs";

const app = document.querySelector("#app");
let screen = "intro";
let currentQuestion = 0;
const responses = questions.map(() => ({ answer: null, unsure: false, latencyMs: null }));
const questionTimer = createQuestionTimer();

function renderIntro() {
  app.innerHTML = `
    <section class="intro-layout" aria-labelledby="intro-title">
      <div class="intro-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span>A little clarity before the big day</p>
        <h1 id="intro-title">Am I ready<br>for <span>Deutsch?</span></h1>
        <p class="intro-lede">A short check-in for your Goethe A1 journey. Find out what feels solid—and what to practise next.</p>
        <div class="intro-actions">
          <button class="button button-primary" type="button" data-action="start">Start my check <span aria-hidden="true">→</span></button>
          <span class="time-note"><span aria-hidden="true">◷</span> 12 questions · no countdown</span>
        </div>
        <div class="scope-note">
          <span class="scope-icon" aria-hidden="true">i</span>
          <p>Unofficial and not a pass predictor. Listening, writing and speaking aren't included. We use your confidence and active time as experimental signals; there's no countdown, and timing is not a measure of reading speed.</p>
        </div>
      </div>
      <aside class="journey-card" aria-label="Your practice plan">
        <div class="journey-topline"><span>YOUR PRACTICE PLAN</span><span class="journey-spark" aria-hidden="true">✳</span></div>
        <div class="journey-illustration" aria-hidden="true">
          <div class="sun-disc"></div>
          <div class="hill hill-back"></div>
          <div class="hill hill-front"></div>
          <div class="path-dot dot-one"></div>
          <div class="path-dot dot-two"></div>
          <div class="path-dot dot-three"></div>
          <div class="flag"><span>A1</span></div>
          <div class="path-line"></div>
        </div>
        <div class="journey-copy">
          <p class="journey-caption">Drei kleine Schritte</p>
          <h2>One check.<br>A clearer next step.</h2>
          <div class="skill-chips" aria-label="Skills in this check">
            <span>Wörter</span><span>Grammatik</span><span>Lesen</span>
          </div>
        </div>
        <p class="journey-foot">Made for learners, not examiners <span aria-hidden="true">↗</span></p>
      </aside>
    </section>
  `;
}

function renderPassage() {
  return `
    <aside class="passage-panel" aria-labelledby="passage-title">
      <div class="passage-heading">
        <span class="passage-icon" aria-hidden="true">“</span>
        <div><p class="passage-label">READING NOTE</p><h2 id="passage-title">${readingText.title}</h2></div>
      </div>
      <div class="passage-text">${readingText.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join("")}</div>
      <p class="passage-tip"><span aria-hidden="true">↳</span> Read it as often as you need.</p>
    </aside>
  `;
}

function renderQuestion() {
  const question = questions[currentQuestion];
  const skillClass = question.skill.toLowerCase();
  const response = responses[currentQuestion];
  const selected = response.answer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  app.innerHTML = `
    <section class="quiz-layout${question.passage ? " reading-layout" : ""}" aria-labelledby="question-title">
      ${question.passage ? renderPassage() : ""}
      <div class="quiz-main">
        <div class="quiz-meta">
          <span class="quiz-back-label">Your Goethe A1 check</span>
          <span class="question-count">Question <strong>${currentQuestion + 1}</strong> of ${questions.length}</span>
        </div>
        <div class="progress-track" role="progressbar" aria-label="Check progress" aria-valuenow="${currentQuestion + 1}" aria-valuemin="1" aria-valuemax="${questions.length}">
          <span style="--progress:${progress / 100}"></span>
        </div>
        <div class="question-area">
          <span class="skill-label ${skillClass}"><span aria-hidden="true">${question.skill === "Vocabulary" ? "Aa" : question.skill === "Grammar" ? "§" : "¶"}</span>${question.skill}</span>
          <h1 id="question-title" tabindex="-1">${question.prompt}</h1>
          <p class="answer-hint">Choose one answer</p>
          <div class="answer-list" role="radiogroup" aria-labelledby="question-title">
            ${question.options.map((option, index) => `
              <label class="answer-option${selected === index ? " is-selected" : ""}">
                <input type="radio" name="answer" value="${index}" ${selected === index ? "checked" : ""}>
                <span class="answer-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
                <span class="answer-text">${option}</span>
                <span class="answer-check" aria-hidden="true">${selected === index ? "✓" : ""}</span>
              </label>
            `).join("")}
          </div>
          <label class="confidence-toggle">
            <input type="checkbox" name="unsure" ${response.unsure ? "checked" : ""}>
            <span class="confidence-switch" aria-hidden="true"></span>
            <span class="confidence-copy"><strong>I'm guessing / unsure</strong><small>Mark this if you're not confident in your answer.</small></span>
          </label>
        </div>
        <div class="quiz-controls">
          <button class="button button-quiet" type="button" data-action="back" ${currentQuestion === 0 ? "disabled" : ""}>Back</button>
          <button class="button button-primary" type="button" data-action="next" ${selected === null ? "disabled" : ""}>
            ${currentQuestion === questions.length - 1 ? "See my results" : "Next question"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      ${question.passage ? "" : `
        <aside class="quiz-aside" aria-label="A note for your check">
          <div class="aside-mark" aria-hidden="true">✳</div>
          <p class="aside-german">Ganz in deinem Tempo.</p>
          <p>Take your time. This is a practice moment, not a test of your worth or your journey.</p>
          <div class="aside-dots" aria-hidden="true"><i></i><i></i><i></i></div>
        </aside>
      `}
    </section>
  `;
  const selectedAnswer = document.querySelector(".answer-list input:checked");
  (selectedAnswer || document.querySelector("#question-title"))?.focus({ preventScroll: true });
  if (document.visibilityState === "visible") questionTimer.start(currentQuestion);
}

function renderResults() {
  const score = scoreAnswers(questions, responses);
  const recommendations = recommendPractice(score);
  const hasStrongSignal = score.percentage >= score.thresholds.strongSignal &&
    Object.values(score.skillResults).every(result => result.percentage >= score.thresholds.skillFloor);
  const skillNames = ["Vocabulary", "Grammar", "Reading"];

  app.innerHTML = `
    <section class="results-layout" aria-labelledby="results-title">
      <div class="results-heading">
        <p class="eyebrow"><span class="eyebrow-line"></span>Your practice snapshot</p>
        <h1 id="results-title">Every step <span>counts.</span></h1>
        <p class="results-lede">Here's what this little check can—and can't—tell you.</p>
      </div>
      <div class="results-grid">
        <div class="score-panel">
          <div class="score-top"><span>EXPERIMENTAL SIGNAL</span><span aria-hidden="true">✳</span></div>
          <div class="score-number">${score.percentage}<span>%</span></div>
          <p class="score-caption">${score.rawPoints} / 120 points · ${score.correct} of ${score.total} answers right</p>
          <div class="score-divider"></div>
          <h2>${score.interpretation.title}</h2>
          <p>${score.interpretation.description}</p>
          <p class="provisional-note"><span aria-hidden="true">i</span> These prototype thresholds are not Goethe pass criteria. This is not a booking recommendation or a validated prediction.</p>
        </div>
        <div class="skills-panel">
          <h2>By skill</h2>
          <p class="panel-intro">Experimental points normalized to 40 per skill.</p>
          ${skillNames.map(skill => {
            const result = score.skillResults[skill];
            const skillClass = skill.toLowerCase();
            return `
              <div class="skill-result">
                <div class="skill-result-top">
                  <span class="skill-label ${skillClass}">${skill}</span>
                  <strong>${result.percentage}%</strong>
                </div>
                <div class="skill-track" role="img" aria-label="${skill}: ${result.correct} of ${result.total} correct">
                  <span class="${skillClass}" style="width:${result.percentage}%"></span>
                </div>
                <p class="skill-points">${result.rawPoints} / 40 points · ${result.correct} of ${result.total} correct</p>
              </div>
            `;
          }).join("")}
          <p class="skills-footnote">These are practice scores, not official exam-section scores.</p>
        </div>
      </div>
      <div class="calibration-notes">
        <p><strong>Why flag a fast, confident miss?</strong> A wrong answer not marked unsure and selected in under 15 seconds loses 2 experimental points so a possible distractor trap is easier to revisit. ${score.fastConfidentMisses ? `That happened on ${score.fastConfidentMisses} ${score.fastConfidentMisses === 1 ? "answer" : "answers"}.` : "No answers met that pattern."} It is a prompt to review—not proof of a knowledge gap.</p>
        <p>There is no visible countdown. Active time pauses while this tab is hidden. Timing can reflect reading pace, device or access needs; it is not an objective measure of ability.</p>
      </div>
      <details class="score-method">
        <summary>How this experimental score works</summary>
        <ul>
          <li><strong>+${SCORING_RULES.correctConfidentPoints}:</strong> correct, not marked unsure and answered in under ${SCORING_RULES.confidentCorrectUnderMs / 1_000} seconds.</li>
          <li><strong>+${SCORING_RULES.correctFragilePoints}:</strong> correct but marked unsure, or answered in ${SCORING_RULES.confidentCorrectUnderMs / 1_000} seconds or more. The 40–45 second range is treated as fragile too.</li>
          <li><strong>${SCORING_RULES.fastConfidentWrongPoints}:</strong> wrong, not marked unsure and answered in under ${SCORING_RULES.fastWrongUnderMs / 1_000} seconds.</li>
          <li><strong>${SCORING_RULES.otherWrongPoints}:</strong> every other wrong answer.</li>
          <li>Raw points are normalized against 120 overall and 40 per skill; displayed percentages cannot go below 0.</li>
          <li>The promising-signal band is at least 75% overall and at least 55% in each included skill. These are experimental product thresholds, not Goethe pass marks.</li>
          <li>If you leave the optional “I'm guessing / unsure” toggle off, the model treats the answer as confident.</li>
        </ul>
      </details>
      <section class="practice-section" aria-labelledby="practice-title">
        <div class="practice-heading">
          <div><p class="eyebrow"><span class="eyebrow-line"></span>Your next steps</p><h2 id="practice-title">${hasStrongSignal ? "Keep your momentum." : "A few things to practise."}</h2></div>
          <span class="practice-star" aria-hidden="true">✳</span>
        </div>
        <ol class="practice-list">
          ${recommendations.map((item, index) => `
            <li>
              <span class="practice-number">${String(index + 1).padStart(2, "0")}</span>
              <div class="drill-copy">
                <div class="drill-meta"><span class="diagnostic-tag">${item.tag}</span><span class="drill-time">20 min</span></div>
                <h3>${item.title}</h3>
                <p class="drill-note">${item.note}</p>
                <ol class="drill-steps">${item.steps.map(step => `<li>${step}</li>`).join("")}</ol>
              </div>
              <span class="practice-arrow" aria-hidden="true">↗</span>
            </li>
          `).join("")}
        </ol>
      </section>
      <div class="results-disclaimer">
        <span class="scope-icon" aria-hidden="true">i</span>
        <p><strong>A helpful snapshot, not a booking decision.</strong> The Goethe-Zertifikat A1 also tests listening, writing and speaking. This short check covers only vocabulary, grammar and reading; it is not an official Goethe assessment or a guarantee of passing.</p>
      </div>
      <div class="results-actions">
        <button class="button button-primary" type="button" data-action="restart">Try again <span aria-hidden="true">↻</span></button>
        <a class="text-link" href="https://www.goethe.de/en/spr/kup/prf/prf/gzsd1.html" target="_blank" rel="noreferrer">Explore the official exam <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  `;
  document.querySelector("#results-title").focus({ preventScroll: true });
}

function render() {
  if (screen === "intro") renderIntro();
  if (screen === "quiz") renderQuestion();
  if (screen === "results") renderResults();
}

app.addEventListener("change", event => {
  if (event.target.matches('input[name="answer"]')) {
    const answer = Number(event.target.value);
    const response = responses[currentQuestion];
    if (response.answer !== answer) {
      response.answer = answer;
      response.latencyMs = questionTimer.elapsed(currentQuestion);
    }
    document.querySelectorAll(".answer-option").forEach(option => {
      const input = option.querySelector("input");
      option.classList.toggle("is-selected", input.checked);
      option.querySelector(".answer-check").textContent = input.checked ? "✓" : "";
    });
    document.querySelector('[data-action="next"]').disabled = false;
  } else if (event.target.matches('input[name="unsure"]')) {
    responses[currentQuestion].unsure = event.target.checked;
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) questionTimer.pause(currentQuestion);
  else if (screen === "quiz") questionTimer.start(currentQuestion);
});

document.addEventListener("click", event => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "start") {
    screen = "quiz";
    currentQuestion = 0;
  } else if (action === "back" && currentQuestion > 0) {
    questionTimer.pause(currentQuestion);
    currentQuestion -= 1;
  } else if (action === "next" && responses[currentQuestion].answer !== null) {
    questionTimer.pause(currentQuestion);
    if (currentQuestion === questions.length - 1) screen = "results";
    else currentQuestion += 1;
  } else if (action === "restart") {
    questionTimer.reset();
    responses.forEach(response => {
      response.answer = null;
      response.unsure = false;
      response.latencyMs = null;
    });
    currentQuestion = 0;
    screen = "quiz";
  } else {
    return;
  }

  render();
  app.scrollIntoView({ block: "start", behavior: "smooth" });
});

render();
