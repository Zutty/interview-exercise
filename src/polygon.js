import Konva from "konva";
import polylabel from "polylabel";
import { pointPointDist } from "./linear.js";
import { edges } from "./util.js";

/**
 * @param {number} x
 * @param {number} y
 * @param {[number, number][]} points
 * @param {string} label
 * @param {string} fill
 * @returns {Group}
 */
export default ({ x, y, points, label, fill }) => {
  const polygon = new Konva.Group({ x, y, draggable: true, name: "polygon" });
  polygon.add(
    new Konva.Line({
      points: points.flat(),
      closed: true,
      fill,
      stroke: "black",
      strokeWidth: 2,
      name: "bg",
    }),
  );

  polygon.add(
    new Konva.Line({
      points: points.flat(),
      closed: true,
      stroke: "black",
      strokeWidth: 8,
      dash: edges(points).flatMap(([a, b]) => [
        0.001,
        pointPointDist(a, b) - 0.001,
      ]),
      lineCap: "round",
      name: "fg",
    }),
  );

  const [cx, cy] = polylabel([points]);
  polygon.add(
    new Konva.Text({
      text: label,
      fontSize: 18,
      fill: "black",
      x: cx - 10,
      y: cy - 10,
      width: 20,
      height: 20,
      align: "center",
      verticalAlign: "middle",
    }),
  );
  return polygon;
};
