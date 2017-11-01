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
import { Paginator } from './Paginator';
import { GalleryRow } from './GalleryRow';
import { GalleryCacheState } from '../../redux/galleryCache/types';

interface Props {
    currentPage: number;
    onGotoPage: (page: number) => void;
    headerText: string;
    results: SearchResult[];
    rootDirectory: string;
    janna: JannaState;
    galleryCache: GalleryCacheState;
    dispatchers: Dispatchers;
}

const PAGE_SIZE = 8;

export class ObjectListView extends React.PureComponent<Props, {}> {

    public render() {
        const totalPages = Math.ceil(this.props.results.length / PAGE_SIZE);
        const pageResults = this.props.results.slice(
            this.props.currentPage * PAGE_SIZE,
            Math.min((this.props.currentPage + 1) * PAGE_SIZE, this.props.results.length));
        return (
            <div className='result-table-container'>
                <div className='result-table-header'>
                    <Paginator
                        currentPage={this.props.currentPage}
                        totalPages={totalPages}
                        onGotoPage={this.props.onGotoPage}
                    />
                    <p>{this.props.headerText}</p>
                </div>
                <div className='result-table'>
                    {pageResults.map(this.renderResultRow)}
                </div>
            </div>
        );
    }

    private renderResultRow = (searchResult: SearchResult) => {
        const object: JannaObject = 
            this.props.janna.galleries.get(searchResult.objectId) ||
            this.props.janna.tags.get(searchResult.objectId);
        if (!object) {
            return this.renderEmptyRow(searchResult.objectId, 'Could not find object ' + searchResult.objectId);
        } else if (isTag(object)) {
            return this.renderTagRow(object);
        } else if (isGallery(object)) {
            return this.renderGalleryRow(object, searchResult.matchingTags);
        }
    }

    private renderTagRow = (tag: JannaTag) => {
        const onClick = () => {
            this.props.dispatchers.navigation.setRoute(
                NavRoutes.root._,
                NavRoutes.root.tag,
                {
                    id: tag.id,
                    page: 0,
                },
            );
        };
        return (
            <div key={'row' + tag.id} className='search-result-row tag-row' onClick={onClick}>
                {this.renderTagCover(tag)}
                <div className='tag-info-container'>
                    <p>{tag.tagType}: {tag.value}</p>
                </div>
            </div>
        );
    }

    private renderTagCover = (tag: JannaTag) => {
        if (tag.cover) {
            const coverDir = ConfigPaths.tagCoverDir(this.props.rootDirectory);
            const source = etn.path.join(coverDir, tag.cover);
            return <img className='cover-image' src={source} />;
        } else {
            return <div className='cover-empty' />;
        }
    }

    private renderGalleryRow = (gallery: JannaGallery, matchingTagIds: string[]) => {
        return (
            <GalleryRow
                janna={this.props.janna}
                galleryCache={this.props.galleryCache}
                gallery={gallery}
                matchingTagIds={matchingTagIds}
                dispatchers={this.props.dispatchers}
                rootDirectory={this.props.rootDirectory}
            />
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
}