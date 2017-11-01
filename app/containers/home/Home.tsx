import * as React from 'react';
import { SearchBar } from '../searchBar/SearchBar';
import { AppContext } from '../../redux/appContext';
import { Dispatchers } from '../../redux/dispatchers';
import { DispatchersContextType } from '../../dispatcherProvider';
import { NavRoutes } from '../../redux/navigation/types';
import { KeyQueries } from '../../redux/search/sagas';

interface Props {
    route: string;
}

export class Home extends React.PureComponent<Props, {}> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
    }

    public render() {
        return (
            <div className='container home-container'>
                <h1 className='title unselectable'> Janna </h1>
                <h3 className='subtitle unselectable'>Welcome back, master.</h3>

                <div className='home-search-container'>
                    <div className='home-search-button-container'>
                        <div className='home-search-button' onClick={this.onGalleriesClicked}>
                            <span className='unselectable text'>Galleries</span>
                        </div>
                        <div className='home-search-button' onClick={this.onTagsClicked}>
                            <span className='unselectable text'>Tags</span>
                        </div>
                        <div className='home-search-button' onClick={this.onLostClicked}>
                            <span className='unselectable text'>Lost</span>
                        </div>
                        <div className='home-search-button' onClick={this.onModelsClicked}>
                            <span className='unselectable text'>Models</span>
                        </div>
                    </div>
                    <SearchBar/>
                </div>
            </div>
        );
    }

    private onGalleriesClicked = () => {
        this.dispatchers.navigation.setRoute(
            NavRoutes.root._,
            NavRoutes.root.search,
            {
                query: KeyQueries.allGalleriesQuery,
                page: 0,
            },
        );
    }

    private onTagsClicked = () => {
        this.dispatchers.navigation.setRoute(
            NavRoutes.root._,
            NavRoutes.root.search,
            {
                query: KeyQueries.allTagsQuery,
                page: 0,
            },
        );
    }

    private onLostClicked = () => {
        this.dispatchers.navigation.setRoute(
            NavRoutes.root._,
            NavRoutes.root.search,
            {
                query: KeyQueries.untaggedGalleriesQuery,
                page: 0,
            },
        );
    }

    private onModelsClicked = () => {
        this.dispatchers.navigation.setRoute(
            NavRoutes.root._,
            NavRoutes.root.search,
            {
                query: KeyQueries.allModelsQuery,
                page: 0,
            },
        );
    }
}