export interface PlatformInfo {
  os: string;
  separatorChar: string;
  appDirPath: string;
}

export interface OpenDialogResult {
  canceled: boolean;
  filePaths: string[];
}

export interface IpcCommand<Result, Arg1, Arg2> {
  name: string;
}

export type ShortcutCommand =
  | 'open-asset-manager'
  | 'save-map'
  | 'escape';

export type IpcCommand0<Result> = IpcCommand<Result, void, void>;
export type IpcCommand1<Result, Arg1> = IpcCommand<Result, Arg1, void>;
export type IpcCommand2<Result, Arg1, Arg2> = IpcCommand<Result, Arg1, Arg2>;

export type GetIpcArg1<T> = T extends IpcCommand<any, infer Arg, any> ? Arg : number;
export type GetIpcArg2<T> = T extends IpcCommand<any, any, infer Arg> ? Arg : unknown;
export type GetIpcReturn<T> = T extends IpcCommand<infer Return, any, any> ? Return : unknown;

const Quit: IpcCommand0<void> = { name: 'quit' };
const GetPlatformInfo: IpcCommand0<PlatformInfo> = { name: 'platform-info' };
const FilerExists: IpcCommand1<boolean, string> = { name: 'filer-exists' };
const FilerIsDirectory: IpcCommand1<boolean, string> = { name: 'filer-is-directory' };
const FilerRmdir: IpcCommand1<void, string> = { name: 'filer-rmdir' };
const FilerUnlink: IpcCommand1<void, string> = { name: 'filer-unlink' };
const FilerMkdir: IpcCommand1<void, string> = { name: 'filer-mkdir' };
const FilerReaddir: IpcCommand1<string[], string> = { name: 'filer-read-dir' };
const FilerWriteFile: IpcCommand2<void, string, string> = { name: 'filer-write-file' };
const FilerReadFile: IpcCommand1<string, string> = { name: 'filer-read-file' };
const CopyFile: IpcCommand2<void, string, string> = { name: 'copy-file' };
const DialogImport: IpcCommand1<OpenDialogResult, string[]> = { name: 'dialog-import' };
const SetRequiresSave: IpcCommand1<void, boolean> = { name: 'set-requires-save' };

export const Ipc = {
  Quit,
  GetPlatformInfo,
  FilerExists,
  FilerIsDirectory,
  FilerRmdir,
  FilerUnlink,
  FilerMkdir,
  FilerReaddir,
  FilerWriteFile,
  FilerReadFile,
  CopyFile,
  DialogImport,
  SetRequiresSave,
}

export type Ipc = typeof Ipc;
