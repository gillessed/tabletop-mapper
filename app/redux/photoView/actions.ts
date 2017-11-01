import { createActionWrapper } from '../utils/typedAction';
import { JannaObject } from '../model/types';
import { OpenPhotoViewPayload } from './types';

export const openPhotoView = createActionWrapper<OpenPhotoViewPayload>('PHOTO_VIEW - OPEN');
export const closePhotoView = createActionWrapper<void>('PHOTO_VIEW - CLOSE');
export const photoViewNext = createActionWrapper<void>('PHOTO_VIEW - NEXT');
export const photoViewPrevious = createActionWrapper<void>('PHOTO_VIEW - PREVIOUS');