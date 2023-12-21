import { Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { useDispatchers } from '../../../DispatcherContextProvider';
import { selectAndExpandNodesWorker } from '../../../redux/layertree/LayerTreeWorkers';
import { Model } from '../../../redux/model/ModelTypes';
import { useWorker } from '../../../redux/utils/workers';
import { generateRandomString } from '../../../utils/randomId';
import "./NewFolderButton.scss";

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
      className="new-folder-button"
      minimal
      text='New Folder'
      fill
      intent={Intent.PRIMARY}
      icon={IconNames.FOLDER_NEW}
      onClick={handleClick}
    />
  );
};