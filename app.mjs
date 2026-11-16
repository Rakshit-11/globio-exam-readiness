import { sections, tasks } from "./exam-content.mjs";
import { recommendPractice, scoreSections } from "./assessment.mjs";

const app = document.querySelector("#app");
let screen = "intro";
let currentTaskIndex = 0;
const responses = tasks.map(() => ({
  answer: null,
  fields: {},
  text: "",
  played: false,
  transcriptViewed: false,
  showTranscript: false,
  playbackFailed: false,
  practiced: false
}));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function sectionFor(task) {
  return sections.find(section => section.id === task.section);
}

function renderIntro() {
  app.innerHTML = `
    <section class="intro-layout" aria-labelledby="intro-title">
      <div class="intro-copy">
        <h1 id="intro-title">Practise all four<br><span>A1 skills.</span></h1>
        <p class="intro-lede">Try 12 short, original tasks across Hören, Lesen, Schreiben and Sprechen. Vocabulary and grammar appear in everyday situations, not as separate exam sections.</p>
        <div class="intro-actions">
          <button class="button button-primary" type="button" data-action="start">Start the practice check <span aria-hidden="true">→</span></button>
          <span class="time-note"><span aria-hidden="true">◷</span> 12 tasks · untimed practice</span>
        </div>
        <div class="scope-note">
          <span class="scope-icon" aria-hidden="true">i</span>
          <p>Reading gets answer feedback; listening is scored only when a German browser voice plays each message. Writing and speaking are practice previews; AI scoring is not connected. Your answers stay in this browser session, speech is not recorded, and nothing is sent or saved.</p>
        </div>
      </div>
      <aside class="journey-card" aria-label="The four Goethe A1 sections">
        <div class="journey-topline"><span>GOETHE A1 · FOUR SECTIONS</span><span class="journey-spark" aria-hidden="true">✳</span></div>
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
          <p class="journey-caption">Vier kleine Schritte</p>
          <h2>Listen. Read.<br>Write. Speak.</h2>
          <div class="skill-chips" aria-label="Sections in this practice check">
            ${sections.map(section => `<span>${section.id}</span>`).join("")}
          </div>
        </div>
        <p class="journey-foot">A practice check, not a timed mock <span aria-hidden="true">↗</span></p>
      </aside>
    </section>
  `;
}

function renderAnswerOptions(task, response) {
  return `
    <fieldset class="answer-group">
      <legend class="answer-hint">Choose one answer</legend>
      <div class="answer-list">
        ${task.options.map((option, index) => `
          <label class="answer-option${response.answer === index ? " is-selected" : ""}">
            <input type="radio" name="answer" value="${index}" ${response.answer === index ? "checked" : ""}>
            <span class="answer-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
            <span class="answer-text">${escapeHtml(option)}</span>
            <span class="answer-check" aria-hidden="true">${response.answer === index ? "✓" : ""}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `;
}

function renderReviewList(items, title = "Quick self-check") {
  return `
    <div class="self-review">
      <h2>${title}</h2>
      <ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function renderTaskBody(task, response) {
  if (task.kind === "choice") {
    const listening = task.section === "Hören";
    return `
      ${listening ? `
        <div class="listening-prompt">
          <p>Listen to this short, original message. The browser uses a generated German voice; it is not official Goethe audio.</p>
          <div class="listening-controls">
            <button class="button button-quiet" type="button" data-action="play-audio">${response.played ? "Replay message" : "Play message"} <span aria-hidden="true">◖))</span></button>
            <button class="text-button" type="button" data-action="toggle-transcript" aria-expanded="${response.showTranscript}">${response.showTranscript ? "Hide transcript" : "Show transcript"}</button>
          </div>
          <p class="audio-status" role="status" aria-live="polite">${response.transcriptViewed ? "Transcript opened. This item will not count in the listening result." : response.playbackFailed ? "Audio playback is unavailable here. You can use the transcript for practice; this item will not count in the listening result." : response.played ? "Message played. Replay it if you like." : "Play the complete message before choosing an answer."}</p>
          ${response.showTranscript ? `<p class="transcript-text">${escapeHtml(task.transcript)}</p>` : ""}
        </div>
      ` : `
        <div class="reading-passage" aria-label="Short functional text">
          ${task.passage.split("\n").map(line => `<p>${line ? escapeHtml(line) : "&nbsp;"}</p>`).join("")}
        </div>
      `}
      <h1 class="task-prompt" id="task-prompt">${escapeHtml(task.prompt)}</h1>
      ${renderAnswerOptions(task, response)}
    `;
  }

  if (task.kind === "form") {
    return `
      <h1 class="task-prompt" id="task-prompt">${escapeHtml(task.prompt)}</h1>
      <div class="form-fields">
        ${task.fields.map(field => `
          <label class="field-label" for="field-${field.id}">
            ${escapeHtml(field.label)}
            <input id="field-${field.id}" data-field-key="${field.id}" type="text" maxlength="80" placeholder="${escapeHtml(field.placeholder)}" autocomplete="off">
          </label>
        `).join("")}
      </div>
      ${renderReviewList(task.review)}
    `;
  }

  if (task.kind === "writing") {
    return `
      <h1 class="task-prompt" id="task-prompt">${escapeHtml(task.prompt)}</h1>
      <label class="field-label" for="written-response">Your message <span>Optional · kept only in this page session</span></label>
      <textarea id="written-response" data-write-text maxlength="500" rows="6" placeholder="${escapeHtml(task.placeholder)}"></textarea>
      <p class="writing-counter"><span data-char-count>${response.text.length}</span> / 500 characters</p>
      ${renderReviewList(task.review)}
    `;
  }

  return `
    <h1 class="task-prompt" id="task-prompt">${escapeHtml(task.prompt)}</h1>
    <p class="speaking-instruction">Say your response aloud or practise with another person. This app does not use your microphone or record speech.</p>
    <div class="cue-list" aria-label="Ideas to include">
      ${task.cues.map(cue => `<span>${escapeHtml(cue)}</span>`).join("")}
    </div>
    <p class="partner-prompt">${escapeHtml(task.partnerPrompt)}</p>
    ${renderReviewList(task.review)}
    <label class="practice-toggle">
      <input type="checkbox" data-practiced ${response.practiced ? "checked" : ""}>
      <span>I practised this aloud</span>
    </label>
  `;
}

function renderTask() {
  const task = tasks[currentTaskIndex];
  const response = responses[currentTaskIndex];
  const section = sectionFor(task);
  const sectionIndex = sections.findIndex(item => item.id === task.section);
  const sectionTasks = tasks.filter(item => item.section === task.section);
  const positionInSection = sectionTasks.findIndex(item => item.id === task.id) + 1;
  const progress = ((currentTaskIndex + 1) / tasks.length) * 100;
  const waitingForChoice = task.kind === "choice" && response.answer === null;

  app.innerHTML = `
    <section class="task-layout" aria-labelledby="task-prompt">
      <div class="task-main">
        <div class="quiz-meta">
          <span class="quiz-back-label">Untimed Goethe A1 practice</span>
          <span class="question-count">Task <strong>${currentTaskIndex + 1}</strong> of ${tasks.length}</span>
        </div>
        <div class="progress-track" role="progressbar" aria-label="Practice check progress" aria-valuenow="${currentTaskIndex + 1}" aria-valuemin="1" aria-valuemax="${tasks.length}">
          <span style="--progress:${progress / 100}"></span>
        </div>
        <div class="task-section-heading">
          <div>
            <p class="section-title"><span>${section.id}</span> · ${section.english}</p>
            <p class="section-description">${section.description}</p>
          </div>
          <span class="section-task-count">${positionInSection} of ${sectionTasks.length}</span>
        </div>
        <p class="task-format">${escapeHtml(task.format)}</p>
        <div class="task-content">
          ${renderTaskBody(task, response)}
        </div>
        <div class="quiz-controls">
          <button class="button button-quiet" type="button" data-action="back" ${currentTaskIndex === 0 ? "disabled" : ""}>Back</button>
          <button class="button button-primary" type="button" data-action="next" ${waitingForChoice ? "disabled" : ""}>
            ${currentTaskIndex === tasks.length - 1 ? "See practice notes" : "Next task"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <aside class="quiz-aside" aria-label="About this practice check">
        <div class="aside-mark" aria-hidden="true">✳</div>
        <p class="aside-german">${section.id} · ${section.english}</p>
        <p>${sectionIndex + 1} of 4 Goethe A1 sections. This short check is untimed and does not recreate the full exam tasks or section clocks.</p>
        <div class="aside-dots" aria-hidden="true">${sections.map((_, index) => `<i${index === sectionIndex ? ' class="is-current"' : ""}></i>`).join("")}</div>
      </aside>
    </section>
  `;

  app.querySelectorAll("[data-field-key]").forEach(input => {
    input.value = response.fields[input.dataset.fieldKey] || "";
  });
  const textArea = app.querySelector("[data-write-text]");
  if (textArea) textArea.value = response.text;
  app.querySelector("#task-prompt")?.focus({ preventScroll: true });
}

function renderSectionResult(section, result) {
  const unscored = section.id === "Schreiben" || section.id === "Sprechen";
  if (unscored) {
    const countLabel = section.id === "Schreiben" ? "tasks attempted" : "tasks marked practised";
    return `
      <section class="section-result is-preview" aria-labelledby="result-${section.id}">
        <div class="section-result-heading">
          <div><h2 id="result-${section.id}">${section.id} <span>· ${section.english}</span></h2><p>${section.description}</p></div>
          <span class="result-status">Practice only · not scored</span>
        </div>
        <p class="preview-status"><strong>AI scoring preview — not connected.</strong> ${result.attempted} of ${result.taskCount} ${countLabel}. No answer is sent or saved.</p>
      </section>
    `;
  }

  const listening = section.id === "Hören";
  const scoreCopy = result.total
    ? `${result.correct} of ${result.total} ${listening ? "played messages" : "answers"} correct`
    : "Not scored yet — no complete audio item was played";
  return `
    <section class="section-result" aria-labelledby="result-${section.id}">
      <div class="section-result-heading">
        <div><h2 id="result-${section.id}">${section.id} <span>· ${section.english}</span></h2><p>${section.description}</p></div>
        <span class="result-status">${result.total ? `${result.percentage}% on counted items` : "No scored items"}</span>
      </div>
      <p class="section-score-copy">${scoreCopy}</p>
      ${result.total ? `
        <div class="skill-track" role="img" aria-label="${section.english}: ${result.correct} of ${result.total} counted items correct">
          <span style="width:${result.percentage}%"></span>
        </div>
      ` : ""}
      ${listening ? `<p class="section-footnote">Only messages played to the end without opening the transcript are counted. The generated voice is not official Goethe audio.</p>` : ""}
    </section>
  `;
}

function renderResults() {
  const score = scoreSections(tasks, responses);
  const recommendations = recommendPractice(score);
  const countScored = score.questionResults.length;

  app.innerHTML = `
    <section class="results-layout" aria-labelledby="results-title">
      <div class="results-heading">
        <h1 id="results-title">Your practice <span>snapshot.</span></h1>
        <p class="results-lede">Feedback is shown only for the listening and reading items this check can score.</p>
      </div>
      <div class="results-intro-note">
        <p>This is not an overall readiness result. Writing and speaking need human judgement or a validated scoring service; no AI scoring service is connected here.</p>
      </div>
      <div class="section-results">
        ${sections.map(section => renderSectionResult(section, score.sections[section.id])).join("")}
      </div>
      <section class="practice-section" aria-labelledby="practice-title">
        <div class="practice-heading"><h2 id="practice-title">What to practise next</h2></div>
        ${recommendations.length ? `
          <ol class="practice-list">
            ${recommendations.map((item, index) => `
              <li>
                <span class="practice-number">${String(index + 1).padStart(2, "0")}</span>
                <div class="drill-copy">
                  <div class="drill-meta"><span class="diagnostic-tag">${escapeHtml(item.section)} · ${escapeHtml(item.tag)}</span><span class="drill-time">20 min</span></div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <ol class="drill-steps">${item.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
                </div>
              </li>
            `).join("")}
          </ol>
        ` : `
          <p class="no-missed-topics">${countScored ? "No missed topics were identified in the listening and reading items counted this time. Try a new short message or timetable to keep practising." : "There are no scored items to rank yet. Play a complete listening message and answer the reading tasks to get topic feedback."}</p>
        `}
      </section>
      <div class="results-disclaimer">
        <span class="scope-icon" aria-hidden="true">i</span>
        <p><strong>Scope and privacy.</strong> The Goethe A1 exam assesses Hören, Lesen, Schreiben and Sprechen. This 12-task practice check is untimed and does not reproduce the full exam or its section clocks. Only selected listening and reading answers receive simple correctness feedback. Writing stays in this page session; speech is not recorded, and no answer data leaves the browser. This is not an official Goethe result, pass prediction, or booking recommendation.</p>
      </div>
      <div class="results-actions">
        <button class="button button-primary" type="button" data-action="restart">Try the check again <span aria-hidden="true">↻</span></button>
        <a class="text-link" href="https://www.goethe.de/en/spr/kup/prf/prf/gzsd1.html" target="_blank" rel="noreferrer">Explore the official exam <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  `;
  app.querySelector("#results-title").focus({ preventScroll: true });
}

function render() {
  if (screen === "intro") renderIntro();
  if (screen === "task") renderTask();
  if (screen === "results") renderResults();
}

function updateAudioStatus(message) {
  const status = app.querySelector(".audio-status");
  if (status) status.textContent = message;
}

function playListeningMessage() {
  const task = tasks[currentTaskIndex];
  const response = responses[currentTaskIndex];
  const synthesis = window.speechSynthesis;
  if (!synthesis || typeof window.SpeechSynthesisUtterance !== "function") {
    response.playbackFailed = true;
    updateAudioStatus("Audio playback is unavailable here. You can use the transcript for practice; this item will not count in the listening result.");
    return;
  }

  const germanVoice = typeof synthesis.getVoices === "function"
    ? synthesis.getVoices().find(voice => String(voice.lang || "").toLowerCase().startsWith("de"))
    : null;
  if (!germanVoice) {
    response.playbackFailed = true;
    updateAudioStatus("No German voice is available in this browser. You can use the transcript for practice; this item will not count in the listening result.");
    return;
  }

  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(task.audioText);
  utterance.lang = "de-DE";
  utterance.voice = germanVoice;
  utterance.rate = 0.88;
  updateAudioStatus("Playing the message…");
  utterance.onend = () => {
    if (screen !== "task" || tasks[currentTaskIndex] !== task) return;
    response.played = true;
    response.playbackFailed = false;
    updateAudioStatus("Message played. Choose your answer; replay is available.");
  };
  utterance.onerror = event => {
    if (event.error === "canceled" || event.error === "interrupted") return;
    if (screen !== "task" || tasks[currentTaskIndex] !== task) return;
    response.playbackFailed = true;
    updateAudioStatus("Audio playback did not finish. Try again or use the transcript; this item will not count in the listening result.");
  };
  try {
    synthesis.speak(utterance);
  } catch (error) {
    console.error("Speech synthesis playback failed.", error);
    response.playbackFailed = true;
    updateAudioStatus("Audio playback could not start. Try another browser or use the transcript; this item will not count in the listening result.");
  }
}

app.addEventListener("input", event => {
  const response = responses[currentTaskIndex];
  if (event.target.matches("[data-field-key]")) {
    response.fields[event.target.dataset.fieldKey] = event.target.value;
  } else if (event.target.matches("[data-write-text]")) {
    response.text = event.target.value;
    const counter = app.querySelector("[data-char-count]");
    if (counter) counter.textContent = String(response.text.length);
  }
});

app.addEventListener("change", event => {
  const response = responses[currentTaskIndex];
  if (event.target.matches('input[name="answer"]')) {
    response.answer = Number(event.target.value);
    app.querySelectorAll(".answer-option").forEach(option => {
      const input = option.querySelector("input");
      option.classList.toggle("is-selected", input.checked);
      option.querySelector(".answer-check").textContent = input.checked ? "✓" : "";
    });
    app.querySelector('[data-action="next"]').disabled = false;
  } else if (event.target.matches("[data-practiced]")) {
    response.practiced = event.target.checked;
  }
});

app.addEventListener("click", event => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "play-audio") {
    playListeningMessage();
    return;
  }
  if (action === "toggle-transcript") {
    const response = responses[currentTaskIndex];
    response.showTranscript = !response.showTranscript;
    if (response.showTranscript) response.transcriptViewed = true;
    renderTask();
    app.querySelector('[data-action="toggle-transcript"]')?.focus({ preventScroll: true });
    return;
  }
  if (action === "start") {
    screen = "task";
    currentTaskIndex = 0;
  } else if (action === "back" && currentTaskIndex > 0) {
    window.speechSynthesis?.cancel();
    currentTaskIndex -= 1;
  } else if (action === "next" && currentTaskIndex < tasks.length - 1) {
    window.speechSynthesis?.cancel();
    currentTaskIndex += 1;
  } else if (action === "next" && currentTaskIndex === tasks.length - 1) {
    window.speechSynthesis?.cancel();
    screen = "results";
  } else if (action === "restart") {
    window.speechSynthesis?.cancel();
    responses.forEach(response => {
      response.answer = null;
      response.fields = {};
      response.text = "";
      response.played = false;
      response.transcriptViewed = false;
      response.showTranscript = false;
      response.playbackFailed = false;
      response.practiced = false;
    });
    currentTaskIndex = 0;
    screen = "task";
  } else {
    return;
  }

  render();
  app.scrollIntoView({ block: "start", behavior: "smooth" });
});

render();
