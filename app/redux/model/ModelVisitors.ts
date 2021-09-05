import { Model } from "./ModelTypes";

export interface GeometryVisitor<Result> {
  visitRectangle: (rectangle: Model.Types.Rectangle) => Result;
  visitPath: (path: Model.Types.Path) => Result;
}

export function visitGeometry<Result>(visitor: GeometryVisitor<Result>, geometry: Model.Types.Geometry) {
  switch (geometry.type) {
    case 'rectangle':
      return visitor.visitRectangle(geometry as Model.Types.Rectangle);
    case 'path':
      return visitor.visitPath(geometry as Model.Types.Path);
  }
}

export interface FeatureVisitor<Result> {
  visitBasicAsset: (feature: Model.Types.BasicAssetFeature) => Result;
  visitPattern: (feature: Model.Types.PatternFeature) => Result;
}

export function visitFeature<Result>(visitor: FeatureVisitor<Result>, feature: Model.Types.Feature) {
  switch (feature.type) {
    case 'basic-asset':
      return visitor.visitBasicAsset(feature);
    case 'pattern':
      return visitor.visitPattern(feature);
  }
}