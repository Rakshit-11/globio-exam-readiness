import test from "node:test";
import assert from "node:assert/strict";
import { diagnosticTags, sections, tasks } from "../exam-content.mjs";
import { recommendPractice, scoreSections } from "../assessment.mjs";

function makeResponses() {
  return tasks.map(task => ({
    answer: task.answer ?? null,
    fields: {},
    text: "",
    played: task.section === "Hören",
    transcriptViewed: false,
    practiced: false
  }));
}

test("the 12 original tasks cover each official Goethe A1 section", () => {
  assert.equal(tasks.length, 12);
  assert.deepEqual(sections.map(section => section.id), [
    "Hören",
    "Lesen",
    "Schreiben",
    "Sprechen"
  ]);
  assert.deepEqual(
    Object.fromEntries(sections.map(section => [
      section.id,
      tasks.filter(task => task.section === section.id).length
    ])),
    { Hören: 3, Lesen: 3, Schreiben: 3, Sprechen: 3 }
  );
  assert.ok(tasks.every(task => task.id && task.format && task.prompt));
  assert.ok(tasks.filter(task => task.kind === "choice").every(task => task.options.length === 4));
  assert.deepEqual(
    new Set(tasks.filter(task => task.kind === "choice").map(task => task.section)),
    new Set(["Hören", "Lesen"])
  );
  assert.ok(tasks.filter(task => task.section === "Hören").every(task => task.audioText && task.transcript));
  assert.ok(tasks.filter(task => task.section === "Schreiben").some(task => task.kind === "form"));
  assert.ok(tasks.filter(task => task.section === "Schreiben").some(task => task.kind === "writing"));
  assert.ok(tasks.filter(task => task.section === "Sprechen").some(task => task.cues.length > 0));
  assert.ok(tasks.filter(task => task.kind === "choice").every(task => diagnosticTags[task.tag]));
});

test("listening and reading are scored separately with no overall readiness score", () => {
  const score = scoreSections(tasks, makeResponses());

  assert.deepEqual(
    ["Hören", "Lesen"].map(section => [
      score.sections[section].correct,
      score.sections[section].total,
      score.sections[section].percentage,
      score.sections[section].status
    ]),
    [[3, 3, 100, "scored"], [3, 3, 100, "scored"]]
  );
  assert.equal(score.sections.Schreiben.status, "preview");
  assert.equal(score.sections.Sprechen.status, "preview");
  assert.equal("percentage" in score, false);
  assert.equal("overall" in score, false);
  assert.equal("meetsTarget" in score, false);
});

test("unplayed or transcript-assisted listening items do not count as listening evidence", () => {
  const responses = makeResponses();
  responses[1].transcriptViewed = true;
  responses[2].played = false;
  const score = scoreSections(tasks, responses);

  assert.equal(score.sections.Hören.total, 1);
  assert.equal(score.sections.Hören.correct, 1);
  assert.equal(score.sections.Hören.percentage, 100);
  assert.deepEqual(score.questionResults.map(result => result.index), [0, 3, 4, 5]);
});

test("writing and speaking completion is descriptive and never treated as a score", () => {
  const responses = makeResponses();
  responses[6].fields.name = "Mina";
  responses[7].text = "Hallo, ich komme später.";
  responses[9].practiced = true;
  const score = scoreSections(tasks, responses);

  assert.equal(score.sections.Schreiben.attempted, 2);
  assert.equal(score.sections.Schreiben.taskCount, 3);
  assert.equal(score.sections.Sprechen.attempted, 1);
  assert.equal(score.sections.Sprechen.taskCount, 3);
  assert.equal(score.sections.Schreiben.percentage, null);
  assert.equal(score.sections.Sprechen.percentage, null);
});

test("an unavailable listening player leaves the listening section unscored", () => {
  const responses = makeResponses().map(response => ({
    ...response,
    played: false,
    transcriptViewed: true
  }));
  const score = scoreSections(tasks, responses);

  assert.equal(score.sections.Hören.status, "not-scored");
  assert.equal(score.sections.Hören.total, 0);
  assert.equal(score.sections.Hören.percentage, null);
  assert.equal(score.sections.Lesen.percentage, 100);
});

test("practice priorities rank missed listening and reading tags only", () => {
  const responses = makeResponses();
  for (const index of [0, 3, 5]) {
    responses[index].answer = (tasks[index].answer + 1) % tasks[index].options.length;
  }
  for (const index of [6, 7, 8, 9, 10, 11]) {
    responses[index].answer = 0;
  }
  const priorities = recommendPractice(scoreSections(tasks, responses));

  assert.deepEqual(priorities.map(item => item.tag), [
    "Times & changes",
    "Notices & signs",
    "Schedules"
  ]);
  assert.ok(priorities.every(item => item.steps.length === 3 && item.section !== "Schreiben" && item.section !== "Sprechen"));
});

test("no missed scored topics produces no false unassessed-skill recommendations", () => {
  const priorities = recommendPractice(scoreSections(tasks, makeResponses()));
  assert.deepEqual(priorities, []);
});
