import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { LayerTree } from '../../redux/layertree/LayerTreeTypes';
import { Model } from '../../redux/model/ModelTypes';
import { FeatureView } from './feature/FeatureView';
import './InfoPanel.scss';
import { LayerView } from './LayerView';
import { Classes } from '@blueprintjs/core';
import classNames from 'classnames';

export namespace InfoPanel {
  export interface Props {
    layerTree: LayerTree.Types.State;
    model: Model.Types.State;
  }
}

export const InfoPanel = React.memo(function InfoPanel() {
  const model = useSelector(Model.Selectors.get);
  const layerTree = useSelector(LayerTree.Selectors.get);

  let view = null;
  const { selectedNodes } = layerTree;
  const selectedNode = selectedNodes[0];
  if (model.features.all.indexOf(selectedNode) >= 0) {
    view = <FeatureView featureId={selectedNode} />;
  } else if (model.layers.all.indexOf(selectedNode) >= 0 && selectedNode !== Model.RootLayerId) {
    console.log('Rendering new view for ', selectedNode);
    view = (
      <LayerView
        layerId={selectedNode}
      />
    );
  }
  const classes = classNames('feature-panel-container', Classes.DARK);
  return (
    <div className={classes}>
      {view}
    </div>
  );
});
