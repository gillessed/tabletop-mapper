import { expandRectangle } from "../../math/ExpandGeometry";
import { Model } from "./ModelTypes";
import { visitFeature, visitGeometry } from "./ModelVisitors";

export const OutlinePixelStrokeWidth = 5;

function getOutlineForPath(
  geometry: Model.Types.Path,
): Model.Types.Rectangle {
  const xs = geometry.path.map((c) => c.x);
  const ys = geometry.path.map((c) => c.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const boundingBox: Model.Types.Rectangle = {
    type: 'rectangle',
    p1: { x: minX, y: minY },
    p2: { x: maxX, y: maxY },
  };
  return boundingBox;
}

function getOutlineForRectangle(
  geometry: Model.Types.Rectangle,
): Model.Types.Rectangle {
  return geometry;
}

export function getOutlineForFeature(
  feature: Model.Types.Feature,
): Model.Types.Rectangle {
  return visitGeometry({
    visitPath: getOutlineForPath,
    visitRectangle: getOutlineForRectangle,
  }, feature.geometry);
}
