import { createActionWrapper } from '../utils/typedAction';
import { CreateGalleryPayload, JannaLoadPayload } from './types';
import { UpsertTagPayload, RemoveTagPayload } from '../tag/types';
import { AddTagsToGalleryPayload } from '../import/types';

export const setLoading = createActionWrapper<boolean>('JANNA - SET_LOADING');
export const setLocked = createActionWrapper<boolean>('JANNA - SET_LOCKED');
export const jannaLoad = createActionWrapper<JannaLoadPayload>('JANNA - LOAD');
export const createGallery = createActionWrapper<CreateGalleryPayload>('JANNA - CREATE_GALLERY');
export const createTag = createActionWrapper<UpsertTagPayload>('JANNA - CREATE_TAG');
export const deleteTag = createActionWrapper<string>('JANNA - DELETE_TAG');
export const removeTag = createActionWrapper<RemoveTagPayload>('JANNA - REMOVE_TAG');
export const addTagsToGallery = createActionWrapper<AddTagsToGalleryPayload>('JANNA - ADD_TAGS_TO_GALLERY');
export const deleteGallery = createActionWrapper<string>('JANNA - DELETE_GALLERY');