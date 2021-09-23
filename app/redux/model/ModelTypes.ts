import { IconName } from "@blueprintjs/core";
import { IconNames } from '@blueprintjs/icons';
import { Coordinate, Vector } from '../../math/Vector';
import { ReduxState } from "../AppReducer";
import { Grid } from "../grid/GridTypes";
import { getStateFromUndoable } from "../undo/UndoState";
import { namedAction } from "../utils/actionName";
import { Identifiable, Indexable } from "../utils/indexable";
import { createActionWrapper } from "../utils/typedAction";
import { ReparentTarget } from "./ModelTree";

const name = namedAction('model');

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
      name?: string;
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

    export interface ReparentNodes {
      nodeIds: string[];
      target: ReparentTarget;
    }

    export interface CopyNodes {
      nodeIds: string[];
      translation: Vector;
    }
  }

  export const DispatchActions = {
    createLayer: createActionWrapper<Payloads.CreateLayer>(name('createLayer')),
    createFeature: createActionWrapper<Types.Feature>(name('createFeature')),
    translateFeatures: createActionWrapper<Payloads.TranslateFeatures>(name('translateFeatures')),
    setFeatureGeometry: createActionWrapper<Payloads.SetFeatureGeometryPayload>(name('setFeatureGeometry')),
    setFeatureName: createActionWrapper<Payloads.SetFeatureName>(name('setFeatureName')),
    setFeatureStyle: createActionWrapper<Payloads.SetFeatureStyle>(name('setFeatureStyle')),
    setSnapsToGrid: createActionWrapper<Payloads.SnapsToGrid>(name('snapToGrid')),
    setPathsClosed: createActionWrapper<Payloads.SetPathsClosed>(name('setPathsClosed')),
    reparentNodes: createActionWrapper<Payloads.ReparentNodes>(name('reparentNodes')),
    copyNodes: createActionWrapper<Payloads.CopyNodes>(name('copyNodes')),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const getUndoable = (state: ReduxState) => state.model;
    export const get = (state: ReduxState): Types.State => getStateFromUndoable(getUndoable(state));
    export const getLayers = (state: ReduxState) => get(state).layers;
    export const getFeatures = (state: ReduxState) => get(state).features;
    export const getFeatureById = (featureId: string) => (state: ReduxState) => get(state).features.byId[featureId];
  }
}
