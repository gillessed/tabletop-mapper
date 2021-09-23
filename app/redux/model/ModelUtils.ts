import { Transform, Vector, Coordinate } from "../../math/Vector";
import { Asset } from "../asset/AssetTypes";
import { Identifiable, Indexable } from "../utils/indexable";
import { Model } from "./ModelTypes";
import { visitGeometry } from "./ModelVisitors";

export const findByName = <T extends Identifiable>(index: Indexable<T>, name: string) => {
  return index.all.find((id: string) => {
    if (index.byId[id].name === name) {
      return true;
    }
    return false;
  });
}

export const getGeometryForBasicAssetFeature = (
  asset: Asset.Types.Asset,
  transform: Transform,
  mousePosition: Vector,
): Model.Types.Rectangle => {
  const assetDimensions: Vector = Vector.of(asset.gridDimensions ?? { x: 3, y: 3 });
  const p1 = transform.applyV(mousePosition).subtract(assetDimensions.scalarMultiply(0.5)).round();
  return {
    type: 'rectangle',
    snapToGrid: true,
    p1: p1.getCoordinate(),
    p2: p1.add(assetDimensions).getCoordinate(),
  };
}

export const rectEquals = (r1: Model.Types.Rectangle, r2: Model.Types.Rectangle): boolean => {
  return (
    r1.p1.x === r2.p1.x &&
    r1.p1.y === r2.p1.y &&
    r1.p2.x === r2.p2.x &&
    r1.p2.y === r2.p2.y
  );
}

export const getBoundingBox = (geometries: Model.Types.Geometry[]): Model.Types.Rectangle => {
  const coordinates: Coordinate[] = [];
  for (const geometry of geometries) {
    visitGeometry({
      visitPath: (path) => coordinates.push(...path.path),
      visitRectangle: (rectangle) => coordinates.push(rectangle.p1, rectangle.p2),
    }, geometry);
  }
  if (coordinates.length === 0) {
    return {
      type: 'rectangle',
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 },
    }
  }
  let xmin = coordinates[0].x;
  let xmax = coordinates[0].x;
  let ymin = coordinates[0].y;
  let ymax = coordinates[0].y;
  for (const coordinate of coordinates) {
    const { x, y } = coordinate;
    if (x < xmin) {
      xmin = x;
    }
    if (x > xmax) {
      xmax = x;
    }
    if (y < ymin) {
      ymin = y;
    }
    if (y > ymax) {
      ymax = y;
    }
  }
  return {
    type: 'rectangle',
    p1: { x: xmin, y: ymin },
    p2: { x: xmax, y: ymax },
  };
}