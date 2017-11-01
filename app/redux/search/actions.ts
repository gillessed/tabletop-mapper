import { createActionWrapper } from '../utils/typedAction';
import { JannaObject } from '../model/types';
import { SearchResult, SetSearchLoadingPayload, SetSearchResultsPayload, SetSearchErrorPayload } from './types';

export const performSearch = createActionWrapper<string>('SEARCH - PERFORM');
export const setSearchLoading = createActionWrapper<SetSearchLoadingPayload>('SEARCH - SET_LOADING');
export const setSearchResults = createActionWrapper<SetSearchResultsPayload>('SEARCH - SET_RESULTS');
export const setSearchError = createActionWrapper<SetSearchErrorPayload>('SEARCH - ERROR');