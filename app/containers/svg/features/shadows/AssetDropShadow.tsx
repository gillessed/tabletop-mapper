import * as React from 'react';
import { useSelector } from 'react-redux';
import { Coordinate, Vector } from '../../../../math/Vector';
import { Asset } from '../../../../redux/asset/AssetTypes';
import { Grid } from '../../../../redux/grid/GridTypes';
import { Model } from '../../../../redux/model/ModelTypes';
import { Feature } from '../Feature';
import { getGeometryForBasicAssetFeature } from '../../../../redux/model/ModelUtils';

export const AssetDropShadow = React.memo(function AssetDropShadow() {
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const assetDropId = useSelector(Grid.Selectors.getAssetDropId);
  const mousePosition = useSelector(Grid.Selectors.getMousePosition);
  const transform = useSelector(Grid.Selectors.getTransform);
  const asset = useSelector(Asset.Selectors.getAssetById(assetDropId ?? ''));
  const mouseOnCanvas = useSelector(Grid.Selectors.getMouseOnCanvas);

  if (
    mouseMode != Grid.Types.MouseMode.DragAsset ||
    assetDropId == null ||
    mousePosition == null ||
    mouseOnCanvas === false
  ) {
    return null;
  }

  const geometry = getGeometryForBasicAssetFeature(asset, transform, mousePosition);
  const assetFeature: Model.Types.BasicAssetFeature = {
    id: 'dragged-asset',
    name: 'dragged-asset',
    type: 'basic-asset',
    layerId: '',
    geometry,
    assetId: assetDropId,
    objectCover: 'contain',
    rotation: 0,
    mirrored: false,
    opacity: 0.5,
  }

  return (
    <Feature
      feature={assetFeature}
    />
  )
});
