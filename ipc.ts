import * as fs from "fs";
import * as process from "process";
import * as Electron from "electron";
import * as util from "util";
import { GetIpcArg1, GetIpcArg2, GetIpcReturn, Ipc, OpenDialogResult, PlatformInfo } from './app/ipc/ipcCommands';

const app = Electron.app;
const dialog = Electron.dialog;

let requiresSave = false;

const IpcHandlers: { [key in keyof Ipc]: (arg1: GetIpcArg1<Ipc[key]>, arg2: GetIpcArg2<Ipc[key]>) => Promise<GetIpcReturn<Ipc[key]>> } = {
  Quit: async () => app.quit(),
  GetPlatformInfo,
  FilerExists: (path: string) => util.promisify(fs.exists)(path),
  FilerIsDirectory: (path: string) => util.promisify(fs.lstat)(path).then((stats) => stats.isDirectory()),
  FilerRmdir: (path: string) => fs.promises.rmdir(path),
  FilerUnlink: (path: string) => fs.promises.unlink(path),
  FilerMkdir: (path: string) => fs.promises.mkdir(path),
  FilerReaddir: (path: string) => fs.promises.readdir(path),
  FilerWriteFile: (path: string, data: string) => fs.promises.writeFile(path, data),
  FilerReadFile: (path: string) => fs.promises.readFile(path, 'utf-8'),
  SetRequiresSave: async (arg: boolean) => { requiresSave = arg; },
  CopyFile,
  DialogImport,
};

async function GetPlatformInfo(): Promise<PlatformInfo> {
  const separatorChar = process.platform === 'win32' ? '\\' : '/';
  const appDirName = 'tabletopMapper';
  const hostDataDirName = process.env.APPDATA ??
    (process.platform == 'darwin'
      ? (process.env.HOME + '/Library/Preferences')
      : (process.env.HOME + "/.local/share")
    );
  console.log('App dir:', hostDataDirName);
  const appDirPath = hostDataDirName + separatorChar + appDirName;

  return {
    os: process.platform,
    appDirPath,
    separatorChar,
  }
}

function CopyFile(source: string, target: string): Promise<void> {
  let done = false;
  return new Promise((resolve: () => void, reject: (reason: any) => void) => {
    let readStream = fs.createReadStream(source);
    readStream.once('error', (error: any) => {
      reject(error);
    });

    let writeStream = fs.createWriteStream(target);
    writeStream.once('error', (error: any) => {
      reject(error);
    });
    writeStream.once('close', () => {
      if (!done) {
        done = true;
        resolve();
      }
    });

    readStream.pipe(writeStream);
  });
}

async function DialogImport(imageExtensions: string[]): Promise<OpenDialogResult> {
  return dialog.showOpenDialog({
    message: 'Import assets',
    buttonLabel: 'Import',
    filters: [
      { name: 'Images', extensions: imageExtensions },
    ],
    properties: ['openDirectory', 'openFile', 'multiSelections'],
  }).then(({ canceled, filePaths }) => {
    return { canceled, filePaths };
  });
}

export function registerIpcHandlers(mainWindow: Electron.BrowserWindow) {
  for (const untypedKey of Object.keys(Ipc)) {
    const key = untypedKey as keyof Ipc;
    const name: string = Ipc[key].name;
    const handler: (...args: any[]) => any = IpcHandlers[key];
    console.log('Registering ipc handler for ', name);
    Electron.ipcMain.handle(name, (event, ...args: any) => {
      return handler(...args);
    });
  }

  mainWindow.on('close', (e) => {
    if (requiresSave) {
      e.preventDefault();
      Electron.dialog.showMessageBox(mainWindow, {
        type: 'warning',
        title: 'Warning',
        message: 'Your project has unsaved changes. Are you sure you want to close TabletopMapper?',
        buttons: ['Save', "Don't Save", 'Cancel']
      }).then((value) => {
        const { response } = value;
        if (response === 0) {
          mainWindow.webContents.send('save-and-quit');
        } else if (response === 1) {
          requiresSave = false;
          Electron.app.quit();
        }
      });
    }
  });
}
