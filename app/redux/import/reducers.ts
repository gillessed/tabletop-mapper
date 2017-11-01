import { Map } from 'immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { TypedAction } from '../utils/typedAction';
import { ImportState, RunningImport, SetImportProgressPayload } from './types';
import { createImport, setImportProgress, deleteImport } from './actions';
import { TEST_STATE } from './testState';

const INITIAL_STATE: ImportState = {
    runningImports: [],
    importMap: Map(),
};

// const INITIAL_STATE = TEST_STATE;

const createImportReducer = (state: ImportState, action: TypedAction<RunningImport>) => {
    const newRunningImports = [...state.runningImports, action.payload.id];
    const newImportMap = state.importMap.withMutations((mutable) => {
        mutable.set(action.payload.id, action.payload);
    });
    return {
        ...state,
        runningImports: newRunningImports,
        importMap: newImportMap,
    };
}

const setImportProgressReducer = (state: ImportState, action: TypedAction<SetImportProgressPayload>) => {
    const runningImport = state.importMap.get(action.payload.id);
    if (!runningImport) {
        return state;
    }
    const newImportMap = state.importMap.withMutations((mutable) => {
        mutable.set(action.payload.id, {
            ...runningImport,
            progress: action.payload.progress,
            completed: action.payload.progress === runningImport.images.length,
        });
    });
    return {
        ...state,
        importMap: newImportMap,
    };
};

const deleteImportReducer = (state: ImportState, action: TypedAction<string>) => {
    const importIdIndex = state.runningImports.indexOf(action.payload);
    if (importIdIndex < 0) {
        return state;
    }
    const newRunningImports = [...state.runningImports];
    newRunningImports.splice(importIdIndex, 1);
    const newImportMap = state.importMap.withMutations((mutable) => {
        mutable.remove(action.payload);
    });
    return {
        ...state,
        runningImports: newRunningImports,
        importMap: newImportMap,
    };
}

export const importReducer: Reducer<ImportState> = newTypedReducer<ImportState>()
    .handle(createImport.type, createImportReducer)
    .handle(setImportProgress.type, setImportProgressReducer)
    .handle(deleteImport.type, deleteImportReducer)
    .handleDefault((state = INITIAL_STATE) => state)
    .build();