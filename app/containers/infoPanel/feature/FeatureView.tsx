import { Colors } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Model } from '../../../redux/model/ModelTypes';
import { FeatureIcon } from './FeatureIcon';
import { getFeatureProperties } from './FeatureProperties';
import './FeatureView.scss';

export namespace FeatureView {
  export interface Props {
    featureId: string;
  }
}

export const FeatureView = React.memo(function FeatureView({
  featureId,
}: FeatureView.Props) {
  const features = useSelector(Model.Selectors.getFeatures);
  const feature = features.byId[featureId];
  const properties = getFeatureProperties(feature);
  return (
    <div className='feature-view-container'>
      <div className='feature-header'>
        <FeatureIcon
          feature={feature}
          size={60}
          color={Colors.LIGHT_GRAY5}
        />
        <div className='title'> {feature.name} </div>
        <div className='subtitle'>{Model.Types.FeatureNames[feature.type]}</div>
      </div>
      <div className='feature-body'>
        {properties.map((property) => {
          return (
            <div className='feature-property' key={property.name}>
              <div className='feature-name label'>{property.name}</div>
              <div className='feature-row'>
                {property.row}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
