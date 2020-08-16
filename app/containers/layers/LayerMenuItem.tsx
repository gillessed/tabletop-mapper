import { MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { Dispatchers } from '../../redux/Dispatchers';
import { generateRandomString } from '../../utils/randomId';

interface Props {
  parent: string;
  dispatchers: Dispatchers;
}

export class LayerMenuItems extends React.PureComponent<Props, {}> {
  public render() {
    return (
      <>
        <MenuItem
          key='new-layer-item'
          icon={IconNames.FOLDER_NEW}
          text='Create New Layer'
          onClick={this.onClickCreateLayer}
        />
        <MenuItem
          key='delete-layer-item'
          icon={IconNames.TRASH}
          text='Delete Layer'
        />
      </>
    );
  }

  private onClickCreateLayer = () => {
    const layerId = generateRandomString();
    this.props.dispatchers.model.createLayer({
      layerId,
      parentId: this.props.parent,
    });
  }
}
