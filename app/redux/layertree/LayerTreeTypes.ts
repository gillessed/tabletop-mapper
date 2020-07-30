import { ReduxState } from "../AppReducer";
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
  }
}
