import * as React from 'react';
import { useSelector } from 'react-redux';
import { useAppConfig } from '../../../AppConfigContextProvider';
import { Asset } from '../../../redux/asset/AssetTypes';
import { Grid } from '../../../redux/grid/GridTypes';
import { Model } from '../../../redux/model/ModelTypes';

export interface BasicAssetFeatureProps {
  feature: Model.Types.BasicAssetFeature;
}

export const BasicAssetFeature = React.memo(({
  feature,
}: BasicAssetFeatureProps) => {
  const appConfig = useAppConfig();
  const asset = useSelector(Asset.Selectors.getAssetById(feature.assetId));
  const editingFeatureClipRegion = useSelector(Grid.Selectors.getEditingFeatureClipRegion);
  // If the clip region is being rotated, render the asset without mirror
  // or rotation so the clip region matches what is rendered
  const isEditingClipRegion = feature.id === editingFeatureClipRegion;

  const file = appConfig.getAssetFileById(asset.id, asset.extension);
  const { geometry, rotation, mirrored, opacity, objectCover } = feature;
  const { p1, p2 } = geometry;
  const width = (p2.x - p1.x);
  const height = (p2.y - p1.y);
  const midx = p1.x + width / 2;
  const midy = p1.y + height / 2;
  const rotationTransform = `rotate(${!isEditingClipRegion ? rotation : 0} ${midx} ${midy})`;
  const mirrorTransform = (!isEditingClipRegion && mirrored) ? `
    scale(-1, 1)
    translate(${-midx * 2}, 0)
  ` : "";
  const transformation = `${mirrorTransform} ${rotationTransform}`;
  const aspectRatio =
    objectCover === 'contain' ? 'xMidYMid meet' :
      objectCover === 'cover' ? 'xMidYMid slice' :
        'none';
  const clipRegion = feature.clipRegion;
  console.log(clipRegion);
  const clipPathId = `${feature.id}-clip-path`;
  return (
    <g opacity={opacity}>
      <g transform={transformation}>
        <clipPath id={clipPathId}>
          {clipRegion == null && <rect
            x={p1.x}
            y={p1.y}
            width={width}
            height={height}
          />}
          {clipRegion != null && <rect
            x={p1.x + clipRegion.p1.x}
            y={p1.y + clipRegion.p1.y}
            width={clipRegion.p2.x - clipRegion.p1.x}
            height={clipRegion.p2.y - clipRegion.p1.y}
          />}
        </clipPath>
        <image
          href={file.fullPath}
          x={p1.x}
          y={p1.y}
          width={width}
          height={height}
          preserveAspectRatio={aspectRatio}
          clipPath={`url(#${clipPathId})`}
        />
      </g>
    </g>
  );
});
