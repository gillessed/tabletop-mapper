import { BrowserWindow } from "electron";
import { registerIpcDialogHandlers } from "./ipcMainDialog";
import { registerIpcFileHandlers } from "./ipcMainFiles";
import { registerIpcFsHandlers } from "./ipcMainFs";
import { registerIpcPlatformHandlers } from "./ipcPlatform";

export function registerIpcHandlers(window: BrowserWindow) {
  registerIpcDialogHandlers(window);
  registerIpcFileHandlers();
  registerIpcFsHandlers();
  registerIpcPlatformHandlers();
}
