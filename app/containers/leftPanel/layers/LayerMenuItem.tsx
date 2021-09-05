import { MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { generateRandomString } from '../../../utils/randomId';
import { useDispatchers } from '../../../DispatcherContextProvider';

export namespace LayerMenuItem {
  export interface Props {
    parent: string;
  }
}

export const LayerMenuItem = React.memo(function LayerMenuItem({
  parent
}: LayerMenuItem.Props) {
  const dispatchers = useDispatchers();
  const onClickCreateLayer = React.useCallback(() => {
    const layerId = generateRandomString();
    dispatchers.model.createLayer({
      layerId,
      parentId: parent,
    });
  }, [dispatchers]);
  return (
    <>
      <MenuItem
        key='new-layer-item'
        icon={IconNames.FOLDER_NEW}
        text='Create New Layer'
        onClick={onClickCreateLayer}
      />
      <MenuItem
        key='delete-layer-item'
        icon={IconNames.TRASH}
        text='Delete Layer'
      />
    </>
  );
  
});
