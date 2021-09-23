import { ReduxState } from "../AppReducer";
import { Model } from "../model/ModelTypes";
import { createActionWrapper } from "../utils/typedAction";
import { findCommonAncestor } from "../model/ModelTree";
import { namedAction } from "../utils/actionName";
import { Identifiable } from "../utils/indexable";

const name = namedAction('clipboard');

export namespace Clipboard {
  export namespace Types {
    export interface State {
      items: string[];
      pasteCount: number;
    }
  }

  export namespace Payloads {
    
  }

  export const DispatchActions = {
    setItems: createActionWrapper<string[]>(name('setItems')),
    clearItems: createActionWrapper<void>(name('clearItems')),
    increasePasteCount: createActionWrapper<void>(name('increasePasteCount')),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.clipboard;
    export const getItems = (state: ReduxState) => get(state).items;
  }
}
