import { Map, Set } from 'immutable';

type Indexable<T> = {
    byId: { [key: string]: T};
    all: T[];
}

export interface ModelState {
    layers: Indexable<Layer>;
    assets: Indexable<Asset>;
    features: Indexable<Feature<any>>;
}

export interface Layer {
    id: string;
    name: string;
    visible: boolean;
    children: string[];
    backgroundColor: string;
}

export interface Asset {
    id: string;
    path: string;
    name: string;
    type: 'svg' | 'jpg' | 'png';
}

export interface Feature<T extends Geometry> {
    id: string;
    type: 'point' | 'rectangle';
    asset?: Asset;
    geometry: T;
}

export interface Geometry {}

export interface Point extends Geometry {
    x: number;
    y: number;
    grid: boolean;
}

export interface Rectangle extends Geometry {
    top: number;
    left: number;
    bottom: number;
    right: number;
    grid: boolean;
}
