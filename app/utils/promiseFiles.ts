import { etn } from '../etn';

export function copyFile(source: string, target: string): Promise<void> {
    let done = false;
    return new Promise((resolve: () => void, reject: (reason: any) => void) => {
        let readStream = etn.fs.createReadStream(source);
        readStream.on('error', (error: any) => {
            reject(error);
        });

        let writeStream = etn.fs.createWriteStream(target);
        writeStream.on('error', (error: any) => {
            reject(error);
        });
        writeStream.on('close', () => {
            if (!done) {
                done = true;
                resolve();
            }
        });

        readStream.pipe(writeStream);
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