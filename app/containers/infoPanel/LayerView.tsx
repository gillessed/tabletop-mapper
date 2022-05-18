import { Button, EditableText, Intent } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Model } from '../../redux/model/ModelTypes';
import { generateRandomString } from '../../utils/randomId';
import './LayerView.scss';

export interface LayerViewProps {
  layerId: string;
}

export const LayerView = React.memo(function LayerView({
  layerId,
}: LayerViewProps) {
  const layers = useSelector(Model.Selectors.getLayers);
  const layer = layers.byId[layerId];
  const dispatchers = useDispatchers();
  React.useEffect(() => {
    setLayerNameValue(layer.name);
  }, [layerId]);
  const [layerNameValue, setLayerNameValue] = React.useState(layer.name);
  const setLayerName = React.useCallback((value: string) => {
    dispatchers.model.setLayerName({ layerId, name: value });
  }, [dispatchers, layerId]);
  const createNewLayer = React.useCallback(() => {
    dispatchers.model.createLayer({
      parentId: layerId,
      layerId: generateRandomString(),
      name: "New Layer",
    })
  }, [layerId, dispatchers]);
  return (
    <div className='layer-view-container' >
      <EditableText
        className='title'
        value={layerNameValue}
        onChange={setLayerNameValue}
        onConfirm={setLayerName}
      />
      <div className='subtitle'>Layer</div>
      <div className='buttons'>
        <Button
          icon='add-to-artifact'
          text='Create Sublayer'
          intent={Intent.PRIMARY}
          onClick={createNewLayer}
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
    </div >
  );
});
