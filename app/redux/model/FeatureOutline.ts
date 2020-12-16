import { Model } from "./ModelTypes";
import { visitFeature } from "./ModelVisitors";
import { PointRadius } from "../../containers/svg/features/PointFeature";


function getOutlineForPointFeature(feature: Model.Types.Feature<Model.Types.Point>): Model.Types.Geometry {
  const outline: Model.Types.Circle = {
    type: 'circle',
    p: { ...feature.geometry.p },
    r: PointRadius,
  } 
  return outline;
}

function getOulineForPathFeature(feature: Model.Types.Feature<Model.Types.Path>): Model.Types.Geometry {
  const xs = feature.geometry.path.map((c) => c.x);
  const ys = feature.geometry.path.map((c) => c.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const outline: Model.Types.Rectangle = {
    type: 'rectangle',
    p1: { x: minX, y: minY },
    p2: { x: maxX, y: maxY },
  };
  return outline;
}

function getOutlineForOutlineFeature(feature: Model.Types.Feature): Model.Types.Geometry {
  return { ...feature.geometry };
}

export function getOutlineForFeature(feature: Model.Types.Feature) {
  return visitFeature({
    visitPoint: getOutlineForPointFeature,
    visitCircle: getOutlineForOutlineFeature,
    visitPath: getOulineForPathFeature,
    visitRectangle: getOutlineForOutlineFeature,
  }, feature)
}
