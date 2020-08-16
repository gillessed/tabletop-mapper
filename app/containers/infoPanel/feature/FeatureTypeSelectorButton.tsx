import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { Dispatchers } from '../../../redux/Dispatchers';
import { Model } from '../../../redux/model/ModelTypes';

interface Props {
  feature: Model.Types.Feature;
  type: Model.Types.GeometryInfo;
  active: boolean;
  dispatchers: Dispatchers;
}

export class FeatureTypeSelectorButton extends React.PureComponent<Props> {
  public render() {
    return (
      <Button
        icon={this.props.type.icon}
        active={this.props.active}
      />
    );
  }
}
