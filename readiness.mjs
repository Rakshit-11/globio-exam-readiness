const SKILLS = ["Vocabulary", "Grammar", "Reading"];

export function scoreAnswers(questions, answers) {
  const skillResults = Object.fromEntries(SKILLS.map(skill => [skill, { correct: 0, total: 0 }]));
  let correct = 0;

  questions.forEach((question, index) => {
    const skill = skillResults[question.skill];
    skill.total += 1;
    if (answers[index] === question.answer) {
      skill.correct += 1;
      correct += 1;
    }
  });

  const skillPercentages = Object.fromEntries(
    Object.entries(skillResults).map(([skill, result]) => [
      skill,
      Math.round((result.correct / result.total) * 100)
    ])
  );
  const percentage = Math.round((correct / questions.length) * 100);
  const lowestSkill = Math.min(...Object.values(skillPercentages));

  let interpretation;
  if (percentage >= 75 && lowestSkill >= 50) {
    interpretation = {
      title: "Promising signals on the topics checked",
      description: "You handled most of this short check well. It is an encouraging practice signal, not a prediction of your exam result."
    };
  } else if (percentage >= 55) {
    interpretation = {
      title: "A good base to keep building",
      description: "You have some useful A1 knowledge in place. A little targeted practice can make the weaker areas feel more familiar."
    };
  } else {
    interpretation = {
      title: "More practice will help",
      description: "This check found a few foundations to revisit. That is useful information—and a good place to start before deciding when to book."
    };
  }

  return {
    correct,
    total: questions.length,
    percentage,
    skillResults,
    skillPercentages,
    interpretation
  };
}

export function recommendPractice(questions, answers, score) {
  if (score.correct === score.total) {
    return [
      {
        title: "Try a short listening task",
        detail: "Listening is not part of this check. Try a short A1 audio and answer a few questions about the main details."
      },
      {
        title: "Write and say a short introduction",
        detail: "Writing and speaking are not assessed here. Practise introducing yourself, sharing basic details and asking a simple question."
      }
    ];
  }

  const missed = questions
    .map((question, index) => ({ question, index }))
    .filter(({ question, index }) => answers[index] !== question.answer)
    .map(({ question }) => question.practice);

  const recommendations = [];
  for (const practice of missed) {
    if (!recommendations.some(item => item.title === practice.title)) {
      recommendations.push(practice);
    }
    if (recommendations.length === 3) break;
  }

  if (recommendations.length < 2) {
    const weakestSkills = Object.entries(score.skillPercentages)
      .sort((a, b) => a[1] - b[1])
      .map(([skill]) => skill);

    for (const skill of weakestSkills) {
      const question = questions.find(item => item.skill === skill && !recommendations.some(rec => rec.title === item.practice.title));
      if (question) recommendations.push(question.practice);
      if (recommendations.length === 2) break;
    }
  }

  return recommendations.slice(0, 3);
}
