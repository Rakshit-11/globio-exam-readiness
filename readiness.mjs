import { diagnosticTags } from "./questions.mjs";

const SKILLS = ["Vocabulary", "Grammar", "Reading"];
const MAX_TOTAL_POINTS = 120;
const MAX_SKILL_POINTS = 40;
export const SCORING_RULES = Object.freeze({
  correctConfidentPoints: 10,
  correctFragilePoints: 5,
  fastConfidentWrongPoints: -2,
  otherWrongPoints: 0,
  confidentCorrectUnderMs: 40_000,
  fastWrongUnderMs: 15_000,
  strongSignalThreshold: 75,
  skillFloorThreshold: 55
});

export function scoreAnswers(questions, responses) {
  const skillResults = Object.fromEntries(SKILLS.map(skill => [skill, {
    correct: 0,
    total: 0,
    rawPoints: 0,
    percentage: 0
  }]));
  const questionResults = [];
  let correct = 0;
  let rawPoints = 0;

  questions.forEach((question, index) => {
    const response = responses[index] || {};
    const isAnswered = Number.isInteger(response.answer);
    const isCorrect = isAnswered && response.answer === question.answer;
    const unsure = response.unsure === true;
    const latencyMs = Number.isFinite(response.latencyMs) ? Math.max(0, response.latencyMs) : null;
    let points = 0;

    if (isCorrect) {
      points = !unsure && latencyMs !== null && latencyMs < SCORING_RULES.confidentCorrectUnderMs
        ? SCORING_RULES.correctConfidentPoints
        : SCORING_RULES.correctFragilePoints;
      correct += 1;
    } else if (isAnswered && !unsure && latencyMs !== null && latencyMs < SCORING_RULES.fastWrongUnderMs) {
      points = SCORING_RULES.fastConfidentWrongPoints;
    } else {
      points = SCORING_RULES.otherWrongPoints;
    }

    rawPoints += points;
    const skill = skillResults[question.skill];
    skill.total += 1;
    skill.rawPoints += points;
    if (isCorrect) skill.correct += 1;

    questionResults.push({
      index,
      skill: question.skill,
      tag: question.tag,
      isCorrect,
      unsure,
      latencyMs,
      points,
      fastConfidentMiss: isAnswered && !isCorrect && !unsure && latencyMs !== null &&
        latencyMs < SCORING_RULES.fastWrongUnderMs
    });
  });

  for (const result of Object.values(skillResults)) {
    result.percentage = Math.max(0, Math.round((result.rawPoints / MAX_SKILL_POINTS) * 100));
  }

  const percentage = Math.max(0, Math.round((rawPoints / MAX_TOTAL_POINTS) * 100));
  const belowFloor = Object.entries(skillResults)
    .filter(([, result]) => result.percentage < SCORING_RULES.skillFloorThreshold)
    .map(([skill]) => skill);

  let interpretation;
  if (percentage >= SCORING_RULES.strongSignalThreshold && belowFloor.length === 0) {
    interpretation = {
      title: "Promising signals in the areas checked",
      description: "This clears the prototype's 75% overall signal band and 55% floor in each included skill. It is not a safe-to-book verdict or a prediction of passing."
    };
  } else if (belowFloor.length > 0) {
    interpretation = {
      title: "A focused tune-up may help",
      description: `${belowFloor.join(" and ")} ${belowFloor.length === 1 ? "is" : "are"} below this prototype's 55% skill floor. A high overall total cannot offset that here. Use the drills as a practice prompt, then consider a teacher's feedback and full-format exam practice.`
    };
  } else {
    interpretation = {
      title: "Build a little more confidence",
      description: "This result is below the prototype's 75% overall signal band. Try the drills and use broader practice—not this score alone—to decide what to do next."
    };
  }

  return {
    correct,
    total: questions.length,
    rawPoints,
    percentage,
    skillResults,
    questionResults,
    fastConfidentMisses: questionResults.filter(result => result.fastConfidentMiss).length,
    interpretation,
    thresholds: {
      strongSignal: SCORING_RULES.strongSignalThreshold,
      skillFloor: SCORING_RULES.skillFloorThreshold
    }
  };
}

export function recommendPractice(score) {
  const tagResults = new Map();

  for (const result of score.questionResults) {
    const tagResult = tagResults.get(result.tag) || {
      tag: result.tag,
      misses: 0,
      points: 0,
      count: 0,
      firstIndex: result.index
    };
    tagResult.count += 1;
    tagResult.points += result.points;
    if (!result.isCorrect) tagResult.misses += 1;
    tagResults.set(result.tag, tagResult);
  }

  const rankedTags = [...tagResults.values()].sort((a, b) =>
    b.misses - a.misses ||
    (a.points / a.count) - (b.points / b.count) ||
    a.firstIndex - b.firstIndex
  );
  const tagsWithMisses = rankedTags.filter(result => result.misses > 0);

  if (tagsWithMisses.length === 0) {
    const fragileTags = rankedTags.filter(result => result.points / result.count < 10);
    if (fragileTags.length === 0) {
      return [
        {
          tag: "Listening (not assessed)",
          ...diagnosticTags["Listening (not assessed)"],
          misses: 0,
          note: "Broaden the evidence: listening was not checked."
        },
        {
          tag: "Writing & speaking (not assessed)",
          ...diagnosticTags["Writing & speaking (not assessed)"],
          misses: 0,
          note: "Broaden the evidence: writing and speaking were not checked."
        }
      ];
    }
    tagsWithMisses.push(...fragileTags);
  }

  const selected = tagsWithMisses.slice(0, 3);
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
    note: result.misses > 0
      ? `${result.misses} ${result.misses === 1 ? "missed answer" : "missed answers"} in this tag`
      : "Keep this tag fresh"
  }));
}
