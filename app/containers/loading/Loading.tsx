import * as React from 'react';

interface Props {
    route: string;
}

export class Loading extends React.PureComponent<Props, {}> {
    public render() {
        return <div className='loading-container'>Loading...</div>;
    }
}