import { createActionWrapper } from '../utils/typedAction';
import { JannaObject } from '../model/types';
import { SetGalleryCachePayload, ReadGalleryPayload } from './types';

export const setGalleryCache = createActionWrapper<SetGalleryCachePayload>('GALLERY_CACHE - SET');
export const readGallery = createActionWrapper<ReadGalleryPayload>('GALLERY_CACHE - REQUEST');