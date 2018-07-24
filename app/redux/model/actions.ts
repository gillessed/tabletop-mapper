import { createActionWrapper } from '../utils/typedAction';
import { SetFeatureTypePayload } from './types';

// Layers
export const createLayer = createActionWrapper<string>('MODEL - CREATE LAYER');

// Features
export const createFeature = createActionWrapper<string>('MODEL - CREATE FEATURE');
export const setFeatureType = createActionWrapper<SetFeatureTypePayload>('MODEL - CHANGE FEATURE TYPE');

// Selection
export const expandNode = createActionWrapper<string>('SELECTION - EXPAND NODE');
export const collapseNode = createActionWrapper<string>('SELECTION - COLLAPSE NODE');
export const selectNode = createActionWrapper<string>('SELECTION - SELECT LAYER');