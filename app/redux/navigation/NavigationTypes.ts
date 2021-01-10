import { ReduxState } from "../AppReducer";
import { createActionWrapper } from "../utils/typedAction";

export namespace Navigation {
  export namespace Types {

    export type State = {
      currentView: ViewKey;
      isProjectDialogOpen: boolean;
    };

    export type ViewKey = 'Blank' | 'Project' | 'AssetManager';
  }

  export const DispatchActions = {
    setCurrentView: createActionWrapper<Navigation.Types.ViewKey>('navigation::setCurrentView'),
    setProjectDialogOpen: createActionWrapper<boolean>('navigation::setProjectDialogOpen'),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.navigation;
    export const getCurrentView = (state: ReduxState) => get(state).currentView;
    export const isProjectDialogOpen = (state: ReduxState) => get(state).isProjectDialogOpen;
  }
}
