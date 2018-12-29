import { Map, Set } from 'immutable';
import { IconName } from '@blueprintjs/core';
import { Transform, Vector } from '../../math/transform';

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
    grid: GridState;
}

export enum MouseMode {
    NONE,
    DRAG,
}

export interface GridState {
    transform: Transform;
    mouseMode: MouseMode;
    mousePosition?: Vector;
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

export interface Asset {
    path: string;
    type: 'svg' | 'jpg' | 'png';
}

export interface Style {

}

export interface GeometryType {
    id: string;
    name: string;
    icon: IconName;
}

interface GeometryTypeMap {
    point: GeometryType;
    rectangle: GeometryType;
    polyline: GeometryType;
}

export const GeometryTypes: GeometryTypeMap & {[key: string]: GeometryType} = {
    point: {
        id: 'point',
        name: 'Point',
        icon: 'dot',
    },
    rectangle: {
        id: 'rectangle',
        name: 'Rectangle',
        icon: 'widget',
    },
    polyline: {
        id: 'polyline',
        name: 'Polyline',
        icon: 'trending-up',
    },
};

export interface Feature<T extends Geometry> extends ModelObject {
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
