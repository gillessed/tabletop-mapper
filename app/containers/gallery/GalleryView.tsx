import * as React from 'react';
import * as classNames from 'classnames';
import { AppContext } from '../../redux/appContext';
import { DispatchersContextType } from '../../dispatcherProvider';
import { Dispatchers } from '../../redux/dispatchers';
import { generateRandomString } from '../../utils/randomId';
import { NavRoutes, Navigation } from '../../redux/navigation/types';
import { TagTypes, JannaState, JannaTag, JannaGallery, TagTypeDisplays, JannaPhotoset } from '../../redux/model/types';
import { ReduxState } from '../../redux/rootReducer';
import { connect } from 'react-redux';
import { etn } from '../../etn';
import { ConfigPaths } from '../../redux/config/types';
import { createSelector } from 'reselect';
import { Dialog, Intent, Button, MenuItem, Classes, Spinner } from '@blueprintjs/core';
import { MultiSelect, ISelectItemRendererProps } from '@blueprintjs/labs';
import { OpenPhotoViewPayload } from '../../redux/photoView/types';
import { GalleryTag } from './GalleryTag';
import { scrollListeners } from '../../scrollListener';
import { GalleryCacheState, getCacheId } from '../../redux/galleryCache/types';
import { PhotosetTab } from './PhotosetTab';

const TagMultiSelect = MultiSelect.ofType<JannaTag>();

interface OwnProps {
    route: string;
    params?: {
        id: string;
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
    isAddTagDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    tagsToAdd: JannaTag[],
    loadedImages: number;
    photoset: number;
}
class GalleryViewInternal extends React.PureComponent<Props, State> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;
    private scrollListener = (element: HTMLDivElement) => {
        if (element.scrollHeight - element.offsetHeight - element.scrollTop < 100) {
            this.setState({
                loadedImages: this.state.loadedImages + 12, 
            });
        }
    }

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
        this.state = {
            loadedImages: 24,
            isAddTagDialogOpen: false,
            isDeleteDialogOpen: false,
            tagsToAdd: [],
            photoset: 0,
        };
    }

    public componentDidMount() {
        scrollListeners.add(this.scrollListener);
    }

    public componentWillUnmount() {
        scrollListeners.delete(this.scrollListener);
    }

    private getGalleryId = (): string | undefined => {
        if (this.props.params) {
            return this.props.params.id;
        }
    }

    private getGallery = (galleryId: string): JannaGallery | undefined => {
        return this.props.janna.galleries.get(galleryId);
    }

    public render() {
        const galleryId = this.getGalleryId();
        if (!galleryId) {
            return <h3>No gallery ID passed as route param.</h3>;
        }

        const gallery = this.getGallery(galleryId);
        if (!gallery) {
            return <h3>No such gallery: {gallery}</h3>;
        }

        return (
            <div className='container gallery-container'>
                {this.renderHeader(gallery)}
                {this.renderGalleryBody(gallery)}
                {this.renderAddTagsDialog()}
                {this.renderConfirmDeleteDialog()}
            </div>
        );
    }

    private renderHeader = (gallery: JannaGallery) => {
        const galleryCover = this.getGallery(this.getGalleryId()).cover || { photoset: 0, index: 0 };
        const galleryContents = this.props.galleryCache.get(getCacheId(gallery.id, galleryCover.photoset));
        if (!galleryContents) {
            setTimeout(() => {
                this.dispatchers.galleryCache.read(gallery.id, this.state.photoset);
            }, 0);
            return;
        }
        let galleryCoverImage: string | undefined = undefined;
        if (galleryContents.length) {
            galleryCoverImage = galleryContents[galleryCover.index];
        }
        const imageSource = etn.path.join(ConfigPaths.subDir(gallery.id, this.props.rootDirectory), galleryCoverImage || 'foo');
        return (
            <div className='gallery-header'>
                <div className='cover-image-container'>
                    <img className='cover-image' src={imageSource}/>
                </div>
                {this.renderTags(gallery)}
            </div>
        );
    }

    private renderTags = (gallery: JannaGallery) => {
        const tags = gallery.tags
            .map((tagId) => this.props.janna.tags.get(tagId))
            .filter((tag) => tag);
        const tagSets: { [key: string]: JannaTag[]} = {};
        TagTypes.forEach((tagType) => tagSets[tagType] = []);
        tags.forEach((tag) => tagSets[tag.tagType].push(tag));
        return (
            <div className='tag-list-container'>
                <table className='tag-list'>
                    <tbody>
                        {TagTypes.map((tagType) => {
                            if (tagSets[tagType].length > 0) {
                                return this.renderTagRow(tagSets[tagType], tagType, gallery);
                            }
                        })}
                    </tbody>
                </table>
                <div className='gallery-button add-tag-button unselectable' onClick={this.toggleAddTagDialog}>Add Tags</div>
                <div className='gallery-button delete-gallery-button unselectable' onClick={this.toggleDeleteDialog}>Delete Gallery</div>
            </div>
        )
    }

    private renderGalleryBody(gallery: JannaGallery) {
        const galleryContents = this.props.galleryCache.get(getCacheId(gallery.id, this.state.photoset));
        if (!galleryContents) {
            setTimeout(() => {
                this.dispatchers.galleryCache.read(gallery.id, this.state.photoset);
            }, 0);
            return (
                <div className='container gallery-container'>
                    <div className='spinner-overlay'>
                        <Spinner
                            className='pt-large'
                            intent={Intent.PRIMARY}
                        />
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className='gallery-body-tabs'>
                    {gallery.photosets.map(this.renderPhotosetTab)}
                    <div className='gallery-body-tab not-active' onClick={this.importPhotosetPressed}>
                        <p><span className='pt-icon-large pt-icon-add' /></p>
                    </div>
                </div>
                {this.renderContent(gallery, galleryContents)}
            </div>
        );
    }

    private importPhotosetPressed = () => {
        etn.dialog.showOpenDialog({
            properties: [
                'openDirectory',
            ],
        }, (fileList: string[]) => {
            if (fileList && fileList.length > 0) {
                this.dispatchers.import.importPhotoset({
                    galleryId: this.getGalleryId(),
                    folder: fileList[0],
                })
            }
        });
    }

    private renderPhotosetTab = (_: JannaPhotoset, index: number) => {
        return (
            <PhotosetTab
                key={_.id}
                gallery={this.getGallery(this.getGalleryId())}
                activeIndex={this.state.photoset}
                index={index}
                setPhotosetIndex={this.setPhotosetIndex}
                dispatchers={this.dispatchers}
            />
        );
    }

    private setPhotosetIndex = (index: number) => {
        this.setState({ photoset: index });
    }

    private renderTagRow = (tags: JannaTag[], tagType: string, gallery: JannaGallery) => {
        const sortedTags = tags.sort((t1: JannaTag, t2: JannaTag) => {
            return t1.value.localeCompare(t2.value);
        })
        return (
            <tr key={tagType}>
                <td className='tag-type-row-element'>
                    <span className='unselectable text'>{TagTypeDisplays[tagType]}:</span>
                </td>
                <td className='tag-type-row'>
                    {sortedTags.map(this.renderTag)}
                </td>
            </tr>
        );
    }

    private renderTag = (tag: JannaTag) => {
        const galleries = this.props.janna.tagToGalleryIndex.get(tag.id);
        const onClick = () => this.dispatchers.navigation.setRoute(
            NavRoutes.root._,
            NavRoutes.root.tag,
            {
                id: tag.id,
                page: 0,
            }
        );
        return (
            <GalleryTag
                key={'tag' + tag.id}
                tag={tag}
                dispatchers={this.dispatchers}
                tagSize={galleries.size}
                galleryId={this.getGalleryId()}
            />
        );
    }

    private renderContent(gallery: JannaGallery, galleryContents: string[]) {
        const cutContent = galleryContents.slice(0, this.state.loadedImages);
        const allImages = galleryContents.map((image) => {
            const subdir = ConfigPaths.subDir(gallery.photosets[this.state.photoset].id, this.props.rootDirectory);
            return etn.path.join(subdir, image);
        });
        return (
            <div className='gallery-content-container'>
                {cutContent.map((image: string, index: number) => {
                    return this.renderImage(image, index, allImages);
                })}
            </div>
        );
    }

    private renderImage = (image: string, index: number, allImages: string[]) => {
        const gallery = this.getGallery(this.getGalleryId());
        const photoset = gallery.photosets[this.state.photoset];
        const imageSource = etn.path.join(ConfigPaths.subDir(photoset.id, this.props.rootDirectory), image);
        const onClick = () => {
            const openPhotoViewPayload: OpenPhotoViewPayload = {
                images: allImages,
                index,
                galleryId: gallery.id,
            };
            this.dispatchers.photoView.openPhotoView(openPhotoViewPayload);
        };
        return (
            <div key={image} className='gallery-image-container' onClick={onClick}>
                <img className='gallery-image' src={imageSource}/>
            </div>
        );
    }
    
    private renderAddTagsDialog() {
        const tags = this.props.janna.tags.toArray();
        const addDisabled = !this.state.tagsToAdd.length;
        return (
            <Dialog
                isOpen={this.state.isAddTagDialogOpen}
                onClose={this.closeDialog}
                title='Add Tags To Gallery'
            >
                <div className='pt-dialog-body'>
                    <TagMultiSelect
                        items={tags}
                        itemListPredicate={this.filterTags}
                        itemRenderer={this.renderTagInDialog}
                        noResults={<MenuItem disabled text='No tags.' />}
                        onItemSelect={this.handleTagSelect}
                        tagRenderer={this.renderBlueprintTagInDialog}
                        tagInputProps={{ onRemove: this.handleRemoveTagInDialog }}
                        selectedItems={this.state.tagsToAdd}
                        resetOnSelect={true}
                    />
                </div>
                <div className='pt-dialog-footer'>
                    <div className='pt-dialog-footer-actions'>
                        <Button
                            text='Close'
                            iconName='pt-icon-cross'
                            onClick={this.closeDialog}
                        />
                        <Button
                            disabled={addDisabled}
                            iconName='add'
                            intent={Intent.PRIMARY}
                            onClick={this.addTagsToGallery}
                            text='Add Tags'
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    private renderTagInDialog = ({ handleClick, isActive, item: tag }: ISelectItemRendererProps<JannaTag>) => {
        const classes = classNames({
            [Classes.ACTIVE]: isActive,
            [Classes.INTENT_PRIMARY]: isActive,
        });
        return (
            <MenuItem
                className={classes}
                key={tag.id}
                label={tag.tagType}
                onClick={handleClick}
                text={tag.value}
                shouldDismissPopover={false}
            />
        );
    }

    private renderBlueprintTagInDialog = (tag: JannaTag) => {
        return tag.value;
    }
    
    private filterTags = (query: string, tags: JannaTag[]) => {
        const splice = tags.length > 20 ? 20 : tags.length;
        return tags
            .filter((tag: JannaTag) => {
                return this.getGallery(this.getGalleryId()).tags.indexOf(tag.id) < 0 &&
                    tag.value.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
            })
            .splice(0, splice)
            .sort((t1: JannaTag, t2: JannaTag) => {
                return t1.value.localeCompare(t2.value);
            });
    }

    private handleRemoveTagInDialog = (_tag: string, index: number) => {
        this.deselectTag(index);
    }
    
    private handleTagSelect = (tag: JannaTag) => {
        if (!this.isFilmSelected(tag)) {
            this.selectTag(tag);
        } else {
            this.deselectTag(this.getSelectedFilmIndex(tag));
        }
    }

    private getSelectedFilmIndex(tag: JannaTag) {
        return this.state.tagsToAdd.indexOf(tag);
    }

    private isFilmSelected(tag: JannaTag) {
        return this.getSelectedFilmIndex(tag) !== -1;
    }

    private selectTag(tag: JannaTag) {
        this.setState({ tagsToAdd: [...this.state.tagsToAdd, tag] });
    }

    private deselectTag(index: number) {
        this.setState({ tagsToAdd: this.state.tagsToAdd.filter((_, i) => i !== index) });
    }

    private closeDialog = () => {
        this.setState({
            isAddTagDialogOpen: false,
            tagsToAdd: [],
        })
    }

    private toggleAddTagDialog = () => {
        this.setState({
            isAddTagDialogOpen: !this.state.isAddTagDialogOpen,
        });
    }

    private addTagsToGallery = () => {
        const tagsToAdd = [...this.state.tagsToAdd];
        this.setState({
            isAddTagDialogOpen: !this.state.isAddTagDialogOpen,
            tagsToAdd: [],
        }, () => {
            this.dispatchers.model.addTagsToGallery({
                galleryId: this.getGalleryId(),
                tags: tagsToAdd.map((tag) => tag.id),
            });
        });
    }

    private renderConfirmDeleteDialog() {
        const onClickYes = () => {
            this.setState({
                isDeleteDialogOpen: false,
            }, () => {
                this.dispatchers.import.deleteGallery(this.getGalleryId());
            });
        }
        return (
            <Dialog
                iconName='inbox'
                isOpen={this.state.isDeleteDialogOpen}
                onClose={this.toggleDeleteDialog}
                title='Warning'
            >
                <div className='pt-dialog-body'>
                    Are you sure you want to delete this gallery?
                </div>
                <div className='pt-dialog-footer'>
                    <div className='pt-dialog-footer-actions'>
                        <Button
                            text='No'
                            onClick={this.toggleDeleteDialog}
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

    private toggleDeleteDialog = () => {
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

export const GalleryView = connect(mapStateToProps)(GalleryViewInternal);