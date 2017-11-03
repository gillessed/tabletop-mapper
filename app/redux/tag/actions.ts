import { createActionWrapper } from '../utils/typedAction';
import { UpsertTagPayload, RemoveTagPayload } from './types';

export const saveTag = createActionWrapper<UpsertTagPayload>('TAG - SAVE TAG');
export const deleteTagAndSave = createActionWrapper<string>('TAG - DELETE TAG');