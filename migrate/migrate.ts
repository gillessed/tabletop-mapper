import * as path from 'path';
import * as fs from 'fs';
import { JannaSerializable } from '../app/redux/model/types';
import { collectionToMap } from '../app/utils/map';
import { Map, Set } from 'immutable';

const dbFile = 'E:\\janna\\janna-db.json';

const rawDbContents = fs.readFileSync(dbFile, 'utf-8');
const jannaDb = JSON.parse(rawDbContents) as JannaSerializable;
const tagMap = collectionToMap(jannaDb.tags, (tag) => tag.id);
const galleryMap = collectionToMap(jannaDb.galleries, (gallery) => gallery.id);
const tagToGalleryMap = Map<string, string[]>().withMutations((mutable) => {
    jannaDb.tags.forEach((tag) => mutable.set(tag.id, []));
});

for (const gallery of jannaDb.galleries) {
    for (const tagId of gallery.tags) {
        if (!tagToGalleryMap.get(tagId)) {
            console.error('TagId is not in map: ' + tagId);
        }
        tagToGalleryMap.get(tagId).push(gallery.id);                
    }
}

const tagToGalleryIndex = Map<string, Set<string>>().withMutations((mutable) => {
    tagToGalleryMap.forEach((value: string[], key: string) => {
        mutable.set(key, Set(value));
    });
});

const janna = {
    tags: tagMap,
    galleries: galleryMap,
    tagToGalleryIndex: tagToGalleryIndex,
};

const newGalleries = janna.galleries.map(() => {

});

console.log(JSON.stringify(janna.galleries, null, 4));