import {
  midpoint,
  pointLineDist,
  pointPointDist,
  projectPointToLine,
} from "./linear.js";
import { edges } from "./util.js";

/**
 * @typedef {[number, number]} Vertex
 */

/**
 * @typedef SnapInfo
 * @prop {boolean} isSnapped
 * @prop {({x:number,y:number}|undefined)} translate
 * @prop {({type:('vertex'|'midpoint'|'edge'),targetVertex:Vertex}|undefined)} snapDetails
 */

/**
 * @typedef DragMoveOpts
 * @prop {number} vertexSnapDist
 * @prop {number} midpointSnapDist
 * @prop {number} edgeSnapDist
 */

/**
 * @param {Vertex[]} aPoints
 * @param {Vertex[]} bPoints
 * @param {DragMoveOpts} options
 * @returns {SnapInfo}
 */
export default (aPoints, bPoints, options = {}) => {
  const opts = {
    vertexSnapDist: 20,
    midpointSnapDist: 15,
    edgeSnapDist: 10,
    ...options,
  };

  // TODO a replacement for find(some()) that doesn't discard the inner result
  const vertexSnap = bPoints.find((bPoint) =>
    aPoints.some((q) => pointPointDist(bPoint, q) < opts.vertexSnapDist),
  );

  if (vertexSnap) {
    // TODO reuse calculation without compromising readability
    const [ax, ay] = aPoints.find(
      (q) => pointPointDist(vertexSnap, q) < opts.vertexSnapDist,
    );
    const [bx, by] = vertexSnap;
    return {
      isSnapped: true,
      translate: { x: ax - bx, y: ay - by },
      snapDetails: { type: "vertex", targetVertex: vertexSnap },
    };
  }

  // Collate midpoints
  const aEdges = edges(aPoints);
  const aMidpoints = aEdges.map(midpoint);

  const midpointSnap = bPoints.find((bPoint) =>
    aMidpoints.some((q) => pointPointDist(bPoint, q) < opts.midpointSnapDist),
  );

  if (midpointSnap) {
    // TODO reuse calculation again...
    const [ax, ay] = aMidpoints.find(
      (q) => pointPointDist(midpointSnap, q) < opts.midpointSnapDist,
    );
    const [bx, by] = midpointSnap;
    return {
      isSnapped: true,
      translate: { x: ax - bx, y: ay - by },
      snapDetails: { type: "midpoint", targetVertex: midpointSnap },
    };
  }

  // FIXME bug where snap is found beyond the endpoints of lines - test that projected point falls in range [0,1]
  const edgeSnap = bPoints.find((bPoint) =>
    aEdges.some(([v, w]) => pointLineDist(bPoint, v, w) < opts.edgeSnapDist),
  );

  if (edgeSnap) {
    const [v, w] = aEdges.find(
      ([v, w]) => pointLineDist(edgeSnap, v, w) < opts.edgeSnapDist,
    );
    const [rx, ry] = projectPointToLine(edgeSnap, v, w);
    const [px, py] = edgeSnap;
    return {
      isSnapped: true,
      translate: { x: rx - px, y: ry - py },
      snapDetails: { type: "edge", targetVertex: edgeSnap },
    };
  }

  return { isSnapped: false };
};
