import * as React from 'react';
import { Navigator } from './containers/navigation/Navigator';
import { Loading } from './containers/loading/Loading';
import { Home } from './containers/home/Home';
import { NavRoutes } from './redux/navigation/types';
import { AppContext } from './redux/appContext';
import { Dispatchers } from './redux/dispatchers';
import { DispatchersContextType } from './dispatcherProvider';
import { Import } from './containers/import/Import';
import { connect } from 'react-redux';
import { ReduxState } from './redux/rootReducer';
import { JannaState } from './redux/model/types';
import { Intent, Spinner } from '@blueprintjs/core';
import { ImportPanel } from './containers/importPanel/ImportPanel';
import { TagView } from './containers/tag/TagView';
import { SearchView } from './containers/search/SearchView';
import { popRoute } from './redux/navigation/actions';
import { UpsertTagView } from './containers/upsertTag/UpsertTagView';
import { GalleryView } from './containers/gallery/GalleryView';
import { PhotoView } from './containers/photoView/PhotoView';
import { PhotoViewState } from './redux/photoView/types';
import { fireScrollEvent } from './scrollListener';

interface Props {
    janna: JannaState;
    photoView: PhotoViewState;
}

class Internal extends React.PureComponent<Props, {}> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
    }

    public render() {
        return (
            <div className='root-container'>
                {this.renderNavigator()}
                {this.renderMenu()}
                {this.renderOpenImportPanelButton()}
                {this.renderImportPanel()}
                {this.renderGlobalSpinner()}
                <PhotoView/>
            </div>
        );
    }

    private renderMenu() {
        return (
            <div className='menu-container'>
                <div className='menu-button menu-button-home' onClick={this.onHomeButtonClicked}>
                    <span className='pt-icon pt-icon-home'></span>
                </div>
                <div className='menu-button small-button menu-button-add' onClick={this.onCreateTagButtonClicked}>
                    <span className='pt-icon pt-icon-add'></span>
                </div>
                <div className='menu-button small-button menu-button-import' onClick={this.onImportButtonClicked}>
                    <span className='pt-icon pt-icon-import'></span>
                </div>
                <div className='menu-button small-button menu-button-back' onClick={this.onBackButtonClicked}>
                    <span className='pt-icon pt-icon-arrow-left'></span>
                </div>
                <div className='menu-button small-button menu-button-random' onClick={this.onRandomButtonClicked}>
                    <span className='pt-icon pt-icon-random'></span>
                </div>
            </div>
        );
    }

    private onHomeButtonClicked = () => {
        this.dispatchers.navigation.setRoute(NavRoutes.root._, NavRoutes.root.home);
    }

    private onCreateTagButtonClicked = () => {
        this.dispatchers.navigation.setRoute(NavRoutes.root._, NavRoutes.root.upsertTag);
    }

    private onImportButtonClicked = () => {
        this.dispatchers.navigation.setRoute(NavRoutes.root._, NavRoutes.root.import);
    }

    private onRandomButtonClicked = () => {
        const galleries = this.props.janna.galleries.toArray();
        const count = galleries.length;
        const index = Math.floor(Math.random() * count);
        const gallery = galleries[index];

        this.dispatchers.navigation.setRoute(
            NavRoutes.root._,
            NavRoutes.root.gallery,
            { id: gallery.id },
        );
    }

    private onBackButtonClicked = () => {
        this.dispatchers.navigation.popRoute(NavRoutes.root._);
    }

    private renderOpenImportPanelButton() {
        return (
            <div className='open-import-panel-button' onClick={this.onOpenImportPanelButtonClicked}>
                <span className='pt-icon pt-icon-history'></span>
            </div>
        );
    }

    private onOpenImportPanelButtonClicked = () => {
        this.dispatchers.navigation.toggleImportPanel(true);
    }

    private renderNavigator() {
        return (
            <div className='root-navigator-container' onScroll={this.onScroll}>
                <Navigator name={NavRoutes.root._}>
                    <Loading route={NavRoutes.root.loading} />
                    <Home route={NavRoutes.root.home} />
                    <UpsertTagView route={NavRoutes.root.upsertTag} />
                    <Import route={NavRoutes.root.import} />
                    <TagView route={NavRoutes.root.tag} />
                    <SearchView route={NavRoutes.root.search} />
                    <GalleryView route={NavRoutes.root.gallery} />
                </Navigator>
            </div>
        );
    }

    private onScroll = (e: any) => {
        fireScrollEvent(e.nativeEvent.target);
    }

    private renderImportPanel() {
        return <ImportPanel/>;
    }

    private renderGlobalSpinner() {
        if (this.props.janna.locked) {
            return (
                <div className='global-spinner-container'>
                    <Spinner className='pt-large' intent={Intent.PRIMARY}/>
                </div>
            );
        }
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        janna: state.janna,
        photoView: state.photoView,
    };
}

export const RootContainer = connect(mapStateToProps)(Internal);