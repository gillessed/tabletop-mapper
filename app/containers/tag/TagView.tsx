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
import { ObjectListView } from '../objectList/ObjectListView';
import { SearchResult } from '../../redux/search/types';
import { Dialog, Button, Intent } from '@blueprintjs/core';
import { GalleryCacheState } from '../../redux/galleryCache/types';

interface OwnProps {
    route: string;
    params?: {
        id: string;
        page: number;
    };
}

interface StateProps {
    rootDirectory: string;
    janna: JannaState;
    galleryCache: GalleryCacheState;
    navigation: Navigation;
}

type Props = OwnProps & StateProps;

interface State {
    isDeleteDialogOpen: boolean;
}

class TagViewInternal extends React.PureComponent<Props, State> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
        this.state = {
            isDeleteDialogOpen: false,
        };
    }

    private getTagId(): string | undefined {
        if (this.props.params) {
            return this.props.params.id;
        }
    }

    private getTag(tagId: string): JannaTag | undefined {
        return this.props.janna.tags.get(tagId);
    }

    private getPage(): number | undefined {
        if (this.props.params) {
            return this.props.params.page;
        }
    }

    public render() {
        const tagId = this.getTagId();
        if (!tagId) {
            return <h3>No tag ID passed as route param.</h3>;
        }

        const tag = this.getTag(tagId);
        if (!tag) {
            return <h3>No such tag: {tagId}</h3>;
        }

        const onEditClick = () => {
            this.dispatchers.navigation.setRoute(NavRoutes.root._, NavRoutes.root.upsertTag, { id: tagId });
        }

        const onDeleteClick = () => {
            this.toggleDialog();
        }

        return (
            <div className='container tag-container'>
                <div className='title-container'>
                    <h1 className='title unselectable'> {tag.tagType}: {tag.displayValue || tag.value} </h1>
                    <div className='edit-button' onClick={onEditClick}>
                        <span className='pt-icon-standard pt-icon-edit'/>
                    </div>
                    <div className='delete-button' onClick={onDeleteClick}>
                        <span className='pt-icon-standard pt-icon-trash'/>
                    </div>
                </div>
                {this.renderCover(tag)}
                {this.renderGalleries(tag)}
                {this.renderConfirmDeleteDialog(tag)}
            </div>
        );
    }

    private renderCover(tag: JannaTag) {
        if (tag.cover) {
            const imageSource = etn.path.join(ConfigPaths.tagCoverDir(this.props.rootDirectory), tag.cover);
            return (
                <div className='tag-cover-container'>
                    <div className='cover-image-container'>
                        <img className='preview-image' src={imageSource}/>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    private renderGalleries(tag: JannaTag) {
        const galleries = this.props.janna.tagToGalleryIndex.get(tag.id);
        if (galleries.size > 0) {
            const headerText = `${galleries.size} galleries with tag '${tag.value}'`;
            const results: SearchResult[] = galleries.toArray().map((galleryId) => {
                const gallery = this.props.janna.galleries.get(galleryId);
                return  {
                    objectId: gallery.id,
                    matchingTags: [tag.id],
                };
            });
            return (
                <ObjectListView
                    currentPage={this.getPage()}
                    onGotoPage={this.onGotoPage}
                    headerText={headerText}
                    results={results}
                    rootDirectory={this.props.rootDirectory}
                    janna={this.props.janna}
                    galleryCache={this.props.galleryCache}
                    dispatchers={this.dispatchers}
                />
            );
        }
    }

    private onGotoPage = (page: number) => {
        this.dispatchers.navigation.setRoute(
            NavRoutes.root._,
            NavRoutes.root.tag,
            {
                id: this.getTagId(),
                page,
            }
        );
    }

    private renderConfirmDeleteDialog(tag: JannaTag) {
        const onClickYes = () => {
            this.setState({
                isDeleteDialogOpen: false,
            }, () => {
                this.dispatchers.tag.deleteTag(tag.id);
            });
        }
        return (
            <Dialog
                iconName='inbox'
                isOpen={this.state.isDeleteDialogOpen}
                onClose={this.toggleDialog}
                title='Warning'
            >
                <div className='pt-dialog-body'>
                    Are you sure you want to delete tag "{tag.value}"?
                </div>
                <div className='pt-dialog-footer'>
                    <div className='pt-dialog-footer-actions'>
                        <Button
                            text='No'
                            onClick={this.toggleDialog}
                        />
                        <Button
                            intent={Intent.DANGER}
                            onClick={onClickYes}
                            text='Yes'
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    private toggleDialog = () => {
        this.setState({
            isDeleteDialogOpen: !this.state.isDeleteDialogOpen, 
        });
    }
}

const mapStateToProps = (state: ReduxState, ownProps: OwnProps) => {
    return {
        ...ownProps,
        rootDirectory: state.config.rootDirectory,
        janna: state.janna,
        galleryCache: state.galleryCache,
        navigation: state.navigation,
    };
};

export const TagView = connect(mapStateToProps)(TagViewInternal);