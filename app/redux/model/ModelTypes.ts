import { IconName } from "@blueprintjs/core";
import { IconNames } from '@blueprintjs/icons';
import { Coordinate } from '../../math/Vector';
import { ReduxState } from "../AppReducer";
import { Grid } from "../grid/GridTypes";
import { Indexable } from "../utils/indexable";
import { createActionWrapper } from "../utils/typedAction";

export namespace Model {
  export const RootLayerId = 'root-layer';
  export namespace Types {

    export interface State {
      layers: Indexable<Layer>;
      assets: Indexable<Asset>;
      features: Indexable<Feature>;
      styles: Indexable<Style>;
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

    export function isLayer(object: Object): object is Layer {
      return !!(object as Layer).features;
    }

    export interface Asset {
      path: string;
      type: 'svg' | 'jpg' | 'png';
      gridDimensions?: { x: number, y: number};
    }

    export interface Style extends Object {}

    export interface GeometryInfo {
      id: GeometryType;
      name: string;
      icon: IconName;
      mouseMode: Grid.Types.MouseMode;
    }

    export type GeometryType = 'point' | 'rectangle' | 'path' | 'circle';

    interface GeometryTypeMap {
      point: GeometryInfo;
      rectangle: GeometryInfo;
      path: GeometryInfo;
      circle: GeometryInfo;
    }

    export const Geometries: GeometryTypeMap & { [key: string]: GeometryInfo } = {
      point: {
        id: 'point',
        name: 'Point',
        icon: IconNames.DOT,
        mouseMode: Grid.Types.MouseMode.DrawPoint,
      },
      rectangle: {
        id: 'rectangle',
        name: 'Rectangle',
        icon: IconNames.WIDGET,
        mouseMode: Grid.Types.MouseMode.DrawRectangle,
      },
      path: {
        id: 'path',
        name: 'Path',
        icon: IconNames.LAYOUT_LINEAR,
        mouseMode: Grid.Types.MouseMode.DrawPath,
      },
      circle: {
        id: 'circle',
        name: 'Circle',
        icon: IconNames.CIRCLE,
        mouseMode: Grid.Types.MouseMode.DrawCircle,
      }
    };

    export interface Feature<T extends Geometry = Geometry> extends Object {
      layerId: string;
      geometry: T;
    }

    export function isFeature(object: Object): object is Feature {
      return !!(object as Feature).layerId;
    }

    export interface Geometry {
      type: GeometryType;
      snapToGrid?: boolean;
    }

    export interface Point extends Geometry {
      type: 'point';
      p: Coordinate;
    }

    export interface Rectangle extends Geometry {
      type: 'rectangle';
      p1: Coordinate;
      p2: Coordinate;
    }

    export interface Circle extends Geometry {
      type: 'circle';
      p: Coordinate;
      r: number;
      stops?: number[];
    }

    export interface Path extends Geometry {
      type: 'path';
      path: Coordinate[];
      closed?: boolean;
    }
  }

  export namespace Payloads {
    export interface CreateLayer {
      parentId: string;
      layerId: string;
    }
  }

  export const DispatchActions = {
    createLayer: createActionWrapper<Payloads.CreateLayer>('model::createLayer'),
    createFeature: createActionWrapper<Types.Feature>('model::createFeature'),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.model;
    export const getLayers = (state: ReduxState) => state.model.layers;
  }
}
