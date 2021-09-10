import * as React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useDispatchers } from '../../../DispatcherContextProvider';
import { generateRandomString } from '../../../utils/randomId';
import { useSelector } from 'react-redux';
import { Model } from '../../../redux/model/ModelTypes';
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';

export const NewFolderButton = () => {
  const dispatchers = useDispatchers();
  const model = useSelector(Model.Selectors.get);
  const selection = useSelector(LayerTree.Selectors.getSelectedNodes);

  const enabled = selection.length <= 1;
  const targetLayer: Model.Types.Layer = React.useMemo(() => {
    if (selection.length === 0) {
      return model.layers.byId[Model.RootLayerId];
    } else {
      const selectedId = selection[0];
      const maybeFeature = model.features.byId[selectedId];
      if (Model.Types.isFeature(maybeFeature)) {
        const layerId = maybeFeature.layerId;
        return model.layers.byId[layerId];
      } else {
        return model.layers.byId[selectedId];
      }
    }
  }, [selection, model]);

  const handleClick = React.useCallback(() => {
    const layerId = generateRandomString();
    dispatchers.model.createLayer({
      parentId: targetLayer.id,
      layerId,
    });
    dispatchers.layerTree.selectNodes([layerId]);
    dispatchers.layerTree.expandNodes([layerId]);
  }, [targetLayer.id, dispatchers]);
  return (
    <Button
      minimal
      text='New Folder'
      fill
      intent={Intent.PRIMARY}
      icon={IconNames.FOLDER_NEW}
      onClick={handleClick}
      disabled={!enabled}
    />
  );
};