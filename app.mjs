import { questions, readingText } from "./questions.mjs";
import { recommendPractice, scoreAnswers } from "./readiness.mjs";
import { createQuestionTimer, formatElapsed } from "./question-timer.mjs";

const app = document.querySelector("#app");
let screen = "intro";
let currentQuestion = 0;
let timerInterval = null;
const responses = questions.map(() => ({ answer: null, unsure: false, activeTimeMs: 0 }));
const questionTimer = createQuestionTimer();

function stopQuestionTimer() {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
  questionTimer.pause(currentQuestion);
  responses[currentQuestion].activeTimeMs = questionTimer.elapsed(currentQuestion);
}

function updateQuestionTimer() {
  const display = document.querySelector("#question-time");
  if (!display) return;
  const elapsed = questionTimer.elapsed(currentQuestion);
  responses[currentQuestion].activeTimeMs = elapsed;
  display.textContent = formatElapsed(elapsed);
  display.setAttribute("datetime", `PT${Math.floor(elapsed / 1_000)}S`);
}

function startQuestionTimer() {
  if (timerInterval !== null) window.clearInterval(timerInterval);
  timerInterval = null;
  if (document.visibilityState !== "visible") return;
  questionTimer.start(currentQuestion);
  updateQuestionTimer();
  timerInterval = window.setInterval(updateQuestionTimer, 1_000);
}

function renderIntro() {
  app.innerHTML = `
    <section class="intro-layout" aria-labelledby="intro-title">
      <div class="intro-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span>A little clarity before the big day</p>
        <h1 id="intro-title">Am I ready<br>for <span>Deutsch?</span></h1>
        <p class="intro-lede">A short check-in for your Goethe A1 journey. Find out what feels solid—and what to practise next.</p>
        <div class="intro-actions">
          <button class="button button-primary" type="button" data-action="start">Start my check <span aria-hidden="true">→</span></button>
          <span class="time-note"><span aria-hidden="true">◷</span> 12 questions · visible timer · no countdown</span>
        </div>
        <div class="scope-note">
          <span class="scope-icon" aria-hidden="true">i</span>
          <p>Unofficial and not a pass predictor. Listening, writing and speaking aren't included. A visible stopwatch and optional uncertainty note are practice signals only; neither affects your score.</p>
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
          <div class="quiz-session-meta">
            <span class="question-count">Question <strong>${currentQuestion + 1}</strong> of ${questions.length}</span>
            <span class="question-stopwatch"><span aria-hidden="true">◷</span><span>Active time on this item</span><time id="question-time" role="timer" aria-label="Active time on this item" aria-live="off">00:00</time></span>
          </div>
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
            <span class="confidence-copy"><strong>I'm guessing / unsure</strong><small>Optional note for yourself; it does not change your score.</small></span>
          </label>
          <p class="timer-explanation">No countdown. The stopwatch pauses when this tab is hidden. Time is shown for practice only and does not affect your result.</p>
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
  startQuestionTimer();
}

function renderResults() {
  const score = scoreAnswers(questions, responses);
  const recommendations = recommendPractice(score);
  const skillNames = ["Vocabulary", "Grammar", "Reading"];

  app.innerHTML = `
    <section class="results-layout" aria-labelledby="results-title">
      <div class="results-heading">
        <h1 id="results-title">Every step <span>counts.</span></h1>
        <p class="results-lede">Here's what this little check can—and can't—tell you.</p>
      </div>
      <div class="results-grid">
        <div class="score-panel">
          <div class="score-top"><span>PRACTICE ACCURACY</span><span aria-hidden="true">✳</span></div>
          <div class="score-number">${score.percentage}<span>%</span></div>
          <p class="score-caption">${score.correct} of ${score.total} answers correct</p>
          <div class="score-divider"></div>
          <h2>${score.interpretation.title}</h2>
          <p>${score.interpretation.description}</p>
          <p class="provisional-note"><span aria-hidden="true">i</span> This is not a readiness score, pass prediction, or booking recommendation.</p>
        </div>
        <div class="skills-panel">
          <h2>By skill</h2>
          <p class="panel-intro">Correct answers out of four items in each area.</p>
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
                <p class="skill-points">${result.correct} of ${result.total} correct</p>
              </div>
            `;
          }).join("")}
          <p class="skills-footnote">Vocabulary and grammar are practice categories, not separate Goethe exam sections.</p>
        </div>
      </div>
      <div class="practice-signals" aria-labelledby="signals-title">
        <h2 id="signals-title">Other practice signals</h2>
        <div class="practice-signal-values">
          <div><span>Active time in this check</span><time datetime="PT${Math.floor(score.activeTimeMs / 1_000)}S">${formatElapsed(score.activeTimeMs)}</time></div>
          <div><span>Answers marked unsure</span><strong>${score.unsureCount} of ${score.total}</strong></div>
        </div>
        <p>Time and self-reported uncertainty are shown separately. Neither changes your accuracy result; timing is not comparable to Goethe's exam clocks.</p>
      </div>
      <details class="score-method">
        <summary>How to read this snapshot</summary>
        <ul>
          <li>Each question counts equally. Your percentage is the share of these 12 answers that were correct; each skill percentage uses four questions.</li>
          <li>The stopwatch and “I'm guessing / unsure” choice are practice notes only; neither adds or subtracts points.</li>
          <li>This check leaves out listening, writing and speaking, so its percentage cannot estimate a complete exam result.</li>
          <li>Goethe's official 60% pass threshold applies to its actual 100-point exam result only when all exam sections are completed. This practice percentage is not comparable to it.</li>
        </ul>
      </details>
      <section class="practice-section" aria-labelledby="practice-title">
        <div class="practice-heading">
          <div><h2 id="practice-title">${score.correct === score.total ? "Keep exploring." : "A few things to practise."}</h2></div>
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
        <p><strong>Evidence incomplete.</strong> The Goethe-Zertifikat A1 assesses listening, reading, writing and speaking. This check uses 12 original multiple-choice items across vocabulary, grammar and reading; listening, writing and speaking are not assessed. It is not an official Goethe assessment or a guarantee of passing. The official 60% threshold applies only to the full exam under Goethe's scoring rules.</p>
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
    response.answer = answer;
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
  if (document.hidden) stopQuestionTimer();
  else if (screen === "quiz") startQuestionTimer();
});

document.addEventListener("click", event => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "start") {
    screen = "quiz";
    currentQuestion = 0;
  } else if (action === "back" && currentQuestion > 0) {
    stopQuestionTimer();
    currentQuestion -= 1;
  } else if (action === "next" && responses[currentQuestion].answer !== null) {
    stopQuestionTimer();
    if (currentQuestion === questions.length - 1) screen = "results";
    else currentQuestion += 1;
  } else if (action === "restart") {
    stopQuestionTimer();
    questionTimer.reset();
    responses.forEach(response => {
      response.answer = null;
      response.unsure = false;
      response.activeTimeMs = 0;
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
