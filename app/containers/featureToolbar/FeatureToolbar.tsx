import { ButtonGroup, Classes } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Grid } from '../../redux/grid/GridTypes';
import { Model } from '../../redux/model/ModelTypes';
import { FeatureButton } from './FeatureButton';
import './FeatureToolbar.scss';

export function FeatureToolbar() {
  return (
    <div className='feature-toolbar'>
      <ButtonGroup id='feature-buttons' fill className={Classes.DARK}>
        {Object.keys(Model.Types.Geometries).map((geometry) => {
          const geometryInfo = Model.Types.Geometries[geometry];
          return (
            <FeatureButton
              geometryInfo={geometryInfo}
              key={geometryInfo.id}
            />
          )
        })}
      </ButtonGroup>
    </div>
  );
}

