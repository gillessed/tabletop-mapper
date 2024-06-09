import { ipcMain, IpcMainInvokeEvent } from "electron";
import { IpcChannel } from "../../app/ipc/ipcChannel";
import { IpcError } from "../../app/ipc/ipcError";

export function ipcMainHandle<Args, Result>(
  ipcChannel: IpcChannel<Args, Result>,
  handler: (args: Args, event: IpcMainInvokeEvent) => Promise<Result | IpcError>
) {
  ipcMain.handle(ipcChannel.key, (event, args: Args) => {
    return handler(args, event);
  });
}
