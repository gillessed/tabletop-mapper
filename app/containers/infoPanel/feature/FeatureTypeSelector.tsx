import { ButtonGroup } from '@blueprintjs/core';
import * as React from 'react';
import { Dispatchers } from '../../../redux/Dispatchers';
import { Model } from '../../../redux/model/ModelTypes';
import { FeatureTypeSelectorButton } from './FeatureTypeSelectorButton';

interface Props {
  feature: Model.Types.Feature;
  dispatchers: Dispatchers;
}

export class FeatureTypeSelector extends React.PureComponent<Props, {}> {
  public render() {
    return (
      <ButtonGroup id='geometry-type-buttons' fill>
        {Object.keys(Model.Types.Geometries).map(this.renderButton)}
      </ButtonGroup>
    );
  }

  private renderButton = (key: string) => {
    const type = Model.Types.Geometries[key];
    let active = false;
    if (type.id === this.props.feature.geometry.type) {
      active = true;
    }
    return (
      <FeatureTypeSelectorButton
        key={type.name}
        dispatchers={this.props.dispatchers}
        feature={this.props.feature}
        type={type}
        active={active}
      />
    );
  }
}

