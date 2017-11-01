import { createActionWrapper } from '../utils/typedAction';
import { JannaObject } from '../model/types';
import { SetGalleryCachePayload } from './types';

export const setGalleryCache = createActionWrapper<SetGalleryCachePayload>('GALLERY_CACHE - SET');
export const readGallery = createActionWrapper<string>('GALLERY_CACHE - REQUEST');