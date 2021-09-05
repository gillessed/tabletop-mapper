import * as React from 'react';
import { useSelector } from 'react-redux';
import { same } from '../../../math/Vector';
import { Grid } from '../../../redux/grid/GridTypes';
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';
import { getFeatureTranslation, translateFeature, translateGeometry } from '../../../redux/model/FeatureTranslation';
import { Model } from '../../../redux/model/ModelTypes';
import { Feature } from './Feature';
import { Asset } from '../../../redux/asset/AssetTypes';
import { useAppConfig } from '../../../AppConfigContextProvider';
import { ReduxState } from '../../../redux/AppReducer';

interface Props {
  feature: Model.Types.BasicAssetFeature;
}

export const BasicAssetFeature = React.memo(({
  feature,
}: Props) => {
  const appConfig = useAppConfig();
  const asset = useSelector(Asset.Selectors.getAssetById(feature.assetId));

  const file = appConfig.getAssetFileById(asset.id, asset.extension);
  const { p1, p2 } = feature.geometry;
  return (
    <image href={file.fullPath} x={p1.x} y={p1.y} width={p2.x - p1.x} height={p2.y - p1.y} />
  );
});
