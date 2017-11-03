import { createActionWrapper } from '../utils/typedAction';
import { RunningImport, SetImportProgressPayload, AddTagsToGalleryPayload, ImportGalleriesPayload, ImportPhotosetPayload } from './types';
import { RenamePhotosetPayload, DeletePhotosetPayload } from '../model/types';

export const importGalleries = createActionWrapper<ImportGalleriesPayload>('IMPORT - IMPORT_GALLERIES');
export const deleteGalleryAndSave = createActionWrapper<string>('IMPORT - DELETE_GALLERY');
export const importPhotoset = createActionWrapper<ImportPhotosetPayload>('IMPORT - IMPORT PHOTOSET');
export const createImport = createActionWrapper<RunningImport>('IMPORT - CREATE_IMPORT');
export const setImportProgress = createActionWrapper<SetImportProgressPayload>('IMPORT - SET_PROGRESS');
export const pauseImport = createActionWrapper<string>('IMPORT - PAUSE_IMPORT');
export const resumeImport = createActionWrapper<string>('IMPORT - RESUME_IMPORT');
export const deleteImport = createActionWrapper<string>('IMPORT - DELETE_IMPORT');
export const addTagsToGalleryAndSave = createActionWrapper<AddTagsToGalleryPayload>('IMPORT - ADD_TAGS_TO_GALLERY');