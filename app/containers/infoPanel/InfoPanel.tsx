import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../AppContextProvider';
import { LayerTree } from '../../redux/layertree/LayerTreeTypes';
import { Model } from '../../redux/model/ModelTypes';
import { FeatureView } from './feature/FeatureView';
import './InfoPanel.scss';
import { LayerView } from './LayerView';

export namespace InfoPanel {
  export interface Props {
    layerTree: LayerTree.Types.State;
    model: Model.Types.State;
  }
}

export const InfoPanel = React.memo(function InfoPanel() {
  const dispatchers = useDispatchers();
  const model = useSelector(Model.Selectors.get);
  const layerTree = useSelector(LayerTree.Selectors.get);

  let view = null;
  const { selectedNodes } = layerTree;
  const selectedNode = selectedNodes[0];
  if (model.features.all.indexOf(selectedNode) >= 0) {
    view = <FeatureView featureId={selectedNode} />;
  } else if (model.layers.all.indexOf(selectedNode) >= 0 && selectedNode !== Model.RootLayerId) {
    view = (
      <LayerView
        layer={model.layers.byId[selectedNode]}
        model={model}
        dispatchers={dispatchers}
      />
    );
  }
  return (
    <div className='feature-panel-container'>
      {view}
    </div>
  );
});
