import { SearchState, SearchResult, SetSearchLoadingPayload, SetSearchErrorPayload, SetSearchResultsPayload } from './types';
import { Map } from 'immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { TypedAction } from '../utils/typedAction';
import { setSearchLoading, setSearchError, setSearchResults } from './actions';
import { JannaObject } from '../model/types';

const INITIAL_STATE: SearchState = Map();

const setLoadingReducer = (state: SearchState, action: TypedAction<SetSearchLoadingPayload>) => {
    return state.withMutations((mutable) => {
        const search = state.get(action.payload.query);
        mutable.set(action.payload.query, {
            query: action.payload.query,
            loading: action.payload.loading,
        });
    });
}

const setErrorReducer = (state: SearchState, action: TypedAction<SetSearchErrorPayload>) => {
    return state.withMutations((mutable) => {
        const search = state.get(action.payload.query);
        mutable.set(action.payload.query, {
            ...search,
            error: action.payload.error,
        });
    });
}

const setResultsReducer = (state: SearchState, action: TypedAction<SetSearchResultsPayload>) => {
    return state.withMutations((mutable) => {
        const search = state.get(action.payload.query);
        mutable.set(action.payload.query, {
            query: action.payload.query,
            searchResults: action.payload.searchResults,
        });
    });
}

export const searchReducer: Reducer<SearchState> = newTypedReducer<SearchState>()
    .handle(setSearchLoading.type, setLoadingReducer)
    .handle(setSearchError.type, setErrorReducer)
    .handle(setSearchResults.type, setResultsReducer)
    .handleDefault((state = INITIAL_STATE) => state)
    .build();