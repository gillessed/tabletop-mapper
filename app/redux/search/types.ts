import { JannaObject } from '../model/types';
import { Map } from 'immutable';

export type SearchState = Map<string, Search>;

export interface Search {
    query: string;
    searchResults?: SearchResult[];
    loading?: boolean;
    error?: Error;
}

export interface SearchResult {
    objectId: string;
    matchingTags: string[];
}

export interface SetSearchLoadingPayload {
    query: string;
    loading: boolean;
}

export interface SetSearchErrorPayload {
    query: string;
    error: Error;
}

export interface SetSearchResultsPayload {
    query: string;
    searchResults: SearchResult[];
}