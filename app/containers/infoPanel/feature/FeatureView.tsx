import * as React from 'react';
import { Dispatchers } from '../../../redux/Dispatchers';
import { Model } from '../../../redux/model/ModelTypes';
import { FeatureTypeSelector } from './FeatureTypeSelector';
import './FeatureView.scss';
import { GeometryButtons } from './GeometryButtons';

interface Props {
  model: Model.Types.State;
  feature: Model.Types.Feature;
  dispatchers: Dispatchers;
}

export class FeatureView extends React.PureComponent<Props, {}> {
  public render() {
    const geometryType = Model.Types.Geometries[this.props.feature.geometry.type].name;
    return (
      <div className='feature-view-container'>
        <div className='title'> {this.props.feature.name} </div>
        <div className='subtitle'>{geometryType}</div>
        <div className='section'>
          <FeatureTypeSelector
            feature={this.props.feature}
            dispatchers={this.props.dispatchers}
          />
        </div>
        <div className='section'>
          <GeometryButtons
            feature={this.props.feature}
            dispatchers={this.props.dispatchers}
          />
        </div>

      </div>
    );
  }
}
