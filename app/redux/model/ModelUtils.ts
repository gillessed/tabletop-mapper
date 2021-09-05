import { Transform, Vector, Coordinate } from "../../math/Vector";
import { Asset } from "../asset/AssetTypes";
import { Identifiable, Indexable } from "../utils/indexable";
import { Model } from "./ModelTypes";

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
