import { ReduxState } from "../AppReducer";
import { Model } from "../model/ModelTypes";
import { createActionWrapper } from "../utils/typedAction";
import { findCommonAncestor } from "../model/ModelTree";

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
    expandNodes: createActionWrapper<string[]>('selection::expandNodes'),
    collapseNode: createActionWrapper<string>('selection::collapseNode'),
    selectNodes: createActionWrapper<string[]>('selection::selectNodes'),
  }

  export const Actions = {
    ...DispatchActions,
    setNodesExpanded: createActionWrapper<string[]>('selection::setNodesExpanded'),
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.layerTree;
    export const getSelectedNodes = (state: ReduxState) => get(state).selectedNodes;
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
