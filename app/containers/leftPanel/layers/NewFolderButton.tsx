import * as React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useDispatchers } from '../../../DispatcherContextProvider';
import { generateRandomString } from '../../../utils/randomId';
import { useSelector } from 'react-redux';
import { Model } from '../../../redux/model/ModelTypes';
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';
import { useWorker } from '../../../redux/utils/workers';
import { selectAndExpandNodesWorker } from '../../../redux/layertree/LayerTreeWorkers';

export const NewFolderButton = () => {
  const dispatchers = useDispatchers();
  const selectAndExpandNodes = useWorker(selectAndExpandNodesWorker);

  const handleClick = React.useCallback(() => {
    const layerId = generateRandomString();
    dispatchers.model.createLayer({
      parentId: Model.RootLayerId,
      layerId,
    });
    selectAndExpandNodes([layerId]);
  }, [dispatchers, selectAndExpandNodes]);
  return (
    <Button
      minimal
      text='New Folder'
      fill
      intent={Intent.PRIMARY}
      icon={IconNames.FOLDER_NEW}
      onClick={handleClick}
    />
  );
};