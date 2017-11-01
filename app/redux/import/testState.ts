import { ImportState } from './types';
import { Map } from 'immutable';


export const TEST_STATE: ImportState = {
    runningImports: ['123456', '222222', '333333', '4', '6', '7', '8', '18', '28', '38', '48', '58', '68', '78'],
    importMap: Map({
        123456: {
            images: ['1', '2'],
            id: '123456',
            paused: false,
            progress: 1,
            completed: false,
        },
        222222: {
            images: ['1', '2'],
            id: '222222',
            paused: false,
            progress: 2,
            completed: true,
        },
        333333: {
            images: ['1', '2', '3'],
            id: '333333',
            paused: false,
            progress: 3,
            completed: true,
        },
        4: {
            images: ['1', '2'],
            id: '4',
            paused: false,
            progress: 1,
            completed: false,
        },
        6: {
            images: ['1', '2', '3'],
            id: '6',
            paused: false,
            progress: 3,
            completed: true,
        },
        7: {
            images: ['1', '2', '3', '4'],
            id: '7',
            paused: false,
            progress: 3,
            completed: false,
        },
        8: {
            images: ['1', '2', '3'],
            id: '8',
            paused: false,
            progress: 3,
            completed: true,
        },
        18: {
            images: ['1', '2', '3'],
            id: '18',
            paused: false,
            progress: 3,
            completed: true,
        },
        28: {
            images: ['1', '2', '3'],
            id: '28',
            paused: false,
            progress: 3,
            completed: true,
        },
        38: {
            images: ['1', '2', '3'],
            id: '38',
            paused: false,
            progress: 3,
            completed: true,
        },
        48: {
            images: ['1', '2', '3'],
            id: '48',
            paused: false,
            progress: 3,
            completed: true,
        },
        58: {
            images: ['1', '2', '3'],
            id: '58',
            paused: false,
            progress: 3,
            completed: true,
        },
        68: {
            images: ['1', '2', '3'],
            id: '68',
            paused: false,
            progress: 3,
            completed: true,
        },
        78: {
            images: ['1', '2', '3'],
            id: '78',
            paused: false,
            progress: 3,
            completed: true,
        },
    }),
}