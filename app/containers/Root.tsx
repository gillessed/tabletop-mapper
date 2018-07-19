import * as React from 'react';
import { AppContext } from '../redux/appContext';
import { Dispatchers } from '../redux/dispatchers';
import { DispatchersContextType } from '../dispatcherProvider';
import './Root.scss'
import { MapperNavbar } from './navbar/Navbar';

export class Root extends React.PureComponent<{}, {}> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: {}, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
    }

    public render() {
        return (
            <div className='container home-container'>
                <MapperNavbar/>
            </div>
        );
    }
}