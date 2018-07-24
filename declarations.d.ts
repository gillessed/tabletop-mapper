declare module 'dot-prop-immutable' {
    export = DotProp;
    interface DotPropImmutable {
        get(object: any, path: string): any;
        set(object: any, path: string, value: any): any;
        delete(object: any, path: string): any;
        merge(object: any, path: string, value: any): any;
    }
    
    const DotProp: DotPropImmutable;
    
}