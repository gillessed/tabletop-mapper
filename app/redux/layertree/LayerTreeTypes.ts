import { ReduxState } from "../AppReducer";
import { Model } from "../model/ModelTypes";
import { createActionWrapper } from "../utils/typedAction";

export namespace LayerTree {
  export namespace Types {
    export interface State {
      selectedNode: string;
      expandedNodes: { [key: string]: boolean };
    }
  }

  export namespace Payloads {

  }

  export const DispatchActions = {
    expandNode: createActionWrapper<string>('selection::expandNode'),
    collapseNode: createActionWrapper<string>('selection::collapseNode'),
    selectNode: createActionWrapper<string>('selection::selectNode'),
  }

  export const Actions = {
    ...DispatchActions,
    setNodesExpanded: createActionWrapper<string[]>('selection::setNodesExpanded'),
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.layerTree;
    export const getCurrentLayer = (state: ReduxState) => {
      const layerTree = get(state);
      const model = Model.Selectors.get(state);
      let selectedId = layerTree.selectedNode;
      if (model.features.byId[selectedId]) {
        selectedId = model.features.byId[selectedId].layerId;
      }
      return selectedId;
    }
  }
}
