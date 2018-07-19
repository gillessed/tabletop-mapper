import { ReduxState } from '../rootReducer';
import { createSelector } from 'reselect';
import { etn } from '../../etn';

export const modelSelector = (state: ReduxState) => state.model;
