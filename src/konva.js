import Konva from "konva";
import dragmove from "./dragmove.js";
import { inflate, rectIntersect } from "./util.js";
import polygon from "./polygon.js";

/**
 * TODO can jsdoc do variadic tuple types?
 * @param {number[]} arr
 * @yields {[number,number]}
 */
function* chunk(arr) {
  for (let i = 0; i < arr.length; i += 2) {
    yield arr.slice(i, i + 2);
  }
}

/** @param {Konva.Group} group */
export const pointsInAbsoluteCoords = (group) => {
  /** @type {Konva.Line} */
  const line = group.findOne("Line");
  return [...chunk(line.points())].map(([x, y]) => {
    const p = line.getAbsoluteTransform().point({ x, y });
    return [p.x, p.y];
  });
};

const stage = new Konva.Stage({
  container: "container",
  width: 800,
  height: 600,
});

const layer = new Konva.Layer();
stage.add(layer);

const a = polygon({
  label: "A",
  fill: "cyan",
  x: 50,
  y: 100,
  points: [
    [0, 300],
    [0, 200],
    [75, 75],
    [200, 0],
    [300, 0],
    [300, 300],
  ],
});
layer.add(a);

const b = polygon({
  label: "B",
  fill: "red",
  x: 400,
  y: 100,
  points: [
    [0, 75],
    [0, 50],
    [50, 0],
    [100, 50],
    [100, 75],
  ],
});
layer.add(b);

const c = polygon({
  label: "C",
  fill: "yellow",
  x: 550,
  y: 250,
  points: [
    [100, 0],
    [200, 50],
    [200, 100],
    [100, 50],
    [50, 100],
    [50, 200],
    [100, 250],
    [200, 200],
    [200, 250],
    [100, 300],
    [0, 250],
    [0, 50],
  ],
});
layer.add(c);

const tr = new Konva.Transformer({});
layer.add(tr);
tr.nodes([a]);

layer.draw();

layer.on("dragmove", (evt) => {
  // A bit of a hack to work around the transformer
  const target =
    evt.target instanceof Konva.Transformer
      ? evt.target.nodes()[0]
      : evt.target;

  // Rather than comparing the drag target to every other polygon every frame, find polygons whose bounding
  // boxes intersect the target, with a small margin to account for snapping distance
  // TODO this is a magic number here, but configurable in dragmove() - if I had time I'd consolidate the two
  const targetRect = inflate(target.getClientRect(), 20);
  const intersectedPolygon = layer
    .find(".polygon")
    .find(
      (polygon) =>
        polygon !== target &&
        rectIntersect(targetRect, polygon.getClientRect()),
    );

  if (intersectedPolygon) {
    const { isSnapped, translate } = dragmove(
      pointsInAbsoluteCoords(intersectedPolygon),
      pointsInAbsoluteCoords(target),
    );

    if (isSnapped) {
      evt.target.move(translate);
      // TODO transform snapDetails.targetVertex back into local coordinates and do something with it!
    }
  }
});
