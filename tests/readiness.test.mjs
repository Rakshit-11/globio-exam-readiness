import test from "node:test";
import assert from "node:assert/strict";
import { questions } from "../questions.mjs";
import { recommendPractice, scoreAnswers } from "../readiness.mjs";

test("the check has 12 original questions split evenly across the three skills", () => {
  assert.equal(questions.length, 12);
  assert.deepEqual(
    Object.fromEntries(["Vocabulary", "Grammar", "Reading"].map(skill => [
      skill,
      questions.filter(question => question.skill === skill).length
    ])),
    { Vocabulary: 4, Grammar: 4, Reading: 4 }
  );
  assert.ok(questions.every(question => question.options.length === 4 && Number.isInteger(question.answer)));
});

test("score reports per-skill results and keeps the interpretation provisional", () => {
  const answers = questions.map((question, index) => index < 10 ? question.answer : (question.answer + 1) % 4);
  const score = scoreAnswers(questions, answers);

  assert.equal(score.correct, 10);
  assert.equal(score.percentage, 83);
  assert.deepEqual(score.skillResults.Vocabulary, { correct: 4, total: 4 });
  assert.deepEqual(score.skillResults.Grammar, { correct: 4, total: 4 });
  assert.deepEqual(score.skillResults.Reading, { correct: 2, total: 4 });
  assert.match(score.interpretation.description, /not a prediction/);
});

test("recommendations prioritize missed concepts and cap at three", () => {
  const answers = questions.map(question => (question.answer + 1) % question.options.length);
  const score = scoreAnswers(questions, answers);
  const recommendations = recommendPractice(questions, answers, score);

  assert.equal(recommendations.length, 3);
  assert.deepEqual(recommendations.map(item => item.title), questions.slice(0, 3).map(question => question.practice.title));
});

test("one missed concept remains the first recommendation", () => {
  const answers = questions.map(question => question.answer);
  answers[0] = (questions[0].answer + 1) % questions[0].options.length;
  const score = scoreAnswers(questions, answers);
  const recommendations = recommendPractice(questions, answers, score);

  assert.equal(recommendations.length, 2);
  assert.equal(recommendations[0].title, questions[0].practice.title);
});

test("a perfect score does not invent a missed concept", () => {
  const answers = questions.map(question => question.answer);
  const score = scoreAnswers(questions, answers);
  const recommendations = recommendPractice(questions, answers, score);

  assert.equal(score.correct, 12);
  assert.equal(recommendations.length, 2);
  assert.deepEqual(recommendations.map(item => item.title), [
    "Try a short listening task",
    "Write and say a short introduction"
  ]);
});
