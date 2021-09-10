const ipcRenderer = (window as any).ipcRenderer;
import { Store } from "redux";
import { ReduxState } from "../redux/AppReducer";
import { Project } from "../redux/project/ProjectTypes";
import { GetIpcArg1, GetIpcArg2, GetIpcReturn, IpcCommand, IpcCommand0, IpcCommand1, IpcCommand2 } from "./ipcCommands";

export function ipcInvoke<T extends IpcCommand0<any>>(command: T): Promise<GetIpcReturn<T>>;
export function ipcInvoke<T extends IpcCommand1<any, any>>(command: T, arg1: GetIpcArg1<T>): Promise<GetIpcReturn<T>>;
export function ipcInvoke<T extends IpcCommand2<any, any, any>>(command: T, arg1: GetIpcArg1<T>, arg2: GetIpcArg2<T>): Promise<GetIpcReturn<T>>;
export function ipcInvoke<T extends IpcCommand<any, any, any>>(command: T, ...args: any[]): Promise<GetIpcReturn<T>> {
  return ipcRenderer.invoke(command.name, ...args);
}

export function registerClientIpcHandlers(store: Store<ReduxState>) {
  ipcRenderer.on('save-and-quit', () => {
    store.dispatch(Project.Actions.saveAndQuit.create());
  });
}