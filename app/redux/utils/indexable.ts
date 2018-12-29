export interface Indexable<T> {
    byId: { [key: string]: T};
    all: [string];
}