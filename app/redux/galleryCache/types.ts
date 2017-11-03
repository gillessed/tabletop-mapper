import { JannaObject } from '../model/types';
import { Map } from 'immutable';

export type GalleryCacheState = Map<string, string[]>;

export interface SetGalleryCachePayload {
    gallery: string;
    contents: string[];
}

export interface ReadGalleryPayload {
    galleryId: string;
    photoset: number;
}

export function getCacheId(galleryId: string, photoset: number) {
    return JSON.stringify({ galleryId, photoset });
}