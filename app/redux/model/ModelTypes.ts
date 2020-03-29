import { IconName } from "@blueprintjs/core";
import { ReduxState } from "../RootReducer";
import { Indexable } from "../utils/indexable";
import { createActionWrapper } from "../utils/typedAction";

export namespace Model {
  export const ROOT_LAYER = 'root-layer';
  export namespace Types {

    export interface State {
      layers: Indexable<Layer>;
      assets: Indexable<Asset>;
      features: Indexable<Feature<any>>;
    }

    export interface Object {
      id: string;
      name: string;
    }

    export interface Layer extends Object {
      visible: boolean;
      children: string[];
      features: string[];
      parent: string | null;
    }

    export interface Asset {
      path: string;
      type: 'svg' | 'jpg' | 'png';
    }

    export interface Style extends Object { }

    export interface GeometryType {
      id: string;
      name: string;
      icon: IconName;
    }

    interface GeometryTypeMap {
      point: GeometryType;
      rectangle: GeometryType;
      polyline: GeometryType;
      circle: GeometryType;
    }

    export const Geometries: GeometryTypeMap & { [key: string]: GeometryType } = {
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
      circle: {
        id: 'circle',
        name: 'Circle',
        icon: 'circle'
      }
    };

    export interface Feature<T extends Geometry> extends Object {
      layer: string;
      type: string;
      geometry?: T;
      snapToGrid?: boolean;
    }

    export type Geometry = Point | Rectangle | Polygon;

    export interface Point {
      x: number;
      y: number;
    }

    export interface Rectangle {
      top: number;
      left: number;
      bottom: number;
      right: number;
    }

    export interface Polygon {
      top: number;
      left: number;
      bottom: number;
      right: number;
    }
  }

  export namespace Payloads {
    export interface CreateLayer {
      parentId: string;
      layerId: string;
    }

    export interface CreateFeature {
      layerId: string;
      featureId: string;
    }

    export interface SetFeatureType {
      featureId: string;
      type: string;
    }
  }

  export const DispatchActions = {
    createLayer: createActionWrapper<Payloads.CreateLayer>('model::createLayer'),
    createFeature: createActionWrapper<Payloads.CreateFeature>('model::createFeature'),
    setFeatureType: createActionWrapper<Payloads.SetFeatureType>('model::changeFeatureType'),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.model;
    export const getLayers = (state: ReduxState) => state.model.layers;
  }
}