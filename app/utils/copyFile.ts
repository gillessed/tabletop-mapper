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