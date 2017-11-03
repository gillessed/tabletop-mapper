import * as React from 'react';
import { AppContext } from '../../redux/appContext';
import { Dispatchers } from '../../redux/dispatchers';
import { DispatchersContextType } from '../../dispatcherProvider';
import { connect } from 'react-redux';
import { ReduxState } from '../../redux/rootReducer';
import { ImportState, RunningImport } from '../../redux/import/types';
import { Navigation, NavRoutes } from '../../redux/navigation/types';
import { ProgressBar, Intent } from '@blueprintjs/core';
import * as classNames from 'classnames';

interface Props {
    navigation: Navigation;
    import: ImportState;
}

class Internal extends React.PureComponent<Props, {}> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
    }

    public render() {
        if (!this.props.navigation.importPanelOpen) {
            return null;
        } else {
            return (
                <div className='import-panel-container'>
                    <div className='title-container '>
                        <span className='title-text unselectable'> Imports </span>
                        <div className='close-import-panel-button' onClick={this.onCloseImportPanelButtonClicked}>
                            <span className='pt-icon pt-icon-cross'/>
                        </div>
                    </div>
                    {this.renderImports()}
                </div>
            );
        }
    }

    private renderImports() {
        return (
            <div className='imports-container'>
                {this.props.import.runningImports
                    .map((importId) => this.props.import.importMap.get(importId))
                    .filter(x => x)
                    .sort((i1, i2) => {
                        if (i1.completed && !i2.completed) {
                            return -1;
                        } else if (!i1.completed && i2.completed) {
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                    .map(this.renderImport)
                }
            </div>
        );
    }

    private getActiveGalleryId = (): string | undefined => {
        const navigationState = this.props.navigation.routes[NavRoutes.root._];
        const routeObject = navigationState.routeStack[navigationState.index];
        const params = routeObject.params;
        if (routeObject.route === NavRoutes.root.gallery && params && params.id) {
            return params.id;
        }
    }

    private renderImport = (runningImport: RunningImport): JSX.Element => {
        const id = runningImport.id;
        const progressValue = runningImport.progress / runningImport.images.length || 0;
        let displayId = runningImport.id;
        if (displayId.length > 8) {
            displayId = displayId.substring(0, 8);
        }
        const onLinkClick = () => {
            if (runningImport.completed) {
                this.dispatchers.navigation.setRoute(
                    NavRoutes.root._,
                    NavRoutes.root.gallery,
                    { id });
            }
        };
        const closeImportButtonClasses = classNames({
            ['remove-import-button']: true,
            ['disabled']: !runningImport.completed,
        });
        const onCloseClick = () => {
            if (runningImport.completed) {
                this.dispatchers.import.deleteImport(id);
            }
        }
        const linkClasses = classNames({
            ['import-name-link']: true,
            ['unselectable']: true,
            ['completed']: runningImport.completed,
            ['active']: id === this.getActiveGalleryId(),
        });
        return (
            <div key={id} className='import-container'>
                <div className='import-control-panel'>
                    <span className={linkClasses} onClick={onLinkClick}>{displayId}</span>
                    <div className={closeImportButtonClasses} onClick={onCloseClick}>
                        <span className='pt-icon pt-icon-cross'/>
                    </div>
                </div>
                <div className='import-progress-panel'>
                    <ProgressBar 
                        className='import-progress-bar pt-no-animation pt-no-stripes'
                        intent={runningImport.completed ? Intent.SUCCESS : Intent.PRIMARY}
                        value={progressValue}
                    />
                </div>
            </div>
        );
    }

    private onCloseImportPanelButtonClicked = () => {
        this.dispatchers.navigation.toggleImportPanel(false);
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        navigation: state.navigation,
        import: state.import,
    };
}

export const ImportPanel = connect(mapStateToProps)(Internal);