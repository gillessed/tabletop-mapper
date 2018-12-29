import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { ActionWrapper } from './typedAction';

type Actions = {
    [key: string]: ActionWrapper<any>
}
export type TypedDispatcher<A> = {
    [K in keyof A]: (arg: Argument<A[K]>) => void
}
type Argument<T> = T extends ActionWrapper<infer U> ? U : never;


export function createDispatcher<T extends Actions>(store: Store<ReduxState>, actions: T) {
    const foo = {} as any;
    for (const key of Object.keys(actions)) {
        const action = actions[key];
        foo[key] = (arg: Argument<typeof action>) => {
            store.dispatch(action.create(arg));
        };
    }
    return foo as TypedDispatcher<T>;
}
