import { createActionWrapper } from '../utils/typedAction';
import { SetFeatureTypePayload, UIState } from './types';
import { Vector } from '../../math/transform';

// Layers
export const createLayer = createActionWrapper<string>('MODEL - CREATE LAYER');

// Features
export const createFeature = createActionWrapper<string>('MODEL - CREATE FEATURE');
export const setFeatureType = createActionWrapper<SetFeatureTypePayload>('MODEL - CHANGE FEATURE TYPE');

// Selection
export const expandNode = createActionWrapper<string>('SELECTION - EXPAND NODE');
export const collapseNode = createActionWrapper<string>('SELECTION - COLLAPSE NODE');
export const selectNode = createActionWrapper<string>('SELECTION - SELECT LAYER');

// UI
export const updateUIState = createActionWrapper<Partial<UIState>>('UI - UPDATE STATE');
export const updateMousePosition = createActionWrapper<Vector>('UI - UPDATE MOUSE POSITION');