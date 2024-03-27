/**
 * @typedef Rect
 * @prop {number} x
 * @prop {number} y
 * @prop {number} width
 * @prop {number} height
 */

/**
 * Test if two rectangles intersect
 * @param {Rect} a
 * @param {Rect} b
 * @return {boolean}
 */
export const rectIntersect = (a, b) =>
  !(
    b.x > a.x + a.width ||
    b.x + b.width < a.x ||
    b.y > a.y + a.height ||
    b.y + b.height < a.y
  );

/**
 * @param {Rect} rect
 * @param {number} margin
 * @return {Rect}
 */
export const inflate = ({ x, y, width, height }, margin) => ({
  x: x - margin,
  y: y - margin,
  width: width + margin * 2,
  height: height + margin * 2,
});

const pairwise = (array) => {
  return Array.from({ length: array.length - 1 }, (_, i) =>
    array.slice(i, i + 2),
  );
};

/**
 * Given a list of points forming an unclosed polygon, returns a list of that polygon's edges.
 * @param {[number, number][]} points
 * @return {[[number, number], [number, number]][]}
 */
export const edges = (points) => pairwise([...points, points[0]]);
