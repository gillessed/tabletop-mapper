import {
  SaveDialogOptions,
  SaveDialogReturnValue,
  type MessageBoxOptions,
  type MessageBoxReturnValue,
  type OpenDialogOptions,
  type OpenDialogReturnValue,
} from "electron";
import { IpcChannel } from "./ipcChannel";
import { IpcError } from "./ipcError";
import { ObjectEncodingOptions } from "fs";

export interface IpcResizeImageArgs {
  filename: string;
  minWidth: number;
  minHeight: number;
}
export interface IpcResizeImageToFileArgs extends IpcResizeImageArgs {
  destination: string;
}

export interface IpcCopyFileArgs {
  filename: string;
  destination: string;
}

export interface IpcFsReadFileArgs {
  path: string;
  options?: ObjectEncodingOptions;
}

export interface IpcFsWriteFileArgs {
  path: string;
  data: string;
  options?: ObjectEncodingOptions;
}

export interface IpcFsGetHashArgs {
  path: string;
  hashName?: "sha1" | "sha256" | "md5";
}

export interface IpcPlatformInfo {
  separatorChar: string;
  appDirPath: string;
  homeDir: string;
  os:
    | "aix"
    | "android"
    | "darwin"
    | "freebsd"
    | "haiku"
    | "linux"
    | "openbsd"
    | "sunos"
    | "win32"
    | "cygwin"
    | "netbsd";
}

export const IpcChannels = {
  platformInfo: { key: "platform-info" } as IpcChannel<void, IpcPlatformInfo>,
  reload: { key: "reload-event" } as IpcChannel<string, void>,
  showMessageBox: { key: "show-message-box" } as IpcChannel<
    MessageBoxOptions,
    MessageBoxReturnValue
  >,
  showOpenDialog: { key: "show-open-dialog" } as IpcChannel<
    OpenDialogOptions,
    OpenDialogReturnValue
  >,
  showSaveDialog: { key: "show-save-dialog" } as IpcChannel<
    SaveDialogOptions,
    SaveDialogReturnValue
  >,
  copyFile: { key: "copy-file" } as IpcChannel<IpcCopyFileArgs, void>,
  exec: { key: "exec" } as IpcChannel<string, void>,
  quit: { key: "quit" } as IpcChannel<void, void>,

  //fs
  fsExists: { key: "fs-exists" } as IpcChannel<string, boolean>,
  fsIsDir: { key: "fs-isDir" } as IpcChannel<string, boolean>,
  fsReadDir: { key: "fs-readdir" } as IpcChannel<string, string[]>,
  fsMkdir: { key: "fs-mkdir" } as IpcChannel<string, void>,
  fsRmdir: { key: "fs-rmdir" } as IpcChannel<string, void>,
  fsUnlink: { key: "fs-unlink" } as IpcChannel<string, void | IpcError>,
  fsReadFile: { key: "fs-read-file" } as IpcChannel<IpcFsReadFileArgs, string>,
  fsWriteFile: { key: "fs-write-file" } as IpcChannel<IpcFsWriteFileArgs, void>,
  fsGetHash: { key: "fs-get-hash" } as IpcChannel<IpcFsGetHashArgs, string>,
};

export type Api<T> = {
  [key in keyof T]: T[key] extends IpcChannel<infer Args, infer Result>
    ? (args: Args) => Promise<Result>
    : never;
};
