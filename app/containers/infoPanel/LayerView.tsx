import { Button, Intent } from '@blueprintjs/core';
import * as React from 'react';
import { Dispatchers } from '../../redux/Dispatchers';
import { Model } from '../../redux/model/ModelTypes';
import './LayerView.scss';

interface Props {
  model: Model.Types.State;
  layer: Model.Types.Layer;
  dispatchers: Dispatchers;
}

export class LayerView extends React.PureComponent<Props, {}> {
  public render() {
    return (
      <div className='layer-view-container'>
        <div className='title'> {this.props.layer.name} </div>
        <div className='subtitle'>Layer</div>
        <div className='buttons'>
          <Button
            icon='add-to-artifact'
            text='Create Sublayer'
            intent={Intent.PRIMARY}
          />
          <Button
            icon='duplicate'
            text='Clone Layer'
          />
          <Button
            icon='trash'
            text='Delete Layer'
            intent={Intent.DANGER}
          />
        </div>
      </div>
    );
  }
}
