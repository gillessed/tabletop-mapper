import { JannaObject } from '../model/types';
import { Map } from 'immutable';

export type GalleryCacheState = Map<string, string[]>;

export interface SetGalleryCachePayload {
    gallery: string;
    contents: string[];
}