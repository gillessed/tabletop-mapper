// Injection for all the electron dependencies from index.html
// Need to do it this way to have nice things (types)

import * as Electron from 'electron';
import * as _fs from 'fs';
import * as _path from 'path';
import * as _process from 'process';
import * as _util from 'util';

declare namespace _etn {
  let fs: typeof _fs;
  let util: typeof _util;
  let path: typeof _path;
  let process: typeof _process;
  let dialog: typeof Electron.dialog;
  let app: typeof Electron.app;
  let window: Electron.BrowserWindow;
  let exec: (command: string, callback: (err: any, stdout: string, stderr: string) => void) => void;
}

export function etn() {
  return _etn;
}
