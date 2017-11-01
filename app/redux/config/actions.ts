import { createActionWrapper } from '../utils/typedAction';
import { Config } from './types';

export const setConfig = createActionWrapper<Config>('CONFIG - SET_CONFIG');