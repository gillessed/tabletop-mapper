import { Store } from "redux";
import { ReduxState } from "./redux/AppReducer";
import { Navigation } from "./redux/navigation/NavigationTypes";

enum KeyCodes {
  A = "KeyA",
  Esc = "Escape",
}

export function registerKeyboardShortcuts(store: Store<ReduxState>) {
  
  window.onkeydown = (event: KeyboardEvent) => {
    if (event.code === KeyCodes.A && event.ctrlKey && event.shiftKey && store.getState().navigation.currentView === 'Project') {
      event.preventDefault();
      store.dispatch(Navigation.DispatchActions.setCurrentView.create('AssetManager'));
    }
    if (event.code === KeyCodes.Esc) {
      if (store.getState().navigation.currentView === 'AssetManager') {
        event.preventDefault();
        store.dispatch(Navigation.DispatchActions.setCurrentView.create('Project'));
      }
    }
  };
}