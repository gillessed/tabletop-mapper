import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { setConfig } from './actions';
import { Config } from './types';

export class ConfigDispatcher {
  constructor(public readonly store: Store<ReduxState>) {}

  public setConfig(config: Config) {
    this.store.dispatch(setConfig.create(config));
  }
}