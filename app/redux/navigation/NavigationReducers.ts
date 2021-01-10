import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { Navigation } from './NavigationTypes';

const InitialState: Navigation.Types.State = {
  currentView: "Blank",
  isProjectDialogOpen: true,
  // currentView: "Project",
  // isProjectDialogOpen: false,
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

export const navigationReducer: Reducer<Navigation.Types.State> = newTypedReducer<Navigation.Types.State>()
  .handlePayload(Navigation.Actions.setCurrentView.type, setCurrentViewReducer)
  .handlePayload(Navigation.Actions.setProjectDialogOpen.type, setProjectDialogOpenReducer)
  .handleDefault((state = InitialState) => state)
  .build();

