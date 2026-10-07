import test from "node:test";
import assert from "node:assert/strict";
import { validateRecord } from "./record.js";

const valid = { name: "Jane Smith", position: "Developer", level: "Junior" };

test("accepts each allowed level and a two-character position", () => {
  for (const level of ["Intern", "Junior", "Senior"]) {
    assert.deepEqual(validateRecord({ ...valid, position: "QA", level }), {});
  }
});

test("requires a nonblank string name", () => {
  for (const name of [undefined, null, "", "   ", 123, [], {}]) {
    assert.ok(validateRecord({ ...valid, name }).name);
  }
});

test("requires at least two non-padding position characters", () => {
  for (const position of [undefined, null, "", "   ", "A", " A ", 123, [], {}]) {
    assert.ok(validateRecord({ ...valid, position }).position);
  }
});

test("rejects missing, unsupported and incorrectly cased levels", () => {
  for (const level of [undefined, null, "", "Mid", "junior", " Senior ", 123, [], {}]) {
    assert.ok(validateRecord({ ...valid, level }).level);
  }
});

test("reports all errors for missing or invalid bodies", () => {
  for (const body of [undefined, null, {}, [], "invalid"]) {
    assert.deepEqual(Object.keys(validateRecord(body)), ["name", "position", "level"]);
  }
});
