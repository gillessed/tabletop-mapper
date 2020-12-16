import * as React from 'react';
import { useSelector, useStore } from 'react-redux';
import { Model } from '../../../redux/model/ModelTypes';
import './FeatureView.scss';
import { FeatureIcon } from './FeatureIcon';
import { Colors, Switch, Classes } from '@blueprintjs/core';
import { SnapsToGridSwitch } from './SnapsToGridSwitch';

export namespace FeatureView {
  export interface Props {
    featureId: string;
  }
}

export const FeatureView = React.memo(function FeatureView({
  featureId,
}: FeatureView.Props) {
  const store = useStore();
  const features = useSelector(Model.Selectors.getFeatures);
  const feature = features.byId[featureId];
  // TODO: (gcole) figure out why useSelector is returning wrong value sometimes.
  // console.log('***** featureId', featureId);
  // console.log('features', features);
  // console.log('feature', feature);
  // console.log('state', store.getState());
  if (!feature) {
    return null;
  }
  const geometryType = Model.Types.Geometries[feature.geometry.type];
  return (
    <div className='feature-view-container'>
      <div className='feature-header'>
        <FeatureIcon
          feature={feature}
          size={60}
          color={Colors.LIGHT_GRAY5}
        />
        <div className='title'> {feature.name} </div>
        <div className='subtitle'>{geometryType.name}</div>
      </div>
      <div className='feature-body'>
        <div className='label'>Properties</div>
        <div className='section'>
          <SnapsToGridSwitch feature={feature} />
        </div>
      </div>
    </div>
  );
});
