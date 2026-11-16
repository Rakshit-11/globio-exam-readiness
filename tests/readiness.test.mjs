import test from "node:test";
import assert from "node:assert/strict";
import { diagnosticTags, questions } from "../questions.mjs";
import { recommendPractice, scoreAnswers } from "../readiness.mjs";
import { createQuestionTimer, formatElapsed } from "../question-timer.mjs";

function makeResponses(overrides = {}) {
  return questions.map((question, index) => ({
    answer: question.answer,
    unsure: false,
    activeTimeMs: 1_000,
    ...overrides[index]
  }));
}

test("the check has 12 tagged questions split evenly across the three practice areas", () => {
  assert.equal(questions.length, 12);
  assert.deepEqual(
    Object.fromEntries(["Vocabulary", "Grammar", "Reading"].map(skill => [
      skill,
      questions.filter(question => question.skill === skill).length
    ])),
    { Vocabulary: 4, Grammar: 4, Reading: 4 }
  );
  assert.ok(questions.every(question => question.options.length === 4 && diagnosticTags[question.tag]));
});

test("accuracy gives each item equal weight and ignores time and uncertainty", () => {
  const responses = makeResponses({
    0: { activeTimeMs: 900_000, unsure: true },
    1: { answer: (questions[1].answer + 1) % 4, activeTimeMs: 500 },
    8: { answer: (questions[8].answer + 1) % 4, activeTimeMs: 2_000, unsure: true }
  });
  const score = scoreAnswers(questions, responses);

  assert.equal(score.correct, 10);
  assert.equal(score.total, 12);
  assert.equal(score.percentage, 83);
  assert.equal(score.activeTimeMs, 911_500);
  assert.equal(score.unsureCount, 2);
  assert.equal(score.skillResults.Vocabulary.percentage, 75);
  assert.equal(score.skillResults.Grammar.percentage, 100);
  assert.equal(score.skillResults.Reading.percentage, 75);
  assert.equal(score.meetsTarget, true);
  assert.equal(score.interpretation.title, "You may be ready");
});

test("the on-track rule includes exact boundaries and enforces a floor in every area", () => {
  const atBoundaries = makeResponses({
    0: { answer: (questions[0].answer + 1) % 4 },
    1: { answer: (questions[1].answer + 1) % 4 },
    4: { answer: (questions[4].answer + 1) % 4 }
  });
  const boundaryScore = scoreAnswers(questions, atBoundaries);

  assert.equal(boundaryScore.percentage, 75);
  assert.equal(boundaryScore.skillResults.Vocabulary.percentage, 50);
  assert.equal(boundaryScore.meetsTarget, true);
  assert.deepEqual(boundaryScore.belowFloorAreas, []);

  const belowSkillFloor = makeResponses({
    0: { answer: (questions[0].answer + 1) % 4 },
    1: { answer: (questions[1].answer + 1) % 4 },
    2: { answer: (questions[2].answer + 1) % 4 }
  });
  const floorScore = scoreAnswers(questions, belowSkillFloor);
  assert.equal(floorScore.percentage, 75);
  assert.equal(floorScore.skillResults.Vocabulary.percentage, 25);
  assert.equal(floorScore.meetsTarget, false);
  assert.deepEqual(floorScore.belowFloorAreas, ["Vocabulary (1/4)"]);
  assert.match(floorScore.interpretation.description, /2 of 4 correct/);

  const belowOverallTarget = makeResponses({
    0: { answer: (questions[0].answer + 1) % 4 },
    1: { answer: (questions[1].answer + 1) % 4 },
    4: { answer: (questions[4].answer + 1) % 4 },
    5: { answer: (questions[5].answer + 1) % 4 },
    8: { answer: (questions[8].answer + 1) % 4 }
  });
  const overallScore = scoreAnswers(questions, belowOverallTarget);
  assert.equal(overallScore.percentage, 58);
  assert.deepEqual(overallScore.belowFloorAreas, []);
  assert.equal(overallScore.meetsTarget, false);
  assert.match(overallScore.interpretation.description, /75%/);
});

test("missed-topic recommendations rank tags by incorrect answers", () => {
  const responses = questions.map((question, index) => ({
    answer: [0, 4, 8, 11].includes(index)
      ? (question.answer + 1) % question.options.length
      : question.answer,
    unsure: false,
    activeTimeMs: 1_000
  }));
  const drills = recommendPractice(scoreAnswers(questions, responses));

  assert.equal(drills.length, 3);
  assert.equal(drills[0].tag, "Time & schedules");
  assert.equal(drills[0].misses, 2);
  assert.ok(drills.every(drill => drill.steps.length === 3));
});

test("unsure correct answers cue drills without changing the accuracy score", () => {
  const responses = makeResponses({
    0: { unsure: true },
    4: { unsure: true }
  });
  const score = scoreAnswers(questions, responses);
  const drills = recommendPractice(score);

  assert.equal(score.percentage, 100);
  assert.equal(drills[0].tag, questions[0].tag);
  assert.equal(drills[0].misses, 0);
  assert.equal(drills[0].unsure, 1);
  assert.match(drills[0].note, /marked unsure/);
});

test("perfect confident responses point learners toward unassessed skills", () => {
  const drills = recommendPractice(scoreAnswers(questions, makeResponses()));
  assert.deepEqual(drills.map(drill => drill.tag), [
    "Listening (not assessed)",
    "Writing & speaking (not assessed)"
  ]);
});

test("a blank response is not counted as correct", () => {
  const responses = makeResponses({ 3: { answer: null } });
  const score = scoreAnswers(questions, responses);

  assert.equal(score.correct, 11);
  assert.equal(score.percentage, 92);
  assert.equal(score.questionResults[3].isAnswered, false);
  assert.equal(score.questionResults[3].isCorrect, false);
});

test("active question time pauses while hidden and accumulates after back-navigation", () => {
  let now = 0;
  const timer = createQuestionTimer(() => now);
  timer.start(0);
  now += 5_000;
  timer.pause(0);
  now += 60_000;
  assert.equal(timer.elapsed(0), 5_000);

  timer.start(1);
  now += 2_000;
  timer.start(0);
  now += 3_000;
  assert.equal(timer.elapsed(0), 8_000);
  assert.equal(timer.elapsed(1), 2_000);

  timer.reset();
  assert.equal(timer.elapsed(0), 0);
});

test("active-time formatting is readable for minute and hour totals", () => {
  assert.equal(formatElapsed(0), "00:00");
  assert.equal(formatElapsed(65_000), "01:05");
  assert.equal(formatElapsed(3_661_000), "1:01:01");
  assert.equal(formatElapsed(-1), "00:00");
});
