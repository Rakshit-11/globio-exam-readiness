import { diagnosticTags } from "./questions.mjs";

const SKILLS = ["Vocabulary", "Grammar", "Reading"];

export function scoreAnswers(questions, responses) {
  const skillResults = Object.fromEntries(SKILLS.map(skill => [skill, {
    correct: 0,
    total: 0,
    percentage: 0
  }]));
  const questionResults = [];
  let correct = 0;
  let activeTimeMs = 0;
  let unsureCount = 0;

  questions.forEach((question, index) => {
    const response = responses[index] || {};
    const isAnswered = Number.isInteger(response.answer);
    const isCorrect = isAnswered && response.answer === question.answer;
    const unsure = response.unsure === true;
    const itemActiveTimeMs = Number.isFinite(response.activeTimeMs)
      ? Math.max(0, response.activeTimeMs)
      : 0;
    if (isCorrect) correct += 1;
    if (isAnswered && unsure) unsureCount += 1;
    activeTimeMs += itemActiveTimeMs;

    const skill = skillResults[question.skill];
    skill.total += 1;
    if (isCorrect) skill.correct += 1;

    questionResults.push({
      index,
      skill: question.skill,
      tag: question.tag,
      isAnswered,
      isCorrect,
      unsure,
      activeTimeMs: itemActiveTimeMs
    });
  });

  for (const result of Object.values(skillResults)) {
    result.percentage = result.total
      ? Math.round((result.correct / result.total) * 100)
      : 0;
  }

  const percentage = questions.length
    ? Math.round((correct / questions.length) * 100)
    : 0;

  return {
    correct,
    total: questions.length,
    percentage,
    activeTimeMs,
    unsureCount,
    skillResults,
    questionResults,
    interpretation: {
      title: "Evidence incomplete",
      description: `You answered ${correct} of ${questions.length} questions correctly in this short practice check. This describes these items only; it does not show whether you are ready for the exam.`
    }
  };
}

export function recommendPractice(score) {
  const tagResults = new Map();

  for (const result of score.questionResults) {
    const tagResult = tagResults.get(result.tag) || {
      tag: result.tag,
      misses: 0,
      unsure: 0,
      count: 0,
      firstIndex: result.index
    };
    tagResult.count += 1;
    if (!result.isCorrect) tagResult.misses += 1;
    if (result.unsure) tagResult.unsure += 1;
    tagResults.set(result.tag, tagResult);
  }

  const rankedTags = [...tagResults.values()].sort((a, b) =>
    b.misses - a.misses ||
    b.unsure - a.unsure ||
    (b.misses / b.count) - (a.misses / a.count) ||
    a.firstIndex - b.firstIndex
  );
  const tagsWithSignals = rankedTags.filter(result => result.misses > 0 || result.unsure > 0);

  if (tagsWithSignals.length === 0) {
    return [
      {
        tag: "Listening (not assessed)",
        ...diagnosticTags["Listening (not assessed)"],
        misses: 0,
        unsure: 0,
        note: "Listening was not assessed in this check."
      },
      {
        tag: "Writing & speaking (not assessed)",
        ...diagnosticTags["Writing & speaking (not assessed)"],
        misses: 0,
        unsure: 0,
        note: "Writing and speaking were not assessed in this check."
      }
    ];
  }

  const selected = tagsWithSignals.slice(0, 3);
  if (selected.length < 2) {
    for (const tag of rankedTags) {
      if (!selected.some(item => item.tag === tag.tag)) selected.push(tag);
      if (selected.length === 2) break;
    }
  }

  return selected.slice(0, 3).map(result => ({
    tag: result.tag,
    ...diagnosticTags[result.tag],
    misses: result.misses,
    unsure: result.unsure,
    note: [
      result.misses ? `${result.misses} ${result.misses === 1 ? "missed answer" : "missed answers"}` : "",
      result.unsure ? `${result.unsure} ${result.unsure === 1 ? "answer" : "answers"} marked unsure` : ""
    ].filter(Boolean).join(" · ") || "Keep this topic fresh."
  }));
}
