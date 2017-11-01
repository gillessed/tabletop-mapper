import { Map } from 'immutable';

export const collectionToMap = <KEY, VALUE>(collection: Array<VALUE>, mapper: (t: VALUE) => KEY) => {
    return Map<KEY, VALUE>().withMutations((mutable) => {
        collection.forEach((value: VALUE) => {
            mutable.set(mapper(value), value);
        });
    });
}