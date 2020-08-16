import { Button, PopoverPosition, Tooltip } from '@blueprintjs/core';
import * as React from 'react';
import { Dispatchers } from '../../redux/Dispatchers';
import { Grid } from '../../redux/grid/GridTypes';
import { Model } from '../../redux/model/ModelTypes';

interface Props {
  mouseMode: Grid.Types.MouseMode;
  geometryInfo: Model.Types.GeometryInfo;
  dispatchers: Dispatchers;
}

export class FeatureButton extends React.PureComponent<Props, {}> {
  public render() {
    const { mouseMode, geometryInfo } = this.props;
    return (
      <Tooltip content={geometryInfo.name} position={PopoverPosition.BOTTOM}>
        <Button
          className='feature-button'
          icon={geometryInfo.icon}
          onClick={this.onClick}
          active={mouseMode === geometryInfo.mouseMode}
        />
      </Tooltip>
    );
  }

  private onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { geometryInfo, dispatchers } = this.props;
    dispatchers.grid.startDraw(geometryInfo.id);
  }
}
