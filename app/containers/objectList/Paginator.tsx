import * as React from 'react';
import { Dispatchers } from '../../redux/dispatchers';
import { JannaTag } from '../../redux/model/types';
import { NavRoutes } from '../../redux/navigation/types';
import { ContextMenuTarget, Menu, MenuItem } from '@blueprintjs/core';
import { removeTag } from '../../redux/model/actions';
import * as classNames from 'classnames';

interface Props {
    currentPage: number;
    totalPages: number;
    onGotoPage: (page: number) => void;
}

const DISTANCE_TO_EDGE = 3;
const DISTANCE_TO_INDEX = 4;

export class Paginator extends React.PureComponent<Props, {}> {
    public render() {
        const pages = [];
        for (let i = 0; i < this.props.totalPages; i++) {
            if (
                Math.abs(i - 0) < DISTANCE_TO_EDGE ||
                Math.abs(i - this.props.currentPage) < DISTANCE_TO_INDEX ||
                Math.abs(i - this.props.totalPages) <= DISTANCE_TO_EDGE
            ) {
                pages.push(i);
            }
        }
        return (
            <div className='paginator'>
                <span className='unselectable text page-button' onClick={this.gotoPrevious}>&lt;</span>
                {this.renderPages(pages)}
                <span className='unselectable text page-button' onClick={this.gotoNext}>&gt;</span>
            </div>
        );
    }

    private gotoPrevious = () => {
        if (this.props.currentPage > 0) {
            this.props.onGotoPage(this.props.currentPage - 1);
        }
    }

    private gotoNext = () => {
        if (this.props.currentPage < this.props.totalPages - 1) {
            this.props.onGotoPage(this.props.currentPage + 1);
        }
    }

    private renderPages = (pages: number[]) => {
        const elements: JSX.Element[] = [];
        for (let i = 0; i < pages.length; i++) {
            if (i > 0) {
                const previousPage = pages[i - 1];
                const currentPage = pages[i];
                if (currentPage !== previousPage + 1) {
                    elements.push(<span key={previousPage + '-' + currentPage} className='unselectable text ellipsis'>...</span>);
                }
            }
            elements.push(this.renderPage(pages[i]));
        }
        return elements;
    }

    private renderPage = (page: number) => {
        const onClick = () => {
            this.props.onGotoPage(page);
        }
        const classes = classNames({
            ['unselectable']: true,
            ['text']: true,
            ['page-button']: true,
            ['active']: page === this.props.currentPage,
        });
        return (
            <span
                key={'page' + page}
                className={classes}
                onClick={onClick}
            >
                {page + 1}
            </span>
        );
    }
}