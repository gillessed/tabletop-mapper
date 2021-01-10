import { expandCircle, expandRectangle } from "../../math/ExpandGeometry";
import { curry2 } from "../../utils/functionalSugar";
import { DefaultSvgStyle } from "./DefaultStyles";
import { Model } from "./ModelTypes";
import { visitFeature, visitStyle } from "./ModelVisitors";

function getOutlineForPointFeature(
  style: Model.Types.Style,
  feature: Model.Types.Feature<Model.Types.Point>,
): Model.Types.Geometry {
  return visitStyle({
    visitBasicAssetStyle: () => {
      const outline: Model.Types.Circle = {
        type: 'circle',
        p: { ...feature.geometry.p },
        r: DefaultSvgStyle.pointRadius,
      };
      return outline;
    },
    visitSvgStyle: (svgStyle) => {
      const outline: Model.Types.Circle = {
        type: 'circle',
        p: { ...feature.geometry.p },
        r: svgStyle.pointRadius,
      };
      return outline;
    }
  }, style);
}

function getOulineForPathFeature(
  style: Model.Types.Style,
  feature: Model.Types.Feature<Model.Types.Path>,
): Model.Types.Geometry {
  const xs = feature.geometry.path.map((c) => c.x);
  const ys = feature.geometry.path.map((c) => c.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const boundingBox: Model.Types.Rectangle = {
    type: 'rectangle',
    p1: { x: minX, y: minY },
    p2: { x: maxX, y: maxY },
  };
  return visitStyle({
    visitBasicAssetStyle: () => {
      return boundingBox;
    },
    visitSvgStyle: (svgStyle) => {
      const strokeWidth = svgStyle.strokeWidth ?? 0;
      return expandRectangle(boundingBox, strokeWidth);
    }
  }, style);
}

function getOulineForRectangleFeature(
  style: Model.Types.Style,
  feature: Model.Types.Feature<Model.Types.Rectangle>,
): Model.Types.Geometry {
  return visitStyle({
    visitBasicAssetStyle: () => {
      return feature.geometry;
    },
    visitSvgStyle: (svgStyle) => {
      const strokeWidth = svgStyle.strokeWidth ?? 0;
      return expandRectangle(feature.geometry, strokeWidth);
    }
  }, style);
}

function getOulineForCircleFeature(
  style: Model.Types.Style,
  feature: Model.Types.Feature<Model.Types.Circle>,
): Model.Types.Geometry {
  return visitStyle({
    visitBasicAssetStyle: () => {
      return feature.geometry;
    },
    visitSvgStyle: (svgStyle) => {
      const strokeWidth = svgStyle.strokeWidth ?? 0;
      return expandCircle(feature.geometry, strokeWidth / 2);
    }
  }, style);
}

export function getOutlineForFeature(
  feature: Model.Types.Feature,
  style: Model.Types.Style,
) {
  return visitFeature({
    visitPoint: curry2(getOutlineForPointFeature)(style),
    visitCircle: curry2(getOulineForCircleFeature)(style),
    visitPath: curry2(getOulineForPathFeature)(style),
    visitRectangle: curry2(getOulineForRectangleFeature)(style),
  }, feature)
}
