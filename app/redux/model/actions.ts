import { createActionWrapper } from '../utils/typedAction';
import { CreateGalleryPayload, JannaLoadPayload, CreatePhotosetPayload, RenamePhotosetPayload, DeletePhotosetPayload } from './types';
import { UpsertTagPayload, RemoveTagPayload } from '../tag/types';
import { AddTagsToGalleryPayload } from '../import/types';

export const setLoading = createActionWrapper<boolean>('JANNA - SET LOADING');
export const saveModel = createActionWrapper<void>('JANNA - SAVE MODEL');
export const setLocked = createActionWrapper<boolean>('JANNA - SET LOCKED');
export const jannaLoad = createActionWrapper<JannaLoadPayload>('JANNA - LOAD');
export const createGallery = createActionWrapper<CreateGalleryPayload>('JANNA - CREATE GALLERY');
export const createPhotoset = createActionWrapper<CreatePhotosetPayload>('JANNA - CREATE PHOTOSET');
export const renamePhotoset = createActionWrapper<RenamePhotosetPayload>('JANNA - RENAME PHOTOSET');
export const deletePhotoset = createActionWrapper<DeletePhotosetPayload>('JANNA - DELETE PHOTOSET');
export const createTag = createActionWrapper<UpsertTagPayload>('JANNA - CREATE TAG');
export const deleteTag = createActionWrapper<string>('JANNA - DELETE TAG');
export const removeTag = createActionWrapper<RemoveTagPayload>('JANNA - REMOVE TAG');
export const addTagsToGallery = createActionWrapper<AddTagsToGalleryPayload>('JANNA - ADD TAGS TO GALLERY');
export const deleteGallery = createActionWrapper<string>('JANNA - DELETE GALLERY');