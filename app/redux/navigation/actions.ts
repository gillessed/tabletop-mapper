import { createActionWrapper } from '../utils/typedAction';
import { SetRoutePayload } from './types';

export const setRoute = createActionWrapper<SetRoutePayload>('NAVIGATION - SET_ROUTE');
export const popRoute = createActionWrapper<string>('NAVIGATION - POP_ROUTE');
export const forwardRoute = createActionWrapper<string>('NAVIGATION - FORWARD_ROUTE');
export const toggleImportPanel = createActionWrapper<boolean | undefined>('NAVIGATION - SET_IMPORT_PANEL');