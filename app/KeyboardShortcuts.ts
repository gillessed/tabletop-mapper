import { Store } from "redux";
import { ReduxState } from "./redux/AppReducer";
import { Navigation } from "./redux/navigation/NavigationTypes";
import { Project } from "./redux/project/ProjectTypes";

enum KeyCodes {
  A = "KeyA",
  S = "KeyS",
  Esc = "Escape",
}

export function registerKeyboardShortcuts(store: Store<ReduxState>) {
  window.onkeydown = (event: KeyboardEvent) => {
    const { currentView } = store.getState().navigation;
    if (event.code === KeyCodes.A && event.ctrlKey && event.shiftKey && currentView === 'Project') {
      event.preventDefault();
      store.dispatch(Navigation.DispatchActions.setCurrentView.create('AssetManager'));
    } else if (event.code === KeyCodes.Esc) {
      if (store.getState().navigation.currentView === 'AssetManager') {
        event.preventDefault();
        store.dispatch(Navigation.DispatchActions.setCurrentView.create('Project'));
      }
    } else if (event.code === KeyCodes.S && currentView === 'Project') {
      store.dispatch(Project.Actions.saveProject.create());
    }
  };
}