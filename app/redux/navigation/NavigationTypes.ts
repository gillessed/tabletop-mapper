import { ReduxState } from "../AppReducer";
import { namedAction } from "../utils/actionName";
import { createActionWrapper } from "../utils/typedAction";

const name = namedAction("navigation");
export namespace Navigation {
  export namespace Types {
    export type State = {
      currentView: ViewKey;
      isProjectDialogOpen: boolean;
      isGridDialogOpen: boolean;
      isExportDialogOpen: boolean;
    };

    export type ViewKey = "Blank" | "Project" | "AssetManager";
  }

  export const DispatchActions = {
    setCurrentView: createActionWrapper<Navigation.Types.ViewKey>(
      name("setCurrentView")
    ),
    setProjectDialogOpen: createActionWrapper<boolean>(
      name("setProjectDialogOpen")
    ),
    setGridDialogOpen: createActionWrapper<boolean>(name("setGridDialogOpen")),
    setExportDialogOpen: createActionWrapper<boolean>(
      name("setExportDialogOpen")
    ),
    closeDialogs: createActionWrapper<void>(name("closeDialogs")),
  };

  export const Actions = {
    ...DispatchActions,
  };

  export namespace Selectors {
    export const get = (state: ReduxState) => state.navigation;
    export const getCurrentView = (state: ReduxState) => get(state).currentView;
    export const isProjectDialogOpen = (state: ReduxState) =>
      get(state).isProjectDialogOpen;
    export const isGridDialogOpen = (state: ReduxState) =>
      get(state).isGridDialogOpen;
    export const isExportDialogOpen = (state: ReduxState) =>
      get(state).isExportDialogOpen;
  }
}
