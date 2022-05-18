import * as React from 'react';
import { useSelector } from 'react-redux';
import { useAppConfig } from '../../../AppConfigContextProvider';
import { Asset } from '../../../redux/asset/AssetTypes';
import { Model } from '../../../redux/model/ModelTypes';

export interface BasicAssetFeatureProps {
  feature: Model.Types.BasicAssetFeature;
}

export const BasicAssetFeature = React.memo(({
  feature,
}: BasicAssetFeatureProps) => {
  const appConfig = useAppConfig();
  const asset = useSelector(Asset.Selectors.getAssetById(feature.assetId));

  const file = appConfig.getAssetFileById(asset.id, asset.extension);
  const { geometry, rotation, mirrored, opacity, objectCover } = feature;
  const { p1, p2 } = geometry;
  const width = (p2.x - p1.x);
  const height = (p2.y - p1.y);
  const midx = p1.x + width / 2;
  const midy = p1.y + height / 2;
  const rotationTransform = `rotate(${rotation} ${midx} ${midy})`;
  const mirrorTransform = mirrored ? `
  scale(-1, 1)
  translate(${-midx*2}, 0)
  ` : "";
  const transformation = `${mirrorTransform} ${rotationTransform}`;
  const aspectRatio = 
    objectCover === 'contain' ? 'xMidYMid meet' :
    objectCover === 'cover' ? 'xMidYMid slice' :
    'none';
  return (
    <g opacity={opacity}>
      <g transform={transformation}>
        <image
          href={file.fullPath}
          x={p1.x}
          y={p1.y}
          width={width}
          height={height}
          preserveAspectRatio={aspectRatio}
        />
      </g>
    </g>
  );
});
