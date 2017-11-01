import * as React from 'react';
import { AppContext } from '../../redux/appContext';
import { DispatchersContextType } from '../../dispatcherProvider';
import { Dispatchers } from '../../redux/dispatchers';
import { generateRandomString } from '../../utils/randomId';
import { NavRoutes, Navigation } from '../../redux/navigation/types';
import { TagTypes, JannaState, JannaTag, JannaObject, isTag, isGallery, JannaGallery } from '../../redux/model/types';
import { ReduxState } from '../../redux/rootReducer';
import { connect } from 'react-redux';
import { etn } from '../../etn';
import { ConfigPaths } from '../../redux/config/types';
import { SearchState, SearchResult } from '../../redux/search/types';
import { SearchBar } from '../searchBar/SearchBar';
import * as classNames from 'classnames';
import { ObjectListView } from '../objectList/ObjectListView';
import { setRoute } from '../../redux/navigation/actions';
import { Spinner, Intent } from '@blueprintjs/core';
import { GalleryCacheState } from '../../redux/galleryCache/types';

interface OwnProps {
    route: string;
    params?: {
        query?: string,
        page: number;
    }
}

interface StateProps {
    rootDirectory: string;
    search: SearchState;
    navigation: Navigation;
    janna: JannaState;
    galleryCache: GalleryCacheState;
}

type Props = OwnProps & StateProps;

interface State {
    query: string,
}

class SearchViewInternal extends React.PureComponent<Props, State> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
        this.state = {
            query: props.params.query || '',
        };
    }

    private getQuery = (opProps?: Props): string | undefined => {
        const props = opProps || this.props;
        if (props.params) {
            return props.params.query;
        }
    }

    private getPage = (opProps?: Props): number | undefined => {
        const props = opProps || this.props;
        if (props.params) {
            return props.params.page;
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        const query = this.getQuery();
        const nextQuery = this.getQuery(nextProps);
        if (nextQuery && nextQuery !== query) {
            this.dispatchers.search.search(nextQuery);
        }
        return true;
    }

    public componentWillMount() {
        const query = this.getQuery();
        if (query && query.length >= 1) {
            this.dispatchers.search.search(this.props.params.query);
        }
    }

    public render() {
        return (
            <div className='container search-container'>
                <SearchBar value={this.state.query}/>
                {this.renderResultTable()}
                {this.renderLoader()}
            </div>
        );
    }

    private renderResultTable = () => {
        const searchState = this.props.search.get(this.getQuery());
        const searchResults = searchState ? searchState.searchResults : undefined;
        const loading = searchState ? searchState.loading : undefined;
        if (searchResults && !loading) {
            const headerText = `Found ${searchResults.length} result(s) for "${this.getQuery()}"`;
            return (
                <ObjectListView
                    currentPage={this.getPage()}
                    onGotoPage={this.onGotoPage}
                    headerText={headerText}
                    results={searchResults}
                    rootDirectory={this.props.rootDirectory}
                    janna={this.props.janna}
                    galleryCache={this.props.galleryCache}
                    dispatchers={this.dispatchers}
                />
            );
        } else if (!loading) {
            //TODO: show error/empty
            return <span className='unselectable text'> No search results </span>;
        }
    }

    private onGotoPage = (page: number) => {
        this.dispatchers.navigation.setRoute(
            NavRoutes.root._,
            NavRoutes.root.search,
            {
                query: this.getQuery(),
                page,
            },
        );
    }

    private renderLoader = () => {
        const searchState = this.props.search.get(this.getQuery());
        const loading = searchState ? searchState.loading : true;
        if (loading) {
            return (
                <div className='spinner-overlay'>
                    <Spinner
                        className='large'
                        intent={Intent.PRIMARY}

                    />
                </div>
            )
        }
    }
}

const mapStateToProps = (state: ReduxState, ownProps: OwnProps) => {
    return {
        ...ownProps,
        rootDirectory: state.config.rootDirectory!,
        search: state.search,
        navigation: state.navigation,
        janna: state.janna,
        galleryCache: state.galleryCache,
    };
};

export const SearchView = connect(mapStateToProps)(SearchViewInternal);