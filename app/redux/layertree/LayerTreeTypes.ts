import { ReduxState } from "../AppReducer";
import { Model } from "../model/ModelTypes";
import { createActionWrapper } from "../utils/typedAction";
import { findCommonAncestor } from "../model/ModelTree";
import { namedAction } from "../utils/actionName";

const name = namedAction('selection');

export namespace LayerTree {
  export namespace Types {
    export interface State {
      selectedNodes: string[];
      expandedNodes: { [key: string]: boolean };
    }
  }

  export namespace Payloads {
    
  }

  export const DispatchActions = {
    collapseNode: createActionWrapper<string>(name('collapseNode')),
    setSelectedNodes: createActionWrapper<string[]>(name('setSelectedNodes')),
    clearSelectedNodes: createActionWrapper<void>(name('clearSelectedNodes')),
  }

  export const Actions = {
    ...DispatchActions,
    setNodesExpanded: createActionWrapper<string[]>('selection::setNodesExpanded'),
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.layerTree;
    export const getSelectedNodes = (state: ReduxState) => get(state).selectedNodes;
    export const getSelectedFeatureIds = (state: ReduxState) => {
      const ids = getSelectedNodes(state);
      const featureIndex = Model.Selectors.getFeatures(state);
      return ids.filter((id) => featureIndex.byId[id] != null);
    };
    export const getCurrentLayer = (state: ReduxState) => {
      const layerTree = get(state);
      const model = Model.Selectors.get(state);
      if (layerTree.selectedNodes.length > 1) {
        const layerId = findCommonAncestor(model.features, model.layers, layerTree.selectedNodes);
        return layerId;
      } else if (layerTree.selectedNodes.length === 0) {
        return Model.RootLayerId;
      } else {
        let selectedId = layerTree.selectedNodes[0];
        if (model.features.byId[selectedId]) {
          selectedId = model.features.byId[selectedId].layerId;
        }
        return selectedId;
      }
    }
  }
}
