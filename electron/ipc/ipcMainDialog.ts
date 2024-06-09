import {
  BrowserWindow,
  dialog,
  MessageBoxOptions,
  OpenDialogOptions,
} from "electron";
import { IpcChannels } from "../../app/ipc/ipcChannels";
import { ipcMainHandle } from "./ipcMainHandler";

export function registerIpcDialogHandlers(window: BrowserWindow) {
  ipcMainHandle(
    IpcChannels.showOpenDialog,
    async (options: OpenDialogOptions) => {
      return dialog.showOpenDialog(window, options);
    }
  );

  ipcMainHandle(
    IpcChannels.showMessageBox,
    async (options: MessageBoxOptions) => {
      return dialog.showMessageBox(window, options);
    }
  );
}
