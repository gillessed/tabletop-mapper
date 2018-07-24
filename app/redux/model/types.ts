import { Map, Set } from 'immutable';
import { IconName } from '@blueprintjs/core';

export const ROOT_LAYER = 'root-layer';

export type Indexable<T> = {
    byId: { [key: string]: T};
    all: string[];
}

export interface ModelState {
    layers: Indexable<Layer>;
    assets: Indexable<Asset>;
    features: Indexable<Feature<any>>;
    selectedNode: string;
    expandedNodes: { [key: string]: boolean };
}

export interface ModelObject {
    id: string;
    name: string;
}

export interface Layer extends ModelObject {
    visible: boolean;
    children: string[];
    features: string[];
    parent: string | null;
}

export interface Asset extends String {
    path: string;
    type: 'svg' | 'jpg' | 'png';
}

export interface GeometryType {
    id: string;
    name: string;
    icon: IconName;
}

export const GeometryTypes: {[key: string]: GeometryType} = {
    point: {
        id: 'point',
        name: 'Point',
        icon: 'dot',
    },
    rectangle: {
        id: 'rectangle',
        name: 'Rectangle',
        icon: 'widget',
    }
};

export interface Feature<T extends Geometry> extends String {
    id: string;
    name: string;
    layer: string;
    type: string;
    asset?: Asset;
    geometry?: T;
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

//////////////
// Payloads //
//////////////

export interface SetFeatureTypePayload {
    featureId: string;
    type: string;
}
