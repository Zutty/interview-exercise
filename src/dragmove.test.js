import { test } from "node:test";
import assert from "node:assert";
import dragmove from "./dragmove.js";

test("no snap case", () => {
  const a = [
    [0, 0],
    [0, 50],
    [50, 50],
    [50, 0],
  ];
  const b = [
    [100, 100],
    [100, 110],
    [110, 100],
  ];

  assert.deepStrictEqual(dragmove(a, b), {
    isSnapped: false,
  });
});

test("vertex snap case", () => {
  const a = [
    [0, 0],
    [0, 50],
    [50, 50],
    [50, 0],
  ];
  const b = [
    [51, 51],
    [51, 61],
    [61, 51],
  ];

  assert.deepStrictEqual(dragmove(a, b), {
    isSnapped: true,
    translate: { x: -1, y: -1 },
    snapDetails: { type: "vertex", targetVertex: [51, 51] },
  });
});

test("midpoint snap case", () => {
  const a = [
    [0, 0],
    [0, 50],
    [50, 50],
    [50, 0],
  ];
  const b = [
    [25, 51],
    [24, 61],
    [26, 61],
  ];

  assert.deepStrictEqual(dragmove(a, b), {
    isSnapped: true,
    translate: { x: 0, y: -1 },
    snapDetails: { type: "midpoint", targetVertex: [25, 51] },
  });
});

test("edge snap case", () => {
  const a = [
    [0, 0],
    [0, 100],
    [100, 100],
    [100, 0],
  ];
  const b = [
    [25, 101],
    [24, 111],
    [26, 111],
  ];

  assert.deepStrictEqual(dragmove(a, b), {
    isSnapped: true,
    translate: { x: 0, y: -1 },
    snapDetails: { type: "edge", targetVertex: [25, 101] },
  });
});

// Midpoint rule wants to trigger but cant
test("snap rule precedence", () => {
  const a = [
    [0, 0],
    [0, 50],
    [50, 50],
    [50, 100],
    [100, 100],
    [100, 0],
  ];
  const b = [
    [0, 55],
    [50, 75],
    [0, 75],
  ];

  assert.deepStrictEqual(dragmove(a, b), {
    isSnapped: true,
    translate: { x: 0, y: -5 },
    snapDetails: { type: "vertex", targetVertex: [0, 55] },
  });
});
