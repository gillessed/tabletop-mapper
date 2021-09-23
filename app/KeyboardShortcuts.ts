import { Store } from "redux";
import { ReduxState } from "./redux/AppReducer";
import { copySelectionWorker, pasteClipboardWorker } from "./redux/clipboard/ClipboardWorkers";
import { ModelRedo, ModelUndo } from "./redux/model/ModelReducers";
import { Model } from "./redux/model/ModelTypes";
import { Navigation } from "./redux/navigation/NavigationTypes";
import { Project } from "./redux/project/ProjectTypes";
import { canRedo, canUndo } from "./redux/undo/UndoState";

enum KeyCodes {
  A = "KeyA",
  C = "KeyC",
  S = "KeyS",
  V = "KeyV",
  Y = "KeyY",
  Z = "KeyZ",
  Esc = "Escape",
}

export function registerKeyboardShortcuts(store: Store<ReduxState>) {
  window.onkeydown = (event: KeyboardEvent) => {
    const currentView = Navigation.Selectors.getCurrentView(store.getState());
    const model = Model.Selectors.getUndoable(store.getState());
    if (currentView === 'AssetManager') {
      if (event.code === KeyCodes.Esc) {
        event.preventDefault();
        store.dispatch(Navigation.DispatchActions.setCurrentView.create('Project'));
        return;
      }
    }
    if (currentView === 'Project') {
      if (event.code === KeyCodes.S && event.ctrlKey) {
        store.dispatch(Project.Actions.saveProject.create());
        return;
      }
      if (event.code === KeyCodes.A && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        store.dispatch(Navigation.DispatchActions.setCurrentView.create('AssetManager'));
        return;
      }
      if (event.code === KeyCodes.Z && event.ctrlKey && canUndo(model)) {
        store.dispatch(ModelUndo.create());
        return;
      }
      if (event.code === KeyCodes.Y && event.ctrlKey && canRedo(model)) {
        store.dispatch(ModelRedo.create());
        return;
      }
      if (event.code === KeyCodes.C && event.ctrlKey) {
        copySelectionWorker(store);
        return;
      }
      if (event.code === KeyCodes.V && event.ctrlKey) {
        pasteClipboardWorker(store);
        return;
      }
    }
  };
}