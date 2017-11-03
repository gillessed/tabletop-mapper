import { Map } from 'immutable';
import { importPhotoset } from './actions';

export interface RunningImport {
    images: string[];
    id: string;
    paused: boolean;
    progress: number;
    completed: boolean;
}

export interface ImportState {
    runningImports: string[];
    importMap: Map<string, RunningImport>;
}

export type ImportGalleriesPayload = ImportGalleryPayload[];

export interface ImportGalleryPayload {
    id: string;
    folder: string;
}

export interface ImportPhotosetPayload {
    galleryId: string;
    folder: string;
}

export interface SetImportProgressPayload {
    id: string;
    progress: number;
}

export interface AddTagsToGalleryPayload {
    galleryId: string;
    tags: string[];
}