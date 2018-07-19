// Injection for all the electron dependencies from index.html
// Need to do it this way to have nice things (types)

import * as Electron from 'electron';
import * as _fs from 'fs';
import * as _path from 'path';
import * as _process from 'process';
import { runtime } from './runtime';

declare namespace _etn {
    let fs: typeof _fs;
    let path: typeof _path;
    let process: typeof _process;
    let dialog: typeof Electron.dialog;
    let app: typeof Electron.app;
    let window: Electron.BrowserWindow;
    let exec: (command: string, callback: (err: any, stdout: string, stderr: string) => void) => void;
}

let wooh;

if (runtime.migrating) {
    wooh = {
        fs: require('fs') as any,
        process: require('process') as any,
        path: require('path') as any,
        exec: require('child_process').exec as (command: string, callback: (err: any, stdout: string, stderr: string) => void) => void,
    };
} else {
    wooh = _etn;
}

export const etn = wooh as typeof _etn;