/**
 * This whole file is a dreadful mess and mixes metaphors and different ways of calculating the same thing because Im
 * cribbing from stackoverflow without taking the time to understand the maths properly!
 */

/**
 * @param {[number, number]} v
 * @returns {number}
 */
const magnitude = (v) => Math.sqrt(mag2(v));
/**
 * @param {number} vx
 * @param {number} vy
 * @returns {number}
 */
const mag2 = ([vx, vy]) => vx * vx + vy * vy;

/**
 * Distance between two points
 * @param {number} ax
 * @param {number} ay
 * @param {number} bx
 * @param {number} by
 * @returns {number}
 */
export const pointPointDist = ([ax, ay], [bx, by]) =>
  magnitude([bx - ax, by - ay]);

/**
 * Distance between a point p and a line passing through v and w.
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} wx
 * @param {number} wy
 * @returns {number}
 */
export const pointLineDist = ([px, py], [vx, vy], [wx, wy]) =>
  // TODO do this in terms of perpDot()?
  Math.abs((px - vx) * (wy - vy) - (py - vy) * (wx - vx)) /
  pointPointDist([vx, vy], [wx, wy]);

/**
 * @param {number} vx
 * @param {number} vy
 * @param {number} wx
 * @param {number} wy
 * @returns {number}
 */
const dot = ([vx, vy], [wx, wy]) => vx * wx + vy * wy;

// /**
//  * Perpendicular dot product in 2D
//  * @param {number} vx
//  * @param {number} vy
//  * @param {number} wx
//  * @param {number} wy
//  * @return {number}
//  */
// export const perpDot = ([vx, vy], [wx, wy]) => vx * wy - vy * wx;

/**
 * Return the projection of point P onto line VW
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} wx
 * @param {number} wy
 * @return {[number, number]}
 */
export const projectPointToLine = ([px, py], [vx, vy], [wx, wy]) => {
  const e1 = [wx - vx, wy - vy];
  const e2 = [px - vx, py - vy];

  const valDp = dot(e1, e2);
  const len2 = mag2(e1);
  const [e1x, e1y] = e1;
  return [vx + (valDp * e1x) / len2, vy + (valDp * e1y) / len2];
};

/**
 * @param {number} vx
 * @param {number} vy
 * @param {number} wx
 * @param {number} wy
 * @return {[number,number]}
 */
export const midpoint = ([[vx, vy], [wx, wy]]) => [
  vx + (wx - vx) / 2,
  vy + (wy - vy) / 2,
];
