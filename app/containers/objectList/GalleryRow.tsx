import * as React from 'react';
import { JannaGallery, JannaState, JannaTag, TagTypes } from '../../redux/model/types';
import { Dispatchers } from '../../redux/dispatchers';
import { ConfigPaths } from '../../redux/config/types';
import { etn } from '../../etn';
import { NavRoutes } from '../../redux/navigation/types';
import * as classNames from 'classnames';
import { GalleryCacheState, getCacheId } from '../../redux/galleryCache/types';
import { Spinner, Intent } from '@blueprintjs/core';

interface Props {
    janna: JannaState;
    galleryCache: GalleryCacheState;
    gallery: JannaGallery;
    matchingTagIds: string[];
    dispatchers: Dispatchers;
    rootDirectory: string;
}

export class GalleryRow extends React.PureComponent<Props, {}> {
    public render() {
        const coverPhotoset = this.props.gallery.cover ? this.props.gallery.cover.photoset : 0;
        const galleryContents = this.props.galleryCache.get(getCacheId(this.props.gallery.id, coverPhotoset));
        if (galleryContents) {
            return this.renderRow(galleryContents);
        } else {
            setTimeout(() => {
                this.props.dispatchers.galleryCache.read(this.props.gallery.id, 0);
            }, 0);
            return this.renderLoader();
        }
    }

    private renderRow(galleryContents: string[]) {
        const galleryDir = ConfigPaths.subDir(this.props.gallery.id, this.props.rootDirectory);
        let coverSourceFile = undefined;
        if (galleryContents.length) {
            if (this.props.gallery.cover !== undefined) {
                coverSourceFile = galleryContents[this.props.gallery.cover.index];
            } else {
                coverSourceFile = galleryContents[0];
            }
        }
        const coverSource = etn.path.join(galleryDir, coverSourceFile || 'foo');
        const tags = this.props.gallery.tags.map((tagId) => this.props.janna.tags.get(tagId)).filter((tag) => tag);
        const matchingTags = tags.filter((tag) => this.props.matchingTagIds.indexOf(tag.id) >= 0);
        const otherTags = tags
            .filter((tag) => this.props.matchingTagIds.indexOf(tag.id) < 0)
            .sort((t1: JannaTag, t2: JannaTag) => {
                if (t1.tagType === t2.tagType) {
                    return t1.value.localeCompare(t2.value);
                } else {
                    const i1 = TagTypes.indexOf(t1.tagType);
                    const i2 = TagTypes.indexOf(t2.tagType);
                    return i1 - i2;
                }
            });
        return (
            <div key={'gallery' + this.props.gallery.id} className='search-result-row gallery-row' onClick={this.onClick}>
                <img className='cover-image' src={coverSource} />
                <div className='tag-info-container'>
                    {matchingTags.map((matchingTag) => this.renderTagPill(matchingTag, true))}
                    {otherTags.map((otherTag) => this.renderTagPill(otherTag, false))}
                </div>
            </div>
        );
    }

    private renderEmptyRow = (id :string, message: string) => {
        return (
            <div key={'message'+id} className='search-result-row empty-row'>
                <div className='cover-empty' />
                <span className='unselectable text'>{message}</span>
            </div>
        );
    }

    private renderLoader() {
        return (
            <div key={'gallery' + this.props.gallery.id} className='search-result-row gallery-row loading' onClick={this.onClick}>
                <Spinner intent={Intent.PRIMARY}/>
            </div>
        );
    }

    private renderTagPill(tag: JannaTag, isMatching: boolean) {
        const classes = classNames({
            ['tag-pill']: true,
            ['matching']: isMatching,
        });
        return (
            <div key={'tag' + tag.id} className={classes}>
                <span className='unselectable text'>{tag.value}</span>
            </div>
        );
    }

    private onClick = () => {
        this.props.dispatchers.navigation.setRoute(NavRoutes.root._, NavRoutes.root.gallery, { id: this.props.gallery.id });
    };
}