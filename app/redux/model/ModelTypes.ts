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
      settings: Settings;
    }

    export interface Settings {
      gridColor: string;
      backgroundColor: string;
      showGrid: boolean;
      majorAxisStep: number;
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

    export type ImageFill = 'contain' | 'stretch' | 'cover';

    export interface BasicAssetFeature extends Identifiable {
      type: 'basic-asset';
      layerId: string;
      geometry: Rectangle;
      assetId: string;
      objectCover: ImageFill;
      rotation: number;
      mirrored: boolean;
      opacity: number;
      clipRegion?: Rectangle;
    }

    export interface PatternFeature extends Identifiable {
      type: 'pattern';
      layerId: string;
      geometry: Rectangle | Path;
      assetId?: string;
      opacity: number;
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

    export interface SetValue<T> {
      featureIds: Iterable<string>;
      value: T;
    }
    
    export type SetBoolean = SetValue<boolean>;
    export type SetNumber = SetValue<number>;
    export type SetString = SetValue<string>;

    export interface TranslateFeatures {
      featureIds: Iterable<string>;
      translation: Coordinate;
    }

    export interface SetLayerName {
      layerId: string;
      name: string;
    }

    export interface SetFeatureName {
      featureId: string;
      name: string;
    }

    export interface SetFeatureStyle {
      featureIds: Iterable<string>;
      styleId: string;
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
    setLayerName: createActionWrapper<Payloads.SetLayerName>(name('setLayerName')),
    setSnapToGrid: createActionWrapper<Payloads.SetBoolean>(name('setSnapToGrid')),
    setMirrored: createActionWrapper<Payloads.SetBoolean>(name('setMirrored')),
    setOpacity: createActionWrapper<Payloads.SetNumber>(name('setOpacity')),
    setRotation: createActionWrapper<Payloads.SetNumber>(name('setRotation')),
    setPathsClosed: createActionWrapper<Payloads.SetBoolean>(name('setPathsClosed')),
    setObjectCover: createActionWrapper<Payloads.SetValue<Model.Types.ImageFill>>(name('setObjectCover')),
    reparentNodes: createActionWrapper<Payloads.ReparentNodes>(name('reparentNodes')),
    copyNodes: createActionWrapper<Payloads.CopyNodes>(name('copyNodes')),
    setBackgroundColor: createActionWrapper<string>(name('setBackgroundColor')),
    setGridColor: createActionWrapper<string>(name('setGridColor')),
    setShowGrid: createActionWrapper<boolean>(name('setShowGrid')),
    setMajorAxisStep: createActionWrapper<number>(name('setMajorAxisStep')),
    setClipRegion: createActionWrapper<Payloads.SetValue<Model.Types.Rectangle>>(name('setClipRegion')),
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
    export const getSettings = (state: ReduxState) => get(state).settings;
  }
}
