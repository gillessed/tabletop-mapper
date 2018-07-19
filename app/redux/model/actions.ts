import { createActionWrapper } from '../utils/typedAction';

export const foo = createActionWrapper<string>('MODEL - SET LOADING');