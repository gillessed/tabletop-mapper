import { Transform, Vector } from "../../math/transform";
import { createActionWrapper } from "../utils/typedAction";
import { ReduxState } from "../rootReducer";

export namespace Grid {
  export namespace Types {
    export interface State {
      transform: Transform;
      mouseMode: MouseMode;
      mousePosition?: Vector;
    }

    export enum MouseMode {
      NONE,
      DRAG,
    }
  }

  export namespace Payloads {

  }

  export const DispatchActions = {
    updateGridState: createActionWrapper<Partial<Types.State>>('grid::upgradeGridState'),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.grid;
  }
}
