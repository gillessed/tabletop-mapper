// Injection for all the electron dependencies from index.html
// Need to do it this way to have nice things (types)

import * as Electron from 'electron';
import * as _fs from 'fs';
import * as _path from 'path';

declare namespace _etn {
    let fs: typeof _fs;
    let path: typeof _path;
    let dialog: typeof Electron.dialog;
    let app: typeof Electron.app;
    let window: Electron.BrowserWindow;
}

export const etn = _etn;