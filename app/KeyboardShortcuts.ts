import { Store } from "redux";
import { ReduxState } from "./redux/AppReducer";
import {
  copySelectionWorker,
  pasteClipboardWorker,
} from "./redux/clipboard/ClipboardWorkers";
import { ModelRedo, ModelUndo } from "./redux/model/ModelReducers";
import { Model } from "./redux/model/ModelTypes";
import { Navigation } from "./redux/navigation/NavigationTypes";
import { Project } from "./redux/project/ProjectTypes";
import { canRedo, canUndo } from "./redux/undo/UndoState";
import { IpcPlatformInfo } from "./ipc/ipcChannels";

enum KeyCodes {
  A = "KeyA",
  C = "KeyC",
  E = "KeyE",
  M = "KeyM",
  O = "KeyO",
  S = "KeyS",
  V = "KeyV",
  Y = "KeyY",
  Z = "KeyZ",
  Esc = "Escape",
}

export type MetaKey = "Ctrl" | "Cmd";

export let metaKey: MetaKey = "Ctrl";

export function setMetakey(newKey: MetaKey) {
  metaKey = newKey;
}

export function registerKeyboardShortcuts(
  store: Store<ReduxState>,
  platformInfo: IpcPlatformInfo
) {
  const { os } = platformInfo;
  const isMeta =
    os === "darwin"
      ? (event: KeyboardEvent) => event.metaKey
      : (event: KeyboardEvent) => event.ctrlKey;
  if (os === "darwin") {
    setMetakey("Cmd");
  }
  window.onkeydown = (event: KeyboardEvent) => {
    const currentView = Navigation.Selectors.getCurrentView(store.getState());
    const model = Model.Selectors.getUndoable(store.getState());
    if (currentView === "AssetManager") {
      if (event.code === KeyCodes.Esc) {
        event.preventDefault();
        store.dispatch(
          Navigation.DispatchActions.setCurrentView.create("Project")
        );
        return;
      }
    }
    if (currentView === "Project") {
      if (event.code === KeyCodes.Esc) {
        event.preventDefault();
        store.dispatch(Navigation.Actions.closeDialogs.create());
        return;
      }
      if (isMeta(event)) {
        if (event.code === KeyCodes.O) {
          store.dispatch(Navigation.Actions.setProjectDialogOpen.create(true));
          return;
        }
        if (event.code === KeyCodes.S) {
          store.dispatch(Project.Actions.saveProject.create());
          return;
        }
        if (event.code === KeyCodes.M) {
          event.preventDefault();
          store.dispatch(
            Navigation.DispatchActions.setCurrentView.create("AssetManager")
          );
          return;
        }
        if (event.code === KeyCodes.Z && canUndo(model)) {
          store.dispatch(ModelUndo.create());
          return;
        }
        if (event.code === KeyCodes.Y && canRedo(model)) {
          store.dispatch(ModelRedo.create());
          return;
        }
        if (event.code === KeyCodes.C) {
          copySelectionWorker(store);
          return;
        }
        if (event.code === KeyCodes.V) {
          pasteClipboardWorker(store);
          return;
        }
        if (event.code === KeyCodes.E) {
          store.dispatch(Navigation.Actions.setExportDialogOpen.create(true));
          return;
        }
      }
    }
  };
}
