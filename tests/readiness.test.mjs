import test from "node:test";
import assert from "node:assert/strict";
import { diagnosticTags, questions } from "../questions.mjs";
import { recommendPractice, scoreAnswers } from "../readiness.mjs";
import { createQuestionTimer } from "../question-timer.mjs";

function makeResponses(overrides = {}) {
  return questions.map((question, index) => ({
    answer: question.answer,
    unsure: false,
    latencyMs: 1_000,
    ...overrides[index]
  }));
}

test("the check has 12 tagged questions split evenly across the three skills", () => {
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

test("confidence and latency map to the stated point values and 40–45 seconds is fragile", () => {
  const responses = makeResponses({
    0: { latencyMs: 39_999 },
    1: { unsure: true },
    2: { latencyMs: 40_000 },
    3: { latencyMs: 45_000 },
    4: { answer: (questions[4].answer + 1) % 4, latencyMs: 14_999 },
    5: { answer: (questions[5].answer + 1) % 4, latencyMs: 15_000 },
    6: { answer: (questions[6].answer + 1) % 4, unsure: true, latencyMs: 1_000 },
    7: { answer: (questions[7].answer + 1) % 4, latencyMs: 45_000 }
  });
  const score = scoreAnswers(questions, responses);

  assert.deepEqual(score.questionResults.slice(0, 8).map(result => result.points), [
    10, 5, 5, 5, -2, 0, 0, 0
  ]);
  assert.equal(score.fastConfidentMisses, 1);
});

test("raw points normalize to total and per-skill percentages", () => {
  const responses = makeResponses();
  for (const index of [0, 1, 4, 5, 8, 9]) responses[index].unsure = true;
  const score = scoreAnswers(questions, responses);

  assert.equal(score.rawPoints, 90);
  assert.equal(score.percentage, 75);
  assert.deepEqual(
    Object.fromEntries(Object.entries(score.skillResults).map(([skill, result]) => [skill, [result.rawPoints, result.percentage]])),
    { Vocabulary: [30, 75], Grammar: [30, 75], Reading: [30, 75] }
  );
  assert.equal(score.interpretation.title, "Promising signals in the areas checked");
});

test("a high overall score cannot compensate for a skill below 55 percent", () => {
  const responses = makeResponses();
  for (const index of [4, 5]) {
    responses[index].answer = (questions[index].answer + 1) % 4;
    responses[index].latencyMs = 15_000;
  }
  const score = scoreAnswers(questions, responses);

  assert.ok(score.percentage >= 75);
  assert.equal(score.skillResults.Grammar.percentage, 50);
  assert.equal(score.interpretation.title, "A focused tune-up may help");
  assert.match(score.interpretation.description, /Grammar/);
});

test("negative raw points clamp displayed overall and skill percentages at zero", () => {
  const responses = questions.map(question => ({
    answer: (question.answer + 1) % question.options.length,
    unsure: false,
    latencyMs: 1_000
  }));
  const score = scoreAnswers(questions, responses);

  assert.equal(score.rawPoints, -24);
  assert.equal(score.percentage, 0);
  assert.ok(Object.values(score.skillResults).every(result => result.percentage === 0));
});

test("drills prioritize tags with the most missed responses and stay concrete", () => {
  const responses = questions.map(question => ({
    answer: (question.answer + 1) % question.options.length,
    unsure: false,
    latencyMs: 1_000
  }));
  const score = scoreAnswers(questions, responses);
  const drills = recommendPractice(score);

  assert.equal(drills.length, 3);
  assert.equal(drills[0].tag, "Time & schedules");
  assert.equal(drills[0].misses, 2);
  assert.ok(drills.every(drill => drill.steps.length === 3));
});

test("correct but fragile answers prompt tag-specific practice; strong perfect signals broaden to omitted skills", () => {
  const fragileResponses = makeResponses({
    0: { latencyMs: 40_000 },
    1: { unsure: true }
  });
  const fragileScore = scoreAnswers(questions, fragileResponses);
  const fragileDrills = recommendPractice(fragileScore);
  assert.equal(fragileDrills[0].tag, questions[0].tag);
  assert.equal(fragileDrills[0].misses, 0);
  assert.match(fragileDrills[0].note, /Keep this tag/);

  const perfectScore = scoreAnswers(questions, makeResponses());
  const broadDrills = recommendPractice(perfectScore);
  assert.deepEqual(broadDrills.map(drill => drill.tag), [
    "Listening (not assessed)",
    "Writing & speaking (not assessed)"
  ]);
});

test("active question time pauses for hidden tabs and accumulates across back-navigation", () => {
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
