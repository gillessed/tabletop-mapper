import * as React from 'react';
import { AppContext } from '../../redux/appContext';
import { DispatchersContextType } from '../../dispatcherProvider';
import { Dispatchers } from '../../redux/dispatchers';
import { generateRandomString } from '../../utils/randomId';
import { NavRoutes, Navigation } from '../../redux/navigation/types';
import { TagTypes, JannaState, JannaTag } from '../../redux/model/types';
import { ReduxState } from '../../redux/rootReducer';
import { connect } from 'react-redux';
import { etn } from '../../etn';
import { ConfigPaths } from '../../redux/config/types';
import { SearchState } from '../../redux/search/types';
import { setRoute } from '../../redux/navigation/actions';

interface Props {
    value?: string;
}

interface State {
    query: string,
}

export class SearchBar extends React.PureComponent<Props, State> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
        this.state = {
            query: props.value || '',
        };
    }

    public render() {
        return (
            <div className='search-bar'>
                <div className='pt-input-group pt-large'>
                    <span className='pt-icon pt-icon-search'/>
                    <input 
                        className='pt-input'
                        type='search'
                        placeholder='Search input'
                        dir='auto'
                        value={this.state.query}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                    />
                </div>
            </div>
        );
    }

    private onChange = (e: any) => {
        this.setState({
            query: e.nativeEvent.target.value,
        });
    }

    private onKeyDown = (e: any) => {
        if (e.keyCode == 13) {
            this.dispatchers.navigation.setRoute(
                NavRoutes.root._,
                NavRoutes.root.search, 
                {
                    query: this.state.query.trim().toLowerCase(),
                    page: 0,
                }
            );
        }
    }
}