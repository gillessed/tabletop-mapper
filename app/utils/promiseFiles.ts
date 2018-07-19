import { etn } from '../etn';
import { copyQueue } from './fileCopier';

export function copyFile(source: string, target: string): Promise<void> {
    return new Promise((resolve: () => void, reject: (reason: any) => void) => {
        copyQueue.enqueue({
            from: source,
            to: target,
            callback: (error?: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            },
        });
    });
}

export function writeFile(path: string, data: any) {
    return new Promise((resolve: () => void, reject: (reason: any) => void) => {
        etn.fs.writeFile(path, data, (err: any) => {
            if (!err) { resolve(); } else { reject(err); }
        });
    });
}

export function readDir(path: string) {
    return new Promise((resolve: (value: string[]) => void, reject: (reason: any) => void) => {
        etn.fs.readdir(path, (err: any, value: string[]) => {
            if (!err) { resolve(value); } else { reject(err); }
        });
    });
}

export function deleteFile(path: string) {
    return new Promise((resolve: () => void, reject: (reason: any) => void) => {
        etn.fs.unlink(path, (err: any) => {
            if (!err) { resolve(); } else { reject(err); }
        });
    });
}

export function deleteDirectory(path: string) {
    return new Promise((resolve: () => void, reject: (reason: any) => void) => {
        etn.fs.rmdir(path, (err: any) => {
            if (!err) { resolve(); } else { reject(err); }
        });
    });
}