import { diagnosticTags, sections } from "./exam-content.mjs";

const SCORED_SECTIONS = new Set(["Hören", "Lesen"]);

function isWritingAttempt(response = {}) {
  return Object.values(response.fields || {}).some(value => String(value).trim()) ||
    Boolean(response.text?.trim());
}

export function scoreSections(tasks, responses) {
  const sectionResults = Object.fromEntries(sections.map(section => [
    section.id,
    {
      id: section.id,
      english: section.english,
      description: section.description,
      scored: SCORED_SECTIONS.has(section.id),
      correct: 0,
      total: 0,
      percentage: null,
      attempted: 0,
      taskCount: tasks.filter(task => task.section === section.id).length,
      status: "not-scored"
    }
  ]));
  const questionResults = [];

  tasks.forEach((task, index) => {
    const response = responses[index] || {};
    const result = sectionResults[task.section];

    if (task.section === "Schreiben" && isWritingAttempt(response)) result.attempted += 1;
    if (task.section === "Sprechen" && response.practiced === true) result.attempted += 1;
    if (!SCORED_SECTIONS.has(task.section) || task.kind !== "choice") return;

    const isListening = task.section === "Hören";
    const isScorable = !isListening || (response.played === true && response.transcriptViewed !== true);
    if (!isScorable) return;

    const isAnswered = Number.isInteger(response.answer);
    const isCorrect = isAnswered && response.answer === task.answer;
    result.total += 1;
    if (isAnswered) result.attempted += 1;
    if (isCorrect) result.correct += 1;
    questionResults.push({
      index,
      section: task.section,
      tag: task.tag,
      isAnswered,
      isCorrect
    });
  });

  for (const section of sections) {
    const result = sectionResults[section.id];
    if (!result.scored) {
      result.status = "preview";
      continue;
    }
    if (result.total > 0) {
      result.status = "scored";
      result.percentage = Math.round((result.correct / result.total) * 100);
    }
  }

  return { sections: sectionResults, questionResults };
}

export function recommendPractice(score) {
  const rankedTags = new Map();
  for (const result of score.questionResults) {
    if (result.isCorrect) continue;
    const tagResult = rankedTags.get(result.tag) || {
      tag: result.tag,
      section: result.section,
      misses: 0,
      firstIndex: result.index
    };
    tagResult.misses += 1;
    rankedTags.set(result.tag, tagResult);
  }

  return [...rankedTags.values()]
    .sort((a, b) => b.misses - a.misses || a.firstIndex - b.firstIndex)
    .slice(0, 3)
    .map(result => ({
      ...result,
      ...diagnosticTags[result.tag]
    }));
}
