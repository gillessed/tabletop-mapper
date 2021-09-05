import { IconName } from "@blueprintjs/core";
import { IconNames } from '@blueprintjs/icons';
import { Coordinate } from '../../math/Vector';
import { ReduxState } from "../AppReducer";
import { Grid } from "../grid/GridTypes";
import { Indexable, Identifiable } from "../utils/indexable";
import { createActionWrapper } from "../utils/typedAction";
import { visitFeature } from "./ModelVisitors";

export namespace Model {
  export const RootLayerId = 'root-layer';
  export namespace Types {

    export interface State {
      layers: Indexable<Layer>;
      features: Indexable<Feature>;
    }

    export interface Layer extends Identifiable {
      visible: boolean;
      children: string[];
      features: string[];
      parent: string | null;
    }

    export interface GeometryInfo {
      id: GeometryType;
      name: string;
      icon: IconName;
      mouseMode: Grid.Types.MouseMode;
    }

    export type GeometryType = 'rectangle' | 'path';

    interface GeometryTypeMap {
      rectangle: GeometryInfo;
      path: GeometryInfo;
    }

    export const Geometries: GeometryTypeMap & { [key: string]: GeometryInfo } = {
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
    };

    export function isRectangle(geometry: Model.Types.Geometry): geometry is Model.Types.Rectangle {
      return geometry.type === 'rectangle';
    }

    export function isPath(geometry: Model.Types.Geometry): geometry is Model.Types.Path {
      return geometry.type === 'path';
    }

    export type Feature = BasicAssetFeature | PatternFeature;

    export interface BasicAssetFeature extends Identifiable {
      type: 'basic-asset';
      layerId: string;
      geometry: Rectangle;
      assetId: string;
      objectCover?: 'contain' | 'stretch' | 'cover';
      clipRegion?: Rectangle;
    }

    export interface PatternFeature extends Identifiable {
      type: 'pattern';
      layerId: string;
      geometry: Rectangle | Path;
      assetId?: string;
    }

    export type FeatureNamesType = { [foo in Feature['type']]: string };
    export const FeatureNames: FeatureNamesType  = {
      'basic-asset': 'Asset',
      'pattern': 'Pattern',
    }

    export function isLayer(object: Identifiable): object is Layer {
      return  object != null && !!(object as Layer).features;
    }

    export function isFeature(object: Identifiable): object is Feature {
      return object != null && !!(object as Feature).layerId;
    }

    export type Geometry = Rectangle | Path;

    export interface Rectangle {
      type: 'rectangle';
      snapToGrid?: boolean;
      p1: Coordinate;
      p2: Coordinate;
    }

    export interface Path {
      type: 'path';
      snapToGrid?: boolean;
      path: Coordinate[];
      closed?: boolean;
    }
  }

  export namespace Payloads {
    export interface CreateLayer {
      parentId: string;
      layerId: string;
    }

    export interface SnapsToGrid {
      featureIds: string[],
      snapsToGrid: boolean,
    }

    export interface TranslateFeatures {
      featureIds: Iterable<string>;
      translation: Coordinate;
    }

    export interface SetFeatureName {
      featureId: string;
      name: string;
    }

    export interface SetFeatureStyle {
      featureIds: Iterable<string>;
      styleId: string;
    }

    export interface SetPathsClosed {
      pathIds: string[];
      closed: boolean;
    }

    export interface SetFeatureGeometryPayload {
      featureId: string;
      geometry: Model.Types.Geometry;
    }
  }

  export const DispatchActions = {
    setModel: createActionWrapper<Model.Types.State>('model::setModel'),
    createLayer: createActionWrapper<Payloads.CreateLayer>('model::createLayer'),
    createFeature: createActionWrapper<Types.Feature>('model::createFeature'),
    translateFeatures: createActionWrapper<Payloads.TranslateFeatures>('model::translateFeatures'),
    setFeatureGeometry: createActionWrapper<Payloads.SetFeatureGeometryPayload>('model::setFeatureGeometry'),
    setFeatureName: createActionWrapper<Payloads.SetFeatureName>('model::setFeatureName'),
    setFeatureStyle: createActionWrapper<Payloads.SetFeatureStyle>('model::setFeatureStyle'),
    setSnapsToGrid: createActionWrapper<Payloads.SnapsToGrid>('model::snapToGrid'),
    setPathsClosed: createActionWrapper<Payloads.SetPathsClosed>('model::setPathsClosed'),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.model;
    export const getLayers = (state: ReduxState) => get(state).layers;
    export const getFeatures = (state: ReduxState) => get(state).features;
    export const getFeatureById = (featureId: string) => (state: ReduxState) => get(state).features.byId[featureId];
  }
}
