import { Map, Set } from 'immutable';

///////////////////
// Janna Objects //
///////////////////

export const TAG_TYPE_TAG = 'Tag';
export const TAG_TYPE_MODEL = 'Model';
export const TAG_TYPE_SOURCE = 'Source';

export const TagTypes = [
    TAG_TYPE_MODEL,
    TAG_TYPE_SOURCE,
    TAG_TYPE_TAG,
];

export const TagTypeDisplays: { [key: string]: string } = {
    [TAG_TYPE_TAG]: 'Tags',
    [TAG_TYPE_MODEL]: 'Models',
    [TAG_TYPE_SOURCE]: 'Sources',
}

export interface JannaState {
    loading: boolean;
    locked: boolean;
    tags: Map<string, JannaTag>;
    tagToGalleryIndex: Map<string, Set<string>>;
    galleries: Map<string, JannaGallery>;
}

export interface JannaSerializable {
    tags: JannaTag[];
    galleries: JannaGallery[];
}

export interface JannaObject {
    id: string;
    value: string;
    displayValue?: string;
}

export interface JannaTag extends JannaObject {
    tagType: string;
    cover?: string;
}

export interface JannaGallery extends JannaObject {
    cover?: number;
    tags: string[];
    imageCount: number;
}

export function isTag(object: JannaObject): object is JannaTag {
    return !!(object as JannaTag).tagType;
}

export function isGallery(object: JannaObject): object is JannaGallery {
    return !!(object as JannaGallery).tags;
}

//////////////
// Payloads //
//////////////

export interface CreateGalleryPayload {
    id: string;
    imageCount: number;
}

export interface JannaLoadPayload {
    tags: Map<string, JannaTag>;
    galleries: Map<string, JannaGallery>;
    tagToGalleryIndex: Map<string, Set<string>>;
}