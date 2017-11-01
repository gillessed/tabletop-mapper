import { select } from 'redux-saga/effects';
import { ReduxState } from '../rootReducer';
import { JannaState, JannaSerializable } from './types';
import { etn } from '../../etn';
import { ConfigPaths } from '../config/types';

export function* serializeModelWorker() {
    const rootDirectory = yield select((state: ReduxState) => state.config.rootDirectory);
    const janna: JannaState = yield select((state: ReduxState) => state.janna);
    const jannaSerialize: JannaSerializable = {
        galleries: janna.galleries.toArray(),
        tags: janna.tags.toArray(),
    };
    etn.fs.writeFileSync(ConfigPaths.dbFile(rootDirectory), JSON.stringify(jannaSerialize, null, 2));
}