import * as React from 'react';
import { AppContext } from '../redux/appContext';
import { Dispatchers } from '../redux/dispatchers';
import { DispatchersContextType } from '../dispatcherProvider';
import './Root.scss'
import { MapperNavbar } from './navbar/Navbar';
import { Layers } from './layers/Layers';
import { CanvasContainer } from './canvasContainer/CanvasContainer';
import { Brushes } from './brushes/Brushes';

export class Root extends React.PureComponent<{}, {}> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: {}, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
    }

    public render() {
        return (
            <div className='container root-container'>
                <MapperNavbar/>
                <div className='app-container'>
                    <Layers/>
                    <CanvasContainer/>
                    <Brushes/>
                </div>
            </div>
        );
    }
}