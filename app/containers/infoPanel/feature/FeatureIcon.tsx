import { Icon } from '@blueprintjs/core';
import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import './FeatureView.scss';

export namespace FeatureIcon {
  export interface Props {
    feature: Model.Types.Feature;
    size: number;
    color?: string;
  }
}

export const FeatureIcon = React.memo(function FeatureIcon({
  feature,
  size,
  color,
}: FeatureIcon.Props) {
  // TODO: (gcole) show asset if one is used in the style for this feature
  const geometryType = Model.Types.Geometries[feature.geometry.type];
  return (
    <Icon
      className='feature-icon'
      icon={geometryType.icon}
      iconSize={size}
      color={color}
    />
  );
});
