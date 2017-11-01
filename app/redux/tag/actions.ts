import { createActionWrapper } from '../utils/typedAction';
import { UpsertTagPayload, RemoveTagPayload } from './types';

export const saveTag = createActionWrapper<UpsertTagPayload>('TAG - SAVE_TAG');
export const deleteTagAndSave = createActionWrapper<string>('TAG - DELETE_TAG');
export const removeTagAndSave = createActionWrapper<RemoveTagPayload>('TAG - REMOVE_TAG');