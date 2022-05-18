import { newTypedReducer, Reducer } from '../utils/typedReducer';
import { Navigation } from './NavigationTypes';

const InitialState: Navigation.Types.State = {
  currentView: "Blank",
  isProjectDialogOpen: true,
  isGridDialogOpen: false,
};

const setCurrentViewReducer = (
  state: Navigation.Types.State,
  viewKey: Navigation.Types.ViewKey,
): Navigation.Types.State => {
  return { ...state, currentView: viewKey };
}

const setProjectDialogOpenReducer = (
  state: Navigation.Types.State,
  open: boolean,
): Navigation.Types.State => {
  return { ...state, isProjectDialogOpen: open };
}

const setGridDialogOpenReducer = (
  state: Navigation.Types.State,
  open: boolean,
): Navigation.Types.State => {
  return { ...state, isGridDialogOpen: open };
}

const closeDialogsReducer = (
  state: Navigation.Types.State,
  open: boolean,
): Navigation.Types.State => {
  return {
    ...state,
    isProjectDialogOpen: false,
    isGridDialogOpen: false,
  };
}

export const navigationReducer: Reducer<Navigation.Types.State> = newTypedReducer<Navigation.Types.State>()
  .handlePayload(Navigation.Actions.setCurrentView.type, setCurrentViewReducer)
  .handlePayload(Navigation.Actions.setProjectDialogOpen.type, setProjectDialogOpenReducer)
  .handlePayload(Navigation.Actions.setGridDialogOpen.type, setGridDialogOpenReducer)
  .handlePayload(Navigation.Actions.closeDialogs.type, closeDialogsReducer)
  .handleDefault((state = InitialState) => state)
  .build();

