import { Model } from "./ModelTypes";

export interface FeatureVisitor<Result> {
  visitPoint: (point: Model.Types.Feature<Model.Types.Point>) => Result;
  visitRectangle: (rectangle: Model.Types.Feature<Model.Types.Rectangle>) => Result;
  visitPath: (path: Model.Types.Feature<Model.Types.Path>) => Result;
  visitCircle: (circle: Model.Types.Feature<Model.Types.Circle>) => Result;
}

export function visitFeature<Result>(visitor: FeatureVisitor<Result>, feature: Model.Types.Feature) {
  switch (feature.geometry.type) {
    case 'point':
      return visitor.visitPoint(feature as Model.Types.Feature<Model.Types.Point>);
    case 'rectangle':
      return visitor.visitRectangle(feature as Model.Types.Feature<Model.Types.Rectangle>);
    case 'path':
      return visitor.visitPath(feature as Model.Types.Feature<Model.Types.Path>);
    case 'circle':
      return visitor.visitCircle(feature as Model.Types.Feature<Model.Types.Circle>);
  }
}

export interface GeometryVisitor<Result> {
  visitPoint: (point: Model.Types.Point) => Result;
  visitRectangle: (rectangle: Model.Types.Rectangle) => Result;
  visitPath: (path: Model.Types.Path) => Result;
  visitCircle: (circle: Model.Types.Circle) => Result;
}

export function visitGeometry<Result>(visitor: GeometryVisitor<Result>, geometry: Model.Types.Geometry) {
  switch (geometry.type) {
    case 'point':
      return visitor.visitPoint(geometry as Model.Types.Point);
    case 'rectangle':
      return visitor.visitRectangle(geometry as Model.Types.Rectangle);
    case 'path':
      return visitor.visitPath(geometry as Model.Types.Path);
    case 'circle':
      return visitor.visitCircle(geometry as Model.Types.Circle);
  }
}

export interface StyleVisitor<Result> {
  visitSvgStyle: (style: Model.Types.SvgStyle) => Result;
  visitBasicAssetStyle: (style: Model.Types.BasicAssetStyle) => Result;
}

export function visitStyle<Result>(visitor: StyleVisitor<Result>, style: Model.Types.Style) {
  switch (style.type) {
    case "svg":
      return visitor.visitSvgStyle(style as Model.Types.SvgStyle);
    case "basic-asset":
      return visitor.visitBasicAssetStyle(style as Model.Types.BasicAssetStyle);
  }
}
