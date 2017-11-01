import * as React from 'react';
import { Dispatchers } from '../../redux/dispatchers';
import { JannaTag } from '../../redux/model/types';
import { NavRoutes } from '../../redux/navigation/types';
import { ContextMenuTarget, Menu, MenuItem } from '@blueprintjs/core';
import { removeTag } from '../../redux/model/actions';

interface Props {
    galleryId: string;
    tag: JannaTag;
    dispatchers: Dispatchers;
    tagSize: number;
}

@ContextMenuTarget
export class GalleryTag extends React.PureComponent<Props, {}>{
    public render() {
        const onClick = () => this.props.dispatchers.navigation.setRoute(
            NavRoutes.root._,
            NavRoutes.root.tag,
            {
                id: this.props.tag.id,
                page: 0,
            }
        );
        
        return (
            <div className='tag-pill' onClick={onClick}>
                <span className='unselectable text'>{this.props.tag.value} ({this.props.tagSize})</span>
            </div>
        );
    }

    public renderContextMenu() {
        return (
            <Menu>
                <MenuItem onClick={this.onDelete} text='Remove' iconName='cross'/>
            </Menu>
        );
    }

    private onDelete = () => {
        this.props.dispatchers.tag.removeTag(this.props.tag.id, this.props.galleryId);
    }
}