import * as path from 'path';
import * as fs from 'fs';
import { JannaSerializable, TAG_TYPE_TAG } from '../app/redux/model/types';
import { collectionToMap } from '../app/utils/map';
import { Map, Set } from 'immutable';
import { copyFile } from '../app/utils/promiseFiles';
import { generateRandomString } from '../app/utils/randomId';

const dbFile = 'E:\\janna\\janna-db.json';
const backup = 'E:\\janna\\janna-db.bak.json';

if (fs.existsSync(backup)) {
    fs.unlinkSync(backup);
}
copyFile(dbFile, backup);

const rawDbContents = fs.readFileSync(dbFile, 'utf-8');
const jannaDb = JSON.parse(rawDbContents) as JannaSerializable;

const newTagId1 = generateRandomString();
const newTagId2 = generateRandomString();

jannaDb.tags.push({
    id: newTagId1,
    value: 'Western',
    tagType: TAG_TYPE_TAG,
});

jannaDb.tags.push({
    id: newTagId1,
    value: 'Live',
    tagType: TAG_TYPE_TAG,
});

jannaDb.galleries.forEach((gallery) => {
    gallery.tags.push(newTagId1, newTagId2);
});

fs.writeFileSync(dbFile, JSON.stringify(jannaDb, null, 2), 'utf-8');


function copyFile(source: string, target: string): Promise<void> {
    let done = false;
    return new Promise((resolve: () => void, reject: (reason: any) => void) => {
        let readStream = fs.createReadStream(source);
        readStream.on('error', (error: any) => {
            reject(error);
        });

        let writeStream = fs.createWriteStream(target);
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