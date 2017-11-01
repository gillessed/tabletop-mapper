import { ReduxState } from '../rootReducer';

export const rootDirectorySelector = (state: ReduxState) => state.config.rootDirectory;