import { test } from "node:test";
import assert from "node:assert";
import {pointLineDist, pointPointDist, projectPointToLine} from "./linear.js";

/*
 * Some sanity checks on the linear algebra functions using { 3, 4, 5 } triangles I can actually draw on paper!
 */

test("point to point distance", () => {
  const a = [0, 0];
  const b = [3, 0];
  const c = [3, 4];

  assert.strictEqual(pointPointDist(a, b), 3);
  assert.strictEqual(pointPointDist(b, c), 4);
  assert.strictEqual(pointPointDist(c, a), 5);
});

test("point to line distance", () => {
  const v = [1, 6];
  const w = [4, 2];

  assert.strictEqual(pointLineDist([2.5, 4], v, w), 0);
  assert.strictEqual(pointLineDist([6.5, 7], v, w), 5);
});

test("project point onto line", () => {
  const v = [1, 6];
  const w = [4, 2];

  assert.deepStrictEqual(projectPointToLine([6.5, 7], v, w), [2.5, 4]);
});
