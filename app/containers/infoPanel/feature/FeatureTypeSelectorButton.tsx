import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { Dispatchers } from '../../../redux/dispatchers';
import { Model } from '../../../redux/model/ModelTypes';

interface Props {
  feature: Model.Types.Feature<any>;
  type: Model.Types.GeometryType;
  active: boolean;
  dispatchers: Dispatchers;
}

export class FeatureTypeSelectorButton extends React.PureComponent<Props> {
  public render() {
    return (
      <Button
        icon={this.props.type.icon}
        active={this.props.active}
        onClick={this.onClick}
      />
    );
  }

  private onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (this.props.feature.geometry) {
      // TODO: show warning
    }
    this.props.dispatchers.model.setFeatureType({
      featureId: this.props.feature.id,
      type: this.props.type.id,
    });
  }
}